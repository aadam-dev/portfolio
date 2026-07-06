"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

const CYCLE_WORDS = ["sell", "move", "convert", "impress"];
const CYCLE_MS = 2600;

function AccraTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Africa/Accra",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      ACCRA {time ?? "--:--:--"} GMT
    </span>
  );
}

function CyclingWord({ reduce }: { reduce: boolean }) {
  const [i, setI] = useState(2); // start on "convert"
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % CYCLE_WORDS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [reduce]);

  if (reduce) {
    return <span className="font-serif-it lowercase text-[var(--accent)]">convert</span>;
  }

  return (
    <span className="relative inline-grid overflow-hidden align-baseline">
      {/* width lock: longest word, invisible */}
      <span className="font-serif-it invisible col-start-1 row-start-1" aria-hidden="true">
        impress
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={CYCLE_WORDS[i]}
          className="font-serif-it lowercase text-[var(--accent)] col-start-1 row-start-1"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: EASE_IN_OUT }}
        >
          {CYCLE_WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function HeroLine({
  children,
  delay,
  reduce,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  reduce: boolean;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className={`block ${className}`}
        initial={reduce ? { opacity: 0 } : { y: "110%" }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        transition={{ delay, duration: 1.0, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-8%"]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.3]);
  // outlined line fills left→right between 10% and 35% scroll
  const fillPct = useTransform(scrollYProgress, [0.1, 0.35], [100, 0]);
  const fillClip = useMotionTemplate`inset(0 ${fillPct}% 0 0)`;

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex flex-col justify-end px-4 md:px-6 pb-14 md:pb-16 pt-32"
      aria-labelledby="hero-heading"
    >
      {/* Single restrained gold glow, bottom-left */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: "min(720px, 80vw)",
          height: "480px",
          background:
            "radial-gradient(ellipse at 20% 100%, var(--accent-glow) 0%, transparent 62%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-[1440px] w-full mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="flex items-center gap-3 mb-8 md:mb-12"
        >
          <span className="relative inline-flex w-2 h-2">
            <span className="ping-soft absolute inline-flex w-full h-full rounded-full bg-[var(--accent)]" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--accent)]" />
          </span>
          <span className="eyebrow">
            Aadam — Full-stack studio, Accra → worldwide
          </span>
        </motion.div>

        {/* Kinetic headline */}
        <motion.h1
          id="hero-heading"
          className="font-display uppercase"
          style={{
            fontSize: "clamp(3.2rem, 12vw, 11rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            y: reduce ? 0 : headlineY,
            opacity: reduce ? 1 : headlineOpacity,
          }}
        >
          <HeroLine delay={0.15} reduce={reduce}>
            Websites
          </HeroLine>
          <HeroLine delay={0.27} reduce={reduce}>
            <span className="flex items-baseline gap-[0.22em] flex-wrap">
              That <CyclingWord reduce={reduce} />
            </span>
          </HeroLine>
          <HeroLine delay={0.39} reduce={reduce}>
            <span className="relative inline-grid">
              <span className="text-outline col-start-1 row-start-1" aria-hidden="true">
                &amp; ship fast.
              </span>
              <motion.span
                className="col-start-1 row-start-1"
                style={{ clipPath: reduce ? "none" : fillClip }}
              >
                &amp; ship fast.
              </motion.span>
            </span>
          </HeroLine>
        </motion.h1>

        {/* Meta row + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: EASE_OUT }}
          className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <MagneticButton href="#flagship" variant="primary">
              See the work
              <ArrowDown className="w-4 h-4" />
            </MagneticButton>
            <MagneticButton href="#contact" variant="secondary">
              Start a project
              <ArrowUpRight className="w-4 h-4" />
            </MagneticButton>
          </div>

          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-3)] flex flex-col items-start md:items-end gap-1.5">
            <AccraTime />
            <span className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
              Available Q3 2026
            </span>
            <span className="text-[var(--ink-4)]">20+ products shipped</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
