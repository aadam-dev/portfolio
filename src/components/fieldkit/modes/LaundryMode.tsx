"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { emit } from "../events";
import { EASE_OUT } from "@/lib/motion";

const STAGES = ["Received", "Washing", "Drying", "Pressing", "Ready"] as const;
type Stage = (typeof STAGES)[number];

// How long each automatic stage runs once the cycle starts (ms).
const STAGE_MS: Partial<Record<Stage, number>> = { Washing: 3200, Drying: 2400, Pressing: 1600 };

const GARMENTS = [
  { c: "#E8B23A", w: 34, h: 18, a: 0 },
  { c: "#4E7FA8", w: 30, h: 22, a: 72 },
  { c: "#F2EEE6", w: 36, h: 16, a: 144 },
  { c: "#B4552F", w: 26, h: 20, a: 216 },
  { c: "#3F7A5A", w: 32, h: 18, a: 288 },
];

function Drum({ stage, reduce }: { stage: Stage | null; reduce: boolean }) {
  const spinning = stage === "Washing" || stage === "Drying";
  const settled = stage === "Pressing" || stage === "Ready";
  const rotate =
    reduce || !spinning
      ? { rotate: 0 }
      : stage === "Washing"
        ? { rotate: [0, 150, 70, 250, 180, 360] }
        : { rotate: 360 };
  const transition =
    reduce || !spinning
      ? { duration: 0.6, ease: EASE_OUT }
      : stage === "Washing"
        ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" as const }
        : { duration: 0.45, repeat: Infinity, ease: "linear" as const };

  return (
    <div className="relative w-[148px] h-[148px] shrink-0">
      {/* door ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#d9d4c9] to-[#8f8a80] p-[7px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_6px_18px_rgba(0,0,0,0.45)]">
        <div className="relative w-full h-full rounded-full overflow-hidden bg-[#0d1418]">
          {/* water */}
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-[#3d7fb0]/45"
            initial={false}
            animate={{ height: stage === "Washing" ? "52%" : "0%" }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            <motion.div
              className="absolute -top-2 left-[-50%] w-[200%] h-4 rounded-[50%] bg-[#3d7fb0]/50"
              animate={reduce ? undefined : { x: ["0%", "25%", "0%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          {/* garments */}
          <motion.div className="absolute inset-0" animate={rotate} transition={transition}>
            {GARMENTS.map((g, i) => {
              const r = settled ? 0 : 34;
              // Rounded so the server and browser render identical transforms (no hydration mismatch).
              const x = settled ? (i - 2) * 14 : Math.round(Math.cos((g.a * Math.PI) / 180) * r * 100) / 100;
              const y = settled ? 40 - (i % 2) * 6 : Math.round(Math.sin((g.a * Math.PI) / 180) * r * 100) / 100;
              return (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 rounded-[6px]"
                  style={{ width: g.w, height: g.h, background: g.c, marginLeft: -g.w / 2, marginTop: -g.h / 2 }}
                  initial={false}
                  animate={{ x, y, rotate: settled ? 0 : g.a + 20, opacity: stage ? 1 : 0.25 }}
                  transition={{ duration: 0.7, ease: EASE_OUT }}
                />
              );
            })}
          </motion.div>
          {/* glass highlight */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.22),transparent_45%)] pointer-events-none" />
        </div>
      </div>
      <AnimatePresence>
        {stage === "Ready" && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-[#4ADE80] text-[#08240f] grid place-items-center text-[15px] font-bold shadow-lg"
            aria-hidden="true"
          >
            ✓
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LaundryMode() {
  const reduce = !!useReducedMotion();
  const [ticket, setTicket] = useState(142);
  const [stage, setStage] = useState<Stage | null>(null);
  const [sms, setSms] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const code = `AN-${String(ticket).padStart(4, "0")}`;

  // Auto-advance through the machine stages once the cycle is running.
  useEffect(() => {
    if (!stage || !STAGE_MS[stage]) return;
    timer.current = setTimeout(() => {
      const next = STAGES[STAGES.indexOf(stage) + 1];
      setStage(next);
      emit("laundry", `stage.${next.toLowerCase()}`, code);
    }, STAGE_MS[stage]);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [stage, code]);

  const primary = () => {
    if (!stage) {
      setStage("Received");
      emit("laundry", "ticket.created", `${code} · 5 items · wash & press`);
    } else if (stage === "Received") {
      setStage("Washing");
      emit("laundry", "stage.washing", code);
    } else if (stage === "Ready" && !sms) {
      setSms(true);
      emit("laundry", "sms.sent", `${code} ready for pickup`);
    } else if (stage === "Ready" && sms) {
      emit("laundry", "ticket.collected", code);
      setStage(null);
      setSms(false);
      setTicket((t) => t + 1);
    }
  };

  const running = stage === "Washing" || stage === "Drying" || stage === "Pressing";
  const label = !stage
    ? "Drop off 5 items"
    : stage === "Received"
      ? "Start cycle"
      : running
        ? `${stage}…`
        : !sms
          ? "Text the customer"
          : "Scan & collect";

  const idx = stage ? STAGES.indexOf(stage) : -1;

  return (
    <div className="@container h-full">
    <div className="flex flex-col gap-3 h-full @sm:flex-row @sm:gap-4 @sm:items-stretch">
      <div className="flex flex-row @sm:flex-col items-center justify-center gap-3 @sm:w-[160px] shrink-0">
        <Drum stage={stage} reduce={reduce} />
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/45">
          {stage ? code : "Machine 02 · idle"}
        </span>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">Ticket track</div>
        <ol className="mt-2.5 space-y-1.5">
          {STAGES.map((s, i) => {
            const done = i < idx;
            const active = i === idx;
            return (
              <li key={s} className="flex items-center gap-2.5 text-[12px]">
                <span className="relative w-3.5 h-3.5 shrink-0 rounded-full border border-white/20 grid place-items-center">
                  {(done || active) && (
                    <motion.span
                      initial={reduce ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-2 h-2 rounded-full ${active && s !== "Ready" ? "bg-[var(--accent)]" : "bg-[#4ADE80]"}`}
                    />
                  )}
                  {active && running && !reduce && (
                    <span className="absolute inset-0 rounded-full border border-[var(--accent)] animate-ping" />
                  )}
                </span>
                <span className={done ? "text-white/45" : active ? "text-[#F2EEE6]" : "text-white/30"}>{s}</span>
              </li>
            );
          })}
        </ol>

        <div className="mt-3 @sm:mt-auto">
          <AnimatePresence>
            {sms && (
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="mb-2.5 rounded-[12px] rounded-bl-[4px] bg-[#2a2924] px-3 py-2 text-[11px] leading-snug text-white/85 max-w-[230px]"
              >
                <span className="block font-mono text-[9px] text-white/40 mb-0.5">SMS · An-Nur Laundry</span>
                Your order {code} is ready for pickup. Show this code at the counter.
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={primary}
            disabled={running}
            className="w-full h-9 rounded-[8px] bg-[var(--accent)] text-[#14100A] text-[12px] font-semibold tracking-wide disabled:bg-white/[0.07] disabled:text-white/45 transition-colors"
          >
            {label}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
