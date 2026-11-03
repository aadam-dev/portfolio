"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

/** Window geometry and state, in % of the desktop so it survives resizes. */
export interface WinFrame {
  id: string;
  x: number;
  y: number;
  z: number;
  max?: boolean;
  min?: boolean;
  /** preferred size in px (clamped to the desktop) */
  w?: number;
  h?: number;
}

let zTop = 10;
export const nextZ = () => ++zTop;

/**
 * A macOS-style window: traffic lights, a title bar that drags and double-click maximises,
 * Minimise to the dock. Interactive only when `live` (the OS is full screen); on the laptop screen
 * in the 3D desk it is drawn but ignores the pointer.
 */
export function Window<T extends WinFrame>({
  w,
  title,
  icon,
  desk,
  live,
  focused,
  update,
  close,
  toolbar,
  children,
  tone = "dark",
}: {
  w: T;
  title: string;
  icon?: ReactNode;
  desk: RefObject<HTMLDivElement | null>;
  live: boolean;
  focused: boolean;
  update: (patch: Partial<T>) => void;
  close: () => void;
  toolbar?: ReactNode;
  children: ReactNode;
  /** "light" for paper apps (TextEdit, Numbers, Stickies-like) */
  tone?: "dark" | "light";
}) {
  const drag = useRef<{ sx: number; sy: number; x: number; y: number } | null>(null);
  const focus = useCallback(() => update({ z: nextZ() } as Partial<T>), [update]);
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

  const onDown = (e: React.PointerEvent) => {
    if (!live || maxed || (e.target as HTMLElement).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, x: w.x, y: w.y };
    focus();
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = desk.current;
    if (!d || !el) return;
    const r = el.getBoundingClientRect();
    update({
      x: Math.max(-20, Math.min(85, d.x + ((e.clientX - d.sx) / r.width) * 100)),
      y: Math.max(0, Math.min(82, d.y + ((e.clientY - d.sy) / r.height) * 100)),
    } as Partial<T>);
  };
  const onUp = () => (drag.current = null);
  const tab = live ? 0 : -1;
  const light = tone === "light";

  return (
    <section
      hidden={w.min}
      onPointerDown={focus}
      aria-label={title}
      className={`absolute flex flex-col overflow-hidden rounded-[12px] border shadow-[0_30px_80px_rgba(0,0,0,0.5)] [animation:aos-pop_.32s_cubic-bezier(.22,1,.36,1)_both] ${
        light ? "border-black/15 bg-[#fbfaf7] text-[#1c1b19]" : "border-white/15 bg-[#14110e]/92 text-white backdrop-blur-2xl"
      } ${focused ? "" : "opacity-[0.97]"}`}
      style={
        maxed
          ? { left: 8, top: 8, right: 8, bottom: 8, zIndex: w.z }
          : { left: `${w.x}%`, top: `${w.y}%`, width: `min(${w.w ?? 860}px, 70%)`, height: `min(${w.h ?? 600}px, 84%)`, zIndex: w.z }
      }
    >
      <header
        dir="ltr"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onDoubleClick={() => update({ max: !w.max } as Partial<T>)}
        className={`relative flex h-10 shrink-0 items-center gap-2 border-b px-3 ${light ? "border-black/10 bg-[#ecebe7]" : "border-white/10"} ${
          live && !maxed ? "cursor-grab active:cursor-grabbing" : ""
        } ${focused && !light ? "bg-white/[0.06]" : ""}`}
      >
        <TrafficLights title={title} tab={tab} dim={!focused} onClose={close} onMin={() => update({ min: true } as Partial<T>)} onMax={() => update({ max: !w.max } as Partial<T>)} max={!!w.max} />
        <span className={`pointer-events-none absolute inset-x-24 flex items-center justify-center gap-1.5 truncate text-[12px] font-medium ${light ? "text-black/70" : "text-white/80"}`}>
          {icon}
          {title}
        </span>
        {toolbar && <div className="ml-auto flex items-center gap-1">{toolbar}</div>}
      </header>
      <div className="relative min-h-0 flex-1 overflow-auto" data-lenis-prevent>
        {children}
      </div>
    </section>
  );
}

export function TrafficLights({ title, tab, dim, onClose, onMin, onMax, max }: { title: string; tab: number; dim?: boolean; onClose: () => void; onMin: () => void; onMax: () => void; max: boolean }) {
  const dot = "group/tl relative grid h-3 w-3 place-items-center rounded-full ring-1 ring-black/25";
  const glyph = "pointer-events-none text-[8px] font-bold leading-none text-black/60 opacity-0 group-hover/tls:opacity-100";
  return (
    <div className="group/tls flex items-center gap-2">
      <button tabIndex={tab} onClick={onClose} aria-label={`Close ${title}`} className={`${dot} ${dim ? "bg-white/25" : "bg-[#ff5f57]"}`}>
        <span className={glyph}>×</span>
      </button>
      <button tabIndex={tab} onClick={onMin} aria-label={`Minimise ${title}`} className={`${dot} ${dim ? "bg-white/25" : "bg-[#febc2e]"}`}>
        <span className={glyph}>−</span>
      </button>
      <button tabIndex={tab} onClick={onMax} aria-label={max ? `Restore ${title}` : `Maximise ${title}`} className={`${dot} ${dim ? "bg-white/25" : "bg-[#28c840]"}`}>
        <span className={glyph}>+</span>
      </button>
    </div>
  );
}
