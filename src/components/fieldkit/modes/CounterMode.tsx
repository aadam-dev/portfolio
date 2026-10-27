"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cedi, emit } from "../events";
import { EASE_OUT } from "@/lib/motion";

const CATALOGUE = [
  { id: "cement", name: "Cement 50kg", price: 95, stock: 42, tone: "#9C9384" },
  { id: "pipe", name: "PVC pipe 4in", price: 60, stock: 18, tone: "#4E7FA8" },
  { id: "sheet", name: "Roofing sheet", price: 120, stock: 9, tone: "#B4552F" },
  { id: "rods", name: "Iron rod 12mm", price: 88, stock: 30, tone: "#5A5550" },
  { id: "paint", name: "Emulsion 20L", price: 340, stock: 6, tone: "#E8B23A" },
  { id: "tiles", name: "Floor tile m²", price: 75, stock: 64, tone: "#C9B79C" },
] as const;

type ItemId = (typeof CATALOGUE)[number]["id"];

export interface Receipt {
  no: number;
  lines: { name: string; qty: number; total: number }[];
  total: number;
}

export default function CounterMode({ onPrint }: { onPrint: (r: Receipt) => void }) {
  const reduce = useReducedMotion();
  const [basket, setBasket] = useState<Partial<Record<ItemId, number>>>({});
  const [stock, setStock] = useState<Record<ItemId, number>>(
    () => Object.fromEntries(CATALOGUE.map((c) => [c.id, c.stock])) as Record<ItemId, number>,
  );
  const [receiptNo, setReceiptNo] = useState(41);

  const lines = CATALOGUE.filter((c) => basket[c.id]).map((c) => ({
    id: c.id,
    name: c.name,
    qty: basket[c.id]!,
    total: basket[c.id]! * c.price,
  }));
  const total = lines.reduce((s, l) => s + l.total, 0);

  const add = (id: ItemId) => {
    const inBasket = basket[id] ?? 0;
    if (inBasket >= stock[id]) return;
    setBasket((b) => ({ ...b, [id]: inBasket + 1 }));
    const item = CATALOGUE.find((c) => c.id === id)!;
    emit("pos", "basket.add", `${item.name} × ${inBasket + 1}`);
  };

  const charge = () => {
    if (!lines.length) return;
    const no = receiptNo + 1;
    setReceiptNo(no);
    setStock((s) => {
      const next = { ...s };
      lines.forEach((l) => (next[l.id] = s[l.id] - l.qty));
      return next;
    });
    emit("pos", "sale.completed", `#${String(no).padStart(4, "0")} · ${cedi(total)}`);
    lines.forEach((l) => emit("pos", "stock.decrement", `${l.name} −${l.qty}`));
    onPrint({ no, lines: lines.map(({ name, qty, total }) => ({ name, qty, total })), total });
    setBasket({});
  };

  return (
    <div className="grid grid-cols-[1.35fr_1fr] gap-3 h-full">
      {/* Catalogue */}
      <div className="grid grid-cols-2 gap-2 content-start">
        {CATALOGUE.map((c) => {
          const left = stock[c.id] - (basket[c.id] ?? 0);
          return (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => add(c.id)}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              disabled={left <= 0}
              className="group relative text-left rounded-[10px] bg-[#1A1814] hover:bg-[#221F1A] border border-white/[0.06] p-2.5 transition-colors disabled:opacity-35"
            >
              <span
                className="block w-5 h-5 rounded-[5px] mb-2"
                style={{ background: c.tone }}
                aria-hidden="true"
              />
              <span className="block text-[11.5px] leading-tight text-[#F2EEE6]">{c.name}</span>
              <span className="mt-1 flex items-baseline justify-between font-mono text-[10px] text-white/45 tabular-nums">
                <span>{c.price}.00</span>
                <span className={left <= 3 ? "text-[#E8B23A]" : ""}>{left} left</span>
              </span>
              {basket[c.id] ? (
                <motion.span
                  key={basket[c.id]}
                  initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-2 right-2 min-w-5 h-5 px-1 rounded-full bg-[#E8B23A] text-[#14100A] font-mono text-[10px] font-semibold grid place-items-center"
                >
                  {basket[c.id]}
                </motion.span>
              ) : null}
            </motion.button>
          );
        })}
      </div>

      {/* Basket */}
      <div className="flex flex-col rounded-[10px] bg-[#13120F] border border-white/[0.06] p-3 min-h-0">
        <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">
          <span>Basket</span>
          <span>#{String(receiptNo + 1).padStart(4, "0")}</span>
        </div>
        <div className="mt-2 flex-1 min-h-0 overflow-hidden">
          {lines.length === 0 ? (
            <p className="text-[11px] text-white/35 leading-relaxed mt-3">
              Tap items to ring them up.
            </p>
          ) : (
            <ul className="space-y-1.5">
              <AnimatePresence initial={false}>
                {lines.map((l) => (
                  <motion.li
                    key={l.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                    className="flex justify-between gap-2 text-[11px] text-white/80"
                  >
                    <span className="truncate">
                      <span className="font-mono text-white/40">{l.qty}×</span> {l.name}
                    </span>
                    <span className="font-mono tabular-nums">{l.total}.00</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
        <div className="pt-2 mt-2 border-t border-dashed border-white/10 flex items-baseline justify-between">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">Total</span>
          <span className="font-mono text-[15px] text-[#F2EEE6] tabular-nums">{cedi(total)}</span>
        </div>
        <button
          type="button"
          onClick={charge}
          disabled={!lines.length}
          className="mt-2.5 h-9 rounded-[8px] bg-[#E8B23A] text-[#14100A] text-[12px] font-semibold tracking-wide disabled:bg-white/[0.07] disabled:text-white/30 transition-colors"
        >
          Charge &amp; print
        </button>
      </div>
    </div>
  );
}
