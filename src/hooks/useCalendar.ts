"use client";

import { useMemo } from "react";
import { isSameMonth, isToday } from "date-fns";
import { useCalendarContext } from "@/context/CalendarContext";
import {
  generateCalendarGrid,
  getSelectionState,
  getDateKey,
} from "@/utils/calendarUtils";
import { getHolidayName } from "@/utils/holidays";
import type { SelectionState } from "@/types";

export interface DayCellData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  selectionState: SelectionState;
  holidayName: string | null;
  hasNote: boolean;
}

/**
 * Hook that computes all the data needed to render the calendar grid.
 * Memoized so it only recalculates when the month, selection, or notes change.
 */
export function useCalendar(): DayCellData[] {
  const { state } = useCalendarContext();
  const { currentMonth, selectedRange, notes } = state;

  return useMemo(() => {
    const days = generateCalendarGrid(currentMonth);

    return days.map((date) => ({
      date,
      isCurrentMonth: isSameMonth(date, currentMonth),
      isToday: isToday(date),
      selectionState: getSelectionState(date, selectedRange),
      holidayName: getHolidayName(date),
      hasNote: (notes[getDateKey(date)] || []).length > 0,
    }));
  }, [currentMonth, selectedRange, notes]);
}
