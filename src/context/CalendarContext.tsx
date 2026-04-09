"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { addMonths, subMonths, isSameDay, startOfMonth } from "date-fns";
import type {
  CalendarState,
  CalendarAction,
  Note,
  ThemeName,
} from "@/types";

// ─── Initial State ─────────────────────────────────────────────────

const initialState: CalendarState = {
  currentMonth: startOfMonth(new Date()),
  selectedRange: null,
  notes: {},
  theme: "seasonal",
  selectionMode: "start",
};

// ─── Reducer ───────────────────────────────────────────────────────

function calendarReducer(
  state: CalendarState,
  action: CalendarAction
): CalendarState {
  switch (action.type) {
    case "NEXT_MONTH":
      return {
        ...state,
        currentMonth: addMonths(state.currentMonth, 1),
        selectedRange: null,
        selectionMode: "start",
      };

    case "PREV_MONTH":
      return {
        ...state,
        currentMonth: subMonths(state.currentMonth, 1),
        selectedRange: null,
        selectionMode: "start",
      };

    case "SELECT_DATE": {
      const clicked = action.payload;

      // If we already have a complete selection and user clicks start/end, clear it
      if (state.selectedRange && state.selectionMode === "start") {
        if (
          isSameDay(clicked, state.selectedRange.start) ||
          isSameDay(clicked, state.selectedRange.end)
        ) {
          return {
            ...state,
            selectedRange: null,
            selectionMode: "start",
          };
        }
      }

      // First click — set start date
      if (state.selectionMode === "start") {
        return {
          ...state,
          selectedRange: { start: clicked, end: clicked },
          selectionMode: "end",
        };
      }

      // Second click — set end date
      const start = state.selectedRange!.start;

      // Auto-swap if user clicked before the start date
      if (clicked < start) {
        return {
          ...state,
          selectedRange: { start: clicked, end: start },
          selectionMode: "start",
        };
      }

      return {
        ...state,
        selectedRange: { start, end: clicked },
        selectionMode: "start",
      };
    }

    case "CLEAR_SELECTION":
      return {
        ...state,
        selectedRange: null,
        selectionMode: "start",
      };

    case "ADD_NOTE": {
      const note = action.payload;
      const existing = state.notes[note.dateKey] || [];
      return {
        ...state,
        notes: {
          ...state.notes,
          [note.dateKey]: [...existing, note],
        },
      };
    }

    case "DELETE_NOTE": {
      const noteId = action.payload;
      const updated: Record<string, Note[]> = {};

      for (const [key, notes] of Object.entries(state.notes)) {
        const filtered = notes.filter((n) => n.id !== noteId);
        if (filtered.length > 0) {
          updated[key] = filtered;
        }
      }

      return { ...state, notes: updated };
    }

    case "SET_THEME":
      return { ...state, theme: action.payload };

    case "LOAD_NOTES":
      return { ...state, notes: action.payload };

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────

interface CalendarContextValue {
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  // Load saved notes and theme from localStorage on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("wall-calendar-notes");
      if (savedNotes) {
        dispatch({ type: "LOAD_NOTES", payload: JSON.parse(savedNotes) });
      }

      const savedTheme = localStorage.getItem(
        "wall-calendar-theme"
      ) as ThemeName | null;
      if (savedTheme) {
        dispatch({ type: "SET_THEME", payload: savedTheme });
      }
    } catch {
      // localStorage unavailable or corrupted — use defaults
    }
  }, []);

  // Persist notes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "wall-calendar-notes",
        JSON.stringify(state.notes)
      );
    } catch {
      // localStorage full or unavailable
    }
  }, [state.notes]);

  // Persist theme preference
  useEffect(() => {
    try {
      localStorage.setItem("wall-calendar-theme", state.theme);
    } catch {
      // localStorage unavailable
    }
  }, [state.theme]);

  return (
    <CalendarContext.Provider value={{ state, dispatch }}>
      {children}
    </CalendarContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider"
    );
  }
  return context;
}
