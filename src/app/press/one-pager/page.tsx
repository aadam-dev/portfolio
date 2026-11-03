import type { Metadata } from "next";
import press from "@/lib/press.json";

export const metadata: Metadata = { title: "Press one-pager", robots: { index: false, follow: false } };

/** The press kit's one-page PDF, printed from this page by scripts/press-kit.mjs. */
export default function OnePager() {
  return (
    <main className="theme-fixed mx-auto min-h-screen max-w-[794px] bg-[#ece8df] p-12 text-[#121110]" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <header className="flex items-center gap-3">
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: "#22c55e" }} />
        <span className="font-display text-[44px] leading-none" style={{ letterSpacing: "-0.03em" }}>
          {press.name}
        </span>
      </header>
      <p className="mt-2 text-[15px] text-black/60">{press.title}</p>
      <p className="mt-8 text-[20px] leading-snug" style={{ letterSpacing: "-0.01em" }}>
        {press.short}
      </p>
      <p className="mt-5 text-[13.5px] leading-relaxed text-black/75">{press.long}</p>
      <div className="mt-8 grid grid-cols-2 gap-8">
        <section>
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#e2480f]">Selected work</h2>
          <ul className="mt-3 space-y-2 text-[13px]">
            {press.work.map(([n, d]) => (
              <li key={n}>
                <b>{n}</b>
                <br />
                <span className="text-black/65">{d}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#e2480f]">Facts</h2>
          <dl className="mt-3 space-y-2 text-[13px]">
            {press.facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-black/55">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <h2 className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#e2480f]">Colours</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {press.colours.map(([n, c]) => (
              <span key={n} className="inline-flex items-center gap-1.5 text-[11px]">
                <span className="inline-block h-4 w-4 rounded" style={{ background: c, border: "1px solid rgba(0,0,0,.1)" }} />
                {c}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
