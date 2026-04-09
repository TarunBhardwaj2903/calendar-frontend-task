"use client";

import { Sun, Moon, Palette, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCalendarContext } from "@/context/CalendarContext";
import { getThemePalette } from "@/utils/themes";
import type { ThemeName } from "@/types";

/**
 * A compact, visibly interactive button that cycles through theme modes.
 * Seasonal → Light → Dark with hover scaling, background shift, and icons.
 */
export default function ThemeToggle() {
  const { state, dispatch } = useCalendarContext();
  const palette = getThemePalette(state.theme, state.currentMonth.getMonth());

  const themeOrder: ThemeName[] = ["seasonal", "light", "dark"];
  const currentIndex = themeOrder.indexOf(state.theme);

  const cycleTheme = () => {
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    dispatch({ type: "SET_THEME", payload: themeOrder[nextIndex] });
  };

  const icon = {
    light: <Sun className="w-3.5 h-3.5" />,
    dark: <Moon className="w-3.5 h-3.5" />,
    seasonal: <Palette className="w-3.5 h-3.5" />,
  }[state.theme];

  const label = {
    light: "Light",
    dark: "Dark",
    seasonal: palette.name,
  }[state.theme];

  return (
    <motion.button
      onClick={cycleTheme}
      whileHover={{ scale: 1.06, backgroundColor: `${palette.primary}18` }}
      whileTap={{ scale: 0.94 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                 font-semibold border transition-colors duration-200 cursor-pointer"
      style={{
        backgroundColor: `${palette.primary}10`,
        borderColor: `${palette.primary}30`,
        color: palette.text,
      }}
      aria-label={`Current theme: ${label}. Click to switch.`}
      title={`Theme: ${label}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <ChevronRight className="w-3 h-3 opacity-40" />
    </motion.button>
  );
}
