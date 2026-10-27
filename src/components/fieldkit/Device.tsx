"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { MODES, modeIndex, type ModeId } from "./chapters";
import { emitOnce, useKitEvents } from "./events";
import EventLog from "./EventLog";
import Receipt, { PrinterContext, type Paper } from "./Receipt";
import Dial from "./Dial";
import ModeScreen from "./ModeScreen";
import { DeviceThemeSwitch } from "./ThemeSwitch";
import { EASE_OUT } from "@/lib/motion";

interface Props {
  mode: ModeId;
  onSelect?: (m: ModeId) => void;
  /** Continuous dial position (0..7). Defaults to a spring on the active mode. */
  position?: MotionValue<number>;
  /** 0..1 progress through the deployments, drawn on the screen header. */
  progress?: MotionValue<number>;
  boot?: boolean;
  tilt?: boolean;
  compact?: boolean;
  /** Keep visited toys mounted (desktop sticky device) so their state survives. */
  keepAlive?: boolean;
  serial?: string;
}

function Leds({ booted }: { booted: boolean }) {
  const last = useKitEvents()[0]?.id ?? 0;
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      <span
        className="w-[6px] h-[6px] rounded-full transition-all duration-500"
        style={{
          background: booted ? "#4ade80" : "#2a3a2e",
          boxShadow: booted ? "0 0 6px #4ade80" : "none",
        }}
      />
      <motion.span
        key={last}
        className="w-[6px] h-[6px] rounded-full bg-[var(--accent)]"
        initial={{ opacity: 1, boxShadow: "0 0 8px var(--accent)" }}
        animate={{ opacity: 0.25, boxShadow: "0 0 0px var(--accent)" }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      />
    </span>
  );
}

function Clock() {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Africa/Accra",
    });
    const tick = () => setT(fmt.format(new Date()));
    const first = requestAnimationFrame(tick);
    const id = setInterval(tick, 15000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(id);
    };
  }, []);
  return <span className="tabular-nums">{t} GMT</span>;
}

function BootScreen() {
  const lines = ["FIELD KIT OS 1.6", "kit.boot ok", "8 deployments loaded", "one event log, many surfaces"];
  return (
    <div className="h-full flex flex-col justify-center gap-1 font-mono text-[11px] text-white/60 px-2">
      {lines.map((l, i) => (
        <motion.div
          key={l}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1] }}
          transition={{ delay: 0.12 + i * 0.18, duration: 0.35 }}
        >
          <span className="text-[var(--accent)]">›</span> {l}
        </motion.div>
      ))}
    </div>
  );
}

export default function Device({
  mode,
  onSelect,
  position,
  progress,
  boot = false,
  tilt = false,
  compact = false,
  keepAlive = false,
  serial = "FDE-01",
}: Props) {
  const reduce = !!useReducedMotion();
  const idx = modeIndex(mode);
  const meta = MODES[idx];

  // Boot sequence: lights, flicker, then the first toy.
  const [booted, setBooted] = useState(!boot);
  useEffect(() => {
    if (!boot) return;
    const t = setTimeout(
      () => {
        setBooted(true);
        emitOnce("boot", "kit", "boot", "ok · 8 deployments loaded");
      },
      reduce ? 0 : 1300,
    );
    return () => clearTimeout(t);
  }, [boot, reduce]);

  // Toys visited so far (kept mounted when keepAlive).
  const [visited, setVisited] = useState<ModeId[]>([mode]);
  if (!visited.includes(mode)) setVisited([...visited, mode]);
  const mounted = keepAlive ? visited : [mode];

  // Dial position: scroll-driven if provided, otherwise springs to the active mode.
  const target = useMotionValue(idx);
  useEffect(() => {
    target.set(idx);
  }, [idx, target]);
  const sprung = useSpring(target, reduce ? { duration: 0 } : { stiffness: 260, damping: 26 });
  const dialPos = position ?? sprung;
  const barScale = useTransform(progress ?? sprung, (v) => (progress ? v : v / (MODES.length - 1)));

  // Printer
  const [paper, setPaper] = useState<Paper | null>(null);
  const paperSeq = useRef(0);
  const print = useCallback((p: Omit<Paper, "id">) => {
    paperSeq.current += 1;
    setPaper({ ...p, id: paperSeq.current });
  }, []);

  // Pointer tilt (desktop only)
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });
  const canTilt = tilt && !reduce;
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canTilt || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const select = (i: number) => onSelect?.(MODES[i].id);

  return (
    <PrinterContext.Provider value={print}>
      <div dir="ltr" className="relative w-full" style={{ perspective: 1400 }}>
        <motion.div
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={canTilt ? { rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" } : undefined}
          className="relative"
        >
          <Receipt paper={paper} onTear={() => setPaper(null)} />

          {/* Shell */}
          <div
            className={`relative rounded-[28px] ${compact ? "p-3" : "p-3.5 md:p-[18px]"}`}
            style={{
              background: "linear-gradient(165deg, var(--shell-hi) 0%, var(--shell) 38%, var(--shell-lo) 100%)",
              boxShadow: "var(--shell-shadow)",
            }}
          >
            {/* receipt slot */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[1px] w-[min(262px,80%)] h-[7px] rounded-b-[5px]"
              style={{ background: "#0a0908", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.8)" }}
            />

            {/* Top plate */}
            <div className="flex items-center justify-between gap-3 px-1.5 pt-1.5 pb-3">
              <div className="flex items-center gap-2.5">
                <Leds booted={booted} />
                <span
                  className="font-mono text-[9px] md:text-[9.5px] tracking-[0.22em] uppercase text-[var(--shell-ink)]"
                  style={{ textShadow: "0 1px 0 rgba(255,255,255,0.18)" }}
                >
                  Field Kit · {serial}
                </span>
              </div>
              <DeviceThemeSwitch />
            </div>

            {/* Screen */}
            <div
              className="theme-fixed relative rounded-[16px] p-2.5 md:p-3 overflow-hidden"
              style={{
                background: "#0e0d0b",
                boxShadow:
                  "inset 0 2px 10px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              {/* header */}
              <div className="relative flex items-center justify-between gap-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45 pb-2">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-[var(--accent)]">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="text-white/85 truncate">{meta.label}</span>
                  <span className="hidden sm:inline truncate text-white/35">{meta.sub}</span>
                </span>
                <Clock />
                <span className="absolute left-0 right-0 bottom-0 h-px bg-white/[0.06]" />
                <motion.span
                  className="absolute left-0 right-0 bottom-0 h-px bg-[var(--accent)] origin-left"
                  style={{ scaleX: barScale }}
                />
              </div>

              {/* toy area */}
              <div className={`relative mt-2.5 @container ${compact ? "min-h-[300px]" : "h-[352px]"}`}>
                {!booted ? (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={reduce ? { opacity: 1 } : { opacity: [0, 0.8, 0.2, 1, 0.6, 1] }}
                    transition={{ duration: 0.6 }}
                  >
                    <BootScreen />
                  </motion.div>
                ) : (
                  mounted.map((m) => (
                    <div
                      key={m}
                      className={compact ? "relative" : "absolute inset-0"}
                      hidden={m !== mode}
                    >
                      <ModeScreen mode={m} />
                    </div>
                  ))
                )}

                {/* scanline wipe on mode change */}
                {booted && !reduce && (
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={mode}
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-x-3 -top-1 -bottom-1 z-20"
                      initial={{ clipPath: "inset(0% 0 0 0)" }}
                      animate={{ clipPath: "inset(100% 0 0 0)" }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                      style={{ background: "#0e0d0b" }}
                    >
                      <motion.span
                        className="absolute left-0 right-0 h-[2px] bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]"
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                      />
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* event log */}
              <div className="mt-2.5 pt-2 border-t border-dashed border-white/[0.08]">
                <EventLog />
              </div>

              {/* scanlines texture */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{
                  background: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 md:gap-4 pt-3.5 px-1">
              <div
                aria-hidden="true"
                className="hidden sm:grid grid-cols-4 gap-[5px] shrink-0"
              >
                {Array.from({ length: 16 }, (_, i) => (
                  <span
                    key={i}
                    className="w-[5px] h-[5px] rounded-full"
                    style={{ background: "var(--shell-lo)", boxShadow: "inset 0 1px 1px rgba(0,0,0,0.6)" }}
                  />
                ))}
              </div>

              <div role="group" aria-label="Mode keys" className="flex-1 grid grid-cols-4 gap-1.5 md:gap-2">
                {MODES.map((m, i) => {
                  const active = i === idx;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => select(i)}
                      aria-pressed={active}
                      aria-label={m.label}
                      disabled={!onSelect}
                      className="relative h-[30px] md:h-[32px] rounded-[8px] font-mono text-[9px] md:text-[9.5px] tracking-[0.14em] transition-[transform,box-shadow] duration-150 disabled:cursor-default"
                      style={{
                        background: "linear-gradient(180deg, var(--shell-hi), var(--shell-key))",
                        color: "var(--shell-key-ink)",
                        transform: active ? "translateY(2px)" : "translateY(0)",
                        boxShadow: active
                          ? "0 0 0 rgba(0,0,0,0.4), inset 0 1px 2px rgba(0,0,0,0.25)"
                          : "0 2px 0 var(--shell-lo), 0 4px 6px -2px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
                      }}
                    >
                      <span
                        className="absolute left-1.5 top-1.5 w-[4px] h-[4px] rounded-full transition-colors"
                        style={{
                          background: active ? "var(--accent)" : "rgba(0,0,0,0.25)",
                          boxShadow: active ? "0 0 5px var(--accent)" : "none",
                        }}
                      />
                      {m.key}
                    </button>
                  );
                })}
              </div>

              <Dial
                position={dialPos}
                index={idx}
                count={MODES.length}
                labels={MODES.map((m) => m.label)}
                onSelect={select}
                size={compact ? 62 : 74}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </PrinterContext.Provider>
  );
}
