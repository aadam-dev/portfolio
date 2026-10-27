"use client";

import { useSyncExternalStore } from "react";

/**
 * One event stream for every mode on the Field Kit.
 * Each toy writes here; the device log reads from it. Same idea as the
 * real systems: many surfaces, one source of truth.
 */

export type KitSource = "pos" | "laundry" | "finance" | "court" | "kit";

export interface KitEvent {
  id: number;
  at: number;
  source: KitSource;
  name: string;
  detail: string;
}

const MAX = 24;
let seq = 0;
let events: KitEvent[] = [];
const listeners = new Set<() => void>();

export function emit(source: KitSource, name: string, detail: string) {
  events = [{ id: ++seq, at: Date.now(), source, name, detail }, ...events].slice(0, MAX);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const EMPTY: KitEvent[] = [];

export function useKitEvents() {
  return useSyncExternalStore(
    subscribe,
    () => events,
    () => EMPTY,
  );
}

export const cedi = (n: number) =>
  `GHS ${n.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
