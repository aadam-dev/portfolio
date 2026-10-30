"use client";

import type { MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "./useTheme";

function originOf(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** Small round toggle for the nav. */
export function NavThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={(e) => setTheme(next, originOf(e))}
      aria-label={theme === "dark" ? "Switch to day theme" : "Switch to night theme"}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--line-strong)] text-[var(--ink-2)] hover:text-white hover:bg-white/5 transition-colors"
    >
      {/* Shows the theme you would switch to. Moon until the theme is known (SSR). */}
      {theme === "dark" ? (
        <Sun className="w-3.5 h-3.5" aria-hidden="true" />
      ) : (
        <Moon className="w-3.5 h-3.5" aria-hidden="true" />
      )}
    </button>
  );
}

/** Physical DAY / NIGHT slide switch engraved on the device. */
export function DeviceThemeSwitch() {
  const theme = useTheme();
  const night = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={night}
      aria-label="Night theme"
      onClick={(e) => setTheme(night ? "light" : "dark", originOf(e))}
      className="group flex flex-col items-center gap-1"
    >
      <span className="relative block w-[46px] h-[20px] rounded-full bg-[rgba(0,0,0,0.35)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
        <span
          className={`fk-key absolute top-[2px] left-[2px] w-[22px] h-[16px] rounded-full transition-transform duration-300 ${
            night ? "translate-x-[20px]" : ""
          } ${theme === null ? "opacity-0" : ""}`}
        />
      </span>
      <span className="font-mono text-[8px] tracking-[0.18em] text-[var(--shell-ink)]">
        DAY · NIGHT
      </span>
    </button>
  );
}
