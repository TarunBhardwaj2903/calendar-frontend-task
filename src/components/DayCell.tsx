"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import type { SelectionState } from "@/types";
import HolidayBadge from "./HolidayBadge";

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  selectionState: SelectionState;
  holidayName: string | null;
  hasNote: boolean;
  primaryColor: string;
  primaryLightColor: string;
  onClick: () => void;
}

// Spring physics for the selection circle pop-in
const selectionSpring = { type: "spring" as const, stiffness: 400, damping: 25 };

/**
 * Individual day cell with animated selection circles,
 * hover micro-interactions, and visual indicators for holidays/notes.
 */
export default function DayCell({
  date,
  isCurrentMonth,
  isToday,
  selectionState,
  holidayName,
  hasNote,
  primaryColor,
  primaryLightColor,
  onClick,
}: DayCellProps) {
  const day = date.getDate();

  const isSelected = selectionState !== "none";
  const isEndpoint = selectionState === "start" || selectionState === "end" || selectionState === "single";

  return (
    <motion.button
      whileHover={{ scale: isCurrentMonth ? 1.08 : 1 }}
      whileTap={{ scale: isCurrentMonth ? 0.93 : 1 }}
      onClick={onClick}
      disabled={!isCurrentMonth}
      className={`
        relative flex flex-col items-center justify-center
        min-h-[44px] py-1
        ${isCurrentMonth ? "cursor-pointer" : "cursor-default opacity-30"}
      `}
      style={
        isSelected && !isEndpoint
          ? { backgroundColor: primaryLightColor }
          : undefined
      }
      aria-label={`${date.toDateString()}${holidayName ? `, ${holidayName}` : ""}${hasNote ? ", has notes" : ""}`}
    >
      {/* Range band backgrounds for start/end cells */}
      {selectionState === "start" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-y-0 right-0 w-1/2"
          style={{ backgroundColor: primaryLightColor }}
        />
      )}
      {selectionState === "end" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-y-0 left-0 w-1/2"
          style={{ backgroundColor: primaryLightColor }}
        />
      )}

      {/* Day number with animated selection circle */}
      <div className="relative z-10 flex items-center justify-center w-9 h-9">
        {/* Animated selection circle — pops in with spring physics */}
        <AnimatePresence>
          {isEndpoint && (
            <motion.div
              key="selection-circle"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={selectionSpring}
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 2px 8px ${primaryColor}40`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Today ring */}
        {isToday && !isEndpoint && (
          <div
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: `inset 0 0 0 2px ${primaryColor}` }}
          />
        )}

        {/* Day number text */}
        <span
          className={`
            relative z-10 text-sm font-medium leading-none
            ${isEndpoint ? "text-white font-semibold" : ""}
            ${isToday && !isEndpoint ? "font-semibold" : ""}
          `}
        >
          {day}
        </span>
      </div>

      {/* Bottom indicators row */}
      <div className="flex items-center gap-0.5 h-3 relative z-10">
        {holidayName && (
          <HolidayBadge name={holidayName} primaryColor={primaryColor} />
        )}
        {hasNote && (
          <Pencil className="w-2.5 h-2.5 opacity-50" />
        )}
      </div>
    </motion.button>
  );
}
