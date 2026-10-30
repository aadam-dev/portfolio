"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Receipt as ReceiptData } from "./modes/CounterMode";

const money = (n: number) => n.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Paper strip that feeds out of the slot on top of the device. */
export default function Receipt({
  receipt,
  onTear,
  tearLabel,
}: {
  receipt: ReceiptData | null;
  onTear: () => void;
  tearLabel: string;
}) {
  const reduce = useReducedMotion();

  // Tear it off on its own after a while so it never blocks the page.
  useEffect(() => {
    if (!receipt) return;
    const t = setTimeout(onTear, 9000);
    return () => clearTimeout(t);
  }, [receipt, onTear]);

  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 w-[188px] overflow-hidden pb-0 z-10" style={{ height: 240 }}>
      <AnimatePresence>
        {receipt && (
          <motion.button
            key={receipt.no}
            type="button"
            onClick={onTear}
            aria-label={tearLabel}
            className="fk-paper pointer-events-auto absolute bottom-0 left-0 right-0 px-3.5 pt-4 pb-3 text-left font-mono text-[10px] leading-[1.45]"
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={
              reduce
                ? { opacity: 1 }
                : { y: ["100%", "62%", "60%", "28%", "26%", "0%"], x: [0, 0.6, -0.6, 0.4, -0.3, 0] }
            }
            exit={reduce ? { opacity: 0 } : { y: -30, opacity: 0, rotate: -4 }}
            transition={reduce ? { duration: 0.2 } : { duration: 1.1, ease: "linear" }}
          >
            <span className="block text-center font-semibold tracking-[0.2em]">AL BOYUT · ACCRA</span>
            <span className="block text-center text-[#1b1a17]/55">Receipt #{String(receipt.no).padStart(4, "0")}</span>
            <span className="block my-1.5 border-t border-dashed border-[#1b1a17]/30" />
            {receipt.lines.map((l) => (
              <span key={l.name} className="flex justify-between gap-2">
                <span className="truncate">
                  {l.qty}× {l.name}
                </span>
                <span className="tabular-nums">{money(l.total)}</span>
              </span>
            ))}
            <span className="block my-1.5 border-t border-dashed border-[#1b1a17]/30" />
            <span className="flex justify-between font-semibold">
              <span>TOTAL GHS</span>
              <span className="tabular-nums">{money(receipt.total)}</span>
            </span>
            <span className="block mt-1.5 text-center text-[#1b1a17]/55">Stock updated · thank you</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
