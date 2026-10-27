"use client";

import { useSyncExternalStore } from "react";

/** One shared Accra clock for every device on the page (a single interval). */
const fmt =
  typeof Intl !== "undefined"
    ? new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Accra" })
    : null;

let now = "";
let timer: ReturnType<typeof setInterval> | null = null;
const subs = new Set<() => void>();

function tick() {
  const next = fmt ? fmt.format(new Date()) : "";
  if (next !== now) {
    now = next;
    subs.forEach((s) => s());
  }
}

function subscribe(cb: () => void) {
  subs.add(cb);
  if (!timer) {
    tick();
    timer = setInterval(tick, 10000);
  }
  return () => {
    subs.delete(cb);
    if (!subs.size && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function useAccraClock() {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => "",
  );
}
