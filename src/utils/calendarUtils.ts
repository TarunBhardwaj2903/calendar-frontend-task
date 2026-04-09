import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  format,
} from "date-fns";
import type { DateRange, SelectionState } from "@/types";

/**
 * Generate a flat array of dates for the calendar grid.
 * Always returns complete weeks (35 or 42 days) so the grid fills evenly.
 */
export function generateCalendarGrid(month: Date): Date[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

/**
 * Determine the visual selection state of a given date
 * relative to the currently selected range.
 */
export function getSelectionState(
  date: Date,
  range: DateRange | null
): SelectionState {
  if (!range) return "none";

  const isStart = isSameDay(date, range.start);
  const isEnd = isSameDay(date, range.end);

  if (isStart && isEnd) return "single";
  if (isStart) return "start";
  if (isEnd) return "end";

  if (isWithinInterval(date, { start: range.start, end: range.end })) {
    return "in-range";
  }

  return "none";
}

/**
 * Format a date key for month-scoped notes: "2026-04"
 */
export function getMonthKey(date: Date): string {
  return format(date, "yyyy-MM");
}

/**
 * Format a date key for date-scoped notes: "2026-04-15"
 */
export function getDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Format a date key for range-scoped notes: "2026-04-10_2026-04-18"
 */
export function getRangeKey(range: DateRange): string {
  return `${format(range.start, "yyyy-MM-dd")}_${format(range.end, "yyyy-MM-dd")}`;
}

/**
 * Weekday labels for the grid header
 */
export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAY_LABELS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
