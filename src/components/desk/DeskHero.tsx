"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";
import HeroCopy from "@/components/home/HeroCopy";
import ModeScreen from "@/components/fieldkit/ModeScreen";
import { useTheme } from "@/components/fieldkit/ThemeSwitch";
import { useAccraClock } from "@/components/fieldkit/clock";
import { detectTier, type Tier } from "./tier";
import { useSound } from "./sound";
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

  const scene = live ? (
    <DeskScene
      tier={tier}
      paused={!onScreen}
      night={theme === "dark"}
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
    <section ref={sectionRef} id="top" aria-labelledby="hero-heading" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#2a2119]">
      {/* the canvas is wider than the viewport and anchored so the desk sits right of the headline */}
      <div className={`absolute inset-y-0 left-0 ${focused ? "w-full" : "w-[140%] translate-x-[5%]"} transition-[width,transform] duration-700`}>
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
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--background) 0%, color-mix(in srgb, var(--background) 88%, transparent) 30%, transparent 58%)",
              }}
            />
            <div className="relative h-full max-w-[1440px] mx-auto px-4 md:px-6 flex flex-col justify-center">
              <div className="pointer-events-auto max-w-[780px]">
                <HeroCopy delay={0.2} />
                {meta}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {controls}
    </section>
  );
}
