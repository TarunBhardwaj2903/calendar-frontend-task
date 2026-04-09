"use client";

import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { useCalendarContext } from "@/context/CalendarContext";
import { useCalendar } from "@/hooks/useCalendar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { WEEKDAY_LABELS, WEEKDAY_LABELS_SHORT } from "@/utils/calendarUtils";
import { getThemePalette } from "@/utils/themes";
import DayCell from "./DayCell";

/**
 * The 7-column calendar grid showing all days of the current month.
 * Includes a weekday header row and animated transitions between months.
 */
export default function CalendarGrid() {
  const { state, dispatch } = useCalendarContext();
  const days = useCalendar();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const palette = getThemePalette(
    state.theme,
    state.currentMonth.getMonth()
  );

  const weekdays = isMobile ? WEEKDAY_LABELS_SHORT : WEEKDAY_LABELS;

  return (
    <div className="px-2 md:px-4 pb-4">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 mb-1">
        {weekdays.map((label, i) => (
          <div
            key={i}
            className="text-center text-[11px] font-bold uppercase tracking-[0.15em] py-2.5 select-none"
            style={{ color: palette.text, opacity: 0.55 }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day Cells Grid — animated on month change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={format(state.currentMonth, "yyyy-MM")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-7"
        >
          {days.map((dayData) => (
            <DayCell
              key={dayData.date.toISOString()}
              date={dayData.date}
              isCurrentMonth={dayData.isCurrentMonth}
              isToday={dayData.isToday}
              selectionState={dayData.selectionState}
              holidayName={dayData.holidayName}
              hasNote={dayData.hasNote}
              primaryColor={palette.primary}
              primaryLightColor={palette.primaryLight}
              onClick={() => {
                if (dayData.isCurrentMonth) {
                  dispatch({ type: "SELECT_DATE", payload: dayData.date });
                }
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
