"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { projectSlug, visibleProjects, type Project } from "@/lib/projects";
import ScaledIframe from "@/components/ui/ScaledIframe";
import { SERVICES } from "@/lib/services";

/* ------------------------------------------------------------------ types */

type Kind = "project" | "notes" | "mail" | "about";
type Tab = "overview" | "walkthrough" | "live";
export interface Win {
  id: string;
  kind: Kind;
  slug?: string;
  x: number; // % of desktop width
  y: number; // % of desktop height
  z: number;
  tab: Tab;
  max?: boolean;
  /** minimised to the dock: kept, but hidden until reopened */
  min?: boolean;
}

export interface OSProps {
  /** "projected": decorative, rendered at a fixed size on the laptop. "flat": full-screen and interactive. */
  mode: "projected" | "flat";
  windows: Win[];
  setWindows: (fn: (w: Win[]) => Win[]) => void;
  onExit?: () => void;
}

/* ------------------------------------------------------------------ data */

/** Apps in the dock: flagship + featured projects that have real screenshots, Bloom Boba first. */
export function dockProjects(): Project[] {
  const all = visibleProjects().filter((p) => p.screenImages && Object.keys(p.screenImages).length);
  const rank = (p: Project) => (p.id === "bloomboba" ? 0 : p.flagship ? 1 : p.featured ? 2 : 3);
  return all.sort((a, b) => rank(a) - rank(b)).slice(0, 9);
}

const thumb = (p: Project) => p.screenImages?.[p.defaultScreen ?? p.screens[0]?.id ?? ""] ?? Object.values(p.screenImages ?? {})[0] ?? "";

let zTop = 10;
export function openWindow(setWindows: OSProps["setWindows"], kind: Kind, slug?: string, tab: Tab = "overview") {
  setWindows((ws) => {
    const id = kind === "project" ? `p:${slug}` : kind;
    const found = ws.find((w) => w.id === id);
    zTop += 1;
    if (found) return ws.map((w) => (w.id === id ? { ...w, z: zTop, min: false, tab: kind === "project" && tab !== "overview" ? tab : w.tab } : w));
    const n = ws.length;
    return [...ws, { id, kind, slug, tab, x: 14 + ((n * 5) % 24), y: 9 + ((n * 4) % 18), z: zTop }];
  });
}

/* ------------------------------------------------------------------ OS */

export default function AadamOS({ mode, windows, setWindows, onExit }: OSProps) {
  const flat = mode === "flat";
  const apps = useMemo(() => dockProjects(), []);
  const desk = useRef<HTMLDivElement>(null);
  const top = windows.filter((w) => !w.min).reduce<Win | null>((a, w) => (!a || w.z > a.z ? w : a), null);

  // Esc closes the front window, then goes back to the desk
  useEffect(() => {
    if (!flat) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (top) setWindows((ws) => ws.filter((w) => w.id !== top.id));
      else onExit?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flat, top, setWindows, onExit]);

  return (
    <div
      className="aos theme-fixed relative h-full w-full select-none overflow-hidden text-[13px] text-white"
      style={{ fontFamily: "var(--font-sans)", pointerEvents: flat ? "auto" : "none" }}
      role={flat ? "region" : undefined}
      aria-label={flat ? "Aadam OS, an interactive desktop of projects" : undefined}
      aria-hidden={flat ? undefined : true}
    >
      {/* wallpaper */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/os/wallpaper-bloom.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent,rgba(0,0,0,0.55))]" />

      <MenuBar flat={flat} onExit={onExit} />

      {/* desktop */}
      <div ref={desk} className="absolute inset-x-0 bottom-[86px] top-8">
        <WelcomeCard />
        <div className="absolute right-5 top-5 hidden flex-col items-center gap-5 sm:flex">
          <DesktopIcon label="Bloom Boba" img={thumb(apps[0] ?? ({} as Project))} onOpen={() => openWindow(setWindows, "project", "bloom-boba")} flat={flat} />
          <DesktopIcon label="About.txt" glyph="Aa" onOpen={() => openWindow(setWindows, "about")} flat={flat} />
          <DesktopIcon label="Services.notes" glyph="✎" onOpen={() => openWindow(setWindows, "notes")} flat={flat} />
          <DesktopIcon label="Mail" glyph="@" onOpen={() => openWindow(setWindows, "mail")} flat={flat} />
        </div>

        {windows.map((w) => (
          <Window key={w.id} w={w} desk={desk} setWindows={setWindows} flat={flat} focused={top?.id === w.id} />
        ))}
      </div>

      <Dock apps={apps} windows={windows} setWindows={setWindows} flat={flat} />
    </div>
  );
}

/* ------------------------------------------------------------------ chrome */

function MenuBar({ flat, onExit }: { flat: boolean; onExit?: () => void }) {
  const [now, setNow] = useState("");
  useEffect(() => {
    const fmt = () =>
      setNow(
        new Intl.DateTimeFormat("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Accra" }).format(new Date()),
      );
    fmt();
    const t = setInterval(fmt, 20000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="absolute inset-x-0 top-0 z-[500] flex h-8 items-center justify-between bg-black/35 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-5">
        <span className="font-semibold tracking-tight">◉ Aadam OS</span>
        <span className="text-white/70">Work</span>
        <span className="hidden text-white/70 sm:inline">Studio</span>
        <span className="hidden text-white/70 sm:inline">Contact</span>
      </div>
      <div className="flex items-center gap-4 text-white/80">
        <span className="hidden items-center gap-1.5 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> Available for work
        </span>
        <span className="tabular-nums">Accra · {now}</span>
        {flat && onExit && (
          <button onClick={onExit} className="rounded-md bg-white/10 px-2.5 py-0.5 text-[12px] hover:bg-white/20">
            Back to the desk <span aria-hidden>⎋</span>
          </button>
        )}
      </div>
    </div>
  );
}

function WelcomeCard() {
  return (
    <div className="absolute left-6 top-6 hidden max-w-[300px] rounded-2xl sm:block border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Welcome</p>
      <p className="mt-1.5 text-[15px] font-semibold leading-snug">I build products that ship and work in the field.</p>
      <p className="mt-1 text-[12px] leading-relaxed text-white/65">Open a project from the dock. Each one has the story, a real walkthrough and the live site.</p>
    </div>
  );
}

function DesktopIcon({ label, img, glyph, onOpen, flat }: { label: string; img?: string; glyph?: string; onOpen: () => void; flat: boolean }) {
  return (
    <button onClick={onOpen} tabIndex={flat ? 0 : -1} className="group flex w-20 flex-col items-center gap-1.5 rounded-lg p-1.5 focus:bg-white/10 focus:outline-none" aria-label={`Open ${label}`}>
      <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-[14px] bg-white/10 text-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/15 transition-transform group-hover:scale-105">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : glyph}
      </span>
      <span className="rounded px-1 text-center text-[11px] leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,.8)]">{label}</span>
    </button>
  );
}

function Dock({ apps, windows, setWindows, flat }: { apps: Project[]; windows: Win[]; setWindows: OSProps["setWindows"]; flat: boolean }) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="absolute inset-x-0 bottom-3 z-[500] flex justify-center">
      <nav aria-label="Projects" className="flex max-w-[calc(100%-16px)] items-end gap-2 overflow-x-auto rounded-[22px] border border-white/15 bg-white/10 px-3 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl" onMouseLeave={() => setHover(null)}>
        {apps.map((p, i) => {
          const open = windows.some((w) => w.slug === projectSlug(p));
          const d = hover === null ? 9 : Math.abs(hover - i);
          const s = d === 0 ? 1.35 : d === 1 ? 1.15 : 1;
          return (
            <button
              key={p.id}
              tabIndex={flat ? 0 : -1}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onClick={() => openWindow(setWindows, "project", projectSlug(p))}
              className="relative flex flex-col items-center focus:outline-none"
              aria-label={`Open ${p.name}`}
            >
              {hover === i && (
                <span className="absolute -top-9 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-[11px] text-white backdrop-blur">{p.name}</span>
              )}
              <span
                className="block h-12 w-12 origin-bottom overflow-hidden rounded-[13px] shadow-[0_6px_16px_rgba(0,0,0,0.4)] ring-1 ring-white/20 transition-transform duration-200"
                style={{ transform: `scale(${s})`, background: p.accentColor }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(p)} alt="" className="h-full w-full object-cover object-top" />
              </span>
              <span className={`mt-1 h-1 w-1 rounded-full ${open ? "bg-white/80" : "bg-transparent"}`} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ windows */

function Window({ w, desk, setWindows, flat, focused }: { w: Win; desk: React.RefObject<HTMLDivElement | null>; setWindows: OSProps["setWindows"]; flat: boolean; focused: boolean }) {
  const drag = useRef<{ sx: number; sy: number; x: number; y: number } | null>(null);
  const update = useCallback((patch: Partial<Win>) => setWindows((ws) => ws.map((x) => (x.id === w.id ? { ...x, ...patch } : x))), [setWindows, w.id]);
  const focus = () => {
    zTop += 1;
    update({ z: zTop });
  };
  const close = () => setWindows((ws) => ws.filter((x) => x.id !== w.id));

  const onDown = (e: React.PointerEvent) => {
    if (!flat || w.max || (desk.current?.clientWidth ?? 999) < 700) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, x: w.x, y: w.y };
    focus();
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = desk.current;
    if (!d || !el) return;
    const r = el.getBoundingClientRect();
    update({
      x: Math.max(-20, Math.min(80, d.x + ((e.clientX - d.sx) / r.width) * 100)),
      y: Math.max(0, Math.min(80, d.y + ((e.clientY - d.sy) / r.height) * 100)),
    });
  };
  const onUp = () => (drag.current = null);

  // a narrow desktop opens every window full size; the observer also catches resizes
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = desk.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 700));
    ro.observe(el);
    return () => ro.disconnect();
  }, [desk]);
  const maxed = w.max || narrow;
  const p = w.slug ? visibleProjects().find((x) => projectSlug(x) === w.slug) : undefined;
  const title = w.kind === "project" ? p?.name ?? "Project" : w.kind === "notes" ? "Services.notes" : w.kind === "mail" ? "Mail" : "About.txt";

  return (
    <section
      hidden={w.min}
      onPointerDown={focus}
      className="absolute flex flex-col overflow-hidden rounded-xl border border-white/15 bg-[#14110e]/90 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl [animation:aos-pop_.32s_cubic-bezier(.22,1,.36,1)_both]"
      style={
        maxed
          ? { left: 8, top: 8, right: 8, bottom: 8, zIndex: w.z }
          : { left: `${w.x}%`, top: `${w.y}%`, width: "min(62%, 860px)", height: "min(82%, 600px)", zIndex: w.z }
      }
      aria-label={title}
    >
      {/* title bar */}
      <header onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onDoubleClick={() => update({ max: !w.max })} className={`flex h-10 shrink-0 items-center gap-2 border-b border-white/10 px-3 ${flat && !w.max ? "cursor-grab active:cursor-grabbing" : ""} ${focused ? "bg-white/[0.06]" : ""}`}>
        <button tabIndex={flat ? 0 : -1} onClick={close} aria-label={`Close ${title}`} className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/20" />
        <button tabIndex={flat ? 0 : -1} onClick={() => update({ min: true })} aria-label={`Minimise ${title}`} className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-black/20" />
        <button tabIndex={flat ? 0 : -1} onClick={() => update({ max: !w.max })} aria-label={w.max ? "Restore" : "Maximise"} className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/20" />
        <span className="ml-2 truncate text-[12px] font-medium text-white/80">{title}</span>
      </header>
      <div className="min-h-0 flex-1 overflow-auto" data-lenis-prevent>
        {w.kind === "project" && p && <ProjectApp p={p} tab={w.tab} setTab={(t) => update({ tab: t })} flat={flat} />}
        {w.kind === "notes" && <NotesApp />}
        {w.kind === "mail" && <MailApp />}
        {w.kind === "about" && <AboutApp />}
      </div>
    </section>
  );
}

function ProjectApp({ p, tab, setTab, flat }: { p: Project; tab: Tab; setTab: (t: Tab) => void; flat: boolean }) {
  const walk = p.walkthroughs?.[0];
  const canLive = !!p.liveBaseUrl && p.liveEmbeddable !== false;
  const tabs: [Tab, string][] = [["overview", "Overview"], ...(walk ? ([["walkthrough", "Walkthrough"]] as [Tab, string][]) : []), ...(p.liveBaseUrl ? ([["live", "Live site"]] as [Tab, string][]) : [])];
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 gap-1 border-b border-white/10 px-3 py-2" role="tablist">
        {tabs.map(([t, l]) => (
          <button key={t} role="tab" aria-selected={tab === t} tabIndex={flat ? 0 : -1} onClick={() => setTab(t)} className={`rounded-md px-3 py-1 text-[12px] ${tab === t ? "bg-white/15 text-white" : "text-white/60 hover:text-white"}`}>
            {l}
          </button>
        ))}
        <Link href={`/work/${projectSlug(p)}`} tabIndex={flat ? 0 : -1} className="ml-auto rounded-md px-3 py-1 text-[12px] text-[var(--accent-2)] hover:underline">
          Full case study →
        </Link>
      </div>

      {tab === "overview" && (
        <div className="grid gap-5 p-5 md:grid-cols-[1.2fr_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb(p)} alt={`${p.name} screen`} className="w-full rounded-lg ring-1 ring-white/10" />
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">{p.categoryLabel}</p>
            <h3 className="mt-1 text-[20px] font-semibold leading-tight">{p.name}</h3>
            <p className="mt-1 text-white/70">{p.tagline}</p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-white/60">{p.description}</p>
            {p.outcomes && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.outcomes.slice(0, 3).map((o) => (
                  <span key={o.label} className="rounded-md bg-white/[0.07] px-2.5 py-1.5">
                    <b className="mr-1">{o.value}</b>
                    <span className="text-white/60">{o.label}</span>
                  </span>
                ))}
              </div>
            )}
            <p className="mt-4 text-[11px] text-white/45">{p.stack.join(" · ")}</p>
          </div>
        </div>
      )}

      {tab === "walkthrough" && walk && (
        <div className="h-full bg-black">
          {flat ? (
            <video data-os-video src={walk.src} poster={walk.poster} autoPlay muted loop playsInline controls preload="metadata" className="h-full w-full object-contain" />
          ) : (
            // on the laptop screen a still stands in; the film only loads once the OS is open
            // eslint-disable-next-line @next/next/no-img-element
            <img src={walk.poster ?? thumb(p)} alt="" className="h-full w-full object-contain" />
          )}
        </div>
      )}

      {tab === "live" && p.liveBaseUrl && (
        <div className="h-full">
          {canLive && flat ? (
            <ScaledIframe src={p.liveBaseUrl} title={`${p.name} live`} />
          ) : (
            <div className="grid h-full place-items-center p-8 text-center">
              <div>
                <p className="text-white/70">{canLive ? "The live site loads when you're at the desk." : "This site can't be embedded."}</p>
                <a href={p.liveBaseUrl} target="_blank" rel="noopener noreferrer" tabIndex={flat ? 0 : -1} className="mt-3 inline-block rounded-md bg-white/15 px-3 py-1.5 hover:bg-white/25">
                  Open {new URL(p.liveBaseUrl).host} ↗
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotesApp() {
  return (
    <div className="space-y-4 p-6 font-mono text-[12.5px] leading-relaxed text-white/80">
      <p className="text-white/45"># services.notes · forward deployed</p>
      {SERVICES.map((s) => (
        <p key={s.n}>
          <span className="text-[var(--accent-2)]">
            ## {s.n} {s.title}
          </span>
          <br />
          {s.short}
        </p>
      ))}
    </div>
  );
}

function AboutApp() {
  return (
    <div className="space-y-3 p-6 text-[13px] leading-relaxed text-white/75">
      <p className="text-[18px] font-semibold text-white">Aadam · forward-deployed engineer</p>
      <p>I design and build software for businesses that run on the ground: shops, kitchens, schools, suppliers. Brand and storefront at the front, the operating system behind it.</p>
      <p className="text-white/55">Based in Accra, working worldwide.</p>
    </div>
  );
}

function MailApp() {
  return (
    <div className="flex h-full flex-col p-5 text-[13px]">
      <div className="space-y-2 border-b border-white/10 pb-3 text-white/60">
        <p>
          To: <span className="text-white">Aadam</span>
        </p>
        <p>
          Subject: <span className="text-white">A project I&apos;d like to build</span>
        </p>
      </div>
      <p className="mt-4 flex-1 text-white/55">Tell me what you&apos;re building, who it&apos;s for and when you&apos;d like it live. I reply within a day.</p>
      <Link href="/#contact" className="mt-4 self-start rounded-md bg-[var(--accent)] px-4 py-2 font-semibold text-black">
        Write to Aadam →
      </Link>
    </div>
  );
}
