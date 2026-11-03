"use client";

import { useOsText } from "../l10n";
import { useRef, useState, type ReactNode } from "react";
import { motion, useAnimationControls, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";

export interface DockItem {
  id: string;
  label: string;
  /** an image, or anything to draw inside the tile */
  icon: ReactNode;
  open?: boolean;
  onOpen: () => void;
  /** a thin divider before this item */
  divider?: boolean;
}

const BASE = 48;
const PEAK = 1.9; // how big the icon under the pointer gets
const REACH = 120; // px either side the magnification spreads over

/**
 * The macOS dock: icons swell as the pointer passes (a smooth falloff, sprung so it never jitters),
 * neighbours make room, a launched app bounces, and open apps carry a dot. Keyboard focus counts as
 * hover; reduced motion keeps it still.
 */
export function Dock({ items, live, label = "Dock" }: { items: DockItem[]; live: boolean; label?: string }) {
  const mouseX = useMotionValue(Infinity);
  const reduce = useReducedMotion();
  return (
    <div dir="ltr" className="absolute inset-x-0 bottom-2.5 z-[500] flex justify-center">
      <nav
        aria-label={label}
        onMouseMove={(e) => !reduce && mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-[66px] max-w-[calc(100%-16px)] items-end gap-1.5 rounded-[22px] border border-white/20 bg-white/[0.12] px-2.5 pb-2 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-2xl"
      >
        {items.map((it) => (
          <DockIcon key={it.id} it={it} mouseX={mouseX} live={live} reduce={!!reduce} />
        ))}
      </nav>
    </div>
  );
}

function DockIcon({ it, mouseX, live, reduce }: { it: DockItem; mouseX: MotionValue<number>; live: boolean; reduce: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const t = useOsText().os;
  const [hover, setHover] = useState(false);
  const bounce = useAnimationControls();
  const dist = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Infinity;
  });
  // a Gaussian falloff: the closest icon peaks, neighbours rise less, far ones stay put
  const target = useTransform(dist, (d) => (Number.isFinite(d) ? BASE * (1 + (PEAK - 1) * Math.exp(-(d * d) / (2 * (REACH / 2.2) ** 2))) : BASE));
  const size = useSpring(target, { stiffness: 420, damping: 32, mass: 0.35 });

  const launch = () => {
    it.onOpen();
    if (!reduce && !it.open) bounce.start({ y: [0, -22, 0, -10, 0], transition: { duration: 0.9, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeOut" } });
  };

  return (
    <>
      {it.divider && <span aria-hidden className="mx-1 mb-1 h-10 w-px self-end bg-white/25" />}
      <motion.button
        ref={ref}
        type="button"
        tabIndex={live ? 0 : -1}
        onClick={launch}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => {
          setHover(true);
          const r = ref.current?.getBoundingClientRect();
          if (r && !reduce) mouseX.set(r.left + r.width / 2);
        }}
        onBlur={() => {
          setHover(false);
          mouseX.set(Infinity);
        }}
        aria-label={t.open(it.label)}
        className="relative flex shrink-0 flex-col items-center focus:outline-none"
        style={{ width: reduce ? BASE : size }}
      >
        {hover && (
          <span className="pointer-events-none absolute -top-10 whitespace-nowrap rounded-md bg-black/75 px-2.5 py-1 text-[11.5px] text-white shadow-lg backdrop-blur">{it.label}</span>
        )}
        <motion.span animate={bounce} className="block w-full">
          <motion.span
            className="block aspect-square w-full overflow-hidden rounded-[22%] shadow-[0_6px_16px_rgba(0,0,0,0.4)] ring-1 ring-white/20"
            style={{ width: reduce ? BASE : size }}
          >
            {it.icon}
          </motion.span>
        </motion.span>
        <span aria-hidden className={`mt-1 h-1 w-1 rounded-full ${it.open ? "bg-white/85" : "bg-transparent"}`} />
      </motion.button>
    </>
  );
}
