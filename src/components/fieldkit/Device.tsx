"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { emit, useKitEvents } from "./events";
import { CHAPTERS, type ModeId } from "./chapters";
import Dial, { DETENT_DEG } from "./Dial";
import EventLog from "./EventLog";
import Receipt from "./Receipt";
import { DeviceThemeSwitch } from "./ThemeSwitch";
import CounterMode, { type Receipt as ReceiptData } from "./modes/CounterMode";
import LaundryMode from "./modes/LaundryMode";
import FinanceMode from "./modes/FinanceMode";
import { EASE_OUT } from "@/lib/motion";

// The boot sequence runs once per page load, however many devices mount.
let bootedOnce = false;

function Toy({ mode, onPrint }: { mode: ModeId; onPrint: (r: ReceiptData) => void }) {
  if (mode === "counter") return <CounterMode onPrint={onPrint} />;
  if (mode === "laundry") return <LaundryMode />;
  return <FinanceMode />;
}

function StatusLeds() {
  const latest = useKitEvents()[0]?.id ?? 0;
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      <span className="w-[7px] h-[7px] rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80]" />
      <motion.span
        key={latest}
        className="w-[7px] h-[7px] rounded-full bg-[var(--accent)]"
        initial={{ opacity: 1, boxShadow: "0 0 8px var(--accent)" }}
        animate={{ opacity: 0.35, boxShadow: "0 0 0px var(--accent)" }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      />
    </div>
  );
}

function BootScreen({ label }: { label: string }) {
  return (
    <div className="h-full flex flex-col justify-end font-mono text-[10.5px] leading-[16px] text-white/60 [animation:fk-flicker_0.9s_steps(1)_1]">
      <span className="text-white/35">FIELD KIT · FDE-01</span>
      <span>mem check ......... ok</span>
      <span>loading deployments {CHAPTERS.length}/{CHAPTERS.length}</span>
      <span className="text-[var(--accent)]">
        {label}
        <span className="inline-block w-[7px] h-[11px] ml-1 align-[-1px] bg-[var(--accent)] animate-pulse" />
      </span>
    </div>
  );
}

export interface DeviceProps {
  mode: ModeId;
  onSelectMode?: (mode: ModeId) => void;
  /** Scroll-linked dial angle (desktop). Without it the dial follows the mode. */
  dialRotate?: MotionValue<number>;
  /** Inline phone variant: one mode, no keys, no tilt, no boot. */
  compact?: boolean;
  /** Delay before the boot sequence starts (s), e.g. to wait for the preloader. */
  bootDelay?: number;
}

export default function Device({ mode, onSelectMode, dialRotate, compact = false, bootDelay = 0 }: DeviceProps) {
  const t = useTranslations("fieldkit");
  const reduce = !!useReducedMotion();
  const index = CHAPTERS.findIndex((c) => c.mode === mode);

  // Boot only on the main (non-compact) device, once per page load.
  const [booted, setBooted] = useState(compact || bootedOnce);
  useEffect(() => {
    if (booted) return;
    const wait = reduce ? 0 : (bootDelay + 1.5) * 1000;
    const id = setTimeout(() => {
      if (!bootedOnce) {
        bootedOnce = true;
        emit("kit", "boot.ok", `${CHAPTERS.length} deployments loaded`);
      }
      setBooted(true);
    }, wait);
    return () => clearTimeout(id);
  }, [booted, reduce, bootDelay]);

  // Toys stay mounted once visited, so a half-rung sale survives a scroll away.
  const [visited, setVisited] = useState<ModeId[]>([mode]);
  if (!visited.includes(mode)) setVisited([...visited, mode]);
  const mounted = compact ? [mode] : visited;

  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const tear = useCallback(() => setReceipt(null), []);

  // Dial: scroll-linked on desktop, otherwise springs to the active detent.
  const fallbackAngle = useMotionValue(index * DETENT_DEG);
  useEffect(() => {
    fallbackAngle.set(index * DETENT_DEG);
  }, [index, fallbackAngle]);
  const sprungAngle = useSpring(fallbackAngle, { stiffness: 180, damping: 18 });
  const angle = dialRotate ?? sprungAngle;

  // Pointer tilt, desktop only.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 16 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 16 });
  const tilt = !compact && !reduce;
  const shellRef = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tilt || e.pointerType !== "mouse") return;
    const r = shellRef.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const next = () => onSelectMode?.(CHAPTERS[(index + 1) % CHAPTERS.length].mode);
  const name = t(`chapters.${mode}.name`);

  return (
    <motion.div
      className="relative w-full [perspective:1400px]"
      initial={compact || reduce ? false : { opacity: 0, y: 40, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.1, ease: EASE_OUT, delay: bootDelay }}
    >
      <motion.div
        ref={shellRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={tilt ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className={`relative fk-shell ${compact ? "rounded-[22px] p-3" : "rounded-[28px] p-4"}`}
      >
        <Receipt receipt={receipt} onTear={tear} tearLabel={t("device.tear")} />
        {/* receipt slot */}
        <span
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[1px] w-[200px] h-[5px] rounded-b-[3px] bg-[#0c0b0a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]"
        />

        {/* top bar */}
        <div className="flex items-center justify-between px-1 pt-1 pb-2.5">
          <StatusLeds />
          <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-[var(--shell-ink)] [text-shadow:0_1px_0_rgba(255,255,255,0.18)]">
            {t("device.label")}
          </span>
          <div className="flex gap-1" aria-hidden="true">
            {CHAPTERS.map((c, i) => (
              <span
                key={c.mode}
                className="w-[10px] h-[3px] rounded-full transition-colors duration-500"
                style={{ background: i <= index ? "var(--accent)" : "var(--shell-line)" }}
              />
            ))}
          </div>
        </div>

        {/* screen */}
        <div className={`theme-fixed fk-screen relative overflow-hidden ${compact ? "rounded-[14px] p-2.5" : "rounded-[16px] p-3"}`}>
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 mb-2.5">
            <span>
              <span className="text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span> · {name}
            </span>
            <span>{t(`chapters.${mode}.kind`)}</span>
          </div>

          <div className={`relative ${compact ? "" : "h-[318px]"}`}>
            {!booted ? (
              <BootScreen label={t("device.booting")} />
            ) : (
              mounted.map((m) => {
                const active = m === mode;
                return (
                  <motion.div
                    key={m}
                    inert={!active}
                    aria-hidden={!active}
                    className={compact ? "" : "absolute inset-0"}
                    initial={reduce ? false : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                    animate={
                      active
                        ? { clipPath: "inset(0 0 0% 0)", opacity: 1 }
                        : { clipPath: "inset(0 0 100% 0)", opacity: 0 }
                    }
                    transition={{ duration: reduce ? 0 : 0.45, ease: EASE_OUT }}
                    style={{ pointerEvents: active ? "auto" : "none" }}
                  >
                    <Toy mode={m} onPrint={setReceipt} />
                  </motion.div>
                );
              })
            )}
            {/* scanline that sweeps on mode change */}
            {!reduce && booted && !compact && (
              <motion.span
                key={mode}
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 h-[2px] bg-[var(--accent)]/70 shadow-[0_0_12px_var(--accent)]"
                initial={{ top: "0%", opacity: 1 }}
                animate={{ top: "100%", opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              />
            )}
          </div>

          <EventLog label={t("device.log")} empty={t("device.logEmpty")} />
        </div>

        {/* controls */}
        <div className={`flex items-center justify-between gap-3 ${compact ? "mt-3 px-0.5" : "mt-4 px-1"}`}>
          {!compact && (
            <Dial rotate={angle} lit={CHAPTERS.length} onTurn={next} label={t("device.dial")} />
          )}
          {!compact && (
            <div role="group" aria-label={t("device.modes")} className="flex gap-2">
              {CHAPTERS.map((c, i) => (
                <button
                  key={c.mode}
                  type="button"
                  onClick={() => onSelectMode?.(c.mode)}
                  aria-pressed={c.mode === mode}
                  className="fk-key rounded-[10px] w-[64px] h-[46px] flex flex-col items-start justify-between px-2 py-1.5 text-left"
                >
                  <span className={`font-mono text-[9px] ${c.mode === mode ? "text-[var(--accent)]" : "text-[var(--shell-ink)]"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-[var(--shell-ink)] truncate w-full">
                    {t(`chapters.${c.mode}.name`).split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className={`flex items-center gap-3 ${compact ? "w-full justify-between" : ""}`}>
            <span aria-hidden="true" className={`fk-grille rounded-[6px] ${compact ? "w-[72px] h-[22px]" : "w-[38px] h-[38px]"}`} />
            <DeviceThemeSwitch />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
