"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, X } from "lucide-react";
import { CalendarProvider, useCalendarContext } from "@/context/CalendarContext";
import { getThemePalette } from "@/utils/themes";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MONTH_IMAGES } from "./HeroImage";
import CalendarHeader from "./CalendarHeader";
import HeroImage from "./HeroImage";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import ThemeToggle from "./ThemeToggle";

/**
 * Inner layout component that reads theme from context.
 * Uses a heavily blurred hero image as the page background for atmosphere.
 */
function CalendarLayout() {
  const { state } = useCalendarContext();
  const monthIndex = state.currentMonth.getMonth();
  const palette = getThemePalette(state.theme, monthIndex);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showMobileNotes, setShowMobileNotes] = useState(false);

  const bgImageUrl = MONTH_IMAGES[monthIndex]?.url;

  return (
    <div
      className="min-h-screen transition-colors duration-500 relative"
      style={{ color: palette.text }}
    >
      {/* ── Blurred hero image as page background ──────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Solid color base */}
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{ backgroundColor: palette.background }}
        />
        {/* Blurred, desaturated hero image overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-700 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgImageUrl})`,
            filter: "blur(60px) saturate(0.35) brightness(0.9)",
            opacity: 0.35,
            transform: "scale(1.3)", // prevents white blur edges
          }}
        />
      </div>

      <div className="relative p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* ── Desktop Layout: Two columns ──────────────── */}
          {!isMobile ? (
            <div className="grid grid-cols-[2fr_1fr] gap-6 items-start">
              {/* Left Column: Calendar Card */}
              <div
                className="rounded-2xl border overflow-hidden calendar-card"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)`,
                }}
              >
                {/* Calendar Ring Holes — wall calendar aesthetic */}
                <div className="flex justify-center gap-48 pt-3 pb-1">
                  <div className="w-4 h-4 rounded-full shadow-inner"
                       style={{ backgroundColor: `${palette.border}` ,
                                boxShadow: `inset 0 2px 4px rgba(0,0,0,0.2)` }} />
                  <div className="w-4 h-4 rounded-full shadow-inner"
                       style={{ backgroundColor: `${palette.border}`,
                                boxShadow: `inset 0 2px 4px rgba(0,0,0,0.2)` }} />
                </div>

                {/* Theme Toggle — top right */}
                <div className="flex justify-end px-4 -mt-6">
                  <ThemeToggle />
                </div>

                {/* Header with month navigation */}
                <CalendarHeader />

                {/* Hero Image */}
                <div className="px-4 pb-3">
                  <HeroImage />
                </div>

                {/* Calendar Grid */}
                <CalendarGrid />
              </div>

              {/* Right Column: Notes Panel — top-aligned with calendar card */}
              <div className="sticky top-8" style={{ alignSelf: "start" }}>
                <NotesPanel />
              </div>
            </div>
          ) : (
            /* ── Mobile Layout: Single column ──────────────── */
            <div>
              <div
                className="rounded-2xl border overflow-hidden calendar-card"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)`,
                }}
              >
                {/* Calendar Ring Holes */}
                <div className="flex justify-center gap-32 pt-3 pb-1">
                  <div className="w-3 h-3 rounded-full"
                       style={{ backgroundColor: palette.border,
                                boxShadow: `inset 0 2px 3px rgba(0,0,0,0.2)` }} />
                  <div className="w-3 h-3 rounded-full"
                       style={{ backgroundColor: palette.border,
                                boxShadow: `inset 0 2px 3px rgba(0,0,0,0.2)` }} />
                </div>

                {/* Theme Toggle */}
                <div className="flex justify-end px-3 -mt-4">
                  <ThemeToggle />
                </div>

                {/* Header */}
                <CalendarHeader />

                {/* Hero Image */}
                <div className="px-3 pb-2">
                  <HeroImage />
                </div>

                {/* Calendar Grid */}
                <CalendarGrid />
              </div>

              {/* Floating Notes Button — Mobile */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setShowMobileNotes(true)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl
                           flex items-center justify-center z-40 cursor-pointer"
                style={{
                  backgroundColor: palette.primary,
                  boxShadow: `0 4px 20px ${palette.primary}50`,
                }}
                aria-label="Open notes"
              >
                <StickyNote className="w-6 h-6 text-white" />
              </motion.button>

              {/* Mobile Notes Bottom Sheet */}
              <AnimatePresence>
                {showMobileNotes && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/40 z-40"
                      onClick={() => setShowMobileNotes(false)}
                    />
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className="fixed bottom-0 left-0 right-0 z-50
                                 rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
                      style={{ backgroundColor: palette.surface }}
                    >
                      <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 rounded-full bg-gray-300" />
                      </div>
                      <div className="flex justify-end px-4">
                        <button
                          onClick={() => setShowMobileNotes(false)}
                          className="p-1 rounded-full hover:bg-black/5 cursor-pointer"
                          aria-label="Close notes"
                        >
                          <X className="w-5 h-5" style={{ color: palette.textSecondary }} />
                        </button>
                      </div>
                      <div className="px-4 pb-6">
                        <NotesPanel />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Top-level WallCalendar component.
 * Wraps everything in the CalendarProvider so all children share state.
 */
export default function WallCalendar() {
  return (
    <CalendarProvider>
      <CalendarLayout />
    </CalendarProvider>
  );
}
