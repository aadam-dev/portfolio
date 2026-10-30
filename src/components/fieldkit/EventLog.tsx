"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useKitEvents } from "./events";
import { EASE_OUT } from "@/lib/motion";

const clock = (t: number) =>
  new Date(t).toLocaleTimeString("en-GB", { hour12: false, timeZone: "Africa/Accra" });

/** The last three events from every mode: many surfaces, one source of truth. */
export default function EventLog({ label, empty }: { label: string; empty: string }) {
  const events = useKitEvents().slice(0, 3);
  const reduce = useReducedMotion();
  return (
    <div className="mt-2.5 pt-2 border-t border-white/[0.07]">
      <div className="flex items-center justify-between font-mono text-[8.5px] uppercase tracking-[0.18em] text-white/30">
        <span>{label}</span>
        <span className="tabular-nums">{events[0] ? `#${String(events[0].id).padStart(4, "0")}` : "#0000"}</span>
      </div>
      <ol role="log" aria-live="polite" className="mt-1 h-[42px] overflow-hidden font-mono text-[10px] leading-[14px]">
        {events.length === 0 && <li className="text-white/30">{empty}</li>}
        <AnimatePresence initial={false}>
          {events.map((e, i) => (
            <motion.li
              key={e.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className={`flex gap-2 whitespace-nowrap ${i === 0 ? "text-white/85" : "text-white/40"}`}
            >
              <span className="text-white/30 tabular-nums">{clock(e.at)}</span>
              <span className={i === 0 ? "text-[var(--accent)]" : ""}>
                {e.source}.{e.name}
              </span>
              <span className="truncate">{e.detail}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </div>
  );
}
