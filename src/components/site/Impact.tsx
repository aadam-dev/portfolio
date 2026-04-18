"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

const STATS: { value: string; label: string; note?: string }[] = [
  { value: "20+", label: "Production products", note: "Shipped to real users" },
  { value: "50+", label: "SMEs evaluated", note: "Investment & diligence" },
  { value: "4+", label: "Years shipping", note: "In-market experience" },
  { value: "GHS 40K+", label: "Community funds raised", note: "Madina basketball" },
];

const FELLOWSHIPS: { title: string; org: string; year: string }[] = [
  { title: "Aspire Leaders Program", org: "Harvard-affiliated · Cohort 4", year: "2025" },
  { title: "AI-Integrated Leadership", org: "Aspire Institute · AILP", year: "2026" },
  { title: "NexaYouth Fellowship", org: "Climate & Social Justice · Washington DC", year: "2024" },
];

export default function Impact() {
  return (
    <section
      id="impact"
      aria-labelledby="impact-heading"
      className="relative px-4 md:px-6 py-24 md:py-32 border-t border-[var(--line)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5">Impact · 2022 — 2026</p>
            <h2
              id="impact-heading"
              className="font-display text-white text-balance"
              style={{
                fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
              }}
            >
              Numbers that{" "}
              <span className="italic text-[var(--ink-2)]">earned themselves.</span>
            </h2>
          </div>
          <p className="md:col-span-5 text-[15px] md:text-[16px] leading-[1.65] text-[var(--ink-2)] text-pretty">
            Portfolio compounded across EdTech, FinTech, e-commerce and
            community operations. Every number below has a real project
            behind it — no vanity metrics.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-y border-[var(--line)]">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className={`p-6 md:p-10 ${i < 3 ? "border-r border-[var(--line)]" : ""} ${
                i < 2 ? "border-b md:border-b-0 border-[var(--line)]" : ""
              }`}
            >
              <AnimatedValue value={s.value} />
              <p className="mt-2 text-[13px] md:text-[14px] text-white">{s.label}</p>
              {s.note && (
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-4)]">
                  {s.note}
                </p>
              )}
            </Reveal>
          ))}
        </div>

        {/* Fellowships */}
        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <p className="eyebrow mb-4">Fellowships</p>
            <h3
              className="font-display text-white"
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              Selected global programs.
            </h3>
          </div>
          <div className="md:col-span-8">
            <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {FELLOWSHIPS.map((f) => (
                <li
                  key={f.title}
                  className="flex items-center justify-between gap-6 py-5 md:py-6"
                >
                  <div className="min-w-0">
                    <p
                      className="font-display text-white"
                      style={{
                        fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {f.title}
                    </p>
                    <p className="mt-1 text-[13px] text-[var(--ink-3)]">{f.org}</p>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-4)]">
                    {f.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const match = value.match(/^([^0-9-]*)(\d+)(.*)$/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr, 10);
    if (Number.isNaN(target)) return;

    const steps = 36;
    const stepMs = 900 / steps;
    let current = 0;

    setDisplay(`${prefix}0${suffix}`);
    const t = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        setDisplay(value);
        clearInterval(t);
      } else {
        setDisplay(`${prefix}${Math.floor(current)}${suffix}`);
      }
    }, stepMs);
    return () => clearInterval(t);
  }, [inView, value]);

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="font-display text-white tabular-nums"
      style={{
        fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
        letterSpacing: "-0.03em",
        lineHeight: 1,
      }}
    >
      {display}
    </motion.p>
  );
}
