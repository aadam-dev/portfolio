"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export type Theme = "light" | "dark";
const KEY = "fk-theme";

function read(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

type VTDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

/** Apply a theme, wiping it in as a circle from the control that changed it. */
export function setTheme(next: Theme, origin?: HTMLElement | null) {
  const root = document.documentElement;
  if (read() === next) return;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // storage blocked: the theme still applies for this visit
  }
  const apply = () => {
    root.dataset.theme = next;
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as VTDocument;

  if (!reduce && doc.startViewTransition) {
    const r = origin?.getBoundingClientRect();
    const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
    const y = r ? r.top + r.height / 2 : 0;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const vt = doc.startViewTransition(apply);
    vt.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
    return;
  }

  if (reduce) {
    apply();
    return;
  }
  root.classList.add("theme-fade");
  apply();
  window.setTimeout(() => root.classList.remove("theme-fade"), 450);
}

export function useTheme(): [Theme, (t: Theme, origin?: HTMLElement | null) => void] {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  return [theme, setTheme];
}

/** Small round toggle for the Nav. */
export function NavThemeToggle({ className = "" }: { className?: string }) {
  const [theme, set] = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={(e) => set(next, e.currentTarget)}
      aria-label={next === "dark" ? "Switch to night mode" : "Switch to day mode"}
      className={`relative inline-grid place-items-center w-9 h-9 rounded-full border border-[var(--line-strong)] text-[var(--ink-2)] hover:text-[var(--foreground)] transition-colors ${className}`}
    >
      <span suppressHydrationWarning className="inline-grid place-items-center">
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </span>
    </button>
  );
}

/** The physical slide switch engraved on the device. */
export function DeviceThemeSwitch() {
  const [theme, set] = useTheme();
  const reduce = useReducedMotion();
  const night = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={night}
      aria-label="Night mode"
      onClick={(e) => set(night ? "light" : "dark", e.currentTarget)}
      className="group inline-flex items-center gap-2 font-mono text-[9.5px] tracking-[0.14em] uppercase text-[var(--ink-3)]"
    >
      <span className={night ? "opacity-50" : ""}>Day</span>
      <span
        className="relative w-[34px] h-[16px] rounded-full"
        style={{
          background: "var(--surface-3)",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
        }}
      >
        <motion.span
          className="absolute top-[2px] left-[2px] w-[14px] h-[12px] rounded-[4px]"
          style={{
            background: "var(--foreground)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
          }}
          initial={false}
          animate={{ x: night ? 16 : 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 600, damping: 32 }}
        />
      </span>
      <span className={night ? "" : "opacity-50"}>Night</span>
    </button>
  );
}
