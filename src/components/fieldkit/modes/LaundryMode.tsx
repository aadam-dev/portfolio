"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Plus, ScanLine } from "lucide-react";
import { emit } from "../events";
import { ANNUR } from "../items";
import { useNotify } from "../hardware/Phone";

const NAVY = "#24206b";
const CUSTOMER = "Portfolio Demo";
type Step = "counter" | "checkout" | "workstation" | "collect" | "tracked";

const money = (n: number) => `GHS ${n.toFixed(2)}`;

function readyBy() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return `${d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}, 5:00 pm`;
}

export default function LaundryMode() {
  const reduce = useReducedMotion();
  const notify = useNotify();
  const [step, setStep] = useState<Step>("counter");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [pay, setPay] = useState<"Pay now" | "At pickup">("At pickup");
  const [stage, setStage] = useState(0);
  const [no, setNo] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  const [day] = useState(() => {
    const d = new Date();
    return { stamp: `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`, ready: readyBy() };
  });
  const ticket = `AB-${day.stamp}-${String(no).padStart(4, "0")}`;
  const lines = ANNUR.garments.filter((g) => qty[g.id]);
  const pieces = lines.reduce((a, g) => a + qty[g.id], 0);
  const total = lines.reduce((a, g) => a + qty[g.id] * g.price, 0);

  const add = (id: string) => setQty((q) => ({ ...q, [id]: (q[id] ?? 0) + 1 }));

  const confirm = () => {
    setStep("workstation");
    setStage(0);
    emit("laundry", "ticket.created", `${ticket} · ${pieces} pcs · ${money(total)} · ${pay.toLowerCase()}`);
  };

  const move = () => {
    const next = stage + 1;
    setStage(next);
    const s = ANNUR.stages[next];
    setToast(`${ticket} is now ${s.name.toLowerCase()}`);
    emit("laundry", `stage.${s.id}`, ticket);
    if (s.id === "ready") {
      notify({
        app: "Messages",
        icon: ANNUR.logo,
        title: "An-Nur Royal Laundry",
        body: `Your order #${String(no).padStart(4, "0")} is ready. ${pieces} pcs · ${money(total)}${pay === "At pickup" ? " due at pickup" : " paid"}.`,
      });
      emit("laundry", "sms.sent", `${ticket} ready for pickup`);
    }
  };

  const release = () => {
    setStep("tracked");
    emit("laundry", "ticket.collected", `${ticket} · released to ${CUSTOMER}`);
  };

  const reset = () => {
    setQty({});
    setStep("counter");
    setStage(0);
    setNo((n) => n + 1);
  };

  const screen = { initial: reduce ? { opacity: 0 } : { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: reduce ? { opacity: 0 } : { opacity: 0, x: -24 }, transition: { duration: 0.22 } };

  return (
    <div className="relative h-full bg-[#f6f6fb] text-[#16143a] font-body text-[11px]">
      {/* app bar */}
      <div className="h-[44px] flex items-center gap-2 px-3 bg-white border-b border-black/[0.06]">
        <Image unoptimized src={ANNUR.logo} alt="" width={26} height={26} className="rounded-[7px]" />
        <div className="leading-tight">
          <div className="text-[11.5px] font-semibold">
            An-Nur <span className="text-[#c99a2e]">Royal</span>
          </div>
          <div className="text-[9px] text-black/45">
            {step === "counter" || step === "checkout" ? "Counter · new drop-off" : step === "tracked" ? "Track your order" : "Workstation"}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === "counter" && (
          <motion.div key="counter" {...screen} className="absolute inset-x-0 top-[44px] bottom-0 flex flex-col">
            <div className="flex gap-1 px-3 pt-2 overflow-x-auto scrollbar-none">
              {ANNUR.services.map((s, i) => (
                <span
                  key={s}
                  title={i ? "This demo uses the wash + iron price list" : undefined}
                  className={`shrink-0 h-[24px] px-2.5 rounded-full text-[9.5px] leading-[24px] ${i === 0 ? "bg-white shadow-sm font-semibold" : "text-black/35"}`}
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-3 py-2">
              <div className="grid grid-cols-3 gap-1.5">
                {ANNUR.garments.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => add(g.id)}
                    aria-label={`Add ${g.name}`}
                    className="relative text-left rounded-[10px] bg-white border border-black/[0.07] overflow-hidden active:scale-[0.97] transition-transform"
                  >
                    <span className="relative block aspect-square">
                      <Image unoptimized src={g.img} alt="" fill sizes="90px" className="object-contain p-1" />
                    </span>
                    <span className="block px-1.5 pb-1.5">
                      <span className="block text-[9px] font-medium truncate">{g.name}</span>
                      <span className="flex items-center justify-between">
                        <span className="text-[8.5px] font-semibold" style={{ color: NAVY }}>
                          {"from" in g ? "from " : ""}
                          {money(g.price)}
                        </span>
                        <Plus className="w-3 h-3 text-black/35" />
                      </span>
                    </span>
                    {qty[g.id] ? (
                      <span className="absolute top-1 right-1 min-w-[16px] h-[16px] rounded-full bg-[#e0a92e] text-[9px] font-bold grid place-items-center text-black">
                        {qty[g.id]}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-3 pt-2 pb-5 bg-white border-t border-black/[0.06]">
              <div className="flex items-baseline justify-between">
                <span className="text-[9.5px] text-black/50">
                  {pieces} piece{pieces === 1 ? "" : "s"} · Total
                </span>
                <span className="text-[16px] font-semibold tabular-nums">{money(total)}</span>
              </div>
              <button
                type="button"
                onClick={() => pieces && setStep("checkout")}
                disabled={!pieces}
                className="mt-1.5 w-full h-[34px] rounded-[10px] text-white text-[11.5px] font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
                style={{ background: NAVY }}
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === "checkout" && (
          <motion.div key="checkout" {...screen} className="absolute inset-x-0 top-[44px] bottom-0 flex flex-col px-3 pt-3 pb-5">
            <div className="text-[13px] font-semibold">Checkout</div>
            <div className="text-[9.5px] text-black/45">
              {CUSTOMER} · {pieces} pieces
            </div>
            <ul className="mt-2 space-y-1 flex-1 min-h-0 overflow-y-auto scrollbar-none">
              {lines.map((g) => (
                <li key={g.id} className="flex items-center gap-2 rounded-[9px] bg-white border border-black/[0.06] px-2 py-1.5">
                  <Image unoptimized src={g.img} alt="" width={28} height={28} className="object-contain" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10.5px] font-medium truncate">{g.name}</span>
                    <span className="block text-[8.5px] text-black/45">
                      Wash + iron · {money(g.price)} each
                    </span>
                  </span>
                  <span className="tabular-nums text-[10px]">×{qty[g.id]}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 rounded-[9px] bg-white border border-black/[0.06] px-2 py-1.5 text-[9.5px]">
              <div className="flex justify-between">
                <span className="text-black/45">Ready by</span>
                <span>{day.ready}</span>
              </div>
              <div className="mt-1.5 flex gap-1" role="group" aria-label="Payment">
                {(["Pay now", "At pickup"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPay(p)}
                    aria-pressed={pay === p}
                    className={`flex-1 h-[24px] rounded-[7px] border text-[9.5px] ${pay === p ? "border-[#24206b] bg-[#24206b]/[0.06] font-semibold" : "border-black/10 text-black/55"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-[9.5px] text-black/50">Total</span>
              <span className="text-[16px] font-semibold tabular-nums">{money(total)}</span>
            </div>
            <button
              type="button"
              onClick={confirm}
              className="mt-1.5 w-full h-[34px] rounded-[10px] text-white text-[11.5px] font-semibold"
              style={{ background: NAVY }}
            >
              Confirm drop-off
            </button>
          </motion.div>
        )}

        {(step === "workstation" || step === "collect") && (
          <motion.div key="ws" {...screen} className="absolute inset-x-0 top-[44px] bottom-0 flex flex-col px-3 pt-3 pb-5">
            <div className="rounded-[12px] bg-white border border-black/[0.06] p-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-black/50">{ticket}</span>
                <span
                  className="px-1.5 rounded-full text-[8.5px] font-semibold"
                  style={{ background: stage === 5 ? "#dcfce7" : "#eef", color: stage === 5 ? "#15803d" : NAVY }}
                >
                  {ANNUR.stages[stage].name}
                </span>
              </div>
              <div className="mt-0.5 text-[12px] font-semibold">{CUSTOMER}</div>
              <div className="text-[9px] text-black/45">
                {pieces} pcs · 1 basket · rack A1 · Wash + iron · {money(total)}
              </div>
              <div className="mt-1.5 flex gap-1">
                {lines.slice(0, 5).map((g) => (
                  <Image unoptimized key={g.id} src={g.img} alt="" width={22} height={22} className="object-contain rounded bg-[#f6f6fb]" />
                ))}
              </div>
            </div>

            <ol className="mt-3 space-y-1.5">
              {ANNUR.stages.map((s, i) => {
                const done = i < stage;
                const now = i === stage;
                return (
                  <li key={s.id} className={`flex items-center gap-2.5 rounded-[10px] px-2 py-1 transition-colors ${now ? "bg-white border border-black/[0.08] shadow-sm" : ""}`}>
                    <Image unoptimized src={s.img} alt="" width={26} height={26} className={`rounded-[6px] ${i > stage ? "opacity-35 grayscale" : ""}`} />
                    <span className={`flex-1 text-[11px] ${i > stage ? "text-black/35" : "font-medium"}`}>{s.name}</span>
                    {done && <Check className="w-3.5 h-3.5 text-[#16a34a]" />}
                    {now && !reduce && i < 5 && <span className="w-1.5 h-1.5 rounded-full bg-[#e0a92e] animate-pulse" />}
                  </li>
                );
              })}
            </ol>

            <div className="mt-auto">
              <AnimatePresence>
                {toast && step === "workstation" && (
                  <motion.div
                    key={toast}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-2 flex items-center gap-1.5 rounded-[9px] bg-[#16143a] text-white px-2.5 py-1.5 text-[9.5px]"
                  >
                    <Check className="w-3 h-3 text-[#4ade80]" /> {toast}
                  </motion.div>
                )}
              </AnimatePresence>
              {stage < 5 ? (
                <button
                  type="button"
                  onClick={move}
                  className="w-full h-[34px] rounded-[10px] text-white text-[11.5px] font-semibold inline-flex items-center justify-center gap-1.5"
                  style={{ background: NAVY }}
                >
                  Move to {ANNUR.stages[stage + 1].name.toLowerCase()} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : step === "workstation" ? (
                <button
                  type="button"
                  onClick={() => setStep("collect")}
                  className="w-full h-[34px] rounded-[10px] bg-white border border-black/10 text-[11.5px] font-semibold inline-flex items-center justify-center gap-1.5"
                >
                  <ScanLine className="w-3.5 h-3.5" /> Scan or find
                </button>
              ) : (
                <button
                  type="button"
                  onClick={release}
                  className="w-full h-[34px] rounded-[10px] text-white text-[11.5px] font-semibold inline-flex items-center justify-center gap-1.5"
                  style={{ background: NAVY }}
                >
                  Release to customer <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {step === "tracked" && (
          <motion.div key="tracked" {...screen} className="absolute inset-x-0 top-[44px] bottom-0 flex flex-col px-3 pt-3 pb-5">
            <div className="text-center text-[8.5px] tracking-[0.16em] uppercase text-black/40">An-Nur Royal Laundry</div>
            <div className="text-center text-[15px] font-semibold mt-0.5">Track your order</div>
            <div className="mt-2.5 rounded-[14px] overflow-hidden bg-white border border-black/[0.06]">
              <div className="px-3 py-2.5 text-white" style={{ background: NAVY }}>
                <div className="text-[9px] opacity-70">Good evening, Portfolio</div>
                <div className="text-[14px] font-semibold">Collected. Thank you</div>
                <div className="font-mono text-[8.5px] opacity-60 mt-0.5">{ticket}</div>
              </div>
              <ol className="px-3 py-2 space-y-1.5">
                {["Received", "Cleaning", "Quality check", "Ready", "Collected"].map((s) => (
                  <li key={s} className="flex items-center gap-2 text-[10.5px]">
                    <span className="w-4 h-4 rounded-full grid place-items-center text-white" style={{ background: NAVY }}>
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="px-3 pb-2.5 text-[9.5px] space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-black/45">Estimated total</span>
                  <span className="font-semibold">{money(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/45">Payment</span>
                  <span className="font-semibold">Paid</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={reset} className="mt-auto w-full h-[34px] rounded-[10px] bg-white border border-black/10 text-[11.5px] font-semibold">
              New drop-off
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
