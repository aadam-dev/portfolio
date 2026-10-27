"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { cedi, emit } from "../events";
import { EASE_OUT } from "@/lib/motion";

// Illustrative assumptions only, shown on screen.
const LOAN_APR = 0.3; // conventional, reducing balance
const MARKUP_PA = 0.19; // murabaha, fixed markup per year, agreed up front
const TENORS = [6, 12, 24, 36] as const;

function compute(price: number, months: number) {
  const r = LOAN_APR / 12;
  const loanMonthly = (price * r) / (1 - Math.pow(1 + r, -months));
  const loanTotal = loanMonthly * months;
  const murabahaTotal = price * (1 + MARKUP_PA * (months / 12));
  return {
    loanMonthly,
    loanTotal,
    murabahaMonthly: murabahaTotal / months,
    murabahaTotal,
  };
}

function Num({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const last = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = format(value);
      last.current = value;
      return;
    }
    const c = animate(last.current, value, {
      duration: 0.6,
      ease: EASE_OUT,
      onUpdate: (v) => (el.textContent = format(v)),
    });
    last.current = value;
    return () => c.stop();
  }, [value, format, reduce]);
  return (
    <span ref={ref} className="tabular-nums">
      {format(value)}
    </span>
  );
}

const fmtCedi = (n: number) => cedi(Math.round(n));

export default function FinanceMode() {
  const [price, setPrice] = useState(40000);
  const [months, setMonths] = useState<number>(12);
  const q = compute(price, months);
  const max = Math.max(q.loanTotal, q.murabahaTotal);
  const diff = q.loanTotal - q.murabahaTotal;

  const log = (p = price, m = months) => {
    const x = compute(p, m);
    emit(
      "finance",
      "quote.compared",
      `${cedi(p)} · ${m}mo · Δ ${cedi(Math.round(Math.abs(x.loanTotal - x.murabahaTotal)))}`,
    );
  };

  const rows = [
    { key: "loan", label: "Conventional loan", sub: `${LOAN_APR * 100}% APR, reducing`, total: q.loanTotal, monthly: q.loanMonthly, color: "#6B655C" },
    { key: "murabaha", label: "Murabaha", sub: `${MARKUP_PA * 100}% markup p.a., fixed`, total: q.murabahaTotal, monthly: q.murabahaMonthly, color: "#E8B23A" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
        <label className="block">
          <span className="flex justify-between font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">
            <span>Asset price</span>
            <span className="text-[#F2EEE6] text-[11px] normal-case tracking-normal">{cedi(price)}</span>
          </span>
          <input
            type="range"
            min={5000}
            max={120000}
            step={1000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            onPointerUp={() => log()}
            onKeyUp={() => log()}
            className="fk-range mt-2 w-full"
            aria-label="Asset price in cedis"
          />
        </label>
        <div role="group" aria-label="Tenor in months" className="flex rounded-[8px] bg-white/[0.05] p-0.5">
          {TENORS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setMonths(t);
                log(price, t);
              }}
              aria-pressed={months === t}
              className={`px-2 h-7 rounded-[6px] font-mono text-[10.5px] transition-colors ${
                months === t ? "bg-[#F2EEE6] text-[#14100A]" : "text-white/55 hover:text-white"
              }`}
            >
              {t}m
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {rows.map((r) => {
          const principalPct = (price / max) * 100;
          const costPct = ((r.total - price) / max) * 100;
          return (
            <div key={r.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12px] text-[#F2EEE6]">
                  {r.label} <span className="text-white/35 text-[10.5px]">{r.sub}</span>
                </span>
                <span className="font-mono text-[12px] text-[#F2EEE6]">
                  <Num value={r.total} format={fmtCedi} />
                </span>
              </div>
              <div className="mt-1.5 h-3 rounded-full bg-white/[0.05] overflow-hidden flex">
                <motion.span
                  className="h-full bg-white/20"
                  initial={false}
                  animate={{ width: `${principalPct}%` }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                />
                <motion.span
                  className="h-full"
                  style={{ background: r.color }}
                  initial={false}
                  animate={{ width: `${costPct}%` }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                />
              </div>
              <div className="mt-1 font-mono text-[10px] text-white/40">
                <Num value={r.monthly} format={fmtCedi} /> / month
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-3 border-t border-dashed border-white/10">
        <div>
          <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">
            {diff >= 0 ? "Murabaha saves" : "Loan saves"}
          </div>
          <div className="font-mono text-[17px] text-[#E8B23A] mt-0.5">
            <Num value={Math.abs(diff)} format={fmtCedi} />
          </div>
        </div>
        <p className="text-[9.5px] leading-snug text-white/35 max-w-[170px] text-right">
          Illustrative rates. Change the assumptions, the comparison recomputes.
        </p>
      </div>
    </div>
  );
}
