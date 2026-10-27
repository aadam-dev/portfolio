"use client";

import type { ReactNode } from "react";

/** Generic laptop: black-bezel lid with a browser window, aluminium base lip. */
export default function Laptop({
  children,
  url,
  screenClass = "h-[470px] @[520px]/lap:h-[352px]",
}: {
  children: ReactNode;
  url?: string;
  screenClass?: string;
}) {
  return (
    <div className="@container/lap relative w-full">
      <div className="relative mx-auto w-[94%]">
        <div
          className="relative rounded-t-[16px] rounded-b-[4px] p-[11px] pb-[13px]"
          style={{
            background: "linear-gradient(180deg, #1b1b1d, #0c0c0d)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 0 1.5px var(--hw-alu-lo)",
          }}
        >
          <span className="absolute top-[4px] left-1/2 -ml-[2px] w-[4px] h-[4px] rounded-full bg-[#222] ring-1 ring-white/10" aria-hidden="true" />
          <div className={`theme-fixed relative overflow-hidden rounded-[4px] bg-[#f6f6f7] flex flex-col ${screenClass}`}>
            {url && (
              <div className="shrink-0 h-[24px] flex items-center gap-2 px-2.5 bg-[#e9e9ec] border-b border-black/10" aria-hidden="true">
                <span className="flex gap-[5px]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#ff5f57]" />
                  <span className="w-[8px] h-[8px] rounded-full bg-[#febc2e]" />
                  <span className="w-[8px] h-[8px] rounded-full bg-[#28c840]" />
                </span>
                <span className="mx-auto w-[58%] h-[15px] rounded-[5px] bg-white text-[9px] leading-[15px] text-black/55 text-center truncate px-2">
                  {url}
                </span>
                <span className="w-[31px]" />
              </div>
            )}
            <div className="@container relative flex-1 min-h-0">{children}</div>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 35%)" }}
            />
          </div>
        </div>
      </div>
      {/* base */}
      <div className="relative h-[15px]" aria-hidden="true">
        <div
          className="absolute inset-0 rounded-b-[14px] rounded-t-[2px]"
          style={{
            background: "linear-gradient(180deg, var(--hw-alu-hi) 0%, var(--hw-alu) 45%, var(--hw-alu-lo) 100%)",
            boxShadow: "0 22px 34px -18px rgba(0,0,0,0.55), 0 6px 10px -6px rgba(0,0,0,0.35)",
          }}
        />
        <span className="absolute top-0 left-1/2 -ml-[44px] w-[88px] h-[6px] rounded-b-[8px] bg-[var(--hw-alu-lo)] opacity-70" />
      </div>
    </div>
  );
}
