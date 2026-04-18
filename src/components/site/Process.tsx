"use client";

import Reveal from "@/components/ui/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Discover",
    tag: "Week 1 – 2",
    body: "Deep dive with founders, operators and end users. We map the business, the numbers and the gnarly edges. Outcome: a one-page strategic brief everyone can point to.",
    bullets: ["Stakeholder interviews", "Market & data review", "Risks & assumptions"],
  },
  {
    n: "02",
    title: "Design",
    tag: "Week 2 – 4",
    body: "Product architecture, flows and interface — drawn as if we ship tomorrow. High-fidelity from day one. You see real screens, not mood boards.",
    bullets: ["Information architecture", "Interface & motion", "Prototype"],
  },
  {
    n: "03",
    title: "Ship",
    tag: "Week 3 – 10",
    body: "Engineering that survives production. TypeScript, Next.js, Postgres, CI/CD. Clean code, fast pages, accessible by default. Weekly deploys, always.",
    bullets: ["Full-stack build", "Integrations", "Observability"],
  },
  {
    n: "04",
    title: "Measure",
    tag: "Week 10+",
    body: "We don't disappear at launch. Metrics, experiments, iteration. Your product keeps earning its keep months after we ship.",
    bullets: ["Analytics & funnels", "Iteration sprints", "Handover"],
  },
];

export default function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative px-4 md:px-6 py-24 md:py-32 border-t border-[var(--line)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="md:col-span-5">
            <p className="eyebrow mb-5">Process · 10 weeks average</p>
            <h2
              id="process-heading"
              className="font-display text-white text-balance"
              style={{
                fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
              }}
            >
              How we work{" "}
              <span className="italic text-[var(--ink-2)]">together.</span>
            </h2>
          </div>
          <p className="md:col-span-5 md:col-start-8 text-[15px] md:text-[16px] leading-[1.65] text-[var(--ink-2)] text-pretty">
            A tight, senior-only engagement. You work directly with the person
            designing, engineering and shipping. No handovers, no slide decks,
            no junior staff &ldquo;learning on your account.&rdquo;
          </p>
        </div>

        <ol className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.05}>
              <div className="grid grid-cols-12 gap-4 md:gap-8 py-8 md:py-10">
                <div className="col-span-12 md:col-span-2">
                  <p
                    className="font-display text-white"
                    style={{
                      fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {s.n}
                  </p>
                  <p className="eyebrow mt-2">{s.tag}</p>
                </div>

                <div className="col-span-12 md:col-span-5">
                  <h3
                    className="font-display text-white"
                    style={{
                      fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
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

                <div className="col-span-12 md:col-span-5">
                  <ul className="space-y-2">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-3 text-[14px] text-[var(--ink-2)]"
                      >
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
