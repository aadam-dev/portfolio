"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, projectSlug, localizedProject, type Project } from "@/lib/projects";
import BrowserMockup from "@/components/BrowserMockup";
import PreviewRouter from "@/components/previews/PreviewRouter";
import { useTranslations, useLocale } from "next-intl";
import { drawLine, maskRise } from "@/lib/motion";

const FLAGSHIP_IDS = ["primehub", "jireh", "rockmotion"];

/** Counts up the numeric part of values like "420+", "GHS 40K+", "3". */
function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    const match = value.match(/(\d+(?:\.\d+)?)/);
    if (!match) return;
    const target = parseFloat(match[1]);
    const controls = animate(Math.floor(target * 0.4), target, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        const rendered = Number.isInteger(target)
          ? Math.round(v).toString()
          : v.toFixed(1);
        setDisplay(value.replace(match[1], rendered));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

function FlagshipCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const t = useTranslations("flagship");
  const locale = useLocale();
  const { description } = localizedProject(project, locale);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState(
    project.defaultScreen ?? project.screens[0]?.id ?? "landing"
  );

  // As this card's wrapper scrolls out (next card covering it), settle it back.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });
  const isLast = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.55]);

  return (
    <div ref={wrapperRef} className="md:min-h-[110vh]">
      <motion.article
        className="md:sticky md:top-[8vh] rounded-3xl border border-[var(--line-strong)] bg-[var(--surface-2)] overflow-hidden"
        style={reduce ? undefined : { scale, opacity }}
      >
        <div className="grid md:grid-cols-[5fr_7fr]">
          {/* Left: story */}
          <div className="p-6 md:p-10 flex flex-col justify-between gap-8 min-w-0">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <span
                  className="font-mono text-[10px] tracking-[0.22em] uppercase"
                  style={{ color: project.accentColor }}
                >
                  {project.categoryLabel}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--ink-4)]">
                  {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
                </span>
              </div>
              <h3
                className="font-display"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  lineHeight: 1.0,
                }}
              >
                {project.name}
              </h3>
              <p className="mt-3 text-[15px] md:text-[16px] leading-[1.6] text-[var(--ink-2)] text-pretty">
                {description}
              </p>
            </div>

            {project.outcomes && (
              <dl className="grid grid-cols-3 gap-4 border-t border-[var(--line)] pt-6">
                {project.outcomes.slice(0, 3).map((o) => (
                  <div key={o.label} className="min-w-0">
                    <dt className="sr-only">{o.label}</dt>
                    <dd
                      className="font-display text-[1.4rem] md:text-[1.8rem]"
                      style={{ color: "var(--accent)" }}
                    >
                      <StatValue value={o.value} />
                    </dd>
                    <dd className="mt-1 font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--ink-3)] leading-snug">
                      {o.label}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {project.stack.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] tracking-[0.08em] px-2 py-1 rounded-full border border-[var(--line)] text-[var(--ink-3)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Link
                href={`/work/${projectSlug(project)}`}
                className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--foreground)] whitespace-nowrap"
              >
                {t("caseStudy")}
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right: live preview */}
          <div className="p-4 md:p-8 md:pl-0 order-first md:order-none min-w-0">
            <BrowserMockup
              project={project}
              activeScreen={screen}
              onScreenChange={setScreen}
            >
              <PreviewRouter projectId={project.id} screen={screen} />
            </BrowserMockup>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function FlagshipWork() {
  const t = useTranslations("flagship");
  const flagships = FLAGSHIP_IDS.map((id) => projects.find((p) => p.id === id)).filter(
    (p): p is Project => !!p
  );

  return (
    <section id="flagship" className="relative px-4 md:px-6 py-24 md:py-36" aria-label="Selected work">
      <div className="max-w-[1440px] mx-auto">
        <header className="mb-14 md:mb-20">
          <p className="eyebrow mb-5">{t("eyebrow", { count: flagships.length })}</p>
          <div className="overflow-hidden">
            <motion.h2
              variants={maskRise}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              className="font-display"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", lineHeight: 1 }}
            >
              Built to <span className="font-serif-it text-[var(--accent)] lowercase">perform</span>
            </motion.h2>
          </div>
          <motion.div
            variants={drawLine}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 h-px bg-[var(--line-strong)] origin-left"
          />
        </header>

        <div className="flex flex-col gap-8 md:gap-0">
          {flagships.map((p, i) => (
            <FlagshipCard key={p.id} project={p} index={i} total={flagships.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
