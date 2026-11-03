"use client";

import Link from "next/link";
import { Compass, Code2, LineChart, Megaphone, Database, Clapperboard, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import { localServices, type Service } from "@/lib/services";
import { EASE_OUT } from "@/lib/motion";

const ICONS: Record<Service["key"], typeof Compass> = {
  strategy: Compass,
  build: Code2,
  data: LineChart,
  brand: Clapperboard,
  growth: Megaphone,
  erp: Database,
};

export default function Services() {
  const t = useTranslations("services");
  const reduce = useReducedMotion();
  const { services: SERVICES, method: METHOD, remote: REMOTE, copy } = localServices(useLocale());
  return (
    <section id="services" aria-labelledby="services-heading" className="relative px-4 md:px-6 py-24 md:py-32 border-t border-[var(--line)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="md:col-span-6">
            <p className="eyebrow mb-5">{t("eyebrow")}</p>
            <h2 id="services-heading" className="font-display text-white text-balance" style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)", lineHeight: 0.98, letterSpacing: "-0.03em" }}>
              {t("heading")} <span className="font-serif-it lowercase text-[var(--ink-2)]">{t("headingAccent")}</span>
            </h2>
          </div>
          <p className="md:col-span-5 md:col-start-8 text-[15px] md:text-[16px] leading-[1.65] text-[var(--ink-2)] text-pretty">
            {copy.intro}
          </p>
        </div>

        {/* the forward-deployed method */}
        <ol className="mb-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3 lg:grid-cols-6">
          {METHOD.map((m, i) => (
            <motion.li
              key={m.step}
              // same first render on server and client; reduced motion just skips the travel
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={reduce ? { duration: 0 } : { duration: 0.6, delay: i * 0.07, ease: EASE_OUT }}
              className="bg-[var(--background)] p-5"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-display text-[20px] leading-none text-white">{m.step}</p>
              <p className="mt-2 text-[13px] leading-snug text-[var(--ink-3)]">{m.line}</p>
            </motion.li>
          ))}
        </ol>

        <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.key];
            return (
              <Reveal as="li" key={s.title} delay={i * 0.04}>
                <div className="grid grid-cols-12 gap-4 md:gap-8 py-8 md:py-10 items-start">
                  <div className="col-span-12 md:col-span-1">
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-4)]">{s.n}</span>
                  </div>
                  <div className="col-span-12 md:col-span-1">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: "color-mix(in srgb, var(--foreground) 3.5%, transparent)", border: "1px solid var(--line-strong)" }} aria-hidden="true">
                      <Icon className="w-4 h-4 text-white" />
                    </span>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <h3 className="font-display text-white" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                      {s.title}
                      {s.key === "brand" && (
                        <span className="ml-3 align-middle rounded-full bg-[var(--accent)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-black">{copy.isNew}</span>
                      )}
                    </h3>
                    <p className="mt-3 text-[15px] md:text-[16px] text-[var(--ink-2)] leading-relaxed text-pretty">{s.body}</p>
                  </div>
                  <div className="col-span-12 md:col-span-4 md:pl-4 md:text-right">
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--ink-3)]">{s.meta}</p>
                    {s.proof && (
                      <Link href={s.proof.href} className="group mt-3 inline-flex items-center gap-1 text-[13px] text-[var(--ink-2)] hover:text-white">
                        {copy.see} {s.proof.label} <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>

        {/* remote, worldwide */}
        <div className="mt-14 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-4">
            <p className="eyebrow mb-3">{copy.remoteEyebrow}</p>
            <p className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.05] text-white" style={{ letterSpacing: "-0.02em" }}>
              {copy.remoteTitle} <span className="font-serif-it text-[var(--accent)]">{copy.remoteAccent}</span>
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:col-span-8 lg:grid-cols-4">
            {REMOTE.map((r) => (
              <div key={r.k} className="bg-[var(--background)] p-5">
                <dt className="font-display text-[22px] text-white">{r.k}</dt>
                <dd className="mt-1 text-[13px] leading-snug text-[var(--ink-3)]">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
