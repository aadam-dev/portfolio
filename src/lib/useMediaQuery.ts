"use client";

import { useSyncExternalStore } from "react";

/** A CSS media query's state; null during server render, before the browser can answer. */
export function useMediaQuery(q: string): boolean | null {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(q);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(q).matches,
    () => null,
  );
}
