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
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import MagneticButton from "@/components/ui/MagneticButton";
import CountUp from "@/components/ui/CountUp";
import { findProject } from "@/lib/projects";
import { scrollToElement } from "@/lib/scroll";
import { EASE_OUT } from "@/lib/motion";
import { CHAPTERS, chapterId, type Chapter, type ModeId } from "./chapters";
import { DETENT_DEG } from "./Dial";
import Device from "./Device";

const DESKTOP = "(min-width: 1024px)";

/** null on the server and during hydration, then the real answer. */
function useMedia(query: string): boolean | null {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => null,
  );
}

/** Wait for the first-visit preloader before booting the device. */
function usePreloaderDelay() {
  const [delay, setDelay] = useState(0.35);
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads sessionStorage, client only
      if (!sessionStorage.getItem("preloader-seen")) setDelay(1.6);
    } catch {}
  }, []);
  return delay;
}

function AccraClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Africa/Accra",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">Accra {time ?? "--:--"} GMT</span>;
}

function Hero({ onPlay }: { onPlay: () => void }) {
  const t = useTranslations("fieldkit.hero");
  const reduce = useReducedMotion();
  const line = (text: string, cls: string, delay: number) => (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block ${cls}`}
        initial={reduce ? false : { y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: EASE_OUT, delay }}
      >
        {text}
      </motion.span>
    </span>
  );

  return (
    <header data-mode={CHAPTERS[0].mode} className="min-h-[100svh] flex flex-col justify-center pt-28 pb-16 lg:pb-24">
      <motion.p
        className="eyebrow max-w-[52ch] leading-relaxed"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {t("eyebrow")}
      </motion.p>
      <h1 className="mt-6 font-display text-[clamp(44px,5.4vw,86px)] leading-[0.95] text-white text-balance">
        {line(t("line1"), "", 0.15)}
        {line(t("accent"), "font-serif-it text-[var(--accent)] text-[1.08em] leading-[0.9]", 0.28)}
      </h1>
      <motion.p
        className="mt-7 max-w-[44ch] text-[17px] md:text-[18px] leading-relaxed text-[var(--ink-2)] text-pretty"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
      >
        {t("sub")}
      </motion.p>
      <motion.div
        className="mt-9 flex flex-wrap items-center gap-3"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.62 }}
      >
        <MagneticButton onClick={onPlay}>
          {t("play")} <ArrowDown className="w-4 h-4" />
        </MagneticButton>
        <MagneticButton href="#contact" variant="secondary">
          {t("build")} <ArrowUpRight className="w-4 h-4" />
        </MagneticButton>
      </motion.div>
      <motion.dl
        className="mt-12 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div>
          <dt className="sr-only">Local time</dt>
          <dd>
            <AccraClock />
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Availability</dt>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" aria-hidden="true" />
          <dd>{t("available")}</dd>
        </div>
        <div>
          <dt className="sr-only">Track record</dt>
          <dd>{t("shipped")}</dd>
        </div>
      </motion.dl>
    </header>
  );
}

// Each chapter enters differently so the scroll does not feel like a template.
const ENTRANCES: Variants[] = [
  { hidden: { clipPath: "inset(0 0 100% 0)", y: 24 }, visible: { clipPath: "inset(0 0 0% 0)", y: 0 } },
  { hidden: { clipPath: "inset(0 100% 0 0)" }, visible: { clipPath: "inset(0 0% 0 0)" } },
  { hidden: { opacity: 0, filter: "blur(10px)", y: 12 }, visible: { opacity: 1, filter: "blur(0px)", y: 0 } },
];

function InlineDevice({ mode }: { mode: ModeId }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "200px 0px" });
  return (
    <div ref={ref} className="min-h-[420px]">
      {near && <Device mode={mode} compact />}
    </div>
  );
}

function ChapterBlock({
  chapter,
  index,
  total,
  desktop,
}: {
  chapter: Chapter;
  index: number;
  total: number;
  desktop: boolean | null;
}) {
  const t = useTranslations("fieldkit");
  const reduce = useReducedMotion();
  const c = `chapters.${chapter.mode}` as const;
  const entrance = ENTRANCES[index % ENTRANCES.length];

  return (
    <article
      id={chapterId(chapter.mode)}
      data-mode={chapter.mode}
      className="scroll-mt-24 py-20 lg:py-0 lg:min-h-[100svh] flex flex-col justify-center"
    >
      <p className="eyebrow">
        <span className="text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span> {t("chapter.of")}{" "}
        {String(total).padStart(2, "0")} · {t(`${c}.kind`)}
      </p>
      {/* Trigger on an unclipped wrapper: a fully clipped heading never reports as in view. */}
      <motion.div initial={reduce ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
        <motion.h2
          className="mt-5 font-display text-[clamp(38px,4.4vw,68px)] leading-[0.98] text-white text-balance"
          variants={entrance}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          {t(`${c}.title`)} <span className="font-serif-it text-[var(--accent)]">{t(`${c}.accent`)}</span>
        </motion.h2>
      </motion.div>
      <p className="mt-6 max-w-[46ch] text-[16px] md:text-[17px] leading-relaxed text-[var(--ink-2)] text-pretty">
        {t(`${c}.note`)}
      </p>

      <dl className="mt-10 grid grid-cols-3 gap-4 md:gap-6 border-t border-[var(--line)] pt-6 max-w-[560px]">
        {chapter.metrics.map((m) => (
          <div key={m.label} className="flex flex-col">
            <dt className="order-2 mt-2 text-[11.5px] leading-snug text-[var(--ink-3)]">{m.label}</dt>
            <dd className="order-1 font-display text-[26px] md:text-[34px] leading-none text-white">
              <CountUp value={m.value} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-4)] mb-3">{t("chapter.shipped")}</p>
        <ul className="flex flex-wrap gap-2">
          {chapter.projects.map((p) => {
            const project = findProject(p.slug);
            if (!project) return null;
            return (
              <li key={p.slug + (p.label ?? "")}>
                <Link
                  href={`/work/${p.slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] px-3.5 py-1.5 text-[13px] text-[var(--ink-2)] hover:text-white hover:border-white/40 transition-colors"
                >
                  {p.label ?? project.name}
                  <ArrowUpRight className="w-3 h-3 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-3)]">
        <span className="text-[var(--accent)]">{t("chapter.tryIt")}</span> · {t(`${c}.hint`)}
      </p>

      {desktop === false && (
        <div className="mt-10">
          <InlineDevice mode={chapter.mode} />
        </div>
      )}
    </article>
  );
}

export default function FieldKit() {
  const desktop = useMedia(DESKTOP);
  const bootDelay = usePreloaderDelay();
  const [mode, setMode] = useState<ModeId>(CHAPTERS[0].mode);
  const listRef = useRef<HTMLDivElement>(null);

  // The chapter crossing the middle of the viewport drives the device.
  useEffect(() => {
    const root = listRef.current?.parentElement;
    if (!desktop || !root) return;
    // The hero counts too, so scrolling back up returns the device to chapter 01.
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-mode]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setMode(e.target.getAttribute("data-mode") as ModeId);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [desktop]);

  // Dial turns with the scroll: one detent per chapter.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
  const dialRaw = useTransform(scrollYProgress, [0, 1], [0, (CHAPTERS.length - 1) * DETENT_DEG]);
  const dialRotate = useSpring(dialRaw, { stiffness: 200, damping: 24 });

  const goTo = (m: ModeId) => {
    const el = document.getElementById(chapterId(m));
    if (el) scrollToElement(el, desktop ? 0 : -80);
  };

  return (
    <section id="deployments" aria-label="Deployments" className="relative">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] xl:grid-cols-[minmax(0,1fr)_540px] lg:gap-12 xl:gap-16">
        <div>
          <Hero onPlay={() => goTo(CHAPTERS[0].mode)} />
          <div ref={listRef}>
            {CHAPTERS.map((c, i) => (
              <ChapterBlock key={c.mode} chapter={c} index={i} total={CHAPTERS.length} desktop={desktop} />
            ))}
          </div>
        </div>
        <div className="hidden lg:block relative z-[41] pointer-events-none">
          {/* Sits above the nav so a printed receipt can overlap it; click-through except the device. */}
          <div className="sticky top-0 h-[100svh] flex items-center pt-20 pointer-events-none">
            {desktop && (
              <div className="w-full pointer-events-auto">
                <Device mode={mode} onSelectMode={goTo} dialRotate={dialRotate} bootDelay={bootDelay} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
