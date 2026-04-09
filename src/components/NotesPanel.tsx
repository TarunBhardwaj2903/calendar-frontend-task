"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { FileText, Calendar, CalendarRange, X } from "lucide-react";
import { useCalendarContext } from "@/context/CalendarContext";
import { getThemePalette } from "@/utils/themes";
import { getMonthKey, getDateKey, getRangeKey } from "@/utils/calendarUtils";
import NoteEditor from "./NoteEditor";
import NotesList from "./NotesList";
import type { Note } from "@/types";

type NotesTab = "month" | "date" | "range";

/**
 * Notes panel with three tabs: Month (all notes for the month, grouped by date),
 * Date (single-date notes), and Range (range-specific notes).
 */
export default function NotesPanel() {
  const { state, dispatch } = useCalendarContext();
  const { currentMonth, selectedRange, notes, theme } = state;
  const palette = getThemePalette(theme, currentMonth.getMonth());

  const [activeTab, setActiveTab] = useState<NotesTab>("month");

  const monthKey = getMonthKey(currentMonth);

  const hasDateSelection =
    selectedRange && isSameDay(selectedRange.start, selectedRange.end);
  const hasRangeSelection =
    selectedRange && !isSameDay(selectedRange.start, selectedRange.end);

  const dateKey = selectedRange ? getDateKey(selectedRange.start) : null;
  const rangeKey = selectedRange ? getRangeKey(selectedRange) : null;

  // Get notes for the active tab
  const getActiveNotes = (): Note[] => {
    switch (activeTab) {
      case "month": {
        // Aggregate ALL notes whose dateKey belongs to this month
        const prefix = monthKey; // "YYYY-MM"
        const allMonthNotes: Note[] = [];
        for (const [key, noteList] of Object.entries(notes)) {
          if (key === prefix || key.startsWith(prefix + "-") || key.startsWith(prefix + "-")) {
            // Matches "2026-04", "2026-04-15", "2026-04-10_2026-04-18"
            allMonthNotes.push(...noteList);
          }
        }
        // Sort by creation time, newest first
        return allMonthNotes.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      case "date":
        return dateKey ? notes[dateKey] || [] : [];
      case "range":
        return rangeKey ? notes[rangeKey] || [] : [];
      default:
        return [];
    }
  };

  const handleAddNote = (text: string) => {
    let scope: Note["scope"];
    let key: string;

    switch (activeTab) {
      case "date":
        if (!dateKey) return;
        scope = "date";
        key = dateKey;
        break;
      case "range":
        if (!rangeKey) return;
        scope = "range";
        key = rangeKey;
        break;
      default:
        scope = "month";
        key = monthKey;
    }

    const newNote: Note = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
      scope,
      dateKey: key,
    };

    dispatch({ type: "ADD_NOTE", payload: newNote });
  };

  const handleDeleteNote = (id: string) => {
    dispatch({ type: "DELETE_NOTE", payload: id });
  };

  // Tab config
  const tabs: { key: NotesTab; label: string; icon: React.ReactNode; disabled: boolean }[] = [
    {
      key: "month",
      label: format(currentMonth, "MMM yyyy"),
      icon: <FileText className="w-3.5 h-3.5" />,
      disabled: false,
    },
    {
      key: "date",
      label: hasDateSelection
        ? format(selectedRange!.start, "MMM d")
        : "Date",
      icon: <Calendar className="w-3.5 h-3.5" />,
      disabled: !hasDateSelection,
    },
    {
      key: "range",
      label: hasRangeSelection
        ? `${format(selectedRange!.start, "MMM d")} – ${format(selectedRange!.end, "MMM d")}`
        : "Range",
      icon: <CalendarRange className="w-3.5 h-3.5" />,
      disabled: !hasRangeSelection,
    },
  ];

  const getPlaceholder = (): string => {
    switch (activeTab) {
      case "month":
        return `Note for ${format(currentMonth, "MMMM yyyy")}...`;
      case "date":
        return dateKey
          ? `Note for ${format(selectedRange!.start, "MMMM d, yyyy")}...`
          : "Select a date first";
      case "range":
        return rangeKey
          ? `Note for ${format(selectedRange!.start, "MMM d")} – ${format(selectedRange!.end, "MMM d")}...`
          : "Select a date range first";
    }
  };

  const isEditorDisabled =
    (activeTab === "date" && !hasDateSelection) ||
    (activeTab === "range" && !hasRangeSelection);

  return (
    <div
      className="flex flex-col h-full rounded-xl border p-4"
      style={{
        backgroundColor: palette.surface,
        borderColor: palette.border,
        color: palette.text,
        boxShadow: `0 4px 16px rgba(0,0,0,0.06)`,
      }}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif font-semibold text-lg">Notes</h3>
        {selectedRange && (
          <button
            onClick={() => dispatch({ type: "CLEAR_SELECTION" })}
            className="text-xs flex items-center gap-1 px-2 py-1 rounded-md
                       hover:bg-black/5 transition-colors cursor-pointer"
            style={{ color: palette.textSecondary }}
          >
            <X className="w-3 h-3" />
            Clear selection
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: palette.border }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => !tab.disabled && setActiveTab(tab.key)}
            disabled={tab.disabled}
            className={`
              flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
              border-b-2 transition-all duration-200 -mb-px cursor-pointer
              ${tab.disabled ? "opacity-40 cursor-not-allowed" : "hover:opacity-80"}
            `}
            style={{
              borderBottomColor:
                activeTab === tab.key ? palette.primary : "transparent",
              color:
                activeTab === tab.key ? palette.primary : palette.textSecondary,
            }}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto mb-3">
        <NotesList
          notes={getActiveNotes()}
          onDelete={handleDeleteNote}
          textColor={palette.text}
          textSecondaryColor={palette.textSecondary}
          borderColor={palette.border}
          primaryColor={palette.primary}
          showDateContext={activeTab === "month"}
        />
      </div>

      {/* Note Editor */}
      {!isEditorDisabled && (
        <NoteEditor
          onSave={handleAddNote}
          primaryColor={palette.primary}
          placeholder={getPlaceholder()}
        />
      )}

      {/* Helper text when no selection for date/range tabs */}
      {isEditorDisabled && (
        <p
          className="text-xs text-center py-2 italic"
          style={{ color: palette.textSecondary }}
        >
          {activeTab === "date"
            ? "Click a single date on the calendar to add date-specific notes."
            : "Select a start and end date on the calendar to add range notes."}
        </p>
      )}
    </div>
  );
}
