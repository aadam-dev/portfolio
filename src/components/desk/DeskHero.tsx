"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowUp, MousePointerClick } from "lucide-react";
import { useTranslations } from "next-intl";
import HeroCopy from "@/components/home/HeroCopy";
import ModeScreen from "@/components/fieldkit/ModeScreen";
import { useTheme } from "@/components/fieldkit/ThemeSwitch";
import { useAccraClock } from "@/components/fieldkit/clock";
import Plate, { type Spot } from "./Plate";
import ScreenViewer from "./ScreenViewer";
import { onIdle } from "@/lib/idle";
import type { ScreenId } from "./plates";

const MODE: Record<ScreenId, "ledger" | "counter" | "analyst"> = { left: "ledger", center: "counter", right: "analyst" };
const BOOKS = [
  ["The Laws of Human Nature", "Robert Greene"],
  ["Mastery", "Robert Greene"],
  ["Quiet", "Susan Cain"],
];

function useMedia(q: string, ssr: boolean) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(q);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(q).matches,
    () => ssr,
  );
}

/** A fixed-size screen scaled to cover its box. */
function Cover({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(Math.max(el.clientWidth / w, el.clientHeight / h)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h]);
  return (
    <div ref={box} className="theme-fixed absolute inset-0 grid place-items-center overflow-hidden bg-white">
      <div style={{ width: w, height: h, transform: `scale(${k})` }} className="shrink-0 overflow-hidden bg-white">
        {children}
      </div>
    </div>
  );
}

/** The landing: my desk, rendered in Blender, with screens you can open and leave. */
export default function DeskHero() {
  const t = useTranslations("home.hero");
  const td = useTranslations("home.desk");
  const router = useRouter();
  const wide = useMedia("(min-width: 1200px)", true);
  const tablet = useMedia("(min-width: 768px)", false);
  const reduce = useReducedMotion();
  const [theme, setTheme] = useTheme();
  const night = theme === "dark";
  const [open, setOpen] = useState<ScreenId | null>(null);
  const [live, setLive] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const time = useAccraClock();

  // the dive: scrolling the first screen pushes into the monitor
  const progress = useMotionValue(0);
  const copyOpacity = useTransform(progress, [0, 0.14], [1, 0]);
  const arrive = useTransform(progress, [0.8, 0.9], [0, 1]);
  const [diving, setDiving] = useState(false);
  const [arrived, setArrived] = useState(false);
  const canDive = wide && !reduce;

  // the live register on the monitor waits for an idle moment
  useEffect(() => {
    if (!wide && !tablet) return;
    return onIdle(() => setLive(true), 3000);
  }, [wide, tablet]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const v = canDive && span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      progress.set(v);
      setDiving(v > 0.02);
      setArrived(v > 0.86);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [canDive, progress]);

  const go = (href: string) => {
    if (href.startsWith("#")) document.querySelector(href)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    else router.push(href);
  };

  const screens = {
    left: { label: td("screens.left"), open: td("open") },
    center: { label: td("screens.center"), open: td("open") },
    right: { label: td("screens.right"), open: td("open") },
  };
  const spots: Spot[] = [
    { id: "lamp", label: td("lamp"), onClick: () => setTheme(night ? "light" : "dark") },
    {
      id: "books",
      label: td("books"),
      card: (
        <>
          <p className="text-white/60 text-[12px]">{td("booksCard")}</p>
          <ul className="mt-2 space-y-1.5">
            {BOOKS.map(([title, author]) => (
              <li key={title}>
                <span className="font-medium text-white">{title}</span> <span className="text-white/60">· {author}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    { id: "phone", label: td("phone"), onClick: () => go("#work-in-motion") },
    { id: "notebook", label: td("notebook"), onClick: () => go("/about#research") },
  ];

  const plate = (view: "desktop" | "phone") => (
    <Plate
      view={view}
      night={night}
      screens={screens}
      spots={spots}
      onOpen={setOpen}
      live={view === "desktop" && live ? <ModeScreen mode="counter" /> : undefined}
      dive={view === "desktop" && canDive ? progress : undefined}
      parallax={view === "desktop" && !diving}
    />
  );

  const viewer = (
    <ScreenViewer open={!!open} label={open ? screens[open].label : ""} onClose={() => setOpen(null)}>
      {open && <ModeScreen mode={MODE[open]} />}
    </ScreenViewer>
  );

  const meta = (
    <p className="mt-8 hidden md:flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--ink-3)]">
      <span className="tabular-nums">Accra {time || "--:--"}</span>
      <span className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
        {t("open")}
      </span>
      <span>{t("count")}</span>
    </p>
  );

  // Phones and narrow windows: headline first, then the desk in its own frame.
  if (!wide) {
    return (
      <section ref={sectionRef} id="top" aria-labelledby="hero-heading" className="relative">
        <div className="px-4 md:px-6 pt-28 pb-8">
          <HeroCopy delay={0.2} />
          {meta}
        </div>
        <div
          className={`relative overflow-hidden ${tablet ? "aspect-[16/9] max-h-[72svh] mx-auto w-full" : "h-[58svh] min-h-[380px] max-h-[640px]"}`}
          role="group"
          aria-label={td("posterAlt")}
        >
          {plate(tablet ? "desktop" : "phone")}
        </div>
        <p className="px-4 pt-3 pb-2 flex items-center justify-center gap-2 text-[12.5px] text-[var(--ink-3)]">
          <MousePointerClick className="w-3.5 h-3.5" aria-hidden /> {tablet ? td("hint") : td("hintTouch")}
        </p>
        {viewer}
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="top" aria-labelledby="hero-heading" className={`relative ${canDive ? "h-[200svh]" : "h-[100svh]"} min-h-[640px]`}>
      <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden" role="group" aria-label={td("posterAlt")}>
        {plate("desktop")}
        <motion.div className="pointer-events-none absolute inset-0 z-10" style={{ opacity: canDive ? copyOpacity : 1 }}>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, var(--background) 0%, color-mix(in srgb, var(--background) 86%, transparent) 30%, transparent 56%)" }}
          />
          <div className="relative h-full max-w-[1440px] mx-auto px-4 md:px-6 flex flex-col justify-center">
            <div className={`${diving ? "pointer-events-none" : "pointer-events-auto"} max-w-[780px]`}>
              <HeroCopy delay={0.2} />
              {meta}
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {!diving && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="theme-fixed pointer-events-none absolute z-10 bottom-5 right-6 rounded-full bg-black/60 text-white/90 px-4 py-2 text-[12.5px] backdrop-blur"
            >
              {td("hint")}
            </motion.p>
          )}
        </AnimatePresence>
        {/* arrival: the same register, flat and sharp, filling the view and ready to use */}
        {canDive && diving && (
          <motion.div className={`absolute inset-0 z-20 ${arrived ? "" : "pointer-events-none"}`} style={{ opacity: arrive }} aria-hidden={!arrived}>
            <Cover w={640} h={400}>
              <ModeScreen mode="counter" />
            </Cover>
            <div className="absolute z-10 left-4 md:left-6 bottom-5 flex items-center gap-3">
              <button
                type="button"
                tabIndex={arrived ? 0 : -1}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="theme-fixed inline-flex items-center gap-2 h-11 pl-3.5 pr-4 rounded-full bg-black/80 text-white text-[13.5px] shadow-lg hover:bg-black"
              >
                <ArrowUp className="w-4 h-4" aria-hidden /> {td("scrollUp")}
              </button>
              <span className="theme-fixed hidden md:inline rounded-full bg-black/55 text-white/85 px-3 py-1.5 text-[12px]">{td("arrived")}</span>
            </div>
          </motion.div>
        )}
      </div>
      {viewer}
    </section>
  );
}
