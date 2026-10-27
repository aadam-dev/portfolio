"use client";

export type Tier = "high" | "low" | "still";

/** Pick how much of the desk this device should run. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "still";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "still";
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    if (!gl) return "still";
  } catch {
    return "still";
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 900;
  if (coarse || small || cores <= 4 || mem <= 4) return "low";
  return "high";
}
