"use client";

import { useEffect, useMemo, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";
import { ATLANTIC, LAND_DOTS } from "@/lib/atlantic";
import { BODIES, DESTINATIONS, LOT, US_PORT, project, routePath, seaRoute, timeline, totalDays, type Body, type Destination, type Shipping } from "@/lib/rockmotion";

const BLUE = "#2f6bff";
const pct = (lat: number, lon: number) => {
  const [x, y] = project(lat, lon);
  return { left: `${(x / ATLANTIC.w) * 100}%`, top: `${(y / ATLANTIC.h) * 100}%` };
};

/** Where each stage starts and ends, as a share of the whole trip (midpoint days). */
function spans(d: Destination) {
  const t = timeline(d);
  const mids = t.map((s) => (s.days[0] + s.days[1]) / 2);
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
  shipping,
  run,
  reduce,
  onStage,
  onPick,
}: {
  dest: Destination;
  shipping: Shipping;
  /** Bumped to play the trip from the start. */
  run: number;
  reduce: boolean;
  onStage: (i: number) => void;
  onPick: (id: string) => void;
}) {
  const port = US_PORT[shipping];
  const truck = useMemo(() => routePath([[LOT.lat, LOT.lon], [32.9, -83.2], [port.lat, port.lon]]), [port]);
  const sea = useMemo(() => routePath(seaRoute(dest, shipping)), [dest, shipping]);
  const truckRef = useRef<SVGPathElement>(null);
  const seaRef = useRef<SVGPathElement>(null);
  const seaDone = useRef<SVGPathElement>(null);
  const truckDone = useRef<SVGPathElement>(null);
  const ship = useRef<SVGGElement>(null);
  const day = useRef<HTMLSpanElement>(null);
  const stages = useMemo(() => spans(dest), [dest]);
  const days = totalDays(dest);
  const onStageRef = useRef(onStage);
  useEffect(() => {
    onStageRef.current = onStage;
  });

  useEffect(() => {
    const tp = truckRef.current;
    const sp = seaRef.current;
    if (!tp || !sp || !ship.current || !seaDone.current || !truckDone.current) return;
    const tl = tp.getTotalLength();
    const sl = sp.getTotalLength();
    truckDone.current.style.strokeDasharray = `${tl}`;
    seaDone.current.style.strokeDasharray = `${sl}`;
    const truckStage = stages[1];
    const seaStage = stages[4];
    let last = -1;
    const draw = (t: number) => {
      const tt = Math.min(1, Math.max(0, (t - truckStage.from) / (truckStage.to - truckStage.from)));
      const st = Math.min(1, Math.max(0, (t - seaStage.from) / (seaStage.to - seaStage.from)));
      const p = t < seaStage.from ? tp.getPointAtLength(tt * tl) : sp.getPointAtLength(st * sl);
      ship.current!.setAttribute("transform", `translate(${p.x} ${p.y})`);
      truckDone.current!.style.strokeDashoffset = `${tl * (1 - tt)}`;
      seaDone.current!.style.strokeDashoffset = `${sl * (1 - st)}`;
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
      const t = Math.min(1, (now - start) / 9000);
      draw(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, reduce, stages, days, truck, sea]);

  return (
    <div className="relative w-full" style={{ aspectRatio: `${ATLANTIC.w} / ${ATLANTIC.h}` }}>
      <svg viewBox={`0 0 ${ATLANTIC.w} ${ATLANTIC.h}`} className="absolute inset-0 w-full h-full" aria-hidden>
        <path d={LAND_DOTS} stroke="rgba(255,255,255,0.22)" strokeWidth={3.6} strokeLinecap="round" fill="none" />
        <path ref={truckRef} d={truck} stroke="rgba(255,255,255,0.35)" strokeWidth={2} strokeDasharray="4 5" fill="none" />
        <path ref={truckDone} d={truck} stroke="#fff" strokeWidth={2.4} fill="none" />
        <path ref={seaRef} d={sea} stroke={BLUE} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" fill="none" />
        <path ref={seaDone} d={sea} stroke={BLUE} strokeWidth={3} strokeLinecap="round" fill="none" />
        {DESTINATIONS.map((d) => {
          const [x, y] = project(d.lat, d.lon);
          return <circle key={d.id} cx={x} cy={y} r={d.id === dest.id ? 6 : 3.5} fill={d.id === dest.id ? BLUE : "rgba(255,255,255,0.5)"} />;
        })}
        {[LOT, port].map((p) => {
          const [x, y] = project(p.lat, p.lon);
          return <circle key={p.name} cx={x} cy={y} r={5} fill="#fff" />;
        })}
        <g ref={ship}>
          <circle r={14} fill={BLUE} opacity={0.22} />
          <circle r={6.5} fill="#fff" stroke={BLUE} strokeWidth={3} />
        </g>
      </svg>
      {/* labels as HTML so they stay readable at any size */}
      {[
        { ...LOT, label: "Atlanta lot", dx: "-12%", dy: "-170%" },
        { ...port, label: port.name.replace(", GA", ""), dx: "14px", dy: "-50%" },
      ].map((l) => (
        <span key={l.label} className="absolute text-[11.5px] md:text-[12.5px] text-white/85 whitespace-nowrap" style={{ ...pct(l.lat, l.lon), transform: `translate(${l.dx}, ${l.dy})` }}>
          {l.label}
        </span>
      ))}
      {DESTINATIONS.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => onPick(d.id)}
          className={`absolute whitespace-nowrap text-[11.5px] md:text-[12.5px] ${d.id === dest.id ? "text-white font-semibold" : "hidden md:block text-white/55 hover:text-white"}`}
          style={{ ...pct(d.lat, d.lon), transform: d.id === "rotterdam" ? "translate(12px, -50%)" : d.id === "abidjan" ? "translate(-50%, 9px)" : d.id === "tema" ? "translate(-50%, 9px)" : d.id === "lome" ? "translate(-50%, -175%)" : d.id === "cotonou" ? "translate(-30%, -310%)" : "translate(-10%, 9px)" }}
        >
          {d.port}
        </button>
      ))}
      <div className="absolute left-3 bottom-3 md:left-5 md:bottom-5 rounded-xl bg-black/55 backdrop-blur px-3.5 py-2.5">
        <p className="font-mono tabular-nums text-[22px] md:text-[26px] leading-none text-white">
          Day <span ref={day}>0</span>
        </p>
        <p className="mt-1 text-[11.5px] text-white/60">
          typical total {days[0]} to {days[1]} days
        </p>
      </div>
    </div>
  );
}

export default function Journey({
  dest,
  setDest,
  shipping,
  setShipping,
  body,
  setBody,
  stage,
  play,
}: {
  dest: Destination;
  setDest: (id: string) => void;
  shipping: Shipping;
  setShipping: (s: Shipping) => void;
  body: Body;
  setBody: (b: Body) => void;
  stage: number;
  play: () => void;
}) {
  const t = timeline(dest);
  const [lo, hi] = totalDays(dest);
  return (
    <div>
      <p className="label">Shipping</p>
      <div className="seg mt-1.5 w-full" role="tablist" aria-label="Shipping method">
        {(["roro", "container"] as const).map((s) => (
          <button key={s} type="button" role="tab" aria-selected={shipping === s} onClick={() => setShipping(s)} className="seg-item flex-1">
            {s === "roro" ? "RoRo" : "Container"}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-3)]">
        {shipping === "roro"
          ? "Roll-on roll-off: the car is driven onto a car carrier at Brunswick. Usually the cheaper way for a car that runs."
          : "Loaded at Savannah, blocked and strapped, often sharing the box with two or three other cars. Suits cars that don't run."}
      </p>

      <p className="label mt-5">To</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {DESTINATIONS.map((d) => (
          <button key={d.id} type="button" className="pill !h-8 !text-[12.5px]" aria-pressed={dest.id === d.id} onClick={() => setDest(d.id)}>
            {d.port}
          </button>
        ))}
      </div>
      <p className="label mt-4">Vehicle</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {BODIES.map((b) => (
          <button key={b.id} type="button" className="pill !h-8 !text-[12.5px]" aria-pressed={body === b.id} onClick={() => setBody(b.id)}>
            {b.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <div>
          <p className="stat-label">Atlanta to {dest.port}, typical</p>
          <p className="stat-value">
            {lo} to {hi} days
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
      <p className="mt-4 text-[12px] leading-relaxed text-[var(--ink-3)]">Typical ranges for a direct sailing. The real dates follow the vessel schedule Rockmotion books.</p>
    </div>
  );
}
