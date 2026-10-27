"use client";

import type { ReactNode } from "react";

/** Landscape tablet in a dark bezel with a metal edge. */
export default function Tablet({
  children,
  screenClass = "h-[500px] @[520px]/tab:h-[380px]",
}: {
  children: ReactNode;
  screenClass?: string;
}) {
  return (
    <div className="@container/tab relative w-full">
      <div
        className="relative rounded-[30px] p-[2px]"
        style={{
          background: "linear-gradient(135deg, var(--hw-rail-hi), var(--hw-rail) 40%, var(--hw-rail-lo))",
          boxShadow: "0 36px 60px -30px rgba(0,0,0,0.6), 0 12px 24px -12px rgba(0,0,0,0.4)",
        }}
      >
        <div className="relative rounded-[28px] bg-black p-[16px]">
          <span className="absolute top-1/2 left-[6px] -mt-[2px] w-[4px] h-[4px] rounded-full bg-[#1d1d1f] ring-1 ring-white/10" aria-hidden="true" />
          <div className={`theme-fixed @container relative overflow-hidden rounded-[12px] bg-[#111] ${screenClass}`}>
            {children}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 40%)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
