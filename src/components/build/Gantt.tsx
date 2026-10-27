"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DISCOVERY, TRACK_TONE, fmtW, type Lane } from "@/lib/brief";

/** The project board: one lane per track, weeks across, discovery first. */
export default function Gantt({ lanes, weeks, dark = true, still = false }: { lanes: Lane[]; weeks: number; dark?: boolean; still?: boolean }) {
  const reduce = useReducedMotion() || still;
  const span = Math.max(Math.ceil(weeks), 8);
  const pct = (w: number) => `${(w / span) * 100}%`;
  const ink = dark ? "rgba(255,255,255," : "rgba(18,17,16,";

  return (
    <div className="w-full" role="img" aria-label={`Project plan over ${fmtW(weeks || 0)}`}>
      <div className="grid grid-cols-[52px_minmax(0,1fr)] gap-2">
        <span />
        <div className="relative h-4">
          {Array.from({ length: span }, (_, i) => (
            <span
              key={i}
              className="absolute top-0 font-mono text-[9.5px] -translate-x-1/2"
              style={{ left: pct(i + 0.5), color: `${ink}0.4)` }}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-1 space-y-1.5">
        {lanes.map((l) => (
          <div key={l.track} className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: `${ink}0.5)` }}>
              {l.track}
            </span>
            <div className="relative h-7 rounded-md overflow-hidden" style={{ background: `${ink}0.04)` }}>
              {/* week grid */}
              {Array.from({ length: span - 1 }, (_, i) => (
                <span key={i} className="absolute top-0 bottom-0 w-px" style={{ left: pct(i + 1), background: `${ink}0.06)` }} />
              ))}
              <span
                className="absolute top-1 bottom-1 left-0 rounded-[4px] grid place-items-center font-mono text-[9px]"
                style={{ width: pct(DISCOVERY), background: `${ink}0.12)`, color: `${ink}0.55)` }}
                title="Discovery"
              >
                Map
              </span>
              {l.segs.map((s) => (
                <motion.span
                  key={s.id}
                  className="absolute top-1 bottom-1 rounded-[4px] px-1.5 flex items-center overflow-hidden"
                  style={{ background: TRACK_TONE[l.track], originX: 0 }}
                  initial={reduce ? false : { opacity: 0, scaleX: 0.2 }}
                  animate={{ opacity: 1, scaleX: 1, left: `calc(${pct(s.from)} + 1px)`, width: `calc(${pct(s.weeks)} - 2px)` }}
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }}
                  title={`${s.label}, ${fmtW(s.weeks)}`}
                >
                  <span className="truncate text-[10.5px] font-medium text-[#120d09]">{s.label}</span>
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
