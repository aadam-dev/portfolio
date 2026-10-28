"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { checkWorking, decode } from "@/lib/vin";
import { SAMPLE_VINS } from "@/lib/rockmotion";
import { emit } from "@/components/fieldkit/events";

interface Full {
  make: string;
  model: string;
  year: string;
  trim: string;
  body: string;
  engine: string;
  drive: string;
  plant: string;
  recalls: null | { count: number; items: { id: string; component: string }[] };
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-[var(--line)] last:border-0">
      <dt className="text-[13px] text-[var(--ink-3)]">{k}</dt>
      <dd className="text-[13.5px] text-right">{v}</dd>
    </div>
  );
}

export default function Vin({ vin, setVin }: { vin: string; setVin: (v: string) => void }) {
  const d = decode(vin);
  const w = checkWorking(vin);
  const [full, setFull] = useState<{ vin: string; data?: Full; error?: string; busy?: boolean } | null>(null);
  const shown = full?.vin === d.vin ? full : null;

  const lookup = async () => {
    if (!d.ok) return;
    setFull({ vin: d.vin, busy: true });
    emit("kit", "rockmotion.vin.nhtsa", d.vin.slice(0, 3));
    try {
      const r = await fetch(`/api/vin?vin=${d.vin}`);
      const j = await r.json();
      setFull(r.ok ? { vin: d.vin, data: j } : { vin: d.vin, error: j.error });
    } catch {
      setFull({ vin: d.vin, error: "Could not reach NHTSA. The decode above still stands." });
    }
  };

  return (
    <div>
      <label className="block">
        <span className="label">Vehicle identification number</span>
        <input
          value={vin}
          onChange={(e) => setVin(e.target.value.toUpperCase().slice(0, 20))}
          onBlur={() => d.ok && emit("kit", "rockmotion.vin", d.vin.slice(0, 3))}
          spellCheck={false}
          autoCapitalize="characters"
          inputMode="text"
          className="field mt-1.5 font-mono tracking-[0.12em] text-[15px]"
          aria-describedby="vin-help"
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {SAMPLE_VINS.map((s) => (
          <button
            key={s.vin}
            type="button"
            className="pill !h-8 !text-[12.5px]"
            aria-pressed={vin === s.vin}
            onClick={() => {
              setVin(s.vin);
              emit("kit", "rockmotion.vin", s.vin.slice(0, 3));
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p id="vin-help" className="mt-2 text-[12px] text-[var(--ink-3)]">
        Samples follow each maker&apos;s pattern with made-up serials. It sits on the dash under the windscreen, and on the driver&apos;s door pillar.
      </p>

      {!d.ok ? (
        <p className="mt-5 text-[13.5px] text-[#f0b45a]" role="status">
          {d.error}
        </p>
      ) : (
        <>
          <dl className="mt-5" aria-live="polite">
            <Row k="Maker" v={d.maker} />
            <Row k="Built in" v={d.country} />
            <Row k="Model year" v={d.year ?? "Unknown"} />
            <Row k="Plant code" v={<span className="font-mono">{d.plant}</span>} />
            <Row k="Serial" v={<span className="font-mono">{d.serial}</span>} />
            <Row
              k="Check digit"
              v={
                d.valid ? (
                  <span className="inline-flex items-center gap-1 text-[#6fd39a]">
                    <Check className="w-3.5 h-3.5" /> {d.found} is correct
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[#f0b45a]">
                    <X className="w-3.5 h-3.5" /> should be {d.expected}, not {d.found}
                  </span>
                )
              }
            />
          </dl>

          <details className="mt-4 group">
            <summary className="cursor-pointer text-[13px] text-[var(--ink-2)] hover:text-[var(--foreground)]">How the check digit works</summary>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-3)]">
              Each character gets a value (letters by a fixed table) and is multiplied by its position&apos;s weight. The sum divided by 11 leaves the digit; 10 is written X. One mistyped character almost always breaks it.
            </p>
            <div className="mt-3 grid grid-cols-[repeat(17,minmax(0,1fr))] gap-px text-center font-mono tabular-nums text-[10.5px]">
              {w.cells.map((c, i) => (
                <div key={i} className={`py-1 rounded-[4px] ${i === 8 ? "bg-[#2f6bff]/25" : "bg-[var(--tint)]"}`}>
                  <div className="text-[12px] text-[var(--foreground)]">{c.c}</div>
                  <div className="text-[var(--ink-3)]">{c.value ?? "?"}</div>
                  <div className="text-[var(--ink-4)]">×{c.weight}</div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[12.5px] text-[var(--ink-2)] tabular-nums">
              Sum {w.sum}, divided by 11 leaves {w.remainder}, so position 9 should be {w.remainder === 10 ? "X" : w.remainder}.
            </p>
          </details>

          <div className="mt-6 card !bg-[var(--tint)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13.5px] font-medium">Full decode from NHTSA</p>
              <button type="button" className="btn btn-line !h-9 !px-4 !text-[13px]" onClick={lookup} disabled={shown?.busy}>
                {shown?.busy ? "Looking up" : shown?.data ? "Again" : "Look it up"}
              </button>
            </div>
            {shown?.error && <p className="mt-3 text-[13px] text-[#f0b45a]">{shown.error}</p>}
            {shown?.data && (
              <>
                <dl className="mt-2">
                  {[
                    ["Vehicle", [shown.data.year, shown.data.make, shown.data.model, shown.data.trim].filter(Boolean).join(" ")],
                    ["Body", shown.data.body],
                    ["Engine", shown.data.engine],
                    ["Drive", shown.data.drive],
                    ["Plant", shown.data.plant],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <Row key={k} k={k} v={v} />
                    ))}
                </dl>
                {shown.data.recalls && (
                  <p className="mt-3 text-[13px] text-[var(--ink-2)]">
                    {shown.data.recalls.count} recall{shown.data.recalls.count === 1 ? "" : "s"} on record for this model and year
                    {shown.data.recalls.items.length > 0 && <>, including {shown.data.recalls.items.map((x) => x.component.toLowerCase()).join("; ")}</>}. Each one has to be checked as fixed on this car.
                  </p>
                )}
              </>
            )}
            {!shown && <p className="mt-2 text-[12.5px] text-[var(--ink-3)]">Model, trim, engine and plant from the US government&apos;s public decoder, with any recalls on that model.</p>}
          </div>

          <div className="mt-6">
            <p className="text-[13.5px] font-medium">Then the history report</p>
            <p className="mt-1 text-[12.5px] text-[var(--ink-3)]">Run before any deposit. This demo shows the layout only; it holds no records.</p>
            <ul className="mt-3 text-[13px]">
              {[
                ["Title brands", "salvage, rebuilt, flood, from NMVTIS"],
                ["Auction records", "sale dates and photos"],
                ["Reported accidents", "with damage area"],
                ["Odometer readings", "each one dated"],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between gap-4 py-2 border-b border-[var(--line)] last:border-0">
                  <span>{k}</span>
                  <span className="text-[var(--ink-3)] text-right">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
