"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Soft radial cursor spotlight used only on pointer devices that don't prefer
 * reduced motion. Fixed, non-interactive, low opacity.
 */
export default function CursorGlow() {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: -2000, y: -2000 });
  const [pointerFine, setPointerFine] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    setPointerFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPointerFine(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (!pointerFine || reduce) return;
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [pointerFine, reduce]);

  if (!pointerFine || reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{
        background: `radial-gradient(640px circle at ${pos.x}px ${pos.y}px, rgba(124,106,250,0.06), transparent 45%)`,
      }}
    />
  );
}
