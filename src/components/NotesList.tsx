"use client";

import { Trash2, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Note } from "@/types";

interface NotesListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  textColor: string;
  textSecondaryColor: string;
  borderColor: string;
  primaryColor: string;
  showDateContext?: boolean; // when true, shows which date/range each note is attached to
}

/**
 * Renders notes grouped by their date key when in month view (showDateContext=true),
 * or as a flat list for date/range-specific tabs.
 */
export default function NotesList({
  notes,
  onDelete,
  textColor,
  textSecondaryColor,
  borderColor,
  primaryColor,
  showDateContext = false,
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <p
        className="text-sm italic py-6 text-center"
        style={{ color: textSecondaryColor }}
      >
        No notes yet. Add one below!
      </p>
    );
  }

  // Group notes by dateKey when showing date context (month tab)
  if (showDateContext) {
    const grouped = groupNotesByDate(notes);
    return (
      <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
        {grouped.map(({ dateLabel, scope, notes: groupNotes }) => (
          <div key={dateLabel}>
            {/* Date group header */}
            <div
              className="flex items-center gap-1.5 mb-1.5 px-1"
              style={{ color: primaryColor }}
            >
              <CalendarDays className="w-3 h-3" />
              <span className="text-[11px] font-bold uppercase tracking-wide">
                {scope === "month" ? "General" : dateLabel}
              </span>
            </div>
            <AnimatePresence>
              {groupNotes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onDelete={onDelete}
                  textColor={textColor}
                  textSecondaryColor={textSecondaryColor}
                  borderColor={borderColor}
                />
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    );
  }

  // Flat list for date/range-specific views
  return (
    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
      <AnimatePresence>
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onDelete={onDelete}
            textColor={textColor}
            textSecondaryColor={textSecondaryColor}
            borderColor={borderColor}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Single note item with animated mount/unmount */
function NoteItem({
  note,
  onDelete,
  textColor,
  textSecondaryColor,
  borderColor,
}: {
  note: Note;
  onDelete: (id: string) => void;
  textColor: string;
  textSecondaryColor: string;
  borderColor: string;
}) {
  return (
    <motion.div
      key={note.id}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="group flex items-start gap-2 p-2.5 rounded-lg border mb-1.5"
      style={{ borderColor }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed" style={{ color: textColor }}>
          {note.text}
        </p>
        <p className="text-[11px] mt-1" style={{ color: textSecondaryColor }}>
          {formatTimestamp(note.createdAt)}
        </p>
      </div>
      <button
        onClick={() => onDelete(note.id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded
                   hover:bg-red-100 dark:hover:bg-red-900/30
                   transition-all duration-200 shrink-0 cursor-pointer"
        aria-label="Delete note"
      >
        <Trash2 className="w-3.5 h-3.5 text-red-500" />
      </button>
    </motion.div>
  );
}

/** Group notes by their dateKey, with a human-readable label. */
function groupNotesByDate(notes: Note[]) {
  const map = new Map<string, { dateLabel: string; scope: Note["scope"]; notes: Note[] }>();

  for (const note of notes) {
    if (!map.has(note.dateKey)) {
      map.set(note.dateKey, {
        dateLabel: formatDateKey(note.dateKey, note.scope),
        scope: note.scope,
        notes: [],
      });
    }
    map.get(note.dateKey)!.notes.push(note);
  }

  return Array.from(map.values());
}

/** Convert a dateKey like "2026-04-15" or "2026-04" to a readable label. */
function formatDateKey(dateKey: string, scope: Note["scope"]): string {
  try {
    if (scope === "month") return "General";
    if (scope === "range") {
      const [startStr, endStr] = dateKey.split("_");
      const start = new Date(startStr + "T00:00");
      const end = new Date(endStr + "T00:00");
      return `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${end.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
    }
    const d = new Date(dateKey + "T00:00");
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  } catch {
    return dateKey;
  }
}

function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
