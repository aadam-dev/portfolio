"use client";

import { useLocale } from "next-intl";
import { intlLocale, useOsText, useTextDir } from "../l10n";
import { useEffect, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ macOS bits */

export function MenuBar({ live, onExit, items, right, exitLabel }: { live: boolean; onExit?: () => void; items: string[]; right?: ReactNode; exitLabel?: string }) {
  const t = useOsText().os;
  const now = useClock({ weekday: "short", hour: "2-digit", minute: "2-digit" });
  return (
    <div dir="ltr" className="absolute inset-x-0 top-0 z-[500] flex h-8 items-center justify-between bg-black/35 px-4 text-[13px] backdrop-blur-xl">
      <div className="flex items-center gap-5">
        <span className="font-semibold tracking-tight">◉ Aadam OS</span>
        {items.map((m, i) => (
          <span key={m} className={`text-white/75 ${i > 1 ? "hidden sm:inline" : ""}`}>
            {m}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-white/85">
        {right}
        <span className="tabular-nums">Accra · {now}</span>
        {live && onExit && (
          <button onClick={onExit} className="rounded-md bg-white/10 px-2.5 py-0.5 text-[12px] hover:bg-white/20">
            {exitLabel ?? t.back} <span aria-hidden>⎋</span>
          </button>
        )}
      </div>
    </div>
  );
}

/** A desktop icon: an app tile, or a file with its type badge, and a label underneath. */
export function DesktopIcon({ label, img, glyph, badge, onOpen, live, tint }: { label: string; img?: string; glyph?: ReactNode; badge?: string; onOpen: () => void; live: boolean; tint?: string }) {
  const t = useOsText().os;
  return (
    <button
      onDoubleClick={onOpen}
      onClick={(e) => {
        // a single click opens too (touch, keyboard); a real double-click opens once
        if (e.detail <= 1) onOpen();
      }}
      tabIndex={live ? 0 : -1}
      className="group flex w-[84px] flex-col items-center gap-1 rounded-lg p-1.5 focus:bg-white/10 focus:outline-none"
      aria-label={t.open(label)}
    >
      <span
        className="relative grid h-[54px] w-[54px] place-items-center overflow-hidden rounded-[12px] text-[20px] shadow-[0_8px_22px_rgba(0,0,0,0.35)] ring-1 ring-white/15 transition-transform group-hover:scale-105"
        style={{ background: tint ?? "rgba(255,255,255,0.1)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : glyph}
        {badge && <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 font-mono text-[8px] uppercase tracking-wide text-white">{badge}</span>}
      </span>
      <span className="line-clamp-2 rounded px-1 text-center text-[11px] leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,.85)] group-focus:bg-[#2463eb]">{label}</span>
    </button>
  );
}

/** A Stickies note: paper colour, a slight tilt, handwriting-ish type. */
export function Sticky({ color = "#fff2a8", tilt = 0, title, children, className = "", style }: { color?: string; tilt?: number; title?: string; children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-[3px] p-3 text-[#2a2410] shadow-[0_10px_24px_rgba(0,0,0,0.35)] ${className}`}
      style={{ background: color, transform: `rotate(${tilt}deg)`, ...style }}
    >
      {title && <p className="mb-1 border-b border-black/10 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/55">{title}</p>}
      <div className="text-[13px] leading-snug" style={{ fontFamily: "'Marker Felt','Segoe Print','Bradley Hand',var(--font-sans),cursive" }}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ iOS bits */

export function StatusBar({ light = true }: { light?: boolean }) {
  const time = useClock({ hour: "2-digit", minute: "2-digit" });
  return (
    <div dir="ltr" className={`relative z-20 flex h-12 shrink-0 items-center justify-between px-7 text-[14px] font-semibold ${light ? "text-white" : "text-black"}`}>
      <span className="tabular-nums">{time}</span>
      <span aria-hidden className="absolute left-1/2 top-2.5 h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5 text-[12px]" aria-hidden>
        <span>●●●</span>
        <span className={`inline-block h-[11px] w-[22px] rounded-[3px] border p-[1.5px] ${light ? "border-white/80" : "border-black/70"}`}>
          <span className={`block h-full w-[80%] rounded-[1px] ${light ? "bg-white" : "bg-black"}`} />
        </span>
      </span>
    </div>
  );
}

/** A full-screen iOS app: back to home, a title, and its content. */
export function AppScreen({ title, onHome, children, light, action, homeLabel }: { title: string; onHome: () => void; children: ReactNode; light?: boolean; action?: ReactNode; homeLabel?: string }) {
  const t = useOsText().phone;
  const dir = useTextDir();
  return (
    <div className={`absolute inset-0 z-10 flex flex-col ${light ? "bg-[#f6f5f2] text-[#1c1c1e]" : "bg-black text-white"} [animation:aos-pop_.3s_cubic-bezier(.22,1,.36,1)_both]`}>
      <StatusBar light={!light} />
      <div className={`flex h-10 shrink-0 items-center justify-between px-4 text-[15px] ${light ? "text-[#007aff]" : "text-[#5aa9ff]"}`}>
        <button onClick={onHome} className="min-w-16 text-left">
          ‹ {homeLabel ?? t.home}
        </button>
        <span className={`max-w-[55%] truncate text-[15px] font-semibold ${light ? "text-black" : "text-white"}`}>{title}</span>
        <span className="min-w-16 text-right">{action}</span>
      </div>
      <div dir={dir} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain pb-5" data-lenis-prevent>
        {children}
      </div>
    </div>
  );
}

export function Widget({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[22px] bg-white/15 p-4 text-white backdrop-blur-xl ${className}`}>{children}</div>;
}

/** An iOS home-screen icon. */
export function AppIcon({ name, label, icon, bg, glyph, onOpen, href, tabIndex }: { name: string; label?: string; icon?: string; bg?: string; glyph?: ReactNode; onOpen?: () => void; href?: string; tabIndex?: number }) {
  const tile = (
    <>
      <span className="grid aspect-square w-full place-items-center overflow-hidden rounded-[22%] text-[24px] shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-transform duration-150 active:scale-90" style={{ background: bg ?? "#222" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {icon ? <img src={icon} alt="" className="h-full w-full object-cover" /> : glyph}
      </span>
      {name && <span className="mt-1.5 block truncate text-center text-[11px] text-white [text-shadow:0_1px_3px_rgba(0,0,0,.6)]">{name}</span>}
    </>
  );
  const aria = label ?? name;
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block" aria-label={aria} tabIndex={tabIndex}>
      {tile}
    </a>
  ) : (
    <button onClick={onOpen} className="block w-full text-left" aria-label={aria} tabIndex={tabIndex}>
      {tile}
    </button>
  );
}

/* ------------------------------------------------------------------ shared */

/** Accra time, refreshed every 20 seconds. */
export function useClock(opts: Intl.DateTimeFormatOptions, timeZone = "Africa/Accra") {
  const [now, setNow] = useState("");
  const loc = intlLocale(useLocale());
  useEffect(() => {
    const fmt = () => setNow(new Intl.DateTimeFormat(loc, { ...opts, timeZone }).format(new Date()));
    fmt();
    const t = setInterval(fmt, 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone, loc]);
  return now;
}
