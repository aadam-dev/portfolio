"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { emit, tally } from "../events";
import { EASE_OUT } from "@/lib/motion";

type Unit = "g" | "ml" | "btl";

interface Sku {
  id: string;
  name: string;
  unit: Unit;
  pack: string;
  perPack: number;
  cap: number;
  reorder: number;
}

// Supplier packs convert to the unit the kitchen counts in (Delish on Odoo 19).
const SKUS: Sku[] = [
  { id: "rice", name: "Jasmine rice", unit: "g", pack: "sack 25kg", perPack: 25000, cap: 25000, reorder: 15000 },
  { id: "chicken", name: "Chicken thigh", unit: "g", pack: "box 10kg", perPack: 10000, cap: 10000, reorder: 5000 },
  { id: "oil", name: "Vegetable oil", unit: "ml", pack: "gallon 4.5L", perPack: 4500, cap: 9000, reorder: 3000 },
  { id: "tomato", name: "Tomato paste", unit: "g", pack: "carton 24×400g", perPack: 9600, cap: 9600, reorder: 2400 },
  { id: "water", name: "Bottled water", unit: "btl", pack: "kirk = 53 btl", perPack: 53, cap: 106, reorder: 40 },
];

const START: Record<string, number> = { rice: 18000, chicken: 6400, oil: 5200, tomato: 4100, water: 52 };

const BOM = { rice: 220, chicken: 250, oil: 35, tomato: 60, water: 1 } as Record<string, number>;
const DISH = { name: "Jollof + chicken + water", price: 95 };

const fmt = (n: number, u: Unit) =>
  u === "btl" ? `${Math.round(n)} btl` : n >= 1000 ? `${(n / 1000).toFixed(1)} ${u === "g" ? "kg" : "L"}` : `${Math.round(n)} ${u}`;

interface Po {
  no: number;
  sku: string;
  packs: number;
}
interface CountRow {
  id: string;
  system: number;
  counted: number;
}

export default function LedgerMode() {
  const reduce = useReducedMotion();
  const [stock, setStock] = useState<Record<string, number>>(START);
  const [sold, setSold] = useState(0);
  const [burst, setBurst] = useState(0);
  const [pos, setPos] = useState<Po[]>([]);
  const [poNo, setPoNo] = useState(7);
  const [view, setView] = useState<"stock" | "count">("stock");
  const [count, setCount] = useState<CountRow[] | null>(null);
  const [reconciled, setReconciled] = useState(false);

  const sell = (n: number) => {
    const next = { ...stock };
    for (const id of Object.keys(BOM)) next[id] = Math.max(0, next[id] - BOM[id] * n);
    if (SKUS.some((s) => next[s.id] <= 0)) return;
    setStock(next);
    setSold((s) => s + n);
    setBurst((b) => b + 1);
    tally("ledger.dishes", n);
    emit("ledger", "pos.sold", `${n}× ${DISH.name} · GHS ${(DISH.price * n).toFixed(2)}`);
    emit("ledger", "bom.exploded", SKUS.map((s) => `${s.id} −${fmt(BOM[s.id] * n, s.unit)}`).join(", "));

    // Reorder points draft a purchase order in supplier packs.
    let no = poNo;
    const drafted: Po[] = [];
    for (const s of SKUS) {
      const open = pos.some((p) => p.sku === s.id);
      if (!open && next[s.id] < s.reorder) {
        no += 1;
        const packs = Math.max(1, Math.ceil((s.cap - next[s.id]) / s.perPack));
        drafted.push({ no, sku: s.id, packs });
        emit("ledger", "po.drafted", `PO/${String(no).padStart(4, "0")} · ${packs} × ${s.pack} · ${s.name}`);
      }
    }
    if (drafted.length) {
      setPos((p) => [...drafted, ...p].slice(0, 4));
      setPoNo(no);
    }
  };

  const runCount = () => {
    // Shelf counts drift from the system: spillage, staff meals, a miscount.
    const rows = SKUS.map((s) => {
      const drift = s.unit === "btl" ? Math.round((Math.random() - 0.65) * 4) : Math.round((Math.random() - 0.6) * s.cap * 0.04);
      return { id: s.id, system: stock[s.id], counted: Math.max(0, stock[s.id] + drift) };
    });
    setCount(rows);
    setReconciled(false);
    setView("count");
    const off = rows.filter((r) => r.counted !== r.system).length;
    emit("ledger", "count.started", `${rows.length} SKUs · ${off} with variance`);
  };

  const reconcile = () => {
    if (!count) return;
    setStock((s) => {
      const next = { ...s };
      count.forEach((r) => (next[r.id] = r.counted));
      return next;
    });
    setReconciled(true);
    emit("ledger", "count.reconciled", `adjusted ${count.filter((r) => r.counted !== r.system).length} SKUs to shelf`);
  };

  const receive = (po: Po) => {
    const s = SKUS.find((x) => x.id === po.sku)!;
    setStock((st) => ({ ...st, [s.id]: st[s.id] + po.packs * s.perPack }));
    setPos((p) => p.filter((x) => x.no !== po.no));
    emit("ledger", "po.received", `PO/${String(po.no).padStart(4, "0")} · +${fmt(po.packs * s.perPack, s.unit)} ${s.name}`);
  };

  return (
    <div className="grid grid-cols-1 @[440px]:grid-cols-[200px_1fr] gap-3 h-full">
      {/* POS + BOM */}
      <div className="flex flex-col gap-2 min-w-0">
        <div className="rounded-[10px] bg-[#1A1814] border border-white/[0.06] p-2.5">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">Delish POS · combo</div>
          <div className="mt-1 text-[12.5px] text-[#F2EEE6] leading-tight">{DISH.name}</div>
          <div className="mt-0.5 font-mono text-[10px] text-white/45">GHS {DISH.price}.00 · sold {sold}</div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => sell(1)}
              className="h-8 rounded-[7px] bg-[var(--accent)] text-[var(--on-accent)] text-[11.5px] font-semibold"
            >
              Sell 1
            </button>
            <button
              type="button"
              onClick={() => sell(6)}
              className="h-8 rounded-[7px] border border-white/15 text-[11px] text-white/80 hover:border-white/40"
            >
              Lunch rush ×6
            </button>
          </div>
        </div>

        <div className="relative flex-1 rounded-[10px] bg-[#13120F] border border-white/[0.06] p-2.5 overflow-hidden">
          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">Bill of materials · per plate</div>
          <ul className="mt-1.5 space-y-[3px]">
            {SKUS.map((s, i) => (
              <li key={s.id} className="relative flex justify-between text-[10.5px] text-white/65">
                <span>{s.name}</span>
                <span className="font-mono text-white/45">{fmt(BOM[s.id], s.unit)}</span>
                <AnimatePresence>
                  {burst > 0 && (
                    <motion.span
                      key={burst}
                      className="absolute right-0 -top-0.5 font-mono text-[10px] text-[var(--accent)]"
                      initial={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                      animate={reduce ? { opacity: 0 } : { opacity: 0, x: 70 }}
                      transition={{ delay: i * 0.05, duration: 0.9, ease: EASE_OUT }}
                    >
                      −{fmt(BOM[s.id], s.unit)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={runCount}
            className="mt-2.5 w-full h-7 rounded-[7px] border border-white/15 font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/75 hover:border-white/40"
          >
            Run physical count
          </button>
        </div>
      </div>

      {/* Stock / count */}
      <div className="flex flex-col min-w-0 rounded-[10px] bg-[#13120F] border border-white/[0.06] p-2.5">
        <div className="flex items-center justify-between">
          <div role="group" aria-label="Ledger view" className="flex gap-1">
            {(["stock", "count"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => (v === "count" && !count ? runCount() : setView(v))}
                aria-pressed={view === v}
                className={`px-1.5 h-5 rounded font-mono text-[8.5px] uppercase tracking-[0.1em] ${
                  view === v ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                }`}
              >
                {v === "stock" ? "Stock on hand" : "Physical count"}
              </button>
            ))}
          </div>
          <span className="font-mono text-[8.5px] text-white/30">Odoo 19 · WH/Stock</span>
        </div>

        {view === "stock" ? (
          <>
            <ul className="mt-2.5 space-y-2.5">
              {SKUS.map((s) => {
                const pct = Math.min(100, (stock[s.id] / s.cap) * 100);
                const low = stock[s.id] < s.reorder;
                return (
                  <li key={s.id}>
                    <div className="flex justify-between text-[10.5px]">
                      <span className="text-white/75">
                        {s.name} <span className="font-mono text-[9px] text-white/30">{s.pack}</span>
                      </span>
                      <span className={`font-mono ${low ? "text-[var(--accent)]" : "text-white/55"}`}>{fmt(stock[s.id], s.unit)}</span>
                    </div>
                    <div className="relative mt-1 h-[6px] rounded-full bg-white/[0.06]">
                      <motion.span
                        className="absolute left-0 top-0 bottom-0 rounded-full"
                        style={{ background: low ? "var(--accent)" : "rgba(242,238,230,0.55)" }}
                        initial={false}
                        animate={{ width: `${pct}%` }}
                        transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT }}
                      />
                      <span
                        className="absolute -top-[3px] -bottom-[3px] w-px bg-white/40"
                        style={{ left: `${(s.reorder / s.cap) * 100}%` }}
                        title="Reorder point"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto pt-2">
              <AnimatePresence initial={false}>
                {pos.slice(0, 2).map((p) => {
                  const s = SKUS.find((x) => x.id === p.sku)!;
                  return (
                    <motion.div
                      key={p.no}
                      layout={!reduce}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="mt-1.5 flex items-center justify-between gap-2 rounded-[7px] border border-dashed border-[var(--accent)]/50 bg-[var(--accent)]/[0.07] px-2 py-1.5"
                    >
                      <span className="text-[10px] text-white/80 leading-tight min-w-0">
                        <span className="font-mono text-[var(--accent)]">PO/{String(p.no).padStart(4, "0")} draft</span> · {p.packs} × {s.pack}{" "}
                        <span className="text-white/45">{s.name}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => receive(p)}
                        className="shrink-0 px-2 h-6 rounded-[5px] bg-white/10 font-mono text-[9px] uppercase tracking-[0.08em] text-white hover:bg-white/20"
                      >
                        Receive
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {!pos.length && (
                <p className="text-[10px] text-white/30">Below the reorder line, a PO drafts itself in supplier packs.</p>
              )}
            </div>
          </>
        ) : (
          count && (
            <div className="mt-2 flex flex-col flex-1 min-h-0">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-white/35 text-right">
                    <th className="text-left font-normal pb-1">SKU</th>
                    <th className="font-normal pb-1">System</th>
                    <th className="font-normal pb-1">Shelf</th>
                    <th className="font-normal pb-1">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {count.map((r) => {
                    const s = SKUS.find((x) => x.id === r.id)!;
                    const v = r.counted - r.system;
                    const pct = r.system ? (v / r.system) * 100 : 0;
                    return (
                      <tr key={r.id} className="text-right text-white/70 font-mono">
                        <td className="text-left font-body py-[3px]">{s.name}</td>
                        <td>{fmt(r.system, s.unit)}</td>
                        <td>{fmt(r.counted, s.unit)}</td>
                        <td className={v === 0 ? "text-white/35" : v < 0 ? "text-[#fca5a5]" : "text-[#86efac]"}>
                          {v === 0 ? "0" : `${v > 0 ? "+" : "−"}${fmt(Math.abs(v), s.unit)}`}
                          <span className="text-white/30"> {v === 0 ? "" : `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-2 font-mono text-[9px] leading-relaxed text-white/40">
                variance = shelf − (opening + received − sold through BOM)
              </p>
              <button
                type="button"
                onClick={reconcile}
                disabled={reconciled}
                className="mt-auto h-8 rounded-[7px] bg-[var(--accent)] text-[var(--on-accent)] text-[11.5px] font-semibold disabled:bg-white/[0.07] disabled:text-[#86efac]"
              >
                {reconciled ? "Reconciled · stock matches the shelf" : "Reconcile to shelf"}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
