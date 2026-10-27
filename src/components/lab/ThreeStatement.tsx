"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Download, RotateCcw, TriangleAlert } from "lucide-react";
import { emit } from "@/components/fieldkit/events";
import {
  BALANCE,
  CASHFLOW,
  DEFAULTS,
  INCOME,
  NO_SHOCKS,
  run,
  shown,
  toCsv,
  type Inputs,
  type Model,
  type Shocks,
} from "@/lib/model3";

const COVENANT = 1.25;
const k = (n: number) => {
  const v = Math.round(n / 1000);
  return v < 0 ? `(${Math.abs(v).toLocaleString("en-GH")})` : v.toLocaleString("en-GH");
};
const m1 = (n: number) => `GHS ${(n / 1e6).toFixed(1)}m`;

type Field = { key: keyof Inputs; label: string; min: number; max: number; step: number; fmt: (v: number) => string };
const pct = (v: number) => `${v}%`;
const ghs = (v: number) => `GHS ${v.toLocaleString("en-GH")}`;
const GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: "Sales",
    fields: [
      { key: "units", label: "Packs sold, year 1", min: 100_000, max: 1_000_000, step: 10_000, fmt: (v) => v.toLocaleString("en-GH") },
      { key: "price", label: "Price per pack", min: 5, max: 40, step: 0.5, fmt: (v) => `GHS ${v.toFixed(2)}` },
      { key: "volumeGrowth", label: "Volume growth", min: -10, max: 30, step: 1, fmt: pct },
      { key: "priceGrowth", label: "Price growth", min: 0, max: 30, step: 1, fmt: pct },
    ],
  },
  {
    title: "Costs",
    fields: [
      { key: "cogsPct", label: "Cost of goods, % of revenue", min: 30, max: 90, step: 1, fmt: pct },
      { key: "opex", label: "Operating costs, year 1", min: 300_000, max: 4_000_000, step: 50_000, fmt: ghs },
      { key: "opexGrowth", label: "Operating cost growth", min: 0, max: 25, step: 1, fmt: pct },
    ],
  },
  {
    title: "Capital and working capital",
    fields: [
      { key: "capex", label: "Capex a year", min: 0, max: 2_000_000, step: 25_000, fmt: ghs },
      { key: "life", label: "Depreciation life", min: 3, max: 15, step: 1, fmt: (v) => `${v} years` },
      { key: "arDays", label: "Receivable days", min: 0, max: 120, step: 5, fmt: (v) => `${v} days` },
      { key: "invDays", label: "Inventory days", min: 0, max: 120, step: 5, fmt: (v) => `${v} days` },
      { key: "apDays", label: "Payable days", min: 0, max: 120, step: 5, fmt: (v) => `${v} days` },
    ],
  },
  {
    title: "Financing and tax",
    fields: [
      { key: "debt", label: "Term loan", min: 0, max: 8_000_000, step: 100_000, fmt: ghs },
      { key: "rate", label: "Interest rate", min: 5, max: 40, step: 0.5, fmt: pct },
      { key: "term", label: "Repaid over", min: 1, max: 10, step: 1, fmt: (v) => `${v} years` },
      { key: "taxPct", label: "Tax rate", min: 0, max: 35, step: 1, fmt: pct },
      { key: "payoutPct", label: "Dividend payout", min: 0, max: 80, step: 5, fmt: pct },
    ],
  },
];

const SHOCKS: { key: keyof Shocks; label: string; note: string }[] = [
  { key: "cedi", label: "Cedi falls 30%", note: "Imported inputs and equipment cost more" },
  { key: "rates", label: "Rates up 500 bp", note: "Every cedi borrowed costs more" },
  { key: "demand", label: "Demand down 20%", note: "Fewer packs sold every year" },
];

function Bars({ m }: { m: Model }) {
  const series = [
    { key: "revenue" as const, label: "Revenue", tone: "var(--foreground)" },
    { key: "ebitda" as const, label: "EBITDA", tone: "var(--accent)" },
    { key: "fcf" as const, label: "Free cash flow", tone: "#5fa8d3" },
  ];
  const vals = m.years.flatMap((y) => series.map((s) => y[s.key]));
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const H = 100;
  const zero = (max / (max - min)) * H;
  const y = (v: number) => zero - (v / (max - min)) * H;
  const r1 = (n: number) => Math.round(n * 10) / 10;
  return (
    <figure>
      {/* bars stretch to the box; labels stay HTML so text never distorts */}
      <svg viewBox={`0 0 500 ${H}`} preserveAspectRatio="none" className="w-full h-[180px] md:h-[220px]" role="img" aria-label="Revenue, EBITDA and free cash flow by year">
        <line x1="0" x2="500" y1={r1(zero)} y2={r1(zero)} stroke="var(--line-strong)" vectorEffect="non-scaling-stroke" />
        {m.years.map((yr, i) =>
          series.map((s, j) => {
            const v = yr[s.key];
            return (
              <motion.rect
                key={`${i}-${s.key}`}
                x={i * 100 + 20 + j * 21}
                width="18"
                fill={s.tone}
                initial={false}
                animate={{ attrY: r1(Math.min(y(v), zero)), height: r1(Math.max(0.5, Math.abs(y(v) - zero))) }}
                transition={{ type: "spring", stiffness: 200, damping: 26 }}
              >
                <title>{`Year ${yr.year} ${s.label}: GHS ${k(v)}k`}</title>
              </motion.rect>
            );
          }),
        )}
      </svg>
      <div className="grid grid-cols-5 text-center text-[12px] text-[var(--ink-3)] mt-1">
        {m.years.map((yr) => (
          <span key={yr.year}>Year {yr.year}</span>
        ))}
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-4 text-[12px] text-[var(--ink-3)]">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.tone }} />
            {s.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

export default function ThreeStatement() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [shocks, setShocks] = useState<Shocks>(NO_SHOCKS);
  const [tab, setTab] = useState<"income" | "balance" | "cash">("income");
  const m = useMemo(() => run(inputs, shocks), [inputs, shocks]);
  const base = useMemo(() => run(inputs), [inputs]);
  const breach = m.minDscr < COVENANT;
  const shocked = Object.values(shocks).some(Boolean);

  const rows = tab === "income" ? INCOME : tab === "balance" ? BALANCE : CASHFLOW;
  const y5 = m.years[4];

  const download = () => {
    const blob = new Blob([toCsv(m)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "harmattan-foods-three-statement.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    emit("finance", "model.exported", "CSV");
  };

  const kpis = [
    { label: "Revenue, year 5", value: m1(y5.revenue), was: shocked ? m1(base.years[4].revenue) : null },
    { label: "EBITDA margin, year 5", value: `${((y5.ebitda / y5.revenue) * 100).toFixed(1)}%`, was: shocked ? `${((base.years[4].ebitda / base.years[4].revenue) * 100).toFixed(1)}%` : null },
    { label: "Cash, year 5", value: m1(y5.cash), was: shocked ? m1(base.years[4].cash) : null },
    { label: "Revolver drawn, peak", value: m1(Math.max(...m.years.map((y) => y.revolver))), was: null },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
      {/* inputs */}
      <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-white">Assumptions</p>
          <button type="button" onClick={() => { setInputs(DEFAULTS); setShocks(NO_SHOCKS); }} className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--ink-3)] hover:text-white">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
        {GROUPS.map((g) => (
          <fieldset key={g.title} className="mt-5">
            <legend className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--ink-3)]">{g.title}</legend>
            <div className="mt-2 space-y-3">
              {g.fields.map((f) => (
                <label key={f.key} className="block">
                  <span className="flex justify-between gap-2 text-[13px]">
                    <span className="text-[var(--ink-2)]">{f.label}</span>
                    <span className="tabular-nums text-white">{f.fmt(inputs[f.key])}</span>
                  </span>
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={inputs[f.key]}
                    onChange={(e) => setInputs((x) => ({ ...x, [f.key]: Number(e.target.value) }))}
                    className="mt-1 w-full accent-[var(--accent)]"
                  />
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </aside>

      <div className="min-w-0 space-y-6">
        {/* shocks and the two checks */}
        <div className="rounded-2xl border border-[var(--line-strong)] p-4">
          <p className="text-[13px] text-[var(--ink-3)]">Stress it</p>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SHOCKS.map((s) => {
              const on = shocks[s.key];
              return (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setShocks((x) => ({ ...x, [s.key]: !on }));
                    if (!on) emit("finance", "shock.applied", s.label);
                  }}
                  className={`text-left rounded-xl border px-3.5 py-3 transition-colors ${on ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--line-strong)] hover:border-[var(--ink-4)]"}`}
                >
                  <span className="block text-[14px] font-medium text-white">{s.label}</span>
                  <span className="block text-[12px] text-[var(--ink-3)]">{s.note}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p className={`flex items-center gap-2 rounded-xl px-3.5 py-3 text-[13.5px] ${m.balances ? "bg-[var(--success)]/10 text-white" : "bg-red-500/10 text-red-500"}`}>
              <Check className="w-4 h-4 text-[var(--success)]" />
              Assets equal liabilities plus equity in all five years.
            </p>
            <p className={`flex items-center gap-2 rounded-xl px-3.5 py-3 text-[13.5px] ${breach ? "bg-[var(--accent)]/12 text-white" : "bg-[var(--success)]/10 text-white"}`}>
              {breach ? <TriangleAlert className="w-4 h-4 text-[var(--accent)]" /> : <Check className="w-4 h-4 text-[var(--success)]" />}
              Lowest DSCR {Number.isFinite(m.minDscr) ? `${m.minDscr.toFixed(2)}x` : "n/a"}: {breach ? `below the ${COVENANT}x covenant` : `above the ${COVENANT}x covenant`}.
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((x) => (
            <div key={x.label} className="rounded-xl border border-[var(--line)] p-3.5">
              <dt className="text-[12px] text-[var(--ink-3)]">{x.label}</dt>
              <dd className="mt-1 font-display text-[22px] text-white tabular-nums">{x.value}</dd>
              {x.was && <dd className="text-[11.5px] text-[var(--ink-4)] tabular-nums">was {x.was}</dd>}
            </div>
          ))}
        </dl>

        <div className="rounded-2xl border border-[var(--line-strong)] p-4">
          <Bars m={m} />
        </div>

        <div className="rounded-2xl border border-[var(--line-strong)] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 border-b border-[var(--line)]">
            <div className="flex gap-1" role="tablist" aria-label="Statement">
              {([
                ["income", "Income", " statement"],
                ["balance", "Balance", " sheet"],
                ["cash", "Cash", " flow"],
              ] as const).map(([id, a, b]) => (
                <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`h-9 px-3 rounded-lg text-[13px] whitespace-nowrap ${tab === id ? "bg-white text-black" : "text-[var(--ink-2)] hover:text-white"}`}>
                  {a}
                  <span className={id === "cash" ? "" : "hidden sm:inline"}>{b}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={download} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[var(--line-strong)] text-[13px] text-white">
              <Download className="w-4 h-4" /> CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-[13px] tabular-nums">
              <thead>
                <tr className="text-[var(--ink-3)] text-[12px]">
                  <th className="text-left font-normal px-4 py-2">GHS thousands</th>
                  {m.years.map((y) => (
                    <th key={y.year} className="text-right font-normal px-4 py-2">Year {y.year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className={`border-t border-[var(--line)] ${r.strong ? "text-white font-medium" : "text-[var(--ink-2)]"}`}>
                    <td className="px-4 py-2 text-left">{r.label}</td>
                    {m.years.map((y) => (
                      <td key={y.year} className="px-4 py-2 text-right">{k(shown(r, y))}</td>
                    ))}
                  </tr>
                ))}
                {tab === "balance" && (
                  <tr className="border-t border-[var(--line)] text-[var(--ink-3)]">
                    <td className="px-4 py-2 text-left">Check: assets less liabilities and equity</td>
                    {m.years.map((y) => (
                      <td key={y.year} className="px-4 py-2 text-right">{Math.abs(y.check) < 0.5 ? "0" : k(y.check)}</td>
                    ))}
                  </tr>
                )}
                {tab === "cash" && (
                  <tr className="border-t border-[var(--line)] text-[var(--ink-3)]">
                    <td className="px-4 py-2 text-left">DSCR</td>
                    {m.years.map((y) => (
                      <td key={y.year} className={`px-4 py-2 text-right ${y.dscr < COVENANT ? "text-[var(--accent)]" : ""}`}>
                        {Number.isFinite(y.dscr) ? `${y.dscr.toFixed(2)}x` : "n/a"}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
