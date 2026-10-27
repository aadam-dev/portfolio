"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import Receipt, { PrinterContext, type Paper } from "../Receipt";

/**
 * Countertop POS: a 4:3 touch terminal on a stand, with a separate 58mm
 * thermal printer beside it. Children render on the terminal's screen and
 * print through usePrinter().
 */
export default function PosTerminal({
  children,
  base,
  screenClass = "h-[480px] @[560px]/pos:h-[340px]",
}: {
  children: ReactNode;
  /** Hardware controls on the base (e.g. a slide switch). */
  base?: ReactNode;
  screenClass?: string;
}) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const seq = useRef(0);
  const print = useCallback((p: Omit<Paper, "id">) => {
    seq.current += 1;
    setPaper({ ...p, id: seq.current });
  }, []);

  return (
    <PrinterContext.Provider value={print}>
      <div className="@container/pos relative w-full">
        <div className="relative flex flex-col @[560px]/pos:flex-row @[560px]/pos:items-end gap-3">
          {/* Terminal */}
          <div className="relative flex-1 min-w-0">
            <div
              className="relative rounded-[18px] p-[9px]"
              style={{
                background: "linear-gradient(180deg, #2b2b2e 0%, #18181a 60%, #111113 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.6), 0 30px 60px -28px rgba(0,0,0,0.55), 0 10px 22px -12px rgba(0,0,0,0.4)",
              }}
            >
              <span className="absolute top-[3px] left-1/2 -ml-[2px] w-[4px] h-[4px] rounded-full bg-[#0a0a0b] ring-1 ring-white/10" aria-hidden="true" />
              <div className={`theme-fixed @container relative overflow-hidden rounded-[7px] bg-white ${screenClass}`}>
                {children}
                {/* glass */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 38%)" }}
                />
              </div>
            </div>
            {/* stand */}
            <div className="relative mx-auto w-[34%] h-[30px]" aria-hidden="true">
              <div
                className="absolute inset-x-[22%] top-0 bottom-[8px]"
                style={{ background: "linear-gradient(90deg, #1c1c1e, #303033 50%, #1c1c1e)" }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-[10px] rounded-[6px]"
                style={{
                  background: "linear-gradient(180deg, #343437, #1a1a1c)",
                  boxShadow: "0 8px 14px -6px rgba(0,0,0,0.5)",
                }}
              />
            </div>
          </div>

          {/* Thermal printer */}
          <div className="relative self-end @[560px]/pos:self-auto w-[150px] shrink-0 order-first @[560px]/pos:order-none">
            <Receipt paper={paper} onTear={() => setPaper(null)} />
            <div
              className="relative h-[86px] rounded-[16px] rounded-b-[10px]"
              style={{
                background: "linear-gradient(180deg, #303033 0%, #1d1d1f 70%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.14), 0 22px 30px -18px rgba(0,0,0,0.55), 0 6px 10px -6px rgba(0,0,0,0.4)",
              }}
              aria-hidden="true"
            >
              {/* paper exit and tear bar */}
              <span className="absolute left-[12px] right-[12px] top-[11px] h-[4px] rounded-full bg-[#060607] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
              <span className="absolute left-[10px] right-[10px] top-[16px] h-[2px] rounded-full bg-[#4a4a4e]" />
              <span className="absolute left-[14px] bottom-[14px] w-[5px] h-[5px] rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80]" />
              <span className="absolute right-[14px] bottom-[12px] w-[22px] h-[9px] rounded-[3px] bg-[#262628] shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
            </div>
          </div>
        </div>
        {base && <div className="mt-3 flex justify-center">{base}</div>}
      </div>
    </PrinterContext.Provider>
  );
}
