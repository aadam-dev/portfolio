import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Lab",
  description: "Working pieces from the studio: a three-statement model you can stress, a car you can take apart, and a map of where the work runs.",
};

const ITEMS = [
  {
    href: "/lab/model",
    title: "Three-statement model",
    body: "Five years of income statement, balance sheet and cash flow for an illustrative food company. Shock the cedi, rates or demand and watch the covenant.",
    image: "/previews/ethika/tools.webp",
  },
  {
    href: "/lab/car",
    title: "Buy a car you haven't seen",
    body: "Rockmotion's export flow on a real car: check the VIN, inspect it panel by panel, follow it to your port and add up the landed cost.",
    image: "/previews/rockmotion/landing.webp",
  },
  {
    href: "/#map",
    title: "Where the work runs",
    body: "Every shop, kitchen, court and college on the map, with what we built there.",
    image: "/previews/makossa/landing.webp",
  },
];

export default function LabPage() {
  return (
    <>
      <Nav />
      <main id="main" className="px-4 md:px-6 pt-32 pb-24">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="font-display text-white" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 0.95, letterSpacing: "-0.04em" }}>
            Lab
          </h1>
          <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-[var(--ink-2)]">
            Working pieces that show how we think: models you can stress and machines you can take apart.
          </p>
          <ul className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {ITEMS.map((x) => (
              <li key={x.href}>
                <Link href={x.href} className="card card-link h-full">
                  <div className="card-media">
                    <Image src={x.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-top" />
                  </div>
                  <div className="card-pad">
                    <h2 className="card-title">{x.title}</h2>
                    <p className="card-text">{x.body}</p>
                    <span className="card-foot">
                      <span>Open</span>
                      <ArrowUpRight className="card-arrow" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
