"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";
import HeroCopy from "@/components/home/HeroCopy";
import ModeScreen from "@/components/fieldkit/ModeScreen";
import { useTheme } from "@/components/fieldkit/ThemeSwitch";
import { useAccraClock } from "@/components/fieldkit/clock";
import { detectTier, type Tier } from "./tier";
import { useSound } from "./sound";
import { kick } from "./activity";
import { useAccraPhase, type Phase } from "./Look";
import type { ScreenId } from "./Laptop";

const DeskScene = dynamic(() => import("./Scene"), { ssr: false });

function useWide() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
}

function useTier(): Tier | null {
  return useSyncExternalStore(
    () => () => {},
    () => detectTier(),
    () => null,
  );
}

/** A fixed-size screen scaled to cover its box (the camera ends with the screen filling the view). */
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

/** The landing: the studio desk, live screens, a ball to play with. */
export default function DeskHero() {
  const t = useTranslations("home.hero");
  const td = useTranslations("home.desk");
  const router = useRouter();
  const tier = useTier();
  const wide = useWide();
  const [theme, setTheme] = useTheme();
  const [sound, setSound] = useSound();
  const [focused, setFocused] = useState<ScreenId | null>(null);
  const [mounted, setMounted] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const time = useAccraClock();
  const reduce = useReducedMotion();
  const accra = useAccraPhase();
  const phase: Phase = theme === "dark" ? "night" : accra;

  // the dive: scrolling the first screen pushes the camera into the laptop
  const dive = useRef(0);
  const [diving, setDiving] = useState(false);
  const progress = useMotionValue(0);
  const copyOpacity = useTransform(progress, [0, 0.14], [1, 0]);
  const arrive = useTransform(progress, [0.8, 0.9], [0, 1]);
  const [arrived, setArrived] = useState(false);

  // Mount the scene after first paint so the headline is never blocked.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // stop rendering entirely once the desk scrolls away
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, [wide]);

  useEffect(() => {
    if (!focused) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setFocused(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [focused]);

  const navigate = (href: string) => {
    if (href.startsWith("#")) document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    else router.push(href);
  };

  const screens = {
    left: { node: <ModeScreen mode="ledger" />, label: td("screens.left") },
    center: { node: <ModeScreen mode="counter" />, label: td("screens.center") },
    right: { node: <ModeScreen mode="analyst" />, label: td("screens.right") },
  };

  const live = mounted && tier && tier !== "still";
  const canDive = !!(wide && live && !reduce);
  // progress through the tall section, measured directly so a height change never leaves it stale
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const v = canDive && span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      progress.set(v);
      dive.current = v;
      setDiving(v > 0.02);
      setArrived(v > 0.86);
      kick(400);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [canDive, progress]);

  const scene = live ? (
    <DeskScene
      tier={tier}
      paused={!onScreen}
      night={theme === "dark"}
      phase={phase}
      dive={dive}
      wide={wide}
      screens={screens}
      focused={focused}
      setFocused={setFocused}
      onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
      onNavigate={navigate}
    />
  ) : (
    <div
      className="absolute inset-0 bg-cover bg-[70%_50%]"
      style={{ backgroundImage: `url(/desk/poster-${theme === "dark" ? "night" : "day"}.webp)` }}
      role="img"
      aria-label={td("posterAlt")}
    />
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

  const controls = (
    <div className="absolute z-10 bottom-4 left-0 right-0 px-4 md:px-6 flex items-end justify-between gap-3 pointer-events-none">
      <AnimatePresence mode="wait">
        {focused ? (
          <motion.button
            key="back"
            type="button"
            onClick={() => setFocused(null)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto theme-fixed inline-flex items-center gap-2 rounded-full bg-black/75 text-white px-4 py-2.5 text-[13px]"
          >
            <ArrowLeft className="w-4 h-4" /> {td("back")}
          </motion.button>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="theme-fixed rounded-full bg-black/55 text-white/85 px-4 py-2 text-[12px] md:text-[12.5px] lg:ml-auto max-w-[70%] md:max-w-none"
          >
            {live ? td("hint") : td("hintStill")}
          </motion.p>
        )}
      </AnimatePresence>
      {live && (
        <button
          type="button"
          onClick={() => setSound(!sound)}
          aria-pressed={sound}
          className="pointer-events-auto theme-fixed shrink-0 inline-flex items-center gap-2 rounded-full bg-black/75 text-white px-3.5 py-2.5 text-[12.5px]"
        >
          {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          {sound ? td("soundOn") : td("soundOff")}
        </button>
      )}
    </div>
  );

  // Phones and narrow windows: headline first, then the desk in its own frame.
  if (!wide) {
    return (
      <section ref={sectionRef} id="top" aria-labelledby="hero-heading" className="relative">
        <div className="px-4 md:px-6 pt-28 pb-8">
          <HeroCopy delay={0.2} />
          {meta}
        </div>
        <div className="relative h-[62svh] min-h-[420px] overflow-hidden bg-[#2a2119]">
          {scene}
          {controls}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="top" aria-labelledby="hero-heading" className={`relative ${canDive ? "h-[220svh]" : "h-[100svh]"} min-h-[640px]`}>
      <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden bg-[#2a2119]">
      {/* the canvas is wider than the viewport and anchored so the desk sits right of the headline */}
      <div className={`absolute inset-y-0 left-0 ${focused || diving ? "w-full" : "w-[140%] translate-x-[5%]"} transition-[width,transform] duration-700`}>
        {scene}
      </div>
      <AnimatePresence>
        {!focused && (
          <motion.div
            key="copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none absolute inset-0 z-10"
          >
            <motion.div className="absolute inset-0" style={{ opacity: canDive ? copyOpacity : 1 }}>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--background) 0%, color-mix(in srgb, var(--background) 88%, transparent) 30%, transparent 58%)",
              }}
            />
            <div className="relative h-full max-w-[1440px] mx-auto px-4 md:px-6 flex flex-col justify-center">
              <div className={`${diving ? "pointer-events-none" : "pointer-events-auto"} max-w-[780px]`}>
                <HeroCopy delay={0.2} />
                {meta}
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {!diving && controls}
      {/* arrival: the same register, flat and sharp, filling the view and ready to use */}
      {canDive && diving && (
        <motion.div className={`absolute inset-0 z-20 ${arrived ? "" : "pointer-events-none"}`} style={{ opacity: arrive }} aria-hidden={!arrived}>
          <Cover w={640} h={400}>
            <ModeScreen mode="counter" />
          </Cover>
        </motion.div>
      )}
      </div>
    </section>
  );
}
