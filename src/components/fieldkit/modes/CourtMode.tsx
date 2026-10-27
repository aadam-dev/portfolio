"use client";

import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import { emit } from "../events";
import { MADINA } from "../items";

/* Half court in feet ×10: 50ft wide, 47ft deep, baseline at the top. */
const W = 500;
const H = 470;
const HOOP = { x: 250, y: 52 };
const CORNER_Y = 140;

type Zone = "paint" | "midL" | "midR" | "c3L" | "c3R" | "ab3";
const ZONES: { id: Zone; label: string; x: number; y: number }[] = [
  { id: "paint", label: "Paint", x: 250, y: 120 },
  { id: "midL", label: "Mid L", x: 135, y: 175 },
  { id: "midR", label: "Mid R", x: 365, y: 175 },
  { id: "c3L", label: "Corner", x: 22, y: 60 },
  { id: "c3R", label: "Corner", x: 478, y: 60 },
  { id: "ab3", label: "Above break", x: 250, y: 360 },
];

interface Shot {
  id: number;
  x: number;
  y: number;
  made: boolean;
  three: boolean;
  zone: Zone;
}

function classify(x: number, y: number) {
  const d = Math.hypot(x - HOOP.x, y - HOOP.y) / 10;
  const corner = y < CORNER_Y && Math.abs(x - 250) > 220;
  const three = corner || (y >= CORNER_Y && d > 23.75);
  let zone: Zone;
  if (three) zone = corner ? (x < 250 ? "c3L" : "c3R") : "ab3";
  else if (x > 170 && x < 330 && y < 190) zone = "paint";
  else zone = x < 250 ? "midL" : "midR";
  return { d, three, zone };
}

const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(0)}%` : "--");

function heat(rate: number) {
  // cold slate → signal orange
  const t = Math.max(0, Math.min(1, rate));
  const r = Math.round(70 + t * (255 - 70));
  const g = Math.round(110 + t * (91 - 110));
  const b = Math.round(160 + t * (31 - 160));
  return `rgb(${r},${g},${b})`;
}

function CourtLines() {
  const s = "rgba(242,238,230,0.28)";
  return (
    <g fill="none" stroke={s} strokeWidth={2}>
      <rect x={1} y={1} width={W - 2} height={H - 2} />
      <rect x={170} y={0} width={160} height={190} />
      <circle cx={250} cy={190} r={60} />
      <path d={`M 210 ${HOOP.y} A 40 40 0 0 0 290 ${HOOP.y}`} />
      <path d={`M 30 0 L 30 ${CORNER_Y} A 237.5 237.5 0 0 0 470 ${CORNER_Y} L 470 0`} />
      <path d="M 190 470 A 60 60 0 0 1 310 470" />
      <line x1={220} x2={280} y1={40} y2={40} stroke="rgba(242,238,230,0.6)" strokeWidth={3} />
      <circle cx={HOOP.x} cy={HOOP.y} r={9} stroke="#ff5b1f" strokeWidth={2.5} />
    </g>
  );
}

function ShotChart() {
  const reduce = !!useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const [view, setView] = useState<"shots" | "heat">("shots");
  const [flying, setFlying] = useState<{ from: { x: number; y: number }; to: { x: number; y: number } } | null>(null);
  const seq = useRef(0);
  const flight = useRef<{ from: { x: number; y: number }; to: { x: number; y: number } } | null>(null);

  const t = useMotionValue(0);
  const bx = useTransform(t, (v) => {
    const f = flight.current;
    if (!f) return -50;
    const { from, to } = f;
    const cx = (from.x + to.x) / 2 - (to.y - from.y) * 0.25;
    return (1 - v) ** 2 * from.x + 2 * (1 - v) * v * cx + v ** 2 * to.x;
  });
  const by = useTransform(t, (v) => {
    const f = flight.current;
    if (!f) return -50;
    const { from, to } = f;
    const cy = (from.y + to.y) / 2 + (to.x - from.x) * 0.25 - 40;
    return (1 - v) ** 2 * from.y + 2 * (1 - v) * v * cy + v ** 2 * to.y;
  });
  const br = useTransform(t, [0, 0.5, 1], [9, 15, 9]);

  const shoot = (e: React.MouseEvent<SVGSVGElement>) => {
    if (flying) return;
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const x = Math.max(4, Math.min(W - 4, p.x));
    const y = Math.max(4, Math.min(H - 4, p.y));
    const { d, three, zone } = classify(x, y);
    const prob = Math.max(0.08, 0.66 - 0.012 * d);
    const made = Math.random() < prob;
    const shot: Shot = { id: ++seq.current, x, y, made, three, zone };
    const land = made ? HOOP : { x: HOOP.x + (Math.random() - 0.5) * 50, y: HOOP.y + 18 + Math.random() * 20 };

    const commit = () => {
      setShots((s) => [...s, shot]);
      flight.current = null;
      setFlying(null);
      emit(
        "court",
        made ? "shot.made" : "shot.missed",
        `${three ? "3PT" : "2PT"} · ${d.toFixed(0)}ft · ${ZONES.find((z) => z.id === zone)!.label} · p=${prob.toFixed(2)}`,
      );
    };
    if (reduce) {
      commit();
      return;
    }
    flight.current = { from: { x, y }, to: land };
    setFlying(flight.current);
    t.set(0);
    animate(t, 1, { duration: 0.42 + d * 0.012, ease: [0.3, 0.1, 0.4, 1], onComplete: commit });
  };

  const fga = shots.length;
  const fgm = shots.filter((s) => s.made).length;
  const tpm = shots.filter((s) => s.made && s.three).length;
  const pts = shots.reduce((a, s) => a + (s.made ? (s.three ? 3 : 2) : 0), 0);

  const zoneStats = ZONES.map((z) => {
    const zs = shots.filter((s) => s.zone === z.id);
    return { ...z, a: zs.length, m: zs.filter((s) => s.made).length };
  });

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-2 h-full">
      <div className="relative min-h-0 flex items-start justify-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          onClick={shoot}
          className="w-full max-h-full cursor-crosshair rounded-[8px]"
          style={{ background: "linear-gradient(180deg, #1d1712, #16120e)", aspectRatio: `${W} / ${H}` }}
          role="img"
          aria-label={`Half court. Click to shoot. ${fgm} of ${fga} made.`}
        >
          <CourtLines />
          {view === "shots" &&
            shots.map((s) =>
              s.made ? (
                <circle key={s.id} cx={s.x} cy={s.y} r={8} fill="#ff5b1f" fillOpacity={0.9} />
              ) : (
                <g key={s.id} stroke="rgba(242,238,230,0.55)" strokeWidth={2.5}>
                  <line x1={s.x - 6} y1={s.y - 6} x2={s.x + 6} y2={s.y + 6} />
                  <line x1={s.x + 6} y1={s.y - 6} x2={s.x - 6} y2={s.y + 6} />
                </g>
              ),
            )}
          {view === "heat" &&
            zoneStats.map((z) => (
              <g key={z.id}>
                <circle
                  cx={z.x}
                  cy={z.y}
                  r={z.id.startsWith("c3") ? 18 : 34}
                  fill={z.a ? heat(z.m / z.a) : "rgba(242,238,230,0.06)"}
                  fillOpacity={z.a ? 0.75 : 1}
                />
                <text
                  x={z.x}
                  y={z.y + 5}
                  textAnchor="middle"
                  fontSize={z.id.startsWith("c3") ? 12 : 15}
                  fill="#0e0d0b"
                  fontFamily="var(--font-mono)"
                  fontWeight={600}
                >
                  {z.a ? `${z.m}/${z.a}` : "·"}
                </text>
              </g>
            ))}
          {flying && <motion.circle cx={bx} cy={by} r={br} fill="#e0792f" stroke="#3a1f0c" strokeWidth={1.5} />}
          {fga === 0 && (
            <text x={250} y={300} textAnchor="middle" fontSize={20} fill="rgba(242,238,230,0.4)" fontFamily="var(--font-mono)">
              click anywhere to shoot
            </text>
          )}
        </svg>
      </div>

      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="grid grid-cols-1 gap-1.5">
          {[
            { k: "FG%", v: pct(fgm, fga), sub: `${fgm}/${fga}` },
            { k: "eFG%", v: fga ? `${(((fgm + 0.5 * tpm) / fga) * 100).toFixed(0)}%` : "--", sub: `${tpm} from three` },
            { k: "Pts / shot", v: fga ? (pts / fga).toFixed(2) : "--", sub: `${pts} pts` },
          ].map((s) => (
            <div key={s.k} className="rounded-[8px] bg-[#16140F] border border-white/[0.06] px-2.5 py-1.5">
              <div className="flex justify-between font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/40">
                <span>{s.k}</span>
                <span className="normal-case tracking-normal">{s.sub}</span>
              </div>
              <div className="font-mono text-[16px] text-[#F2EEE6] tabular-nums">{s.v}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-1 mt-auto" role="group" aria-label="Chart view">
          {(["shots", "heat"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`flex-1 h-6 rounded-[6px] font-mono text-[9px] uppercase tracking-[0.1em] ${
                view === v ? "bg-white/10 text-white" : "text-white/40 hover:text-white border border-white/10"
              }`}
            >
              {v === "shots" ? "Shot chart" : "Zone heat"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShots([])}
          className="h-6 rounded-[6px] font-mono text-[9px] uppercase tracking-[0.1em] text-white/35 hover:text-white"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default function CourtMode() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#111] text-white font-body">
      <div className="h-[30px] shrink-0 flex items-center gap-2 px-3 border-b border-white/10 bg-[#161616]">
        <span className="text-[10.5px] font-bold tracking-[0.02em]">
          MADINA <span className="text-[#f97316]">BASKETBALL</span>
        </span>
        <span className="text-[8.5px] text-white/45">Libya Quarters court · shot tracking</span>
        <span className="ml-auto flex items-center gap-1 text-[8.5px] text-[#4ade80]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" /> Court active
        </span>
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-1 grid-rows-[110px_1fr] @[480px]:grid-rows-1 @[480px]:grid-cols-[34%_1fr]">
        <div className="relative">
          <Image unoptimized src={MADINA.court} alt="The renovated, solar-lit court at Libya Quarters, Madina" fill sizes="220px" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-[8.5px] leading-snug text-white/85">
            Renovated with community funds. The pipeline that tracks shots is the one that tracks donors.
          </div>
        </div>
        <div className="min-h-0 p-2.5">
          <ShotChart />
        </div>
      </div>
    </div>
  );
}
