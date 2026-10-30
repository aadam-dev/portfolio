"use client";

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";

export const THEME_KEY = "fk-theme";

/**
 * Runs in <head> before paint so the stored theme applies with no flash.
 * Day is the default; the stored choice wins.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");document.documentElement.dataset.theme=t==="dark"?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}})();`;

const listeners = new Set<() => void>();

const read = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function apply(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
  listeners.forEach((l) => l());
}

/**
 * Switch theme. Where View Transitions exist the new theme wipes in as a
 * circle from `origin` (the switch); otherwise it changes instantly.
 */
export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  if (read() === next) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void> };
  };
  if (!doc.startViewTransition || reduce) {
    apply(next);
    return;
  }
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const t = doc.startViewTransition(() => flushSync(() => apply(next)));
  t.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
}

/** Current theme; null during server render and hydration. */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
