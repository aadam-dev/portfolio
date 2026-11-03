"use client";

import { useOsText } from "../l10n";
import { useMemo, useState } from "react";
import { BALANCE, CASHFLOW, DEFAULTS, INCOME, run, shown, toCsv, type Inputs, type Model } from "@/lib/model3";

type Sheet = "Inputs" | "Income" | "Balance sheet" | "Cash flow" | "Ratios";
const SHEETS: Sheet[] = ["Inputs", "Income", "Balance sheet", "Cash flow", "Ratios"];
const COLS = ["A", "B", "C", "D", "E", "F", "G"];

const INPUT_ROWS: { key: keyof Inputs; label: string; unit: string }[] = [
  { key: "units", label: "Packs sold, year 1", unit: "packs" },
  { key: "price", label: "Price per pack, year 1", unit: "GHS" },
  { key: "volumeGrowth", label: "Volume growth", unit: "% a year" },
  { key: "priceGrowth", label: "Price growth", unit: "% a year" },
  { key: "cogsPct", label: "Cost of goods", unit: "% of revenue" },
  { key: "opex", label: "Operating costs, year 1", unit: "GHS" },
  { key: "opexGrowth", label: "Operating cost growth", unit: "% a year" },
  { key: "capex", label: "Capital expenditure", unit: "GHS a year" },
  { key: "life", label: "Asset life", unit: "years" },
  { key: "arDays", label: "Receivable days", unit: "days" },
  { key: "invDays", label: "Inventory days", unit: "days" },
  { key: "apDays", label: "Payable days", unit: "days" },
  { key: "debt", label: "Term loan", unit: "GHS" },
  { key: "rate", label: "Interest rate", unit: "%" },
  { key: "term", label: "Loan term", unit: "years" },
  { key: "taxPct", label: "Tax rate", unit: "%" },
  { key: "payoutPct", label: "Dividend payout", unit: "% of profit" },
  { key: "minCash", label: "Minimum cash", unit: "GHS" },
];

/** The formula a cell would carry in the workbook, so the formula bar reads like a real model. */
const FORMULAS: Record<string, string> = {
  revenue: "=Inputs!B2*(1+Inputs!B4)^(n-1) * Inputs!B3*(1+Inputs!B5)^(n-1)",
  cogs: "=-{col}2*Inputs!B6",
  gross: "={col}2+{col}3",
  opex: "=-Inputs!B7*(1+Inputs!B8)^(n-1)",
  ebitda: "={col}4+{col}5",
  dep: "=-(opening PPE + capex)/Inputs!B10",
  ebit: "={col}6+{col}7",
  interest: "=-opening debt * Inputs!B15",
  pbt: "={col}8+{col}9",
  tax: "=-MAX(0,{col}10)*Inputs!B17",
  net: "={col}10+{col}11",
};

const fmt = (n: number) => (Number.isFinite(n) ? Math.round(n).toLocaleString("en-US") : "∞");
const neg = (n: number) => (n < 0 ? `(${fmt(-n)})` : fmt(n));

/**
 * Numbers: the five-year three-statement model from the Lab, as a workbook. Inputs are editable
 * and every statement recalculates; the balance sheet checks itself; the file downloads as .xlsx.
 */
export default function NumbersApp({ live }: { live: boolean }) {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [sheet, setSheet] = useState<Sheet>("Inputs");
  const [cell, setCell] = useState<{ ref: string; formula: string }>({ ref: "B2", formula: String(DEFAULTS.units) });
  const m = useMemo(() => run(inputs), [inputs]);
  const tab = live ? 0 : -1;
  const t = useOsText().numbers;

  const head = (
    <tr>
      <th className="w-10 border border-[#d9d6cf] bg-[#efede8]" />
      {COLS.slice(0, sheet === "Inputs" ? 3 : 6).map((c) => (
        <th key={c} className="border border-[#d9d6cf] bg-[#efede8] px-2 py-0.5 text-center text-[11px] font-normal text-black/50">
          {c}
        </th>
      ))}
    </tr>
  );
  const pick = (ref: string, formula: string) => () => setCell({ ref, formula });

  return (
    <div className="flex h-full flex-col bg-white text-[#1d1c1a]">
      {/* toolbar + formula bar */}
      <div className="flex items-center gap-2 border-b border-black/10 bg-[#f6f5f1] px-3 py-1.5 text-[12px]">
        <span className="font-semibold text-[#0f7a3b]">harmattan-model.xlsx</span>
        <span className="text-black/40">{t.company}</span>
        <span className={`ml-auto rounded px-2 py-0.5 text-[11px] ${m.balances ? "bg-[#e3f5e9] text-[#0f7a3b]" : "bg-[#fde8e8] text-[#b42318]"}`}>{m.balances ? t.balances : t.out}</span>
        <button tabIndex={tab} onClick={() => download(m)} className="rounded-md bg-[#0f7a3b] px-2.5 py-1 font-semibold text-white">
          {t.download}
        </button>
      </div>
      <div className="flex items-center gap-2 border-b border-black/10 px-3 py-1 font-mono text-[12px]">
        <span className="w-12 rounded border border-black/15 px-1.5 text-center text-black/60">{cell.ref}</span>
        <span className="text-black/40">ƒx</span>
        <span className="truncate">{cell.formula}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto" data-lenis-prevent>
        <table className="w-full border-collapse text-[12.5px] tabular-nums">
          <thead>{head}</thead>
          <tbody>
            {sheet === "Inputs" && (
              <>
                <tr>
                  <td className="border border-[#d9d6cf] bg-[#efede8] text-center text-[11px] text-black/45">1</td>
                  <td className="border border-[#e4e1db] px-2 py-1 font-semibold">Assumption</td>
                  <td className="border border-[#e4e1db] px-2 py-1 font-semibold">Value</td>
                  <td className="border border-[#e4e1db] px-2 py-1 font-semibold">Unit</td>
                </tr>
                {INPUT_ROWS.map((r, i) => (
                  <tr key={r.key}>
                    <td className="border border-[#d9d6cf] bg-[#efede8] text-center text-[11px] text-black/45">{i + 2}</td>
                    <td className="border border-[#e4e1db] px-2 py-1">{r.label}</td>
                    <td className="border border-[#e4e1db] bg-[#fffbe6] p-0" onClick={pick(`B${i + 2}`, String(inputs[r.key]))}>
                      <input
                        tabIndex={tab}
                        type="number"
                        value={inputs[r.key]}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (Number.isFinite(v)) {
                            setInputs((x) => ({ ...x, [r.key]: v }));
                            setCell({ ref: `B${i + 2}`, formula: String(v) });
                          }
                        }}
                        aria-label={r.label}
                        className="w-full bg-transparent px-2 py-1 text-right text-[#1d4ed8] outline-none focus:bg-[#e8f0ff]"
                      />
                    </td>
                    <td className="border border-[#e4e1db] px-2 py-1 text-black/50">{r.unit}</td>
                  </tr>
                ))}
              </>
            )}
            {(sheet === "Income" || sheet === "Balance sheet" || sheet === "Cash flow") && (
              <Statement m={m} rows={sheet === "Income" ? INCOME : sheet === "Balance sheet" ? BALANCE : CASHFLOW} income={sheet === "Income"} pick={pick} />
            )}
            {sheet === "Ratios" && <Ratios m={m} pick={pick} />}
          </tbody>
        </table>
      </div>

      <div className="flex border-t border-black/10 bg-[#f6f5f1] text-[12px]" role="tablist">
        {SHEETS.map((s) => (
          <button key={s} role="tab" aria-selected={sheet === s} tabIndex={tab} onClick={() => setSheet(s)} className={`border-r border-black/10 px-3 py-1.5 ${sheet === s ? "bg-white font-semibold text-[#0f7a3b]" : "text-black/60 hover:bg-white/60"}`}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Statement({ m, rows, income, pick }: { m: Model; rows: typeof INCOME; income: boolean; pick: (ref: string, f: string) => () => void }) {
  return (
    <>
      <tr>
        <td className="border border-[#d9d6cf] bg-[#efede8] text-center text-[11px] text-black/45">1</td>
        <td className="border border-[#e4e1db] px-2 py-1 font-semibold">GHS</td>
        {m.years.map((y) => (
          <td key={y.year} className="border border-[#e4e1db] px-2 py-1 text-right font-semibold">
            Year {y.year}
          </td>
        ))}
      </tr>
      {rows.map((r, i) => (
        <tr key={r.label} className={r.strong ? "bg-[#f7f6f2] font-semibold" : ""}>
          <td className="border border-[#d9d6cf] bg-[#efede8] text-center text-[11px] text-black/45">{i + 2}</td>
          <td className="border border-[#e4e1db] px-2 py-1">{r.label}</td>
          {m.years.map((y, k) => {
            const col = "BCDEF"[k];
            const v = shown(r, y);
            const f = income ? (FORMULAS[r.key] ?? String(Math.round(v))).replaceAll("{col}", col).replaceAll("(n-1)", `(${y.year - 1})`) : String(Math.round(v));
            return (
              <td key={y.year} onClick={pick(`${col}${i + 2}`, f)} className={`cursor-cell border border-[#e4e1db] px-2 py-1 text-right ${v < 0 ? "text-[#b42318]" : ""}`}>
                {neg(v)}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

function Ratios({ m, pick }: { m: Model; pick: (ref: string, f: string) => () => void }) {
  const rows: [string, (y: Model["years"][number]) => string, string][] = [
    ["Gross margin", (y) => `${((y.gross / y.revenue) * 100).toFixed(1)}%`, "=Income!{c}4/Income!{c}2"],
    ["EBITDA margin", (y) => `${((y.ebitda / y.revenue) * 100).toFixed(1)}%`, "=Income!{c}6/Income!{c}2"],
    ["Net margin", (y) => `${((y.net / y.revenue) * 100).toFixed(1)}%`, "=Income!{c}12/Income!{c}2"],
    ["Debt service cover (DSCR)", (y) => (Number.isFinite(y.dscr) ? `${y.dscr.toFixed(2)}x` : "no debt"), "=(EBITDA-tax)/(interest+principal)"],
    ["Free cash flow", (y) => neg(y.fcf), "=CFO-capex"],
    ["Net debt", (y) => neg(y.termDebt + y.revolver - y.cash), "=term loan + revolver - cash"],
    ["Balance check", (y) => y.check.toFixed(2), "=assets-(liabilities+equity)"],
  ];
  return (
    <>
      <tr>
        <td className="border border-[#d9d6cf] bg-[#efede8] text-center text-[11px] text-black/45">1</td>
        <td className="border border-[#e4e1db] px-2 py-1 font-semibold">Ratio</td>
        {m.years.map((y) => (
          <td key={y.year} className="border border-[#e4e1db] px-2 py-1 text-right font-semibold">
            Year {y.year}
          </td>
        ))}
      </tr>
      {rows.map(([label, f, formula], i) => (
        <tr key={label}>
          <td className="border border-[#d9d6cf] bg-[#efede8] text-center text-[11px] text-black/45">{i + 2}</td>
          <td className="border border-[#e4e1db] px-2 py-1">{label}</td>
          {m.years.map((y, k) => {
            const col = "BCDEF"[k];
            const warn = label.startsWith("Debt") && Number.isFinite(y.dscr) && y.dscr < 1.2;
            return (
              <td key={y.year} onClick={pick(`${col}${i + 2}`, formula.replaceAll("{c}", col))} className={`cursor-cell border border-[#e4e1db] px-2 py-1 text-right ${warn ? "bg-[#fde8e8] text-[#b42318]" : ""}`}>
                {f(y)}
              </td>
            );
          })}
        </tr>
      ))}
      <tr>
        <td className="border border-[#d9d6cf] bg-[#efede8]" />
        <td colSpan={6} className="border border-[#e4e1db] px-2 py-2 text-[11.5px] text-black/55">
          Red DSCR cells sit under 1.2x, the covenant a lender would set. Push the interest rate or the cost of goods on the Inputs sheet and watch it move.
        </td>
      </tr>
    </>
  );
}

/* ------------------------------------------------------------------ export */

type XLSX = {
  utils: { book_new: () => unknown; aoa_to_sheet: (rows: unknown[][]) => unknown; book_append_sheet: (wb: unknown, ws: unknown, name: string) => void };
  writeFile: (wb: unknown, name: string) => void;
};

/** SheetJS from cdnjs, only when someone asks for the file; a CSV if it can't load. */
async function download(m: Model) {
  const w = window as unknown as { XLSX?: XLSX };
  try {
    if (!w.XLSX)
      await new Promise<void>((ok, fail) => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        s.onload = () => ok();
        s.onerror = () => fail(new Error("xlsx"));
        document.head.appendChild(s);
      });
    const X = w.XLSX!;
    const wb = X.utils.book_new();
    const years = m.years.map((y) => `Year ${y.year}`);
    const block = (rows: typeof INCOME) => [["GHS", ...years], ...rows.map((r) => [r.label, ...m.years.map((y) => Math.round(shown(r, y)))])];
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([["Assumption", "Value", "Unit"], ...INPUT_ROWS.map((r) => [r.label, m.inputs[r.key], r.unit])]), "Inputs");
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(block(INCOME)), "Income");
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(block(BALANCE)), "Balance sheet");
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(block(CASHFLOW)), "Cash flow");
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([["Ratio", ...years], ["DSCR", ...m.years.map((y) => (Number.isFinite(y.dscr) ? +y.dscr.toFixed(2) : "n/a"))]]), "Ratios");
    X.writeFile(wb, "harmattan-model.xlsx");
  } catch {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([toCsv(m)], { type: "text/csv" }));
    a.download = "harmattan-model.csv";
    a.click();
  }
}
