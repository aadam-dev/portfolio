"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ClipboardCheck, MapPin, Minus, Plus } from "lucide-react";
import { emit } from "@/components/fieldkit/events";

/**
 * PrimeTijara's register opening and a stock take, rebuilt from the live
 * back office on sample data: the open-shift form (float and MoMo wallet),
 * then a physical count of the nail boxes on the inventory screen.
 */
const SKUS = [
  { sku: "STK-HAR-1NAILBOX", name: '1" Nail Box' },
  { sku: "STK-HAR-112NAILBOX", name: '1.5" Nail Box' },
  { sku: "STK-HAR-2NAILBOX", name: '2" Nail Box' },
  { sku: "STK-HAR-25NAILBOX", name: '2.5" Nail Box' },
  { sku: "STK-HAR-3NAILBOX", name: '3" Nail Box' },
  { sku: "STK-HAR-4NAILBOX", name: '4" Nail Box' },
];
const ALERT_AT = 10;
const fmt = (n: number) => n.toLocaleString("en-GH");

export default function PrimeShift() {
  const [step, setStep] = useState<"shift" | "count" | "posted">("shift");
  const [float, setFloat] = useState("");
  const [momo, setMomo] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});

  const counted = SKUS.filter((s) => counts[s.sku] !== undefined);
  const boxes = counted.reduce((a, s) => a + counts[s.sku], 0);

  const set = (sku: string, d: number) => setCounts((c) => ({ ...c, [sku]: Math.max(0, (c[sku] ?? 0) + d) }));

  return (
    <div className="@container relative h-full w-full overflow-hidden text-white font-sans bg-[radial-gradient(ellipse_at_50%_0%,#1a1f33_0%,#050814_60%)]">
      <AnimatePresence mode="wait">
        {step === "shift" ? (
          <motion.div
            key="shift"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full grid grid-cols-[180px_1fr] items-center gap-6 px-8"
          >
            <div className="flex flex-col items-center text-center">
              <Image src="/replicas/primetijara-mark.webp" alt="PrimeTijara" width={64} height={100} />
              <p className="mt-3 text-[11px] tracking-[0.3em] text-white/50">POINT OF SALE</p>
              <p className="mt-4 rounded-full border border-white/10 px-2.5 py-1 text-[10.5px] text-white/50">Sample data</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("count");
                emit("ledger", "shift.opened", `PrimeTijara float GHS ${fmt(Number(float) || 0)}`);
              }}
              className="rounded-2xl border border-white/10 bg-[#111827]/80 p-5"
            >
              <p className="text-[18px] font-semibold leading-none">Open shift</p>
              <p className="mt-1.5 text-[12.5px] text-white/60">Count the drawer and the wallet, then start.</p>
              <div className="mt-3.5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#1e293b]/60 px-3 py-2">
                <span className="w-8 h-8 rounded-lg bg-[#fbbf24]/10 grid place-items-center">
                  <MapPin className="w-4 h-4 text-[#fbbf24]" />
                </span>
                <span>
                  <span className="block text-[13.5px] leading-tight">Main shop</span>
                  <span className="block text-[11px] text-white/50">Register defaults here</span>
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { label: "Opening float", v: float, set: setFloat },
                  { label: "MoMo wallet", v: momo, set: setMomo },
                ].map((f) => (
                  <label key={f.label} className="block">
                    <span className="text-[12px] text-white/75">{f.label}</span>
                    <span className="mt-1 flex items-center gap-2 rounded-xl border border-white/10 bg-[#1e293b] px-3 h-10 focus-within:border-[#fbbf24]/60">
                      <span className="text-[11.5px] text-white/45">GHS</span>
                      <input
                        inputMode="numeric"
                        placeholder="0"
                        value={f.v}
                        onChange={(e) => f.set(e.target.value.replace(/[^\d]/g, "").slice(0, 7))}
                        className="w-full min-w-0 flex-1 bg-transparent outline-none text-[15px] tabular-nums placeholder:text-white/30"
                      />
                    </span>
                  </label>
                ))}
              </div>
              <button type="submit" className="mt-4 w-full h-10 rounded-xl bg-[#fbbf24] text-black font-semibold text-[14px] hover:bg-[#f59e0b]">
                Open shift &amp; start
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="count" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col bg-[#f6f7f9] text-[#0f172a]">
            <header className="shrink-0 flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 bg-[#0b1020] text-white">
              <span className="text-[11px] tracking-[0.2em] text-[#fbbf24]">PRIMETIJARA</span>
              <span className="text-[13px]">Stock take</span>
              <span className="ml-auto text-[11.5px] text-white/60 tabular-nums">
                Shift open. Float GHS {fmt(Number(float) || 0)}, MoMo GHS {fmt(Number(momo) || 0)}
              </span>
            </header>
            <div className="flex-1 min-h-0 overflow-y-auto p-3 @[640px]:px-5 @[640px]:py-3">
              <div className="flex items-end justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-[18px] font-semibold">Hardware &amp; Fasteners</p>
                  <p className="text-[12.5px] text-slate-500">Count what is on the shelf. Variance posts to stock on hand.</p>
                </div>
                <p className="text-[12.5px] text-slate-500 tabular-nums">
                  {counted.length}/{SKUS.length} counted
                </p>
              </div>
              <ul className="mt-3 rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
                {SKUS.map((s) => {
                  const c = counts[s.sku];
                  const low = c !== undefined && c < ALERT_AT;
                  return (
                    <li key={s.sku} className="flex items-center gap-3 px-3 @[640px]:px-4 py-1.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-medium">{s.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{s.sku}</p>
                      </div>
                      <span className="hidden @[520px]:block text-[12px] text-slate-500 w-[86px]">On hand 0 box</span>
                      <div className="flex items-center gap-1.5">
                        <button type="button" aria-label={`One fewer ${s.name}`} onClick={() => set(s.sku, -1)} disabled={step === "posted"} className="w-8 h-8 rounded-lg border border-slate-200 grid place-items-center hover:bg-slate-50 disabled:opacity-40">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-[14px] font-semibold tabular-nums">{c ?? "-"}</span>
                        <button type="button" aria-label={`One more ${s.name}`} onClick={() => set(s.sku, 1)} disabled={step === "posted"} className="w-8 h-8 rounded-lg border border-slate-200 grid place-items-center hover:bg-slate-50 disabled:opacity-40">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span
                        className={`w-[88px] shrink-0 whitespace-nowrap text-center text-[11px] font-medium rounded-full px-2 py-0.5 ${
                          c === undefined ? "bg-red-50 text-red-600" : low ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {c === undefined || c === 0 ? "Out of stock" : low ? "Low stock" : "In stock"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <footer className="shrink-0 flex items-center gap-3 px-3 @[640px]:px-5 py-3 border-t border-slate-200 bg-white">
              {step === "posted" ? (
                <p className="flex items-center gap-2 text-[13px] text-emerald-700">
                  <Check className="w-4 h-4" /> Posted: {counted.length} SKUs, +{boxes} boxes on hand.
                </p>
              ) : (
                <p className="text-[12.5px] text-slate-500 tabular-nums">Variance +{boxes} boxes</p>
              )}
              <button
                type="button"
                disabled={!counted.length || step === "posted"}
                onClick={() => {
                  setStep("posted");
                  emit("ledger", "stock.counted", `PrimeTijara +${boxes} boxes`);
                }}
                className="ml-auto inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#fbbf24] text-black font-semibold text-[13.5px] disabled:opacity-40"
              >
                <ClipboardCheck className="w-4 h-4" /> Post count
              </button>
              {step === "posted" && (
                <button
                  type="button"
                  onClick={() => {
                    setCounts({});
                    setStep("shift");
                  }}
                  className="h-10 px-3 rounded-xl border border-slate-200 text-[13px]"
                >
                  Start over
                </button>
              )}
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
