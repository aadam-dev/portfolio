"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import MagneticButton from "@/components/ui/MagneticButton";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

const WORDS = ["sell", "count", "decide", "showUp"] as const;
const CYCLE_MS = 2600;

function CyclingWord() {
  const t = useTranslations("home.hero.words");
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const box = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (reduce) return;
    // only turn while the headline is on screen and the tab is visible
    let seen = true;
    const io = new IntersectionObserver(([e]) => (seen = e.isIntersecting));
    if (box.current) io.observe(box.current);
    const id = setInterval(() => {
      if (seen && document.visibilityState === "visible") setI((v) => (v + 1) % WORDS.length);
    }, CYCLE_MS);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [reduce]);
  const words = WORDS.map((w) => t(w));
  return (
    <span ref={box} className="relative inline-grid overflow-hidden align-baseline pb-[0.08em] -mb-[0.08em]">
      {/* every word sits invisibly in the same cell, so the box fits the widest one as set, not the longest by letters */}
      {words.map((w) => (
        <span key={w} className="font-serif-it invisible col-start-1 row-start-1" aria-hidden="true">
          {w}
        </span>
      ))}
      {/* both words share one grid cell, so no layout measuring is needed on a swap */}
      <AnimatePresence initial={false}>
        <motion.span
          key={WORDS[i]}
          className="font-serif-it text-[var(--accent)] col-start-1 row-start-1"
          initial={{ y: "105%" }}
          animate={{ y: 0 }}
          exit={{ y: "-105%" }}
          transition={{ duration: 0.55, ease: EASE_IN_OUT }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={reduce ? { duration: 0 } : { delay, duration: 1, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** The landing headline: first person, one rotating verb per practice. */
export default function HeroCopy({ delay = 0 }: { delay?: number }) {
  const t = useTranslations("home.hero");
  return (
    <div>
      <h1
        id="hero-heading"
        className="font-display"
        style={{ fontSize: "clamp(2.8rem, 6vw, 6.2rem)", lineHeight: 0.98, letterSpacing: "-0.045em" }}
      >
        <Line delay={delay + 0.1}>{t("lineA")}</Line>
        <Line delay={delay + 0.22}>
          {/* one line where it fits; long translations wrap instead of being cut */}
          <span className="text-balance">
            {t("lineB")} <CyclingWord />
          </span>
        </Line>
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.5, duration: 0.7, ease: EASE_OUT }}
        className="mt-7 max-w-[30rem] text-[17px] md:text-[18px] leading-[1.6] text-[var(--ink-2)] text-pretty"
      >
        {t("sub")}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.7, duration: 0.6, ease: EASE_OUT }}
        className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3"
      >
        <MagneticButton href="#work-in-motion" variant="primary">
          {t("seeWork")}
          <ArrowDown className="w-4 h-4" />
        </MagneticButton>
        <MagneticButton href="#build" variant="secondary">
          {t("startProject")}
          <ArrowUpRight className="w-4 h-4" />
        </MagneticButton>
      </motion.div>
    </div>
  );
}
