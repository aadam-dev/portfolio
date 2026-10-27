"use client";

import { useSyncExternalStore } from "react";

/**
 * One event stream for every mode on the Field Kit.
 * Each toy writes here; the device log reads from it. Same idea as the
 * real systems: many surfaces, one source of truth.
 */

export type KitSource =
  | "kit"
  | "pos"
  | "laundry"
  | "atelier"
  | "finance"
  | "ledger"
  | "court"
  | "class"
  | "build";

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
/** Running counts per `source.name`, kept for the whole visit (not capped). */
const counts = new Map<string, number>();
const listeners = new Set<() => void>();

export function emit(source: KitSource, name: string, detail: string) {
  events = [{ id: ++seq, at: Date.now(), source, name, detail }, ...events].slice(0, MAX);
  const key = `${source}.${name}`;
  counts.set(key, (counts.get(key) ?? 0) + 1);
  listeners.forEach((l) => l());
}

/** Emit once per page load (boot lines survive remounts). */
const onceKeys = new Set<string>();
export function emitOnce(key: string, source: KitSource, name: string, detail: string) {
  if (onceKeys.has(key)) return;
  onceKeys.add(key);
  emit(source, name, detail);
}

/** Add a quantity to a running tally without emitting a log line. */
export function tally(key: string, n: number) {
  counts.set(key, (counts.get(key) ?? 0) + n);
}

export function count(key: string) {
  return counts.get(key) ?? 0;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

const EMPTY: KitEvent[] = [];

export function useKitEvents() {
  return useSyncExternalStore(
    subscribe,
    () => events,
    () => EMPTY,
  );
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Plain-English lines describing what the visitor did on the kit. */
export function sessionSummary(): string[] {
  const out: string[] = [];
  const sales = count("pos.sale.completed");
  if (sales) out.push(`rang ${plural(sales, "sale")}`);
  const washes = count("laundry.ticket.collected");
  const started = count("laundry.stage.washing");
  if (washes) out.push(`ran ${plural(washes, "laundry ticket")} to collection`);
  else if (started) out.push(`started ${plural(started, "wash cycle")}`);
  const bag = count("atelier.bag.add");
  if (bag) out.push(`put ${plural(bag, "garment")} in the bag`);
  const stress = count("finance.shock.applied");
  if (stress) out.push(`stress-tested a deal with ${plural(stress, "shock")}`);
  const compared = count("finance.quote.compared");
  if (compared) out.push(`compared ${plural(compared, "financing quote")}`);
  const dishes = count("ledger.dishes");
  if (dishes) out.push(`sold ${plural(dishes, "dish", "dishes")} through the BOM`);
  if (count("ledger.count.reconciled") || count("ledger.stock.counted")) out.push("reconciled a stock count");
  const shots = count("court.shot.made") + count("court.shot.missed");
  if (shots) out.push(`${count("court.shot.made")}/${shots} from the field`);
  if (count("court.ball.played")) out.push("bounced the ball on the desk");
  const paths = count("class.pathway.picked");
  if (paths) out.push(`checked ${plural(paths, "exam pathway")}`);
  return out;
}

export const cedi = (n: number) =>
  `GHS ${n.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const clock = (t: number) =>
  new Date(t).toLocaleTimeString("en-GB", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
