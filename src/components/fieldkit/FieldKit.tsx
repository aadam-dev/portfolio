"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import MagneticButton from "@/components/ui/MagneticButton";
import CountUp from "@/components/ui/CountUp";
import { EASE_OUT } from "@/lib/motion";
import Device from "./Device";
import { CHAPTERS, MODES, chapterProjects, modeIndex, type Chapter, type ModeId } from "./chapters";

/* ---------- helpers ---------- */

export function useMediaQuery(q: string): boolean | null {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(q);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(q).matches,
    () => null,
  );
}

type LenisLike = { scrollTo: (t: HTMLElement | number, o?: { offset?: number; duration?: number }) => void };

export function scrollToEl(el: HTMLElement | null, offset = 0) {
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
}

function AccraClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Africa/Accra",
    });
    const tick = () => setTime(fmt.format(new Date()));
    const first = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(id);
    };
  }, []);
  return <span className="tabular-nums">Accra {time ?? "--:--:--"} GMT</span>;
}

function Line({ children, delay, reduce }: { children: React.ReactNode; delay: number; reduce: boolean }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={reduce ? { duration: 0 } : { delay, duration: 1.0, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Rises in with a slight backwards tilt, then boots. */
function RisingDevice({ children, reduce, delay = 0.35 }: { children: React.ReactNode; reduce: boolean; delay?: number }) {
  return (
    <motion.div
      className="w-full"
      style={{ perspective: 1200 }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 1.1, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- chapter ---------- */

// Each chapter enters differently from the last.
const ENTRANCES: Variants[] = [
  { hidden: { clipPath: "inset(0 0 100% 0)", y: 30 }, show: { clipPath: "inset(0 0 0% 0)", y: 0 } },
  { hidden: { opacity: 0, x: -40, filter: "blur(10px)" }, show: { opacity: 1, x: 0, filter: "blur(0px)" } },
  { hidden: { clipPath: "inset(0 100% 0 0)" }, show: { clipPath: "inset(0 0% 0 0)" } },
  { hidden: { opacity: 0, scale: 0.92, y: 20 }, show: { opacity: 1, scale: 1, y: 0 } },
];

function ChapterBlock({
  chapter,
  i,
  isDesktop,
  onActive,
}: {
  chapter: Chapter;
  i: number;
  isDesktop: boolean | null;
  onActive: (i: number) => void;
}) {
  const t = useTranslations("fieldkit");
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const centered = useInView(ref, { margin: "-50% 0px -50% 0px" });
  const seen = useInView(ref, { once: true, amount: 0.25 });
  const near = useInView(ref, { once: true, margin: "400px 0px 400px 0px" });
  const [localMode, setLocalMode] = useState<ModeId>(chapter.mode);
  const meta = MODES[modeIndex(chapter.mode)];
  const projects = chapterProjects(chapter);
  const entrance = ENTRANCES[i % ENTRANCES.length];

  useEffect(() => {
    if (centered) onActive(i);
  }, [centered, i, onActive]);

  const k = (s: string) => t(`chapters.${chapter.id}.${s}`);

  return (
    <article
      ref={ref}
      id={`chapter-${chapter.n}`}
      aria-labelledby={`chapter-${chapter.n}-title`}
      className="relative py-20 lg:py-0 lg:min-h-[100vh] flex flex-col justify-center scroll-mt-24"
    >
      <div className="max-w-[560px]">
        <motion.div
          className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-3)]"
          initial={{ opacity: 0 }}
          animate={seen ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[var(--accent)]">{chapter.n}</span>
          <span className="h-px w-8 bg-[var(--line-strong)]" />
          <span>{meta.label}</span>
          <span className="text-[var(--ink-4)]">· {meta.sub}</span>
        </motion.div>

        <motion.h2
          id={`chapter-${chapter.n}-title`}
          className="mt-5 font-display text-balance"
          style={{ fontSize: "clamp(2.2rem, 4.4vw, 4rem)", lineHeight: 1, letterSpacing: "-0.035em" }}
          variants={entrance}
          initial="hidden"
          animate={seen ? "show" : "hidden"}
          transition={reduce ? { duration: 0 } : { duration: 1, ease: EASE_OUT }}
        >
          {k("title")} <span className="font-serif-it text-[var(--accent)]">{k("accent")}</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={seen ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE_OUT }}
        >
          <p className="mt-6 text-[16px] md:text-[17px] leading-[1.6] text-[var(--ink-2)] text-pretty">
            <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--ink-4)] mr-2">
              {t("fieldNote")}
            </span>
            {k("note")}
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-[var(--line)] pt-6">
            {chapter.metrics.map((m) => (
              <div key={m.key}>
                <dd className="font-display text-[clamp(1.5rem,2.4vw,2.2rem)] leading-none tracking-[-0.03em]">
                  <CountUp value={m.value} />
                </dd>
                <dt className="mt-2 text-[12px] leading-snug text-[var(--ink-3)]">{k(m.key)}</dt>
              </div>
            ))}
          </dl>

          {projects.length > 0 && (
            <ul className="mt-7 flex flex-wrap gap-2" aria-label={t("projectsIn")}>
              {projects.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] px-3 py-1.5 text-[12.5px] text-[var(--ink-2)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.accent }} />
                    {p.name}
                    <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--accent)]">
            {t("tryIt")}
            <ArrowRight className="hidden lg:block w-3.5 h-3.5" />
            <ArrowDown className="lg:hidden w-3.5 h-3.5" />
            <span className="normal-case tracking-normal font-body text-[13px] text-[var(--ink-3)]">{k("hint")}</span>
          </p>
        </motion.div>
      </div>

      {/* Mobile: the chapter carries its own compact device */}
      {isDesktop === false && (
        <div className="mt-10 lg:hidden min-h-[520px]">
          {near && <Device mode={localMode} onSelect={setLocalMode} compact serial={`FDE-${chapter.n}`} />}
        </div>
      )}
    </article>
  );
}

/* ---------- main ---------- */

export default function FieldKit() {
  const t = useTranslations("fieldkit");
  const reduce = !!useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const chaptersRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [heroMode, setHeroMode] = useState<ModeId>("counter");

  const { scrollYProgress } = useScroll({ target: chaptersRef, offset: ["start center", "end center"] });
  const n = CHAPTERS.length;
  const rawPos = useTransform(scrollYProgress, (v) => Math.min(n - 1, Math.max(0, v * n - 0.5)));
  const position = useSpring(rawPos, { stiffness: 140, damping: 24 });

  const heroRef = useRef<HTMLDivElement>(null);
  const heroCentered = useInView(heroRef, { margin: "-50% 0px -50% 0px" });
  const current = heroCentered ? -1 : active;
  const desktopMode: ModeId = current < 0 ? heroMode : CHAPTERS[current].mode;

  const selectDesktop = (m: ModeId) => {
    if (m === "build") {
      scrollToEl(document.getElementById("build"));
      return;
    }
    const ch = CHAPTERS.find((c) => c.mode === m);
    if (current < 0 && m === "counter") return;
    if (ch) scrollToEl(document.getElementById(`chapter-${ch.n}`));
  };

  return (
    <section id="deployments" aria-labelledby="hero-heading" className="relative">
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: "min(900px, 90vw)",
          height: "700px",
          background: "radial-gradient(ellipse at 70% 30%, var(--accent-glow) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
      />
      <div className="relative max-w-[1440px] mx-auto px-4 md:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)] lg:gap-12 xl:gap-20">
        <div>
          {/* Chapter 00: hero */}
          <div ref={heroRef} className="min-h-[auto] lg:min-h-[100vh] flex flex-col justify-center pt-32 pb-14 lg:py-28">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-start gap-3 eyebrow leading-relaxed"
            >
              <span className="relative inline-flex w-2 h-2 mt-[5px] shrink-0">
                <span className="ping-soft absolute inline-flex w-full h-full rounded-full bg-[var(--accent)]" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--accent)]" />
              </span>
              {t("hero.eyebrow")}
            </motion.p>

            <h1
              id="hero-heading"
              className="mt-8 font-display"
              style={{ fontSize: "clamp(2.9rem, 6.2vw, 6.4rem)", lineHeight: 0.98, letterSpacing: "-0.045em" }}
            >
              <Line delay={0.12} reduce={reduce}>
                {t("hero.titleA")}
              </Line>
              <Line delay={0.24} reduce={reduce}>
                <span className="font-serif-it text-[var(--accent)]" style={{ letterSpacing: "-0.02em" }}>
                  {t("hero.titleB")}
                </span>
              </Line>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: EASE_OUT }}
              className="mt-7 max-w-[520px] text-[17px] md:text-[18px] leading-[1.6] text-[var(--ink-2)] text-pretty"
            >
              {t("hero.sub")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6, ease: EASE_OUT }}
              className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <MagneticButton href="#chapter-01" variant="primary">
                {t("hero.play")}
                <ArrowDown className="w-4 h-4" />
              </MagneticButton>
              <MagneticButton href="#build" variant="secondary">
                {t("hero.build")}
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-3)]"
            >
              <AccraClock />
              <span className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                {t("hero.available")}
              </span>
              <span className="text-[var(--ink-4)]">{t("hero.shipped")}</span>
            </motion.div>

            {isDesktop === false && (
              <div className="mt-12">
                <RisingDevice reduce={reduce} delay={0.5}>
                  <Device mode={heroMode} onSelect={setHeroMode} boot compact />
                </RisingDevice>
                <p className="mt-4 font-mono text-[10.5px] tracking-[0.14em] uppercase text-[var(--ink-4)]">
                  {t("hero.hint")}
                </p>
              </div>
            )}
          </div>

          {/* Chapters 01-07 */}
          <div ref={chaptersRef}>
            {CHAPTERS.map((c, i) => (
              <ChapterBlock key={c.id} chapter={c} i={i} isDesktop={isDesktop} onActive={setActive} />
            ))}
          </div>
        </div>

        {/* Desktop: one sticky device runs every deployment */}
        <div className="hidden lg:block">
          <div className="sticky top-0 h-[100vh] flex flex-col justify-center pt-16">
            {isDesktop && (
              <RisingDevice reduce={reduce}>
                <Device
                  mode={desktopMode}
                  onSelect={selectDesktop}
                  position={position}
                  progress={scrollYProgress}
                  boot
                  tilt
                  keepAlive
                />
                <p className="mt-5 text-center font-mono text-[10.5px] tracking-[0.14em] uppercase text-[var(--ink-4)]">
                  {current < 0 ? t("hero.hint") : t(`chapters.${CHAPTERS[current].id}.hint`)}
                </p>
              </RisingDevice>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
