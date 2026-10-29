"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** Validated against the dark card surface (#12100d): CVD ΔE 26.8, both >= 3:1. */
export const SERIES = { visits: "#3987e5", visitors: "#d95926" };

type P = { t: string; visits: number; visitors: number };

/** A top for the axis that splits into four clean steps (0, 5, 10, 15, 20...). */
function niceMax(v: number) {
  const raw = Math.max(1, v) / 4;
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = ([1, 2, 2.5, 5, 10].find((m) => m * p >= raw) ?? 10) * p;
  return Math.max(4, Math.ceil(step) * 4);
}
const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n));

/**
 * Visits and unique visitors per hour or day: two lines on one axis (same
 * unit), an area wash under visits, a crosshair that snaps to the nearest
 * bucket with one tooltip for both series, arrow keys to step through it,
 * and the same numbers as a table.
 */
export default function VisitsChart({ points, unit }: { points: P[]; unit: "hour" | "day" }) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = 232;
  const pad = { l: 34, r: 12, t: 12, b: 26 };
  const iw = Math.max(1, w - pad.l - pad.r);
  const ih = H - pad.t - pad.b;
  const max = niceMax(Math.max(...points.map((p) => Math.max(p.visits, p.visitors)), 1));
  const x = (i: number) => pad.l + (points.length > 1 ? (i / (points.length - 1)) * iw : iw / 2);
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max];

  const label = (t: string, long = false) => {
    const d = new Date(`${t}:00Z`);
    if (unit === "hour") return long ? d.toLocaleString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) : d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(long ? { weekday: "short" } : {}), timeZone: "UTC" });
  };
  const xTicks = useMemo(() => {
    const n = points.length;
    const want = Math.min(n, w < 520 ? 4 : 7);
    return Array.from({ length: want }, (_, k) => Math.round((k * (n - 1)) / Math.max(1, want - 1)));
  }, [points.length, w]);

  const line = (key: "visits" | "visitors") => points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join("");
  const area = `${line("visits")}L${x(points.length - 1).toFixed(1)} ${y(0)}L${x(0).toFixed(1)} ${y(0)}Z`;

  const pick = (clientX: number) => {
    const el = box.current;
    if (!el || points.length < 1) return;
    const rx = clientX - el.getBoundingClientRect().left - pad.l;
    const i = Math.round((rx / iw) * (points.length - 1));
    setHover(Math.max(0, Math.min(points.length - 1, i)));
  };
  const h = hover != null ? points[hover] : null;
  const last = points.length - 1;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px] text-[var(--ink-2)]" aria-hidden>
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-[2px] rounded-full" style={{ background: SERIES.visits }} /> Visits
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-[2px] rounded-full" style={{ background: SERIES.visitors }} /> Unique visitors
        </span>
      </div>
      <div
        ref={box}
        className="relative mt-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
        style={{ height: H }}
        tabIndex={0}
        role="img"
        aria-label={`Visits per ${unit}: ${points.reduce((a, p) => a + p.visits, 0)} in total. Use the arrow keys to read each ${unit}.`}
        onPointerMove={(e) => pick(e.clientX)}
        onPointerLeave={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            setHover((cur) => Math.max(0, Math.min(last, (cur ?? last) + (e.key === "ArrowRight" ? 1 : -1))));
          }
          if (e.key === "Escape") setHover(null);
        }}
        onBlur={() => setHover(null)}
      >
        {w > 0 && (
          <svg width={w} height={H} className="block">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? "rgba(242,238,230,0.16)" : "rgba(242,238,230,0.06)"} strokeWidth={1} shapeRendering="crispEdges" />
                <text x={pad.l - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="rgba(242,238,230,0.45)" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {compact(Math.round(t))}
                </text>
              </g>
            ))}
            {xTicks.map((i) => (
              <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"} fontSize={11} fill="rgba(242,238,230,0.45)">
                {i === last ? (unit === "hour" ? "Now" : "Today") : label(points[i].t)}
              </text>
            ))}
            <path d={area} fill={SERIES.visits} opacity={0.1} />
            <path d={line("visitors")} fill="none" stroke={SERIES.visitors} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            <path d={line("visits")} fill="none" stroke={SERIES.visits} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {/* end marker on the series the story is about */}
            {hover == null && points.length > 0 && <circle cx={x(last)} cy={y(points[last].visits)} r={4} fill={SERIES.visits} stroke="#12100d" strokeWidth={2} />}
            {h && (
              <g>
                <line x1={x(hover!)} x2={x(hover!)} y1={pad.t} y2={pad.t + ih} stroke="rgba(242,238,230,0.3)" strokeWidth={1} shapeRendering="crispEdges" />
                <circle cx={x(hover!)} cy={y(h.visitors)} r={4} fill={SERIES.visitors} stroke="#12100d" strokeWidth={2} />
                <circle cx={x(hover!)} cy={y(h.visits)} r={4} fill={SERIES.visits} stroke="#12100d" strokeWidth={2} />
              </g>
            )}
          </svg>
        )}
        {h && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-[150px] rounded-xl border border-[var(--line-strong)] bg-[#1b1813]/95 backdrop-blur px-3 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
            style={{ left: Math.min(Math.max(0, x(hover!) + 12), Math.max(0, w - 170)) }}
            aria-live="polite"
          >
            <p className="text-[11.5px] text-[var(--ink-3)]">{label(h.t, true)}</p>
            {(
              [
                ["visits", "Visits"],
                ["visitors", "Unique visitors"],
              ] as const
            ).map(([k, name]) => (
              <p key={k} className="mt-1 flex items-center gap-2 text-[12.5px]">
                <span className="w-3 h-[2px] rounded-full" style={{ background: SERIES[k] }} />
                <span className="font-semibold text-[var(--foreground)] tabular-nums">{h[k]}</span>
                <span className="text-[var(--ink-3)]">{name}</span>
              </p>
            ))}
          </div>
        )}
      </div>
      <details className="mt-2 group">
        <summary className="cursor-pointer list-none text-[12px] text-[var(--ink-3)] hover:text-[var(--foreground)]">Show as a table</summary>
        <div className="mt-2 max-h-[220px] overflow-auto rounded-lg border border-[var(--line)]">
          <table className="w-full text-[12.5px]">
            <thead className="sticky top-0 bg-[var(--surface-2)] text-left text-[var(--ink-3)]">
              <tr>
                <th className="font-normal px-3 py-1.5">{unit === "hour" ? "Hour (UTC)" : "Day"}</th>
                <th className="font-normal px-3 py-1.5 text-right">Visits</th>
                <th className="font-normal px-3 py-1.5 text-right">Unique visitors</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {[...points].reverse().map((p) => (
                <tr key={p.t} className="border-t border-[var(--line)]">
                  <td className="px-3 py-1.5 text-[var(--ink-2)]">{label(p.t, true)}</td>
                  <td className="px-3 py-1.5 text-right">{p.visits}</td>
                  <td className="px-3 py-1.5 text-right">{p.visitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
