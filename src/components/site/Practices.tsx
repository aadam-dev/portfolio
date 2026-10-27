"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import Schematic from "@/components/map/Schematic";
import { PLACES } from "@/components/map/places";

/** The four ways a business works with the studio, each with its proof. */
const PRACTICES = [
  { key: "analysis", href: "/lab/model", image: "/previews/ethika/tools.webp" },
  { key: "systems", href: "/work/al-boyut", image: "/previews/alboyut/pos.webp" },
  { key: "brand", href: "/work/al-boyut", image: "/previews/alboyut/landing.webp" },
  { key: "map", href: "#map", image: null },
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
              <Link href={p.href} className="card card-link h-full">
                <div className="card-media">
                  {p.image ? (
                    <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
                  ) : (
                    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                      <Schematic places={PLACES} selected="alboyut" interactive={false} />
                    </div>
                  )}
                </div>
                <div className="card-pad">
                  <h3 className="card-title">{t(`${p.key}.title`)}</h3>
                  <p className="card-text">{t(`${p.key}.body`)}</p>
                  <p className="card-foot">
                    <span>{t(`${p.key}.proof`)}</span>
                    <ArrowUpRight className="card-arrow" />
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
