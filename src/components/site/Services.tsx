"use client";

import {
  Compass,
  Code2,
  LineChart,
  Megaphone,
  Database,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const SERVICES = [
  {
    icon: Compass,
    title: "Product strategy & architecture",
    body: "From a vague brief to a concrete product plan: business model, information architecture, and the shortest path to something shippable.",
    meta: "Discovery · IA · Technical planning",
  },
  {
    icon: Code2,
    title: "Design & engineering",
    body: "Editorial-grade interfaces and production-grade code, delivered together. Next.js, TypeScript, Postgres. Shipped weekly, accessible by default.",
    meta: "Web · Mobile · Interface systems",
  },
  {
    icon: LineChart,
    title: "Data & business analysis",
    body: "Cash flow, cohort behaviour, funnel diagnostics, P&L reconstruction. Turning spreadsheets and gut-feel into decisions you can defend.",
    meta: "Modelling · Dashboards · Diligence",
  },
  {
    icon: Megaphone,
    title: "Digital marketing & growth",
    body: "Positioning, launch campaigns, SEO, paid acquisition, email and content loops. Treated as part of the product, not bolted on after launch.",
    meta: "SEO · Paid · Email · Content",
  },
  {
    icon: Database,
    title: "ERP & operations: Odoo or custom",
    body: "Replace disconnected spreadsheets and failing POS systems with one source of truth. Odoo configuration, custom modules, data migration, training, or we build it from scratch.",
    meta: "Odoo · Custom ERP · Migration",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative px-4 md:px-6 py-24 md:py-32 border-t border-[var(--line)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="md:col-span-6">
            <p className="eyebrow mb-5">Services · End-to-end</p>
            <h2
              id="services-heading"
              className="font-display text-white text-balance"
              style={{
                fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
              }}
            >
              One practice,{" "}
              <span className="italic text-[var(--ink-2)]">five disciplines.</span>
            </h2>
          </div>
          <p className="md:col-span-5 md:col-start-8 text-[15px] md:text-[16px] leading-[1.65] text-[var(--ink-2)] text-pretty">
            Most teams hand you off between strategy, design, engineering,
            data and marketing. Here, the person thinking through the
            business case is the same person writing the code and
            configuring the system that runs it. Fewer seams, faster
            decisions, better work.
          </p>
        </div>

        <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {SERVICES.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.04}>
              <div className="grid grid-cols-12 gap-4 md:gap-8 py-8 md:py-10 items-start">
                <div className="col-span-12 md:col-span-1 flex md:block items-center gap-3">
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-4)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="col-span-12 md:col-span-1">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.035)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    aria-hidden="true"
                  >
                    <s.icon className="w-4 h-4 text-white" />
                  </span>
                </div>

                <div className="col-span-12 md:col-span-6">
                  <h3
                    className="font-display text-white"
                    style={{
                      fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[15px] md:text-[16px] text-[var(--ink-2)] leading-relaxed text-pretty">
                    {s.body}
                  </p>
                </div>

                <div className="col-span-12 md:col-span-4 md:pl-4">
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--ink-3)] md:text-right">
                    {s.meta}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
