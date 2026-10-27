"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { emit, tally } from "../events";
import { DELISH } from "../items";

type Unit = "g" | "ml" | "btl";
interface Sku {
  id: string;
  name: string;
  unit: Unit;
  pack: string;
  perPack: number;
  cap: number;
  min: number;
}

// Supplier packs convert to the unit the kitchen counts in, as configured on Delish's Odoo 19.
const SKUS: Sku[] = [
  { id: "rice", name: "Jasmine rice", unit: "g", pack: "Sack 25 kg", perPack: 25000, cap: 25000, min: 15000 },
  { id: "chicken", name: "Chicken thigh", unit: "g", pack: "Box 10 kg", perPack: 10000, cap: 10000, min: 5000 },
  { id: "oil", name: "Vegetable oil", unit: "ml", pack: "Gallon 4.5 L", perPack: 4500, cap: 9000, min: 3000 },
  { id: "tomato", name: "Tomato paste", unit: "g", pack: "Carton 24×400 g", perPack: 9600, cap: 9600, min: 2400 },
  { id: "water", name: "Bottled water", unit: "btl", pack: "Kirk (53 btl)", perPack: 53, cap: 106, min: 40 },
];
const START: Record<string, number> = { rice: 18000, chicken: 6400, oil: 5200, tomato: 4100, water: 52 };
// Per-plate recipe for the demo combo (illustrative quantities; the pack conversions are the real ones).
const BOM: Record<string, number> = { rice: 220, chicken: 250, oil: 35, tomato: 60, water: 1 };

const fmt = (n: number, u: Unit) =>
  u === "btl" ? `${Math.round(n)} Units` : n >= 1000 ? `${(n / 1000).toFixed(2)} ${u === "g" ? "kg" : "L"}` : `${Math.round(n)} ${u}`;

interface Rfq {
  no: number;
  sku: string;
  packs: number;
}
interface CountRow {
  id: string;
  system: number;
  counted: number;
}

const PURPLE = "#a26b94";
const APPS = [
  { id: "pos", label: "Point of Sale", x: 73.6, y: 16.8 },
  { id: "inventory", label: "Inventory", x: 64.2, y: 33 },
  { id: "mrp", label: "Manufacturing", x: 73.6, y: 33 },
  { id: "purchase", label: "Purchase", x: 54.7, y: 33 },
];

export default function LedgerMode() {
  const reduce = useReducedMotion();
  const [app, setApp] = useState<string | null>(null);
  const [stock, setStock] = useState<Record<string, number>>(START);
  const [sold, setSold] = useState(0);
  const [burst, setBurst] = useState(0);
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [rfqNo, setRfqNo] = useState(7);
  const [view, setView] = useState<"stock" | "count">("stock");
  const [count, setCount] = useState<CountRow[] | null>(null);
  const [applied, setApplied] = useState(false);
  const [moved, setMoved] = useState<string[]>([]);

  const open = (id: string) => {
    setApp(id);
    emit("ledger", "app.opened", `${APPS.find((a) => a.id === id)!.label} · Delish Services`);
  };

  const sell = (n: number) => {
    const next = { ...stock };
    for (const id of Object.keys(BOM)) next[id] = next[id] - BOM[id] * n;
    if (SKUS.some((s) => next[s.id] <= 0)) return;
    setStock(next);
    setSold((s) => s + n);
    setBurst((b) => b + 1);
    setMoved(SKUS.map((s) => s.id));
    tally("ledger.dishes", n);
    emit("ledger", "pos.sold", `${n} × ${DELISH.dish.name}`);
    emit("ledger", "bom.exploded", SKUS.map((s) => `${s.id} −${fmt(BOM[s.id] * n, s.unit)}`).join(", "));

    // Below the min quantity, a reordering rule drafts an RFQ in supplier packs.
    let no = rfqNo;
    const drafted: Rfq[] = [];
    for (const s of SKUS) {
      if (!rfqs.some((r) => r.sku === s.id) && next[s.id] < s.min) {
        no += 1;
        const packs = Math.max(1, Math.ceil((s.cap - next[s.id]) / s.perPack));
        drafted.push({ no, sku: s.id, packs });
        emit("ledger", "po.drafted", `P${String(no).padStart(5, "0")} · ${packs} × ${s.pack} · ${s.name}`);
      }
    }
    if (drafted.length) {
      setRfqs((r) => [...drafted, ...r].slice(0, 3));
      setRfqNo(no);
    }
  };

  const receive = (r: Rfq) => {
    const s = SKUS.find((x) => x.id === r.sku)!;
    setStock((st) => ({ ...st, [s.id]: st[s.id] + r.packs * s.perPack }));
    setRfqs((x) => x.filter((y) => y.no !== r.no));
    setMoved([s.id]);
    emit("ledger", "po.received", `P${String(r.no).padStart(5, "0")} · +${fmt(r.packs * s.perPack, s.unit)} ${s.name}`);
  };

  const runCount = () => {
    // Shelf counts drift: spillage, staff meals, a miscount.
    const rows = SKUS.map((s) => {
      const drift = s.unit === "btl" ? Math.round((Math.random() - 0.65) * 4) : Math.round((Math.random() - 0.6) * s.cap * 0.04);
      return { id: s.id, system: stock[s.id], counted: Math.max(0, stock[s.id] + drift) };
    });
    setCount(rows);
    setApplied(false);
    setView("count");
    emit("ledger", "count.started", `${rows.length} products · ${rows.filter((r) => r.counted !== r.system).length} with a difference`);
  };

  const apply = () => {
    if (!count) return;
    setStock((s) => {
      const next = { ...s };
      count.forEach((r) => (next[r.id] = r.counted));
      return next;
    });
    setApplied(true);
    emit("ledger", "count.reconciled", `applied ${count.filter((r) => r.counted !== r.system).length} adjustments to WH/Stock`);
  };

  if (!app) {
    return (
      <div className="absolute inset-0 bg-[#141826] grid place-items-center">
        <div className="relative w-full aspect-[16/9]">
          <Image unoptimized src={DELISH.launcher} alt="Delish Services on Odoo 19: the app launcher" fill sizes="600px" className="object-contain" />
          {APPS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => open(a.id)}
              aria-label={`Open ${a.label}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-[9%] h-[17%] rounded-[10px] hover:bg-white/10 transition-colors"
              style={{ left: `${a.x}%`, top: `${a.y + 2}%` }}
            >
              {(a.id === "pos" || a.id === "inventory") && !reduce && (
                <span className="absolute inset-0 rounded-[10px] ring-2 ring-[#ff5b1f] animate-pulse" />
              )}
            </button>
          ))}
        </div>
        <span className="absolute bottom-2 left-0 right-0 text-center text-[9px] text-white/50">Open Point of Sale or Inventory</span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-[#1d2130] text-[#d8dae3] font-body text-[10px]">
      {/* Odoo navbar */}
      <div className="h-[30px] shrink-0 flex items-center gap-3 px-2.5 bg-[#262a3b] border-b border-black/30">
        <button type="button" onClick={() => setApp(null)} aria-label="Back to apps" className="text-white/70 hover:text-white">
          <LayoutGrid className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-semibold text-white">Inventory</span>
        <span className="hidden @[480px]:flex gap-3 text-white/55">
          <span>Overview</span>
          <span>Operations</span>
          <span>Products</span>
          <span>Reporting</span>
        </span>
        <span className="ml-auto text-[8.5px] tracking-[0.06em] text-white/55">DELISH SERVICES</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none @[480px]:overflow-hidden grid grid-cols-1 @[480px]:grid-cols-[176px_1fr] gap-2 p-2">
        {/* POS order + BOM */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="rounded-[6px] bg-[#262a3b] border border-white/[0.06] overflow-hidden">
            <div className="relative h-[62px]">
              <Image unoptimized src={DELISH.dish.img} alt="" fill sizes="180px" className="object-cover" />
            </div>
            <div className="p-2">
              <div className="text-[8.5px] text-white/45">Point of Sale · Delish poolside</div>
              <div className="text-[10.5px] font-semibold text-white leading-tight">{DELISH.dish.name}</div>
              <div className="text-[8.5px] text-white/45">+ bottled water · {sold} sold today</div>
              <div className="mt-1.5 grid grid-cols-2 gap-1">
                <button type="button" onClick={() => sell(1)} className="h-[22px] rounded-[4px] text-white text-[9.5px] font-semibold" style={{ background: PURPLE }}>
                  Sell 1
                </button>
                <button type="button" onClick={() => sell(6)} className="h-[22px] rounded-[4px] border border-white/15 text-[9px] text-white/80 hover:bg-white/5">
                  Lunch rush ×6
                </button>
              </div>
            </div>
          </div>
          <div className="relative rounded-[6px] bg-[#262a3b] border border-white/[0.06] p-2 overflow-hidden">
            <div className="flex justify-between text-[8.5px] text-white/45">
              <span>Bill of Materials · Kit (phantom)</span>
            </div>
            <table className="mt-1 w-full text-[9px]">
              <tbody>
                {SKUS.map((s, i) => (
                  <tr key={s.id} className="relative">
                    <td className="py-[1.5px] text-white/80">{s.name}</td>
                    <td className="py-[1.5px] text-right tabular-nums text-white/55 relative">
                      {fmt(BOM[s.id], s.unit).replace(" Units", " Unit")}
                      <AnimatePresence>
                        {burst > 0 && (
                          <motion.span
                            key={burst}
                            className="absolute right-0 top-0 text-[#ff8a5c] font-semibold"
                            initial={{ opacity: 1, x: 0 }}
                            animate={{ opacity: 0, x: 60 }}
                            transition={{ delay: reduce ? 0 : i * 0.05, duration: reduce ? 0.2 : 0.9 }}
                          >
                            −{fmt(BOM[s.id], s.unit).replace(" Units", "")}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={runCount} className="mt-1.5 w-full h-[20px] rounded-[4px] border border-white/15 text-[9px] text-white/80 hover:bg-white/5">
              Physical Inventory: count now
            </button>
          </div>
        </div>

        {/* stock / count */}
        <div className="min-w-0 flex flex-col rounded-[6px] bg-[#262a3b] border border-white/[0.06]">
          <div className="flex items-center gap-1 px-2 pt-1.5 border-b border-white/[0.06]">
            {(
              [
                ["stock", "Stock on hand"],
                ["count", "Physical Inventory"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => (v === "count" && !count ? runCount() : setView(v))}
                aria-pressed={view === v}
                className={`px-1.5 pb-1 text-[9px] border-b-2 -mb-px ${view === v ? "text-white border-[#a26b94]" : "text-white/45 border-transparent"}`}
              >
                {label}
              </button>
            ))}
            <span className="ml-auto pb-1 text-[8px] text-white/35">WH/Stock</span>
          </div>

          {view === "stock" ? (
            <div className="flex-1 min-h-0 flex flex-col p-2">
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="text-white/40 text-left">
                    <th className="font-normal pb-1">Product</th>
                    <th className="font-normal pb-1 text-right">On Hand</th>
                    <th className="font-normal pb-1 text-right hidden @[480px]:table-cell">Min</th>
                  </tr>
                </thead>
                <tbody>
                  {SKUS.map((s) => {
                    const low = stock[s.id] < s.min;
                    return (
                      <tr key={s.id} className={`border-t border-white/[0.05] transition-colors ${moved.includes(s.id) ? "bg-white/[0.03]" : ""}`}>
                        <td className="py-1 pr-1">
                          <div className="text-white/85">{s.name}</div>
                          <div className="text-[8px] text-white/35">{s.pack}</div>
                          <div className="relative mt-0.5 h-[3px] rounded-full bg-white/[0.07]">
                            <motion.span
                              className="absolute left-0 top-0 bottom-0 rounded-full"
                              style={{ background: low ? "#ff8a5c" : "#7fb6a4" }}
                              initial={false}
                              animate={{ width: `${Math.min(100, (stock[s.id] / s.cap) * 100)}%` }}
                              transition={{ duration: reduce ? 0 : 0.6 }}
                            />
                          </div>
                        </td>
                        <td className={`py-1 text-right tabular-nums align-top ${low ? "text-[#ff8a5c]" : ""}`}>{fmt(stock[s.id], s.unit)}</td>
                        <td className="py-1 text-right tabular-nums align-top text-white/40 hidden @[480px]:table-cell">{fmt(s.min, s.unit)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-auto pt-1.5 space-y-1">
                <AnimatePresence initial={false}>
                  {rfqs.slice(0, 2).map((r) => {
                    const s = SKUS.find((x) => x.id === r.sku)!;
                    return (
                      <motion.div
                        key={r.no}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-2 rounded-[4px] border border-[#a26b94]/50 bg-[#a26b94]/10 px-1.5 py-1"
                      >
                        <span className="min-w-0 text-[8.5px] leading-tight">
                          <span className="font-semibold text-white">P{String(r.no).padStart(5, "0")}</span>{" "}
                          <span className="text-white/50">RFQ · Draft</span>
                          <br />
                          {r.packs} × {s.pack} · {s.name}
                        </span>
                        <button type="button" onClick={() => receive(r)} className="ml-auto shrink-0 px-1.5 h-[18px] rounded-[3px] text-white text-[8.5px]" style={{ background: PURPLE }}>
                          Confirm &amp; receive
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {!rfqs.length && <p className="text-[8.5px] text-white/35">Reordering rules draft an RFQ in supplier packs when a product drops below Min.</p>}
              </div>
            </div>
          ) : (
            count && (
              <div className="flex-1 min-h-0 flex flex-col p-2">
                <table className="w-full text-[9px]">
                  <thead>
                    <tr className="text-white/40 text-right">
                      <th className="text-left font-normal pb-1">Product</th>
                      <th className="font-normal pb-1">On Hand</th>
                      <th className="font-normal pb-1">Counted</th>
                      <th className="font-normal pb-1">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {count.map((r) => {
                      const s = SKUS.find((x) => x.id === r.id)!;
                      const v = r.counted - r.system;
                      return (
                        <tr key={r.id} className="border-t border-white/[0.05] text-right tabular-nums">
                          <td className="text-left py-1 text-white/85">{s.name}</td>
                          <td className="text-white/55">{fmt(r.system, s.unit)}</td>
                          <td>{fmt(r.counted, s.unit)}</td>
                          <td className={v === 0 ? "text-white/35" : v < 0 ? "text-[#fca5a5]" : "text-[#86efac]"}>
                            {v === 0 ? "0" : `${v > 0 ? "+" : "−"}${fmt(Math.abs(v), s.unit)}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="mt-1.5 text-[8.5px] text-white/40">Difference = counted − (on hand after sales through the BOM)</p>
                <button
                  type="button"
                  onClick={apply}
                  disabled={applied}
                  className="mt-auto h-[24px] rounded-[4px] text-white text-[9.5px] font-semibold disabled:bg-white/5 disabled:text-[#86efac]"
                  style={applied ? undefined : { background: PURPLE }}
                >
                  {applied ? "Applied · stock matches the shelf" : "Apply"}
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
