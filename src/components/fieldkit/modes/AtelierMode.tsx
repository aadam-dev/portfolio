"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { emit } from "../events";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { ClothFilters, GARMENTS, PRINTS, PrintPattern, type GarmentId, type PrintId } from "../prints";

type Market = "USD" | "GHS";
interface Look {
  print: PrintId;
  way: number;
}
interface BagLine {
  garment: GarmentId;
  print: PrintId;
  way: number;
  market: Market;
}

const money = (m: Market, n: number) => (m === "USD" ? `USD ${n}` : `GHS ${n.toLocaleString("en-GH")}`);

function GarmentStage({ garment, look, prev, version }: { garment: GarmentId; look: Look; prev: Look | null; version: number }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const g = GARMENTS.find((x) => x.id === garment)!;
  const p = PRINTS.find((x) => x.id === look.print)!;
  const pp = prev ? PRINTS.find((x) => x.id === prev.print)! : null;

  return (
    <svg viewBox="0 0 200 260" className="w-full h-full" role="img" aria-label={`${g.name} in ${p.name}, ${p.ways[look.way].name}`}>
      <defs>
        <ClothFilters id={uid} />
        <PrintPattern id={`${uid}-p`} print={look.print} c={p.ways[look.way].c} scale={g.scale} />
        {pp && prev && <PrintPattern id={`${uid}-pp`} print={prev.print} c={pp.ways[prev.way].c} scale={g.scale} />}
        <clipPath id={`${uid}-clip`}>
          {g.paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
        <clipPath id={`${uid}-wipe`}>
          <motion.path
            key={version}
            initial={reduce || !prev ? { d: "M-20 -20 H220 V280 H-20 Z" } : { d: "M-20 -20 H220 V-20 Q100 -6 -20 -20 Z" }}
            animate={{ d: "M-20 -20 H220 V280 Q100 300 -20 280 Z" }}
            transition={{ duration: reduce ? 0 : 0.8, ease: EASE_IN_OUT }}
          />
        </clipPath>
      </defs>

      <g filter={`url(#${uid}-shadow)`}>
        <g clipPath={`url(#${uid}-clip)`}>
          {prev && <rect x={-10} y={-10} width={220} height={280} fill={`url(#${uid}-pp)`} filter={`url(#${uid}-drape)`} />}
          <g clipPath={`url(#${uid}-wipe)`}>
            <rect x={-10} y={-10} width={220} height={280} fill={`url(#${uid}-p)`} filter={`url(#${uid}-drape)`} />
          </g>
          <rect x={0} y={0} width={200} height={260} fill={`url(#${uid}-folds)`} />
          <rect x={0} y={0} width={200} height={260} fill={`url(#${uid}-light)`} />
        </g>
        {g.paths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={1} />
        ))}
        {g.seams.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={0.7} strokeDasharray="2 1.6" />
        ))}
      </g>
    </svg>
  );
}

export default function AtelierMode() {
  const reduce = useReducedMotion();
  const [garment, setGarment] = useState<GarmentId>("kaftan");
  const [look, setLook] = useState<Look>({ print: "kente", way: 0 });
  const [prev, setPrev] = useState<Look | null>(null);
  const [version, setVersion] = useState(0);
  const [market, setMarket] = useState<Market>("USD");
  const [bag, setBag] = useState<BagLine[]>([]);
  const [sent, setSent] = useState(false);

  const g = GARMENTS.find((x) => x.id === garment)!;
  const p = PRINTS.find((x) => x.id === look.print)!;

  const change = (next: Look) => {
    if (next.print === look.print && next.way === look.way) return;
    setPrev(look);
    setLook(next);
    setVersion((v) => v + 1);
    const np = PRINTS.find((x) => x.id === next.print)!;
    emit("atelier", "print.changed", `${np.name} · ${np.ways[next.way].name}`);
  };

  const add = () => {
    const line = { garment, print: look.print, way: look.way, market };
    setBag((b) => [...b, line]);
    setSent(false);
    emit("atelier", "bag.add", `${g.name} · ${p.name} ${p.ways[look.way].name} · ${money(market, g.price[market])}`);
  };

  const total = bag.reduce((a, l) => a + GARMENTS.find((x) => x.id === l.garment)!.price[market], 0);
  const message = `Hi Muna Muse, I'd like to order:\n${bag
    .map((l) => {
      const gg = GARMENTS.find((x) => x.id === l.garment)!;
      const pr = PRINTS.find((x) => x.id === l.print)!;
      return `· ${gg.name} in ${pr.name} (${pr.ways[l.way].name})`;
    })
    .join("\n")}\nTotal ${money(market, total)}. Delivery in Accra, please.`;

  const send = () => {
    if (!bag.length) return;
    setSent(true);
    emit("atelier", "order.whatsapp", `${bag.length} items · ${money(market, total)} · the bag is the order`);
  };

  return (
    <div className="grid grid-cols-1 @[440px]:grid-cols-[minmax(0,1fr)_236px] gap-3 h-full">
      {/* Stage */}
      <div className="relative rounded-[10px] overflow-hidden min-h-[230px]" style={{ background: "radial-gradient(ellipse at 50% 35%, #2a2520, #121110 75%)" }}>
        <div className="absolute inset-0 p-3 pb-9">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={garment}
              className="w-full h-full"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <GarmentStage garment={garment} look={look} prev={prev} version={version} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute left-3 right-3 bottom-2.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[12px] text-[#F2EEE6] leading-tight truncate">
              {g.name} · {p.name}
            </div>
            <div className="font-mono text-[9px] text-white/40 truncate">{p.origin}</div>
          </div>
          <div className="font-mono text-[13px] text-[#F2EEE6] shrink-0">{money(market, g.price[market])}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-2 min-w-0">
        <div className="grid grid-cols-4 gap-1" role="group" aria-label="Silhouette">
          {GARMENTS.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => {
                setPrev(null);
                setGarment(x.id);
              }}
              aria-pressed={garment === x.id}
              title={x.name}
              className={`h-9 rounded-[7px] border grid place-items-center transition-colors ${
                garment === x.id ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-white/10 hover:border-white/30"
              }`}
            >
              <svg viewBox="0 0 200 260" className="h-6 w-6" aria-hidden="true">
                {x.paths.map((d, i) => (
                  <path key={i} d={d} fill={garment === x.id ? "#F2EEE6" : "rgba(242,238,230,0.45)"} />
                ))}
              </svg>
              <span className="sr-only">{x.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-1" role="group" aria-label="Print">
          {PRINTS.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => change({ print: x.id, way: 0 })}
              aria-pressed={look.print === x.id}
              title={x.name}
              className={`relative h-9 rounded-[7px] overflow-hidden border transition-colors ${
                look.print === x.id ? "border-[var(--accent)]" : "border-white/10 hover:border-white/30"
              }`}
            >
              <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full" aria-hidden="true">
                <defs>
                  <PrintPattern id={`sw-${x.id}`} print={x.id} c={x.ways[0].c} scale={0.55} />
                </defs>
                <rect width={40} height={40} fill={`url(#sw-${x.id})`} />
              </svg>
              <span className="sr-only">{x.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5" role="group" aria-label="Colourway">
            {p.ways.map((w, i) => (
              <button
                key={w.name}
                type="button"
                onClick={() => change({ print: look.print, way: i })}
                aria-pressed={look.way === i}
                aria-label={w.name}
                title={w.name}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${look.way === i ? "border-[#F2EEE6] scale-110" : "border-transparent"}`}
                style={{ background: `conic-gradient(${w.c.map((c, k) => `${c} ${(k / w.c.length) * 360}deg ${((k + 1) / w.c.length) * 360}deg`).join(",")})` }}
              />
            ))}
            <span className="font-mono text-[9px] text-white/40 ml-1 truncate">{p.ways[look.way].name}</span>
          </div>
          <div role="group" aria-label="Market" className="flex rounded-[7px] bg-white/[0.05] p-0.5 shrink-0">
            {(["USD", "GHS"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMarket(m);
                  emit("atelier", "market.switched", `${m} · priced per market, not converted`);
                }}
                aria-pressed={market === m}
                className={`px-1.5 h-5 rounded-[5px] font-mono text-[9px] ${market === m ? "bg-[#F2EEE6] text-[#14100A]" : "text-white/50"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={add}
          className="h-8 rounded-[8px] bg-[var(--accent)] text-[var(--on-accent)] text-[12px] font-semibold"
        >
          Add to bag · {money(market, g.price[market])}
        </button>

        <div className="flex-1 min-h-[64px] rounded-[8px] bg-[#13120F] border border-white/[0.06] p-2 flex flex-col">
          {!bag.length ? (
            <p className="text-[10px] leading-snug text-white/35">
              The bag is the order: it becomes a WhatsApp message, prices set per market.
            </p>
          ) : sent ? (
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[10px] rounded-br-[3px] bg-[#1f3b2c] px-2 py-1.5 text-[9.5px] leading-snug text-[#dcf8e5] whitespace-pre-line self-end max-w-full overflow-hidden"
            >
              {message}
            </motion.div>
          ) : (
            <>
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-white/40">
                <span>Bag · {bag.length}</span>
                <span className="text-[#F2EEE6] normal-case tracking-normal">{money(market, total)}</span>
              </div>
              <button
                type="button"
                onClick={send}
                className="mt-auto h-7 rounded-[7px] bg-[#25d366] text-[#06210f] text-[11px] font-semibold"
              >
                Send as WhatsApp order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
