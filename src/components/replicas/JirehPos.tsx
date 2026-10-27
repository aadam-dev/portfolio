"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Check, Clock, Lock, Minus, Plus, Search, ShoppingCart, Smartphone, Star } from "lucide-react";
import { useAccraClock } from "@/components/fieldkit/clock";
import { emit } from "@/components/fieldkit/events";

/**
 * The Jireh Natural Foods register, rebuilt from the live system's menu:
 * the same 11 food items and prices, the same flow from tap to charge.
 */
type Item = { id: string; name: string; size?: string; price: number; img: string; popular?: boolean };

const IMG = (k: string) => `/replicas/jireh-${k}.webp`;
const FOOD: Item[] = [
  { id: "jr-s", name: "Jollof Rice", size: "Small", price: 40, img: IMG("jollof") },
  { id: "jr-m", name: "Jollof Rice", size: "Medium", price: 55, img: IMG("jollof"), popular: true },
  { id: "jr-l", name: "Jollof Rice", size: "Large", price: 65, img: IMG("jollof"), popular: true },
  { id: "af-s", name: "Asian Fried Rice", size: "Small", price: 40, img: IMG("asian") },
  { id: "af-m", name: "Asian Fried Rice", size: "Medium", price: 55, img: IMG("asian") },
  { id: "af-l", name: "Asian Fried Rice", size: "Large", price: 65, img: IMG("asian") },
  { id: "fc", name: "Fries with Chicken", price: 60, img: IMG("asian") },
  { id: "fu-m", name: "Fufu", size: "Medium", price: 50, img: IMG("fufu") },
  { id: "fu-l", name: "Fufu", size: "Large", price: 60, img: IMG("fufu"), popular: true },
  { id: "bk-m", name: "Banku", size: "Medium", price: 40, img: IMG("banku") },
  { id: "bk-l", name: "Banku", size: "Large", price: 50, img: IMG("banku") },
];

const CATS = [
  { id: "food", label: "Food", n: 11 },
  { id: "juices", label: "Juices", n: 4 },
  { id: "snacks", label: "Snacks", n: 2 },
] as const;

const MODES = ["Dine In", "Takeaway", "Delivery"] as const;
const ghs = (n: number) => `GH₵ ${n.toFixed(2)}`;

type Pay = null | { step: "method" } | { step: "cash"; tendered: number } | { step: "done"; method: string; order: number; change: number };

export default function JirehPos() {
  const time = useAccraClock();
  const [cat, setCat] = useState<(typeof CATS)[number]["id"]>("food");
  const [q, setQ] = useState("");
  const [lines, setLines] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<(typeof MODES)[number]>("Takeaway");
  const [pay, setPay] = useState<Pay>(null);
  const [orderNo, setOrderNo] = useState(118);
  const [open, setOpen] = useState(false);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return FOOD.filter((i) => !s || `${i.name} ${i.size ?? ""}`.toLowerCase().includes(s));
  }, [q]);

  const items = FOOD.filter((i) => lines[i.id]);
  const count = items.reduce((a, i) => a + lines[i.id], 0);
  const total = items.reduce((a, i) => a + i.price * lines[i.id], 0);

  const add = (id: string, d: number) =>
    setLines((l) => {
      const n = Math.max(0, (l[id] ?? 0) + d);
      const next = { ...l, [id]: n };
      if (!n) delete next[id];
      return next;
    });

  const finish = (method: string, change: number) => {
    setPay({ step: "done", method, order: orderNo, change });
    emit("pos", "sale.rung", `Jireh ${ghs(total)} ${method}`);
  };

  const reset = () => {
    setLines({});
    setPay(null);
    setOpen(false);
    setOrderNo((n) => n + 1);
  };

  const order = (
    <div className="flex flex-col h-full w-full min-h-0">
      <div className="flex items-center gap-2 px-4 h-12 border-b border-white/10 shrink-0">
        <ShoppingCart className="w-4 h-4 text-[#4ade80]" />
        <span className="font-semibold text-[14px]">Order</span>
        {count > 0 && <span className="ml-auto text-[12px] text-white/50">{count} item{count === 1 ? "" : "s"}</span>}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {items.length === 0 ? (
          <div className="h-full grid place-items-center text-center text-white/45 text-[13px] p-6">
            <div>
              <ShoppingCart className="w-6 h-6 mx-auto mb-2 opacity-60" />
              Tap items to add
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-tight truncate">
                    {i.name}
                    {i.size && <span className="text-white/50"> {i.size}</span>}
                  </p>
                  <p className="text-[12px] text-[#4ade80] tabular-nums">{ghs(i.price * lines[i.id])}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button type="button" aria-label={`Remove one ${i.name}`} onClick={() => add(i.id, -1)} className="w-7 h-7 rounded-md bg-white/5 grid place-items-center hover:bg-white/10">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-[13px] tabular-nums">{lines[i.id]}</span>
                  <button type="button" aria-label={`Add one ${i.name}`} onClick={() => add(i.id, 1)} className="w-7 h-7 rounded-md bg-white/5 grid place-items-center hover:bg-white/10">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="shrink-0 border-t border-white/10 p-3 space-y-2.5">
        <p className="flex items-center gap-1.5 text-[11px] text-[#4ade80]/90">
          <Lock className="w-3 h-3" /> Shift open
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`h-9 rounded-lg border text-[12.5px] ${mode === m ? "border-[#22c55e]/60 bg-[#14532d]/60 text-[#4ade80]" : "border-white/10 text-white/75 hover:bg-white/5"}`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 h-12">
          <span className="text-[12px] tracking-[0.12em] text-white/60">TOTAL</span>
          <span className="text-[20px] font-semibold text-[#4ade80] tabular-nums">{ghs(total)}</span>
        </div>
        <button
          type="button"
          disabled={!count}
          onClick={() => setPay({ step: "method" })}
          className="w-full h-12 rounded-lg bg-[#16a34a] text-white font-semibold text-[15px] disabled:bg-[#14532d] disabled:text-white/40 hover:bg-[#15803d] transition-colors"
        >
          Charge
        </button>
      </div>
    </div>
  );

  return (
    <div className="@container relative h-full w-full bg-[#0d0f0e] text-white font-sans select-none overflow-hidden">
      <div className="flex flex-col h-full">
        {/* top bar */}
        <header className="flex items-center gap-2.5 px-3 @[640px]:px-4 h-12 border-b border-white/10 shrink-0">
          <Image src="/replicas/jireh-logo.webp" alt="" width={28} height={28} className="rounded-md bg-white" />
          <span className="font-semibold text-[14px]">Jireh POS</span>
          <span className="hidden @[480px]:inline text-[12px] text-white/50">Cashier</span>
          <span className="ml-auto hidden @[480px]:flex items-center gap-1.5 font-mono text-[12px] text-white/70 tabular-nums">
            <Clock className="w-3.5 h-3.5" /> {time}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#22c55e]/50 bg-[#14532d]/50 text-[#4ade80] px-2.5 h-8 text-[12px] ml-auto @[480px]:ml-0">
            <Lock className="w-3.5 h-3.5" /> Shift Open
          </span>
        </header>

        <div className="flex flex-1 min-h-0">
          {/* menu */}
          <div className="flex-1 min-w-0 flex flex-col p-3 @[640px]:p-4 gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 h-10 shrink-0">
              <Search className="w-4 h-4 text-white/50" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setCat("food");
                }}
                placeholder="Search menu..."
                aria-label="Search menu"
                className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-white/40"
              />
            </label>
            <div className="flex gap-2 shrink-0">
              {CATS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={cat === c.id}
                  onClick={() => setCat(c.id)}
                  className={`h-9 px-3.5 rounded-lg border text-[13px] ${cat === c.id ? "border-[#22c55e]/60 bg-[#14532d]/60 text-[#4ade80]" : "border-white/10 text-white/80 hover:bg-white/5"}`}
                >
                  {c.label} <span className="opacity-60">({c.n})</span>
                </button>
              ))}
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1 pb-16 @[720px]:pb-1">
              {cat === "food" ? (
                <ul className="grid grid-cols-2 @[520px]:grid-cols-3 @[1000px]:grid-cols-4 gap-2.5">
                  {shown.map((i) => (
                    <li key={i.id}>
                      <button
                        type="button"
                        onClick={() => add(i.id, 1)}
                        className="relative w-full text-left rounded-xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-[#22c55e]/50 active:scale-[0.98] transition"
                      >
                        <div className="relative aspect-[16/8]">
                          <Image src={i.img} alt="" fill sizes="220px" className="object-cover" />
                          {i.popular && (
                            <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/55 grid place-items-center">
                              <Star className="w-3.5 h-3.5 fill-[#facc15] text-[#facc15]" />
                            </span>
                          )}
                          {lines[i.id] > 0 && (
                            <span className="absolute top-1.5 left-1.5 min-w-6 h-6 px-1.5 rounded-full bg-[#16a34a] text-[12px] font-semibold grid place-items-center tabular-nums">
                              {lines[i.id]}
                            </span>
                          )}
                        </div>
                        <div className="px-3 py-2">
                          <p className="text-[13px] leading-tight truncate">{i.name}</p>
                          <p className="mt-0.5 flex flex-wrap items-baseline justify-between gap-x-2">
                            <span className="text-[12px] text-white/55">{i.size ?? "Regular"}</span>
                            <span className="text-[13.5px] font-semibold text-[#4ade80] tabular-nums whitespace-nowrap">{ghs(i.price)}</span>
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                  {shown.length === 0 && <li className="col-span-full text-[13px] text-white/50 py-8 text-center">No items match.</li>}
                </ul>
              ) : (
                <p className="text-[13px] text-white/50 py-10 text-center">
                  This replica carries the food menu only. Tap Food to keep ordering.
                </p>
              )}
            </div>
          </div>

          {/* order panel: a side column on wide screens */}
          <aside className="hidden @[720px]:flex w-[300px] shrink-0 border-l border-white/10 bg-black/20">{order}</aside>
        </div>
      </div>

      {/* order panel: a bottom bar and sheet on narrow screens */}
      <div className="@[720px]:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute bottom-3 left-3 right-3 h-12 rounded-xl bg-[#16a34a] text-white font-semibold text-[14px] flex items-center justify-between px-4 shadow-lg"
        >
          <span>{count ? `${count} item${count === 1 ? "" : "s"}` : "Order"}</span>
          <span className="tabular-nums">{ghs(total)}</span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-x-0 bottom-0 top-10 rounded-t-2xl bg-[#111413] border-t border-white/10 z-10 flex flex-col"
            >
              <button type="button" onClick={() => setOpen(false)} className="mx-auto mt-2 mb-1 h-1.5 w-10 rounded-full bg-white/25" aria-label="Close order" />
              <div className="flex-1 min-h-0">{order}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* payment */}
      <AnimatePresence>
        {pay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black/70 grid place-items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-[360px] rounded-2xl bg-[#141816] border border-white/10 p-5"
            >
              {pay.step === "method" && (
                <>
                  <p className="text-[12px] text-white/50">{mode} · Order #{orderNo}</p>
                  <p className="mt-1 text-[26px] font-semibold text-[#4ade80] tabular-nums">{ghs(total)}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setPay({ step: "cash", tendered: Math.ceil(total / 50) * 50 })} className="h-20 rounded-xl border border-white/10 hover:border-[#22c55e]/60 flex flex-col items-center justify-center gap-1.5 text-[13px]">
                      <Banknote className="w-5 h-5 text-[#4ade80]" /> Cash
                    </button>
                    <button type="button" onClick={() => finish("Mobile Money", 0)} className="h-20 rounded-xl border border-white/10 hover:border-[#22c55e]/60 flex flex-col items-center justify-center gap-1.5 text-[13px]">
                      <Smartphone className="w-5 h-5 text-[#facc15]" /> Mobile Money
                    </button>
                  </div>
                  <button type="button" onClick={() => setPay(null)} className="mt-3 w-full h-10 text-[13px] text-white/60 hover:text-white">
                    Back to order
                  </button>
                </>
              )}
              {pay.step === "cash" && (
                <>
                  <p className="text-[12px] text-white/50">Cash received</p>
                  <p className="mt-1 text-[26px] font-semibold tabular-nums">{ghs(pay.tendered)}</p>
                  <div className="mt-3 grid grid-cols-4 gap-1.5">
                    {[total, 100, 200, 500]
                      .filter((v, i, a) => v >= total && a.indexOf(v) === i)
                      .map((v) => (
                        <button key={v} type="button" onClick={() => setPay({ step: "cash", tendered: v })} className={`h-10 rounded-lg border text-[12.5px] tabular-nums ${pay.tendered === v ? "border-[#22c55e]/60 bg-[#14532d]/60 text-[#4ade80]" : "border-white/10 hover:bg-white/5"}`}>
                          {v === total ? "Exact" : v}
                        </button>
                      ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-white/5 px-3 h-11 text-[13px]">
                    <span className="text-white/60">Change</span>
                    <span className="font-semibold tabular-nums">{ghs(pay.tendered - total)}</span>
                  </div>
                  <button type="button" onClick={() => finish("Cash", pay.tendered - total)} className="mt-3 w-full h-12 rounded-lg bg-[#16a34a] font-semibold">
                    Complete sale
                  </button>
                </>
              )}
              {pay.step === "done" && (
                <div className="text-center">
                  <span className="mx-auto w-12 h-12 rounded-full bg-[#16a34a] grid place-items-center">
                    <Check className="w-6 h-6" />
                  </span>
                  <p className="mt-3 font-semibold">Order #{pay.order} paid</p>
                  <p className="mt-1 text-[13px] text-white/60">
                    {ghs(total)} by {pay.method}
                    {pay.change > 0 && `, change ${ghs(pay.change)}`}. {mode}.
                  </p>
                  <button type="button" onClick={reset} className="mt-4 w-full h-11 rounded-lg bg-white text-black font-semibold text-[14px]">
                    New order
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
