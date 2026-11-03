"use client";

import { useTheme as useThemePair, type Theme } from "./ThemeSwitch";

// One theme store for the whole site lives in ThemeSwitch; this keeps the desk's simpler API.
export { setTheme, type Theme } from "./ThemeSwitch";

/** The current theme on its own (ThemeSwitch's useTheme also returns the setter). */
export function useTheme(): Theme {
  return useThemePair()[0];
}
