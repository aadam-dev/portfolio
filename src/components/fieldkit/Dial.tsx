"use client";

import { motion, type MotionValue } from "framer-motion";

/** Eight detents, one per planned deployment; the built ones are lit. */
export const DETENTS = 8;
export const DETENT_DEG = 360 / DETENTS;

export default function Dial({
  rotate,
  lit,
  size = 64,
  onTurn,
  label,
}: {
  rotate: MotionValue<number>;
  lit: number;
  size?: number;
  onTurn?: () => void;
  label: string;
}) {
  const ring = size + 22;
  return (
    <div className="relative shrink-0" style={{ width: ring, height: ring }}>
      {/* detent ticks engraved on the shell */}
      {Array.from({ length: DETENTS }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 w-[2px] h-[5px] rounded-full"
          style={{
            background: i < lit ? "var(--accent)" : "var(--shell-line)",
            transform: `translate(-50%, -50%) rotate(${i * DETENT_DEG}deg) translateY(-${ring / 2 - 3}px)`,
          }}
        />
      ))}
      <motion.button
        type="button"
        onClick={onTurn}
        aria-label={label}
        className="fk-dial absolute rounded-full"
        style={{ width: size, height: size, left: 11, top: 11, rotate }}
        whileTap={{ scale: 0.97 }}
      >
        {/* indicator notch */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[6px] -translate-x-1/2 w-[3px] h-[12px] rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(255,255,255,0.3),transparent_60%)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]"
        />
      </motion.button>
    </div>
  );
}
