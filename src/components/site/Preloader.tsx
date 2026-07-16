"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

const SEEN_KEY = "preloader-seen";

export default function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      return;
    }
    const showFrame = requestAnimationFrame(() => setShow(true));
    const markSeen = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
    };
    const controls = animate(0, 100, {
      duration: 1.2,
      ease: EASE_OUT,
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        markSeen();
        setTimeout(() => setShow(false), 150);
      },
    });
    // Safety net: never leave the overlay covering the site.
    const failsafe = setTimeout(() => {
      markSeen();
      setShow(false);
    }, 3000);
    return () => {
      cancelAnimationFrame(showFrame);
      controls.stop();
      clearTimeout(failsafe);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[80] bg-[var(--background)] flex items-center justify-center"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: EASE_IN_OUT }}
        >
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
              className="font-display uppercase text-[var(--foreground)]"
              style={{ fontSize: "clamp(2rem, 6vw, 4rem)", letterSpacing: "-0.03em" }}
            >
              Aadam
            </motion.p>
          </div>
          <p className="absolute bottom-8 left-6 font-mono text-[12px] tracking-[0.2em] text-[var(--ink-3)] tabular-nums">
            {String(count).padStart(3, "0")}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
