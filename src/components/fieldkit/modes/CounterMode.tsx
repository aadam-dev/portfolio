"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { cedi, emit } from "../events";
import { usePrinter } from "../Receipt";
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
const LOW = 4;
const SALESPERSON = "Baria";

/** Two-note chime plus the spoken handoff, the way the real cashier screen calls orders. */
function announce(no: string) {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      o.type = "sine";
      const t = ctx.currentTime + i * 0.16;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.55);
    });
    setTimeout(() => ctx.close().catch(() => {}), 1200);
  } catch {
    // no audio: the banner still shows
  }
  try {
    const u = new SpeechSynthesisUtterance(`New order from ${SALESPERSON}. Ticket ${no}.`);
    u.rate = 1;
    setTimeout(() => window.speechSynthesis.speak(u), 380);
  } catch {
    // speech unavailable
  }
}

export default function CounterMode() {
  const reduce = useReducedMotion();
  const print = usePrinter();
  const [basket, setBasket] = useState<Partial<Record<ItemId, number>>>({});
  const [stock, setStock] = useState<Record<ItemId, number>>(
    () => Object.fromEntries(CATALOGUE.map((c) => [c.id, c.stock])) as Record<ItemId, number>,
  );
  const [receiptNo, setReceiptNo] = useState(41);
  const [handoff, setHandoff] = useState(true);
  const [sound, setSound] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    },
    [],
  );

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
    const code = `#${String(no).padStart(4, "0")}`;
    setReceiptNo(no);
    const next = { ...stock };
    lines.forEach((l) => (next[l.id] = stock[l.id] - l.qty));
    setStock(next);
    emit("pos", "sale.completed", `${code} · ${cedi(total)}`);
    lines.forEach((l) => emit("pos", "stock.decrement", `${l.name} −${l.qty}`));
    lines.forEach((l) => {
      if (next[l.id] <= LOW) emit("pos", "stock.low", `${l.name} · ${next[l.id]} left, reorder`);
    });
    print({
      head: "Al Boyut · Lakeside",
      sub: `Receipt ${code} · served by ${SALESPERSON}`,
      lines: lines.map((l) => ({ l: `${l.qty}× ${l.name}`, r: `${l.total}.00` })),
      total: { l: "Total", r: cedi(total) },
      foot: ["Paid · MoMo", "Thank you. Goods sold are counted."],
    });
    if (handoff) {
      emit("pos", "cashier.notified", `${code} · ${SALESPERSON} → cashier`);
      setBanner(code);
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
      bannerTimer.current = setTimeout(() => setBanner(null), 3200);
      if (sound) announce(String(no));
    }
    setBasket({});
  };

  return (
    <div className="relative grid grid-cols-1 @[440px]:grid-cols-[1.35fr_1fr] gap-3 h-full">
      {/* Catalogue */}
      <div className="grid grid-cols-3 @[440px]:grid-cols-2 gap-2 content-start">
        {CATALOGUE.map((c) => {
          const left = stock[c.id] - (basket[c.id] ?? 0);
          return (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => add(c.id)}
              whileTap={reduce ? undefined : { scale: 0.95 }}
              disabled={left <= 0}
              className="group relative text-left rounded-[10px] bg-[#1A1814] hover:bg-[#221F1A] border border-white/[0.06] p-2 @[440px]:p-2.5 transition-colors disabled:opacity-35"
            >
              <span className="block w-4 h-4 @[440px]:w-5 @[440px]:h-5 rounded-[5px] mb-1.5" style={{ background: c.tone }} aria-hidden="true" />
              <span className="block text-[11px] @[440px]:text-[11.5px] leading-tight text-[#F2EEE6]">{c.name}</span>
              <span className="mt-1 flex items-baseline justify-between font-mono text-[9.5px] text-white/45 tabular-nums">
                <span>{c.price}.00</span>
                <span className={left <= LOW ? "text-[var(--accent)]" : ""}>{left} left</span>
              </span>
              {basket[c.id] ? (
                <motion.span
                  key={basket[c.id]}
                  initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-1.5 right-1.5 min-w-5 h-5 px-1 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-mono text-[10px] font-semibold grid place-items-center"
                >
                  {basket[c.id]}
                </motion.span>
              ) : null}
            </motion.button>
          );
        })}
      </div>

      {/* Basket */}
      <div className="flex flex-col rounded-[10px] bg-[#13120F] border border-white/[0.06] p-3 min-h-[170px]">
        <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">
          <span>Basket · {SALESPERSON}</span>
          <span>#{String(receiptNo + 1).padStart(4, "0")}</span>
        </div>
        <div className="mt-2 flex-1 min-h-0 overflow-hidden">
          {lines.length === 0 ? (
            <p className="text-[11px] text-white/35 leading-relaxed mt-2">Tap items to ring them up.</p>
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

        <div className="mt-2 flex items-center justify-between gap-2">
          <label className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/45 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={handoff}
              onChange={(e) => setHandoff(e.target.checked)}
              className="accent-[var(--accent)] w-3 h-3"
            />
            Send to cashier
          </label>
          <button
            type="button"
            onClick={() => setSound((s) => !s)}
            aria-pressed={sound}
            aria-label={sound ? "Mute the cashier voice" : "Unmute the cashier voice"}
            className="p-1 rounded text-white/45 hover:text-white"
          >
            {sound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="pt-2 mt-1.5 border-t border-dashed border-white/10 flex items-baseline justify-between">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">Total</span>
          <span className="font-mono text-[15px] text-[#F2EEE6] tabular-nums">{cedi(total)}</span>
        </div>
        <button
          type="button"
          onClick={charge}
          disabled={!lines.length}
          className="mt-2 h-9 rounded-[8px] bg-[var(--accent)] text-[var(--on-accent)] text-[12px] font-semibold tracking-wide disabled:bg-white/[0.07] disabled:text-white/30 transition-colors"
        >
          Charge &amp; print
        </button>
      </div>

      {/* Cashier screen banner */}
      <AnimatePresence>
        {banner && (
          <motion.div
            role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="absolute left-1/2 -translate-x-1/2 top-1 z-10 flex items-center gap-2.5 rounded-full bg-[#F2EEE6] text-[#14120F] pl-2 pr-3.5 py-1.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.7)]"
          >
            <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--on-accent)] grid place-items-center text-[11px] font-bold">
              B
            </span>
            <span className="text-[11.5px] leading-tight">
              <span className="block font-semibold">New order from {SALESPERSON}</span>
              <span className="block font-mono text-[9.5px] opacity-60">Cashier queue · {banner}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
