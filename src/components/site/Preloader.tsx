"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_IN_OUT } from "@/lib/motion";
import { currentProgress, isReporting } from "@/lib/loadProgress";

export const PRELOADER_KEY = "preloader-seen";
const MIN_MS = 1100;
const MAX_MS = 4200;

/**
 * The "Aadam" curtain. Server-rendered so it covers the page from the very
 * first paint (no flash of the site underneath); a head script adds
 * `pl-seen` to <html> on repeat views in the same session so it never shows twice.
 */
export default function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(PRELOADER_KEY) === "1";
    } catch {}
    if (seen || reduce || document.documentElement.classList.contains("pl-seen")) {
      const f = requestAnimationFrame(() => setShow(false));
      return () => cancelAnimationFrame(f);
    }
    const t0 = performance.now();
    let raf = 0;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem(PRELOADER_KEY, "1");
      } catch {}
      setTimeout(() => setShow(false), 120);
    };
    // Shown count eases toward the real load progress (or a timer if nothing reports).
    let shown = 0;
    const loop = () => {
      const elapsed = performance.now() - t0;
      const timeP = Math.min(1, elapsed / MIN_MS);
      const target = isReporting() ? Math.min(timeP, 0.15 + currentProgress() * 0.85) : timeP;
      shown += (target - shown) * 0.12;
      if (countRef.current) countRef.current.textContent = String(Math.round(shown * 100)).padStart(3, "0");
      const ready = elapsed >= MIN_MS && (!isReporting() || currentProgress() >= 1);
      if ((ready && shown > 0.985) || elapsed > MAX_MS) {
        if (countRef.current) countRef.current.textContent = "100";
        finish();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden="true"
          className="preloader fixed inset-0 z-[80] bg-[var(--background)] flex items-center justify-center"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.85, ease: EASE_IN_OUT }}
        >
          <div className="overflow-hidden">
            {/* CSS keyframe, so the word rises before any JavaScript has loaded */}
            <p
              className="pl-rise font-display text-[var(--foreground)]"
              style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)", letterSpacing: "-0.045em" }}
            >
              Aadam
            </p>
          </div>
          <p className="absolute bottom-8 left-6 font-mono text-[12px] tracking-[0.2em] text-[var(--ink-3)] tabular-nums">
            <span ref={countRef}>000</span>
          </p>
          <p className="absolute bottom-8 right-6 font-mono text-[12px] tracking-[0.14em] text-[var(--ink-4)]">Accra</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
