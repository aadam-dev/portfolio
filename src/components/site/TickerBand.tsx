"use client";

import { motion } from "framer-motion";
import Marquee from "@/components/ui/Marquee";

const TICKER = [
  "50+ SMEs evaluated",
  "20+ products shipped",
  "4+ years building in-market",
  "GHS 40K+ funds raised",
  "Aspire Fellow · Cohort 4 · 2025",
  "AI-Integrated Leadership Fellow · 2026",
  "Working globally · Any timezone",
];

export default function TickerBand() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative z-10 border-y border-[var(--line)] py-5"
      aria-label="Studio highlights"
    >
      <Marquee duration={35}>
        {TICKER.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-12">
            <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--ink-2)] whitespace-nowrap">
              {item}
            </span>
            <span aria-hidden="true" className="text-[var(--accent)] text-[13px]">
              ✳
            </span>
          </span>
        ))}
      </Marquee>
    </motion.div>
  );
}
