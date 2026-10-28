"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AREAS, PANELS, type AreaId } from "@/lib/rockmotion";

export const checkKey = (a: AreaId, i: number) => `${a}:${i}`;

export default function Inspection({
  area,
  setArea,
  checks,
  toggleCheck,
  damaged,
  togglePanel,
  reset,
}: {
  area: AreaId | null;
  setArea: (a: AreaId | null) => void;
  checks: Set<string>;
  toggleCheck: (k: string) => void;
  damaged: Set<string>;
  togglePanel: (p: string) => void;
  reset: () => void;
}) {
  const total = AREAS.reduce((n, a) => n + a.checks.length, 0);
  const i = AREAS.findIndex((a) => a.id === area);
  const a = AREAS[i];
  const done = (id: AreaId) => AREAS.find((x) => x.id === id)!.checks.filter((_, j) => checks.has(checkKey(id, j))).length;

  return (
    <div>
      {!a ? (
        <>
          <p className="text-[14px] leading-relaxed text-[var(--ink-2)]">
            What an inspector photographs and checks before you pay, for a buyer who will never stand next to the car. Tap a number on the car or pick an area.
          </p>
          <ol className="mt-4 flex flex-col gap-2">
            {AREAS.map((x, j) => (
              <li key={x.id}>
                <button type="button" onClick={() => setArea(x.id)} className="card card-link w-full !flex-row items-center gap-3 px-4 py-3">
                  <span className="grid place-items-center w-7 h-7 rounded-full bg-[var(--tint)] text-[12px] font-semibold tabular-nums">{j + 1}</span>
                  <span className="flex-1 text-[14px]">{x.label}</span>
                  <span className="text-[12px] text-[var(--ink-3)] tabular-nums">
                    {done(x.id)}/{x.checks.length}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => setArea(null)} className="inline-flex items-center gap-1.5 text-[13px] text-[var(--ink-3)] hover:text-[var(--foreground)]">
              <ArrowLeft className="w-3.5 h-3.5" /> All areas
            </button>
            <span className="text-[12px] text-[var(--ink-3)] tabular-nums">
              Area {i + 1} of {AREAS.length}
            </span>
          </div>
          <h3 className="mt-3 card-title">{a.label}</h3>
          <p className="card-text">{a.why}</p>
          <ul className="mt-4 flex flex-col gap-1.5">
            {a.checks.map((c, j) => {
              const k = checkKey(a.id, j);
              const on = checks.has(k);
              return (
                <li key={k}>
                  <button type="button" role="checkbox" aria-checked={on} onClick={() => toggleCheck(k)} className="w-full flex items-start gap-3 rounded-[var(--radius-field)] px-3 py-2.5 text-left hover:bg-[var(--tint)] transition-colors">
                    <span className={`mt-px grid place-items-center w-[18px] h-[18px] shrink-0 rounded-[5px] border transition-colors ${on ? "bg-[#2f6bff] border-[#2f6bff] text-white" : "border-[var(--line-strong)] text-transparent"}`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <span className={`text-[13.5px] leading-snug ${on ? "text-[var(--foreground)]" : "text-[var(--ink-2)]"}`}>{c}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {a.id === "body" && (
            <div className="mt-5">
              <p className="label">Mark damage (tap the car or a panel here)</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(PANELS).map(([node, label]) => (
                  <button key={node} type="button" className={`pill !h-8 !text-[12.5px] ${damaged.has(node) ? "!bg-[#e8a13a] !border-[#e8a13a] !text-black" : ""}`} aria-pressed={damaged.has(node)} onClick={() => togglePanel(node)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button type="button" onClick={() => setArea(AREAS[(i + 1) % AREAS.length].id)} className="btn btn-line mt-6 w-full">
            Next: {AREAS[(i + 1) % AREAS.length].label} <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}

      <div className="mt-6 pt-4 border-t border-[var(--line)]" aria-live="polite">
        <div className="flex items-baseline justify-between">
          <p className="stat-label">Inspection report</p>
          {(checks.size > 0 || damaged.size > 0) && (
            <button type="button" onClick={reset} className="text-[12px] text-[var(--ink-3)] hover:text-[var(--foreground)]">
              Clear
            </button>
          )}
        </div>
        <div className="mt-2 h-1 rounded-full bg-[var(--tint)] overflow-hidden">
          <div className="h-full bg-[#2f6bff] transition-[width] duration-500" style={{ width: `${(checks.size / total) * 100}%` }} />
        </div>
        <p className="mt-2 text-[13px] text-[var(--ink-2)] tabular-nums">
          {checks.size} of {total} checks passed.{" "}
          {damaged.size ? `Damage on ${[...damaged].map((p) => PANELS[p].toLowerCase()).join(", ")}: ask for close-ups and a paint-depth reading.` : "No damage marked."}
        </p>
      </div>
    </div>
  );
}
