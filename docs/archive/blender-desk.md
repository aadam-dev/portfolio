# Archive: the Blender desk

This file keeps the code of the desk hero that came before the photographed desk, so it can be read or rebuilt later. Nothing here runs on the site any more.

## What it was

Two generations of a rendered desk, both made in Blender from scratch:

1. **Plates (v3 and v4).** Pre-rendered stills of the desk by day and by night, at several sizes for desktop and phone (`public/desk/plates`). `DeskHero.tsx` laid them out full screen, `Plate.tsx` drew the screens, ball, lamp and curtain on top as positioned layers, and `ScreenViewer.tsx` opened a monitor's content full screen when you clicked it. `plates.ts` held the plate sizes and the screen quads (`screens.json`).
2. **Baked 3D scene (v5).** `scripts/desk-blender` built the room, desk, chair, monitors, mouse, ball and decor in Blender, baked day and evening lighting into textures, and packed them as one `desk.glb` plus WebP lightmaps (`public/desk/3d`). `Desk3D.tsx` loaded it with react-three-fiber, swapped the lightmaps when the lamp was switched, let you roll the chair and the mouse, and showed live screens on the monitors.

## How it worked

- `npm run desk:fetch` (`fetch.mjs`) downloaded the CC0 textures into `.cache/desk-blender`.
- `npm run desk:render` (`render-all.sh`) ran Blender headless: `build.py` modelled the scene, `textures.py` made the procedural materials, `bake.py` baked albedo, day and evening lightmaps per part (with `-m` variants for phones).
- `pack.mjs` and `encode.mjs` turned the bake into `desk.glb`, `desk3d.json` and WebP files.
- At runtime `Desk3D.tsx` multiplied albedo by the chosen lightmap in a small shader and blended between day and evening.

In v6 a final attempt (`scripts/desk-photo/build.py`) rebuilt the photographed desk in Blender, using the solved camera from `solve_camera.py` and the helpers from `desk-blender/build.py`. It did not pass the "looks exactly like the photo" gate, so the live hero became the photo-matched 3D desk instead (`PhotoDesk.tsx`, projective texturing of the real photo onto proxy geometry).

## Why it was replaced

The photographed desk is the real one and reads as real at every size; the renders, however good, read as renders. The photo-matched desk also weighs much less on first load (one photo, a clean plate and a few close-ups instead of a 950 KB model and 50 lightmaps).

## Commits

| Commit | What |
| --- | --- |
| `0d12b72` | v3 P2: 3D desk hero with live screens, ball, water, curtain and lamp |
| `7c36188`, `877f0e1`, `33d72f1` | v3 P9: performance and headline fixes on the plate hero |
| `fd436f7` | v4 J: my desk, rendered in Blender, with screens you can leave |
| `164e073` | Court scorer, chair and basketball, bake pipeline |
| `f9d3e5c` | v5 H: a desk you can use: baked Blender scene, chair, mouse, lamp |
| `0634478` | desk bake: keep every part's texture UVs through the join; `--light` option |
| `6955f78` | v5 H: re-bake so the wall print and phone lock screen face the room |
| `53083f0` | v6 D (wip): camera solve and a Blender rebuild of the photographed desk |
| `1cadf89` | v6 D: the photo-matched desk that replaced it |

Any of these can be checked out to see the desk running: `git checkout 6955f78 -- src/components/desk public/desk scripts/desk-blender`.

## Kept

`scripts/desk-photo/solve_camera.py`, `place.py`, `proxies.py`, `overlay.py` and `camera.json` are still used to build the live desk and were not removed. `public/desk/bloom-boba-desk.webp`, `bloom-boba-scrub.mp4` and `screen-primetijara.*` are still used.

## Removed assets

70 files, 3170 KB in all.

| File | Size |
| --- | ---: |
| `public/desk/3d/ball-albedo-m.webp` | 3.4 KB |
| `public/desk/3d/ball-albedo.webp` | 9.4 KB |
| `public/desk/3d/ball-day-m.webp` | 0.5 KB |
| `public/desk/3d/ball-day.webp` | 1.1 KB |
| `public/desk/3d/ball-evening-m.webp` | 0.3 KB |
| `public/desk/3d/ball-evening.webp` | 0.7 KB |
| `public/desk/3d/chair-albedo-m.webp` | 7.1 KB |
| `public/desk/3d/chair-albedo.webp` | 14.9 KB |
| `public/desk/3d/chair-day-m.webp` | 7.2 KB |
| `public/desk/3d/chair-day.webp` | 18.5 KB |
| `public/desk/3d/chair-evening-m.webp` | 3.7 KB |
| `public/desk/3d/chair-evening.webp` | 10.3 KB |
| `public/desk/3d/decor-albedo-m.webp` | 120.4 KB |
| `public/desk/3d/decor-albedo.webp` | 240.9 KB |
| `public/desk/3d/decor-day-m.webp` | 12.7 KB |
| `public/desk/3d/decor-day.webp` | 23.6 KB |
| `public/desk/3d/decor-evening-m.webp` | 6.3 KB |
| `public/desk/3d/decor-evening.webp` | 13.7 KB |
| `public/desk/3d/desk-albedo-m.webp` | 23.9 KB |
| `public/desk/3d/desk-albedo.webp` | 63.0 KB |
| `public/desk/3d/desk-day-m.webp` | 10.8 KB |
| `public/desk/3d/desk-day.webp` | 26.6 KB |
| `public/desk/3d/desk-evening-m.webp` | 5.6 KB |
| `public/desk/3d/desk-evening.webp` | 15.0 KB |
| `public/desk/3d/desk.glb` | 928.9 KB |
| `public/desk/3d/desk3d.json` | 1.9 KB |
| `public/desk/3d/lockscreen.webp` | 6.7 KB |
| `public/desk/3d/mouse-albedo-m.webp` | 0.7 KB |
| `public/desk/3d/mouse-albedo.webp` | 1.6 KB |
| `public/desk/3d/mouse-day-m.webp` | 0.3 KB |
| `public/desk/3d/mouse-day.webp` | 0.5 KB |
| `public/desk/3d/mouse-evening-m.webp` | 0.2 KB |
| `public/desk/3d/mouse-evening.webp` | 0.4 KB |
| `public/desk/3d/room-albedo-m.webp` | 71.9 KB |
| `public/desk/3d/room-albedo.webp` | 315.8 KB |
| `public/desk/3d/room-day-m.webp` | 2.8 KB |
| `public/desk/3d/room-day.webp` | 7.7 KB |
| `public/desk/3d/room-evening-m.webp` | 1.7 KB |
| `public/desk/3d/room-evening.webp` | 4.5 KB |
| `public/desk/3d/screen-center.webp` | 52.1 KB |
| `public/desk/3d/screen-left.webp` | 14.5 KB |
| `public/desk/3d/screen-right.webp` | 24.6 KB |
| `public/desk/3d/tech-albedo-m.webp` | 34.5 KB |
| `public/desk/3d/tech-albedo.webp` | 65.6 KB |
| `public/desk/3d/tech-day-m.webp` | 20.5 KB |
| `public/desk/3d/tech-day.webp` | 40.8 KB |
| `public/desk/3d/tech-evening-m.webp` | 13.6 KB |
| `public/desk/3d/tech-evening.webp` | 28.9 KB |
| `public/desk/plates/desktop-day-1280.avif` | 31.3 KB |
| `public/desk/plates/desktop-day-1280.webp` | 37.3 KB |
| `public/desk/plates/desktop-day-1920.avif` | 49.7 KB |
| `public/desk/plates/desktop-day-1920.webp` | 61.8 KB |
| `public/desk/plates/desktop-day-2560.avif` | 67.7 KB |
| `public/desk/plates/desktop-day-2560.webp` | 90.0 KB |
| `public/desk/plates/desktop-night-1280.avif` | 22.4 KB |
| `public/desk/plates/desktop-night-1280.webp` | 26.4 KB |
| `public/desk/plates/desktop-night-1920.avif` | 35.8 KB |
| `public/desk/plates/desktop-night-1920.webp` | 46.1 KB |
| `public/desk/plates/desktop-night-2560.avif` | 49.5 KB |
| `public/desk/plates/desktop-night-2560.webp` | 66.7 KB |
| `public/desk/plates/lqip.json` | 1.4 KB |
| `public/desk/plates/phone-day-1200.avif` | 50.7 KB |
| `public/desk/plates/phone-day-1200.webp` | 60.2 KB |
| `public/desk/plates/phone-day-800.avif` | 31.9 KB |
| `public/desk/plates/phone-day-800.webp` | 36.3 KB |
| `public/desk/plates/phone-night-1200.avif` | 33.8 KB |
| `public/desk/plates/phone-night-1200.webp` | 42.4 KB |
| `public/desk/plates/phone-night-800.avif` | 21.4 KB |
| `public/desk/plates/phone-night-800.webp` | 25.6 KB |
| `public/desk/plates/screens.json` | 1.8 KB |

## Removed messages

The `home.desk` strings, used only by `DeskHero.tsx` and `ScreenViewer.tsx`.

### en

```json
{
  "screens": {
    "left": "Delish inventory on Odoo",
    "center": "Al Boyut register",
    "right": "Deal screen"
  },
  "open": "Open",
  "back": "Back to the desk",
  "close": "Close",
  "hint": "Click a screen to use it. Drag the mouse, spin the chair; the lamp switches the lights.",
  "hintTouch": "Tap a screen to open it. Spin the chair, bounce the ball, tap the lamp.",
  "viewerHint": "This is a working copy. Back to the desk any time.",
  "rotate": "Turn your phone sideways for a bigger screen.",
  "lamp": "Lights",
  "lampOn": "Lights on",
  "lampOff": "Lights off",
  "books": "On my desk",
  "booksCard": "On my desk right now:",
  "phone": "Work in motion",
  "notebook": "Research",
  "arrived": "The Al Boyut register, working",
  "scrollUp": "Back to the desk",
  "posterAlt": "My desk in Accra: a monitor showing the Al Boyut register, a laptop with Odoo, a tablet with a deal screen, a keyboard, a mug of coffee, three books, a plant, a lamp, a notebook and a phone."
}
```

### fr

```json
{
  "screens": {
    "left": "Inventaire Delish sur Odoo",
    "center": "Caisse Al Boyut",
    "right": "Analyse de dossier"
  },
  "open": "Ouvrir",
  "back": "Retour au bureau",
  "close": "Fermer",
  "hint": "Cliquez sur un écran pour l'utiliser. Déplacez la souris, faites tourner la chaise ; la lampe allume les lumières.",
  "hintTouch": "Touchez un écran pour l'ouvrir. Faites tourner la chaise, rebondir le ballon, touchez la lampe.",
  "viewerHint": "C'est une copie fonctionnelle. Retour au bureau quand vous voulez.",
  "rotate": "Tournez votre téléphone pour un écran plus grand.",
  "lamp": "Lumières",
  "lampOn": "Allumer",
  "lampOff": "Éteindre",
  "books": "Sur mon bureau",
  "booksCard": "Sur mon bureau en ce moment :",
  "phone": "Le travail en mouvement",
  "notebook": "Recherche",
  "arrived": "La caisse Al Boyut, en marche",
  "scrollUp": "Retour au bureau",
  "posterAlt": "Mon bureau à Accra : un écran avec la caisse Al Boyut, un portable avec Odoo, une tablette avec une analyse de dossier, un clavier, une tasse de café, trois livres, une plante, une lampe, un carnet et un téléphone."
}
```

### ar

```json
{
  "screens": {
    "left": "مخزون Delish على Odoo",
    "center": "نقطة بيع Al Boyut",
    "right": "شاشة الصفقة"
  },
  "open": "افتح",
  "back": "العودة إلى المكتب",
  "close": "إغلاق",
  "hint": "انقر على شاشة لاستخدامها. حرّك الفأرة، أدِر الكرسي؛ المصباح يبدّل الإضاءة.",
  "hintTouch": "المس شاشة لفتحها. أدِر الكرسي، اقفز بالكرة، المس المصباح.",
  "viewerHint": "هذه نسخة عاملة. يمكنك العودة إلى المكتب في أي وقت.",
  "rotate": "أدر هاتفك أفقيًا لشاشة أكبر.",
  "lamp": "الإضاءة",
  "lampOn": "أشعل الضوء",
  "lampOff": "أطفئ الضوء",
  "books": "على مكتبي",
  "booksCard": "على مكتبي الآن:",
  "phone": "العمل أثناء التشغيل",
  "notebook": "البحث",
  "arrived": "نقطة بيع Al Boyut تعمل",
  "scrollUp": "العودة إلى المكتب",
  "posterAlt": "مكتبي في أكرا: شاشة تعرض نقطة بيع Al Boyut، وحاسوب محمول عليه Odoo، وجهاز لوحي عليه شاشة صفقة، ولوحة مفاتيح، وكوب قهوة، وثلاثة كتب، ونبتة، ومصباح، ودفتر، وهاتف."
}
```

## Removed package scripts

```json
"desk:fetch": "node scripts/desk-blender/fetch.mjs",
"desk:render": "scripts/desk-blender/render-all.sh"
```

## Source

### `src/components/desk/DeskHero.tsx`

```tsx
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowUp, MousePointerClick } from "lucide-react";
import { useTranslations } from "next-intl";
import HeroCopy from "@/components/home/HeroCopy";
import ModeScreen from "@/components/fieldkit/ModeScreen";
import { useTheme } from "@/components/fieldkit/ThemeSwitch";
import { useAccraClock } from "@/components/fieldkit/clock";
import Plate, { type Spot } from "./Plate";
import ScreenViewer from "./ScreenViewer";
import { onIdle } from "@/lib/idle";
import type { ScreenId } from "./plates";
import { detectTier, type Tier } from "@/lib/tier";

const Desk3D = dynamic(() => import("./Desk3D"), { ssr: false });

function useTier(): Tier | null {
  return useSyncExternalStore(
    () => () => {},
    () => detectTier(),
    () => null,
  );
}

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

/**
 * The landing: my desk. A live 3D scene baked in Blender where WebGL runs
 * (use the screens, drag the mouse, spin the chair, switch the lamp), and
 * the rendered photograph while it loads or for reduced motion.
 */
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
  const [focused, setFocused] = useState<ScreenId | null>(null);
  const [onScreen, setOnScreen] = useState(true);
  const tier = useTier();
  const three = tier !== null && tier !== "still";
  const dive = useRef(0);
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
      dive.current = v;
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

  // a focused screen: Esc, the Back button, a click on the room, the browser's Back, or scrolling all return to the desk
  const pushed = useRef(false);
  const leave = () => {
    if (pushed.current) history.back();
    else setFocused(null);
  };
  useEffect(() => {
    if (!focused) return;
    if (!pushed.current) {
      history.pushState({ ...(history.state ?? {}), deskFocus: true }, "");
      pushed.current = true;
    }
    const y = window.scrollY;
    const pop = () => {
      pushed.current = false;
      setFocused(null);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && leave();
    const scroll = () => Math.abs(window.scrollY - y) > 80 && leave();
    window.addEventListener("popstate", pop);
    window.addEventListener("keydown", key);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", scroll);
    };
  }, [focused]);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, [wide]);

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

  // the wide layout runs the apps on the screens; phones and tablets show pictures and open the app full screen
  const live3d = (view: "desktop" | "phone", live: boolean) =>
    three ? (
      <Desk3D
        view={view}
        live={live}
        night={night}
        focused={focused}
        paused={!onScreen || !!open}
        onFocus={(id) => (live ? setFocused(id) : setOpen(id))}
        onUnfocus={leave}
        onLamp={() => setTheme(night ? "light" : "dark")}
        onSpot={(id) => go(id === "phone" ? "#work-in-motion" : "/about#research")}
        dive={dive}
        screens={{
          left: { node: <ModeScreen mode="ledger" />, label: screens.left.label },
          center: { node: <ModeScreen mode="counter" />, label: screens.center.label },
          right: { node: <ModeScreen mode="analyst" />, label: screens.right.label },
        }}
      />
    ) : null;

  const backButton = focused && (
    <button
      type="button"
      onClick={leave}
      className="theme-fixed absolute z-30 left-4 md:left-6 top-[84px] inline-flex items-center gap-2 h-12 pl-4 pr-5 rounded-full bg-white text-[#14120f] text-[14.5px] font-medium shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-white/90"
    >
      <ArrowLeft className="w-4 h-4" aria-hidden /> {td("back")}
    </button>
  );

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
          {live3d(tablet ? "desktop" : "phone", false)}
          {backButton}
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
        {live3d("desktop", true)}
        {backButton}
        <motion.div className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ${focused ? "!opacity-0" : ""}`} style={{ opacity: canDive ? copyOpacity : 1 }}>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, var(--background) 0%, color-mix(in srgb, var(--background) 86%, transparent) 30%, transparent 56%)" }}
          />
          <div className="relative h-full max-w-[1440px] mx-auto px-4 md:px-6 flex flex-col justify-center">
            {/* clicks pass through the text to the lamp and laptop behind it; only links and buttons take them */}
            <div className={`pointer-events-none max-w-[780px] ${diving || focused ? "" : "[&_a]:pointer-events-auto [&_button]:pointer-events-auto"}`}>
              <HeroCopy delay={0.2} />
              {meta}
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {!diving && !focused && (
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
```

### `src/components/desk/Desk3D.tsx`

```tsx
"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import meta from "../../../public/desk/3d/desk3d.json";
import type { ScreenId } from "./plates";

/**
 * The desk, live: the Blender scene with its light baked in (albedo times a
 * day or evening lightmap, blended on the GPU), the real apps on the three
 * screens, and the things on it you can use. Drag the mouse and a cursor
 * moves on the monitor; let go without moving to click. Spin the chair,
 * bounce the ball, click the lamp for the lights.
 */
type V3 = [number, number, number];
type Meta = typeof meta & { ball?: { at: V3; radius: number } };
const M = meta as unknown as Meta;
const BASE = "/desk/3d";
const APP_W = 640;
const APP_H = 400;

export type DeskView = "desktop" | "phone";

/* ------------------------------------------------------------------ materials */

const VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const FRAG = /* glsl */ `
uniform sampler2D map; uniform sampler2D lmA; uniform sampler2D lmB;
uniform float mixT; uniform float scale; uniform float exposure; uniform float glow;
varying vec2 vUv;
void main(){
  vec3 a = texture2D(map, vUv).rgb;
  vec3 l = mix(texture2D(lmA, vUv).rgb, texture2D(lmB, vUv).rgb, mixT) * scale;
  gl_FragColor = vec4(a * l * exposure + a * glow, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

/** All the baked materials of the room, blended between day and evening together. */
class Lighting {
  mats: THREE.ShaderMaterial[] = [];
  t = 0;
  target = 0;
  bulb = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffe2b8"), toneMapped: false });
  make(map: THREE.Texture, a: THREE.Texture, b: THREE.Texture) {
    const m = new THREE.ShaderMaterial({ uniforms: { map: { value: map }, lmA: { value: a }, lmB: { value: b }, mixT: { value: this.t }, scale: { value: M.lightScale }, exposure: { value: 1 }, glow: { value: 0 } }, vertexShader: VERT, fragmentShader: FRAG });
    this.mats.push(m);
    return m;
  }
  set(night: boolean) {
    this.target = night ? 1 : 0;
  }
  /** Ease towards the target; true while still moving. */
  step(dt: number) {
    const d = this.target - this.t;
    if (Math.abs(d) < 0.002) this.t = this.target;
    else this.t += d * Math.min(1, dt * 3.2);
    for (const m of this.mats) m.uniforms.mixT.value = this.t;
    this.bulb.color.setRGB(0.35 + 0.65 * this.t, 0.33 + 0.55 * this.t, 0.3 + 0.4 * this.t).multiplyScalar(0.6 + 2.4 * this.t);
    return this.t !== this.target;
  }
  hover(m: THREE.ShaderMaterial | null, on: boolean) {
    if (m) m.uniforms.glow.value = on ? 0.06 : 0;
  }
}

function useTextures(view: DeskView) {
  const s = view === "phone" ? "-m" : "";
  const paths = useMemo(() => {
    const p: Record<string, string> = {};
    for (const g of M.groups) for (const k of ["albedo", "day", "evening"]) p[`${g}-${k}`] = `${BASE}/${g}-${k}${s}.webp`;
    p.lock = `${BASE}/lockscreen.webp`;
    return p;
  }, [s]);
  const tex = useTexture(paths, (t) => {
    for (const x of Array.isArray(t) ? t : [t]) {
      x.flipY = false;
      x.colorSpace = THREE.SRGBColorSpace;
      x.anisotropy = 4;
    }
  });
  return tex as unknown as Record<string, THREE.Texture>;
}

/** Still pictures of the three apps, for screens that aren't live (phones and tablets). */
const SHOTS = { left: `${BASE}/screen-left.webp`, center: `${BASE}/screen-center.webp`, right: `${BASE}/screen-right.webp` };

/* ------------------------------------------------------------------ geometry helpers */

const v = (p: number[]) => new THREE.Vector3(p[0], p[1], p[2]);

/** A screen's frame from its four corners (TL, TR, BR, BL): centre, axes, size. */
function frameOf(q: number[][]) {
  const [tl, tr, , bl] = q.map(v);
  const x = tr.clone().sub(tl);
  const y = tl.clone().sub(bl);
  const w = x.length();
  const h = y.length();
  x.normalize();
  y.normalize();
  const z = new THREE.Vector3().crossVectors(x, y).normalize();
  const c = q.map(v).reduce((a, b) => a.add(b), new THREE.Vector3()).multiplyScalar(0.25);
  const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
  return { c, x, y, z, w, h, quat };
}
const FRAMES = { center: frameOf(M.screens.center), left: frameOf(M.screens.left), right: frameOf(M.screens.right) };

/** Where the camera sits to show a screen: whole ("fit") or filling the view ("cover"). */
function screenPose(f: (typeof FRAMES)["center"], fov: number, aspect: number, mode: "fit" | "cover") {
  const t = Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const d = mode === "fit" ? Math.max(f.h / 2 / t / 0.82, f.w / 2 / (t * aspect) / 0.86) : Math.min(f.h / 2 / t, f.w / 2 / (t * aspect)) * 0.98;
  return { pos: f.c.clone().addScaledVector(f.z, d), look: f.c.clone() };
}

const HOME: Record<DeskView, { pos: V3; look: V3; hfov: number }> = {
  desktop: { pos: [0.28, 1.52, 2.42], look: [-0.38, 0.88, -0.1], hfov: 56 },
  phone: { pos: [0.02, 1.48, 1.72], look: [0.0, 0.86, -0.08], hfov: 54 },
};

/** The camera: home with a little pointer parallax, a glide to a focused screen, or the scroll dive. */
class Rig {
  pos = new THREE.Vector3();
  look = new THREE.Vector3();
  ready = false;
  step(cam: THREE.PerspectiveCamera, view: DeskView, aspect: number, pointer: THREE.Vector2, focus: ScreenId | null, dive: number, dt: number) {
    const home = HOME[view];
    cam.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(home.hfov / 2)) / aspect));
    cam.fov = Math.min(cam.fov, 74);
    let tp = v(home.pos);
    let tl = v(home.look);
    if (!focus) {
      tp.x += pointer.x * 0.06;
      tp.y += pointer.y * 0.03;
    }
    const e = Math.min(1, Math.max(0, (dive - 0.04) / 0.82));
    const ease = e * e * (3 - 2 * e);
    if (focus) {
      const p = screenPose(FRAMES[focus], cam.fov, aspect, "fit");
      tp = p.pos;
      tl = p.look;
    } else if (ease > 0) {
      const p = screenPose(FRAMES.center, cam.fov, aspect, "cover");
      tp.lerp(p.pos, ease);
      tl.lerp(p.look, ease);
    }
    if (!this.ready) {
      this.pos.copy(tp);
      this.look.copy(tl);
      this.ready = true;
    }
    const k = 1 - Math.exp(-dt * (focus ? 4.5 : ease > 0 ? 14 : 3.5));
    this.pos.lerp(tp, k);
    this.look.lerp(tl, k);
    cam.position.copy(this.pos);
    cam.lookAt(this.look);
    cam.updateProjectionMatrix();
  }
}

/** The chair and the ball move; this holds their motion between frames. */
class Toys {
  chair = 0;
  chairV = 0;
  chairDrag = false;
  ballY = 0;
  ballV = 0;
  ballSpin = 0;
  step(dt: number) {
    if (!this.chairDrag) {
      this.chair += this.chairV * dt;
      this.chairV *= Math.exp(-dt * 1.4);
      if (Math.abs(this.chairV) < 0.01) this.chairV = 0;
    }
    if (this.ballV !== 0 || this.ballY > 0) {
      this.ballV -= 9.8 * dt;
      this.ballY += this.ballV * dt;
      this.ballSpin += dt * 3;
      if (this.ballY <= 0) {
        this.ballY = 0;
        this.ballV = Math.abs(this.ballV) > 0.6 ? -this.ballV * 0.62 : 0;
      }
    }
    return this.chairV !== 0 || this.chairDrag || this.ballV !== 0 || this.ballY > 0;
  }
  grab() {
    this.chairDrag = true;
  }
  turn(dx: number) {
    this.chair += dx * 0.012;
    this.chairV = dx * 0.7;
  }
  release(tap: boolean) {
    this.chairDrag = false;
    if (tap) this.chairV += 5;
  }
  bounce() {
    this.ballV = 2.6;
  }
}

/** AgX tone mapping, set once on the renderer. */
function tone(gl: THREE.WebGLRenderer) {
  gl.toneMapping = THREE.AgXToneMapping;
  gl.toneMappingExposure = 1.05;
}

/* ------------------------------------------------------------------ the scene */

function Label({ at, children }: { at: V3 | THREE.Vector3; children: ReactNode }) {
  return (
    <Html position={at as V3} center zIndexRange={[20, 10]} style={{ pointerEvents: "none" }}>
      <span className="theme-fixed whitespace-nowrap rounded-full bg-black/80 px-2.5 py-1 text-[11.5px] text-white shadow-lg">{children}</span>
    </Html>
  );
}

function Steam({ at }: { at: V3 }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d")!;
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(255,255,255,0.55)");
    r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);
  const puffs = useRef<THREE.Sprite[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    puffs.current.forEach((s, i) => {
      if (!s) return;
      const life = (t * 0.32 + i / 6) % 1;
      s.position.set(at[0] + Math.sin(t * 1.3 + i) * 0.012 * life, at[1] + 0.01 + life * 0.17, at[2] + Math.cos(t + i) * 0.008 * life);
      s.scale.setScalar(0.03 + life * 0.07);
      (s.material as THREE.SpriteMaterial).opacity = Math.sin(life * Math.PI) * 0.35;
    });
  });
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => (
        <sprite key={i} ref={(s) => void (puffs.current[i] = s!)}>
          <spriteMaterial map={tex} transparent depthWrite={false} opacity={0} toneMapped={false} />
        </sprite>
      ))}
    </>
  );
}

interface SceneProps {
  view: DeskView;
  night: boolean;
  focused: ScreenId | null;
  onFocus: (id: ScreenId) => void;
  onLamp: () => void;
  onSpot: (id: "books" | "phone" | "notebook") => void;
  screens: Record<ScreenId, { node: ReactNode; label: string }>;
  dive: { current: number };
  /** live apps on the screens (desktop); otherwise still images, and a tap opens the app full screen */
  live: boolean;
  onReady: () => void;
}

function Scene({ view, night, focused, onFocus, onLamp, onSpot, screens, dive, live, onReady }: SceneProps) {
  const gltf = useGLTF(`${BASE}/desk.glb`, false, true);
  const tex = useTextures(view);
  const { camera, size, pointer, gl } = useThree();
  const light = useMemo(() => new Lighting(), []);
  const rig = useMemo(() => new Rig(), []);
  const toys = useMemo(() => new Toys(), []);
  const mats = useMemo(() => Object.fromEntries(M.groups.map((g) => [g, light.make(tex[`${g}-albedo`], tex[`${g}-day`], tex[`${g}-evening`])])) as Record<string, THREE.ShaderMaterial>, [light, tex]);
  const lockMat = useMemo(() => new THREE.MeshBasicMaterial({ map: tex.lock, toneMapped: false }), [tex]);
  const shots = useTexture(SHOTS, (t) => {
    for (const x of Array.isArray(t) ? t : [t]) x.colorSpace = THREE.SRGBColorSpace;
  }) as unknown as Record<ScreenId, THREE.Texture>;
  const [hover, setHover] = useState<string | null>(null);
  const [books, setBooks] = useState(false);
  const chairRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Group>(null);
  const mouseRef = useRef<THREE.Group>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const centerEl = useRef<HTMLDivElement>(null);
  const drag = useRef<{ kind: "mouse" | "chair"; x: number; moved: number; last: number } | null>(null);

  useEffect(() => {
    light.set(night);
  }, [light, night]);
  useEffect(() => {
    tone(gl);
    onReady();
  }, [gl, onReady]);

  // Blender suffixes a clashing name (".001", which three.js loads as "001"); match on the base name
  const nodes = useMemo(() => Object.fromEntries(Object.entries(gltf.nodes).map(([k, n]) => [k.replace(/\.?\d{3}$/, ""), n])), [gltf.nodes]) as Record<string, THREE.Mesh>;
  const pivot = (g: string) => (g === "chair" ? v(M.chair.at) : g === "mouse" ? v(M.mouse.at) : g === "ball" && M.ball ? v(M.ball.at) : null);

  // the mouse travels on the felt mat; its spot on the mat is the cursor's spot on the monitor
  const pad = M.mousepad;
  const padRect = { x0: pad.center[0] - pad.size[0] / 2 + 0.04, x1: pad.center[0] + pad.size[0] / 2 - 0.04, z0: pad.center[2] - pad.size[1] / 2 + 0.05, z1: pad.center[2] + pad.size[1] / 2 - 0.05 };
  const mouseHome = v(M.mouse.at);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -mouseHome.y), [mouseHome.y]);
  const placeCursor = (x: number, z: number) => {
    const u = (x - padRect.x0) / (padRect.x1 - padRect.x0);
    const w = (z - padRect.z0) / (padRect.z1 - padRect.z0);
    const el = cursorRef.current;
    if (el) el.style.transform = `translate(${(u * APP_W).toFixed(1)}px, ${(w * APP_H).toFixed(1)}px)`;
  };
  const clickAtCursor = () => {
    const el = cursorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.visibility = "hidden";
    const target = document.elementFromPoint(r.left + 1, r.top + 1) as HTMLElement | null;
    el.style.visibility = "";
    if (target && centerEl.current?.contains(target)) target.click();
  };

  useFrame((_, dt) => {
    // in development, browser tests read the live camera from here
    if (process.env.NODE_ENV === "development") (window as unknown as { __desk: unknown }).__desk = { camera, size, gl };
    const d = Math.min(dt, 1 / 20);
    light.step(d);
    toys.step(d);
    if (chairRef.current) chairRef.current.rotation.y = toys.chair;
    if (ballRef.current) {
      ballRef.current.position.y = (M.ball?.at[1] ?? 0) + toys.ballY;
      ballRef.current.rotation.x = toys.ballSpin;
    }
    rig.step(camera as THREE.PerspectiveCamera, view, size.width / size.height, pointer, focused, dive.current, d);
  });

  const down = (kind: "mouse" | "chair") => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as unknown as Element)?.setPointerCapture?.(e.pointerId);
    drag.current = { kind, x: e.clientX, moved: 0, last: e.clientX };
    if (kind === "chair") toys.grab();
  };
  const move = (e: ThreeEvent<PointerEvent>) => {
    const g = drag.current;
    if (!g) return;
    g.moved += Math.abs(e.clientX - g.last);
    if (g.kind === "chair") {
      const dx = e.clientX - g.last;
      toys.turn(dx);
    } else {
      const p = new THREE.Vector3();
      if (e.ray.intersectPlane(plane, p) && mouseRef.current) {
        const x = THREE.MathUtils.clamp(p.x, padRect.x0, padRect.x1);
        const z = THREE.MathUtils.clamp(p.z, padRect.z0, padRect.z1);
        mouseRef.current.position.set(x, mouseHome.y, z);
        placeCursor(x, z);
        g.moved += 1;
      }
    }
    g.last = e.clientX;
  };
  const up = (e: ThreeEvent<PointerEvent>) => {
    const g = drag.current;
    drag.current = null;
    if (!g) return;
    e.stopPropagation();
    if (g.kind === "chair") {
      toys.release(g.moved < 3);
    } else if (g.moved < 3) clickAtCursor();
  };
  const hoverOn = (id: string, mat?: THREE.ShaderMaterial) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(id);
    light.hover(mat ?? null, true);
    document.body.style.cursor = id === "chair" || id === "mouse" ? "grab" : "pointer";
  };
  const hoverOff = (mat?: THREE.ShaderMaterial) => () => {
    setHover(null);
    light.hover(mat ?? null, false);
    document.body.style.cursor = "";
  };

  return (
    <>
      {M.groups.map((g) => {
        const n = nodes[g];
        if (!n) return null;
        const p = pivot(g);
        const mesh = (
          <mesh
            geometry={n.geometry}
            material={mats[g]}
            position={p ? n.position.clone().sub(p) : n.position}
            quaternion={n.quaternion}
            scale={n.scale}
            onPointerDown={g === "chair" ? down("chair") : g === "mouse" ? down("mouse") : undefined}
            onPointerMove={g === "chair" || g === "mouse" ? move : undefined}
            onPointerUp={g === "chair" || g === "mouse" ? up : undefined}
            onClick={g === "ball" ? (e) => (e.stopPropagation(), toys.bounce()) : undefined}
            onPointerOver={g === "chair" || g === "mouse" || g === "ball" ? hoverOn(g, mats[g]) : undefined}
            onPointerOut={g === "chair" || g === "mouse" || g === "ball" ? hoverOff(mats[g]) : undefined}
          />
        );
        if (!p) return <group key={g}>{mesh}</group>;
        return (
          <group key={g} ref={g === "chair" ? chairRef : g === "ball" ? ballRef : g === "mouse" ? mouseRef : undefined} position={p}>
            {mesh}
          </group>
        );
      })}
      {nodes.phone_screen && <mesh geometry={nodes.phone_screen.geometry} material={lockMat} position={nodes.phone_screen.position} quaternion={nodes.phone_screen.quaternion} scale={nodes.phone_screen.scale} />}
      {nodes.bulb && <mesh geometry={nodes.bulb.geometry} material={light.bulb} position={nodes.bulb.position} quaternion={nodes.bulb.quaternion} scale={nodes.bulb.scale} />}

      {/* the three screens, running the real apps */}
      {(Object.keys(FRAMES) as ScreenId[]).map((id) => {
        const f = FRAMES[id];
        const px = APP_W;
        if (!live)
          return (
            <mesh
              key={id}
              position={f.c}
              quaternion={f.quat}
              onClick={(e) => {
                e.stopPropagation();
                onFocus(id);
              }}
              onPointerOver={() => setHover(`screen-${id}`)}
              onPointerOut={() => setHover(null)}
            >
              <planeGeometry args={[f.w, f.h]} />
              <meshBasicMaterial map={shots[id]} toneMapped={false} />
            </mesh>
          );
        return (
          <group key={id} position={f.c} quaternion={f.quat}>
            <mesh position={[0, 0, -0.0004]}>
              <planeGeometry args={[f.w, f.h]} />
              <meshBasicMaterial color="#0b0b0c" />
            </mesh>
            <Html transform distanceFactor={(400 * f.w) / px} zIndexRange={[5, 0]} style={{ width: px, height: APP_H }}>
              <div ref={id === "center" ? centerEl : undefined} className="theme-fixed relative overflow-hidden bg-white select-none" style={{ width: px, height: APP_H }}>
                {screens[id].node}
                {id === "center" && (
                  <div ref={cursorRef} aria-hidden className="pointer-events-none absolute left-0 top-0 z-50" style={{ transform: "translate(420px, 170px)" }}>
                    <svg width="16" height="22" viewBox="0 0 16 22">
                      <path d="M1 1 L1 17 L5 13 L8 20 L11 19 L8 12 L14 12 Z" fill="#111" stroke="#fff" strokeWidth="1.4" />
                    </svg>
                  </div>
                )}
                {focused !== id && (
                  <button
                    type="button"
                    aria-label={`Open the ${screens[id].label} screen`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFocus(id);
                    }}
                    onPointerEnter={() => setHover(`screen-${id}`)}
                    onPointerLeave={() => setHover(null)}
                    className="absolute inset-0 cursor-zoom-in bg-transparent hover:bg-white/5 transition-colors"
                  />
                )}
              </div>
            </Html>
          </group>
        );
      })}

      {/* the lamp, books, phone and notebook take a click; invisible handles sit on them */}
      {(
        [
          ["lamp", M.lamp.shade, 0.1],
          ["books", M.hotspots.books, 0.13],
          ["phone", M.hotspots.phone, 0.07],
          ["notebook", M.hotspots.notebook, 0.1],
        ] as [string, number[], number][]
      ).map(([id, at, r]) => (
        <mesh
          key={id}
          position={at as V3}
          onClick={(e) => {
            e.stopPropagation();
            if (id === "lamp") onLamp();
            else if (id === "books") setBooks((b) => !b);
            else onSpot(id as "phone" | "notebook");
          }}
          onPointerOver={hoverOn(id)}
          onPointerOut={hoverOff()}
        >
          <sphereGeometry args={[r, 12, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
      <Steam at={M.steam as V3} />

      {hover === "lamp" && <Label at={v(M.lamp.shade).add(new THREE.Vector3(0, 0.12, 0))}>{night ? "Lamp off, daylight" : "Lamp on"}</Label>}
      {hover === "books" && !books && <Label at={v(M.hotspots.books).add(new THREE.Vector3(0, 0.1, 0))}>On my desk</Label>}
      {hover === "phone" && <Label at={v(M.hotspots.phone).add(new THREE.Vector3(0, 0.08, 0))}>Work in motion</Label>}
      {hover === "notebook" && <Label at={v(M.hotspots.notebook).add(new THREE.Vector3(0, 0.08, 0))}>Research</Label>}
      {hover === "chair" && <Label at={v(M.chair.at).add(new THREE.Vector3(0, 1.32, 0))}>Drag to spin</Label>}
      {hover === "mouse" && <Label at={v(M.mouse.at).add(new THREE.Vector3(0, 0.07, 0))}>Drag me, tap to click</Label>}
      {hover === "ball" && M.ball && <Label at={v(M.ball.at).add(new THREE.Vector3(0, 0.2, 0))}>Bounce it</Label>}
      {books && (
        <Html position={v(M.hotspots.books).add(new THREE.Vector3(0, 0.16, 0)).toArray()} center zIndexRange={[30, 20]}>
          <div className="theme-fixed w-[240px] rounded-2xl bg-[#16130f]/95 p-4 text-[13px] leading-relaxed text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]" onClick={() => setBooks(false)}>
            <p className="text-[12px] text-white/60">On my desk right now:</p>
            <ul className="mt-2 space-y-1">
              <li>
                <b>The Laws of Human Nature</b> <span className="text-white/60">· Robert Greene</span>
              </li>
              <li>
                <b>Mastery</b> <span className="text-white/60">· Robert Greene</span>
              </li>
              <li>
                <b>Quiet</b> <span className="text-white/60">· Susan Cain</span>
              </li>
            </ul>
          </div>
        </Html>
      )}
    </>
  );
}

export default function Desk3D(props: Omit<SceneProps, "onReady"> & { paused: boolean; onUnfocus: () => void }) {
  const [ready, setReady] = useState(false);
  const { paused, onUnfocus, ...scene } = props;
  return (
    <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: ready ? 1 : 0 }}>
      <Canvas
        frameloop={paused ? "never" : "always"}
        dpr={[1, props.view === "phone" ? 1.5 : 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 34, near: 0.03, far: 30, position: HOME[props.view].pos }}
        onPointerMissed={() => props.focused && onUnfocus()}
      >
        <color attach="background" args={["#1a1410"]} />
        <Suspense fallback={null}>
          <Scene {...scene} onReady={() => setReady(true)} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(`${BASE}/desk.glb`, false, true);
```

### `src/components/desk/Plate.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, type MotionValue } from "framer-motion";
import { BookOpen, Lamp, NotebookPen, Smartphone } from "lucide-react";
import { onIdle } from "@/lib/idle";
import lqip from "../../../public/desk/plates/lqip.json";
import { bounds, coverFit, fallback, FOCUS, PLATES, quadMatrix, srcset, toBox, type HotspotId, type Pt, type ScreenId, type View } from "./plates";

const APP_W = 640;
const APP_H = 400;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export interface Spot {
  id: HotspotId;
  label: string;
  /** Text shown in the card when the spot is opened (books); otherwise the spot acts on click. */
  card?: React.ReactNode;
  onClick?: () => void;
}

function Picture({ view, phase, show, priority, load }: { view: View; phase: "day" | "night"; show: boolean; priority: boolean; load: boolean }) {
  const [fx, fy] = FOCUS[view];
  const sizes = view === "desktop" ? "max(100vw, 178svh)" : "100vw";
  if (!load) return null;
  return (
    <picture>
      <source type="image/avif" srcSet={srcset(view, phase, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(view, phase, "webp")} sizes={sizes} />
      <img
        src={fallback(view, phase)}
        alt=""
        draggable={false}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
        className="absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-700"
        style={{ objectPosition: `${fx * 100}% ${fy * 100}%`, opacity: show ? 1 : 0 }}
      />
    </picture>
  );
}

/** Wisps of steam over the coffee, drawn as soft strokes. */
function Steam({ at, k }: { at: Pt; k: number }) {
  const w = 90 * k * 2.2;
  const h = 170 * k * 2.2;
  return (
    <svg aria-hidden className="desk-steam pointer-events-none absolute" width={w} height={h} viewBox="0 0 60 120" style={{ left: at[0] - w / 2, top: at[1] - h }}>
      <defs>
        <filter id="steam-blur" x="-50%" y="-20%" width="200%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <g filter="url(#steam-blur)" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.2" strokeLinecap="round">
        <path d="M30 118 C 22 100, 38 86, 30 70 S 22 40, 30 20" />
        <path d="M22 118 C 14 98, 30 84, 22 66 S 16 44, 22 30" />
        <path d="M38 118 C 46 100, 32 86, 40 70 S 46 46, 38 32" />
      </g>
    </svg>
  );
}

/**
 * The rendered desk, cover-fitted to its box, with the screens and objects
 * on it made clickable. Everything is positioned from the render's own
 * projection data, so it lines up at any size.
 */
export default function Plate({
  view,
  night,
  screens,
  spots,
  onOpen,
  live,
  dive,
  parallax = false,
}: {
  view: View;
  night: boolean;
  screens: Record<ScreenId, { label: string; open: string }>;
  spots: Spot[];
  onOpen: (id: ScreenId) => void;
  /** a live copy of the centre screen, laid on the rendered one */
  live?: React.ReactNode;
  dive?: MotionValue<number>;
  parallax?: boolean;
}) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<[number, number] | null>(null);
  const [hover, setHover] = useState<ScreenId | null>(null);
  const [card, setCard] = useState<HotspotId | null>(null);
  const [warm, setWarm] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize([el.clientWidth, el.clientHeight]));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // fetch the other lighting once the page is idle, so the lamp switch is instant
  useEffect(() => {
    return onIdle(() => setWarm(true), 5000);
  }, []);

  // close an open card on outside click or Esc
  useEffect(() => {
    if (!card) return;
    const off = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof PointerEvent && (e.target as HTMLElement).closest?.("[data-spot]")) return;
      setCard(null);
    };
    window.addEventListener("pointerdown", off);
    window.addEventListener("keydown", off);
    return () => {
      window.removeEventListener("pointerdown", off);
      window.removeEventListener("keydown", off);
    };
  }, [card]);

  const plate = PLATES[view];
  const fit = size ? coverFit(view, size[0], size[1]) : null;
  const quads = fit ? (Object.fromEntries((Object.keys(plate.screens) as ScreenId[]).map((id) => [id, plate.screens[id].map((p) => toBox(fit, p))])) as Record<ScreenId, Pt[]>) : null;
  const center = quads ? bounds(quads.center) : null;

  // the dive: scale the whole desk about the centre screen until it fills the view
  const apply = (v: number) => {
    const el = stage.current;
    if (!el || !center || !size) return;
    const e = ease(Math.min(1, Math.max(0, (v - 0.04) / 0.8)));
    if (e <= 0) {
      el.style.transform = "";
      return;
    }
    const S = Math.max(size[0] / center.w, size[1] / center.h) * 1.04;
    const s = Math.pow(S, e);
    el.style.transformOrigin = `${center.cx}px ${center.cy}px`;
    el.style.transform = `translate3d(${(size[0] / 2 - center.cx) * e}px, ${(size[1] / 2 - center.cy) * e}px, 0) scale(${s})`;
  };
  const applyRef = useRef(apply);
  useEffect(() => {
    applyRef.current = apply;
    if (dive) apply(dive.get());
  });
  useEffect(() => (dive ? dive.on("change", (v) => applyRef.current(v)) : undefined), [dive]);

  // a few pixels of parallax with the pointer
  const onMove = (e: React.PointerEvent) => {
    if (!parallax || reduce || e.pointerType !== "mouse" || !inner.current || !size) return;
    const r = box.current!.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * -8;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * -5;
    inner.current.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(1.012)`;
  };

  const phase = night ? "night" : "day";
  const bg = (lqip as Record<string, string>)[`${view}-${phase}`];

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden" onPointerMove={onMove} style={{ background: night ? "#1a140f" : "#d9d1c4" }}>
      <div ref={stage} className="absolute inset-0">
        <div ref={inner} className="absolute inset-0 transition-transform duration-300 ease-out">
          {bg && <div aria-hidden className="absolute inset-0 bg-cover blur-xl scale-105" style={{ backgroundImage: `url(${bg})`, backgroundPosition: `${FOCUS[view][0] * 100}% ${FOCUS[view][1] * 100}%` }} />}
          <Picture view={view} phase="day" show={!night} priority={!night} load={!night || warm} />
          <Picture view={view} phase="night" show={night} priority={night} load={night || warm} />

          {fit && quads && (
            <>
              {/* the live centre screen sits exactly on the rendered one */}
              {live && (
                <div
                  aria-hidden
                  className="theme-fixed pointer-events-none absolute left-0 top-0 overflow-hidden bg-white"
                  style={{ width: APP_W, height: APP_H, transformOrigin: "0 0", transform: quadMatrix(APP_W, APP_H, quads.center), filter: night ? "brightness(0.95)" : "brightness(0.93) saturate(0.92)" }}
                >
                  {live}
                </div>
              )}

              <svg aria-hidden className="pointer-events-none absolute inset-0 w-full h-full">
                {(Object.keys(quads) as ScreenId[]).map((id) => (
                  <polygon
                    key={id}
                    points={quads[id].map((p) => p.join(",")).join(" ")}
                    fill={hover === id ? "rgba(255,255,255,0.06)" : "transparent"}
                    stroke={hover === id ? "var(--accent)" : "transparent"}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    className="transition-[stroke,fill] duration-200"
                  />
                ))}
              </svg>

              {(Object.keys(quads) as ScreenId[]).map((id) => {
                const b = bounds(quads[id]);
                // small screens (phones) get a generous rectangle to tap; big ones follow the screen's outline
                const small = b.w < 90 || b.h < 56;
                const w = small ? Math.max(b.w + 16, 64) : b.w;
                const h = small ? Math.max(b.h + 16, 52) : b.h;
                const x0 = small ? b.cx - w / 2 : b.x;
                const y0 = small ? b.cy - h / 2 : b.y;
                const clip = small ? undefined : `polygon(${quads[id].map(([x, y]) => `${(x - b.x).toFixed(1)}px ${(y - b.y).toFixed(1)}px`).join(", ")})`;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onOpen(id)}
                    onPointerEnter={() => setHover(id)}
                    onPointerLeave={() => setHover((h) => (h === id ? null : h))}
                    onFocus={() => setHover(id)}
                    onBlur={() => setHover((h) => (h === id ? null : h))}
                    aria-label={`${screens[id].open}: ${screens[id].label}`}
                    className="absolute cursor-zoom-in outline-none"
                    style={{ left: x0, top: y0, width: w, height: h, clipPath: clip }}
                  />
                );
              })}
              {hover && (
                <p
                  aria-hidden
                  className="theme-fixed pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full bg-black/80 text-white px-3 py-1.5 text-[12px] shadow-lg"
                  style={{ left: bounds(quads[hover]).cx, top: bounds(quads[hover]).y - 8 }}
                >
                  {screens[hover].open} · {screens[hover].label}
                </p>
              )}

              {!reduce && <Steam at={toBox(fit, plate.hotspots.coffee)} k={fit.k} />}

              {spots.map((s) => {
                const [x, y] = toBox(fit, plate.hotspots[s.id]);
                const Icon = { lamp: Lamp, books: BookOpen, phone: Smartphone, notebook: NotebookPen, coffee: Lamp }[s.id];
                const open = card === s.id;
                return (
                  <div key={s.id} data-spot className="theme-fixed absolute" style={{ left: x, top: y }}>
                    <button
                      type="button"
                      aria-label={s.label}
                      aria-expanded={s.card ? open : undefined}
                      onClick={() => (s.card ? setCard(open ? null : s.id) : s.onClick?.())}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full outline-none"
                    >
                      <span className="desk-spot relative grid place-items-center w-[18px] h-[18px] rounded-full bg-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.35)] ring-4 ring-white/25 transition-transform duration-200 group-hover:scale-110 group-focus-visible:ring-[var(--accent)]">
                        <span className="w-[6px] h-[6px] rounded-full bg-[#14120f]" />
                      </span>
                      <span className="theme-fixed pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/80 text-white px-2.5 py-1 text-[11.5px] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                        <Icon className="w-3 h-3" aria-hidden /> {s.label}
                      </span>
                    </button>
                    {s.card && open && (
                      <div role="dialog" aria-label={s.label} className="theme-fixed absolute right-0 bottom-6 w-[min(280px,80vw)] rounded-2xl bg-[#16130f]/95 backdrop-blur text-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-[13px] leading-relaxed">
                        {s.card}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

### `src/components/desk/plates.ts`

```ts
import data from "../../../public/desk/plates/screens.json";

/** The desk is a Blender render; these are its screens and hotspots in render pixels. */
export type ScreenId = "left" | "center" | "right";
export type HotspotId = "lamp" | "books" | "coffee" | "phone" | "notebook";
export type View = "desktop" | "phone";
export type Pt = [number, number];
export interface PlateData {
  w: number;
  h: number;
  screens: Record<ScreenId, Pt[]>;
  hotspots: Record<HotspotId, Pt>;
}

export const PLATES = data as unknown as Record<View, PlateData>;

/** Where the crop sits when the plate is wider or taller than its box (object-position). */
export const FOCUS: Record<View, Pt> = { desktop: [0.9, 0.55], phone: [0.5, 0.62] };

const WIDTHS: Record<View, number[]> = { desktop: [1280, 1920, 2560], phone: [800, 1200] };
export const srcset = (view: View, phase: "day" | "night", ext: "avif" | "webp") =>
  WIDTHS[view].map((w) => `/desk/plates/${view}-${phase}-${w}.${ext} ${w}w`).join(", ");
export const fallback = (view: View, phase: "day" | "night") => `/desk/plates/${view}-${phase}-${WIDTHS[view][1] ?? WIDTHS[view][0]}.webp`;

/** The cover fit of the plate in a box: scale and offset, matching CSS object-fit: cover. */
export function coverFit(view: View, cw: number, ch: number) {
  const p = PLATES[view];
  const k = Math.max(cw / p.w, ch / p.h);
  const [fx, fy] = FOCUS[view];
  return { k, x: (cw - p.w * k) * fx, y: (ch - p.h * k) * fy };
}

export const toBox = (fit: { k: number; x: number; y: number }, [x, y]: Pt): Pt => [fit.x + x * fit.k, fit.y + y * fit.k];

/**
 * CSS matrix3d that maps a w x h element onto a quad (TL, TR, BR, BL),
 * so a live screen lands exactly on the rendered one.
 */
export function quadMatrix(w: number, h: number, q: Pt[]) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = den ? (dx3 * dy2 - dx2 * dy3) / den : 0;
  const hh = den ? (dx1 * dy3 - dx3 * dy1) / den : 0;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
  // unit square -> quad, then scale the element's w x h down to the unit square
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${m.map((v) => +v.toFixed(8)).join(",")})`;
}

export function bounds(q: Pt[]) {
  const xs = q.map((p) => p[0]), ys = q.map((p) => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y, cx: (Math.min(...xs) + Math.max(...xs)) / 2, cy: (Math.min(...ys) + Math.max(...ys)) / 2 };
}
```

### `src/components/desk/ScreenViewer.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, RotateCw, X } from "lucide-react";
import { useTranslations } from "next-intl";

const HINT_KEY = "desk-viewer-hint";
const W = 640;
const H = 400;

/**
 * The app at its design size, scaled to fit the space it is given. On a
 * portrait phone it turns sideways, which nearly doubles its size; turning
 * the phone then reads it upright.
 */
function Fit({ children, onTurn }: { children: React.ReactNode; onTurn: (turned: boolean) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ k: 0, turned: false });
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const cw = el.clientWidth, ch = el.clientHeight;
      const flat = Math.min(cw / W, ch / H);
      const side = Math.min(cw / H, ch / W);
      const turned = cw < 700 && side > flat * 1.3;
      setFit({ k: turned ? side : flat, turned });
      onTurn(turned);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [onTurn]);
  const { k, turned } = fit;
  const bw = (turned ? H : W) * k, bh = (turned ? W : H) * k;
  return (
    <div ref={box} className="pointer-events-none relative w-full h-full grid place-items-center overflow-hidden">
      <div className="pointer-events-auto theme-fixed shrink-0 overflow-hidden rounded-[10px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]" style={{ width: bw, height: bh, visibility: k ? "visible" : "hidden" }}>
        <div style={{ width: W, height: H, transformOrigin: "0 0", transform: turned ? `translate(${H * k}px, 0) rotate(90deg) scale(${k})` : `scale(${k})` }}>{children}</div>
      </div>
    </div>
  );
}

/**
 * One desk screen, opened full size. Every way out works: the Back button,
 * the close button, Esc, a tap on the backdrop, the phone's back gesture
 * (it owns one history entry) and a swipe down on the bar.
 */
export default function ScreenViewer({ open, label, onClose, children }: { open: boolean; label: string; onClose: () => void; children: React.ReactNode }) {
  const t = useTranslations("home.desk");
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const pushed = useRef(false);
  const [hint, setHint] = useState(false);
  const [turned, setTurned] = useState(false);
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);

  // closing goes through history, so the entry is always given back
  const dismiss = () => {
    if (pushed.current) history.back();
    else close.current();
  };

  // history entry, Esc, focus, scroll lock
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    // one history entry per opening, so Back closes it (guarded for effect re-runs)
    if (!pushed.current) {
      history.pushState({ ...(history.state ?? {}), deskViewer: true }, "");
      pushed.current = true;
    }
    const onPop = () => {
      pushed.current = false;
      close.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
      }
      if (e.key === "Tab" && panel.current) {
        const f = [...panel.current.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")].filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    const y = window.scrollY;
    html.style.overflow = "hidden";
    const f = requestAnimationFrame(() => back.current?.focus({ preventScroll: true }));
    let seen = false;
    try {
      seen = localStorage.getItem(HINT_KEY) === "1";
      localStorage.setItem(HINT_KEY, "1");
    } catch {}
    const h0 = window.setTimeout(() => setHint(!seen), 0);
    const h1 = window.setTimeout(() => setHint(false), 5200);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
      // leave the page exactly where it was, whatever the history step did
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior }));
      cancelAnimationFrame(f);
      window.clearTimeout(h0);
      window.clearTimeout(h1);
      const el = opener.current as HTMLElement | null;
      el?.focus?.({ preventScroll: true });
    };
  }, [open]);


  // swipe down on the bar or the backdrop closes it on phones
  const start = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (start.current = e.touches[0].clientY);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (start.current != null && e.changedTouches[0].clientY - start.current > 70) dismiss();
    start.current = null;
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="viewer"
          className="theme-fixed fixed inset-0 z-[120] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          ref={panel}
        >
          {/* the backdrop: a tap anywhere outside the screen goes back (keyboard users have the buttons and Esc) */}
          <div aria-hidden className="absolute inset-0 bg-[#0b0a08]/80 backdrop-blur-md cursor-zoom-out" onClick={dismiss} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} />
          <div className="relative z-10 flex items-center justify-between gap-3 px-3 md:px-6 pt-[max(12px,env(safe-area-inset-top))] pb-3" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <button
              ref={back}
              type="button"
              onClick={dismiss}
              className="inline-flex items-center gap-2 h-11 pl-3.5 pr-4 rounded-full bg-white text-[#14120f] text-[14px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden /> {t("back")}
            </button>
            <p className="min-w-0 flex-1 line-clamp-2 text-center text-[12px] sm:text-[13px] leading-snug text-white/80" aria-live="polite">
              {hint ? t("viewerHint") : label}
            </p>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t("close")}
              className="grid place-items-center w-11 h-11 rounded-full bg-white/12 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <X className="w-5 h-5" aria-hidden />
            </button>
          </div>
          <motion.div
            className="relative z-10 flex-1 min-h-0 px-3 md:px-10 pb-[max(16px,env(safe-area-inset-bottom))] pointer-events-none"
            initial={{ scale: reduce ? 1 : 0.96, y: reduce ? 0 : 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: reduce ? 1 : 0.97, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-full h-full max-w-[1280px] mx-auto">
              <Fit onTurn={setTurned}>{children}</Fit>
            </div>
          </motion.div>
          {turned && (
            <p className="pointer-events-none absolute z-20 left-0 right-0 bottom-[max(14px,env(safe-area-inset-bottom))] flex items-center justify-center gap-1.5 text-[12px] text-white/70">
              <RotateCw className="w-3.5 h-3.5" aria-hidden /> {t("rotate")}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
```

### `scripts/desk-blender/fetch.mjs`

```js
// Download the inputs for the Blender desk into .cache/desk/ (nothing here ships to the site):
//   hardwood2_diffuse.jpg          three.js examples floor texture (MIT)
//   DiffuseTransmissionPlant.glb   Khronos glTF sample asset (CC0)
//   hdri/apartment.exr, night.exr  Poly Haven HDRIs as packed by @pmndrs/assets (CC0)
//
//   node scripts/desk-blender/fetch.mjs
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const root = new URL("../../", import.meta.url).pathname;
const CACHE = `${root}.cache/desk/`;
mkdirSync(`${CACHE}hdri`, { recursive: true });

async function get(url, file) {
  const path = `${CACHE}${file}`;
  if (!existsSync(path)) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${url}: ${r.status}`);
    writeFileSync(path, Buffer.from(await r.arrayBuffer()));
  }
  return path;
}

await get("https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/hardwood2_diffuse.jpg", "hardwood2_diffuse.jpg");
await get("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DiffuseTransmissionPlant/glTF-Binary/DiffuseTransmissionPlant.glb", "DiffuseTransmissionPlant.glb");
const tgz = await get("https://registry.npmjs.org/@pmndrs/assets/-/assets-1.7.0.tgz", "pmndrs-assets-1.7.0.tgz");
execFileSync("tar", ["xzf", tgz, "-C", CACHE, "package/hdri/apartment.exr.js", "package/hdri/night.exr.js"]);
for (const n of ["apartment", "night"]) {
  const js = readFileSync(`${CACHE}package/hdri/${n}.exr.js`, "utf8");
  const b64 = js.slice(js.indexOf("base64,") + 7, js.lastIndexOf("'"));
  writeFileSync(`${CACHE}hdri/${n}.exr`, Buffer.from(b64, "base64"));
}
console.log("inputs ready in", CACHE);
```

### `scripts/desk-blender/textures.py`

```python
"""Book jackets and the phone lock screen, drawn with PIL.

Titles and authors only, in plain type: no publisher cover art.
Run by build.py; writes PNGs into the given folder.
"""

import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONTS = "/usr/share/fonts"


def font(name, size):
    paths = {
        "serif": ["truetype/crosextra/Caladea-Regular.ttf", "truetype/dejavu/DejaVuSerif.ttf"],
        "serif-b": ["truetype/crosextra/Caladea-Bold.ttf", "truetype/dejavu/DejaVuSerif-Bold.ttf"],
        "charter": ["type1/gsfonts/c059013l.pfb", "X11/Type1/c0648bt_.pfb", "truetype/crosextra/Caladea-Regular.ttf"],
        "sans": ["opentype/inter/Inter-Medium.otf"],
        "sans-b": ["opentype/inter/Inter-Bold.otf"],
        "sans-l": ["opentype/inter/Inter-Light.otf"],
        "display": ["opentype/inter/InterDisplay-SemiBold.otf"],
    }[name]
    for p in paths:
        full = os.path.join(FONTS, p)
        if os.path.exists(full):
            return ImageFont.truetype(full, size)
    raise FileNotFoundError(name)


def find_font(fragment):
    for root, _, files in os.walk(FONTS):
        for f in files:
            if fragment.lower() in f.lower():
                return os.path.join(root, f)
    return None


def cloth(img, tone, amount=6):
    """A faint woven grain so the boards do not read as flat plastic."""
    import random

    rnd = random.Random(7)
    px = img.load()
    w, h = img.size
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            d = rnd.randint(-amount, amount)
            r, g, b = px[x, y][:3]
            c = (max(0, min(255, r + d)), max(0, min(255, g + d)), max(0, min(255, b + d)))
            px[x, y] = c
            if x + 1 < w:
                px[x + 1, y] = c
    return img.filter(ImageFilter.GaussianBlur(0.6))


def centered(d, box, text, f, fill, spacing=0):
    x0, y0, x1, y1 = box
    if spacing:
        widths = [d.textlength(ch, font=f) for ch in text]
        total = sum(widths) + spacing * (len(text) - 1)
        x = x0 + (x1 - x0 - total) / 2
        bb = d.textbbox((0, 0), text, font=f)
        y = y0 + (y1 - y0 - (bb[3] - bb[1])) / 2 - bb[1]
        for ch, cw in zip(text, widths):
            d.text((x, y), ch, font=f, fill=fill)
            x += cw + spacing
        return
    bb = d.textbbox((0, 0), text, font=f)
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    d.text((x0 + (x1 - x0 - w) / 2 - bb[0], y0 + (y1 - y0 - h) / 2 - bb[1]), text, font=f, fill=fill)


BOOKS = {
    # key: (title lines for the spine, author, board colour, ink colour, accent)
    "laws": ("THE LAWS OF HUMAN NATURE", "ROBERT GREENE", (24, 24, 26), (214, 178, 104), (214, 178, 104)),
    "mastery": ("MASTERY", "ROBERT GREENE", (232, 226, 212), (28, 26, 24), (150, 32, 28)),
    "quiet": ("QUIET", "SUSAN CAIN", (38, 70, 86), (244, 240, 230), (226, 188, 92)),
}


def fit(d, text, kind, max_w, max_h, track):
    """Largest size (with letter spacing as a share of size) that fits the box."""
    size = int(max_h)
    while size > 8:
        f = font(kind, size)
        sp = int(size * track)
        if d.textlength(text, font=f) + sp * (len(text) - 1) <= max_w:
            return f, sp
        size -= 2
    return font(kind, 8), 0


def spine(key, length_m, thick_m, out):
    """Spine laid flat: text runs along the book's height, left to right."""
    title, author, board, ink, accent = BOOKS[key]
    ppm = 2400  # pixels per metre
    w, h = int(length_m * ppm), max(64, int(thick_m * ppm))
    img = cloth(Image.new("RGB", (w, h), board), board)
    d = ImageDraw.Draw(img)
    pad = int(h * 0.2)
    # two thin rules near the head and tail, like a stamped hardcover
    for x in (int(w * 0.03), int(w * 0.97)):
        d.line([(x, pad), (x, h - pad)], fill=accent, width=max(2, h // 40))
    tf, sp = fit(d, title, "serif-b", w * 0.6, h * 0.5, 0.12)
    tw = d.textlength(title, font=tf) + sp * (len(title) - 1)
    x0 = int(w * 0.07)
    centered(d, (x0, 0, x0 + tw, h), title, tf, ink, spacing=sp)
    af, asp = fit(d, author, "sans", w * 0.24, h * 0.24, 0.16)
    aw = d.textlength(author, font=af) + asp * (len(author) - 1)
    x1 = int(w * 0.93) - aw
    centered(d, (x1, 0, x1 + aw, h), author, af, accent if key != "mastery" else ink, spacing=asp)
    img.save(out)


def cover(key, length_m, width_m, out):
    """Front board seen from above: u runs along the book's height, v across it."""
    title, author, board, ink, accent = BOOKS[key]
    ppm = 2400
    w, h = int(length_m * ppm), int(width_m * ppm)
    img = cloth(Image.new("RGB", (w, h), board), board)
    d = ImageDraw.Draw(img)
    if key == "quiet":
        centered(d, (0, int(h * 0.18), w, int(h * 0.48)), "QUIET", font("serif-b", int(h * 0.2)), ink, spacing=int(h * 0.03))
        sub = ["THE POWER OF INTROVERTS IN A WORLD", "THAT CAN'T STOP TALKING"]
        sf = font("sans", int(h * 0.034))
        for i, line in enumerate(sub):
            centered(d, (0, int(h * (0.52 + i * 0.055)), w, int(h * (0.57 + i * 0.055))), line, sf, (210, 214, 210), spacing=int(h * 0.004))
        d.line([(w * 0.44, h * 0.7), (w * 0.56, h * 0.7)], fill=accent, width=max(2, h // 160))
        centered(d, (0, int(h * 0.74), w, int(h * 0.84)), "SUSAN CAIN", font("sans-b", int(h * 0.05)), ink, spacing=int(h * 0.012))
    else:
        centered(d, (0, int(h * 0.3), w, int(h * 0.55)), title, font("serif", int(h * 0.1)), ink)
        centered(d, (0, int(h * 0.7), w, int(h * 0.8)), author, font("sans", int(h * 0.045)), accent, spacing=int(h * 0.01))
    # the cover is seen from above with the spine toward the camera: rotate so v=0 sits at the spine
    img.save(out)


def lockscreen(out):
    w, h = 720, 1500
    img = Image.new("RGB", (w, h), (18, 20, 24))
    # soft gradient wallpaper
    px = img.load()
    for y in range(h):
        t = y / h
        for x in range(0, w):
            u = x / w
            r = int(30 + 40 * (1 - t) + 20 * u)
            g = int(34 + 26 * (1 - t))
            b = int(52 + 50 * (1 - t) - 10 * u)
            px[x, y] = (r, g, b)
    d = ImageDraw.Draw(img)
    centered(d, (0, 150, w, 220), "Thursday 29 October", font("sans", 34), (230, 232, 238))
    centered(d, (0, 220, w, 420), "9:41", font("display", 190), (245, 246, 250))
    # two notifications
    for i, (app, msg) in enumerate([("Site", "New brief: retail POS, 6 weeks"), ("GitHub", "CI passed on main")]):
        y = 960 + i * 170
        d.rounded_rectangle([40, y, w - 40, y + 140], radius=34, fill=(60, 64, 76))
        d.rounded_rectangle([66, y + 30, 146, y + 110], radius=20, fill=(196, 110, 56) if i == 0 else (40, 40, 44))
        d.text((170, y + 30), app, font=font("sans-b", 30), fill=(236, 238, 242))
        d.text((170, y + 74), msg, font=font("sans", 28), fill=(200, 204, 212))
    img.save(out)


def screen_placeholder(label, out, size=(1280, 800)):
    img = Image.new("RGB", size, (246, 245, 242))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, size[0], 70], fill=(30, 32, 36))
    centered(d, (0, 0, size[0], size[1]), label, font("sans", 60), (60, 60, 60))
    img.save(out)


def make_all(folder, dims):
    os.makedirs(folder, exist_ok=True)
    for key, (L, W, T) in dims.items():
        spine(key, L, T, os.path.join(folder, f"spine-{key}.png"))
        cover(key, L, W, os.path.join(folder, f"cover-{key}.png"))
    lockscreen(os.path.join(folder, "lockscreen.png"))


def art_print(out):
    """An abstract print: sun over the Gulf of Guinea, in the site's terracotta and ink."""
    w, h = 1040, 1440
    img = Image.new("RGB", (w, h), (236, 229, 214))
    d = ImageDraw.Draw(img)
    d.ellipse([w * 0.18, h * 0.16, w * 0.82, h * 0.16 + w * 0.64], fill=(201, 92, 46))
    for i in range(7):
        y = h * 0.52 + i * h * 0.055
        d.rectangle([w * 0.1, y, w * 0.9, y + h * 0.022], fill=(34, 52, 70) if i % 2 == 0 else (64, 94, 112))
    d.rectangle([w * 0.1, h * 0.9, w * 0.9, h * 0.905], fill=(34, 34, 34))
    d.text((w * 0.1, h * 0.92), "ACCRA, 5.6037\u00b0 N", font=font("sans", 26), fill=(60, 56, 50))
    img = cloth(img, None, amount=4)
    img.save(out)


def basketball(out, w=2048, h=1024):
    """Equirectangular basketball skin: orange leather, black seams (equator, a meridian, two curved panels)."""
    import math
    img = Image.new("RGB", (w, h), (196, 92, 34))
    d = ImageDraw.Draw(img)
    ink = (26, 18, 14)
    lw = max(6, w // 220)
    d.line([(0, h / 2), (w, h / 2)], fill=ink, width=lw)
    for u in (0, w / 2, w - 1):
        d.line([(u, 0), (u, h)], fill=ink, width=lw)
    # the two curved seams, each a circle around the ball tilted off the poles
    for c in (0.25, 0.75):
        pts = []
        for i in range(0, h + 1, 4):
            v = i / h
            u = c + 0.11 * math.sin(2 * math.pi * v) * (1 if c < 0.5 else -1)
            pts.append((u * w, i))
        d.line(pts, fill=ink, width=lw)
    img.save(out)
```

### `scripts/desk-blender/build.py`

```python
"""The hero desk, built and rendered in Blender (Cycles), entirely from code.

    .cache/bpy-venv/bin/python scripts/desk-blender/build.py --view desktop --phase day

Writes the plate to .cache/desk-blender/out/{view}-{phase}.png and the
projected screen corners and hotspots to public/desk/plates/screens.json,
so the live screens can be laid exactly over the rendered ones.

Units are metres. X runs left to right across the desk, Y away from the
camera, Z up. The desk top sits at Z = 0.75.
"""

import argparse
import json
import math
import os
import sys
import time

import bpy  # noqa: I001  (bpy must load before bmesh)
import bmesh
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Euler, Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
CACHE = os.path.join(ROOT, ".cache", "desk-blender")
ASSETS = os.path.join(ROOT, ".cache", "desk")
sys.path.insert(0, HERE)
import textures  # noqa: E402

TOP = 0.75
CHAIR_AT = (-0.36, -0.78, 0.0)
BALL_AT = (0.52, 0.27, 0.12)
CHAIR_TURN = -28  # degrees; negative turns the seat toward the desk centre
BOOK_DIMS = {"laws": (0.24, 0.162, 0.05), "mastery": (0.235, 0.156, 0.036), "quiet": (0.212, 0.142, 0.027)}

ap = argparse.ArgumentParser()
ap.add_argument("--view", default="desktop", choices=["desktop", "phone"])
ap.add_argument("--phase", default="day", choices=["day", "night"])
ap.add_argument("--scale", type=float, default=1.0, help="resolution scale for previews")
ap.add_argument("--samples", type=int, default=384)
ap.add_argument("--out", default=None)
ap.add_argument("--screens", default=os.path.join(CACHE, "screens"), help="folder with left/center/right.png")
ap.add_argument("--blend", default=None, help="also save the .blend here")
ap.add_argument("--no-render", action="store_true", help="build the scene and stop (bake.py uses this)")
args = ap.parse_args(sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:])

NIGHT = args.phase == "night"
scene = bpy.context.scene
for ob in list(bpy.data.objects):
    bpy.data.objects.remove(ob, do_unlink=True)


# ---------------------------------------------------------------- helpers


def lin(hexstr):
    """sRGB hex to linear RGBA."""
    h = hexstr.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i : i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


def setin(node, name, val):
    if name in node.inputs:
        node.inputs[name].default_value = val


def new_mat(name):
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    return m, nt, out


def principled(name, color="#cccccc", rough=0.5, metal=0.0, **kw):
    m, nt, out = new_mat(name)
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    setin(b, "Base Color", lin(color) if isinstance(color, str) else color)
    setin(b, "Roughness", rough)
    setin(b, "Metallic", metal)
    for k, v in kw.items():
        setin(b, k.replace("_", " "), v)
    nt.links.new(b.outputs[0], out.inputs["Surface"])
    m["bsdf"] = b.name
    return m


def bsdf_of(m):
    return m.node_tree.nodes[m["bsdf"]]


def image(path, non_color=False):
    im = bpy.data.images.load(path, check_existing=True)
    if non_color:
        im.colorspace_settings.name = "Non-Color"
    return im


def textured(name, path, rough=0.5, **kw):
    m = principled(name, rough=rough, **kw)
    nt = m.node_tree
    t = nt.nodes.new("ShaderNodeTexImage")
    t.image = image(path)
    t.interpolation = "Cubic"
    nt.links.new(t.outputs["Color"], bsdf_of(m).inputs["Base Color"])
    return m


def link(ob, parent=None):
    scene.collection.objects.link(ob)
    if parent is not None:
        ob.parent = parent
    return ob


def empty(name, loc=(0, 0, 0), rot=(0, 0, 0), parent=None):
    e = bpy.data.objects.new(name, None)
    e.location = loc
    e.rotation_euler = rot
    return link(e, parent)


def from_bm(name, bm, mats=(), smooth=False, loc=(0, 0, 0), rot=(0, 0, 0), parent=None):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    ob.location = loc
    ob.rotation_euler = rot
    return link(ob, parent)


def bevel(ob, width, segs=3, angle=None):
    md = ob.modifiers.new("bevel", "BEVEL")
    md.width = width
    md.segments = segs
    md.limit_method = "ANGLE"
    md.angle_limit = math.radians(angle or 40)
    md.harden_normals = False
    for p in ob.data.polygons:
        p.use_smooth = True
    try:
        ob.data.set_sharp_from_angle(angle=math.radians(35))
    except Exception:
        pass
    return ob


def subsurf(ob, levels=2):
    md = ob.modifiers.new("sub", "SUBSURF")
    md.levels = levels
    md.render_levels = levels
    return ob


def box_bm(sx, sy, sz, center=(0, 0, 0)):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * sx + center[0], v.co.y * sy + center[1], v.co.z * sz + center[2]))
    return bm


def box_uv(bm, mat_for_normal=None):
    """Planar UVs per face, 0..1 across each face, readable from outside."""
    uv = bm.loops.layers.uv.verify()
    bm.normal_update()
    for f in bm.faces:
        n = f.normal
        ax = max(range(3), key=lambda i: abs(n[i]))
        if ax == 2:
            u_i, v_i = 0, 1
        elif ax == 1:
            u_i, v_i = 0, 2
        else:
            u_i, v_i = 1, 2
        us = [l.vert.co[u_i] for l in f.loops]
        vs = [l.vert.co[v_i] for l in f.loops]
        u0, u1, v0, v1 = min(us), max(us), min(vs), max(vs)
        flip_u = (ax == 1 and n[1] > 0) or (ax == 0 and n[0] < 0) or (ax == 2 and n[2] < 0)
        for l in f.loops:
            u = (l.vert.co[u_i] - u0) / max(1e-9, u1 - u0)
            v = (l.vert.co[v_i] - v0) / max(1e-9, v1 - v0)
            l[uv].uv = (1 - u if flip_u else u, v)
        if mat_for_normal:
            key = ("+" if n[ax] > 0 else "-") + "xyz"[ax]
            f.material_index = mat_for_normal.get(key, 0)
    return bm


def box(name, size, loc=(0, 0, 0), rot=(0, 0, 0), mat=None, bev=0.0, segs=3, parent=None, mats=None, face_mats=None):
    bm = box_bm(*size)
    box_uv(bm, face_mats)
    ob = from_bm(name, bm, mats or ([mat] if mat else []), loc=loc, rot=rot, parent=parent)
    if bev:
        bevel(ob, bev, segs)
    return ob


def cyl(name, r, h, loc=(0, 0, 0), rot=(0, 0, 0), mat=None, segs=64, r2=None, caps=True, parent=None, base=False, smooth=True):
    bm = bmesh.new()
    m = Matrix.Translation((0, 0, h / 2)) if base else Matrix.Identity(4)
    bmesh.ops.create_cone(bm, cap_ends=caps, cap_tris=False, segments=segs, radius1=r, radius2=r if r2 is None else r2, depth=h, matrix=m, calc_uvs=True)
    ob = from_bm(name, bm, [mat] if mat else [], loc=loc, rot=rot, parent=parent)
    if smooth:
        for p in ob.data.polygons:
            p.use_smooth = True
        try:
            ob.data.set_sharp_from_angle(angle=math.radians(40))
        except Exception:
            pass
    return ob


def sphere(name, r, loc=(0, 0, 0), scale=(1, 1, 1), mat=None, parent=None):
    bm = bmesh.new()
    bm.loops.layers.uv.verify()
    bmesh.ops.create_uvsphere(bm, u_segments=48, v_segments=24, radius=r, calc_uvs=True)
    ob = from_bm(name, bm, [mat] if mat else [], smooth=True, loc=loc, parent=parent)
    ob.scale = scale
    return ob


def quad(name, corners, mat, parent=None):
    """A plane from four corners TL, TR, BR, BL with UVs matching an upright image."""
    bm = bmesh.new()
    vs = [bm.verts.new(c) for c in corners]  # vertex order stays TL, TR, BR, BL (the site reads screen corners from it)
    # wound BL, BR, TR, TL so the face looks back at the viewer: three.js culls back faces
    # and a light bake shoots its rays along the normal
    f = bm.faces.new(vs[::-1])
    uv = bm.loops.layers.uv.verify()
    at = dict(zip(vs, [(0, 1), (1, 1), (1, 0), (0, 0)]))
    for l in f.loops:
        l[uv].uv = at[l.vert]
    ob = from_bm(name, bm, [mat], parent=parent)
    return ob


def tube(name, pts, r, mat, parent=None):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = r
    cu.bevel_resolution = 4
    sp = cu.splines.new("BEZIER")
    sp.bezier_points.add(len(pts) - 1)
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    cu.materials.append(mat)
    ob = bpy.data.objects.new(name, cu)
    return link(ob, parent)


def look_at(ob, target, track="-Z", up="Y"):
    d = Vector(target) - ob.matrix_world.translation
    ob.rotation_euler = d.to_track_quat(track, up).to_euler()


# ---------------------------------------------------------------- materials


def oak():
    m, nt, out = new_mat("oak")
    N = nt.nodes
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1.2, 26.0, 26.0)
    nz = N.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 2.2
    nz.inputs["Detail"].default_value = 10
    nz.inputs["Roughness"].default_value = 0.62
    setin(nz, "Distortion", 0.35)
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.38
    ramp.color_ramp.elements[0].color = lin("#b88a5c")
    ramp.color_ramp.elements[1].position = 0.66
    ramp.color_ramp.elements[1].color = lin("#d7b48a")
    # fine pores for the bump
    mp2 = N.new("ShaderNodeMapping")
    mp2.inputs["Scale"].default_value = (6, 300, 300)
    nz2 = N.new("ShaderNodeTexNoise")
    nz2.inputs["Scale"].default_value = 3
    nz2.inputs["Detail"].default_value = 4
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.08
    bump.inputs["Distance"].default_value = 0.0004
    b = N.new("ShaderNodeBsdfPrincipled")
    setin(b, "Roughness", 0.38)
    setin(b, "Coat Weight", 0.22)
    setin(b, "Coat Roughness", 0.18)
    L = nt.links
    L.new(tc.outputs["Object"], mp.inputs["Vector"])
    L.new(mp.outputs["Vector"], nz.inputs["Vector"])
    L.new(nz.outputs["Fac"], ramp.inputs["Fac"])
    L.new(ramp.outputs["Color"], b.inputs["Base Color"])
    L.new(tc.outputs["Object"], mp2.inputs["Vector"])
    L.new(mp2.outputs["Vector"], nz2.inputs["Vector"])
    L.new(nz2.outputs["Fac"], bump.inputs["Height"])
    L.new(bump.outputs["Normal"], b.inputs["Normal"])
    L.new(b.outputs[0], out.inputs["Surface"])
    return m


def bumpy(name, color, rough, scale=40, strength=0.06, **kw):
    m = principled(name, color, rough, **kw)
    nt = m.node_tree
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = scale
    nz.inputs["Detail"].default_value = 8
    bp = nt.nodes.new("ShaderNodeBump")
    bp.inputs["Strength"].default_value = strength
    bp.inputs["Distance"].default_value = 0.001
    nt.links.new(nz.outputs["Fac"], bp.inputs["Height"])
    nt.links.new(bp.outputs["Normal"], bsdf_of(m).inputs["Normal"])
    return m


def pages():
    m = principled("pages", "#e9e0cb", 0.75)
    nt = m.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord")
    wv = nt.nodes.new("ShaderNodeTexWave")
    wv.wave_type = "BANDS"
    wv.bands_direction = "Z"
    wv.inputs["Scale"].default_value = 900
    setin(wv, "Distortion", 0.4)
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs["Factor"].default_value = 0.12
    mix.inputs[6].default_value = lin("#ece4d0")
    mix.inputs[7].default_value = lin("#a89c86")
    nt.links.new(tc.outputs["Object"], wv.inputs["Vector"])
    nt.links.new(wv.outputs["Fac"], mix.inputs["Factor"])
    nt.links.new(mix.outputs[2], bsdf_of(m).inputs["Base Color"])
    return m


def screen_mat(name, path, strength):
    m = principled(name, "#000000", 0.08)
    b = bsdf_of(m)
    setin(b, "Coat Weight", 0.6)
    setin(b, "Coat Roughness", 0.06)
    if os.path.exists(path):
        t = m.node_tree.nodes.new("ShaderNodeTexImage")
        t.image = image(path)
        t.interpolation = "Cubic"
        m.node_tree.links.new(t.outputs["Color"], b.inputs["Emission Color"])
    else:
        setin(b, "Emission Color", lin("#f2f1ec"))
    setin(b, "Emission Strength", strength)
    return m


def steam_mat():
    m, nt, out = new_mat("steam")
    N, L = nt.nodes, nt.links
    tc = N.new("ShaderNodeTexCoord")
    sep = N.new("ShaderNodeSeparateXYZ")
    L.new(tc.outputs["Object"], sep.inputs[0])
    # twist the wisps a little as they rise
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (26, 26, 9)
    mp.inputs["Rotation"].default_value = (0, 0, 0.6)
    nz = N.new("ShaderNodeTexNoise")
    nz.noise_dimensions = "4D"
    nz.inputs["Scale"].default_value = 1.0
    nz.inputs["Detail"].default_value = 3
    setin(nz, "Distortion", 2.2)
    setin(nz, "W", 1.7)
    L.new(tc.outputs["Object"], mp.inputs["Vector"])
    L.new(mp.outputs["Vector"], nz.inputs["Vector"])
    # wisps: keep only the high end of the noise
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.52
    ramp.color_ramp.elements[0].color = (0, 0, 0, 1)
    ramp.color_ramp.elements[1].position = 0.72
    ramp.color_ramp.elements[1].color = (1, 1, 1, 1)
    L.new(nz.outputs["Fac"], ramp.inputs["Fac"])
    # fade with height (0..H) and with distance from the axis
    H = 0.2
    up = N.new("ShaderNodeMapRange")
    up.inputs["From Min"].default_value = 0.0
    up.inputs["From Max"].default_value = H
    up.inputs["To Min"].default_value = 1.0
    up.inputs["To Max"].default_value = 0.0
    L.new(sep.outputs["Z"], up.inputs["Value"])
    vlen = N.new("ShaderNodeVectorMath")
    vlen.operation = "LENGTH"
    comb = N.new("ShaderNodeCombineXYZ")
    L.new(sep.outputs["X"], comb.inputs["X"])
    L.new(sep.outputs["Y"], comb.inputs["Y"])
    L.new(comb.outputs[0], vlen.inputs[0])
    rad = N.new("ShaderNodeMapRange")
    rad.inputs["From Min"].default_value = 0.0
    rad.inputs["From Max"].default_value = 0.04
    rad.inputs["To Min"].default_value = 1.0
    rad.inputs["To Max"].default_value = 0.0
    L.new(vlen.outputs["Value"], rad.inputs["Value"])
    m1 = N.new("ShaderNodeMath")
    m1.operation = "MULTIPLY"
    L.new(up.outputs[0], m1.inputs[0])
    L.new(rad.outputs[0], m1.inputs[1])
    m2 = N.new("ShaderNodeMath")
    m2.operation = "MULTIPLY"
    L.new(m1.outputs[0], m2.inputs[0])
    L.new(ramp.outputs["Color"], m2.inputs[1])
    m3 = N.new("ShaderNodeMath")
    m3.operation = "MULTIPLY"
    m3.inputs[1].default_value = 14.0 if not NIGHT else 16.0
    L.new(m2.outputs[0], m3.inputs[0])
    vol = N.new("ShaderNodeVolumePrincipled")
    setin(vol, "Color", (0.95, 0.95, 0.95, 1))
    setin(vol, "Anisotropy", 0.45)
    L.new(m3.outputs[0], vol.inputs["Density"])
    L.new(vol.outputs[0], out.inputs["Volume"])
    return m


# ---------------------------------------------------------------- the room

M = {}
M["wall"] = bumpy("wall", "#e6dfd3", 0.92, scale=60, strength=0.05)
M["floor"] = principled("floor", "#6f5a46", 0.55)
if os.path.exists(os.path.join(ASSETS, "hardwood2_diffuse.jpg")):
    M["floor"] = textured("floor", os.path.join(ASSETS, "hardwood2_diffuse.jpg"), rough=0.5)
    _nt = M["floor"].node_tree
    _tc = _nt.nodes.new("ShaderNodeTexCoord")
    _mp = _nt.nodes.new("ShaderNodeMapping")
    _mp.inputs["Scale"].default_value = (0.55, 0.55, 0.55)
    _nt.links.new(_tc.outputs["Object"], _mp.inputs["Vector"])
    _img = [n for n in _nt.nodes if n.type == "TEX_IMAGE"][0]
    _nt.links.new(_mp.outputs["Vector"], _img.inputs["Vector"])
    _hs = _nt.nodes.new("ShaderNodeHueSaturation")
    _hs.inputs["Saturation"].default_value = 0.7
    _hs.inputs["Value"].default_value = 0.8
    _nt.links.new(_img.outputs["Color"], _hs.inputs["Color"])
    _nt.links.new(_hs.outputs["Color"], bsdf_of(M["floor"]).inputs["Base Color"])
M["oak"] = oak()
M["steel"] = principled("steel", "#1b1b1c", 0.45, metal=0.9)
M["felt"] = bumpy("felt", "#2b2c2f", 1.0, scale=300, strength=0.15, Sheen_Weight=0.6)
M["alu"] = principled("alu", "#c9cacd", 0.32, metal=1.0, Anisotropic=0.4)
M["alu_dark"] = principled("alu_dark", "#5c5f64", 0.34, metal=1.0, Anisotropic=0.3)
M["black_gloss"] = principled("black_gloss", "#060607", 0.12, Coat_Weight=0.8, Coat_Roughness=0.05)
M["plastic_black"] = principled("plastic_black", "#121214", 0.55)
M["key"] = principled("key", "#1e1f22", 0.6)
M["keylight"] = principled("keylight", "#e9e7e2", 0.55)
M["ceramic"] = principled("ceramic", "#ebe5da", 0.22, Coat_Weight=0.5, Coat_Roughness=0.08)
M["coffee"] = principled("coffee", "#2a160b", 0.06)
M["crema"] = principled("crema", "#7a4a26", 0.2)
M["cork"] = bumpy("cork", "#a57a4f", 0.85, scale=500, strength=0.3)
M["stone"] = bumpy("stone", "#3d3a36", 0.7, scale=220, strength=0.12)
M["pencil"] = principled("pencil", "#d9a441", 0.45)
M["frame"] = principled("frame", "#2a221b", 0.5)
M["mat_board"] = principled("mat_board", "#f1ede4", 0.9)
M["leather"] = bumpy("leather", "#171617", 0.6, scale=400, strength=0.12)
M["elastic"] = principled("elastic", "#0c0c0d", 0.7)
M["pages"] = pages()
M["lamp"] = principled("lamp", "#141414", 0.42, metal=0.6)
M["lamp_in"] = principled("lamp_in", "#efe9dc", 0.5)
M["brass"] = principled("brass", "#b48a4a", 0.3, metal=1.0)
M["bulb"] = principled("bulb", "#ffffff", 0.2, Emission_Color=lin("#ffd9a8"), Emission_Strength=(30.0 if NIGHT else 0.0))
M["cable"] = principled("cable", "#141415", 0.55)
M["phone_frame"] = principled("phone_frame", "#3a3b3f", 0.3, metal=1.0)

# walls: the back wall is the only one the camera sees; the rest bounce light
WX = -2.6
wall = box("wall", (WX * -1 + 2.2 + 0.2, 0.1, 3.2), loc=((WX + 2.2) / 2, 0.66, 1.6), mat=M["wall"])
floor = box("floor", (6, 5, 0.02), loc=(0, 0, -0.01), mat=M["floor"])
room = []
# left wall with a window opening: the sun throws the frame across the desk and wall
win_c, win_w, win_h = (-0.98, 2.2), 1.4, 1.4
for nm, sz, lc in [
    ("wl_a", (0.1, 2.5, 3.2), (WX, win_c[0] - win_w / 2 - 1.25, 1.6)),
    ("wl_b", (0.1, 2.5, 3.2), (WX, win_c[0] + win_w / 2 + 1.25, 1.6)),
    ("wl_c", (0.1, win_w, win_c[1] - win_h / 2), (WX, win_c[0], (win_c[1] - win_h / 2) / 2)),
    ("wl_d", (0.1, win_w, 3.2 - (win_c[1] + win_h / 2)), (WX, win_c[0], (3.2 + win_c[1] + win_h / 2) / 2)),
    ("mull_v", (0.06, 0.05, win_h), (WX, win_c[0], win_c[1])),
    ("mull_h", (0.06, win_w, 0.05), (WX, win_c[0], win_c[1] + 0.12)),
    ("ceiling", (6, 5, 0.1), (0, 0, 3.05)),
    ("wr", (0.1, 5, 3.2), (2.3, 0, 1.6)),
]:
    room.append(box(nm, sz, loc=lc, mat=M["wall"]))
for ob in room:
    ob.visible_camera = False

# ---------------------------------------------------------------- desk

desk = box("desk_top", (1.62, 0.78, 0.034), loc=(0, 0, TOP - 0.017), mat=M["oak"], bev=0.004)
for sx in (-1, 1):
    for sy in (-1, 1):
        box(f"leg{sx}{sy}", (0.04, 0.04, TOP - 0.034), loc=(sx * 0.75, sy * 0.32, (TOP - 0.034) / 2), mat=M["steel"], bev=0.003)
    box(f"rail{sx}", (0.04, 0.66, 0.04), loc=(sx * 0.75, 0, TOP - 0.06), mat=M["steel"], bev=0.003)
box("rail_back", (1.46, 0.03, 0.06), loc=(0, 0.33, TOP - 0.065), mat=M["steel"], bev=0.002)

box("mat", (0.86, 0.4, 0.003), loc=(0.04, -0.15, TOP + 0.0015), mat=M["felt"], bev=0.0012, segs=2)

HS = {}  # hotspots: name -> world point

# ---------------------------------------------------------------- monitor (centre: the register)

mon = empty("monitor", loc=(0.03, 0.2, TOP))
box("mon_base", (0.25, 0.18, 0.008), loc=(0, 0.04, 0.004), mat=M["alu"], bev=0.003, parent=mon)
box("mon_neck", (0.06, 0.016, 0.33), loc=(0, 0.1, 0.17), rot=(math.radians(-8), 0, 0), mat=M["alu"], bev=0.004, parent=mon)
panel = empty("mon_panel", loc=(0, 0.0, 0.34), rot=(math.radians(-5), 0, 0), parent=mon)
PW, PH = 0.60, 0.375
box("mon_bezel", (PW + 0.014, 0.012, PH + 0.016), loc=(0, 0, 0), mat=M["black_gloss"], bev=0.002, parent=panel)
box("mon_back", (PW + 0.012, 0.012, PH + 0.014), loc=(0, 0.011, 0), mat=M["alu"], bev=0.004, parent=panel)
box("mon_hump", (0.36, 0.03, 0.24), loc=(0, 0.03, -0.02), mat=M["alu"], bev=0.01, parent=panel)
box("mon_chin", (PW + 0.014, 0.008, 0.006), loc=(0, -0.002, -PH / 2 - 0.006), mat=M["alu"], bev=0.002, parent=panel)

# ---------------------------------------------------------------- laptop on a stand (left: Odoo)

lap = empty("laptop", loc=(-0.4, 0.02, TOP), rot=(0, 0, math.radians(16)))
# stand: a tilted aluminium tray on two feet
tray = empty("lap_tray", loc=(0, 0, 0.06), rot=(math.radians(12), 0, 0), parent=lap)
box("tray", (0.27, 0.24, 0.006), loc=(0, 0, 0), mat=M["alu_dark"], bev=0.002, parent=tray)
box("foot_b", (0.24, 0.02, 0.1), loc=(0, 0.1, 0.0), mat=M["alu_dark"], bev=0.003, parent=lap)
box("foot_f", (0.24, 0.02, 0.035), loc=(0, -0.11, 0.0), mat=M["alu_dark"], bev=0.003, parent=lap)
base = empty("lap_base", loc=(0, 0, 0.003), parent=tray)
LW, LD, LT = 0.304, 0.212, 0.0145
box("lap_body", (LW, LD, LT), loc=(0, 0, LT / 2), mat=M["alu"], bev=0.005, segs=4, parent=base)
box("lap_well", (0.276, 0.112, 0.0008), loc=(0, 0.035, LT + 0.0002), mat=M["plastic_black"], parent=base)
box("lap_pad", (0.13, 0.08, 0.0006), loc=(0, -0.058, LT + 0.0001), mat=M["alu_dark"], bev=0.0005, parent=base)
kk = bpy.data.meshes.new("lapkey")
bmk = box_bm(0.0155, 0.0155, 0.0012)
bmk.to_mesh(kk)
bmk.free()
kk.materials.append(M["key"])
for r in range(6):
    n = 14 if r else 14
    for c in range(n):
        x = -0.128 + c * 0.0197
        y = 0.083 - r * 0.0185
        k = bpy.data.objects.new(f"lk{r}_{c}", kk)
        k.location = (x, y, LT + 0.0008)
        if r == 0:
            k.scale = (1, 0.55, 1)
        link(k, base)
hinge = empty("lap_hinge", loc=(0, LD / 2 - 0.004, LT), rot=(math.radians(-108), 0, 0), parent=base)
box("lap_lid", (LW, LD, 0.005), loc=(0, -LD / 2, 0.0025), mat=M["alu"], bev=0.002, parent=hinge)
box("lap_glass", (LW - 0.004, LD - 0.004, 0.0004), loc=(0, -LD / 2, -0.0003), mat=M["black_gloss"], parent=hinge)
SW, SH = 0.286, 0.179
z = -0.0009
lap_corners = [(-SW / 2, -0.2, z), (SW / 2, -0.2, z), (SW / 2, -0.2 + SH, z), (-SW / 2, -0.2 + SH, z)]

# ---------------------------------------------------------------- tablet on a stand (right: the deal screen)

tab = empty("tablet", loc=(0.41, 0.14, TOP), rot=(0, 0, math.radians(-14)))
box("tab_stand_base", (0.12, 0.1, 0.008), loc=(0, 0.02, 0.004), mat=M["alu_dark"], bev=0.003, parent=tab)
box("tab_stand_arm", (0.04, 0.008, 0.13), loc=(0, 0.045, 0.065), rot=(math.radians(-22), 0, 0), mat=M["alu_dark"], bev=0.002, parent=tab)
tbody = empty("tab_body", loc=(0, 0.0, 0.1), rot=(math.radians(-18), 0, 0), parent=tab)
TW, TH = 0.252, 0.165
box("tab_shell", (TW, 0.007, TH), loc=(0, 0, 0), mat=M["alu_dark"], bev=0.006, segs=4, parent=tbody)
box("tab_glass", (TW - 0.003, 0.0006, TH - 0.003), loc=(0, -0.0036, 0), mat=M["black_gloss"], parent=tbody)
box("tab_lip", (0.08, 0.025, 0.012), loc=(0, -0.006, -TH / 2 - 0.004), mat=M["alu_dark"], bev=0.002, parent=tbody)
TSW, TSH = 0.236, 0.1475

# ---------------------------------------------------------------- keyboard and mouse

kb = empty("keyboard", loc=(0.03, -0.17, TOP + 0.003), rot=(math.radians(2.5), 0, 0))
box("kb_case", (0.36, 0.122, 0.011), loc=(0, 0, 0.0055), mat=M["alu"], bev=0.004, segs=4, parent=kb)
km = bpy.data.meshes.new("kbkey")
bmk = box_bm(0.0168, 0.0168, 0.004)
bmk.to_mesh(km)
bmk.free()
km.materials.append(M["key"])
rows = [(15, 0.58), (14, 1), (14, 1), (13, 1), (12, 1)]
for r, (n, sy) in enumerate(rows):
    w = 0.344 / n
    for c in range(n):
        k = bpy.data.objects.new(f"kk{r}_{c}", km)
        k.location = (-0.172 + w * (c + 0.5), 0.046 - r * 0.0195 - (0.004 if r == 0 else 0), 0.0125)
        k.scale = ((w - 0.0024) / 0.0168, sy, 1)
        link(k, kb)
for c, (wk, xk) in enumerate([(0.03, -0.152), (0.03, -0.12), (0.03, -0.088), (0.15, 0.0), (0.03, 0.092), (0.03, 0.124), (0.03, 0.156)]):
    k = bpy.data.objects.new(f"kb_bottom{c}", km)
    k.location = (xk, 0.046 - 5 * 0.0195, 0.0125)
    k.scale = (wk / 0.0168, 1, 1)
    link(k, kb)
for ob in kb.children:
    if ob.name.startswith(("kk", "kb_bottom")):
        bevel(ob, 0.0016, 2)
mouse = sphere("mouse", 1.0, loc=(0.29, -0.16, TOP + 0.003), scale=(0.031, 0.056, 0.019), mat=M["keylight"])
mouse.rotation_euler = (0, 0, math.radians(-8))

# ---------------------------------------------------------------- books (right, back)

stack = empty("books", loc=(0.63, 0.19, TOP), rot=(0, 0, math.radians(-12)))
tex_dir = os.path.join(CACHE, "tex")
textures.make_all(tex_dir, BOOK_DIMS)
zc = 0.0
for key, rz, dx in [("laws", 0, 0), ("mastery", 4, 0.006), ("quiet", -5, -0.004)]:
    L_, W_, T_ = BOOK_DIMS[key]
    bk = empty(f"book_{key}", loc=(dx, 0, zc), rot=(0, 0, math.radians(rz)), parent=stack)
    board = principled(f"board_{key}", tuple(c / 255 for c in textures.BOOKS[key][2]) + (1,), 0.7)
    # boards use the cloth colour converted to linear
    bsdf_of(board).inputs["Base Color"].default_value = lin("#%02x%02x%02x" % textures.BOOKS[key][2])
    spine_m = textured(f"spine_{key}", os.path.join(tex_dir, f"spine-{key}.png"), rough=0.6)
    cover_m = textured(f"cover_{key}", os.path.join(tex_dir, f"cover-{key}.png"), rough=0.6)
    bt = 0.0028
    # page block, slightly inset from the boards
    box(f"pages_{key}", (L_ - 0.008, W_ - 0.006, T_ - 2 * bt), loc=(0, 0.001, T_ / 2), mat=M["pages"], parent=bk)
    box(f"bot_{key}", (L_, W_, bt), loc=(0, 0, bt / 2), mat=board, bev=0.0008, segs=2, parent=bk)
    box(f"top_{key}", (L_, W_, bt), loc=(0, 0, T_ - bt / 2), mats=[board, cover_m], face_mats={"+z": 1}, bev=0.0008, segs=2, parent=bk)
    box(f"spine_{key}", (L_, bt, T_), loc=(0, -W_ / 2 + bt / 2, T_ / 2), mats=[board, spine_m], face_mats={"-y": 1}, bev=0.001, segs=2, parent=bk)
    zc += T_
HS["books"] = (stack, Vector((0, 0, zc)))

# ---------------------------------------------------------------- coffee

mug = empty("mug", loc=(0.46, -0.17, TOP))
box("coaster", (0.1, 0.1, 0.004), loc=(0, 0, 0.002), mat=M["cork"], bev=0.002, parent=mug)
cup = cyl("mug_body", 0.041, 0.094, loc=(0, 0, 0.004), mat=M["ceramic"], base=True, caps=False, parent=mug)
bm = bmesh.new()
bm.from_mesh(cup.data)
bottom = [v for v in bm.verts if v.co.z < 0.001]
bm.faces.new(sorted(bottom, key=lambda v: math.atan2(v.co.y, v.co.x)))
bm.to_mesh(cup.data)
bm.free()
sol = cup.modifiers.new("solid", "SOLIDIFY")
sol.thickness = 0.0045
sol.offset = -1
bevel(cup, 0.0018, 3, angle=60)
cyl("coffee", 0.0365, 0.002, loc=(0, 0, 0.083), mat=M["coffee"], parent=mug)
cyl("crema", 0.037, 0.0006, loc=(0, 0, 0.0838), mat=M["crema"], r2=0.0345, parent=mug, caps=False)
bpy.ops.mesh.primitive_torus_add(major_radius=0.026, minor_radius=0.0062, major_segments=48, minor_segments=16)
handle = bpy.context.active_object
handle.name = "mug_handle"
for c in handle.users_collection:
    c.objects.unlink(handle)
scene.collection.objects.link(handle)
handle.data.materials.append(M["ceramic"])
for p in handle.data.polygons:
    p.use_smooth = True
handle.parent = mug
handle.location = (0.041, 0, 0.054)
handle.rotation_euler = (math.radians(90), 0, 0)
handle.scale = (0.85, 1.15, 1)
steam = cyl("steam", 0.045, 0.2, loc=(0, 0, 0.09), mat=steam_mat(), base=True, parent=mug, smooth=False, segs=24)
HS["coffee"] = (mug, Vector((0, 0, 0.1)))

# ---------------------------------------------------------------- pen cup

pc = empty("pencup", loc=(-0.6, -0.12, TOP))
cupb = cyl("pencup_body", 0.032, 0.095, mat=M["stone"], base=True, caps=False, parent=pc, segs=48)
bm = bmesh.new()
bm.from_mesh(cupb.data)
bottom = [v for v in bm.verts if v.co.z < 0.001]
bm.faces.new(sorted(bottom, key=lambda v: math.atan2(v.co.y, v.co.x)))
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
bm.to_mesh(cupb.data)
bm.free()
sol = cupb.modifiers.new("solid", "SOLIDIFY")
sol.thickness = 0.004
sol.offset = -1
bevel(cupb, 0.0015, 2, angle=60)
for i, (dx, dy, tx, ty, mname, r_) in enumerate([(0.008, 0.004, 10, 6, "pencil", 0.0038), (-0.01, 0.006, -8, 9, "plastic_black", 0.0045), (0.0, -0.011, 4, -11, "brass", 0.0042)]):
    p = empty(f"pc_pen{i}", loc=(dx, dy, 0.012), rot=(math.radians(ty), math.radians(tx), 0), parent=pc)
    cyl(f"pc_pen{i}_body", r_, 0.15, mat=M[mname], base=True, parent=p, segs=12 if mname == "pencil" else 24)

# ---------------------------------------------------------------- notebook and pen

nb = empty("notebook", loc=(-0.3, -0.25, TOP), rot=(0, 0, math.radians(-7)))
box("nb_pages", (0.142, 0.204, 0.011), loc=(0.002, 0, 0.0065), mat=M["pages"], parent=nb)
box("nb_bot", (0.148, 0.21, 0.0016), loc=(0, 0, 0.0008), mat=M["leather"], bev=0.0007, parent=nb)
box("nb_top", (0.148, 0.21, 0.0016), loc=(0, 0, 0.0128), mat=M["leather"], bev=0.0007, parent=nb)
box("nb_band", (0.005, 0.212, 0.0144), loc=(0.058, 0, 0.0068), mat=M["elastic"], bev=0.0006, parent=nb)
pen = empty("pen", loc=(0.012, -0.004, 0.0158), rot=(0, math.radians(90), math.radians(64)), parent=nb)
cyl("pen_body", 0.0046, 0.128, mat=M["plastic_black"], parent=pen)
cyl("pen_tip", 0.0046, 0.018, loc=(0, 0, 0.073), r2=0.0008, mat=M["brass"], parent=pen)
box("pen_clip", (0.0016, 0.002, 0.045), loc=(0, 0.005, -0.035), mat=M["brass"], parent=pen)
HS["notebook"] = (nb, Vector((0, 0, 0.014)))

# ---------------------------------------------------------------- phone

ph = empty("phone", loc=(0.62, -0.2, TOP), rot=(0, 0, math.radians(12)))
box("phone_body", (0.0716, 0.147, 0.0078), loc=(0, 0, 0.0039), mat=M["phone_frame"], bev=0.0035, segs=5, parent=ph)
box("phone_glass", (0.069, 0.1445, 0.0004), loc=(0, 0, 0.0078), mat=M["black_gloss"], bev=0.0002, parent=ph)
lock = screen_mat("lock", os.path.join(tex_dir, "lockscreen.png"), 0.9 if NIGHT else 0.55)
quad("phone_screen", [(-0.0322, 0.069, 0.0081), (0.0322, 0.069, 0.0081), (0.0322, -0.069, 0.0081), (-0.0322, -0.069, 0.0081)], lock, parent=ph)
HS["phone"] = (ph, Vector((0, 0, 0.008)))

# ---------------------------------------------------------------- lamp (back left)

lamp = empty("lamp", loc=(-0.5, 0.29, TOP), rot=(0, 0, math.radians(30)))
cyl("lamp_base", 0.07, 0.016, mat=M["lamp"], base=True, parent=lamp)
cyl("lamp_knuckle", 0.012, 0.03, loc=(0, 0, 0.016), mat=M["brass"], base=True, parent=lamp)
j1 = Vector((0, 0, 0.03))
j2 = Vector((0, 0.07, 0.43))
j3 = Vector((0, -0.24, 0.47))


def rod(name, a, b, r=0.0055):
    d = b - a
    ob = cyl(name, r, d.length, loc=(a + b) / 2, mat=M["lamp"], parent=lamp, segs=24)
    ob.rotation_euler = d.to_track_quat("Z", "Y").to_euler()


rod("arm1", j1, j2)
rod("arm2", j2, j3)
sphere("elbow", 0.011, loc=j2, mat=M["brass"], parent=lamp)
shade = empty("shade", loc=j3, rot=(math.radians(-62), 0, 0), parent=lamp)
sh = cyl("shade_cone", 0.026, 0.12, loc=(0, 0, -0.06), r2=0.074, mat=M["lamp"], caps=False, parent=shade)
# Blender's cone runs radius1 at -z: flip so it opens downward
sh.rotation_euler = (math.pi, 0, 0)
sol = sh.modifiers.new("solid", "SOLIDIFY")
sol.thickness = 0.0016
sh.data.materials.append(M["lamp_in"])
sol.material_offset = 1
cyl("shade_cap", 0.027, 0.012, loc=(0, 0, 0.0), mat=M["lamp"], parent=shade)
sphere("bulb", 0.022, loc=(0, 0, -0.045), mat=M["bulb"], parent=shade)
HS["lamp"] = (shade, Vector((0, 0, -0.05)))

# ---------------------------------------------------------------- plant (back left corner)

plant = empty("plant", loc=(-0.7, 0.29, TOP))
try:
    try:
        bpy.ops.preferences.addon_enable(module="io_scene_gltf2")
    except Exception:
        pass
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(ASSETS, "DiffuseTransmissionPlant.glb"))
    new = [o for o in bpy.data.objects if o not in before]
    roots = [o for o in new if o.parent is None]
    # measure and fit to ~0.42 m tall
    bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c) for o in new if o.type == "MESH" for c in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    # glTF is Y-up; the importer converts, so height is along Z here
    k = 0.42 / max(1e-6, hi.z - lo.z)
    pivot = empty("plant_fit", parent=plant)
    pivot.scale = (k, k, k)
    pivot.location = (-(lo.x + hi.x) / 2 * k, -(lo.y + hi.y) / 2 * k, -lo.z * k)
    for o in roots:
        o.parent = pivot
    for o in new:
        if "firefly" in o.name:
            bpy.data.objects.remove(o, do_unlink=True)
    print("plant", len(new), "objects, scale", round(k, 3))
except Exception as e:  # keep rendering without it
    print("plant import failed:", e)

# ---------------------------------------------------------------- framed print (wall, top right)

textures.art_print(os.path.join(tex_dir, "print.png"))
fr = empty("print", loc=(0.46, 0.6, 1.38))
box("frame", (0.42, 0.024, 0.54), mat=M["frame"], bev=0.003, parent=fr)
box("frame_mat", (0.38, 0.002, 0.5), loc=(0, -0.0125, 0), mat=M["mat_board"], parent=fr)
art = textured("art", os.path.join(tex_dir, "print.png"), rough=0.85)
quad("art", [(-0.13, -0.0142, 0.18), (0.13, -0.0142, 0.18), (0.13, -0.0142, -0.18), (-0.13, -0.0142, -0.18)], art, parent=fr)

# ---------------------------------------------------------------- ergonomic chair (in front, turned toward the desk)

M["knit"] = bumpy("knit", "#26272a", 0.92, scale=900, strength=0.25, Sheen_Weight=0.4)
M["mesh_back"] = bumpy("mesh_back", "#1c1d20", 0.85, scale=1400, strength=0.4)
M["chrome"] = principled("chrome", "#d8d9dc", 0.18, metal=1.0)
chair = empty("chair", loc=CHAIR_AT, rot=(0, 0, math.radians(CHAIR_TURN)))
# five-star base with casters
for i in range(5):
    a = math.radians(90 + i * 72)
    leg = empty(f"chair_leg{i}", loc=(0, 0, 0.085), rot=(0, 0, a), parent=chair)
    box(f"chair_spoke{i}", (0.31, 0.045, 0.028), loc=(0.165, 0, 0), rot=(0, math.radians(6), 0), mat=M["chrome"], bev=0.01, segs=3, parent=leg)
    cyl(f"chair_caster{i}", 0.026, 0.03, loc=(0.31, 0, -0.058), rot=(math.pi / 2, 0, 0), mat=M["plastic_black"], parent=leg, segs=24)
    cyl(f"chair_fork{i}", 0.01, 0.03, loc=(0.31, 0, -0.025), mat=M["plastic_black"], parent=leg, segs=12)
cyl("chair_hub", 0.045, 0.06, loc=(0, 0, 0.065), mat=M["chrome"], base=True, parent=chair)
cyl("chair_lift", 0.022, 0.3, loc=(0, 0, 0.12), mat=M["chrome"], base=True, parent=chair)
cyl("chair_sleeve", 0.03, 0.12, loc=(0, 0, 0.12), mat=M["plastic_black"], base=True, parent=chair)
box("chair_mech", (0.2, 0.22, 0.045), loc=(0, 0.01, 0.43), mat=M["plastic_black"], bev=0.008, parent=chair)
seat = box("chair_seat", (0.5, 0.48, 0.075), loc=(0, 0.02, 0.49), mat=M["knit"], bev=0.03, segs=5, parent=chair)
box("chair_seat_shell", (0.48, 0.46, 0.02), loc=(0, 0.02, 0.45), mat=M["plastic_black"], bev=0.008, parent=chair)
# spine and a curved mesh back, leaning back a touch
box("chair_spine", (0.06, 0.03, 0.34), loc=(0, -0.24, 0.6), rot=(math.radians(-8), 0, 0), mat=M["plastic_black"], bev=0.008, parent=chair)
back = empty("chair_back", loc=(0, -0.27, 0.88), rot=(math.radians(-12), 0, 0), parent=chair)
bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=16, y_segments=12, size=0.5)
for v in bm.verts:
    x, z = v.co.x * 0.46, v.co.y * 0.58  # grid is in XY: map to width and height
    curve = 0.06 * (x / 0.23) ** 2 - 0.025 * math.exp(-((z + 0.1) / 0.12) ** 2)  # wraps round, lumbar bulge
    w = 1 - 0.12 * max(0.0, z / 0.29)  # narrows to the shoulders
    v.co = Vector((x * w, -curve, z))
box_uv(bm)
mesh_panel = from_bm("chair_mesh", bm, [M["mesh_back"]], smooth=True, parent=back)
sol = mesh_panel.modifiers.new("solid", "SOLIDIFY")
sol.thickness = 0.012
tube("chair_frame", [(-0.215, -0.055, -0.29), (-0.23, -0.06, 0.0), (-0.2, -0.05, 0.29), (0.0, -0.0, 0.31), (0.2, -0.05, 0.29), (0.23, -0.06, 0.0), (0.215, -0.055, -0.29), (0.0, 0.0, -0.31), (-0.215, -0.055, -0.29)], 0.012, M["plastic_black"], parent=back)
box("chair_lumbar", (0.3, 0.03, 0.07), loc=(0, 0.01, -0.1), mat=M["plastic_black"], bev=0.012, parent=back)
box("chair_head", (0.3, 0.06, 0.13), loc=(0, -0.02, 0.42), rot=(math.radians(-6), 0, 0), mat=M["knit"], bev=0.025, segs=4, parent=back)
box("chair_head_post", (0.04, 0.02, 0.12), loc=(0, 0.02, 0.33), mat=M["plastic_black"], parent=back)
for sx in (-1, 1):
    box(f"chair_arm_post{sx}", (0.035, 0.07, 0.2), loc=(sx * 0.265, -0.02, 0.58), mat=M["plastic_black"], bev=0.008, parent=chair)
    box(f"chair_arm_pad{sx}", (0.08, 0.27, 0.032), loc=(sx * 0.265, 0.0, 0.69), mat=M["knit"], bev=0.014, segs=4, parent=chair)
HS["chair"] = (chair, Vector((0, 0, 0.75)))

# ---------------------------------------------------------------- basketball (on the floor, under the desk front)

textures.basketball(os.path.join(tex_dir, "basketball.png"))
M["ball"] = textured("ball", os.path.join(tex_dir, "basketball.png"), rough=0.62)
_bnt = M["ball"].node_tree
_bnz = _bnt.nodes.new("ShaderNodeTexNoise")
_bnz.inputs["Scale"].default_value = 900
_bnz.inputs["Detail"].default_value = 2
_bbp = _bnt.nodes.new("ShaderNodeBump")
_bbp.inputs["Strength"].default_value = 0.35
_bbp.inputs["Distance"].default_value = 0.0006
_bnt.links.new(_bnz.outputs["Fac"], _bbp.inputs["Height"])
_bnt.links.new(_bbp.outputs["Normal"], bsdf_of(M["ball"]).inputs["Normal"])
BALL_R = 0.12
ball = sphere("ball", BALL_R, loc=BALL_AT, mat=M["ball"])
ball.rotation_euler = (math.radians(18), math.radians(-10), math.radians(35))
HS["ball"] = (ball, Vector((0, 0, 0)))

# ---------------------------------------------------------------- cables

tube("cable_mon", [(0.03, 0.29, TOP + 0.3), (0.05, 0.36, TOP + 0.05), (0.15, 0.39, TOP + 0.002), (0.4, 0.4, TOP - 0.2)], 0.0026, M["cable"])
tube("cable_lap", [(-0.53, 0.09, TOP + 0.07), (-0.58, 0.2, TOP + 0.003), (-0.44, 0.35, TOP + 0.003), (-0.4, 0.4, TOP - 0.25)], 0.0022, M["cable"])

# ---------------------------------------------------------------- screens

scr_dir = args.screens
strength = 1.6 if NIGHT else 0.95
SCREENS = {}
mon_z = -0.0065
SCREENS["center"] = quad(
    "SCR_center",
    [(-PW / 2, mon_z, PH / 2), (PW / 2, mon_z, PH / 2), (PW / 2, mon_z, -PH / 2), (-PW / 2, mon_z, -PH / 2)],
    screen_mat("scr_center", os.path.join(scr_dir, "center.png"), strength),
    parent=panel,
)
SCREENS["left"] = quad("SCR_left", lap_corners, screen_mat("scr_left", os.path.join(scr_dir, "left.png"), strength), parent=hinge)
ty = -0.0042
SCREENS["right"] = quad(
    "SCR_right",
    [(-TSW / 2, ty, TSH / 2), (TSW / 2, ty, TSH / 2), (TSW / 2, ty, -TSH / 2), (-TSW / 2, ty, -TSH / 2)],
    screen_mat("scr_right", os.path.join(scr_dir, "right.png"), strength),
    parent=tbody,
)

# ---------------------------------------------------------------- light

world = bpy.data.worlds.new("world")
scene.world = world
try:
    world.use_nodes = True
except Exception:
    pass
wn = world.node_tree
wn.nodes.clear()
wo = wn.nodes.new("ShaderNodeOutputWorld")
bg = wn.nodes.new("ShaderNodeBackground")
env = wn.nodes.new("ShaderNodeTexEnvironment")
hdri = os.path.join(ASSETS, "hdri", "night.exr" if NIGHT else "apartment.exr")
env.image = bpy.data.images.load(hdri)
wmap = wn.nodes.new("ShaderNodeMapping")
wtc = wn.nodes.new("ShaderNodeTexCoord")
wmap.inputs["Rotation"].default_value = (0, 0, math.radians(110))
wn.links.new(wtc.outputs["Generated"], wmap.inputs["Vector"])
wn.links.new(wmap.outputs["Vector"], env.inputs["Vector"])
wn.links.new(env.outputs["Color"], bg.inputs["Color"])
bg.inputs["Strength"].default_value = 0.05 if NIGHT else 0.55
wn.links.new(bg.outputs[0], wo.inputs["Surface"])

sun_d = Vector((0.82, 0.34, -0.46)).normalized()
sun = bpy.data.objects.new("sun", bpy.data.lights.new("sun", "SUN"))
link(sun)
sun.data.energy = 0.25 if NIGHT else 4.2
sun.data.angle = math.radians(1.2)
sun.data.color = (0.62, 0.72, 1.0) if NIGHT else (1.0, 0.9, 0.78)
sun.rotation_euler = sun_d.to_track_quat("-Z", "Y").to_euler()

fill = bpy.data.objects.new("fill", bpy.data.lights.new("fill", "AREA"))
link(fill)
fill.data.shape = "RECTANGLE"
fill.data.size, fill.data.size_y = 2.4, 1.4
fill.data.energy = 18 if NIGHT else 110
fill.data.color = (1.0, 0.78, 0.6) if NIGHT else (1.0, 0.97, 0.93)
fill.location = (0.6, -2.4, 2.1)
look_at(fill, (0, 0.1, TOP))

if NIGHT:
    spot = bpy.data.objects.new("lamp_spot", bpy.data.lights.new("lamp_spot", "SPOT"))
    link(spot)
    spot.data.energy = 26
    spot.data.color = (1.0, 0.76, 0.5)
    spot.data.spot_size = math.radians(95)
    spot.data.spot_blend = 0.55
    spot.data.shadow_soft_size = 0.02
    spot.parent = shade
    spot.location = (0, 0, -0.04)
    spot.rotation_euler = (0, 0, 0)
    glow = bpy.data.objects.new("bounce", bpy.data.lights.new("bounce", "POINT"))
    link(glow)
    glow.data.energy = 6
    glow.data.color = (1.0, 0.7, 0.45)
    glow.data.shadow_soft_size = 0.3
    glow.location = (1.4, -0.4, 1.6)

# ---------------------------------------------------------------- camera

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
link(cam)
scene.camera = cam
cd = cam.data
cd.sensor_fit = "HORIZONTAL"
cd.sensor_width = 36
if args.view == "desktop":
    W, H = 2560, 1440
    cam.location = (0.2, -2.25, 1.5)
    target = (0.06, 0.12, 0.9)
    cd.lens = 34
    cd.shift_x = -0.225
    cd.shift_y = 0.02
else:
    W, H = 1200, 1400
    cam.location = (0.03, -1.5, 1.62)
    target = (0.03, 0.12, 0.95)
    cd.lens = 30
    cd.shift_y = 0.05
bpy.context.view_layer.update()
look_at(cam, target)
cd.dof.use_dof = True
cd.dof.focus_distance = (Vector(target) - cam.location).length
cd.dof.aperture_fstop = 5.6

# ---------------------------------------------------------------- render settings

r = scene.render
r.engine = "CYCLES"
r.resolution_x = int(W * args.scale)
r.resolution_y = int(H * args.scale)
r.resolution_percentage = 100
r.film_transparent = False
r.image_settings.file_format = "PNG"
r.image_settings.color_depth = "8"
c = scene.cycles
c.device = "CPU"
c.samples = args.samples
c.use_adaptive_sampling = True
c.adaptive_threshold = 0.012
c.use_denoising = True
try:
    c.denoiser = "OPENIMAGEDENOISE"
    c.denoising_input_passes = "RGB_ALBEDO_NORMAL"
except Exception:
    pass
c.max_bounces = 10
c.diffuse_bounces = 4
c.glossy_bounces = 4
c.transmission_bounces = 10
c.volume_bounces = 1
c.caustics_reflective = False
c.caustics_refractive = False
c.blur_glossy = 1.0
c.sample_clamp_indirect = 8
c.volume_step_rate = 1.0
vs = scene.view_settings
vs.view_transform = "AgX"
for look in ("AgX - Medium High Contrast", "Medium High Contrast"):
    try:
        vs.look = look
        break
    except Exception:
        pass
vs.exposure = 0.35 if NIGHT else 0.0

if args.no_render:
    bpy.context.view_layer.update()
    raise SystemExit(0)

# ---------------------------------------------------------------- projections

bpy.context.view_layer.update()


def px(co):
    v = world_to_camera_view(scene, cam, co)
    return [round(v.x * W, 2), round((1 - v.y) * H, 2)]


plate = {"w": W, "h": H, "screens": {}, "hotspots": {}}
for sid, ob in SCREENS.items():
    mw = ob.matrix_world
    plate["screens"][sid] = [px(mw @ v.co) for v in ob.data.vertices]
for k, (ob, local) in HS.items():
    plate["hotspots"][k] = px(ob.matrix_world @ local)

os.makedirs(os.path.join(CACHE, "out"), exist_ok=True)
jpath = os.path.join(ROOT, "public", "desk", "plates", "screens.json")
os.makedirs(os.path.dirname(jpath), exist_ok=True)
allp = {}
if os.path.exists(jpath):
    with open(jpath) as f:
        allp = json.load(f)
allp[args.view] = plate
with open(jpath, "w") as f:
    json.dump(allp, f, indent=1)

if args.blend:
    bpy.ops.wm.save_as_mainfile(filepath=args.blend)

out = args.out or os.path.join(CACHE, "out", f"{args.view}-{args.phase}.png")
r.filepath = out
t0 = time.time()
bpy.ops.render.render(write_still=True)
print(f"rendered {out} {r.resolution_x}x{r.resolution_y} in {time.time() - t0:.0f}s")
```

### `scripts/desk-blender/bake.py`

```python
"""Bake the Blender desk for the real-time hero.

    .cache/bpy-venv/bin/python scripts/desk-blender/bake.py [--samples 192] [--quick]

1. Builds the scene with build.py (day lighting, no render).
2. Joins objects into a few groups and gives each one lightmap UVs.
3. Bakes per group: albedo (colour only), daytime light, then evening
   light (lamp on, screens glowing), into textures.
4. Exports public/desk/desk.glb (geometry plus UVs, one material per group)
   and public/desk/desk3d.json (screen corners, hotspots, mouse mat,
   chair pivot, camera poses, in glTF coordinates).

The site multiplies albedo by a blend of the two lightmaps, so the lamp
can switch the room's light live. The chair and mouse are baked in place
but don't shadow the rest, because they move.
"""

import json
import math
import os
import sys
import time

import bpy  # noqa: I001
import numpy as np
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
CACHE = os.path.join(ROOT, ".cache", "desk-blender", "bake")
PUB = os.path.join(ROOT, "public", "desk")
os.makedirs(CACHE, exist_ok=True)

argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
SAMPLES = int(argv[argv.index("--samples") + 1]) if "--samples" in argv else 192
QUICK = "--quick" in argv  # small textures and few samples, for checking the pipeline
# --light decor,chair re-bakes the lightmaps of only those groups and keeps the rest from the last bake
# (lightmap UVs come from the same geometry each run); albedos are always re-baked, they take seconds
LIGHT_ONLY = set(argv[argv.index("--light") + 1].split(",")) if "--light" in argv else None

# ---------------------------------------------------------------- build the scene (day)
g = {"__name__": "__desk_build__", "__file__": os.path.join(HERE, "build.py")}
sys.argv = ["build.py", "--view", "desktop", "--phase", "day", "--no-render"]
try:
    exec(compile(open(os.path.join(HERE, "build.py")).read(), g["__file__"], "exec"), g)
except SystemExit:
    pass
scene = bpy.context.scene
vl = bpy.context.view_layer
M = g["M"]
TOP = g["TOP"]

# ---------------------------------------------------------------- groups

GROUPS = {
    "room": ["wall", "floor"],
    "desk": ["desk_top", "leg-1-1", "leg-11", "leg1-1", "leg11", "rail-1", "rail1", "rail_back", "mat", "cable_mon", "cable_lap"],
    "tech": ["monitor", "laptop", "tablet", "keyboard", "phone"],
    "decor": ["books", "mug", "pencup", "notebook", "print", "lamp", "plant"],
    "chair": ["chair"],
    "mouse": ["mouse"],
    "ball": ["ball"],
}
# exported on their own: screens get live apps, the bulb glows, the steam is particles on the site
SEPARATE = {"SCR_center", "SCR_left", "SCR_right", "phone_screen", "bulb"}
DROP = {"steam"}
MOVING = {"chair", "mouse", "ball"}
ALBEDO = {"room": 2048, "desk": 2048, "tech": 2048, "decor": 2048, "chair": 1024, "mouse": 256, "ball": 512}
LIGHT = {"room": 1024, "desk": 1024, "tech": 1024, "decor": 1024, "chair": 512, "mouse": 128, "ball": 256}
if QUICK:
    ALBEDO = {k: max(128, v // 4) for k, v in ALBEDO.items()}
    LIGHT = {k: max(64, v // 4) for k, v in LIGHT.items()}
    SAMPLES = 16


def subtree(name):
    ob = bpy.data.objects.get(name)
    if not ob:
        return []
    out, todo = [], [ob]
    while todo:
        o = todo.pop()
        out.append(o)
        todo.extend(o.children)
    return out


def select_only(obs, active=None):
    for o in list(vl.objects):
        if o is not None:
            o.select_set(False)
    for o in obs:
        o.hide_set(False)
        o.select_set(True)
    vl.objects.active = active or obs[0]


# capture the metadata before objects are joined away
def to_gl(v):
    return [round(v.x, 5), round(v.z, 5), round(-v.y, 5)]


vl.update()
meta = {"screens": {}, "hotspots": {}, "units": "metres, glTF axes (y up)"}
for sid, name in [("center", "SCR_center"), ("left", "SCR_left"), ("right", "SCR_right"), ("phone", "phone_screen")]:
    ob = bpy.data.objects[name]
    meta["screens"][sid] = [to_gl(ob.matrix_world @ v.co) for v in ob.data.vertices]
for k, (ob, local) in g["HS"].items():
    meta["hotspots"][k] = to_gl(ob.matrix_world @ local)
mat_ob = bpy.data.objects["mat"]
meta["mousepad"] = {"center": to_gl(mat_ob.matrix_world.translation), "size": [0.86, 0.4]}
meta["mouse"] = {"at": to_gl(bpy.data.objects["mouse"].matrix_world.translation), "turn": math.degrees(bpy.data.objects["mouse"].rotation_euler.z)}
meta["chair"] = {"at": to_gl(bpy.data.objects["chair"].matrix_world.translation), "turn": g["CHAIR_TURN"]}
meta["lamp"] = {"shade": to_gl(bpy.data.objects["shade"].matrix_world.translation)}
meta["ball"] = {"at": to_gl(bpy.data.objects["ball"].matrix_world.translation), "radius": g["BALL_R"]}
meta["steam"] = to_gl(bpy.data.objects["mug"].matrix_world @ Vector((0, 0, 0.09)))
meta["desk_top"] = TOP

# the steam volume and its domain are not exported
for name in DROP:
    for o in subtree(name):
        bpy.data.objects.remove(o, do_unlink=True)

# pull the separately exported objects out of their parents (keeping their place)
for name in SEPARATE:
    o = bpy.data.objects[name]
    mw = o.matrix_world.copy()
    o.parent = None
    o.matrix_world = mw

joined = {}
for gname, roots in GROUPS.items():
    obs = [o for r in roots for o in subtree(r) if o.name not in SEPARATE]
    empties = [o.name for o in obs if o.type == "EMPTY"]
    meshes = [o for o in obs if o.type in {"MESH", "CURVE"}]
    if not meshes:
        continue
    select_only(meshes)
    bpy.ops.object.make_single_user(type="SELECTED_OBJECTS", object=True, obdata=True)
    bpy.ops.object.convert(target="MESH")  # applies bevels, solidify, curves
    meshes = [o for o in vl.objects if o.select_get()]
    # a join merges UV layers by name, and the textures read layer 0: give every part one layer, "UVMap",
    # or a part whose layer is named differently (the wall print) loses its texture coordinates
    for o in meshes:
        uvs = o.data.uv_layers
        if not uvs:
            uvs.new(name="UVMap")
        uvs[0].name = "UVMap"
        while len(uvs) > 1:
            uvs.remove(uvs[1])
    # unparent, keeping transforms, so the join keeps world positions
    for o in meshes:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw
    select_only(meshes, meshes[0])
    bpy.ops.object.join()
    ob = vl.objects.active
    # drop the now-empty helper empties of this group first, so the joined mesh can take
    # the group's name (an empty called "chair" would otherwise turn it into "chair.001")
    for n in empties:
        if n in bpy.data.objects and bpy.data.objects[n] is not ob:
            bpy.data.objects.remove(bpy.data.objects[n], do_unlink=True)
    ob.name = gname
    # lightmap UVs: a new layer, active for baking; the original stays for the textures
    me = ob.data
    if not me.uv_layers:
        me.uv_layers.new(name="UVMap")
    src = me.uv_layers[0]
    src.active_render = True
    bake_uv = me.uv_layers.new(name="bake")
    me.uv_layers.active = bake_uv
    select_only([ob])
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.004, area_weight=0.0, scale_to_bounds=False)
    bpy.ops.object.mode_set(mode="OBJECT")
    joined[gname] = ob
    print("group", gname, len(me.polygons), "faces,", len(me.materials), "materials")

# ---------------------------------------------------------------- bake


def target(ob, img):
    """Point every material of the object at one bake image."""
    for slot in ob.material_slots:
        m = slot.material
        if not m:
            continue
        nt = m.node_tree
        n = nt.nodes.get("__bake__") or nt.nodes.new("ShaderNodeTexImage")
        n.name = "__bake__"
        n.image = img
        nt.nodes.active = n


# materials are shared between groups: give each group its own copies, so the active bake node is per group.
# A diffuse bake sees metal as black, so the copies bake metals as their base colour (brushed, not mirror).
for gname, ob in joined.items():
    for slot in ob.material_slots:
        if slot.material:
            slot.material = slot.material.copy()
            nt = slot.material.node_tree
            for n in nt.nodes if nt else []:
                if n.type == "BSDF_PRINCIPLED" and n.inputs["Metallic"].default_value > 0.3:
                    n.inputs["Metallic"].default_value = 0.0
                    n.inputs["Roughness"].default_value = max(0.4, n.inputs["Roughness"].default_value)

c = scene.cycles
c.device = "CPU"
c.use_denoising = False
scene.render.bake.margin = 8
scene.render.bake.use_clear = True
scene.render.bake.target = "IMAGE_TEXTURES"


def hide_moving(gname):
    """While baking the static room, the chair and mouse cast nothing (they move on the site)."""
    for name in MOVING:
        o = joined.get(name)
        if o:
            o.hide_render = gname not in MOVING or name != gname


def bake(gname, kind, size, samples, passes):
    ob = joined[gname]
    img = bpy.data.images.new(f"{gname}-{kind}", size, size, alpha=False, float_buffer=(kind != "albedo"))
    if kind != "albedo":
        img.colorspace_settings.name = "Non-Color"
    target(ob, img)
    hide_moving(gname)
    select_only([ob])
    c.samples = samples
    t0 = time.time()
    bpy.ops.object.bake(type="DIFFUSE", pass_filter=passes, margin=8, use_clear=True)
    print(f"baked {gname} {kind} {size}px in {time.time() - t0:.0f}s", flush=True)
    return img


def save_albedo(img, path):
    img.filepath_raw = path
    img.file_format = "PNG"
    img.save()


LM_SCALE = 4.0  # light values are stored as light / 4, sRGB-encoded, so 0..4 fits 8 bits


def save_light(img, path):
    w, h = img.size
    px = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(px)
    px = px.reshape(h, w, 4)[::-1, :, :3]  # Blender stores bottom-up
    v = np.clip(px / LM_SCALE, 0, 1)
    v = np.where(v <= 0.0031308, v * 12.92, 1.055 * np.power(v, 1 / 2.4) - 0.055)
    from PIL import Image, ImageFilter

    im = Image.fromarray((v * 255 + 0.5).astype(np.uint8), "RGB")
    im = im.filter(ImageFilter.GaussianBlur(0.8 if w <= 512 else 1.2))  # bakes have no denoiser: soften the grain
    im.save(path)


def set_evening():
    """The night set from build.py: night sky, lamp on, warm bounce, screens glowing."""
    wn = scene.world.node_tree
    env = next(n for n in wn.nodes if n.type == "TEX_ENVIRONMENT")
    env.image = bpy.data.images.load(os.path.join(ROOT, ".cache", "desk", "hdri", "night.exr"))
    next(n for n in wn.nodes if n.type == "BACKGROUND").inputs["Strength"].default_value = 0.05
    sun = bpy.data.objects["sun"]
    sun.data.energy, sun.data.color = 0.25, (0.62, 0.72, 1.0)
    fill = bpy.data.objects["fill"]
    fill.data.energy, fill.data.color = 18, (1.0, 0.78, 0.6)
    spot = bpy.data.objects.new("lamp_spot", bpy.data.lights.new("lamp_spot", "SPOT"))
    scene.collection.objects.link(spot)
    spot.data.energy, spot.data.color = 26, (1.0, 0.76, 0.5)
    spot.data.spot_size, spot.data.spot_blend, spot.data.shadow_soft_size = math.radians(95), 0.55, 0.02
    bulb = bpy.data.objects["bulb"]
    spot.location = bulb.matrix_world.translation + Vector((0, 0, 0.005))
    spot.rotation_euler = bpy.data.objects["bulb"].matrix_world.to_euler()
    # aim the spot the way the shade points (down its local -z)
    down = (bulb.matrix_world.to_3x3() @ Vector((0, 0, -1))).normalized()
    spot.rotation_euler = down.to_track_quat("-Z", "Y").to_euler()
    bounce = bpy.data.objects.new("bounce", bpy.data.lights.new("bounce", "POINT"))
    scene.collection.objects.link(bounce)
    bounce.data.energy, bounce.data.color, bounce.data.shadow_soft_size = 6, (1.0, 0.7, 0.45), 0.3
    bounce.location = (1.4, -0.4, 1.6)
    for m in bpy.data.materials:
        b = m.node_tree.nodes.get(m.get("bsdf", "")) if m.node_tree else None
        if not b:
            continue
        if m.name.startswith("bulb"):
            b.inputs["Emission Strength"].default_value = 30.0
        elif m.name.startswith("scr_"):
            b.inputs["Emission Strength"].default_value = 1.6
        elif m.name.startswith("lock"):
            b.inputs["Emission Strength"].default_value = 0.9


out = {}
for gname in joined:
    a = bake(gname, "albedo", ALBEDO[gname], 4, {"COLOR"})
    save_albedo(a, os.path.join(CACHE, f"{gname}-albedo.png"))
    if LIGHT_ONLY is not None and gname not in LIGHT_ONLY:
        continue
    lt = bake(gname, "day", LIGHT[gname], SAMPLES, {"DIRECT", "INDIRECT"})
    save_light(lt, os.path.join(CACHE, f"{gname}-day.png"))
set_evening()
for gname in joined:
    if LIGHT_ONLY is not None and gname not in LIGHT_ONLY:
        continue
    lt = bake(gname, "evening", LIGHT[gname], SAMPLES, {"DIRECT", "INDIRECT"})
    save_light(lt, os.path.join(CACHE, f"{gname}-evening.png"))

# ---------------------------------------------------------------- export

for o in joined.values():
    o.hide_render = False
    me = o.data
    # one material per group, so each group is one draw call on the site
    me.materials.clear()
    me.materials.append(bpy.data.materials.new(f"M_{o.name}"))
    for p in me.polygons:
        p.material_index = 0
    for uv in [u for u in me.uv_layers if u.name != "bake"]:
        me.uv_layers.remove(uv)
for name in SEPARATE:
    o = bpy.data.objects[name]
    o.name = name
export = list(joined.values()) + [bpy.data.objects[n] for n in SEPARATE]
select_only(export)
os.makedirs(PUB, exist_ok=True)
raw = os.path.join(CACHE, "desk-raw.glb")
bpy.ops.export_scene.gltf(
    filepath=raw,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_normals=False,
    export_texcoords=True,
    export_materials="PLACEHOLDER",
    export_yup=True,
)
meta["groups"] = list(joined.keys())
meta["lightScale"] = LM_SCALE
cam = bpy.data.objects["cam"]
meta["cameras"] = {"render": {"position": to_gl(cam.location), "lens": cam.data.lens, "sensor": cam.data.sensor_width}}
with open(os.path.join(CACHE, "desk3d.json"), "w") as f:
    json.dump(meta, f, indent=1)
print("exported", raw)
```

### `scripts/desk-blender/pack.mjs`

```js
// Pack the baked desk for the site: meshopt-compressed glTF, and WebP textures
// at full size (desktop) and half size (phones).
//   node scripts/desk-blender/pack.mjs
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const bake = path.join(root, ".cache/desk-blender/bake");
const out = path.join(root, "public/desk/3d");
fs.mkdirSync(out, { recursive: true });

execFileSync("npx", ["gltf-transform", "meshopt", path.join(bake, "desk-raw.glb"), path.join(out, "desk.glb"), "--level", "medium"], { stdio: "inherit", cwd: root });

const meta = JSON.parse(fs.readFileSync(path.join(bake, "desk3d.json"), "utf8"));
let total = fs.statSync(path.join(out, "desk.glb")).size;
for (const g of meta.groups) {
  for (const kind of ["albedo", "day", "evening"]) {
    const src = path.join(bake, `${g}-${kind}.png`);
    const { width } = await sharp(src).metadata();
    for (const [suffix, w] of [["", width], ["-m", Math.max(64, Math.round(width / 2))]]) {
      const dst = path.join(out, `${g}-${kind}${suffix}.webp`);
      await sharp(src).resize({ width: w }).webp({ quality: kind === "albedo" ? 82 : 76, effort: 6 }).toFile(dst);
      if (!suffix) total += fs.statSync(dst).size;
    }
  }
}
// the phone's lock screen and the live screens' stand-ins before the apps mount
await sharp(path.join(root, ".cache/desk-blender/tex/lockscreen.png")).resize({ width: 360 }).webp({ quality: 80 }).toFile(path.join(out, "lockscreen.webp"));
for (const s of ["left", "center", "right"]) await sharp(path.join(root, `.cache/desk-blender/screens/${s}.png`)).resize({ width: 1024 }).webp({ quality: 78 }).toFile(path.join(out, `screen-${s}.webp`));
fs.writeFileSync(path.join(out, "desk3d.json"), JSON.stringify(meta, null, 1) + "\n");
console.log(`desktop payload ${(total / 1024 / 1024).toFixed(2)} MB`);
```

### `scripts/desk-blender/encode.mjs`

```js
// Encode the rendered desk plates for the web: AVIF and WebP at a few widths.
// node scripts/desk-blender/encode.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const src = path.join(root, ".cache/desk-blender/out");
const dst = path.join(root, "public/desk/plates");
fs.mkdirSync(dst, { recursive: true });

const WIDTHS = { desktop: [1280, 1920, 2560], phone: [800, 1200] };
const lqip = {};

for (const view of ["desktop", "phone"]) {
  for (const phase of ["day", "night"]) {
    const file = path.join(src, `${view}-${phase}.png`);
    if (!fs.existsSync(file)) {
      console.log("missing", file);
      continue;
    }
    for (const w of WIDTHS[view]) {
      const base = sharp(file).resize({ width: w });
      const avif = path.join(dst, `${view}-${phase}-${w}.avif`);
      const webp = path.join(dst, `${view}-${phase}-${w}.webp`);
      await base.clone().avif({ quality: 66, effort: 6 }).toFile(avif);
      await base.clone().webp({ quality: 80, effort: 6 }).toFile(webp);
      console.log(view, phase, w, `${(fs.statSync(avif).size / 1024).toFixed(0)}KB avif`, `${(fs.statSync(webp).size / 1024).toFixed(0)}KB webp`);
    }
    // a tiny blurred placeholder, inlined as the background while the plate loads
    const tiny = await sharp(file).resize({ width: 32 }).webp({ quality: 50 }).toBuffer();
    lqip[`${view}-${phase}`] = `data:image/webp;base64,${tiny.toString("base64")}`;
  }
}
fs.writeFileSync(path.join(dst, "lqip.json"), JSON.stringify(lqip, null, 1) + "\n");
```

### `scripts/desk-blender/render-all.sh`

```bash
#!/usr/bin/env bash
# Render every plate (desktop and phone, day and night), then encode them for the web.
set -euo pipefail
cd "$(dirname "$0")/../.."
PY=.cache/bpy-venv/bin/python
[ -x "$PY" ] || { python3 -m venv .cache/bpy-venv && $PY -m pip install -q bpy==5.2.3 pillow; }
SAMPLES=${SAMPLES:-256}
for view in desktop phone; do
  for phase in day night; do
    $PY scripts/desk-blender/build.py --view $view --phase $phase --samples "$SAMPLES" 2>&1 | grep -E "^rendered|Error|Traceback" || true
  done
done
node scripts/desk-blender/encode.mjs
```

### `scripts/desk-photo/build.py`

```python
"""The photographed desk (public/workspace/wide.webp), rebuilt in Blender from code.

    .cache/bpy-venv/bin/python scripts/desk-photo/build.py [--samples 160] [--scale 1] [--out path]

Everything is placed through the camera solved from the photo (camera.json, place.py), so a render
lines up with the photo pixel for pixel. Used for the realism gate: the render goes next to the
photo, and only if it holds up does the site switch to this scene.

Units are metres; x right, y away from the camera, z up. The desk top is at z = TOP.
"""

import argparse
import math
import os
import random
import sys

import bpy  # noqa: I001
import bmesh
from mathutils import Euler, Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
ASSETS = os.path.join(ROOT, ".cache", "desk")
OUT = os.path.join(ROOT, ".cache", "desk-photo")
TEX = os.path.join(OUT, "tex")
os.makedirs(TEX, exist_ok=True)
sys.path.insert(0, HERE)
import place  # noqa: E402

C = place.C
TOP = 0.75
NIGHT = False

ap = argparse.ArgumentParser()
ap.add_argument("--samples", type=int, default=160)
ap.add_argument("--scale", type=float, default=1.0, help="1 = the photo's 1536 px; 2560/1536 for the full render")
ap.add_argument("--out", default=os.path.join(OUT, "render.png"))
ap.add_argument("--no-render", action="store_true")
args = ap.parse_args(sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:])

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# the helper and material section of the first desk build (helpers end where its room begins)
_src = open(os.path.join(ROOT, "scripts", "desk-blender", "build.py")).read()
_a = _src.index("# ---------------------------------------------------------------- helpers")
_b = _src.index("# ---------------------------------------------------------------- the room")
exec(compile(_src[_a:_b], "desk-blender/build.py (helpers)", "exec"))  # noqa: S102

random.seed(7)


def W(x, y, z=0.0):
    """Desk-top frame (z above the desk top) to world."""
    return Vector((x, y, TOP + z))


def G(u, v, z=0.0):
    """World point where photo pixel (u, v) meets the plane z above the desk top."""
    return W(*place.ground(u, v, z))


def emit(name, color, strength):
    m, nt, out = new_mat(name)
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = lin(color)
    e.inputs["Strength"].default_value = strength
    nt.links.new(e.outputs[0], out.inputs["Surface"])
    return m


def tinted_image(name, path, scale, hue=0.5, sat=1.0, val=1.0, rough=0.4, coat=0.0, bump=0.0, rot=0.0):
    """An image texture in object space, tinted, with optional bump from its own luminance."""
    m = principled(name, rough=rough)
    nt, b = m.node_tree, bsdf_of(m)
    N, L = nt.nodes, nt.links
    tc = N.new("ShaderNodeTexCoord")
    mp = N.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = scale
    mp.inputs["Rotation"].default_value = (0, 0, rot)
    t = N.new("ShaderNodeTexImage")
    t.image = image(path)
    t.projection = "BOX"
    t.projection_blend = 0.2
    hsv = N.new("ShaderNodeHueSaturation")
    hsv.inputs["Hue"].default_value = hue
    hsv.inputs["Saturation"].default_value = sat
    hsv.inputs["Value"].default_value = val
    L.new(tc.outputs["Object"], mp.inputs["Vector"])
    L.new(mp.outputs["Vector"], t.inputs["Vector"])
    L.new(t.outputs["Color"], hsv.inputs["Color"])
    L.new(hsv.outputs["Color"], b.inputs["Base Color"])
    setin(b, "Coat Weight", coat)
    setin(b, "Coat Roughness", 0.2)
    if bump:
        bp = N.new("ShaderNodeBump")
        bp.inputs["Strength"].default_value = bump
        bp.inputs["Distance"].default_value = 0.0005
        L.new(t.outputs["Color"], bp.inputs["Height"])
        L.new(bp.outputs["Normal"], b.inputs["Normal"])
    return m


def rounded_slab(name, w, d, h, r, mat, loc, rot=0.0, segs=8):
    """A flat slab with rounded corners in plan (mats, phones, coasters)."""
    bm = bmesh.new()
    pts = []
    for cx, cy, a0 in ((w / 2 - r, d / 2 - r, 0), (-w / 2 + r, d / 2 - r, 90), (-w / 2 + r, -d / 2 + r, 180), (w / 2 - r, -d / 2 + r, 270)):
        for i in range(segs + 1):
            a = math.radians(a0 + 90 * i / segs)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    bot = [bm.verts.new((x, y, 0)) for x, y in pts]
    top = [bm.verts.new((x, y, h)) for x, y in pts]
    bm.faces.new(bot[::-1])
    bm.faces.new(top)
    n = len(pts)
    for i in range(n):
        bm.faces.new((bot[i], bot[(i + 1) % n], top[(i + 1) % n], top[i]))
    uv = bm.loops.layers.uv.verify()
    for f in bm.faces:
        for lp in f.loops:
            lp[uv].uv = (lp.vert.co.x / w + 0.5, lp.vert.co.y / d + 0.5)
    ob = from_bm(name, bm, [mat], loc=loc, rot=(0, 0, rot))
    bevel(ob, min(h * 0.45, 0.002), 2, angle=30)
    return ob


def shadow_only(ob):
    """Casts shadows but is never seen by the camera (gobos, off-frame casters)."""
    ob.visible_camera = False
    ob.visible_glossy = False
    return ob


# ---------------------------------------------------------------- textures (drawn once)


def make_textures():
    from PIL import Image, ImageDraw, ImageFilter

    # notebook spread: cream paper, faint dot grid, pencil wireframes like the photo
    w, h = 2048, 1400
    im = Image.new("RGB", (w, h), (236, 228, 210))
    d = ImageDraw.Draw(im)
    for x in range(40, w, 44):
        for y in range(40, h, 44):
            d.point((x, y), fill=(205, 196, 178))
    pencil = (110, 104, 96)
    rnd = random.Random(3)
    for page in (0, 1):
        ox = 90 + page * (w // 2)
        for _ in range(4):
            x0 = ox + rnd.randint(0, 420)
            y0 = rnd.randint(80, 900)
            bw, bh = rnd.randint(200, 420), rnd.randint(140, 330)
            d.rectangle((x0, y0, x0 + bw, y0 + bh), outline=pencil, width=3)
            for k in range(rnd.randint(2, 5)):
                yy = y0 + 20 + k * (bh // 6)
                d.line((x0 + 16, yy, x0 + bw * rnd.uniform(0.4, 0.9), yy), fill=pencil, width=2)
            if rnd.random() < 0.5:
                d.line((x0, y0, x0 + bw, y0 + bh), fill=pencil, width=2)
                d.line((x0 + bw, y0, x0, y0 + bh), fill=pencil, width=2)
    d.line((w // 2, 0, w // 2, h), fill=(170, 160, 142), width=6)  # the gutter
    im.filter(ImageFilter.GaussianBlur(0.8)).save(os.path.join(TEX, "notebook.png"))

    # leaf gobo: soft-edged leaf shapes (white = leaf, casts shadow)
    g = Image.new("L", (2048, 2048), 0)
    d = ImageDraw.Draw(g)
    rnd = random.Random(11)
    for _ in range(420):
        cx, cy = rnd.randint(0, 2048), rnd.randint(0, 2048)
        a = rnd.uniform(0, math.pi)
        L_, Wd = rnd.randint(40, 120), rnd.randint(16, 46)
        pts = []
        for i in range(24):
            t = i / 23 * 2 * math.pi
            px_, py_ = L_ * math.cos(t), Wd * math.sin(t) * (0.6 + 0.4 * math.cos(t))
            pts.append((cx + px_ * math.cos(a) - py_ * math.sin(a), cy + px_ * math.sin(a) + py_ * math.cos(a)))
        d.polygon(pts, fill=255)
        d.line((cx, cy, cx + rnd.randint(-160, 160), cy + rnd.randint(60, 220)), fill=255, width=rnd.randint(3, 7))
    # leave gaps: keep it dappled, not solid
    g = g.filter(ImageFilter.GaussianBlur(3))
    g.save(os.path.join(TEX, "leaves.png"))

    # kraft paper
    k = Image.effect_noise((512, 512), 26).convert("RGB")
    base = Image.new("RGB", (512, 512), (178, 136, 92))
    Image.blend(base, k, 0.12).filter(ImageFilter.GaussianBlur(0.6)).save(os.path.join(TEX, "kraft.png"))

    # milk tea marbling for the cup
    t = Image.new("RGB", (512, 1024), (150, 98, 58))
    d = ImageDraw.Draw(t)
    rnd = random.Random(5)
    for _ in range(70):
        x = rnd.randint(0, 512)
        y = rnd.randint(0, 1024)
        d.line([(x + rnd.randint(-40, 40) * i / 6, y + i * 30) for i in range(7)], fill=(222, 196, 160), width=rnd.randint(8, 30))
    t.filter(ImageFilter.GaussianBlur(14)).save(os.path.join(TEX, "milktea.png"))


make_textures()

# ---------------------------------------------------------------- materials

M = {}
hw = os.path.join(ASSETS, "hardwood2_diffuse.jpg")
# walnut: the hardwood scan, warmer and darker, grain running across the desk
M["walnut"] = tinted_image("walnut", hw, (0.8, 0.8, 0.8), hue=0.485, sat=1.05, val=0.42, rough=0.36, coat=0.3, bump=0.03)
M["walnut_edge"] = tinted_image("walnut_edge", hw, (6, 6, 6), hue=0.48, sat=1.3, val=0.5, rough=0.4)
M["plaster"] = bumpy("plaster", "#dcc7a8", 0.92, scale=60, strength=0.12)
M["felt"] = bumpy("felt", "#33302d", 0.97, scale=900, strength=0.35, Sheen_Weight=0.35)
M["alu"] = bumpy("alu", "#b9b8b4", 0.34, scale=1800, strength=0.02, metal=1.0)
M["alu_dark"] = principled("alu_dark", "#5d5f62", 0.36, metal=1.0)
M["black_glass"] = principled("black_glass", "#040405", 0.3, Coat_Weight=0.25, Coat_Roughness=0.12)
M["bezel"] = principled("bezel", "#141416", 0.4)
M["kb_frame"] = principled("kb_frame", "#3c3e41", 0.42, metal=0.6)
M["cap_cream"] = bumpy("cap_cream", "#e9e1cf", 0.55, scale=600, strength=0.02)
M["cap_grey"] = bumpy("cap_grey", "#8f9396", 0.55, scale=600, strength=0.02)
M["laptop_keys"] = principled("laptop_keys", "#16171a", 0.6)
M["mouse"] = principled("mouse", "#d9d0c3", 0.32, Coat_Weight=0.4)
M["lamp_black"] = principled("lamp_black", "#151515", 0.45, metal=0.3)
M["lamp_inner"] = principled("lamp_inner", "#f3efe6", 0.6)
M["paper"] = textured("paper", os.path.join(TEX, "notebook.png"), rough=0.8)
M["page_edge"] = pages()
M["leather"] = bumpy("leather", "#2a2622", 0.6, scale=300, strength=0.08)
M["pen"] = principled("pen", "#121212", 0.25, metal=0.5)
M["cork"] = bumpy("cork", "#b48759", 0.85, scale=260, strength=0.4)
M["glass"] = principled("glass", "#ffffff", 0.03, Transmission_Weight=1.0, IOR=1.45)
M["tea"] = principled("tea", rough=0.2, Subsurface_Weight=0.35, Subsurface_Radius=(0.01, 0.006, 0.003))
_t = M["tea"].node_tree.nodes.new("ShaderNodeTexImage")
_t.image = image(os.path.join(TEX, "milktea.png"))
M["tea"].node_tree.links.new(_t.outputs["Color"], bsdf_of(M["tea"]).inputs["Base Color"])
M["pearl"] = principled("pearl", "#1b100b", 0.12, Coat_Weight=1.0, Subsurface_Weight=0.3)
M["straw"] = principled("straw", "#c4452f", 0.35, Coat_Weight=0.5)
M["kraft"] = textured("kraft", os.path.join(TEX, "kraft.png"), rough=0.7)
M["window_film"] = principled("window_film", "#ffffff", 0.2, Transmission_Weight=1.0, IOR=1.0)
M["nut"] = bumpy("nut", "#9a6a3c", 0.5, scale=120, strength=0.3)
M["phone"] = principled("phone", "#0b0b0c", 0.08, Coat_Weight=1.0, Coat_Roughness=0.02)
M["phone_rim"] = principled("phone_rim", "#3a3b3d", 0.3, metal=1.0)
M["book_green"] = bumpy("book_green", "#2f4a3a", 0.7, scale=400, strength=0.1)
M["book_cream"] = bumpy("book_cream", "#d8c7a3", 0.75, scale=400, strength=0.1)
M["book_red"] = bumpy("book_red", "#7f3424", 0.7, scale=400, strength=0.1)
M["book_slate"] = bumpy("book_slate", "#2d3337", 0.7, scale=400, strength=0.1)
M["orange"] = principled("orange", "#ff6a1a", 0.35)
M["frame_white"] = principled("frame_white", "#efe7da", 0.6)
M["shelf"] = tinted_image("shelf", hw, (3, 3, 3), hue=0.47, sat=1.2, val=0.32, rough=0.5)
M["sheer"] = principled("sheer", "#e8d6ba", 0.85, Emission_Color=lin("#ffe2bd"), Emission_Strength=0.35)
M["leaf"] = principled("leaf", "#2f5a2a", 0.45, Subsurface_Weight=0.2)
M["pot"] = bumpy("pot", "#c9b9a2", 0.8, scale=200, strength=0.1)
M["gobo"] = None  # built below

# ---------------------------------------------------------------- room

desk_front = G(768, 845)[1]
wall_y = C["ywall"]
box("desk", (2.6, wall_y - desk_front + 0.02, 0.035), loc=W(0, (wall_y + desk_front) / 2 - 0.01, -0.0175), mat=M["walnut"], bev=0.004)
box("desk_edge", (2.6, 0.006, 0.035), loc=W(0, desk_front - 0.003 - 0.01, -0.0175), mat=M["walnut_edge"])
box("floor", (6, 6, 0.01), loc=(0, 0, 0), mat=M["walnut_edge"])

# back wall with a window on the left: wall pieces around the opening
win_x0, win_x1 = -1.6, place.at_depth(357, 150, wall_y)[0]
win_z0 = place.at_depth(357, 282, wall_y)[2] + TOP
win_z1 = TOP + 1.4
box("wall_right", (3.0, 0.08, 2.4), loc=(win_x1 + 1.5, wall_y + 0.04, TOP + 0.4), mat=M["plaster"])
box("wall_below_window", (win_x1 - win_x0, 0.08, win_z0 - TOP + 0.8), loc=((win_x0 + win_x1) / 2, wall_y + 0.04, (win_z0 + TOP - 0.8) / 2), mat=M["plaster"])
box("wall_above_window", (win_x1 - win_x0, 0.08, 0.6), loc=((win_x0 + win_x1) / 2, wall_y + 0.04, win_z1 + 0.3), mat=M["plaster"])
box("window_frame_v", (0.035, 0.1, win_z1 - win_z0), loc=(win_x1 - 0.0175, wall_y + 0.02, (win_z0 + win_z1) / 2), mat=M["frame_white"], bev=0.003)
box("window_sill", (win_x1 - win_x0, 0.12, 0.03), loc=((win_x0 + win_x1) / 2, wall_y + 0.03, win_z0 - 0.015), mat=M["frame_white"], bev=0.003)
box("window_sheer", (win_x1 - win_x0, 0.01, win_z1 - win_z0), loc=((win_x0 + win_x1) / 2, wall_y + 0.07, (win_z0 + win_z1) / 2), mat=M["sheer"])

# dark shelf at the far right edge
sx_ = place.at_depth(1478, 300, wall_y - 0.05)[0]
box("shelf_side", (0.03, 0.3, 1.6), loc=(sx_ + 0.015, wall_y - 0.15, TOP + 0.3), mat=M["shelf"])
for zz in (0.38, 0.7):
    box(f"shelf_board_{zz}", (0.4, 0.3, 0.025), loc=(sx_ + 0.2, wall_y - 0.15, TOP + zz), mat=M["shelf"])

# ---------------------------------------------------------------- mat, keyboard, mouse

rounded_slab("mat", C["matW"], C["matD"], 0.003, 0.012, M["felt"], W(0, 0, 0))

kb = empty("keyboard", loc=W(C["kx"], C["ky"], 0))
box("kb_case", (0.33, 0.115, 0.02), loc=(0, 0, 0.01), mat=M["kb_frame"], bev=0.004, parent=kb)
# a 75% layout: function row, number row and four rows, arrows at the bottom right
rows = [
    [1] + [1] * 12 + [1, 1],
    [1] * 13 + [2, 1],
    [1.5] + [1] * 12 + [1.5, 1],
    [1.75] + [1] * 11 + [2.25, 1],
    [2.25] + [1] * 10 + [1.75, 1, 1],
    [1.25, 1.25, 1.25, 6.25, 1, 1, 1, 1, 1, 1],
]
U = 0.0195
grey_keys = {(0, 0), (1, 13), (2, 0), (3, 0), (3, 12), (4, 0), (4, 11)}
for ri, row in enumerate(rows):
    x = -0.155
    y = 0.045 - ri * U
    for ci, wd in enumerate(row):
        grey = (ri, ci) in grey_keys or ri == 5 or ci == len(row) - 1 or (ri == 0 and ci in (1, 2, 3, 4, 9, 10, 11, 12))
        if ri == 5 and ci == 3:
            grey = False
        cap = box(f"cap_{ri}_{ci}", (wd * U - 0.0028, U - 0.0028, 0.0085), loc=(x + wd * U / 2, y, 0.0225), mat=M["cap_grey" if grey else "cap_cream"], bev=0.0018, segs=2, parent=kb)
        cap.scale = (1, 1, 1)
        x += wd * U

mo = G(1070, 700)
mouse = sphere("mouse", 0.03, loc=(mo.x, mo.y, TOP + 0.003), scale=(1.0, 1.75, 0.55), mat=M["mouse"])
mouse.rotation_euler = (0, 0, math.radians(-4))

# ---------------------------------------------------------------- laptop on a stand, two side screens

sx, sy, sz, tilt = C["sx"], C["sy"], C["sz"], C["tilt"]
stand_foot = G(770, 600)
st = empty("stand", loc=(sx, stand_foot.y, TOP))
box("stand_base", (0.2, 0.12, 0.008), loc=(0, 0.0, 0.004), mat=M["alu"], bev=0.003, parent=st)
for side in (-1, 1):
    leg = box(f"stand_leg{side}", (0.012, 0.03, 0.12), loc=(side * 0.08, 0.03, 0.06), mat=M["alu"], bev=0.003, parent=st)
    leg.rotation_euler = (math.radians(-28), 0, 0)
# the laptop deck rises from the front (towards the camera) to the hinge under the screen
hinge = W(sx, sy, sz - 0.006)
# walk along the ray through the deck's front edge in the photo until it is 22 cm from the hinge
_best = None
for _i in range(400):
    _z = 0.02 + _i * 0.0004
    _p = W(*place.ground(765, 538, _z))
    _d = abs((_p - hinge).length - 0.22)
    if _best is None or _d < _best[0]:
        _best = (_d, _p)
front = _best[1]
deck_len = (hinge - front).length
deck_ang = math.atan2(hinge.z - front.z, hinge.y - front.y)
deck = box("laptop_deck", (0.305, deck_len, 0.012), loc=(front + hinge) / 2, rot=(deck_ang, 0, 0), mat=M["alu_dark"], bev=0.004)
kbd = box("laptop_keys", (0.27, deck_len * 0.5, 0.001), loc=(0, deck_len * 0.15, 0.0062), mat=M["laptop_keys"], parent=deck)
box("trackpad", (0.11, deck_len * 0.28, 0.0008), loc=(0, -deck_len * 0.28, 0.0062), mat=M["alu"], parent=deck)

up = Vector((0, math.sin(tilt), math.cos(tilt)))


def panel(name, x0, x1, y_off=0.0, height=0.195, bottom=sz):
    """A screen panel: dark bezel slab with a glossy black screen face toward the camera."""
    w = x1 - x0
    c = W((x0 + x1) / 2, sy + y_off, bottom) + up * (height / 2)
    ob = box(name, (w + 0.012, 0.006, height + 0.012), loc=c + Vector((0, 0.004, 0)), rot=(-tilt, 0, 0), mat=M["bezel"], bev=0.003)
    face = box(name + "_glass", (w, 0.001, height), loc=c - Vector((0, 0.0005, 0)), rot=(-tilt, 0, 0), mat=M["black_glass"])
    return ob, face


panel("laptop_lid", sx - 0.15, sx + 0.15)
# side screens from the photo's quads, in the same plane as the laptop screen
lx0 = place.at_depth(296, 335, sy)[0]
lx1 = place.at_depth(579, 335, sy)[0]
rx0 = place.at_depth(951, 335, sy)[0]
rx1 = place.at_depth(1240, 335, sy)[0]
side_h = place.at_depth(296, 231, sy)[2] - place.at_depth(296, 437, sy)[2]
side_bottom = place.at_depth(296, 437, sy)[2]
panel("screen_left", lx0, lx1, 0.004, side_h, side_bottom)
panel("screen_right", rx0, rx1, 0.004, side_h, side_bottom)
for x in (lx1 + 0.006, rx0 - 0.006):
    box(f"hinge_{x:.2f}", (0.008, 0.012, side_h * 0.9), loc=W(x, sy + 0.006, side_bottom + side_h / 2), mat=M["alu_dark"], bev=0.002)

# ---------------------------------------------------------------- left: lamp, books, device, notebook

lb = G(58, 548)
lamp = empty("lamp", loc=lb)
cyl("lamp_base", 0.075, 0.018, loc=(0, 0, 0), mat=M["lamp_black"], base=True, parent=lamp)
head = Vector(place.at_depth(240, 200, wall_y - 0.08))
head_w = W(head.x, head.y, head.z)
elbow = W(lb.x - TOP * 0 - lb.x + place.at_depth(28, 300, lb.y)[0], lb.y, place.at_depth(28, 300, lb.y)[2])
tube("lamp_pole", [lb + Vector((0, 0, 0.01)), elbow], 0.007, M["lamp_black"])
tube("lamp_arm", [elbow, head_w + Vector((-0.06, 0, 0.0))], 0.006, M["lamp_black"])
sphere("lamp_joint", 0.012, loc=elbow, mat=M["lamp_black"])
shade = cyl("lamp_shade", 0.03, 0.08, loc=head_w, mat=M["lamp_black"], r2=0.027)
shade.rotation_euler = (math.radians(-10), math.radians(-28), 0)
inner = cyl("lamp_inner", 0.039, 0.004, loc=head_w, mat=M["lamp_inner"])
inner.rotation_euler = shade.rotation_euler
inner.location = head_w + Vector((0.03, 0, -0.05))

# five books stacked flat at the back left (bottom to top: slate, cream, red, cream, green)
bf = G(272, 540)
y_books = bf.y + 0.11
z = 0.0
for i, (mat, th) in enumerate([("book_slate", 0.034), ("book_cream", 0.03), ("book_red", 0.034), ("book_cream", 0.028), ("book_green", 0.026)]):
    wdt = 0.27 - i * 0.008
    b = box(f"book{i}", (wdt, 0.2, th), loc=W(bf.x - wdt / 2 + 0.005 * (i % 2), y_books, z + th / 2), mat=M[mat], bev=0.003, segs=2)
    b.data.materials.append(M["page_edge"])
    z += th

dev = G(372, 590)
box("device", (0.12, 0.07, 0.03), loc=W(dev.x - TOP * 0, dev.y, 0.015) - Vector((0, 0, 0)), mat=M["alu"], bev=0.006)
cyl("device_knob", 0.022, 0.026, loc=W(dev.x - 0.015, dev.y + 0.005, 0.03), mat=M["alu"], base=True)
box("device_button", (0.018, 0.012, 0.004), loc=W(dev.x + 0.035, dev.y - 0.02, 0.031), mat=M["orange"], bev=0.002)

nb = G(175, 700, 0.01)
note = empty("notebook", loc=nb, rot=(0, 0, math.radians(-14)))
box("notebook_cover", (0.42, 0.28, 0.004), loc=(0, 0, 0.002), mat=M["leather"], bev=0.002, parent=note)
pg = box("notebook_pages", (0.405, 0.265, 0.008), loc=(0, 0, 0.008), mat=M["paper"], parent=note)
pen = cyl("pen", 0.0045, 0.14, loc=(-0.02, 0.02, 0.016), mat=M["pen"], parent=note)
pen.rotation_euler = (math.radians(90), 0, math.radians(68))

# ---------------------------------------------------------------- right: cup, pouch, phone, ball, plant

co = G(1283, 615, 0.004)
rounded_slab("coaster", 0.1, 0.1, 0.006, 0.05, M["cork"], co - Vector((0, 0, 0.004)))
cup = empty("cup", loc=co + Vector((0, 0, 0.006)))
cup_h = place.at_depth(1283, 445, co.y)[2] - (co.z - TOP)
cyl("cup_glass", 0.03, cup_h, mat=M["glass"], r2=0.045, base=True, caps=False, parent=cup)
cyl("cup_tea", 0.0285, cup_h * 0.86, mat=M["tea"], r2=0.042, base=True, parent=cup)
for i in range(26):
    a = random.uniform(0, 2 * math.pi)
    r_ = random.uniform(0, 0.022)
    sphere(f"pearl{i}", 0.0055, loc=(r_ * math.cos(a), r_ * math.sin(a), 0.007 + random.uniform(0, 0.022)), mat=M["pearl"], parent=cup)
straw = cyl("straw", 0.0045, cup_h * 1.25, loc=(0.012, 0.0, 0.01), mat=M["straw"], base=True, parent=cup)
straw.rotation_euler = (0, math.radians(-6), 0)

po = G(1405, 645)
pouch = empty("pouch", loc=po, rot=(0, 0, math.radians(-8)))
pb = box("pouch_body", (0.095, 0.035, 0.13), loc=(0, 0, 0.065), mat=M["kraft"], bev=0.01, segs=3, parent=pouch)
subsurf(pb, 1)
box("pouch_window", (0.06, 0.002, 0.06), loc=(0, -0.019, 0.055), mat=M["window_film"], parent=pouch)
for i in range(18):
    sphere(f"nut{i}", 0.006, loc=(random.uniform(-0.025, 0.025), -0.012, random.uniform(0.03, 0.08)), scale=(1.3, 0.9, 1.0), mat=M["nut"], parent=pouch)

ph = G(1318, 705, 0.0)
phone = rounded_slab("phone", 0.075, 0.155, 0.008, 0.01, M["phone_rim"], ph, rot=math.radians(28))
rounded_slab("phone_glass", 0.071, 0.151, 0.0006, 0.009, M["phone"], ph + Vector((0, 0, 0.008)), rot=math.radians(28))

bs = G(1495, 548)
ball_c = W(bs.x + 0.02, bs.y + 0.02, 0.13)
cyl("ball_stand", 0.055, 0.014, loc=W(bs.x + 0.02, bs.y + 0.02, 0), mat=M["walnut_edge"], base=True)
bt = os.path.join(ROOT, ".cache", "desk-blender", "tex", "basketball.png")
ball_mat = textured("ball", bt, rough=0.55) if os.path.exists(bt) else principled("ball", "#c25a28", 0.55)
sphere("ball", 0.12, loc=ball_c, mat=ball_mat)

# plant: the pothos model, hanging from a pot on the shelf top right
plant = empty("plant", loc=W(place.at_depth(1290, 120, wall_y - 0.12)[0], wall_y - 0.12, 0.3))
cyl("pot", 0.08, 0.12, loc=(0, 0, 0), mat=M["pot"], r2=0.09, base=True, parent=plant)
try:
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(ASSETS, "DiffuseTransmissionPlant.glb"))
    new = [o for o in bpy.data.objects if o not in before]
    bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c_) for o in new if o.type == "MESH" for c_ in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    k = 0.55 / max(1e-6, hi.z - lo.z)
    fit = empty("plant_fit", parent=plant)
    fit.scale = (k, k, k)
    fit.location = (-(lo.x + hi.x) / 2 * k, -(lo.y + hi.y) / 2 * k, -lo.z * k + 0.1)
    for o in new:
        if o.parent is None:
            o.parent = fit
        if "firefly" in o.name:
            bpy.data.objects.remove(o, do_unlink=True)
except Exception as e:  # keep going without it
    print("plant import failed:", e)

# ---------------------------------------------------------------- light: golden hour from the left

world = bpy.data.worlds.new("world")
scene.world = world
world.use_nodes = True
wn = world.node_tree
wn.nodes.clear()
wo = wn.nodes.new("ShaderNodeOutputWorld")
bg = wn.nodes.new("ShaderNodeBackground")
env = wn.nodes.new("ShaderNodeTexEnvironment")
env.image = bpy.data.images.load(os.path.join(ASSETS, "hdri", "apartment.exr"))
wn.links.new(env.outputs["Color"], bg.inputs["Color"])
bg.inputs["Strength"].default_value = 0.35
wn.links.new(bg.outputs[0], wo.inputs["Surface"])

sun = bpy.data.objects.new("sun", bpy.data.lights.new("sun", "SUN"))
link(sun)
sun.data.energy = 5.5
sun.data.angle = math.radians(0.8)
sun.data.color = (1.0, 0.74, 0.48)
sun_dir = Vector((0.78, 0.55, -0.3)).normalized()
sun.rotation_euler = sun_dir.to_track_quat("-Z", "Y").to_euler()

# leaf gobo between the sun and the wall: dappled shadows like the photo
gobo = bpy.data.materials.new("gobo")
gobo.use_nodes = True
gn = gobo.node_tree
gn.nodes.clear()
go = gn.nodes.new("ShaderNodeOutputMaterial")
tr = gn.nodes.new("ShaderNodeBsdfTransparent")
df = gn.nodes.new("ShaderNodeBsdfDiffuse")
df.inputs["Color"].default_value = (0, 0, 0, 1)
mix = gn.nodes.new("ShaderNodeMixShader")
gt = gn.nodes.new("ShaderNodeTexImage")
gt.image = image(os.path.join(TEX, "leaves.png"), non_color=True)
gn.links.new(gt.outputs["Color"], mix.inputs["Fac"])
gn.links.new(tr.outputs[0], mix.inputs[1])
gn.links.new(df.outputs[0], mix.inputs[2])
gn.links.new(mix.outputs[0], go.inputs["Surface"])
gb = quad("gobo", [(-1.9, -0.6, 2.4), (-0.4, 0.2, 2.6), (-0.4, 0.2, 1.0), (-1.9, -0.6, 0.8)], gobo)
shadow_only(gb)

fill = bpy.data.objects.new("fill", bpy.data.lights.new("fill", "AREA"))
link(fill)
fill.data.size, fill.data.size_y = 2.0, 1.2
fill.data.shape = "RECTANGLE"
fill.data.energy = 60
fill.data.color = (1.0, 0.86, 0.72)
fill.location = (0.4, -2.0, 1.9)
look_at(fill, W(0, 0.1, 0))

# ---------------------------------------------------------------- camera (the solved one)

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
link(cam)
scene.camera = cam
cam.data.sensor_fit = "HORIZONTAL"
cam.data.sensor_width = 36
cam.data.lens = C["f"] * 36 / C["image"][0]
cam.location = (C["camx"], C["camy"], TOP + C["h"])
cam.rotation_euler = (math.pi / 2 - C["pitch"], 0, C["yaw"])
cam.data.dof.use_dof = True
cam.data.dof.focus_distance = (W(0, 0.1, 0.05) - cam.location).length
cam.data.dof.aperture_fstop = 4.0

r = scene.render
r.engine = "CYCLES"
r.resolution_x = int(1536 * args.scale)
r.resolution_y = int(864 * args.scale)
r.image_settings.file_format = "PNG"
c = scene.cycles
c.device = "CPU"
c.samples = args.samples
c.use_adaptive_sampling = True
c.adaptive_threshold = 0.015
c.use_denoising = True
try:
    c.denoiser = "OPENIMAGEDENOISE"
except Exception:
    pass
c.max_bounces = 8
c.transmission_bounces = 8
c.caustics_reflective = False
c.caustics_refractive = False
c.sample_clamp_indirect = 6
vs = scene.view_settings
vs.view_transform = "AgX"
for look in ("AgX - Medium High Contrast", "Medium High Contrast"):
    try:
        vs.look = look
        break
    except Exception:
        pass

if args.no_render:
    raise SystemExit(0)
r.filepath = args.out
bpy.ops.render.render(write_still=True)
print("rendered", args.out)
```
