"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { clock, useKitEvents, type KitSource } from "./events";
import { EASE_OUT } from "@/lib/motion";

const TONE: Record<KitSource, string> = {
  kit: "#8a857b",
  pos: "#ff5b1f",
  laundry: "#5fa8d3",
  atelier: "#e07a9a",
  finance: "#e8b23a",
  ledger: "#a78bfa",
  court: "#f59e42",
  class: "#4ade80",
  build: "#ff5b1f",
};

export default function EventLog({ lines = 3 }: { lines?: number }) {
  const events = useKitEvents().slice(0, lines);
  const reduce = useReducedMotion();

  return (
    <div
      className="relative font-mono text-[9.5px] leading-[15px] text-white/55 overflow-hidden"
      style={{ height: lines * 15 }}
      aria-live="polite"
      aria-label="Device event log"
      role="log"
    >
      {events.length === 0 && <div className="text-white/25">waiting for input…</div>}
      <AnimatePresence initial={false}>
        {events.map((e, i) => (
          <motion.div
            key={e.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={{ opacity: i === 0 ? 1 : 0.55 - i * 0.12, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="flex gap-2 whitespace-nowrap"
          >
            <span className="text-white/30 tabular-nums shrink-0">{clock(e.at)}</span>
            <span className="shrink-0" style={{ color: TONE[e.source] }}>
              {e.source}.{e.name}
            </span>
            <span className="truncate text-white/60">{e.detail}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
