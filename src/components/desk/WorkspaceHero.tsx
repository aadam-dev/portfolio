"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import AadamOS, { type Win } from "./AadamOS";
import PhoneOS from "./PhoneOS";
import type { Quad } from "./quad";
import { PLATE, STOPS, type Stop } from "./objects";
import { deskUi, localStops } from "./objects.l10n";
import { useLocale } from "next-intl";
import type { DeskRig } from "./PhotoDesk";
import dynamic from "next/dynamic";

const PhotoDesk = dynamic(() => import("./PhotoDesk"), { ssr: false });
import { setTheme, useTheme } from "@/components/fieldkit/useTheme";
import { scrollToElement, scrollToY } from "@/lib/scroll";
import { useDialog } from "@/lib/useDialog";

const N = STOPS.length;
const LAND = 0.9; // progress where the camera has landed in the laptop
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const stopAt = (i: number) => (i / (N - 1)) * LAND;

/**
 * Aadam's workspace: the portfolio hero. A pinned, photographed dev desk; scrolling tours each
 * object (cutting to a close-up insert while the copy makes its case), then dollies into the laptop
 * where Aadam OS takes over. Touch and reduced motion get a stacked, unpinned version.
 */
export default function WorkspaceHero() {
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(pointer: fine) and (min-width: 1024px)");
  const immersive = wide === null ? null : wide && !reduced;
  if (immersive === null) return <Poster />;
  return immersive ? <Tour /> : <Stacked />;
}

/** The tour's stops and labels in the visitor's language. */
function useStops() {
  const locale = useLocale();
  return useMemo(() => ({ stops: localStops(STOPS, locale), ui: deskUi(locale) }), [locale]);
}

/** Server render and first paint: the desk and the headline, so the h1 exists before scripts run. */
function Poster() {
  const { stops } = useStops();
  return (
    <section id="desk" aria-label="Aadam's workspace" className="relative h-[100svh] overflow-hidden bg-[#1a120b]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={PLATE.src} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_40%]" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-black/55 lg:via-black/10" />
      <div className="theme-fixed absolute inset-x-0 bottom-0 mx-auto max-w-[1280px] px-5 pb-10 lg:inset-y-0 lg:flex lg:items-center lg:px-6 lg:pb-0">
        <div className="max-w-[540px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent-2)]">{stops[0].eyebrow}</p>
          <h1 className="mt-3 font-display text-[clamp(30px,3.6vw,56px)] leading-[1.02] text-white text-balance" style={{ letterSpacing: "-0.03em" }}>
            {stops[0].title}
          </h1>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== tour */

function Tour() {
  const { stops, ui } = useStops();
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const inserts = useRef<(HTMLDivElement | null)[]>([]);
  const knob = useRef<HTMLDivElement>(null);
  // the 3D desk reads the scroll and pointer from here every frame, without re-rendering React
  const rig = useRef<DeskRig>({ p: 0, px: 0, py: 0 });
  const [active, setActive] = useState(0);
  // furthest chapter reached, so a close-up stays loaded once fetched
  const [seen, setSeen] = useState(0);
  const [landed, setLanded] = useState(false);
  const [phone, setPhone] = useState(false);
  const [inView, setInView] = useState(true);
  const theme = useTheme();
  const [windows, setWindows] = useState<Win[]>([{ id: "p:bloom-boba", kind: "project", slug: "bloom-boba", x: 22, y: 8, z: 10, tab: "overview" }]);
  const setW = useCallback((fn: (w: Win[]) => Win[]) => setWindows(fn), []);

  /** plate cover-fit inside the stage (for the keyboard hotspots on the opening shot) */
  const fit = useCallback(() => {
    const el = stage.current!;
    const W = el.clientWidth;
    const H = el.clientHeight;
    let pw = W;
    let ph = W / PLATE.ar;
    if (ph < H) {
      ph = H;
      pw = H * PLATE.ar;
    }
    return { W, H, pw, ph, pl: (W - pw) / 2, pt: (H - ph) / 2 };
  }, []);

  const render = useCallback((p: number) => {
    rig.current.p = p;
    // which segment, hold first then travel
    const raw = clamp(p / LAND) * (N - 1);
    const i = Math.min(N - 2, Math.floor(raw));
    const f = raw - i;
    const travel = ease(clamp((f - 0.42) / 0.58));
    const done = p >= LAND;
    // the chapter on screen = the stop we're holding at (or arriving at)
    const cur = done ? N - 1 : travel > 0.6 ? i + 1 : i;
    setActive((v) => (v === cur ? v : cur));
    setSeen((v) => (cur > v ? cur : v));

    // close-up inserts: cut in while holding, out before travelling
    inserts.current.forEach((el, k) => {
      if (!el) return;
      let o = 0;
      if (!done && k === i && STOPS[k].insert) o = 1 - clamp((f - 0.3) / 0.12);
      if (!done && k === i + 1 && STOPS[k].insert) o = clamp((travel - 0.85) / 0.15);
      el.style.opacity = String(o);
      el.style.transform = `scale(${1.04 - 0.04 * o})`;
    });
    setLanded((v) => (v === done ? v : done));
    if (knob.current) knob.current.style.setProperty("--p", String(clamp(p / LAND)));
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = track.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        render(clamp(-r.top / (r.height - window.innerHeight)));
      });
    };
    const onPointer = (e: PointerEvent) => {
      rig.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      rig.current.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });
    // the 3D desk only draws while the section is on screen
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    if (track.current) io.observe(track.current);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      io.disconnect();
    };
  }, [render]);

  /** jump the scroll to the hold point of stop i */
  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const len = el.offsetHeight - window.innerHeight;
    const p = i === N - 1 ? LAND + 0.03 : stopAt(i) + (LAND / (N - 1)) * 0.15;
    scrollToY(el.getBoundingClientRect().top + window.scrollY + len * p);
  };

  const toggleLamp = (pt?: { x: number; y: number }) => setTheme(theme === "dark" ? "light" : "dark", pt);
  const run = (st: Stop, e?: React.MouseEvent) => {
    const a = st.action;
    if (!a) return;
    if (a.kind === "theme") toggleLamp(e ? { x: e.clientX, y: e.clientY } : undefined);
    else if (a.kind === "phone") setPhone(true);
    else if (a.kind === "desktop") goTo(N - 1);
    else if (a.kind === "scroll") {
      const t = document.querySelector<HTMLElement>(a.target);
      if (t) scrollToElement(t);
    }
  };

  // Esc or "Back to the desk": the camera pulls back out of the laptop
  const exitOS = () => goTo(N - 2);
  const closePhone = useCallback(() => setPhone(false), []);
  const openPhone = useCallback(() => setPhone(true), []);

  const night = theme === "dark";
  const deskStops = useMemo(() => stops.map((st) => ({ id: st.id, side: st.copy })), [stops]);

  return (
    <section ref={track} id="desk" className="relative" style={{ height: "560vh" }} aria-label="Aadam's workspace">
      <div ref={stage} dir="ltr" className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#1a120b]" style={{ zIndex: landed ? 50 : undefined }}>
        {/* the photo shows until the 3D desk is ready (and stays for anyone without WebGL) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PLATE.src} alt={ui.deskAlt} className="absolute inset-0 h-full w-full object-cover" />
        <PhotoDesk
          active={inView && !phone}
          rig={rig}
          stops={deskStops}
          land={LAND}
          landed={landed}
          night={night}
          spot={spot}
          onPick={goTo}
          onLamp={toggleLamp}
          onPhone={openPhone}
          screens={{
            left: <CodeScreen />,
            right: <video src="/desk/screen-primetijara.mp4" poster="/desk/screen-primetijara.webp" muted loop autoPlay playsInline preload="none" className="h-full w-full object-cover object-top" />,
            center: <AadamOS mode="projected" windows={windows} setWindows={setW} />,
          }}
        />

        {/* in the laptop: the OS full screen and usable */}
        {landed && (
          <div className="absolute inset-0 z-[3]">
            <AadamOS mode="flat" windows={windows} setWindows={setW} onExit={exitOS} />
          </div>
        )}

        {/* spotlight + close-up inserts */}
        <div ref={spot} aria-hidden className="pointer-events-none absolute inset-0 z-[4] opacity-0" />
        {stops.map((st, k) =>
          st.insert ? (
            <div key={st.id} ref={(el) => { inserts.current[k] = el; }} aria-hidden className="pointer-events-none absolute inset-0 z-[5] opacity-0 will-change-[opacity,transform]">
              {/* each close-up loads once its chapter is next, not with the page */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {k <= seen + 1 && <img src={st.insert} alt="" className="h-full w-full object-cover" />}
              <div className="absolute inset-0 transition-opacity duration-700" style={{ background: "rgba(8,10,22,0.55)", mixBlendMode: "multiply", opacity: night ? 1 : 0 }} />
              <div className={`absolute inset-0 ${st.copy === "left" ? "bg-gradient-to-r" : "bg-gradient-to-l"} from-black/65 via-black/20 to-transparent`} />
            </div>
          ) : null,
        )}

        {/* keyboard route to each object on the opening shot (the pointer uses the 3D desk itself) */}
        {!landed && active === 0 && <Hotspots fit={fit} onPick={goTo} />}

        {/* copy */}
        {!landed &&
          stops.map((st, k) => (
            <ChapterCard key={st.id} st={st} k={k} on={active === k} onAction={(e) => run(st, e)} night={night} ui={ui} />
          ))}

        {/* rail */}
        {!landed && (
          <div className="absolute inset-x-0 bottom-0 z-[7] mx-auto max-w-[1280px] px-6 pb-6">
            <div ref={knob} className="relative mb-3 h-px w-full bg-white/20" style={{ ["--p" as string]: 0 }}>
              <div className="absolute left-0 top-0 h-px w-full origin-left bg-[var(--accent)]" style={{ transform: "scaleX(var(--p))" }} />
            </div>
            <ol className="flex justify-between gap-2">
              {stops.map((st, k) => (
                <li key={st.id}>
                  <button onClick={() => goTo(k)} aria-label={`${String(k).padStart(2, "0")} ${st.label}`} aria-current={active === k ? "step" : undefined} className="font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors" style={{ color: active === k ? "#fff" : "rgba(255,255,255,.45)" }}>
                    <span className="text-[var(--accent)]">{String(k).padStart(2, "0")}</span> <span className="hidden xl:inline">{st.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      {phone && <PhoneOS onClose={closePhone} />}
    </section>
  );
}

function Hotspots({ fit, onPick }: { fit: () => { W: number; H: number; pw: number; ph: number; pl: number; pt: number }; onPick: (i: number) => void }) {
  const { stops } = useStops();
  const [g, setG] = useState<ReturnType<typeof fit> | null>(null);
  // measured after layout, and again whenever the window changes size
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setG(fit()));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [fit]);
  if (!g) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-[6]">
      {stops.map((st, k) => {
        if (!st.box) return null;
        const [x0, y0, x1, y1] = st.box;
        return (
          <button
            key={st.id}
            onClick={() => onPick(k)}
            className="group absolute rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{ left: g.pl + x0 * g.pw, top: g.pt + y0 * g.ph, width: (x1 - x0) * g.pw, height: (y1 - y0) * g.ph }}
            aria-label={`Go to ${st.label}`}
          >
            <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-full bg-black/70 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {st.label}
            </span>
            <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/0 transition-[box-shadow] group-hover:ring-white/50" />
          </button>
        );
      })}
    </div>
  );
}

function ChapterCard({ st, k, on, onAction, night, ui }: { st: Stop; k: number; on: boolean; onAction: (e: React.MouseEvent) => void; night: boolean; ui: ReturnType<typeof deskUi> }) {
  const right = st.copy === "right";
  const a = st.action;
  const label =
    a?.kind === "theme" ? (night ? ui.lampOff : ui.lampOn) : a?.kind === "phone" ? ui.phone : a?.kind === "desktop" ? ui.desktop : a && "label" in a ? a.label : "";
  const wide = k === 0;
  const Heading = wide ? "h1" : "h2";
  return (
    <div
      className={`theme-fixed absolute inset-y-0 z-[7] flex w-full max-w-[1280px] items-center px-6 ${right ? "justify-end" : "justify-start"} left-1/2 -translate-x-1/2`}
      style={{ pointerEvents: "none" }}
      aria-hidden={!on}
      inert={!on}
    >
      <div
        dir="auto"
        className={`max-w-[540px] rounded-2xl border border-white/10 bg-black/40 p-7 backdrop-blur-md transition-[opacity,transform,filter] duration-700`}
        style={{
          opacity: on ? 1 : 0,
          transform: `translateY(${on ? 0 : 18}px)`,
          filter: on ? "blur(0)" : "blur(6px)",
          pointerEvents: on ? "auto" : "none",
          transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
        }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent-2)]">
          {k > 0 && <span className="mr-2 text-white/50">{String(k).padStart(2, "0")} / {String(STOPS.length - 1).padStart(2, "0")}</span>}
          {st.eyebrow}
        </p>
        <Heading className={`mt-4 font-display text-white text-balance ${wide ? "text-[clamp(34px,3.6vw,56px)]" : "text-[clamp(30px,3vw,46px)]"} leading-[1.02] [text-shadow:0_2px_30px_rgba(0,0,0,.45)]`} style={{ letterSpacing: "-0.03em" }}>
          {st.title}
        </Heading>
        <p className="mt-4 text-[15.5px] leading-relaxed text-white/80 [text-shadow:0_1px_12px_rgba(0,0,0,.5)]">{st.body}</p>
        {st.id === "books" && <ReadingList className="mt-3 text-white/80" labels={[ui.reading, ui.next]} />}
        {a &&
          (a.kind === "link" ? (
            <Link href={a.href} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-[13px] font-semibold text-black">
              {a.label} <span aria-hidden>→</span>
            </Link>
          ) : (
            <button onClick={onAction} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-[13px] font-semibold text-black">
              {label} <span aria-hidden>{a.kind === "scroll" || a.kind === "desktop" ? "↓" : "→"}</span>
            </button>
          ))}
        {wide && <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">{ui.scrollHint}</p>}
      </div>
    </div>
  );
}

type Book = { title: string; author: string };
let readingCache: Promise<{ reading: Book[]; next: Book[] }> | null = null;

/** What I'm reading now and next, live from the Office's reading board. */
function ReadingList({ className = "", labels = ["Reading", "Next"] }: { className?: string; labels?: [string, string] }) {
  const [list, setList] = useState<{ reading: Book[]; next: Book[] } | null>(null);
  useEffect(() => {
    readingCache ??= fetch("/api/reading")
      .then((r) => r.json())
      .catch(() => ({ reading: [], next: [] }));
    let live = true;
    readingCache.then((l) => live && setList(l));
    return () => {
      live = false;
    };
  }, []);
  if (!list || (!list.reading.length && !list.next.length)) return null;
  const line = (b: Book) => (b.author ? `${b.title}, ${b.author}` : b.title);
  return (
    <dl className={`grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13.5px] leading-snug ${className}`}>
      {list.reading.length > 0 && (
        <>
          <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--accent-2)] pt-0.5">{labels[0]}</dt>
          <dd>{list.reading.map(line).join(" · ")}</dd>
        </>
      )}
      {list.next.length > 0 && (
        <>
          <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] opacity-60 pt-0.5">{labels[1]}</dt>
          <dd>{list.next.slice(0, 3).map(line).join(" · ")}</dd>
        </>
      )}
    </dl>
  );
}

/** Left extender: an editor quietly typing the code that projects these screens. */
function CodeScreen() {
  const lines = [
    "// quad.ts: project any element onto a photographed screen",
    "export function quadMatrix(w, h, dst) {",
    "  const [a, b, c, d, e, f, g, h2] = solve(w, h, dst);",
    "  return `matrix3d(${a},${d},0,${g},${b},${e},0,${h2},0,0,1,0,${c},${f},0,1)`;",
    "}",
    "",
    "// workspace tour: hold, cut to the close-up, travel",
    "const travel = ease(clamp((f - 0.42) / 0.58));",
    "plate.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;",
    "",
    "// remote: GMT+0 · overlaps EU day + US East mornings",
    "await ship({ weekly: true, docs: true, handover: true });",
  ];
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v >= lines.length + 6 ? 0 : v + 1)), 700);
    return () => clearInterval(t);
  }, [lines.length]);
  return (
    <div className="theme-fixed h-full w-full bg-[#0e1116] p-10 font-mono text-[26px] leading-[1.55] text-[#c9d1d9]">
      <div className="mb-6 flex gap-3 text-[20px] text-white/40">
        <span className="rounded bg-white/10 px-3 py-1 text-white/80">quad.ts</span>
        <span className="px-3 py-1">WorkspaceHero.tsx</span>
      </div>
      {lines.slice(0, Math.min(n, lines.length)).map((l, i) => (
        <div key={i} className="whitespace-pre">
          <span className="mr-6 inline-block w-8 text-right text-white/25">{i + 1}</span>
          <span className={l.startsWith("//") ? "text-[#8b949e]" : ""}>{l}</span>
        </div>
      ))}
      <span className="ml-14 inline-block h-[1em] w-3 animate-pulse bg-[#ff8a5c] align-middle" />
    </div>
  );
}

/* ================================================================== touch / reduced motion */

function Stacked() {
  const { stops, ui } = useStops();
  const theme = useTheme();
  const [phone, setPhone] = useState(false);
  const [os, setOs] = useState(false);
  const closePhone = useCallback(() => setPhone(false), []);
  const closeOs = useCallback(() => setOs(false), []);
  const [windows, setWindows] = useState<Win[]>([{ id: "p:bloom-boba", kind: "project", slug: "bloom-boba", x: 22, y: 8, z: 10, tab: "overview" }]);
  const setW = useCallback((fn: (w: Win[]) => Win[]) => setWindows(fn), []);
  const act = (st: Stop, e: React.MouseEvent) => {
    const a = st.action;
    if (!a) return;
    if (a.kind === "theme") setTheme(theme === "dark" ? "light" : "dark", { x: e.clientX, y: e.clientY });
    else if (a.kind === "phone") setPhone(true);
    else if (a.kind === "desktop") setOs(true);
    else if (a.kind === "scroll") {
      const t = document.querySelector<HTMLElement>(a.target);
      if (t) scrollToElement(t, -70);
    }
  };
  return (
    <section id="desk" aria-label="Aadam's workspace" className="pb-10">
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PLATE.src} alt="Aadam's desk" className="absolute inset-0 h-full w-full object-cover object-[50%_40%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="theme-fixed absolute inset-x-0 bottom-0 px-5 pb-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent-2)]">{stops[0].eyebrow}</p>
          <h1 className="mt-3 font-display text-[clamp(30px,8vw,48px)] leading-[1.02] text-white" style={{ letterSpacing: "-0.03em" }}>
            {stops[0].title}
          </h1>
        </div>
      </div>
      <div className="mx-auto max-w-[720px] space-y-10 px-5 pt-10">
        {stops.slice(1).map((st, k) => (
          <article key={st.id} className="overflow-hidden rounded-2xl border border-[var(--line)]">
            {st.insert && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={st.insert} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
            )}
            <div className="p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
                {String(k + 1).padStart(2, "0")} · {st.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-[26px] leading-[1.08] text-white" style={{ letterSpacing: "-0.02em" }}>
                {st.title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-2)]">{st.body}</p>
              {st.id === "books" && <ReadingList className="mt-2 text-[var(--ink-2)]" labels={[ui.reading, ui.next]} />}
              {st.action &&
                (st.action.kind === "link" ? (
                  <Link href={st.action.href} className="mt-4 inline-flex rounded-full bg-[var(--accent)] px-4 py-2.5 text-[13px] font-semibold text-black">
                    {st.action.label} →
                  </Link>
                ) : (
                  <button onClick={(e) => act(st, e)} className="mt-4 inline-flex rounded-full bg-[var(--accent)] px-4 py-2.5 text-[13px] font-semibold text-black">
                    {st.action.kind === "theme" ? (theme === "dark" ? ui.lampOff : ui.lampOn) : st.action.kind === "phone" ? ui.phone : st.action.kind === "desktop" ? ui.openOS : st.action.label}
                  </button>
                ))}
            </div>
          </article>
        ))}
      </div>
      {phone && <PhoneOS onClose={closePhone} />}
      {os && <OSDialog windows={windows} setWindows={setW} onClose={closeOs} />}
    </section>
  );
}

/** Aadam OS full screen, for touch and reduced motion. */
function OSDialog({ windows, setWindows, onClose }: { windows: Win[]; setWindows: (fn: (w: Win[]) => Win[]) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  // AadamOS handles Esc itself (front window first, then out), so the dialog only traps focus
  useDialog(ref, () => {});
  return (
    <div ref={ref} className="fixed inset-0 z-[95] bg-black" role="dialog" aria-modal="true" aria-label="Aadam OS">
      <AadamOS mode="flat" windows={windows} setWindows={setWindows} onExit={onClose} />
    </div>
  );
}

export type { Quad };
