"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bell, Minus, Plus, Search, Volume2, VolumeX } from "lucide-react";
import { emit } from "../events";
import { usePrinter } from "../Receipt";
import { ALBOYUT } from "../items";

type Item = (typeof ALBOYUT.items)[number];
type ItemId = Item["id"];
interface Ticket {
  code: string;
  lines: { id: ItemId; name: string; qty: number; total: number }[];
  total: number;
}

const ORANGE = "#c2410c";
const SP = ALBOYUT.salesperson;
const money = (n: number) => `GHS ${n.toFixed(2)}`;
const code = () => {
  const r = (n: number) => Array.from({ length: n }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
  return `TKT-MT${r(6)}-${r(4)}`;
};

/** The cashier screen chimes, then says who raised the order (as in the real queue). */
function announce() {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      const t = ctx.currentTime + i * 0.16;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.55);
    });
    setTimeout(() => ctx.close().catch(() => {}), 1200);
    const u = new SpeechSynthesisUtterance(`New order from ${SP}.`);
    setTimeout(() => window.speechSynthesis.speak(u), 380);
  } catch {
    // no audio: the banner still shows
  }
}

export default function CounterMode() {
  const reduce = useReducedMotion();
  const print = usePrinter();
  const [cat, setCat] = useState<string>("all");
  const [cart, setCart] = useState<Partial<Record<ItemId, number>>>({});
  const [stock, setStock] = useState<Record<ItemId, number>>(
    () => Object.fromEntries(ALBOYUT.items.map((i) => [i.id, i.stock])) as Record<ItemId, number>,
  );
  const [queue, setQueue] = useState<Ticket[]>([]);
  const [sales, setSales] = useState(0);
  const [sound, setSound] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (bannerTimer.current && clearTimeout(bannerTimer.current)), []);

  const items = ALBOYUT.items.filter((i) => cat === "all" || i.cat === cat);
  const lines = ALBOYUT.items
    .filter((i) => cart[i.id])
    .map((i) => ({ id: i.id, name: i.name, qty: cart[i.id]!, total: cart[i.id]! * i.price }));
  const total = lines.reduce((a, l) => a + l.total, 0);
  const held = (id: ItemId) => queue.reduce((a, t) => a + (t.lines.find((l) => l.id === id)?.qty ?? 0), 0);
  const left = (id: ItemId) => stock[id] - (cart[id] ?? 0) - held(id);

  const add = (i: Item, d = 1) => {
    const q = (cart[i.id] ?? 0) + d;
    if (q < 0 || (d > 0 && left(i.id) <= 0)) return;
    setCart((c) => ({ ...c, [i.id]: q || undefined }));
    if (d > 0) emit("pos", "basket.add", `${i.name} × ${q}`);
  };

  const send = () => {
    if (!lines.length) return;
    const t = { code: code(), lines, total };
    setQueue((q) => [t, ...q].slice(0, 3));
    setCart({});
    emit("pos", "cashier.notified", `${t.code} · ${SP} → cashier · ${money(total)}`);
    setBanner(t.code);
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), 3000);
    if (sound) announce();
  };

  const collect = (t: Ticket) => {
    const next = { ...stock };
    t.lines.forEach((l) => (next[l.id] -= l.qty));
    setStock(next);
    setQueue((q) => q.filter((x) => x.code !== t.code));
    setSales((s) => s + 1);
    emit("pos", "sale.completed", `${t.code} · ${money(t.total)} · MoMo`);
    t.lines.forEach((l) => {
      if (next[l.id] <= ALBOYUT.alertAt) emit("pos", "stock.low", `${l.name} · ${next[l.id]} on hand, alert at ${ALBOYUT.alertAt}`);
    });
    print({
      logo: ALBOYUT.logo,
      head: "Al Boyut Building Materials",
      sub: `Lakeside Estate, Accra · ${t.code}`,
      lines: [...t.lines.map((l) => ({ l: `${l.qty} × ${l.name}`, r: l.total.toFixed(2) })), { l: "Tax (0%)", r: "0.00" }],
      total: { l: "Total", r: money(t.total) },
      foot: [`Raised by ${SP} · paid MoMo`, "Goods sold are counted. Thank you."],
    });
  };

  return (
    <div className="relative h-full flex flex-col bg-[#f8fafc] text-[#0f172a] font-body">
      {/* top bar, as on the live register */}
      <div className="shrink-0 h-[38px] flex items-center gap-2 px-2.5 bg-white border-b border-slate-200">
        <Image unoptimized src={ALBOYUT.logo} alt="" width={22} height={22} className="rounded-full" />
        <div className="leading-[1.1] min-w-0">
          <div className="text-[9.5px] font-extrabold tracking-[0.02em]">
            AL <span style={{ color: ORANGE }}>BOYUT</span>
          </div>
          <div className="text-[8.5px] text-slate-500 truncate">
            {SP} · {ALBOYUT.branch} · {sales} sale{sales === 1 ? "" : "s"}
          </div>
        </div>
        <span className="ml-auto font-mono text-[10px] font-semibold tabular-nums" style={{ color: ORANGE }}>
          {money(total)}
        </span>
        <button
          type="button"
          onClick={() => setSound((s) => !s)}
          aria-pressed={sound}
          aria-label={sound ? "Mute the cashier voice" : "Unmute the cashier voice"}
          className="w-6 h-6 grid place-items-center rounded-full border border-orange-200 bg-orange-50"
          style={{ color: ORANGE }}
        >
          {sound ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 @[400px]:grid-cols-[minmax(0,1fr)_152px]">
        {/* catalogue */}
        <div className="min-h-0 flex flex-col p-2 gap-1.5">
          <div className="flex items-center gap-1.5 h-[24px] rounded-[7px] border border-slate-200 bg-white px-2 text-[9px] text-slate-400">
            <Search className="w-3 h-3" /> Search products or scan barcode…
          </div>
          <div className="flex gap-1 overflow-x-auto scrollbar-none" role="group" aria-label="Category">
            {ALBOYUT.categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                aria-pressed={cat === c.id}
                className="shrink-0 h-[20px] px-2 rounded-full border text-[8.5px] whitespace-nowrap transition-colors"
                style={
                  cat === c.id
                    ? { background: "#fff7ed", borderColor: "#fdba74", color: ORANGE }
                    : { background: "#fff", borderColor: "#e2e8f0", color: "#475569" }
                }
              >
                {c.label} <span className="opacity-60">{c.count}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
            <div className="grid grid-cols-3 @[560px]:grid-cols-4 gap-1.5">
              {items.map((i) => {
                const n = left(i.id);
                const low = n <= ALBOYUT.alertAt;
                return (
                  <motion.button
                    key={i.id}
                    type="button"
                    onClick={() => add(i)}
                    whileTap={reduce ? undefined : { scale: 0.96 }}
                    disabled={n <= 0}
                    aria-label={`Add ${i.name}, ${money(i.price)}`}
                    className="relative text-left rounded-[9px] bg-white border border-slate-200 overflow-hidden disabled:opacity-45 hover:border-orange-300 transition-colors"
                  >
                    <span className="relative block aspect-square bg-white">
                      <Image unoptimized src={i.img} alt="" fill sizes="96px" className="object-contain p-0.5" />
                    </span>
                    <span className="block px-1.5 pt-1 pb-1.5">
                      <span className="block text-[8.5px] font-semibold leading-tight line-clamp-2 min-h-[2.2em]">{i.name}</span>
                      <span className="flex items-center justify-between mt-0.5">
                        <span className="text-[9px] font-bold tabular-nums" style={{ color: ORANGE }}>
                          {money(i.price)}
                        </span>
                        <span className={`text-[7.5px] tabular-nums ${low ? "font-semibold text-red-600" : "text-slate-400"}`}>
                          {low ? `Low ${n}` : n}
                        </span>
                      </span>
                    </span>
                    {cart[i.id] ? (
                      <motion.span
                        key={cart[i.id]}
                        initial={reduce ? false : { scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full text-white text-[8.5px] font-bold grid place-items-center"
                        style={{ background: "#ea580c" }}
                      >
                        {cart[i.id]}
                      </motion.span>
                    ) : null}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* cart + cashier queue */}
        <div className="min-h-0 flex flex-col border-t @[400px]:border-t-0 @[400px]:border-l border-slate-200 bg-white p-2">
          <div className="text-[9.5px] font-bold">Your Cart</div>
          <div className="mt-1 flex-1 min-h-[40px] overflow-y-auto scrollbar-none">
            {!lines.length ? (
              <p className="text-[8.5px] text-slate-400 mt-1">Tap products to add.</p>
            ) : (
              <ul className="space-y-1">
                {lines.map((l) => {
                  const item = ALBOYUT.items.find((x) => x.id === l.id)!;
                  return (
                    <li key={l.id} className="text-[8.5px]">
                      <div className="flex justify-between gap-1">
                        <span className="truncate font-medium">{l.name}</span>
                        <span className="tabular-nums">{l.total.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <button type="button" onClick={() => add(item, -1)} aria-label={`One less ${l.name}`} className="w-3.5 h-3.5 grid place-items-center rounded border border-slate-200">
                          <Minus className="w-2 h-2" />
                        </button>
                        <span className="tabular-nums w-3 text-center">{l.qty}</span>
                        <button type="button" onClick={() => add(item)} aria-label={`One more ${l.name}`} className="w-3.5 h-3.5 grid place-items-center rounded border border-slate-200">
                          <Plus className="w-2 h-2" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="border-t border-slate-200 pt-1 text-[8.5px] text-slate-500 space-y-px">
            <div className="flex justify-between">
              <span>Tax (0%)</span>
              <span>GHS 0.00</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-[#0f172a]">
              <span>Total</span>
              <span className="tabular-nums" style={{ color: ORANGE }}>
                {money(total)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={send}
            disabled={!lines.length}
            className="mt-1.5 h-[26px] rounded-[7px] text-white text-[9.5px] font-semibold disabled:opacity-40 transition-opacity"
            style={{ background: "#ea580c" }}
          >
            Send to cashier
          </button>

          <div className="mt-2 flex items-center gap-1 text-[8.5px] font-bold">
            Orders
            <span className="inline-flex items-center gap-0.5 px-1.5 rounded-full border border-orange-200 bg-orange-50 font-medium" style={{ color: ORANGE }}>
              <Bell className="w-2 h-2" /> {queue.length} to collect
            </span>
          </div>
          <div className="mt-1 space-y-1">
            <AnimatePresence initial={false}>
              {queue.map((t) => (
                <motion.div
                  key={t.code}
                  layout={!reduce}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="rounded-[6px] border border-orange-200 bg-orange-50/60 px-1.5 py-1"
                >
                  <div className="flex items-center gap-1">
                    <span className="px-1 rounded-[3px] bg-[#ea580c] text-white text-[6.5px] font-bold leading-[11px]">TO COLLECT</span>
                    <span className="ml-auto font-mono text-[8px] font-bold tabular-nums" style={{ color: ORANGE }}>
                      {money(t.total)}
                    </span>
                  </div>
                  <div className="font-mono text-[7.5px] font-semibold mt-0.5 truncate">{t.code}</div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[7.5px] text-slate-500 truncate">Walk-in · Pickup · {SP}</span>
                    <button type="button" onClick={() => collect(t)} className="shrink-0 px-1.5 h-[15px] rounded-[4px] bg-[#0f172a] text-white text-[7.5px] font-semibold">
                      Collect
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* cashier screen call-out */}
      <AnimatePresence>
        {banner && (
          <motion.div
            role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 420, damping: 32 }}
            className="absolute left-1/2 top-[44px] -translate-x-1/2 z-10"
          >
            <div className="flex items-center gap-2 rounded-full bg-[#0f172a] text-white pl-1.5 pr-3 py-1 shadow-xl whitespace-nowrap">
              <span className="w-5 h-5 rounded-full grid place-items-center text-[9px] font-bold" style={{ background: "#ea580c" }}>
                B
              </span>
              <span className="text-[9.5px] leading-tight">
                <span className="block font-semibold">New order from {SP}</span>
                <span className="block font-mono text-[7.5px] opacity-60">{banner}</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <span className="absolute bottom-0.5 left-2 text-[6.5px] text-slate-400 pointer-events-none">
        Live catalogue prices · sample stock
      </span>
    </div>
  );
}
