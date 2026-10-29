"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Banknote, Bell, Building2, Check, ChevronDown, CreditCard, Minus, Plus, ScanLine, Search, ShoppingCart, Smartphone, Trash2, Volume2, VolumeX } from "lucide-react";
import { emit } from "../events";
import { usePrinter } from "../Receipt";
import { ALBOYUT } from "../items";

/**
 * The Al Boyut register as it runs today (light theme): category rail,
 * product grid and cart for the salesperson; Orders, payment and receipt for
 * the cashier. Catalogue names and prices are public; the salesperson,
 * session and stock are sample values.
 */
type Item = (typeof ALBOYUT.items)[number];
type ItemId = Item["id"];
type Method = "Cash" | "Mobile Money" | "Card / Bank";
interface Ticket {
  code: string;
  lines: { id: ItemId; name: string; unit: string; price: number; qty: number }[];
  total: number;
  status: "to-collect" | "held" | "paid";
  fulfil: "Pickup" | "Delivery";
}

const SP = ALBOYUT.salesperson;
const money = (n: number) => `GHS ${n.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const ticketCode = () => {
  const r = (n: number) => Array.from({ length: n }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
  return `TKT-${r(6)}`;
};
const sumOf = (t: Ticket["lines"]) => t.reduce((a, l) => a + l.qty * l.price, 0);

/** Two rising tones, then the cashier's screen says who punched the ticket and for how much. */
function announce(total: number) {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    [880, 1180].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.5);
    });
    setTimeout(() => ctx.close().catch(() => {}), 1200);
    const u = new SpeechSynthesisUtterance(`Sale ticket from ${SP}, ${Math.round(total)} cedis.`);
    setTimeout(() => window.speechSynthesis.speak(u), 700);
  } catch {
    // no audio: the banner and the bell still show
  }
}

function Brand() {
  return (
    <span className="shrink-0 w-[26px] h-[26px] rounded-[8px] border border-slate-200 bg-white shadow-sm grid place-items-center overflow-hidden">
      <Image unoptimized src={ALBOYUT.logo} alt="" width={20} height={20} />
    </span>
  );
}

export default function CounterMode() {
  const reduce = useReducedMotion();
  const print = usePrinter();
  const [view, setView] = useState<"register" | "orders">("register");
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<Partial<Record<ItemId, number>>>({});
  const [fulfil, setFulfil] = useState<Ticket["fulfil"]>("Pickup");
  const [stock, setStock] = useState<Record<ItemId, number>>(() => Object.fromEntries(ALBOYUT.items.map((i) => [i.id, i.stock])) as Record<ItemId, number>);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [chip, setChip] = useState<"all" | "to-collect" | "held" | "paid">("to-collect");
  const [picked, setPicked] = useState<string | null>(null);
  const [paying, setPaying] = useState<Ticket | null>(null);
  const [done, setDone] = useState<{ t: Ticket; method: Method; received: number } | null>(null);
  const [sales, setSales] = useState(0);
  const [sound, setSound] = useState(false);
  const [banner, setBanner] = useState<{ kind: "sent" | "held"; code: string } | null>(null);
  const [menu, setMenu] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const items = ALBOYUT.items.filter((i) => (cat === "all" || i.cat === cat) && (!q || i.name.toLowerCase().includes(q.toLowerCase())));
  const lines = ALBOYUT.items.filter((i) => cart[i.id]).map((i) => ({ id: i.id, name: i.name, unit: i.unit, price: i.price, qty: cart[i.id]! }));
  const total = sumOf(lines);
  const held = (id: ItemId) => tickets.filter((t) => t.status !== "paid").reduce((a, t) => a + (t.lines.find((l) => l.id === id)?.qty ?? 0), 0);
  const left = (id: ItemId) => stock[id] - (cart[id] ?? 0) - held(id);
  const waiting = tickets.filter((t) => t.status === "to-collect").length;
  const shown = useMemo(() => tickets.filter((t) => chip === "all" || t.status === chip), [tickets, chip]);
  const current = tickets.find((t) => t.code === picked) ?? shown[0] ?? null;

  const add = (i: Item, d = 1) => {
    const n = (cart[i.id] ?? 0) + d;
    if (n < 0 || (d > 0 && left(i.id) <= 0)) return;
    setCart((c) => ({ ...c, [i.id]: n || undefined }));
    if (d > 0) emit("pos", "basket.add", `${i.name} × ${n}`);
  };

  const flash = (b: { kind: "sent" | "held"; code: string }) => {
    setBanner(b);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setBanner(null), b.kind === "sent" ? 6000 : 9000);
  };

  const raise = (status: "to-collect" | "held") => {
    if (!lines.length) return;
    const t: Ticket = { code: ticketCode(), lines, total, status, fulfil };
    setTickets((all) => [t, ...all].slice(0, 6));
    setCart({});
    flash({ kind: status === "held" ? "held" : "sent", code: t.code });
    if (status === "to-collect") {
      emit("pos", "cashier.notified", `${t.code} · ${SP} → cashier · ${money(total)}`);
      if (sound) announce(total);
    }
  };

  const sendHeld = (t: Ticket) => {
    setTickets((all) => all.map((x) => (x.code === t.code ? { ...x, status: "to-collect" } : x)));
    emit("pos", "cashier.notified", `${t.code} · ${SP} → cashier · ${money(t.total)}`);
    if (sound) announce(t.total);
  };

  const complete = (t: Ticket, method: Method, received: number) => {
    const next = { ...stock };
    t.lines.forEach((l) => (next[l.id] -= l.qty));
    setStock(next);
    setTickets((all) => all.map((x) => (x.code === t.code ? { ...x, status: "paid" } : x)));
    setSales((s) => s + 1);
    setPaying(null);
    setDone({ t, method, received });
    emit("pos", "sale.completed", `${t.code} · ${money(t.total)} · ${method}`);
    t.lines.forEach((l) => {
      if (next[l.id] <= ALBOYUT.alertAt) emit("pos", "stock.low", `${l.name} · ${next[l.id]} on hand, alert at ${ALBOYUT.alertAt}`);
    });
  };

  const printReceipt = (d: NonNullable<typeof done>) =>
    print({
      logo: ALBOYUT.logo,
      head: "Al Boyut Building Materials",
      sub: `Accra · ${d.t.code}`,
      lines: [...d.t.lines.map((l) => ({ l: `${l.qty} × ${l.name}`, r: (l.qty * l.price).toFixed(2) })), { l: "Tax (0%)", r: "0.00" }],
      total: { l: "Total", r: money(d.t.total) },
      foot: [`Paid ${d.method}${d.method === "Cash" && d.received > d.t.total ? ` · change ${money(d.received - d.t.total)}` : ""}`, "Thank you for your purchase!"],
    });

  return (
    <div className="@container relative h-full flex flex-col bg-slate-50 text-slate-950 font-body select-none">
      {/* header */}
      <header className="shrink-0 h-[42px] flex items-center gap-2 px-2.5 bg-white border-b border-slate-200">
        <Brand />
        <div className="leading-[1.15] min-w-0">
          <div className="text-[7.5px] font-black uppercase tracking-wide">
            Al <span className="text-orange-600">Boyut</span>
          </div>
          <div className="text-[10px] font-semibold truncate">Signed in as {SP}</div>
          <div className="text-[7.5px] text-slate-500 truncate">
            {ALBOYUT.session} · {sales} sale{sales === 1 ? "" : "s"} · sample stock and staff
          </div>
        </div>
        <button
          type="button"
          onClick={() => setView((v) => (v === "orders" ? "register" : "orders"))}
          className="ml-auto relative inline-flex items-center gap-1 rounded-[9px] border border-slate-300 bg-white px-2 h-[24px] text-[9px] font-semibold hover:bg-slate-50"
        >
          {view === "orders" ? "Register" : "Orders"}
          {view === "register" && waiting > 0 && (
            <span className="min-w-[14px] h-[14px] px-1 rounded-full bg-orange-500 text-zinc-950 text-[8px] font-bold grid place-items-center">{waiting}</span>
          )}
        </button>
        <div className="relative">
          <button type="button" onClick={() => setMenu((m) => !m)} aria-expanded={menu} className="inline-flex items-center gap-0.5 rounded-[9px] border border-slate-300 bg-white px-2 h-[24px] text-[9px] font-semibold hover:bg-slate-50">
            Menu <ChevronDown className="w-2.5 h-2.5" />
          </button>
          {menu && (
            <div className="absolute right-0 top-[28px] z-30 w-[132px] rounded-[10px] border border-slate-200 bg-white p-1 shadow-xl text-[9px]">
              <button type="button" onClick={() => { setView("orders"); setMenu(false); }} className="block w-full text-left rounded-[6px] px-2 py-1.5 hover:bg-slate-100">Open Orders</button>
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  const paid = tickets.filter((t) => t.status === "paid");
                  print({ logo: ALBOYUT.logo, head: "Current sales", sub: ALBOYUT.session, lines: paid.length ? paid.map((t) => ({ l: t.code, r: t.total.toFixed(2) })) : [{ l: "No sales yet" }], total: { l: "Total", r: money(paid.reduce((a, t) => a + t.total, 0)) } });
                }}
                className="block w-full text-left rounded-[6px] px-2 py-1.5 hover:bg-slate-100"
              >
                Print current sales
              </button>
            </div>
          )}
        </div>
      </header>

      {/* queue banner */}
      <AnimatePresence>
        {banner && (
          <motion.div
            role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`shrink-0 mx-2.5 mt-1.5 flex items-center gap-2 rounded-[9px] border px-2.5 py-1 text-[9px] font-semibold ${banner.kind === "sent" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-amber-300 bg-amber-50 text-amber-800"}`}
          >
            {banner.kind === "sent" ? (
              <>
                Ticket {banner.code} sent to the cashier queue.
                <button type="button" onClick={() => { setView("orders"); setChip("to-collect"); setPicked(banner.code); setBanner(null); }} className="underline underline-offset-2">
                  Open Orders
                </button>
              </>
            ) : (
              <>Held. Send it to the cashier when ready.</>
            )}
            <button type="button" onClick={() => setBanner(null)} className="ml-auto text-[8px] tracking-wide opacity-70 hover:opacity-100">
              DISMISS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {view === "register" ? (
        <div className="flex-1 min-h-0 grid grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto] @[520px]:grid-rows-1 @[520px]:grid-cols-[88px_minmax(0,1fr)_172px]">
          {/* category rail (chips when narrow) */}
          <nav aria-label="Category" className="min-w-0 flex @[520px]:flex-col gap-1 overflow-x-auto @[520px]:overflow-visible scrollbar-none bg-white border-b @[520px]:border-b-0 @[520px]:border-r border-slate-200 p-1.5">
            {ALBOYUT.categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                aria-pressed={cat === c.id}
                className={`shrink-0 text-left rounded-[9px] border px-1.5 py-1 text-[8.5px] leading-tight transition-colors ${
                  cat === c.id ? "bg-orange-500/20 text-orange-700 border-orange-500/40 font-semibold" : "border-transparent text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="block">{c.label}</span>
                <span className="block text-[7.5px] opacity-60 tabular-nums">{c.count}</span>
              </button>
            ))}
          </nav>

          {/* catalogue */}
          <div className="min-h-0 flex flex-col p-2 gap-1.5">
            <div className="flex gap-1.5">
              <label className="flex-1 flex items-center gap-1.5 h-[26px] rounded-[9px] border border-slate-300 bg-slate-100 px-2 text-[9px]">
                <Search className="w-3 h-3 text-slate-400" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products or scan barcode…" className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-slate-400" aria-label="Search products" />
              </label>
              <span className="w-[26px] h-[26px] rounded-[9px] bg-orange-500 text-zinc-950 grid place-items-center" aria-hidden>
                <ScanLine className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
              {items.length ? (
                <div className="grid grid-cols-3 @[520px]:grid-cols-4 gap-1.5">
                  {items.map((i) => {
                    const n = left(i.id);
                    const inCart = cart[i.id];
                    return (
                      <motion.button
                        key={i.id}
                        type="button"
                        onClick={() => add(i)}
                        whileTap={reduce ? undefined : { scale: 0.96 }}
                        disabled={n <= 0 && !inCart}
                        aria-label={`Add ${i.name}, ${money(i.price)}`}
                        className={`relative text-left rounded-[12px] border overflow-hidden transition-colors disabled:opacity-45 ${inCart ? "bg-orange-100 border-orange-300" : "bg-white border-slate-200 hover:border-orange-300"}`}
                      >
                        <span className="relative block aspect-square bg-white">
                          <Image unoptimized src={i.img} alt="" fill sizes="96px" className="object-contain p-1" />
                          {n <= 0 ? (
                            <span className="absolute left-1 bottom-1 rounded-full bg-red-50 text-red-600 text-[7px] font-semibold px-1.5">Out of stock</span>
                          ) : n <= ALBOYUT.alertAt ? (
                            <span className="absolute left-1 bottom-1 rounded-full bg-orange-50 text-orange-700 text-[7px] font-semibold px-1.5">Low stock</span>
                          ) : null}
                        </span>
                        <span className="block px-1.5 pt-1 pb-1.5">
                          <span className="block text-[8.5px] font-semibold leading-tight line-clamp-2 min-h-[2.2em]">{i.name}</span>
                          <span className="block text-[7.5px] text-slate-500">per {i.unit}</span>
                          <span className="mt-0.5 flex items-center justify-between">
                            <span className="text-[9.5px] font-bold tabular-nums text-orange-600">{money(i.price)}</span>
                            <span className="w-[16px] h-[16px] rounded-[6px] bg-orange-500/20 text-orange-700 grid place-items-center">
                              <Plus className="w-2.5 h-2.5" />
                            </span>
                          </span>
                        </span>
                        {inCart ? (
                          <motion.span key={inCart} initial={reduce ? false : { scale: 0.5 }} animate={{ scale: 1 }} className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-orange-500 text-zinc-950 text-[8.5px] font-bold grid place-items-center">
                            {inCart}
                          </motion.span>
                        ) : null}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-6 text-center text-[9px] text-slate-400">No products match “{q}”.</p>
              )}
            </div>
          </div>

          {/* cart */}
          <aside className="min-h-0 flex flex-col bg-white border-t @[520px]:border-t-0 @[520px]:border-l border-slate-200 p-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              <ShoppingCart className="w-3 h-3" /> Your Cart
              {lines.length > 0 && <span className="rounded-full bg-orange-500 text-zinc-950 text-[8px] px-1.5">{lines.reduce((a, l) => a + l.qty, 0)}</span>}
              {lines.length > 0 && (
                <button type="button" onClick={() => setCart({})} className="ml-auto text-[8.5px] font-medium text-slate-500 hover:text-slate-900">
                  Clear
                </button>
              )}
            </div>
            <div className="mt-1.5 flex-1 min-h-[36px] overflow-y-auto scrollbar-none space-y-1">
              {!lines.length ? (
                <p className="text-[8.5px] text-slate-400 mt-1">Tap products to add</p>
              ) : (
                lines.map((l) => {
                  const item = ALBOYUT.items.find((x) => x.id === l.id)!;
                  return (
                    <div key={l.id} className="rounded-[10px] border border-slate-300 bg-slate-100 p-1.5">
                      <div className="flex items-start gap-1.5">
                        <span className="relative shrink-0 w-[22px] h-[22px] rounded-[6px] bg-white overflow-hidden">
                          <Image unoptimized src={item.img} alt="" fill sizes="24px" className="object-contain" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[8.5px] font-semibold leading-tight truncate">{l.name}</span>
                          <span className="block text-[7.5px] text-slate-500 tabular-nums">
                            {money(l.price)} / {l.unit}
                          </span>
                        </span>
                        <button type="button" onClick={() => add(item, -l.qty)} aria-label={`Remove ${l.name}`} className="text-slate-400 hover:text-red-600">
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <button type="button" onClick={() => add(item, -1)} aria-label={`One less ${l.name}`} className="w-[18px] h-[18px] rounded-[6px] bg-zinc-700 text-white grid place-items-center">
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="min-w-[22px] h-[18px] px-1 rounded-[6px] border border-orange-500/40 bg-orange-50 text-[8.5px] font-bold grid place-items-center tabular-nums">{l.qty}</span>
                        <button type="button" onClick={() => add(item)} aria-label={`One more ${l.name}`} className="w-[18px] h-[18px] rounded-[6px] bg-orange-500 text-zinc-950 grid place-items-center">
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                        <span className="ml-auto text-[9px] font-bold tabular-nums text-orange-600">{money(l.qty * l.price)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-1.5 rounded-[10px] bg-slate-100 px-2 py-1.5 text-[8.5px] text-slate-600 space-y-px">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">{money(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (0%)</span>
                <span className="tabular-nums">GHS 0.00</span>
              </div>
              <div className="flex justify-between pt-0.5 text-[10px] font-bold text-slate-950">
                <span>Total</span>
                <span className="font-mono tabular-nums text-orange-600">{money(total)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => raise("to-collect")}
              disabled={!lines.length}
              className="mt-1.5 h-[30px] rounded-[12px] bg-orange-500 text-zinc-950 text-[10px] font-bold disabled:opacity-40 hover:bg-orange-400 transition-colors"
            >
              {lines.length ? "Send to cashier" : "Add items to charge"}
            </button>
            {lines.length > 0 && (
              <button type="button" onClick={() => raise("held")} className="mt-1 h-[24px] rounded-[12px] border-2 border-slate-300 bg-white text-[9px] font-semibold hover:bg-slate-50">
                Hold for later
              </button>
            )}
            <button type="button" onClick={() => setFulfil((f) => (f === "Pickup" ? "Delivery" : "Pickup"))} className="mt-1.5 flex items-center justify-between rounded-[8px] px-1 text-[8px] text-slate-500 hover:bg-slate-100">
              <span className="font-bold tracking-wide">OPTIONS</span>
              <span>{fulfil} · Walk-in</span>
            </button>
          </aside>
        </div>
      ) : (
        /* cashier: orders */
        <div className="flex-1 min-h-0 grid grid-cols-1 @[520px]:grid-cols-[minmax(0,1fr)_200px]">
          <div className="min-h-0 flex flex-col p-2 gap-1.5">
            <div className="flex items-center gap-1 flex-wrap">
              {(
                [
                  ["all", "All"],
                  ["to-collect", "To collect"],
                  ["held", "Held"],
                  ["paid", "Paid"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setChip(id)}
                  aria-pressed={chip === id}
                  className={`h-[20px] px-2 rounded-full border text-[8.5px] ${chip === id ? "bg-orange-500/20 text-orange-700 border-orange-500/40 font-semibold" : "bg-white border-slate-200 text-slate-600"}`}
                >
                  {label}
                </button>
              ))}
              <span className={`ml-auto inline-flex items-center gap-1 h-[20px] px-2 rounded-full text-[8.5px] font-semibold ${waiting ? "bg-orange-500 text-zinc-950 animate-pulse" : "bg-slate-100 text-slate-500"}`}>
                <Bell className="w-2.5 h-2.5" /> {waiting} waiting
              </span>
              <button
                type="button"
                onClick={() => setSound((s) => !s)}
                aria-pressed={sound}
                aria-label={sound ? "Mute announcements" : "Turn announcements on"}
                className="w-[20px] h-[20px] rounded-full border border-slate-300 bg-white grid place-items-center text-slate-700"
              >
                {sound ? <Volume2 className="w-2.5 h-2.5" /> : <VolumeX className="w-2.5 h-2.5" />}
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none space-y-1">
              {!shown.length ? (
                <p className="mt-6 text-center text-[9px] text-slate-400">{tickets.length ? "Nothing here." : "No tickets yet. Go back to the register and send one."}</p>
              ) : (
                shown.map((t) => (
                  <button
                    key={t.code}
                    type="button"
                    onClick={() => setPicked(t.code)}
                    className={`w-full text-left rounded-[10px] border bg-white px-2 py-1.5 ${current?.code === t.code ? "border-orange-400 ring-1 ring-orange-300" : "border-slate-200"}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] font-semibold">{t.code}</span>
                      <span
                        className={`rounded-full px-1.5 text-[7px] font-bold uppercase tracking-wide ${
                          t.status === "to-collect" ? "bg-orange-500 text-zinc-950" : t.status === "held" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {t.status === "to-collect" ? "To collect" : t.status}
                      </span>
                      <span className="ml-auto font-mono text-[9px] font-bold text-orange-600 tabular-nums">{money(t.total)}</span>
                    </span>
                    <span className="block text-[8px] text-slate-500 mt-0.5">
                      {t.lines.reduce((a, l) => a + l.qty, 0)} items · {t.fulfil} · {SP}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
          <aside className="min-h-0 flex flex-col bg-white border-t @[520px]:border-t-0 @[520px]:border-l border-slate-200 p-2">
            {current ? (
              <>
                <p className="text-[10px] font-bold">{current.status === "paid" ? "Paid" : current.status === "held" ? "Held" : "Collect"} {current.code}</p>
                <p className="text-[8px] text-slate-500 leading-snug mt-0.5">
                  {SP} punched this ticket.{current.status === "to-collect" ? ` Check the lines, then collect ${money(current.total)}.` : ""}
                </p>
                <ul className="mt-1.5 flex-1 min-h-0 overflow-y-auto scrollbar-none text-[8.5px] divide-y divide-slate-100">
                  {current.lines.map((l) => (
                    <li key={l.id} className="flex justify-between gap-1 py-1">
                      <span className="truncate">
                        {l.qty} × {l.name}
                      </span>
                      <span className="tabular-nums">{(l.qty * l.price).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                {current.status === "to-collect" && (
                  <button type="button" onClick={() => setPaying(current)} className="mt-1.5 h-[30px] rounded-[12px] bg-orange-500 text-zinc-950 text-[10px] font-bold hover:bg-orange-400">
                    Charge {money(current.total)}
                  </button>
                )}
                {current.status === "held" && (
                  <button type="button" onClick={() => sendHeld(current)} className="mt-1.5 h-[30px] rounded-[12px] bg-orange-500 text-zinc-950 text-[10px] font-bold hover:bg-orange-400">
                    Send to cashier
                  </button>
                )}
              </>
            ) : (
              <p className="text-[8.5px] text-slate-400">Pick a ticket to collect it.</p>
            )}
          </aside>
        </div>
      )}

      {/* payment */}
      <AnimatePresence>{paying && <Payment key={paying.code} t={paying} onClose={() => setPaying(null)} onDone={complete} />}</AnimatePresence>

      {/* receipt */}
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 grid place-items-center bg-slate-950/40 p-3">
            <div className="w-[260px] rounded-[16px] bg-white p-4 text-center shadow-2xl">
              <span className="mx-auto w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center">
                <Check className="w-5 h-5" />
              </span>
              <p className="mt-2 text-[13px] font-bold">Sale Complete!</p>
              <p className="font-mono text-[8.5px] text-slate-500">{done.t.code}</p>
              <p className="mt-1.5 font-mono text-[18px] font-bold text-orange-600 tabular-nums">{money(done.t.total)}</p>
              <p className="text-[9px] text-slate-500">
                {done.method}
                {done.method === "Cash" ? ` · Change: ${money(Math.max(0, done.received - done.t.total))}` : ""}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-1.5 text-[9px] font-semibold">
                <button type="button" onClick={() => printReceipt(done)} className="h-[26px] rounded-[9px] border border-slate-300 hover:bg-slate-50">
                  Print
                </button>
                <button type="button" onClick={() => { setDone(null); setView("register"); }} className="h-[26px] rounded-[9px] bg-orange-500 text-zinc-950">
                  New Sale
                </button>
                <button type="button" onClick={() => { setDone(null); setView("orders"); }} className="h-[26px] rounded-[9px] border border-slate-300 hover:bg-slate-50">
                  Orders
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function Payment({ t, onClose, onDone }: { t: Ticket; onClose: () => void; onDone: (t: Ticket, m: Method, received: number) => void }) {
  const [method, setMethod] = useState<Method | null>(null);
  const [received, setReceived] = useState(t.total);
  const quick = [t.total, Math.ceil(t.total / 50) * 50, Math.ceil(t.total / 100) * 100, Math.ceil(t.total / 100) * 100 + 100].filter((v, i, a) => a.indexOf(v) === i);
  const short = method === "Cash" && received < t.total;
  const methods: { m: Method | "Credit Sale"; Icon: typeof Banknote }[] = [
    { m: "Cash", Icon: Banknote },
    { m: "Mobile Money", Icon: Smartphone },
    { m: "Card / Bank", Icon: CreditCard },
    { m: "Credit Sale", Icon: Building2 },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 grid place-items-center bg-slate-950/40 p-3" onClick={onClose}>
      <div role="dialog" aria-label="Payment" className="w-[300px] rounded-[16px] bg-white p-3 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-bold">Payment · {t.code}</p>
          <p className="font-mono text-[14px] font-bold text-orange-600 tabular-nums">{money(t.total)}</p>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {methods.map(({ m, Icon }) => {
            const credit = m === "Credit Sale";
            return (
              <button
                key={m}
                type="button"
                disabled={credit}
                title={credit ? "Credit needs an approved customer account" : undefined}
                onClick={() => !credit && setMethod(m as Method)}
                className={`h-[34px] rounded-[10px] border flex items-center justify-center gap-1.5 text-[9.5px] font-semibold disabled:opacity-35 ${method === m ? "border-orange-400 bg-orange-50 text-orange-700" : "border-slate-200 hover:bg-slate-50"}`}
              >
                <Icon className="w-3.5 h-3.5" /> {m}
              </button>
            );
          })}
        </div>
        {method === "Cash" && (
          <div className="mt-2">
            <p className="text-[8.5px] text-slate-500">Amount Received</p>
            <p className="font-mono text-[18px] font-bold tabular-nums">{money(received)}</p>
            <div className="mt-1 flex gap-1 flex-wrap">
              {quick.map((v) => (
                <button key={v} type="button" onClick={() => setReceived(v)} className={`h-[20px] px-2 rounded-full border text-[8.5px] tabular-nums ${received === v ? "border-orange-400 bg-orange-50" : "border-slate-200"}`}>
                  {v.toFixed(0)}
                </button>
              ))}
            </div>
            <p className={`mt-1 text-[9px] font-semibold ${short ? "text-red-600" : "text-emerald-700"}`}>
              {short ? `Short by ${money(t.total - received)}` : `Change: ${money(received - t.total)}`}
            </p>
          </div>
        )}
        <button
          type="button"
          disabled={!method || short}
          onClick={() => method && onDone(t, method, received)}
          className="mt-2.5 w-full h-[30px] rounded-[12px] bg-orange-500 text-zinc-950 text-[10px] font-bold disabled:opacity-40"
        >
          ✓ Complete Sale · {money(t.total)}
        </button>
      </div>
    </motion.div>
  );
}
