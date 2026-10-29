"use client";

import { ArrowUpRight } from "lucide-react";
import { INSURANCE, landedCost, money, usd, type CostInput, type Destination } from "@/lib/rockmotion";

export const SEG_COLORS: Record<string, string> = {
  car: "#2f6bff",
  inland: "#8fb0ff",
  shipping: "#5fd0c5",
  duty: "#e8a13a",
  port: "#f07a6a",
};

export type CostFields = CostInput & { rate: number };

function Num({ label, value, onChange, prefix, suffix, hint, step = 1 }: { label: string; value: number; onChange: (n: number) => void; prefix?: string; suffix?: string; hint?: string; step?: number }) {
  return (
    <label className="block min-w-0">
      <span className="label">{label}</span>
      <span className="relative mt-1.5 block">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--ink-3)]">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className={`field tabular-nums ${prefix ? "!pl-7" : ""} ${suffix ? "!pr-8" : ""}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--ink-3)]">{suffix}</span>}
      </span>
      {hint && <span className="mt-1 block text-[11.5px] leading-snug text-[var(--ink-3)]">{hint}</span>}
    </label>
  );
}

export default function LandedCost({ f, set, dest, freightHint }: { f: CostFields; set: (patch: Partial<CostFields>) => void; dest: Destination; freightHint: string }) {
  const c = landedCost(f);
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        <div className="col-span-2">
          <Num label="Car price" prefix="$" value={f.price} step={100} onChange={(price) => set({ price })} />
        </div>
        <Num label="Truck to the US port" prefix="$" value={f.inland} step={10} onChange={(inland) => set({ inland })} hint="example" />
        <Num label="Shipping, insurance included" prefix="$" value={f.shipping} step={10} onChange={(shipping) => set({ shipping })} hint={freightHint} />
        <Num label="Duty and taxes" suffix="%" value={f.duty} step={1} onChange={(duty) => set({ duty })} hint="of CIF (car, trucking, shipping); your agent's rate" />
        <Num label="Port handling and clearing" prefix="$" value={f.port} step={10} onChange={(port) => set({ port })} hint={`example, at ${dest.port.replace(/^Port of /, "")}`} />
        <Num label={`${dest.currency} per USD`} value={f.rate} step={dest.rate > 100 ? 5 : 0.01} onChange={(rate) => set({ rate })} hint="set today's rate" />
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--line)]" aria-live="polite">
        <p className="stat-label">Landed at {dest.port.replace(/^Port of /, "")}</p>
        <p className="stat-value !text-[32px]">{usd(c.total)}</p>
        <p className="mt-0.5 text-[14px] text-[var(--ink-2)] tabular-nums">{money(c.total * f.rate, dest.currency)}</p>
        <div className="mt-4 flex h-3 rounded-full overflow-hidden bg-[var(--tint)]" role="img" aria-label="Cost breakdown">
          {c.parts.map((p) => (
            <span key={p.id} style={{ width: `${(p.usd / c.total) * 100}%`, background: SEG_COLORS[p.id] }} className="h-full transition-[width] duration-500 border-r border-[#0c0d0f] last:border-0" />
          ))}
        </div>
        <ul className="mt-3 text-[13px]">
          {c.parts.map((p) => (
            <li key={p.id} className="flex items-center gap-2.5 py-1.5">
              <span className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ background: SEG_COLORS[p.id] }} />
              <span className="flex-1 text-[var(--ink-2)]">{p.label}</span>
              <span className="tabular-nums">{usd(p.usd)}</span>
              <span className="w-10 text-right text-[12px] text-[var(--ink-3)] tabular-nums">{Math.round((p.usd / c.total) * 100)}%</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] leading-relaxed text-[var(--ink-3)]">
          Every figure is an example you can change. Rockmotion includes marine insurance ({INSURANCE.replace(/, included in every shipment$/, "").toLowerCase()}). Under their terms the buyer handles customs, duties, port handling and inland delivery, which depend on the country and the car, so your clearing agent&apos;s quote is the one to trust.
        </p>
        <a href="https://rockmotion.vercel.app/shipping" target="_blank" rel="noreferrer" className="btn btn-solid mt-5 w-full">
          Get a real quote from Rockmotion <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
