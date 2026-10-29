"use client";

import { useState } from "react";
import type { ProjectWalkthrough } from "@/lib/projects";
import Reveal from "@/components/ui/Reveal";

interface Props {
  walkthroughs: ProjectWalkthrough[];
  accentColor: string;
}

export default function WalkthroughPlayer({ walkthroughs, accentColor }: Props) {
  const [activeId, setActiveId] = useState(walkthroughs[0]?.id ?? "");
  const active = walkthroughs.find((w) => w.id === activeId) ?? walkthroughs[0];
  if (!active) return null;

  const multi = walkthroughs.length > 1;

  return (
    <section
      id="walkthrough"
      className="relative px-4 md:px-6 pt-14 md:pt-20 scroll-mt-24"
      aria-label="Live walkthrough"
    >
      <div className="max-w-[1280px] mx-auto">
        <Reveal>
          <p className="eyebrow mb-2">Live walkthrough</p>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
            <div className="max-w-xl">
              <h2
                className="font-display text-white text-balance"
                style={{
                  fontSize: "clamp(1.35rem, 2.4vw, 1.85rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {active.title}
              </h2>
              <p className="mt-2 text-[14px] md:text-[15px] leading-relaxed text-[var(--ink-3)] text-pretty">
                {active.caption}
              </p>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-4)] shrink-0">
              {active.duration} · silent
            </span>
          </div>
        </Reveal>

        {multi && (
          <Reveal>
            <ul
              className="flex flex-wrap gap-2 mb-5"
              role="tablist"
              aria-label="Walkthrough clips"
            >
              {walkthroughs.map((w) => {
                const selected = w.id === active.id;
                return (
                  <li key={w.id}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveId(w.id)}
                      className="px-3.5 py-2.5 md:py-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.14em] border transition-colors"
                      style={{
                        borderColor: selected ? accentColor : "var(--line)",
                        background: selected ? `${accentColor}18` : "transparent",
                        color: selected ? accentColor : "var(--ink-3)",
                      }}
                    >
                      {w.title}
                      <span className="ml-2 opacity-60">{w.duration}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <div className="theme-fixed rounded-2xl overflow-hidden border border-[var(--line)] bg-black">
            <video
              key={active.src}
              controls
              playsInline
              preload="metadata"
              poster={active.poster}
              className="w-full aspect-video bg-black"
              aria-label={`${active.title} walkthrough`}
            >
              <source src={active.src} type="video/mp4" />
            </video>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
