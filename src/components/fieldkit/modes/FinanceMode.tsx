"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { cedi, emit } from "../events";
import { EASE_OUT } from "@/lib/motion";

// Illustrative assumptions only, shown on screen.
const LOAN_APR = 0.3; // conventional, reducing balance, variable
const MARKUP_PA = 0.19; // murabaha, flat markup per year, fixed on day one
const SHOCK_AT = 6; // month the loan rate can reprice
const TENORS = [6, 12, 24, 36] as const;
const SHOCKS = [0, 5, 10] as const; // percentage points added to the loan rate

const annuity = (principal: number, r: number, n: number) =>
  r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));

function loanCost(price: number, months: number, shockPts: number) {
  const r1 = LOAN_APR / 12;
  const pay1 = annuity(price, r1, months);
  if (!shockPts || months <= SHOCK_AT) return { total: pay1 * months, monthly: pay1 };
  let balance = price;
  for (let i = 0; i < SHOCK_AT; i++) balance = balance * (1 + r1) - pay1;
  const pay2 = annuity(balance, (LOAN_APR + shockPts / 100) / 12, months - SHOCK_AT);
  return { total: pay1 * SHOCK_AT + pay2 * (months - SHOCK_AT), monthly: pay2 };
}

/** The reducing-balance APR that gives the same monthly payment as the flat markup. */
function equivalentApr(price: number, monthly: number, months: number) {
  let lo = 0;
  let hi = 2;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (annuity(price, mid / 12, months) > monthly) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

function compute(price: number, months: number, shock: number) {
  const loan = loanCost(price, months, shock);
  const murabahaTotal = price * (1 + MARKUP_PA * (months / 12));
  const murabahaMonthly = murabahaTotal / months;
  return {
    loanTotal: loan.total,
    loanMonthly: loan.monthly,
    murabahaTotal,
    murabahaMonthly,
    murabahaApr: equivalentApr(price, murabahaMonthly, months),
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
const SLIDER_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);

export default function FinanceMode() {
  const [price, setPrice] = useState(40000);
  const [months, setMonths] = useState<number>(24);
  const [shock, setShock] = useState<number>(0);
  const q = compute(price, months, shock);
  const max = Math.max(q.loanTotal, q.murabahaTotal);
  const diff = q.loanTotal - q.murabahaTotal;

  const log = (p = price, m = months, s = shock) => {
    const x = compute(p, m, s);
    const d = x.loanTotal - x.murabahaTotal;
    emit(
      "finance",
      "quote.compared",
      `${cedi(p)} · ${m}mo · rates +${s} · ${d >= 0 ? "murabaha" : "loan"} by ${cedi(Math.round(Math.abs(d)))}`,
    );
  };

  const rows = [
    {
      key: "loan",
      label: "Conventional loan",
      sub: shock && months > SHOCK_AT ? `${LOAN_APR * 100}% then ${LOAN_APR * 100 + shock}% APR` : `${LOAN_APR * 100}% APR, variable`,
      total: q.loanTotal,
      monthly: q.loanMonthly,
      monthlyLabel: shock && months > SHOCK_AT ? "/ month after repricing" : "/ month",
      color: "#6B655C",
    },
    {
      key: "murabaha",
      label: "Murabaha",
      sub: `${MARKUP_PA * 100}% flat ≈ ${(q.murabahaApr * 100).toFixed(1)}% APR, fixed`,
      total: q.murabahaTotal,
      monthly: q.murabahaMonthly,
      monthlyLabel: "/ month, never changes",
      color: "var(--accent)",
    },
  ];

  const seg = (active: boolean) =>
    `px-2 h-7 rounded-[6px] font-mono text-[10.5px] transition-colors ${
      active ? "bg-[#F2EEE6] text-[#14100A]" : "text-white/55 hover:text-white"
    }`;

  return (
    <div className="@container flex flex-col h-full">
      <div className="grid gap-2.5 @sm:grid-cols-[1fr_auto] @sm:gap-x-4 items-end">
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
            onKeyUp={(e: KeyboardEvent) => SLIDER_KEYS.has(e.key) && log()}
            className="fk-range mt-2 w-full"
            aria-label="Asset price in cedis"
          />
        </label>
        <div role="group" aria-label="Tenor in months" className="flex justify-between rounded-[8px] bg-white/[0.05] p-0.5">
          {TENORS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setMonths(t);
                log(price, t);
              }}
              aria-pressed={months === t}
              className={seg(months === t)}
            >
              {t}m
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">
          Rates after month {SHOCK_AT}
        </span>
        <div role="group" aria-label="Loan rate change after month 6" className="flex rounded-[8px] bg-white/[0.05] p-0.5">
          {SHOCKS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setShock(s);
                log(price, months, s);
              }}
              aria-pressed={shock === s}
              className={seg(shock === s)}
            >
              {s === 0 ? "Hold" : `+${s} pts`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3.5 space-y-3">
        {rows.map((r) => {
          const principalPct = (price / max) * 100;
          const costPct = ((r.total - price) / max) * 100;
          return (
            <div key={r.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12px] text-[#F2EEE6] min-w-0">
                  {r.label} <span className="text-white/35 text-[10.5px] whitespace-nowrap">{r.sub}</span>
                </span>
                <span className="font-mono text-[12px] text-[#F2EEE6] shrink-0">
                  <Num value={r.total} format={fmtCedi} />
                </span>
              </div>
              <div className="mt-1.5 h-2.5 rounded-full bg-white/[0.05] overflow-hidden flex">
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
                <Num value={r.monthly} format={fmtCedi} /> {r.monthlyLabel}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-2.5 border-t border-dashed border-white/10">
        <div aria-live="polite">
          <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">
            {diff >= 0 ? "Murabaha saves" : "Loan saves"}
          </div>
          <div className="font-mono text-[17px] text-[var(--accent)] mt-0.5 whitespace-nowrap">
            <Num value={Math.abs(diff)} format={fmtCedi} />
          </div>
        </div>
        <p className="text-[9.5px] leading-snug text-white/35 max-w-[180px] text-right">
          Illustrative rates. The markup costs more on paper; push rates up to see when a fixed total pays.
        </p>
      </div>
    </div>
  );
}
