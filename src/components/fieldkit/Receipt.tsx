"use client";

import { createContext, useContext } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export interface Paper {
  id: number;
  logo?: string;
  head: string;
  sub?: string;
  lines: { l: string; r?: string }[];
  total?: { l: string; r: string };
  foot?: string[];
}

type PrintFn = (p: Omit<Paper, "id">) => void;
export const PrinterContext = createContext<PrintFn>(() => {});
export const usePrinter = () => useContext(PrinterContext);

/**
 * 58mm thermal paper feeding up out of the printer slot. It grows from the
 * slot (bottom-anchored), settles with a spring and tears off on tap.
 */
export default function Receipt({ paper, onTear }: { paper: Paper | null; onTear: () => void }) {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute bottom-[73px] left-[14px] right-[14px] z-30 flex justify-center overflow-hidden pt-6">
      <AnimatePresence mode="wait">
        {paper && (
          <motion.div
            key={paper.id}
            className="pointer-events-auto w-full"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }}
            // a thermal head feeds at a constant speed
            transition={reduce ? { duration: 0 } : { duration: 1.5, ease: "linear" }}
          >
            <button
              type="button"
              onClick={onTear}
              aria-label="Tear off the printout"
              className="fk-paper block w-full text-left px-2.5 pt-3 pb-2 font-mono text-[8.5px] leading-[1.45] max-h-[min(420px,52vh)] overflow-y-auto scrollbar-none"
            >
              {paper.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={paper.logo} alt="" width={28} height={28} className="mx-auto mb-1 w-7 h-7 grayscale contrast-150 mix-blend-multiply" />
              )}
              <span className="block text-center text-[9.5px] font-bold tracking-[0.08em] uppercase">{paper.head}</span>
              {paper.sub && <span className="block text-center opacity-70 mb-1">{paper.sub}</span>}
              <span className="block border-t border-dashed border-black/40 my-1" />
              {paper.lines.map((ln, i) => (
                <span key={i} className="flex justify-between gap-2">
                  <span className="min-w-0">{ln.l}</span>
                  {ln.r && <span className="tabular-nums shrink-0">{ln.r}</span>}
                </span>
              ))}
              {paper.total && (
                <>
                  <span className="block border-t border-dashed border-black/40 my-1" />
                  <span className="flex justify-between font-bold text-[9.5px]">
                    <span>{paper.total.l}</span>
                    <span className="tabular-nums">{paper.total.r}</span>
                  </span>
                </>
              )}
              {paper.foot?.map((f, i) => (
                <span key={i} className="block text-center opacity-70 mt-1">
                  {f}
                </span>
              ))}
              <span className="block text-center opacity-40 mt-1.5 text-[7.5px] tracking-[0.18em] uppercase">tap to tear</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
