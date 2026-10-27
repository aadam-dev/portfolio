"use client";

/**
 * Tiny shared store for "how much of the landing scene has loaded" (0..1).
 * The 3D desk reports into it; the preloader reads it. If nothing reports
 * within a moment, the preloader falls back to its own timer.
 */
let value = 0;
let reporting = false;
const subs = new Set<(v: number) => void>();

export function reportProgress(v: number) {
  reporting = true;
  value = Math.max(value, Math.min(1, v));
  subs.forEach((s) => s(value));
}

export const isReporting = () => reporting;
export const currentProgress = () => value;

export function onProgress(cb: (v: number) => void) {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}
