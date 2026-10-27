"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { emit } from "../events";
import { MUNAMUSE, ZAINAS } from "../items";

type Store = "zainas" | "munamuse";
type Market = "GHS" | "USD";
interface Line {
  name: string;
  size: string;
  price: number;
  market: Market;
}

const cedis = (n: number) => `GH₵${n.toLocaleString("en-GH")}`;
const fmt = (m: Market, n: number) => (m === "USD" ? `$${n}` : cedis(n));

function WhatsAppChat({ to, lines, total, footer, onBack }: { to: string; lines: Line[]; total: string; footer: string; onBack: () => void }) {
  const reduce = useReducedMotion();
  const msg = `Hi ${to}, I'd like to order:\n${lines.map((l) => `· ${l.name} (size ${l.size}) ${fmt(l.market, l.price)}`).join("\n")}\nTotal ${total}. ${footer}`;
  return (
    <div className="absolute inset-0 flex flex-col bg-[#efeae2]">
      <div className="h-[42px] flex items-center gap-2 px-2 bg-[#f6f6f6] border-b border-black/10">
        <button type="button" onClick={onBack} aria-label="Back to the shop" className="p-1 text-[#128c7e]">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="w-6 h-6 rounded-full bg-[#25d366]/20 grid place-items-center text-[10px] font-semibold text-[#128c7e]">{to[0]}</span>
        <span className="text-[11.5px] font-semibold text-black">{to}</span>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-end">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 380, damping: 28 }}
          className="self-end max-w-[88%] rounded-[10px] rounded-tr-[3px] bg-[#d9fdd3] px-2.5 py-1.5 text-[10.5px] leading-snug text-black whitespace-pre-line shadow-sm"
        >
          {msg}
          <span className="block text-right text-[8px] text-black/40 mt-0.5">now ✓✓</span>
        </motion.div>
      </div>
      <div className="h-[46px] pb-3 px-2 flex items-center gap-2 bg-[#f6f6f6]">
        <span className="flex-1 h-[28px] rounded-full bg-white px-3 text-[10px] leading-[28px] text-black/35">Message</span>
      </div>
    </div>
  );
}

function Zainas({ bag, setBag, onChat }: { bag: Line[]; setBag: (l: Line[]) => void; onChat: () => void }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<(typeof ZAINAS.items)[number] | null>(null);
  const [size, setSize] = useState("M");
  const total = bag.reduce((a, l) => a + l.price, 0);

  const add = () => {
    if (!open) return;
    setBag([...bag, { name: open.name, size, price: open.price, market: "GHS" }]);
    emit("atelier", "bag.add", `Zaina's · ${open.name} (${size}) · ${cedis(open.price)}`);
    setOpen(null);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-[#f9f1ee] text-[#2a1a1f]">
      <div className="h-[34px] flex items-center justify-between px-3 text-[8px] tracking-[0.16em] uppercase">
        <span>Shop</span>
        <span className="font-serif text-[12px] tracking-[0.12em]">
          ZAINA&apos;S
        </span>
        <button type="button" onClick={() => bag.length && onChat()} className="flex items-center gap-1" aria-label={`Bag, ${bag.length} items`}>
          Bag <span className="w-4 h-4 rounded-full bg-[#2a1a1f] text-white grid place-items-center text-[8px] tracking-normal">{bag.length}</span>
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-3 pb-3">
        <h3 className="font-serif text-[21px] leading-[1.05] mt-1">
          Everything we have <em className="text-[#a0435a]">right now</em>.
        </h3>
        <p className="mt-1 text-[8.5px] leading-snug text-[#2a1a1f]/60">Stock is small on purpose. If something says low stock, it means it.</p>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {ZAINAS.items.map((it) => (
            <button key={it.id} type="button" onClick={() => setOpen(it)} className="text-left" aria-label={`${it.name}, ${cedis(it.price)}`}>
              <span className="relative block aspect-[3/4] overflow-hidden rounded-[3px] bg-white">
                <Image unoptimized src={it.img} alt="" fill sizes="140px" className="object-cover" />
              </span>
              <span className="mt-1 flex items-baseline justify-between gap-1">
                <span className="font-serif text-[11px] leading-tight">
                  {it.name}
                </span>
                <span className="text-[9px] font-semibold shrink-0">
                  {"was" in it && <s className="font-normal opacity-50 mr-0.5">{cedis(it.was)}</s>}
                  {cedis(it.price)}
                </span>
              </span>
              <span className="block text-[8px] text-[#2a1a1f]/55 truncate">{it.note}</span>
            </button>
          ))}
        </div>
      </div>
      {bag.length > 0 && (
        <div className="px-3 pt-2 pb-5 bg-white border-t border-black/5 flex items-center justify-between gap-2">
          <span className="text-[10px]">
            Bag · {bag.length} · <b>{cedis(total)}</b>
          </span>
          <button type="button" onClick={onChat} className="h-[28px] px-3 rounded-[4px] bg-[#128c7e] text-white text-[9px] tracking-[0.12em] uppercase">
            Finish on WhatsApp
          </button>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key={open.id}
            className="absolute inset-0 z-10 flex flex-col bg-[#f9f1ee]"
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 300, damping: 32 }}
          >
            <div className="relative h-[52%] shrink-0">
              <Image unoptimized src={open.img} alt={open.name} fill sizes="300px" className="object-cover" />
              <button type="button" onClick={() => setOpen(null)} aria-label="Back to the shop" className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 grid place-items-center">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 flex flex-col px-3 pt-2 pb-5">
              <div className="font-serif text-[19px] leading-tight">
                {open.name}
              </div>
              <div className="text-[12px]">
                {cedis(open.price)} {"was" in open && <s className="text-[10px] opacity-50">{cedis(open.was)}</s>}
                {"low" in open && <span className="ml-1.5 text-[8px] tracking-[0.1em] uppercase text-[#a0435a]">Low stock</span>}
              </div>
              <p className="mt-1 text-[9.5px] text-[#2a1a1f]/65">{open.note}</p>
              <div className="mt-2 flex gap-1" role="group" aria-label="Size">
                {ZAINAS.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`w-8 h-7 border text-[9.5px] ${size === s ? "bg-[#2a1a1f] text-white border-[#2a1a1f]" : "border-[#2a1a1f]/20"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button type="button" onClick={add} className="mt-auto h-[32px] bg-[#2a1a1f] text-white text-[9.5px] tracking-[0.16em] uppercase">
                Add to bag
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MunaMuse({ bag, setBag, onChat }: { bag: Line[]; setBag: (l: Line[]) => void; onChat: () => void }) {
  const p = MUNAMUSE.product;
  const [market, setMarket] = useState<Market>("GHS");
  const [size, setSize] = useState("12");
  const add = () => {
    setBag([...bag, { name: p.name, size, price: p.price[market], market }]);
    emit("atelier", "bag.add", `Muna Muse · ${p.name} (${size}) · ${fmt(market, p.price[market])}`);
  };
  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b1020] text-[#ece6da]">
      <div className="h-[34px] flex items-center justify-between px-3 text-[8px] tracking-[0.16em] uppercase">
        <span className="text-[#c9a46a] font-serif text-[10.5px] tracking-[0.14em]">
          MUNA <span className="text-[#ece6da]">MUSE</span>
        </span>
        <span className="flex items-center gap-2">
          <span role="group" aria-label="Market" className="flex border border-white/20">
            {(["USD", "GHS"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMarket(m);
                  emit("atelier", "market.switched", `${m} · set per market, not converted`);
                }}
                aria-pressed={market === m}
                className={`px-1.5 h-[16px] text-[8px] ${market === m ? "bg-[#ece6da] text-[#0b1020]" : "text-white/60"}`}
              >
                {m === "USD" ? "$" : "GH₵"}
              </button>
            ))}
          </span>
          <button type="button" onClick={() => bag.length && onChat()} aria-label={`Bag, ${bag.length} items`} className="flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" /> {bag.length}
          </button>
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
        <div className="relative h-[230px]">
          <Image unoptimized src={p.img} alt={`${p.name} fabric`} fill sizes="300px" className="object-cover" />
          <span className="absolute left-2 bottom-2 px-1.5 py-0.5 bg-black/50 text-[7.5px] tracking-[0.14em] uppercase">Kaftans &amp; boubous</span>
        </div>
        <div className="px-3 pt-2.5 pb-3">
          <div className="font-serif text-[20px] leading-tight">
            {p.name}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={market} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[13px] mt-0.5">
              {fmt(market, p.price[market])}
            </motion.div>
          </AnimatePresence>
          <div className="text-[8px] text-white/40">Priced for each market, not converted at checkout.</div>
          <p className="mt-1.5 text-[9px] leading-snug text-white/70">{p.note}</p>
          <div className="mt-2 text-[7.5px] tracking-[0.16em] uppercase text-white/50">Size</div>
          <div className="mt-1 grid grid-cols-5 gap-1" role="group" aria-label="Size">
            {p.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={`h-6 border text-[9px] ${size === s ? "border-[#ece6da] bg-[#ece6da] text-[#0b1020]" : "border-white/20 text-white/80"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 pt-2 pb-5 grid grid-cols-2 gap-1.5">
        <button type="button" onClick={add} className="h-[30px] bg-[#f3e9dc] text-[#0b1020] text-[8.5px] tracking-[0.14em] uppercase">
          Add to bag
        </button>
        <button
          type="button"
          onClick={() => (bag.length ? onChat() : (add(), onChat()))}
          className="h-[30px] bg-[#25d366] text-[#06210f] text-[8.5px] tracking-[0.1em] uppercase font-semibold"
        >
          Order on WhatsApp
        </button>
      </div>
    </div>
  );
}

export default function AtelierMode() {
  const [store, setStore] = useState<Store>("zainas");
  const [bags, setBags] = useState<Record<Store, Line[]>>({ zainas: [], munamuse: [] });
  const [chat, setChat] = useState(false);
  const bag = bags[store];
  const setBag = (l: Line[]) => setBags((b) => ({ ...b, [store]: l }));

  const openChat = () => {
    setChat(true);
    emit("atelier", "order.whatsapp", `${store === "zainas" ? "Zaina's" : "Muna Muse"} · the bag is the order`);
  };

  // Muna Muse can switch market mid-bag; totals are per line's own market.
  const total = (lines: Line[]) => {
    const usd = lines.filter((l) => l.market === "USD").reduce((a, l) => a + l.price, 0);
    const ghs = lines.filter((l) => l.market === "GHS").reduce((a, l) => a + l.price, 0);
    return [ghs ? cedis(ghs) : "", usd ? `$${usd}` : ""].filter(Boolean).join(" + ");
  };

  return (
    <div className="relative h-full">
      {/* storefront switch, like browser tabs */}
      <div className="absolute inset-x-0 top-0 z-20 flex justify-center pt-1">
        <div role="group" aria-label="Storefront" className="flex rounded-full bg-black/70 p-0.5">
          {(
            [
              ["zainas", "Zaina's · Accra"],
              ["munamuse", "Muna Muse · NY"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setStore(id);
                setChat(false);
              }}
              aria-pressed={store === id}
              className={`px-2.5 h-[18px] rounded-full text-[8.5px] ${store === id ? "bg-white text-black font-semibold" : "text-white/70"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 top-[24px]">
        {store === "zainas" ? <Zainas bag={bag} setBag={setBag} onChat={openChat} /> : <MunaMuse bag={bag} setBag={setBag} onChat={openChat} />}
        {chat && bag.length > 0 && (
          <WhatsAppChat
            to={store === "zainas" ? "Zaina's Couture" : "Muna Muse"}
            lines={bag}
            total={total(bag)}
            footer={store === "zainas" ? "Delivery Fri to Sun in Accra, paying with MoMo." : "Shipping to Accra, please."}
            onBack={() => setChat(false)}
          />
        )}
      </div>
    </div>
  );
}
