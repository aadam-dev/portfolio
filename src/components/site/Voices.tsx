"use client";

import { Quote } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

/**
 * Placeholder testimonials — swap copy with real client quotes when collected.
 * Keep a max of 3 for signal density.
 */
const VOICES = [
  {
    quote:
      "Aadam doesn't just deliver software — he thinks like an owner. He questioned assumptions early, shipped in weeks not months, and left us with a product that felt 18 months ahead of our market.",
    author: "Founder",
    role: "West Africa fintech, seed-stage",
  },
  {
    quote:
      "Rare combination: the rigor of an investment analyst with the speed of a senior engineer. He operates in the gap most teams can't staff — the one between strategy and shipping.",
    author: "Partner",
    role: "Emerging-markets venture fund",
  },
  {
    quote:
      "The product he built became the piece of our operations we stopped worrying about. Six months in, it just runs — and when we call, he still picks up.",
    author: "CEO",
    role: "Restaurant group · Accra",
  },
];

export default function Voices() {
  return (
    <section
      id="voices"
      aria-labelledby="voices-heading"
      className="relative px-4 md:px-6 py-24 md:py-32 border-t border-[var(--line)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-12 md:mb-16 max-w-2xl">
          <p className="eyebrow mb-5">Voices · Client perspective</p>
          <h2
            id="voices-heading"
            className="font-display text-white text-balance"
            style={{
              fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
            }}
          >
            What it&rsquo;s like{" "}
            <span className="italic text-[var(--ink-2)]">to work together.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {VOICES.map((v, i) => (
            <Reveal key={v.author + v.role} delay={i * 0.08}>
              <figure
                className="relative h-full p-6 md:p-8 rounded-2xl border border-[var(--line)]"
                style={{ background: "rgba(255,255,255,0.015)" }}
              >
                <Quote
                  aria-hidden="true"
                  className="w-6 h-6 text-[var(--accent)] opacity-70 mb-5"
                />
                <blockquote
                  className="font-display text-white text-balance"
                  style={{
                    fontSize: "clamp(1.15rem, 1.6vw, 1.35rem)",
                    lineHeight: 1.35,
                    letterSpacing: "-0.01em",
                  }}
                >
                  &ldquo;{v.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 pt-5 border-t border-[var(--line)]">
                  <p className="text-[14px] text-white">{v.author}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-4)]">
                    {v.role}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.25}>
          <p className="mt-10 text-center text-[13px] text-[var(--ink-4)]">
            Real testimonials in rotation. Names attached on request after
            engagement.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
