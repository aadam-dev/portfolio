import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import CarLabLoader from "./CarLabLoader";

export const metadata: Metadata = {
  title: "Rockmotion: buy a car you haven't seen",
  description: "Check the VIN, walk round the car with an inspector's checklist, ship it from Atlanta and add up the landed cost: the flow Rockmotion's buyers go through.",
};

export default function CarPage() {
  return (
    <>
      <Nav />
      <main id="main" className="px-4 md:px-6 pt-32 pb-24">
        <div className="max-w-[1320px] mx-auto">
          <p className="text-[13px] text-[var(--ink-3)]">
            <Link href="/lab" className="hover:text-[var(--foreground)]">Lab</Link> / Rockmotion
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-end">
            <h1 className="md:col-span-7 font-display text-balance" style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
              Buy a car you haven&apos;t seen
            </h1>
            <p className="md:col-span-5 text-[15px] leading-[1.65] text-[var(--ink-2)] text-pretty">
              <Link href="/work/rockmotion" className="underline underline-offset-4">Rockmotion</Link> sells American cars to buyers in Accra, Lagos and Rotterdam who never stand next to them. These are the four steps between a listing and a car at your port.
            </p>
          </div>
          <div className="mt-10">
            <CarLabLoader />
          </div>
          <p className="mt-4 text-[12px] text-[var(--ink-3)]">
            Car: <a className="underline underline-offset-2" href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept" target="_blank" rel="noreferrer">Car Concept</a> by Eric Chadwick / DGG, CC-BY 4.0, from a CC0 model by Unity Fan; logos removed. Map: Natural Earth. Vehicle data: NHTSA vPIC.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
