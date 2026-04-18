"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Marquee from "@/components/ui/Marquee";
import MagneticButton from "@/components/ui/MagneticButton";

const TICKER = [
  "50+ SMEs evaluated",
  "20+ products shipped",
  "4+ years building in-market",
  "GHS 40K+ funds raised",
  "Aspire Fellow · Cohort 4 · 2025",
  "AI-Integrated Leadership Fellow · 2026",
  "Based in Accra · Working globally",
];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative pt-36 md:pt-44 pb-20 md:pb-28 px-4 md:px-6"
      aria-labelledby="hero-heading"
    >
      {/* Signature glow */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none"
        aria-hidden="true"
        style={{
          width: "min(900px, 100vw)",
          height: "600px",
          background:
            "radial-gradient(ellipse at center, rgba(124,106,250,0.22) 0%, transparent 55%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-10 md:mb-14"
        >
          <span className="relative inline-flex w-2 h-2">
            <span className="ping-soft absolute inline-flex w-full h-full rounded-full bg-[var(--success)]" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--success)]" />
          </span>
          <span className="eyebrow">
            Available for Q2 · Accra · Global
          </span>
        </motion.div>

        {/* Headline */}
        <h1
          id="hero-heading"
          className="font-display text-white text-balance"
          style={{
            fontSize: "clamp(2.75rem, 10vw, 8.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
          }}
        >
          <SplitLine delay={0.05} reduce={!!reduce}>
            An independent studio
          </SplitLine>
          <br />
          <SplitLine delay={0.25} reduce={!!reduce}>
            <span className="italic text-[var(--ink-2)]">building the tools</span>
          </SplitLine>
          <br />
          <SplitLine delay={0.45} reduce={!!reduce}>
            businesses{" "}
            <span className="relative inline-block">
              <span className="text-gradient">actually use.</span>
              <motion.span
                aria-hidden="true"
                className="absolute left-0 bottom-[0.08em] h-[0.06em] w-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #7C6AFA 0%, rgba(168,159,255,0) 100%)",
                }}
                initial={{ scaleX: 0, transformOrigin: "left" }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </SplitLine>
        </h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 md:mt-14 max-w-xl text-[17px] md:text-[19px] leading-[1.55] text-[var(--ink-2)] text-pretty"
        >
          Multi-disciplinary practice at the intersection of{" "}
          <span className="text-white">investment analysis</span>,{" "}
          <span className="text-white">data strategy</span>, and{" "}
          <span className="text-white">high-performance engineering</span>.
          Designing and shipping products for founders, funds and operators across Africa and beyond.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 md:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-3"
        >
          <MagneticButton href="#contact" variant="primary">
            Start a project
            <ArrowUpRight className="w-4 h-4" />
          </MagneticButton>
          <MagneticButton href="#work" variant="secondary">
            View selected work
            <ArrowDown className="w-4 h-4" />
          </MagneticButton>
        </motion.div>
      </div>

      {/* Outcome ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="relative z-10 mt-20 md:mt-28 border-y border-[var(--line)] py-5"
      >
        <Marquee duration={45}>
          {TICKER.map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-12">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-3)] whitespace-nowrap">
                {item}
              </span>
              <span
                aria-hidden="true"
                className="w-1 h-1 rounded-full bg-[var(--ink-4)]"
              />
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}

function SplitLine({
  children,
  delay,
  reduce,
}: {
  children: React.ReactNode;
  delay: number;
  reduce: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em]">
      <motion.span
        className="inline-block"
        initial={{ y: reduce ? 0 : "110%", opacity: reduce ? 0 : 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
