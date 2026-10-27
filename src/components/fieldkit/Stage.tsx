"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, type MotionValue } from "framer-motion";
import { MODES, modeIndex, type ModeId } from "./chapters";
import ModeScreen, { warmModes } from "./ModeScreen";
import { ALBOYUT, ANNUR, DELISH, MADINA, MUNAMUSE, ZAINAS } from "./items";
import EventLog from "./EventLog";
import PosTerminal from "./hardware/PosTerminal";
import Phone from "./hardware/Phone";
import Laptop from "./hardware/Laptop";
import Tablet from "./hardware/Tablet";
import { DeviceThemeSwitch } from "./ThemeSwitch";

export type DeviceKind = "pos" | "phone" | "laptop" | "tablet";

/** The hardware each deployment actually ran on. */
export const DEVICE_OF: Record<ModeId, DeviceKind> = {
  counter: "pos",
  laundry: "phone",
  atelier: "phone",
  analyst: "laptop",
  ledger: "laptop",
  court: "tablet",
  classroom: "laptop",
  build: "pos",
};

const URL_OF: Partial<Record<ModeId, string>> = {
  analyst: "ethika.vercel.app/tools",
  ledger: "delish.odoo.com/odoo/inventory",
  classroom: "koyi-web.vercel.app/knowledge-hub/wassce",
};

const WARM_IMAGES = [
  ...ANNUR.garments.map((g) => g.img),
  ...ANNUR.stages.map((g) => g.img),
  ...ZAINAS.items.map((i) => i.img),
  MUNAMUSE.product.img,
  DELISH.dish.img,
  DELISH.launcher,
  MADINA.court,
  ALBOYUT.logo,
  ...ALBOYUT.items.map((i) => i.img),
  "/previews/ethika/tools.webp",
  "/previews/koyi/pathway.webp",
];

/** Reserved heights so mounting and unmounting never shifts the page. */
export const DEVICE_HEIGHT: Record<DeviceKind, string> = {
  pos: "min-h-[640px] @[560px]:min-h-[430px]",
  phone: "min-h-[620px]",
  laptop: "min-h-[530px] @[520px]:min-h-[410px]",
  tablet: "min-h-[540px] @[520px]:min-h-[420px]",
};

function Screen({ mode }: { mode: ModeId }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={mode}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.18 }}
      >
        <ModeScreen mode={mode} />
      </motion.div>
    </AnimatePresence>
  );
}

export function Hardware({ mode, children, narrow = false }: { mode: ModeId; children?: ReactNode; narrow?: boolean }) {
  // On a phone-width page a laptop would be a sliver; those screens run on a portrait tablet instead.
  const kind = narrow && DEVICE_OF[mode] === "laptop" ? "tablet" : DEVICE_OF[mode];
  const screen = children ?? <Screen mode={mode} />;
  switch (kind) {
    case "pos":
      return <PosTerminal>{screen}</PosTerminal>;
    case "phone":
      return <Phone>{screen}</Phone>;
    case "laptop":
      return <Laptop url={URL_OF[mode]}>{screen}</Laptop>;
    case "tablet":
      return <Tablet>{screen}</Tablet>;
  }
}

function Rail({ mode, onSelect, progress }: { mode: ModeId; onSelect: (m: ModeId) => void; progress?: MotionValue<number> }) {
  const idx = modeIndex(mode);
  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-3">
        <div role="group" aria-label="Deployments" className="flex flex-wrap gap-x-3 gap-y-1">
          {MODES.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              aria-current={i === idx ? "step" : undefined}
              className={`font-mono text-[10px] tracking-[0.12em] uppercase transition-colors ${
                i === idx ? "text-[var(--foreground)]" : "text-[var(--ink-4)] hover:text-[var(--ink-2)]"
              }`}
            >
              <span className={i === idx ? "text-[var(--accent)]" : ""}>{String(i + 1).padStart(2, "0")}</span> {m.key}
            </button>
          ))}
        </div>
        <DeviceThemeSwitch />
      </div>
      <div className="relative mt-2.5 h-px bg-[var(--line-strong)]">
        {progress && (
          <motion.span className="absolute inset-0 bg-[var(--accent)] origin-left" style={{ scaleX: progress }} />
        )}
      </div>
    </div>
  );
}

/** Desktop: one sticky stage; the device changes with the chapter. */
export default function Stage({
  mode,
  onSelect,
  progress,
  hint,
}: {
  mode: ModeId;
  onSelect: (m: ModeId) => void;
  progress?: MotionValue<number>;
  hint?: string;
}) {
  const reduce = useReducedMotion();
  const kind = DEVICE_OF[mode];
  useEffect(() => warmModes(WARM_IMAGES), []);
  return (
    <div className="relative h-full flex flex-col gap-4 py-6">
      <div className="relative flex-1 min-h-0 flex items-center justify-center">
        {/* the surface the kit sits on */}
        <span
          aria-hidden="true"
          className="absolute left-[6%] right-[6%] bottom-[6%] h-[60px] rounded-[50%]"
          style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.18), transparent 70%)" }}
        />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={kind}
            className={`relative w-full ${kind === "phone" ? "max-w-[330px]" : ""}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 50 }}
            transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 170, damping: 24, mass: 0.9 }}
          >
            <Hardware mode={mode} />
          </motion.div>
        </AnimatePresence>
      </div>
      {hint && <p className="text-center font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--ink-4)]">{hint}</p>}
      <Rail mode={mode} onSelect={onSelect} progress={progress} />
      <div className="theme-fixed rounded-[10px] bg-[#0e0d0b] px-3 py-2 border border-white/[0.06]">
        <EventLog lines={2} />
      </div>
    </div>
  );
}

/** Mobile: a chapter's own device, mounted only while it is near the viewport. */
export function InlineDevice({ mode }: { mode: ModeId }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { margin: "700px 0px 700px 0px" });
  const kind = DEVICE_OF[mode] === "laptop" ? "tablet" : DEVICE_OF[mode];
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return (
    <div ref={ref} className={`@container relative ${DEVICE_HEIGHT[kind]}`}>
      {mounted && near && (
        <>
          <Hardware mode={mode} narrow />
          <div className="theme-fixed mt-3 rounded-[10px] bg-[#0e0d0b] px-3 py-2 border border-white/[0.06]">
            <EventLog lines={1} />
          </div>
        </>
      )}
    </div>
  );
}
