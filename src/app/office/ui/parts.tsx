import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

/** Status tokens: fixed, never reused for a series, always with an icon and a label. */
export const STATUS = { good: "#0ca30c", warning: "#fab219", critical: "#d03b3b" };
export const ACCENT = "#3987e5";

/** A 12-ish point trend in the de-emphasis hue, with the current period in the accent. */
export function Spark({ values, w = 112, h = 32 }: { values: number[]; w?: number; h?: number }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * (w - 6) + 3, h - 3 - (v / max) * (h - 6)] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg width={w} height={h} aria-hidden className="block">
      <path d={d} fill="none" stroke="rgba(242,238,230,0.28)" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r={3} fill={ACCENT} stroke="#12100d" strokeWidth={1.5} />
    </svg>
  );
}

/** Change against the previous period: arrow + signed text, coloured by whether up is good. */
export function Delta({ now, before, period, upIsGood = true, fmt, short }: { now: number; before: number; period: string; upIsGood?: boolean; fmt?: (d: number) => string; short?: string }) {
  if (!before && !now) return <p className="mt-2 text-[12px] text-[var(--ink-4)]">No data yet</p>;
  if (!before) return <p className="mt-2 text-[12px] text-[var(--ink-3)]">New this period</p>;
  const pct = ((now - before) / before) * 100;
  const flat = Math.abs(pct) < 0.5;
  const good = flat ? null : pct > 0 === upIsGood;
  const Icon = flat ? Minus : pct > 0 ? ArrowUpRight : ArrowDownRight;
  const color = good == null ? "var(--ink-3)" : good ? STATUS.good : STATUS.critical;
  return (
    <p className="mt-2 inline-flex items-center gap-1 whitespace-nowrap text-[12px]" style={{ color }}>
      <Icon className="w-3.5 h-3.5" aria-hidden />
      <span className="font-medium">{flat ? "Flat" : fmt ? fmt(now - before) : `${pct > 0 ? "+" : ""}${Math.round(pct)}%`}</span>
      <span className="text-[var(--ink-3)]">{short ? `vs prior ${short}` : `vs previous ${period}`}</span>
    </p>
  );
}

/** Ranked list with one thin bar per row, value at the tip. One series, one colour. */
export function BarList({ rows, fmt = (k) => k ?? "Unknown", empty = "Nothing yet" }: { rows: { key: string | null; n: number }[]; fmt?: (k: string | null) => string; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  const total = rows.reduce((a, r) => a + r.n, 0);
  if (!rows.length) return <p className="py-6 text-center text-[13px] text-[var(--ink-4)]">{empty}</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => {
        const label = fmt(r.key);
        return (
          <li key={r.key ?? "none"} className="group" title={`${label}: ${r.n} (${Math.round((r.n / total) * 100)}%)`}>
            <div className="flex items-baseline justify-between gap-3 text-[13px]">
              <span className="truncate text-[var(--foreground)]">{label}</span>
              <span className="tabular-nums text-[var(--ink-2)]">{r.n}</span>
            </div>
            <div className="mt-1.5 h-[6px] rounded-full bg-[rgba(242,238,230,0.05)]">
              <div className="h-full rounded-full transition-[filter] group-hover:brightness-125" style={{ width: `${Math.max(2, (r.n / max) * 100)}%`, background: ACCENT }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Panel({ title, action, children, className = "", id }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`card p-5 md:p-6 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-medium text-[var(--ink-2)]">{title}</h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
