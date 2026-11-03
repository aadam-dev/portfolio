"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { findProject } from "@/lib/projects";
import { useDialog } from "@/lib/useDialog";
import { AppIcon, AppScreen, StatusBar, useClock } from "../kit/parts";
import { useOsText, useTextDir, type OsText } from "../l10n";
import MusicApp, { music, useMusic } from "../apps/music";
import MailApp from "../apps/mail";
import KitsApp from "../apps/kits";
import AboutDoc from "../apps/document";
import { CodeApp, PreviewApp, TextApp } from "../apps/viewers";
import CameraApp from "./camera";
import PhotosApp from "./photos";
import CalendarApp from "./calendar";
import { AlBoyutPhone, BloomPhone, ClockPhone, ContactsPhone, CourtPhone, FilesPhone, MapsPhone, NotesPhone, SafariPhone, SettingsPhone, SystemsPhone, WalletPhone, WALLS, WHATSAPP, useWallpaper } from "./apps";

export type PhoneAppId =
  | "camera"
  | "photos"
  | "calendar"
  | "notes"
  | "music"
  | "maps"
  | "wallet"
  | "files"
  | "kits"
  | "systems"
  | "bloom"
  | "alboyut"
  | "court"
  | "safari"
  | "mail"
  | "contacts"
  | "clock"
  | "settings"
  | "about"
  | "preview"
  | "code"
  | "text";

type Open = { id: PhoneAppId; file?: string; subject?: string; album?: "yours" };

/** Icon art for each app: a gradient and a glyph, like the real ones, or a project screen. */
const ICON: Record<string, { bg: string; glyph?: ReactNode; img?: string }> = {
  camera: { bg: "linear-gradient(180deg,#d9d9de,#8e8e93)", glyph: <Glyph d="M8 9h3l2-3h6l2 3h3v12H8z M16 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" /> },
  photos: { bg: "#fff", glyph: <Flower /> },
  calendar: { bg: "#fff", glyph: <CalendarGlyph /> },
  notes: { bg: "linear-gradient(180deg,#ffd60a 0 26%,#fffdf5 26%)", glyph: <span className="mt-3 block w-[60%] space-y-1">{[0, 1, 2].map((i) => <span key={i} className="block h-[2px] bg-black/15" />)}</span> },
  music: { bg: "linear-gradient(160deg,#ff6482,#fa2d48)", glyph: <span className="text-[26px] text-white">♪</span> },
  maps: { bg: "linear-gradient(135deg,#a8e063 0 40%,#f4f1ea 40% 55%,#7cc4ff 55%)", glyph: <span className="text-[22px] text-[#ff3b30] [text-shadow:0_1px_0_#fff]">●</span> },
  wallet: { bg: "#111", glyph: <span className="flex w-[64%] flex-col gap-[3px]">{["#ff9f0a", "#30d158", "#0a84ff"].map((c) => <span key={c} className="block h-[7px] rounded-[2px]" style={{ background: c }} />)}</span> },
  files: { bg: "#fff", glyph: <span className="block h-[52%] w-[66%] rounded-[4px] bg-gradient-to-b from-[#7cc4ff] to-[#1a73e8]" /> },
  kits: { bg: "linear-gradient(160deg,#ff8a5c,#c2410c)", glyph: <span className="text-[24px] text-white">◆</span> },
  systems: { bg: "linear-gradient(160deg,#2b2f36,#0e1116)", glyph: <span className="font-mono text-[15px] font-bold text-[#9fe3a6]">&gt;_</span> },
  safari: { bg: "linear-gradient(160deg,#5ac8fa,#007aff)", glyph: <Compass /> },
  mail: { bg: "linear-gradient(160deg,#4fc3ff,#1a73e8)", glyph: <Glyph d="M7 10h18v12H7z M7 10l9 7 9-7" /> },
  whatsapp: { bg: "linear-gradient(160deg,#5be37d,#1fa851)", glyph: <span className="text-[22px] text-white">✆</span> },
  contacts: { bg: "linear-gradient(160deg,#d1d1d6,#8e8e93)", glyph: <span className="text-[24px] text-white">☺</span> },
  clock: { bg: "#111", glyph: <ClockGlyph /> },
  settings: { bg: "linear-gradient(160deg,#aeaeb2,#636366)", glyph: <span className="text-[26px] text-white/90">⚙</span> },
  about: { bg: "linear-gradient(160deg,#f4f1ea,#d9d3c6)", glyph: <span className="font-serif text-[22px] font-bold text-black/70">A</span> },
  bloom: { bg: "#222", img: "/studio/bloom-builder-taro.webp" },
  court: { bg: "#222", img: "/previews/madinabasketball/court.webp" },
};

const PAGE1: PhoneAppId[] = ["camera", "photos", "calendar", "notes"];
const PAGE2: PhoneAppId[] = ["alboyut", "bloom", "court", "systems", "maps", "wallet", "files", "kits", "contacts", "clock", "about", "settings"];
const DOCK: (PhoneAppId | "whatsapp")[] = ["mail", "safari", "music", "whatsapp"];
const LIGHT: PhoneAppId[] = ["calendar", "notes", "about", "text"];

/**
 * Aadam's phone. On small screens it is the hero itself; on the desk it is picked up as a sheet.
 * Every app does something real: the camera uploads (after consent, shown after approval),
 * the calendar books a call, mail reaches me.
 */
export default function Phone({ variant, onClose, headline }: { variant: "hero" | "sheet"; onClose?: () => void; headline?: { eyebrow: string; title: string } }) {
  const t = useOsText();
  const [open, setOpen] = useState<Open | null>(null);
  const [page, setPage] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const appLayer = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  const goHome = useCallback(() => setOpen(null), []);

  // Esc: the app first, then the phone (sheet) or nothing (hero)
  const onEscape = useCallback(() => (openRef.current ? setOpen(null) : onClose?.()), [onClose]);
  useDialog(sheet, onEscape, variant === "sheet");
  useEffect(() => {
    if (variant !== "hero") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openRef.current && root.current?.contains(document.activeElement)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [variant]);

  const launch = (id: PhoneAppId, extra: Partial<Open> = {}) => setOpen({ id, ...extra });

  const screen = (
    <div
      ref={root}
      dir="ltr"
      className="relative h-full w-full overflow-hidden rounded-[inherit] bg-black text-white"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, var(--font-sans)" }}
      role={variant === "hero" ? "region" : undefined}
      aria-label={variant === "hero" ? t.phone.label : undefined}
    >
      <Home t={t} headline={headline} page={page} setPage={setPage} launch={launch} hidden={!!open} />
      {open && (
        <div ref={appLayer} className="absolute inset-0 z-10 [animation:aos-pop_.28s_cubic-bezier(.22,1,.36,1)_both]">
          <AppScreen title={title(open, t)} onHome={goHome} light={LIGHT.includes(open.id)} homeLabel={t.phone.home}>
            <AppBody open={open} launch={launch} leave={onClose ?? goHome} />
          </AppScreen>
          <EdgeSwipe layer={appLayer} onBack={goHome} />
        </div>
      )}
      {/* the home indicator */}
      <button
        onClick={() => (open ? goHome() : variant === "sheet" ? onClose?.() : undefined)}
        className={`absolute bottom-1.5 left-1/2 z-30 h-[5px] w-[128px] -translate-x-1/2 rounded-full ${open && LIGHT.includes(open.id) ? "bg-black/70" : "bg-white/85"}`}
        aria-label={open ? t.phone.goHome : t.phone.putDown}
        tabIndex={open || variant === "sheet" ? 0 : -1}
      />
    </div>
  );

  if (variant === "hero") return screen;
  return (
    <div ref={sheet} className="theme-fixed fixed inset-0 z-[95] flex items-center justify-center bg-black/70 backdrop-blur-md [animation:aos-pop_.4s_cubic-bezier(.22,1,.36,1)_both]" role="dialog" aria-modal="true" aria-label={t.phone.label}>
      <button onClick={onClose} data-autofocus className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white hover:bg-white/20">
        {t.phone.putDown} ✕
      </button>
      <PhoneFrame className="h-[min(88svh,860px)]">{screen}</PhoneFrame>
    </div>
  );
}

/** The device: titanium edge, black bezel, the screen inside. */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative aspect-[9/19.5] max-w-[92vw] rounded-[54px] bg-[#1a1a1c] p-[10px] shadow-[0_40px_120px_rgba(0,0,0,0.55),inset_0_0_0_2px_#3a3a3c] ${className}`}>
      <div className="h-full w-full rounded-[44px]">{children}</div>
    </div>
  );
}

function title(o: Open, t: OsText) {
  if (o.id === "preview" || o.id === "code" || o.id === "text") return o.file ?? t.phone.apps.files;
  return t.phone.apps[o.id as keyof OsText["phone"]["apps"]] ?? "";
}

function AppBody({ open, launch, leave }: { open: Open; launch: (id: PhoneAppId, extra?: Partial<Open>) => void; leave: () => void }) {
  switch (open.id) {
    case "camera":
      return <CameraApp onSaved={() => launch("photos", { album: "yours" })} />;
    case "photos":
      return <PhotosApp start={open.album} openCamera={() => launch("camera")} />;
    case "calendar":
      return <CalendarApp />;
    case "notes":
      return <NotesPhone />;
    case "music":
      return <MusicApp live />;
    case "maps":
      return <MapsPhone />;
    case "wallet":
      return <WalletPhone />;
    case "files":
      return <FilesPhone onOpen={(o) => launch(o.app, { file: o.id })} openKits={(id) => launch("kits", { file: id })} />;
    case "kits":
      return <KitsApp file={open.file} live compact onStart={(name) => launch("mail", { subject: name })} />;
    case "systems":
      return <SystemsPhone />;
    case "bloom":
      return <BloomPhone />;
    case "alboyut":
      return <AlBoyutPhone />;
    case "court":
      return <CourtPhone leave={leave} />;
    case "safari":
      return <SafariPhone />;
    case "mail":
      return <MailApp flat subject={open.subject} />;
    case "contacts":
      return <ContactsPhone />;
    case "clock":
      return <ClockPhone />;
    case "settings":
      return <SettingsPhone />;
    case "about":
      return <AboutDoc />;
    case "preview":
      return <PreviewApp file={open.file} live />;
    case "code":
      return <CodeApp file={open.file} />;
    case "text":
      return <TextApp file={open.file} />;
  }
}

/* ------------------------------------------------------------------ home screen */

function Home({ t, headline, page, setPage, launch, hidden }: { t: OsText; headline?: { eyebrow: string; title: string }; page: number; setPage: (n: number) => void; launch: (id: PhoneAppId) => void; hidden: boolean }) {
  const wall = useWallpaper();
  const dir = useTextDir();
  const pages = useRef<HTMLDivElement>(null);
  const alboyut = findProject("al-boyut");
  const icon = (id: PhoneAppId | "whatsapp", dock = false) => {
    const art = id === "alboyut" ? { bg: "#222", img: alboyut?.mobileShowcase?.[0]?.src } : ICON[id];
    const name = t.phone.apps[id as keyof OsText["phone"]["apps"]];
    return (
      <div key={id} className={dock ? "w-[58px]" : ""}>
        <AppIcon name={dock ? "" : name} label={name} icon={art?.img} bg={art?.bg} glyph={art?.glyph} href={id === "whatsapp" ? WHATSAPP : undefined} onOpen={id === "whatsapp" ? undefined : () => launch(id)} tabIndex={hidden ? -1 : 0} />
      </div>
    );
  };
  return (
    <div className="absolute inset-0 flex flex-col" aria-hidden={hidden || undefined} inert={hidden || undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={WALLS[wall].src} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: WALLS[wall].pos }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/45" />
      <StatusBar />
      <div
        ref={pages}
        className="relative flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(e) => {
          const el = e.currentTarget;
          const n = Math.round(el.scrollLeft / el.clientWidth);
          if (n !== page) setPage(n);
        }}
      >
        <section dir={dir} className="flex h-full w-full shrink-0 snap-start flex-col gap-3 overflow-hidden px-5 pt-1" aria-label={t.phone.page(1)}>
          {headline && (
            <div className="rounded-[22px] bg-black/35 p-4 backdrop-blur-xl">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--accent-2)]">{headline.eyebrow}</p>
              <h1 className="mt-1.5 font-display text-[clamp(22px,6.4vw,30px)] leading-[1.05] text-white" style={{ letterSpacing: "-0.02em" }}>
                {headline.title}
              </h1>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 [@media(max-height:740px)]:hidden">
            <TimeWidget t={t} />
            <WeatherWidget t={t} />
          </div>
          <NowPlayingWidget t={t} onOpen={() => launch("music")} />
          <div className="mt-auto grid grid-cols-4 gap-x-4 pb-1 pt-1">{PAGE1.map((id) => icon(id))}</div>
        </section>
        <section dir={dir} className="grid w-full shrink-0 snap-start auto-rows-min grid-cols-4 gap-x-4 gap-y-5 px-5 pt-3" aria-label={t.phone.page(2)}>
          {PAGE2.map((id) => icon(id))}
        </section>
      </div>
      {/* page dots */}
      <div className="relative flex justify-center gap-2 py-2">
        {[0, 1].map((i) => (
          <button
            key={i}
            tabIndex={hidden ? -1 : 0}
            aria-label={t.phone.page(i + 1)}
            aria-current={page === i}
            onClick={() => pages.current?.scrollTo({ left: i * pages.current.clientWidth, behavior: "smooth" })}
            className={`h-[7px] w-[7px] rounded-full ${page === i ? "bg-white" : "bg-white/40"}`}
          />
        ))}
        <span className="sr-only">{t.phone.swipeMore}</span>
      </div>
      {/* dock */}
      <div dir={dir} className="relative mx-3 mb-5 flex justify-around rounded-[30px] bg-white/20 px-3 py-3 backdrop-blur-2xl">{DOCK.map((id) => icon(id, true))}</div>
    </div>
  );
}

function TimeWidget({ t }: { t: OsText }) {
  const time = useClock({ hour: "2-digit", minute: "2-digit" });
  const day = useClock({ weekday: "long", day: "numeric", month: "short" });
  return (
    <div className="rounded-[22px] bg-black/35 p-3.5 backdrop-blur-xl">
      <p className="text-[10.5px] uppercase tracking-[0.12em] text-white/65">{t.phone.widget.accra}</p>
      <p className="mt-1 text-[32px] font-light leading-none tabular-nums">{time}</p>
      <p className="mt-1 truncate text-[11.5px] text-white/70">{day}</p>
      <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-[#7dffa8]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#30d158]" /> {t.phone.widget.available}
      </p>
    </div>
  );
}

let weatherCache: Promise<{ ok: boolean; temp?: number; feels?: number; kind?: string }> | null = null;

function WeatherWidget({ t }: { t: OsText }) {
  const [w, setW] = useState<{ ok: boolean; temp?: number; feels?: number; kind?: string } | null>(null);
  useEffect(() => {
    weatherCache ??= fetch("/api/weather")
      .then((r) => r.json())
      .catch(() => ({ ok: false }));
    let on = true;
    weatherCache.then((x) => on && setW(x));
    return () => {
      on = false;
    };
  }, []);
  const codes = t.phone.widget.weatherCodes;
  const kind = (w?.kind ?? "clear") as keyof typeof codes;
  const icon = { clear: "☀", cloudy: "⛅", fog: "🌫", rain: "🌧", storm: "⛈" }[kind];
  return (
    <div className="rounded-[22px] bg-gradient-to-b from-[#3d8bd8]/70 to-[#1d4f8f]/70 p-3.5 backdrop-blur-xl">
      <p className="text-[12px] font-semibold">{t.phone.widget.weather}</p>
      {w?.ok ? (
        <>
          <p className="mt-0.5 text-[32px] font-light leading-none">{w.temp}°</p>
          <p className="mt-1.5 text-[12px]">
            {icon} {codes[kind]}
          </p>
          <p className="text-[11px] text-white/70">{t.phone.widget.feels(w.feels ?? w.temp ?? 0)}</p>
        </>
      ) : (
        <>
          <p className="mt-0.5 text-[32px] leading-none" aria-hidden>
            ☀
          </p>
          <p className="mt-1.5 text-[11.5px] text-white/75">{t.phone.widget.noDst}</p>
        </>
      )}
    </div>
  );
}

function NowPlayingWidget({ t, onOpen }: { t: OsText; onOpen: () => void }) {
  const s = useMusic();
  const title = (t.music.tracks[s.track.id] ?? [s.track.title])[0];
  return (
    <div className="flex items-center gap-3 rounded-[22px] bg-black/35 p-2.5 pr-3 backdrop-blur-xl">
      <button onClick={onOpen} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[18px]" style={{ background: s.track.tone }} aria-label={t.phone.apps.music}>
        ♪
      </button>
      <button onClick={onOpen} className="min-w-0 flex-1 text-left">
        <span className="block text-[10.5px] uppercase tracking-[0.12em] text-white/55">{s.playing ? t.phone.widget.nowPlaying : t.phone.widget.paused}</span>
        <span className="block truncate text-[13.5px] font-medium">{s.playing ? title : t.phone.widget.tapRain}</span>
      </button>
      <button onClick={() => music.toggle()} aria-label={s.playing ? t.music.pause : t.music.play} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[13px] text-black">
        {s.playing ? "❚❚" : "▶"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ back swipe from the left edge */

/** Drag the open app to the right, like iOS's back gesture. */
function slide(el: HTMLElement, dx: number, animate: boolean) {
  el.style.transition = animate ? "transform .25s cubic-bezier(.22,1,.36,1)" : "none";
  el.style.transform = dx ? `translateX(${Math.max(0, dx)}px)` : "";
  el.style.boxShadow = dx ? "-12px 0 30px rgba(0,0,0,.4)" : "";
}

function EdgeSwipe({ layer, onBack }: { layer: React.RefObject<HTMLDivElement | null>; onBack: () => void }) {
  const start = useRef<{ x: number; id: number } | null>(null);
  const move = (dx: number, animate: boolean) => {
    if (layer.current) slide(layer.current, dx, animate);
  };
  return (
    <div
      aria-hidden
      className="absolute inset-y-0 left-0 z-20 w-5 touch-none"
      onPointerDown={(e) => {
        start.current = { x: e.clientX, id: e.pointerId };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (start.current?.id === e.pointerId) move(e.clientX - start.current.x, false);
      }}
      onPointerUp={(e) => {
        const s = start.current;
        start.current = null;
        if (!s) return;
        const dx = e.clientX - s.x;
        const w = layer.current?.clientWidth ?? 300;
        if (dx > Math.min(110, w * 0.3)) {
          move(w, true);
          setTimeout(onBack, 200);
        } else move(0, true);
      }}
      onPointerCancel={() => {
        start.current = null;
        move(0, true);
      }}
    />
  );
}

/* ------------------------------------------------------------------ small icon art */

function Glyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 32 32" className="h-[64%] w-[64%]" aria-hidden>
      <path d={d} fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" fillRule="evenodd" />
    </svg>
  );
}
function Flower() {
  const c = ["#ff9f0a", "#ffd60a", "#30d158", "#64d2ff", "#0a84ff", "#bf5af2", "#ff375f", "#ff453a"];
  return (
    <svg viewBox="0 0 40 40" className="h-[78%] w-[78%]" aria-hidden>
      {c.map((col, i) => (
        <ellipse key={col} cx="20" cy="11" rx="5" ry="9" fill={col} opacity=".85" transform={`rotate(${i * 45} 20 20)`} style={{ mixBlendMode: "multiply" }} />
      ))}
    </svg>
  );
}
function CalendarGlyph() {
  const wd = useClock({ weekday: "short" });
  const n = useClock({ day: "numeric" });
  return (
    <span className="flex flex-col items-center leading-none">
      <span className="text-[9px] font-semibold uppercase text-[#ff3b30]">{wd}</span>
      <span className="text-[24px] font-light text-black">{n}</span>
    </span>
  );
}
function Compass() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full p-2" aria-hidden>
      <circle cx="20" cy="20" r="16" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="M27 13l-9 5-5 9 9-5z" fill="#fff" />
      <path d="M13 27l5-9 4 4z" fill="#ff3b30" />
    </svg>
  );
}
function ClockGlyph() {
  return (
    <svg viewBox="0 0 40 40" className="h-[86%] w-[86%]" aria-hidden>
      <circle cx="20" cy="20" r="17" fill="#fff" />
      <path d="M20 9v11l7 4" stroke="#111" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="20" r="1.6" fill="#ff9500" />
    </svg>
  );
}
