"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, useReducedMotion } from "framer-motion";
import { emit } from "../events";

/* A 5-year DCF for an SME deal, with the shocks a Ghana deal actually faces. */
type ShockId = "cedi" | "rates" | "demand";
type Shocks = Record<ShockId, boolean>;
const COVENANT = 1.25;
const SHOCKS: { id: ShockId; label: string; note: string }[] = [
  { id: "cedi", label: "Cedi −30%", note: "imported inputs and kit cost more" },
  { id: "rates", label: "Rates +500bp", note: "dearer debt, higher hurdle" },
  { id: "demand", label: "Demand −20%", note: "fewer units sold" },
];
const BASE = { revenue: 6, growth: 18, margin: 42, capex: 5, rate: 24 };

function run(s: Shocks) {
  const r = (BASE.rate + (s.rates ? 5 : 0)) / 100;
  const rd = 0.22 + (s.rates ? 0.05 : 0);
  const gm = (BASE.margin - (s.cedi ? 6 : 0)) / 100;
  const capex0 = BASE.capex * (s.cedi ? 1.3 : 1);
  const r1 = BASE.revenue * (s.demand ? 0.8 : 1);
  const dep = capex0 / 5;
  const debt = capex0 * 0.6;
  const ds = (debt * rd) / (1 - Math.pow(1 + rd, -5));
  const fcf: number[] = [];
  const dscr: number[] = [];
  let wcPrev = 0;
  let ebitda5 = 0;
  for (let t = 1; t <= 5; t++) {
    const rev = r1 * Math.pow(1 + BASE.growth / 100, t - 1);
    const ebitda = rev * gm - 0.16 * BASE.revenue * Math.pow(1.05, t - 1);
    const tax = Math.max(0, (ebitda - dep) * 0.25);
    const wc = (rev * 30) / 365;
    fcf.push(ebitda - tax - (wc - wcPrev));
    dscr.push((ebitda - tax) / ds);
    wcPrev = wc;
    ebitda5 = ebitda;
  }
  const flows = [-capex0, ...fcf.map((f, i) => (i === 4 ? f + Math.max(0, 4 * ebitda5) : f))];
  const npv = flows.reduce((a, f, t) => a + f / Math.pow(1 + r, t), 0);
  return { npv, dscr: Math.min(...dscr), fcf };
}

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
    const c = animate(last.current, value, { duration: 0.5, onUpdate: (v) => (el.textContent = fmt(v)) });
    last.current = value;
    return () => c.stop();
  }, [value, fmt, reduce]);
  return <span ref={ref}>{fmt(value)}</span>;
}

const fmtM = (n: number) => `GH₵${n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)}m`;
const fmtX = (n: number) => `${n.toFixed(2)}x`;

export default function AnalystMode() {
  const [shocks, setShocks] = useState<Shocks>({ cedi: false, rates: false, demand: false });
  const out = run(shocks);
  const pass = out.dscr >= COVENANT;
  const max = Math.max(...run({ cedi: false, rates: false, demand: false }).fcf, ...out.fcf, 0.1);

  const toggle = (id: ShockId) => {
    const next = { ...shocks, [id]: !shocks[id] };
    setShocks(next);
    const o = run(next);
    const label = SHOCKS.find((s) => s.id === id)!.label;
    emit("finance", next[id] ? "shock.applied" : "shock.cleared", `${label} · NPV ${fmtM(o.npv)} · DSCR ${fmtX(o.dscr)} ${o.dscr >= COVENANT ? "holds" : "breach"}`);
  };

  return (
    <div className="absolute inset-0 bg-white">
      <Image unoptimized src="/previews/ethika/tools.webp" alt="Ethika finance tools, the live page" fill sizes="600px" className="object-cover object-top" />
      <div className="absolute inset-0 bg-[#0b1430]/25" />
      <div className="absolute left-3 right-3 bottom-3 @[480px]:left-auto @[480px]:w-[300px] rounded-[10px] bg-white text-[#0f1b3d] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] border border-black/10 p-3 font-body">
        <div className="flex items-baseline justify-between">
          <span className="text-[11.5px] font-semibold">SME deal screen</span>
          <span className="text-[8.5px] text-black/45">5-yr DCF · exit 4x EBITDA</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1" role="group" aria-label="Shocks">
          {SHOCKS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              aria-pressed={shocks[s.id]}
              title={s.note}
              className={`h-[26px] rounded-[6px] border text-[9.5px] font-medium transition-colors ${
                shocks[s.id] ? "border-[#dc2626] bg-[#fef2f2] text-[#b91c1c]" : "border-black/15 hover:border-black/35"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <div className="rounded-[7px] bg-[#f4f6fb] px-2 py-1.5">
            <div className="text-[8.5px] text-black/50">NPV</div>
            <div className={`text-[15px] font-semibold tabular-nums ${out.npv < 0 ? "text-[#b91c1c]" : ""}`}>
              <Tween value={out.npv} fmt={fmtM} />
            </div>
          </div>
          <div className={`rounded-[7px] px-2 py-1.5 ${pass ? "bg-[#f0fdf4]" : "bg-[#fef2f2]"}`}>
            <div className="flex items-center justify-between text-[8.5px] text-black/50">
              <span>Min DSCR · covenant {COVENANT}x</span>
              <span className={`w-2 h-2 rounded-full ${pass ? "bg-[#16a34a]" : "bg-[#dc2626]"}`} aria-hidden="true" />
            </div>
            <div className="text-[15px] font-semibold tabular-nums">
              <Tween value={out.dscr} fmt={fmtX} />{" "}
              <span className={`text-[9px] ${pass ? "text-[#15803d]" : "text-[#b91c1c]"}`}>{pass ? "holds" : "breach"}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-end gap-1 h-[34px]" aria-label="Free cash flow by year">
          {out.fcf.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <span
                className="w-full rounded-t-[2px] transition-[height] duration-500"
                style={{ height: `${Math.max(2, (Math.max(0, v) / max) * 26)}px`, background: v < 0 ? "#dc2626" : "#1e3a8a" }}
              />
              <span className="text-[7.5px] text-black/40">Y{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
