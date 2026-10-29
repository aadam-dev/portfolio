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
