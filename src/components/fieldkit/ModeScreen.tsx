"use client";

import dynamic from "next/dynamic";
import type { ModeId } from "./chapters";

const Loading = () => (
  <div className="h-full grid place-items-center font-mono text-[10px] tracking-[0.18em] uppercase text-white/30">
    loading module…
  </div>
);

const load = {
  counter: () => import("./modes/CounterMode"),
  laundry: () => import("./modes/LaundryMode"),
  atelier: () => import("./modes/AtelierMode"),
  analyst: () => import("./modes/AnalystMode"),
  ledger: () => import("./modes/LedgerMode"),
  court: () => import("./modes/CourtMode"),
  classroom: () => import("./modes/ClassroomMode"),
  build: () => import("./modes/BuildMode"),
};

const Counter = dynamic(load.counter, { ssr: false, loading: Loading });
const Laundry = dynamic(load.laundry, { ssr: false, loading: Loading });
const Atelier = dynamic(load.atelier, { ssr: false, loading: Loading });
const Analyst = dynamic(load.analyst, { ssr: false, loading: Loading });
const Ledger = dynamic(load.ledger, { ssr: false, loading: Loading });
const Court = dynamic(load.court, { ssr: false, loading: Loading });
const Classroom = dynamic(load.classroom, { ssr: false, loading: Loading });
const Build = dynamic(load.build, { ssr: false, loading: Loading });

/**
 * Warm every mode's code and its real-item images while the page is idle,
 * so a device swap mid-scroll only has to render, not fetch and parse.
 */
let warmed = false;
export function warmModes(images: string[]) {
  if (warmed || typeof window === "undefined") return;
  warmed = true;
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  const idle = (cb: () => void) => (w.requestIdleCallback ? w.requestIdleCallback(cb, { timeout: 4000 }) : setTimeout(cb, 1500));
  const queue = [...Object.values(load), ...images.map((src) => () => {
    const im = new window.Image();
    im.decoding = "async";
    im.src = src;
    return im.decode().catch(() => {});
  })];
  const step = () => {
    const next = queue.shift();
    if (!next) return;
    Promise.resolve(next()).finally(() => idle(step));
  };
  idle(step);
}

export default function ModeScreen({ mode }: { mode: ModeId }) {
  switch (mode) {
    case "counter":
      return <Counter />;
    case "laundry":
      return <Laundry />;
    case "atelier":
      return <Atelier />;
    case "analyst":
      return <Analyst />;
    case "ledger":
      return <Ledger />;
    case "court":
      return <Court />;
    case "classroom":
      return <Classroom />;
    case "build":
      return <Build />;
  }
}
