import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import ThreeStatement from "@/components/lab/ThreeStatement";

export const metadata: Metadata = {
  title: "Three-statement model",
  description:
    "A five-year income statement, balance sheet and cash flow for an illustrative food company, with cedi, rate and demand shocks and a DSCR covenant.",
};

export default function ModelPage() {
  return (
    <>
      <Nav />
      <main id="main" className="px-4 md:px-6 pt-32 pb-24">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[13px] text-[var(--ink-3)]">
            <Link href="/lab" className="hover:text-white">Lab</Link> / Three-statement model
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-end">
            <h1 className="md:col-span-7 font-display text-white text-balance" style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
              Harmattan Foods Ltd
              <span className="block mt-2 text-[0.42em] tracking-normal font-sans font-normal text-[var(--ink-3)]">An illustrative company. Not a client, not real numbers.</span>
            </h1>
            <p className="md:col-span-5 text-[15px] leading-[1.65] text-[var(--ink-2)] text-pretty">
              The kind of model we build for lenders and investors: five years of income statement, balance sheet and cash flow, linked so a change anywhere flows everywhere. Move an assumption or apply a shock and watch the covenant.
            </p>
          </div>
          <div className="mt-10">
            <ThreeStatement />
          </div>
          <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-[14.5px] leading-relaxed text-[var(--ink-2)]">
            <div>
              <h2 className="font-display text-[20px] text-white">How the statements link</h2>
              <p className="mt-2">Net income closes into retained earnings. Depreciation and the change in working capital turn profit into operating cash. The cash flow statement explains, line by line, why cash moved.</p>
            </div>
            <div>
              <h2 className="font-display text-[20px] text-white">Why it always balances</h2>
              <p className="mt-2">Cash is not typed in; it is the end of the cash flow. When cash would fall below the minimum a revolver draws, and it is repaid first when cash recovers. Interest runs on opening balances, so there is no circular reference.</p>
            </div>
            <div>
              <h2 className="font-display text-[20px] text-white">What the covenant tells you</h2>
              <p className="mt-2">DSCR is cash available for debt service over interest plus principal. Lenders often want 1.25x or more. Here the base case clears it in year 1 with little room, and any single shock breaks it.</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
