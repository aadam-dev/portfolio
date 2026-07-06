"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

interface Vertical {
  label: string;
  /** Project id in projects.ts, when we've shipped for this vertical. */
  projectId?: string;
  projectName?: string;
}

const VERTICALS: Vertical[] = [
  { label: "Restaurants", projectId: "anisfoods", projectName: "Anis Foods" },
  { label: "Hotels", projectId: "thepalms", projectName: "The Palms" },
  { label: "Pharmacies" },
  { label: "Salons" },
  { label: "Construction" },
  { label: "Auto", projectId: "gaskiya", projectName: "Gaskiya" },
  { label: "Retail", projectId: "redrow", projectName: "Redrow Minimart" },
  { label: "Schools", projectId: "koyi", projectName: "Kōyi" },
  { label: "Real estate", projectId: "rentcheck", projectName: "Rentcheck" },
  { label: "Fintech", projectId: "siif", projectName: "SIIF" },
  { label: "Farms" },
  { label: "Events" },
  { label: "Faith orgs" },
  { label: "Fashion", projectId: "chalesocks", projectName: "Chale Socks" },
  { label: "Pro services" },
];

function scrollToProject(projectId: string) {
  const row = document.querySelector<HTMLElement>(
    `[data-project-row="${projectId}"]`
  );
  row?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export default function Range() {
  return (
    <section
      className="relative px-4 md:px-6 py-24 md:py-32 bg-[var(--surface)] border-y border-[var(--line)]"
      aria-labelledby="range-heading"
    >
      <div className="max-w-[1440px] mx-auto">
        <p className="eyebrow mb-5">Range</p>
        <motion.h2
          id="range-heading"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="font-display text-balance"
          style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", lineHeight: 1 }}
        >
          One studio.{" "}
          <span className="font-serif-it text-[var(--accent)] lowercase">every</span>{" "}
          industry.
        </motion.h2>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
          className="mt-12 flex flex-wrap gap-3 max-w-[1000px] list-none p-0"
        >
          {VERTICALS.map((v) => {
            const shipped = !!v.projectId;
            const chipClasses = `group inline-flex items-baseline gap-2 rounded-full border px-4 py-2 font-mono text-[12px] md:text-[13px] tracking-[0.06em] transition-colors duration-300 ${
              shipped
                ? "border-[var(--line-strong)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer"
                : "border-[var(--line)] text-[var(--ink-3)]"
            }`;
            return (
              <motion.li
                key={v.label}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 22 },
                  },
                }}
              >
                {shipped ? (
                  <button
                    type="button"
                    onClick={() => scrollToProject(v.projectId!)}
                    className={chipClasses}
                    aria-label={`${v.label} — see ${v.projectName}`}
                  >
                    {v.label}
                    <span className="text-[10px] tracking-[0.1em] text-[var(--ink-4)] group-hover:text-[var(--accent-2)] transition-colors">
                      → {v.projectName}
                    </span>
                  </button>
                ) : (
                  <span className={chipClasses}>
                    {v.label}
                    <span className="text-[10px] tracking-[0.1em] text-[var(--ink-5)]">
                      → next?
                    </span>
                  </span>
                )}
              </motion.li>
            );
          })}
        </motion.ul>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 font-serif-it text-[1.25rem] md:text-[1.5rem] text-[var(--ink-2)]"
        >
          If your industry isn&apos;t here yet, it&apos;s next.
        </motion.p>
      </div>
    </section>
  );
}
