import type { Metadata } from "next";

export const metadata: Metadata = { title: "Logo", robots: { index: false, follow: false } };

/** The wordmark on its own, for scripts/press-kit.mjs to photograph into the press kit. */
export default function Logo() {
  return (
    <main className="grid min-h-screen place-items-center" style={{ background: "transparent" }}>
      <div id="logo" className="theme-fixed inline-flex items-center gap-6 px-10 py-8">
        <span className="inline-block h-10 w-10 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 30px #22c55e" }} />
        <span className="font-display text-[132px] leading-none" style={{ letterSpacing: "-0.03em", color: "#121110" }}>
          Aadam
        </span>
      </div>
    </main>
  );
}
