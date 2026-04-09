// ─── Core Data Types ───────────────────────────────────────────────

export interface DateRange {
  start: Date;
  end: Date;
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
  scope: "month" | "date" | "range";
  dateKey: string; // "YYYY-MM" for month, "YYYY-MM-DD" for date, "YYYY-MM-DD_YYYY-MM-DD" for range
}

// ─── Theme Types ───────────────────────────────────────────────────

export type ThemeName = "light" | "dark" | "seasonal";

export interface ThemePalette {
  primary: string;
  primaryLight: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  name: string;
}

// ─── Calendar State ────────────────────────────────────────────────

export interface CalendarState {
  currentMonth: Date;
  selectedRange: DateRange | null;
  notes: Record<string, Note[]>;
  theme: ThemeName;
  selectionMode: "start" | "end";
}

// ─── Reducer Actions ───────────────────────────────────────────────

export type CalendarAction =
  | { type: "NEXT_MONTH" }
  | { type: "PREV_MONTH" }
  | { type: "SELECT_DATE"; payload: Date }
  | { type: "CLEAR_SELECTION" }
  | { type: "ADD_NOTE"; payload: Note }
  | { type: "DELETE_NOTE"; payload: string }
  | { type: "SET_THEME"; payload: ThemeName }
  | { type: "LOAD_NOTES"; payload: Record<string, Note[]> };

// ─── Day Cell Visual State ─────────────────────────────────────────

export type SelectionState = "none" | "start" | "end" | "in-range" | "single";
