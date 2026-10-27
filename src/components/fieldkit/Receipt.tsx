"use client";

import { createContext, useContext } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

export interface Paper {
  id: number;
  head: string;
  sub?: string;
  lines: { l: string; r?: string }[];
  total?: { l: string; r: string };
  foot?: string[];
}

type PrintFn = (p: Omit<Paper, "id">) => void;
export const PrinterContext = createContext<PrintFn>(() => {});
export const usePrinter = () => useContext(PrinterContext);

/** Perforated, slightly jittering paper strip that feeds out of the top slot. */
export default function Receipt({ paper, onTear }: { paper: Paper | null; onTear: () => void }) {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 w-[min(250px,78%)] flex justify-center">
      <AnimatePresence mode="wait">
        {paper && (
          <motion.div
            key={paper.id}
            className="pointer-events-auto w-full origin-bottom overflow-hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)", y: 18 }}
            animate={
              reduce
                ? { opacity: 1 }
                : { clipPath: "inset(0% 0 0 0)", y: 0, x: [0, -0.6, 0.5, -0.3, 0] }
            }
            exit={reduce ? { opacity: 0 } : { y: -60, rotate: -6, opacity: 0 }}
            transition={{
              duration: reduce ? 0.2 : 1.1,
              ease: EASE_OUT,
              x: { duration: 1.1, ease: "linear" },
            }}
          >
            <button
              type="button"
              onClick={onTear}
              aria-label="Tear off the printout"
              className="fk-paper block w-full text-left px-4 pt-4 pb-3 font-mono text-[10px] leading-[1.5] shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.35)] max-h-[min(380px,46vh)] overflow-y-auto scrollbar-none"
            >
              <span className="block text-center text-[11px] font-semibold tracking-[0.12em] uppercase">
                {paper.head}
              </span>
              {paper.sub && <span className="block text-center opacity-60 mb-1">{paper.sub}</span>}
              <span className="block border-t border-dashed border-current/30 my-1.5 opacity-40" />
              {paper.lines.map((ln, i) => (
                <span key={i} className="flex justify-between gap-3">
                  <span className="truncate">{ln.l}</span>
                  {ln.r && <span className="tabular-nums shrink-0">{ln.r}</span>}
                </span>
              ))}
              {paper.total && (
                <>
                  <span className="block border-t border-dashed my-1.5 opacity-40" />
                  <span className="flex justify-between font-semibold text-[11px]">
                    <span>{paper.total.l}</span>
                    <span className="tabular-nums">{paper.total.r}</span>
                  </span>
                </>
              )}
              {paper.foot?.map((f, i) => (
                <span key={i} className="block text-center opacity-60 mt-1">
                  {f}
                </span>
              ))}
              <span className="block text-center opacity-35 mt-2 text-[8.5px] tracking-[0.2em] uppercase">
                tap to tear
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
