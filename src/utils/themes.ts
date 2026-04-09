import type { ThemePalette } from "@/types";

/**
 * Seasonal color palettes — one per month.
 * All textSecondary values are tuned to pass WCAG AA (4.5:1) against white surface.
 */
export const MONTH_THEMES: Record<number, ThemePalette> = {
  0: {
    primary: "#3B7FC5",
    primaryLight: "#D6E8F7",
    accent: "#E8F1FA",
    background: "#F5F8FC",
    surface: "#FFFFFF",
    text: "#12202E",
    textSecondary: "#3E5568",
    border: "#C0D0E0",
    name: "Winter Blue",
  },
  1: {
    primary: "#C0484A",
    primaryLight: "#F8D7D7",
    accent: "#FFF0EE",
    background: "#FDF5F4",
    surface: "#FFFFFF",
    text: "#2E1010",
    textSecondary: "#6E3838",
    border: "#E0C0C0",
    name: "Valentine Rose",
  },
  2: {
    primary: "#3A8E3A",
    primaryLight: "#D4F0D4",
    accent: "#EEF8EE",
    background: "#F4FDF4",
    surface: "#FFFFFF",
    text: "#102E10",
    textSecondary: "#38663A",
    border: "#B0D0B0",
    name: "Spring Green",
  },
  3: {
    primary: "#8A5CB0",
    primaryLight: "#E8D8F4",
    accent: "#F4EEF8",
    background: "#F8F4FC",
    surface: "#FFFFFF",
    text: "#201030",
    textSecondary: "#584070",
    border: "#C8B0D8",
    name: "Lavender Bloom",
  },
  4: {
    primary: "#B88020",
    primaryLight: "#F4E0B8",
    accent: "#FDF6E8",
    background: "#FDFAF2",
    surface: "#FFFFFF",
    text: "#302008",
    textSecondary: "#685020",
    border: "#D8C498",
    name: "Golden May",
  },
  5: {
    primary: "#2898B0",
    primaryLight: "#C8E8F0",
    accent: "#E8F6FA",
    background: "#F2FAFC",
    surface: "#FFFFFF",
    text: "#082028",
    textSecondary: "#2E5862",
    border: "#98C8D4",
    name: "Ocean Breeze",
  },
  6: {
    primary: "#C84828",
    primaryLight: "#F0C8BC",
    accent: "#FDF0EC",
    background: "#FDF6F4",
    surface: "#FFFFFF",
    text: "#301008",
    textSecondary: "#6E3828",
    border: "#D8B0A0",
    name: "Summer Sunset",
  },
  7: {
    primary: "#28885A",
    primaryLight: "#B8E0D0",
    accent: "#E8F6F0",
    background: "#F2FCF8",
    surface: "#FFFFFF",
    text: "#082818",
    textSecondary: "#2E6048",
    border: "#98C8B0",
    name: "Tropical Green",
  },
  8: {
    primary: "#B07030",
    primaryLight: "#F0DCC0",
    accent: "#FAF4E8",
    background: "#FCF8F2",
    surface: "#FFFFFF",
    text: "#281808",
    textSecondary: "#685028",
    border: "#D0B888",
    name: "Autumn Gold",
  },
  9: {
    primary: "#B85828",
    primaryLight: "#F0C8B0",
    accent: "#FAF0E8",
    background: "#FCF6F2",
    surface: "#FFFFFF",
    text: "#281008",
    textSecondary: "#684028",
    border: "#D0A888",
    name: "October Ember",
  },
  10: {
    primary: "#885020",
    primaryLight: "#D8C0A0",
    accent: "#F4ECE0",
    background: "#FAF6F0",
    surface: "#FFFFFF",
    text: "#201008",
    textSecondary: "#584020",
    border: "#C0A880",
    name: "Rustic Brown",
  },
  11: {
    primary: "#B03030",
    primaryLight: "#F0C0C0",
    accent: "#FAE8E8",
    background: "#FCF2F2",
    surface: "#FFFFFF",
    text: "#280808",
    textSecondary: "#683030",
    border: "#D09898",
    name: "Festive Red",
  },
};

/**
 * Light theme
 */
export const LIGHT_THEME: ThemePalette = {
  primary: "#3A6A5C",
  primaryLight: "#C8DED8",
  accent: "#E8F2EE",
  background: "#F8FAF9",
  surface: "#FFFFFF",
  text: "#141E1A",
  textSecondary: "#3D5048",
  border: "#C0D4CC",
  name: "Light",
};

/**
 * Dark theme
 */
export const DARK_THEME: ThemePalette = {
  primary: "#6AAFB8",
  primaryLight: "#2A3F42",
  accent: "#1A2A2C",
  background: "#0F1A1C",
  surface: "#1A2830",
  text: "#E0EEF0",
  textSecondary: "#90A8AC",
  border: "#2A3C40",
  name: "Dark",
};

/**
 * Get the active theme palette based on theme name and current month.
 */
export function getThemePalette(
  theme: "light" | "dark" | "seasonal",
  monthIndex: number
): ThemePalette {
  switch (theme) {
    case "light":
      return LIGHT_THEME;
    case "dark":
      return DARK_THEME;
    case "seasonal":
      return MONTH_THEMES[monthIndex] || LIGHT_THEME;
  }
}
