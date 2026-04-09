"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCalendarContext } from "@/context/CalendarContext";

/**
 * Displays the current month/year and navigation arrows.
 * The month name uses a serif font for that classic wall calendar feel.
 */
export default function CalendarHeader() {
  const { state, dispatch } = useCalendarContext();
  const { currentMonth } = state;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Previous Month Button */}
      <button
        onClick={() => dispatch({ type: "PREV_MONTH" })}
        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10
                   transition-colors duration-200 cursor-pointer"
        aria-label="Previous month"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Month and Year Display */}
      <motion.h2
        key={format(currentMonth, "yyyy-MM")}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xl md:text-2xl font-serif font-bold tracking-wide select-none"
      >
        {format(currentMonth, "MMMM yyyy")}
      </motion.h2>

      {/* Next Month Button */}
      <button
        onClick={() => dispatch({ type: "NEXT_MONTH" })}
        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10
                   transition-colors duration-200 cursor-pointer"
        aria-label="Next month"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
