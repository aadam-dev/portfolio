"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import Schematic from "@/components/map/Schematic";
import { PLACES } from "@/components/map/places";

/** Marks and colours picked from the Al Boyut and An-Nur identities. */
function BrandSheet() {
  return (
    <div className="absolute inset-0 grid grid-cols-2 gap-px bg-[var(--line-strong)]">
      {[
        { logo: "/fieldkit/logo-alboyut.webp", bg: "#ffffff", swatches: ["#1b2a4a", "#1aa3ad", "#86a3ad"] },
        { logo: "/fieldkit/logo-annur.webp", bg: "#1c1948", swatches: ["#1c1948", "#e3a82b", "#f4f0e6"] },
      ].map((b) => (
        <div key={b.logo} className="relative flex flex-col items-center justify-center gap-4" style={{ background: b.bg }}>
          <Image src={b.logo} alt="" width={72} height={72} className="rounded-md" />
          <div className="flex gap-1.5">
            {b.swatches.map((c) => (
              <span key={c} className="w-5 h-5 rounded-full ring-1 ring-black/10" style={{ background: c }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** The four ways a business works with the studio, each with its proof. */
const PRACTICES = [
  { key: "analysis", href: "/work/ethika", image: "/previews/ethika/landing.webp", fit: "object-cover object-top" },
  { key: "systems", href: "/work/al-boyut", image: "/previews/alboyut/pos.webp", fit: "object-cover object-left-top" },
  { key: "brand", href: "/work/al-boyut", image: null, fit: "" },
  { key: "map", href: "#map", image: null, fit: "" },
] as const;

export default function Practices() {
  const t = useTranslations("home.practices");
  return (
    <section id="services" aria-labelledby="practices-heading" className="relative px-4 md:px-6 py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 mb-12 md:mb-16 items-end">
          <h2
            id="practices-heading"
            className="md:col-span-6 font-display text-white text-balance"
            style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)", lineHeight: 0.98, letterSpacing: "-0.03em" }}
          >
            {t("heading")}
          </h2>
          <p className="md:col-span-5 md:col-start-8 text-[15px] md:text-[16px] leading-[1.65] text-[var(--ink-2)] text-pretty">
            {t("sub")}
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRACTICES.map((p, i) => (
            <Reveal as="li" key={p.key} delay={i * 0.05}>
              <Link
                href={p.href}
                className="group flex flex-col h-full rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] overflow-hidden hover:border-[var(--ink-4)] transition-colors"
              >
                <div className="relative aspect-[4/3] bg-[var(--surface-2)] overflow-hidden">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                      className={`${p.fit} transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]`}
                    />
                  ) : p.key === "brand" ? (
                    <BrandSheet />
                  ) : (
                    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                      <Schematic places={PLACES} selected="alboyut" interactive={false} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-display text-[22px] leading-[1.1] tracking-[-0.015em] text-white">{t(`${p.key}.title`)}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--ink-2)] text-pretty">{t(`${p.key}.body`)}</p>
                  <p className="mt-auto pt-5 text-[13px] text-white flex items-start justify-between gap-3">
                    <span>{t(`${p.key}.proof`)}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0 text-[var(--ink-3)] group-hover:text-[var(--accent)] transition-colors" />
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
