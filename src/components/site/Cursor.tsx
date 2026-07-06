"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Additive custom cursor: instant gold dot + spring-lagged ring.
 * Ring scales over interactive elements. Desktop (pointer: fine) only;
 * native cursor stays visible.
 */
export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hoveringLink, setHoveringLink] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 400, damping: 35 });
  const ringY = useSpring(dotY, { stiffness: 400, damping: 35 });

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", onChange);

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      const target = e.target as HTMLElement | null;
      setHoveringLink(!!target?.closest("a, button, [role='button']"));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("mousemove", onMove);
    };
  }, [reduce, dotX, dotY]);

  if (!enabled || reduce) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[60] pointer-events-none w-2.5 h-2.5 rounded-full bg-[var(--accent)]"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[60] pointer-events-none w-8 h-8 rounded-full border border-[var(--accent)]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hoveringLink ? 2 : 1, opacity: hoveringLink ? 0.35 : 0.6 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
