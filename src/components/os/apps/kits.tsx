"use client";

import Link from "next/link";
import { useState } from "react";
import { KITS } from "../content";

/** Starter kits: packaged ways to start, each ending in a message to me. No prices; every business is scoped on a call. */
export default function KitsApp({ file, live, onStart, compact }: { file?: string; live: boolean; onStart: (kitName: string) => void; compact?: boolean }) {
  const [id, setId] = useState(file ?? KITS[0].id);
  const kit = KITS.find((k) => k.id === id) ?? KITS[0];
  const tab = live ? 0 : -1;
  return (
    <div className={compact ? "flex flex-col" : "flex h-full"}>
      <nav aria-label="Kits" className={compact ? "flex shrink-0 gap-1 overflow-x-auto border-b border-white/10 p-2 [scrollbar-width:none]" : "w-[170px] shrink-0 space-y-1 border-r border-white/10 p-2"}>
        {KITS.map((k) => (
          <button key={k.id} tabIndex={tab} onClick={() => setId(k.id)} aria-current={k.id === id} className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] ${compact ? "shrink-0" : "w-full"} ${k.id === id ? "bg-white/15" : "hover:bg-white/[0.06]"}`}>
            <span className="grid h-6 w-6 place-items-center rounded-md text-[11px] text-white" style={{ background: k.tone }}>
              ◆
            </span>
            {k.name}
          </button>
        ))}
      </nav>
      <div className={`min-w-0 flex-1 p-5 ${compact ? "" : "overflow-y-auto"}`} data-lenis-prevent>
        <div className="rounded-2xl p-5 text-white" style={{ background: kit.tone }}>
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">Starter kit · {kit.weeks}</p>
          <h3 className="mt-1 text-[24px] font-semibold tracking-tight">{kit.name}</h3>
          <p className="mt-1 text-[14px] text-white/90">{kit.line}</p>
        </div>
        <h4 className="mt-5 text-[11px] uppercase tracking-[0.16em] text-white/45">What you get</h4>
        <ul className="mt-2 space-y-1.5 text-[13.5px]">
          {kit.includes.map((x) => (
            <li key={x} className="flex gap-2">
              <span className="text-[var(--accent-2)]">✓</span>
              {x}
            </li>
          ))}
        </ul>
        <h4 className="mt-5 text-[11px] uppercase tracking-[0.16em] text-white/45">Built before for</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {kit.proof.map((p) => (
            <Link key={p.href} href={p.href} tabIndex={tab} className="rounded-full border border-white/15 px-3 py-1 text-[12.5px] hover:bg-white/10">
              {p.label} ↗
            </Link>
          ))}
        </div>
        <button tabIndex={tab} onClick={() => onStart(kit.name)} className="mt-6 rounded-md bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-black">
          Start with this kit
        </button>
        <p className="mt-2 text-[11.5px] text-white/45">No price list: every business is different, so the first step is a short call.</p>
      </div>
    </div>
  );
}
