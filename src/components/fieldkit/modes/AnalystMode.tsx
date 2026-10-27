"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { emit } from "../events";
import { EASE_OUT } from "@/lib/motion";
import FinanceMode from "./FinanceMode";

/* ---------- the model ---------- */

interface Inputs {
  revenue: number; // year-1 revenue, GHS m
  growth: number; // % per year
  margin: number; // gross margin %
  capex: number; // upfront capex, GHS m
  rate: number; // discount rate %
}
type ShockId = "cedi" | "rates" | "demand" | "receivables";
type Shocks = Record<ShockId, boolean>;

const BASE: Inputs = { revenue: 6, growth: 18, margin: 42, capex: 5, rate: 24 };
const COVENANT = 1.25;

const SHOCKS: { id: ShockId; label: string; note: string }[] = [
  { id: "cedi", label: "Cedi −30%", note: "imported inputs and kit cost more" },
  { id: "rates", label: "Rates +500bp", note: "dearer debt, higher hurdle" },
  { id: "demand", label: "Demand −20%", note: "fewer units sold" },
  { id: "receivables", label: "Late receivables", note: "30 → 90 days to get paid" },
];

const SLIDERS: { key: keyof Inputs; label: string; min: number; max: number; step: number; fmt: (n: number) => string }[] = [
  { key: "revenue", label: "Revenue Y1", min: 2, max: 16, step: 0.5, fmt: (n) => `GHS ${n.toFixed(1)}m` },
  { key: "growth", label: "Growth", min: 0, max: 40, step: 1, fmt: (n) => `${n}%` },
  { key: "margin", label: "Gross margin", min: 20, max: 70, step: 1, fmt: (n) => `${n}%` },
  { key: "capex", label: "Capex", min: 1, max: 14, step: 0.5, fmt: (n) => `GHS ${n.toFixed(1)}m` },
  { key: "rate", label: "Discount rate", min: 12, max: 40, step: 1, fmt: (n) => `${n}%` },
];

function run(inp: Inputs, s: Shocks) {
  const r = (inp.rate + (s.rates ? 5 : 0)) / 100;
  const rd = 0.22 + (s.rates ? 0.05 : 0);
  const gm = (inp.margin - (s.cedi ? 6 : 0)) / 100;
  const capex0 = inp.capex * (s.cedi ? 1.3 : 1);
  const r1 = inp.revenue * (s.demand ? 0.8 : 1);
  const days = s.receivables ? 90 : 30;
  const dep = capex0 / 5;
  const debt = capex0 * 0.6;
  const ds = (debt * rd) / (1 - Math.pow(1 + rd, -5));

  const fcf: number[] = [];
  const dscr: number[] = [];
  let wcPrev = 0;
  let ebitda5 = 0;
  for (let t = 1; t <= 5; t++) {
    const rev = r1 * Math.pow(1 + inp.growth / 100, t - 1);
    const opex = 0.16 * inp.revenue * Math.pow(1.05, t - 1);
    const ebitda = rev * gm - opex;
    const tax = Math.max(0, (ebitda - dep) * 0.25);
    const wc = (rev * days) / 365;
    fcf.push(ebitda - tax - (wc - wcPrev));
    dscr.push((ebitda - tax) / ds);
    wcPrev = wc;
    ebitda5 = ebitda;
  }
  const tv = Math.max(0, 4 * ebitda5); // exit at 4x EBITDA
  const flows = [-capex0, ...fcf.map((f, i) => (i === 4 ? f + tv : f))];
  const npvAt = (rate: number) => flows.reduce((acc, f, t) => acc + f / Math.pow(1 + rate, t), 0);
  const npv = npvAt(r);

  // IRR by bisection
  let lo = -0.9;
  let hi = 3;
  let irr: number | null = null;
  if (npvAt(lo) * npvAt(hi) < 0) {
    for (let k = 0; k < 80; k++) {
      const mid = (lo + hi) / 2;
      if (npvAt(lo) * npvAt(mid) <= 0) hi = mid;
      else lo = mid;
    }
    irr = (lo + hi) / 2;
  }
  return { fcf, npv, irr, dscrMin: Math.min(...dscr) };
}

/* ---------- bits ---------- */

function Tween({ value, fmt }: { value: number; fmt: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const last = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = fmt(value);
      last.current = value;
      return;
    }
    const c = animate(last.current, value, { duration: 0.55, ease: EASE_OUT, onUpdate: (v) => (el.textContent = fmt(v)) });
    last.current = value;
    return () => c.stop();
  }, [value, fmt, reduce]);
  return (
    <span ref={ref} className="tabular-nums">
      {fmt(value)}
    </span>
  );
}

const fmtM = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)}m`;
const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;
const fmtX = (n: number) => `${n.toFixed(2)}x`;

function Fan({ inp, shocks }: { inp: Inputs; shocks: Shocks }) {
  const reduce = useReducedMotion();
  const bear = run({ ...inp, growth: Math.max(0, inp.growth - 10), margin: inp.margin - 5 }, shocks).fcf;
  const base = run(inp, shocks).fcf;
  const bull = run({ ...inp, growth: inp.growth + 10, margin: inp.margin + 5 }, shocks).fcf;
  const all = [...bear, ...bull, ...base, 0];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const W = 300;
  const H = 150;
  const pad = { l: 30, r: 8, t: 10, b: 18 };
  const x = (i: number) => pad.l + (i / 4) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min || 1)) * (H - pad.t - pad.b);
  const line = (arr: number[]) => arr.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const band = `${line(bull)} ${bear
    .map((v, i) => [x(i), y(v)] as const)
    .reverse()
    .map(([a, b]) => `L${a.toFixed(1)},${b.toFixed(1)}`)
    .join(" ")} Z`;
  const tr = reduce ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" role="img" aria-label="Scenario fan chart of free cash flow, years 1 to 5">
      <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} stroke="rgba(255,255,255,0.18)" strokeDasharray="2 3" />
      {[max, (max + min) / 2, min].map((v, i) => (
        <text key={i} x={pad.l - 5} y={y(v) + 3} textAnchor="end" className="fill-white/35" fontSize="8" fontFamily="var(--font-mono)">
          {v.toFixed(1)}
        </text>
      ))}
      {[1, 2, 3, 4, 5].map((t, i) => (
        <text key={t} x={x(i)} y={H - 5} textAnchor="middle" className="fill-white/35" fontSize="8" fontFamily="var(--font-mono)">
          Y{t}
        </text>
      ))}
      <motion.path initial={false} animate={{ d: band }} transition={tr} fill="var(--accent)" fillOpacity={0.14} />
      <motion.path initial={false} animate={{ d: line(bull) }} transition={tr} stroke="#4ade80" strokeWidth={1.2} fill="none" strokeOpacity={0.7} />
      <motion.path initial={false} animate={{ d: line(bear) }} transition={tr} stroke="#f87171" strokeWidth={1.2} fill="none" strokeOpacity={0.7} />
      <motion.path initial={false} animate={{ d: line(base) }} transition={tr} stroke="var(--accent)" strokeWidth={2} fill="none" />
      <text x={W - pad.r} y={y(bull[4]) - 4} textAnchor="end" fontSize="8" className="fill-[#4ade80]" fontFamily="var(--font-mono)">bull</text>
      <text x={W - pad.r} y={y(bear[4]) + 10} textAnchor="end" fontSize="8" className="fill-[#f87171]" fontFamily="var(--font-mono)">bear</text>
    </svg>
  );
}

function Tornado({ inp, shocks }: { inp: Inputs; shocks: Shocks }) {
  const reduce = useReducedMotion();
  const base = run(inp, shocks).npv;
  const rows = SLIDERS.map((s) => {
    const lo = run({ ...inp, [s.key]: inp[s.key] * 0.8 }, shocks).npv - base;
    const hi = run({ ...inp, [s.key]: inp[s.key] * 1.2 }, shocks).npv - base;
    return { label: s.label, lo, hi, span: Math.abs(hi - lo) };
  }).sort((a, b) => b.span - a.span);
  const m = Math.max(...rows.flatMap((r) => [Math.abs(r.lo), Math.abs(r.hi)]), 0.1);
  return (
    <div className="h-full flex flex-col justify-center gap-[7px]" role="img" aria-label="Tornado chart: NPV sensitivity to each input at plus and minus 20 percent">
      {rows.map((r) => {
        const left = Math.min(r.lo, r.hi);
        const right = Math.max(r.lo, r.hi);
        return (
          <div key={r.label} className="grid grid-cols-[78px_1fr] items-center gap-2">
            <span className="font-mono text-[9px] text-white/50 truncate">{r.label}</span>
            <div className="relative h-[13px]">
              <span className="absolute left-1/2 top-[-2px] bottom-[-2px] w-px bg-white/20" />
              <motion.span
                className="absolute top-0 bottom-0 rounded-l-[3px] bg-[#f87171]/75"
                initial={false}
                animate={{ right: "50%", width: `${(Math.max(0, -left) / m) * 50}%` }}
                transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
              />
              <motion.span
                className="absolute top-0 bottom-0 rounded-r-[3px] bg-[#4ade80]/75"
                initial={false}
                animate={{ left: "50%", width: `${(Math.max(0, right) / m) * 50}%` }}
                transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
              />
            </div>
          </div>
        );
      })}
      <div className="grid grid-cols-[78px_1fr] gap-2 font-mono text-[8.5px] text-white/30">
        <span />
        <span className="flex justify-between">
          <span>−{m.toFixed(1)}m</span>
          <span>NPV Δ at ±20%</span>
          <span>+{m.toFixed(1)}m</span>
        </span>
      </div>
    </div>
  );
}

/* ---------- mode ---------- */

export default function AnalystMode() {
  const [tab, setTab] = useState<"stress" | "compare">("stress");
  const [inp, setInp] = useState<Inputs>(BASE);
  const [shocks, setShocks] = useState<Shocks>({ cedi: false, rates: false, demand: false, receivables: false });
  const [chart, setChart] = useState<"fan" | "tornado">("fan");
  const out = useMemo(() => run(inp, shocks), [inp, shocks]);
  const pass = out.dscrMin >= COVENANT;

  const logModel = (i = inp, s = shocks) => {
    const o = run(i, s);
    emit("finance", "model.updated", `NPV GHS ${fmtM(o.npv)} · DSCR ${fmtX(o.dscrMin)}`);
  };

  const toggleShock = (id: ShockId) => {
    const next = { ...shocks, [id]: !shocks[id] };
    setShocks(next);
    const o = run(inp, next);
    const verdict = o.dscrMin >= COVENANT ? "covenant holds" : "covenant breach";
    if (next[id]) {
      emit("finance", "shock.applied", `${SHOCKS.find((s) => s.id === id)!.label} · NPV GHS ${fmtM(o.npv)} · ${verdict}`);
    } else {
      emit("finance", "shock.cleared", `${SHOCKS.find((s) => s.id === id)!.label} · DSCR ${fmtX(o.dscrMin)}`);
    }
  };

  const tabBtn = (id: typeof tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      aria-pressed={tab === id}
      className={`px-2.5 h-6 rounded-[6px] font-mono text-[9.5px] uppercase tracking-[0.12em] whitespace-nowrap transition-colors ${
        tab === id ? "bg-[#F2EEE6] text-[#14100A]" : "text-white/50 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <div role="group" aria-label="Analyst desk view" className="flex rounded-[8px] bg-white/[0.05] p-0.5">
          {tabBtn("stress", "Stress test")}
          {tabBtn("compare", "Compare")}
        </div>
        <span className="hidden @[400px]:block font-mono text-[9px] text-white/30 truncate">
          {tab === "stress" ? "SME deal · 5-yr DCF · exit 4x EBITDA" : "Murabaha vs conventional loan"}
        </span>
      </div>

      {tab === "compare" ? (
        <div className="flex-1 min-h-0">
          <FinanceMode />
        </div>
      ) : (
        <div className="flex-1 min-h-0 grid grid-cols-1 @[440px]:grid-cols-[190px_1fr] gap-3">
          {/* inputs */}
          <div className="flex flex-col gap-2 min-w-0">
            {SLIDERS.map((s) => (
              <label key={s.key} className="block">
                <span className="flex justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-white/40">
                  <span>{s.label}</span>
                  <span className="text-[#F2EEE6] normal-case tracking-normal text-[10px]">{s.fmt(inp[s.key])}</span>
                </span>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={inp[s.key]}
                  onChange={(e) => setInp((p) => ({ ...p, [s.key]: Number(e.target.value) }))}
                  onPointerUp={() => logModel()}
                  onKeyUp={() => logModel()}
                  className="fk-range mt-1.5 w-full"
                  aria-label={s.label}
                />
              </label>
            ))}
            <div className="mt-1 grid grid-cols-2 gap-1.5" role="group" aria-label="Shocks">
              {SHOCKS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleShock(s.id)}
                  aria-pressed={shocks[s.id]}
                  title={s.note}
                  className={`h-7 rounded-[7px] border font-mono text-[9px] tracking-[0.04em] transition-colors ${
                    shocks[s.id]
                      ? "bg-[#f87171]/15 border-[#f87171]/60 text-[#fca5a5]"
                      : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* outputs */}
          <div className="flex flex-col min-w-0 gap-2">
            <div className="grid grid-cols-3 gap-1.5">
              <div className="rounded-[8px] bg-[#16140F] border border-white/[0.06] px-2.5 py-2">
                <div className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/40">NPV GHS</div>
                <div className={`font-mono text-[15px] mt-0.5 ${out.npv >= 0 ? "text-[#F2EEE6]" : "text-[#fca5a5]"}`}>
                  <Tween value={out.npv} fmt={fmtM} />
                </div>
              </div>
              <div className="rounded-[8px] bg-[#16140F] border border-white/[0.06] px-2.5 py-2">
                <div className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/40">IRR</div>
                <div className="font-mono text-[15px] mt-0.5 text-[#F2EEE6]">
                  {out.irr === null ? "n/a" : <Tween value={out.irr} fmt={fmtPct} />}
                </div>
              </div>
              <div
                className={`rounded-[8px] border px-2.5 py-2 transition-colors ${
                  pass ? "bg-[#4ade80]/[0.07] border-[#4ade80]/30" : "bg-[#f87171]/[0.1] border-[#f87171]/45"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/40">
                  <span>Min DSCR</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: pass ? "#4ade80" : "#f87171",
                      boxShadow: `0 0 8px ${pass ? "#4ade80" : "#f87171"}`,
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div className="font-mono text-[15px] mt-0.5 text-[#F2EEE6]">
                  <Tween value={out.dscrMin} fmt={fmtX} />
                </div>
                <div className={`font-mono text-[8.5px] ${pass ? "text-[#86efac]" : "text-[#fca5a5]"}`}>
                  {pass ? `holds ≥ ${COVENANT}x` : `breach < ${COVENANT}x`}
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[150px] rounded-[8px] bg-[#13120F] border border-white/[0.06] p-2 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/40">
                  {chart === "fan" ? "Free cash flow, GHS m" : "Sensitivity"}
                </span>
                <div className="flex gap-1" role="group" aria-label="Chart">
                  {(["fan", "tornado"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setChart(c)}
                      aria-pressed={chart === c}
                      className={`px-1.5 h-5 rounded font-mono text-[8.5px] uppercase tracking-[0.1em] ${
                        chart === c ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-h-0 mt-1">
                {chart === "fan" ? <Fan inp={inp} shocks={shocks} /> : <Tornado inp={inp} shocks={shocks} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
