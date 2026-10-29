"use client";

import { useEffect, useMemo, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";
import { LAND_DOTS, WORLD } from "@/lib/worldmap";
import {
  DESTINATIONS,
  HQ,
  METHODS,
  US_PORTS,
  VEHICLES,
  project,
  roadRoute,
  routePath,
  seaRoute,
  timeline,
  totalDays,
  type Destination,
  type Method,
  type UsPort,
  type Vehicle,
} from "@/lib/rockmotion";

const BLUE = "#2f6bff";
const pct = (lat: number, lon: number) => {
  const [x, y] = project(lat, lon);
  return { left: `${(x / WORLD.w) * 100}%`, top: `${(y / WORLD.h) * 100}%` };
};

/** Where each stage starts and ends, as a share of the whole trip (midpoint days). */
function spans(d: Destination, p: UsPort, m: Method) {
  const t = timeline(d, p, m);
  const mids = t.map((s) => Math.max(0.5, (s.days[0] + s.days[1]) / 2));
  const sum = mids.reduce((a, b) => a + b, 0);
  let at = 0;
  return t.map((s, i) => {
    const from = at / sum;
    at += mids[i];
    return { ...s, from, to: at / sum };
  });
}

export function RouteMap({
  dest,
  port,
  method,
  run,
  reduce,
  onStage,
  onPick,
}: {
  dest: Destination;
  port: UsPort;
  method: Method;
  /** Bumped to play the trip from the start. */
  run: number;
  reduce: boolean;
  onStage: (i: number) => void;
  onPick: (id: string) => void;
}) {
  const road = useMemo(() => routePath(roadRoute(port)), [port]);
  // one path, or two when the route crosses the Pacific off the map's edge
  const sea = useMemo(() => seaRoute(port, dest).map((seg) => routePath(seg)), [port, dest]);
  const roadRef = useRef<SVGPathElement>(null);
  const roadDone = useRef<SVGPathElement>(null);
  const seaRefs = useRef<(SVGPathElement | null)[]>([]);
  const seaDone = useRef<(SVGPathElement | null)[]>([]);
  const ship = useRef<SVGGElement>(null);
  const day = useRef<HTMLSpanElement>(null);
  const stages = useMemo(() => spans(dest, port, method), [dest, port, method]);
  const days = useMemo(() => totalDays(dest, port, method), [dest, port, method]);
  const onStageRef = useRef(onStage);
  useEffect(() => {
    onStageRef.current = onStage;
  });

  useEffect(() => {
    const rp = roadRef.current;
    const paths = seaRefs.current.slice(0, sea.length);
    if (!rp || !ship.current || !roadDone.current || paths.some((p) => !p)) return;
    const rl = rp.getTotalLength();
    const lens = paths.map((p) => p!.getTotalLength());
    const sl = lens.reduce((a, b) => a + b, 0);
    roadDone.current.style.strokeDasharray = `${rl}`;
    seaDone.current.slice(0, sea.length).forEach((p, i) => p && (p.style.strokeDasharray = `${lens[i]}`));
    const roadStage = stages[1];
    const seaStage = stages[4];
    let last = -1;
    const draw = (t: number) => {
      const rt = Math.min(1, Math.max(0, (t - roadStage.from) / (roadStage.to - roadStage.from)));
      const st = Math.min(1, Math.max(0, (t - seaStage.from) / (seaStage.to - seaStage.from)));
      let pt: DOMPoint;
      if (t < seaStage.from) pt = rp.getPointAtLength(rt * rl);
      else {
        let left = st * sl;
        let i = 0;
        while (i < lens.length - 1 && left > lens[i]) left -= lens[i++];
        pt = paths[i]!.getPointAtLength(Math.min(left, lens[i]));
      }
      ship.current!.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      roadDone.current!.style.strokeDashoffset = `${rl * (1 - rt)}`;
      let done = st * sl;
      seaDone.current.slice(0, sea.length).forEach((p, i) => {
        const here = Math.min(lens[i], Math.max(0, done));
        done -= lens[i];
        if (p) p.style.strokeDashoffset = `${lens[i] - here}`;
      });
      const i = Math.max(0, stages.findIndex((s) => t >= s.from && t < s.to));
      const idx = t >= 1 ? stages.length - 1 : i;
      if (day.current) day.current.textContent = String(Math.round(t * ((days[0] + days[1]) / 2)));
      if (idx !== last) {
        last = idx;
        onStageRef.current(idx);
      }
    };
    if (!run || reduce) {
      draw(run ? 1 : 0);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 10000);
      draw(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, reduce, stages, days, road, sea]);

  const [dx, dy] = project(dest.lat, dest.lon);
  return (
    <div className="relative w-full" style={{ aspectRatio: `${WORLD.w} / ${WORLD.h}` }}>
      <svg viewBox={`0 0 ${WORLD.w} ${WORLD.h}`} className="absolute inset-0 w-full h-full" aria-hidden>
        <path d={LAND_DOTS} stroke="rgba(255,255,255,0.2)" strokeWidth={3} strokeLinecap="round" fill="none" />
        <path ref={roadRef} d={road} stroke="rgba(255,255,255,0.35)" strokeWidth={1.6} strokeDasharray="3 4" fill="none" />
        <path ref={roadDone} d={road} stroke="#fff" strokeWidth={2} fill="none" />
        {sea.map((d, i) => (
          <g key={`${i}${d.length}`}>
            <path ref={(el) => void (seaRefs.current[i] = el)} d={d} stroke={BLUE} strokeOpacity={0.4} strokeWidth={1.6} strokeDasharray="2 5" strokeLinecap="round" fill="none" />
            <path ref={(el) => void (seaDone.current[i] = el)} d={d} stroke={BLUE} strokeWidth={2.4} strokeLinecap="round" fill="none" />
          </g>
        ))}
        {DESTINATIONS.map((d) => {
          const [x, y] = project(d.lat, d.lon);
          return <circle key={d.id} cx={x} cy={y} r={d.id === dest.id ? 5 : 3} fill={d.id === dest.id ? BLUE : "rgba(255,255,255,0.55)"} />;
        })}
        {US_PORTS.map((p) => {
          const [x, y] = project(p.lat, p.lon);
          return <circle key={p.id} cx={x} cy={y} r={p.id === port.id ? 4.5 : 2.5} fill={p.id === port.id ? "#fff" : "rgba(255,255,255,0.45)"} />;
        })}
        <circle cx={project(HQ.lat, HQ.lon)[0]} cy={project(HQ.lat, HQ.lon)[1]} r={3.5} fill="#fff" />
        <g ref={ship}>
          <circle r={11} fill={BLUE} opacity={0.22} />
          <circle r={5} fill="#fff" stroke={BLUE} strokeWidth={2.5} />
        </g>
      </svg>
      {/* every destination is a hit target; only the chosen one is labelled */}
      {DESTINATIONS.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => onPick(d.id)}
          title={`${d.port}, ${d.country}`}
          aria-label={`Ship to ${d.port}, ${d.country}`}
          aria-pressed={d.id === dest.id}
          className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={pct(d.lat, d.lon)}
        />
      ))}
      <span className="pointer-events-none absolute whitespace-nowrap text-[11.5px] md:text-[12.5px] font-semibold text-white" style={{ left: `${(dx / WORLD.w) * 100}%`, top: `${(dy / WORLD.h) * 100}%`, transform: dx > WORLD.w * 0.8 ? "translate(calc(-100% - 10px), -50%)" : "translate(10px, -50%)" }}>
        {dest.flag} {dest.port}
      </span>
      <span className="pointer-events-none absolute whitespace-nowrap text-[11px] md:text-[12px] text-white/80" style={{ ...pct(port.lat, port.lon), transform: port.id === "losangeles" ? "translate(-15%, 8px)" : "translate(8px, -120%)" }}>
        {port.short}
      </span>
      <div className="absolute left-1.5 bottom-1 md:left-4 md:bottom-4 rounded-lg md:rounded-xl bg-black/55 backdrop-blur px-2 py-1 md:px-3 md:py-2 flex items-baseline gap-2 md:block">
        <p className="font-mono tabular-nums text-[13px] md:text-[24px] leading-none text-white">
          Day <span ref={day}>0</span>
        </p>
        <p className="md:mt-1 text-[10px] md:text-[11px] text-white/60">
          of {days[0]} to {days[1]}
        </p>
      </div>
    </div>
  );
}

export default function Journey({
  dest,
  setDest,
  port,
  setPort,
  method,
  setMethod,
  vehicle,
  setVehicle,
  stage,
  play,
}: {
  dest: Destination;
  setDest: (id: string) => void;
  port: UsPort;
  setPort: (id: string) => void;
  method: Method;
  setMethod: (m: Method) => void;
  vehicle: Vehicle;
  setVehicle: (v: Vehicle) => void;
  stage: number;
  play: () => void;
}) {
  const t = timeline(dest, port, method);
  const [lo, hi] = totalDays(dest, port, method);
  const m = METHODS[method];
  return (
    <div>
      <p className="label">Method</p>
      <div className="seg mt-1.5 w-full" role="tablist" aria-label="Shipping method">
        {(["roro", "container"] as const).map((s) => (
          <button key={s} type="button" role="tab" aria-selected={method === s} onClick={() => setMethod(s)} className="seg-item flex-1">
            {METHODS[s].short}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-3)]">
        {m.copy} <span className="text-[var(--ink-2)]">Best for: {m.best}. {m.tag}.</span>
      </p>

      <p className="label mt-5">From</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {US_PORTS.map((p) => (
          <button key={p.id} type="button" className="pill !h-8 !text-[12.5px]" aria-pressed={port.id === p.id} onClick={() => setPort(p.id)}>
            {p.short}
          </button>
        ))}
      </div>

      <label className="block mt-4">
        <span className="label">To</span>
        <select className="field mt-1.5" value={dest.id} onChange={(e) => setDest(e.target.value)}>
          {DESTINATIONS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.flag} {d.country} ({d.port})
            </option>
          ))}
        </select>
      </label>
      <label className="block mt-4">
        <span className="label">Vehicle type</span>
        <select className="field mt-1.5" value={vehicle} onChange={(e) => setVehicle(e.target.value as Vehicle)}>
          {VEHICLES.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6 flex items-end justify-between gap-3">
        <div>
          <p className="stat-label">
            {port.short} to {dest.port.replace(/^Port of /, "")}, port to port
          </p>
          <p className="stat-value">
            {dest.days[0] + m.loading} to {dest.days[1] + m.loading} days
          </p>
          <p className="mt-1 text-[12px] text-[var(--ink-3)] tabular-nums">
            {lo} to {hi} days from purchase to your port
          </p>
        </div>
        <button type="button" onClick={play} className="btn btn-solid !h-10 !px-4 !text-[13px]">
          {stage >= 0 ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />} {stage >= 0 ? "Replay" : "Play the trip"}
        </button>
      </div>
      <ol className="mt-4 relative">
        {t.map((s, i) => (
          <li key={s.id} className="relative flex gap-3 pb-3 last:pb-0">
            <span className={`relative z-[1] mt-1 w-2.5 h-2.5 shrink-0 rounded-full transition-colors ${i <= stage ? "bg-[#2f6bff]" : "bg-[var(--line-strong)]"}`} />
            {i < t.length - 1 && <span className="absolute left-[4.5px] top-3 bottom-0 w-px bg-[var(--line)]" />}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-3">
                <span className={`text-[13.5px] ${i === stage ? "text-[var(--foreground)] font-medium" : "text-[var(--ink-2)]"}`}>{s.label}</span>
                <span className="text-[12px] text-[var(--ink-3)] tabular-nums whitespace-nowrap">
                  {s.days[0] === s.days[1] ? s.days[0] : `${s.days[0]} to ${s.days[1]}`} {s.days[1] === 1 ? "day" : "days"}
                </span>
              </div>
              <p className="text-[12px] leading-snug text-[var(--ink-3)]">{s.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[12px] leading-relaxed text-[var(--ink-3)]">
        Port-to-port times are Rockmotion&apos;s; customs clearance and inland delivery may add time. The other steps are typical ranges.
      </p>
    </div>
  );
}
