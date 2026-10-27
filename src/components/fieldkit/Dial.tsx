"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

export const DIAL_SWEEP = 270;

/**
 * Rotary mode dial with detents. `position` is a continuous index
 * (0..count-1) so scroll can turn it smoothly between detents.
 */
export default function Dial({
  position,
  index,
  count,
  labels,
  onSelect,
  size = 86,
}: {
  position: MotionValue<number>;
  index: number;
  count: number;
  labels: readonly string[];
  onSelect: (i: number) => void;
  size?: number;
}) {
  const step = DIAL_SWEEP / (count - 1);
  const rotate = useTransform(position, (v) => -DIAL_SWEEP / 2 + v * step);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onSelect(Math.min(count - 1, index + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onSelect(Math.max(0, index - 1));
    }
  };

  const ring = size + 26;

  return (
    <div className="relative shrink-0" style={{ width: ring, height: ring }}>
      {/* detent ticks */}
      {Array.from({ length: count }, (_, i) => {
        const a = (-DIAL_SWEEP / 2 + i * step) * (Math.PI / 180);
        const r = ring / 2 - 4;
        const x = ring / 2 + Math.sin(a) * r;
        const y = ring / 2 - Math.cos(a) * r;
        return (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            onClick={() => onSelect(i)}
            aria-label={labels[i]}
            title={labels[i]}
            className="absolute w-3 h-3 -ml-1.5 -mt-1.5 grid place-items-center"
            style={{ left: x, top: y }}
          >
            <span
              className="block w-[3px] h-[3px] rounded-full transition-colors"
              style={{ background: i === index ? "var(--accent)" : "var(--shell-ink)" }}
            />
          </button>
        );
      })}
      <motion.button
        type="button"
        role="slider"
        aria-label="Mode dial"
        aria-valuemin={1}
        aria-valuemax={count}
        aria-valuenow={index + 1}
        aria-valuetext={labels[index]}
        onKeyDown={onKey}
        onClick={() => onSelect((index + 1) % count)}
        whileTap={{ scale: 0.96 }}
        className="absolute rounded-full"
        style={{
          left: 13,
          top: 13,
          width: size,
          height: size,
          rotate,
          background:
            "repeating-conic-gradient(from 0deg, var(--shell-hi) 0deg 3deg, var(--shell-lo) 3deg 6deg)",
          boxShadow:
            "0 10px 18px -6px rgba(0,0,0,0.55), 0 2px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      >
        <span
          className="absolute inset-[7px] rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 30%, var(--shell-hi), var(--shell) 55%, var(--shell-lo))",
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.25)",
          }}
        />
        <span className="absolute left-1/2 top-[10px] -ml-[2px] w-[4px] h-[16px] rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
      </motion.button>
    </div>
  );
}
