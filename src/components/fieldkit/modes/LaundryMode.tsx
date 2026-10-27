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
  { id: "kaftan", label: "Kaftan", c: "#E8B23A", w: 34, h: 18, a: 0 },
  { id: "shirt", label: "Shirt", c: "#4E7FA8", w: 30, h: 22, a: 72 },
  { id: "sheet", label: "Bedsheet", c: "#F2EEE6", w: 36, h: 16, a: 144 },
  { id: "jeans", label: "Trousers", c: "#B4552F", w: 26, h: 20, a: 216 },
  { id: "towel", label: "Towel", c: "#3F7A5A", w: 32, h: 18, a: 288 },
];

function Drum({
  stage,
  loaded,
  reduce,
  hot,
}: {
  stage: Stage | null;
  loaded: string[];
  reduce: boolean;
  hot: boolean;
}) {
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

  const inDrum = GARMENTS.filter((g) => loaded.includes(g.id));

  return (
    <div className="relative w-[136px] h-[136px] @[440px]:w-[148px] @[440px]:h-[148px] shrink-0">
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#d9d4c9] to-[#8f8a80] p-[7px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_6px_18px_rgba(0,0,0,0.45)] transition-shadow"
        style={hot ? { boxShadow: "0 0 0 3px var(--accent), 0 6px 18px rgba(0,0,0,0.45)" } : undefined}
      >
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
            {inDrum.map((g, i) => {
              const r = settled ? 0 : 32;
              const x = settled ? (i - (inDrum.length - 1) / 2) * 14 : Math.cos((g.a * Math.PI) / 180) * r;
              const y = settled ? 38 - (i % 2) * 6 : stage ? Math.sin((g.a * Math.PI) / 180) * r : 30 - (i % 2) * 8;
              return (
                <motion.span
                  key={g.id}
                  className="absolute left-1/2 top-1/2 rounded-[6px]"
                  style={{ width: g.w, height: g.h, background: g.c, marginLeft: -g.w / 2, marginTop: -g.h / 2 }}
                  initial={reduce ? false : { y: -60, opacity: 0 }}
                  animate={{ x, y, rotate: settled || !stage ? (i - 2) * 8 : g.a + 20, opacity: 1 }}
                  transition={{ duration: 0.7, ease: EASE_OUT }}
                />
              );
            })}
          </motion.div>
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
  const [loaded, setLoaded] = useState<string[]>([]);
  const [sms, setSms] = useState(false);
  const [hot, setHot] = useState(false);
  const drumRef = useRef<HTMLDivElement>(null);
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

  const load = (ids: string[]) => {
    const fresh = ids.filter((id) => !loaded.includes(id));
    if (!fresh.length || (stage && stage !== "Received")) return;
    const next = [...loaded, ...fresh];
    setLoaded(next);
    if (!stage) {
      setStage("Received");
      emit("laundry", "ticket.created", `${code} · drop-off at the counter`);
    }
    fresh.forEach((id) => emit("laundry", "item.tagged", `${code} · ${GARMENTS.find((g) => g.id === id)!.label}`));
  };

  const overDrum = (x: number, y: number) => {
    const r = drumRef.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const primary = () => {
    if (!stage) {
      load(GARMENTS.map((g) => g.id));
    } else if (stage === "Received") {
      setStage("Washing");
      emit("laundry", "stage.washing", `${code} · ${loaded.length} items`);
    } else if (stage === "Ready" && !sms) {
      setSms(true);
      emit("laundry", "sms.sent", `${code} ready for pickup`);
    } else if (stage === "Ready" && sms) {
      emit("laundry", "ticket.collected", `${code} · scanned at counter`);
      setStage(null);
      setSms(false);
      setLoaded([]);
      setTicket((t) => t + 1);
    }
  };

  const running = stage === "Washing" || stage === "Drying" || stage === "Pressing";
  const label = !stage
    ? "Load the whole basket"
    : stage === "Received"
      ? `Start cycle · ${loaded.length} item${loaded.length === 1 ? "" : "s"}`
      : running
        ? `${stage}…`
        : !sms
          ? "Text the customer"
          : "Scan & collect";

  const idx = stage ? STAGES.indexOf(stage) : -1;
  const basketOpen = !stage || stage === "Received";
  const basket = GARMENTS.filter((g) => !loaded.includes(g.id));

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Basket */}
      <div className="flex flex-col items-start @[440px]:flex-row @[440px]:items-center gap-2 min-h-[34px]">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40 shrink-0">
          {basketOpen ? (basket.length ? "Drag into the drum" : "Basket empty") : "In machine 02"}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {basketOpen &&
            basket.map((g) => (
              <motion.button
                key={g.id}
                type="button"
                drag={!reduce}
                dragSnapToOrigin
                dragElastic={0.6}
                whileDrag={{ scale: 1.08, zIndex: 30, cursor: "grabbing" }}
                onDrag={(_, info) => setHot(overDrum(info.point.x - window.scrollX, info.point.y - window.scrollY))}
                onDragEnd={(_, info) => {
                  setHot(false);
                  if (overDrum(info.point.x - window.scrollX, info.point.y - window.scrollY)) load([g.id]);
                }}
                onTap={() => load([g.id])}
                className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1A1814] pl-1.5 pr-2.5 h-7 text-[11px] text-white/80 cursor-grab touch-none"
                aria-label={`Load ${g.label}`}
              >
                <span className="w-3.5 h-3.5 rounded-[4px]" style={{ background: g.c }} />
                {g.label}
              </motion.button>
            ))}
        </div>
      </div>

      <div className="flex flex-1 gap-4 items-stretch min-h-0">
        <div className="flex flex-col items-center justify-center gap-2.5 w-[148px] @[440px]:w-[160px] shrink-0">
          <div ref={drumRef}>
            <Drum stage={stage} loaded={loaded} reduce={reduce} hot={hot} />
          </div>
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/45">
            {stage ? code : "Machine 02 · idle"}
          </span>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">Ticket track</div>
          <ol className="mt-2 space-y-1.5">
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

          <div className="mt-auto pt-2">
            <AnimatePresence>
              {sms && (
                <motion.div
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className="mb-2 rounded-[12px] rounded-bl-[4px] bg-[#2a2924] px-3 py-2 text-[11px] leading-snug text-white/85 max-w-[230px]"
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
              className="w-full h-9 rounded-[8px] bg-[var(--accent)] text-[var(--on-accent)] text-[12px] font-semibold tracking-wide disabled:bg-white/[0.07] disabled:text-white/45 transition-colors"
            >
              {label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
