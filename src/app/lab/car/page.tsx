import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import CarLabLoader from "./CarLabLoader";
import { SYSTEMS } from "@/components/lab/car/systems";

export const metadata: Metadata = {
  title: "How a car works",
  description: "A car built from separate parts: turn it, flip it, take it apart system by system, then drive a lap.",
};

export default function CarPage() {
  return (
    <>
      <Nav />
      <main id="main" className="px-4 md:px-6 pt-32 pb-24">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[13px] text-[var(--ink-3)]">
            <Link href="/lab" className="hover:text-white">Lab</Link> / How a car works
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-end">
            <h1 className="md:col-span-7 font-display text-white text-balance" style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
              How a car works
            </h1>
            <p className="md:col-span-5 text-[15px] leading-[1.65] text-[var(--ink-2)] text-pretty">
              For anyone buying a car they can&apos;t walk around first, like the customers of{" "}
              <Link href="/work/rockmotion" className="underline underline-offset-4">Rockmotion</Link>, the US export platform we built. Turn it, flip it, take it apart, then drive it.
            </p>
          </div>
          <div className="mt-10">
            <CarLabLoader />
          </div>
          {/* the same lessons as text, for screen readers and anyone without WebGL */}
          <section className="mt-14" aria-labelledby="systems-heading">
            <h2 id="systems-heading" className="font-display text-[24px] text-white">The systems, in plain words</h2>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {SYSTEMS.map((s) => (
                <div key={s.id}>
                  <h3 className="font-medium text-white">{s.name}</h3>
                  <ol className="mt-2 space-y-1.5 text-[14px] leading-relaxed text-[var(--ink-2)] list-decimal pl-4">
                    {s.steps.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
