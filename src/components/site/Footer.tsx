"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

const QUICK_LINKS = [
  { ns: "nav", key: "services", href: "/#services" },
  { ns: "nav", key: "work", href: "/#work" },
  { ns: "nav", key: "process", href: "/#process" },
  { ns: "footer", key: "impact", href: "/#impact" },
  { ns: "footer", key: "voices", href: "/#voices" },
  { ns: "nav", key: "contact", href: "/#contact" },
] as const;

const SOCIAL = [
  { label: "GitHub", href: "https://github.com/aadam-dev" },
  { label: "LinkedIn", href: "https://linkedin.com/in/aadamsays" },
  { label: "Email", href: "mailto:aadamsays@gmail.com" },
];

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-[var(--line)] pt-20 md:pt-28 pb-10 px-4 md:px-6 overflow-hidden"
      aria-labelledby="footer-heading"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "min(1000px, 120vw)",
          height: "500px",
          background:
            "radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-6">
            <p className="eyebrow mb-6">{t("eyebrow")}</p>
            <h2
              id="footer-heading"
              className="font-display text-white text-balance"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 6.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
              }}
            >
              {t("heading")}
              <br />
              <span className="font-serif-it lowercase text-[var(--ink-2)]">{t("headingAccent")}</span>
            </h2>
            <a
              href="mailto:aadamsays@gmail.com?subject=Hi%20Aadam%20%E2%80%94%20Let%E2%80%99s%20Work%20Together"
              className="group inline-flex items-center gap-3 mt-8 text-white"
            >
              <span className="font-display text-[22px] md:text-[26px]" style={{ letterSpacing: "-0.02em" }}>
                aadamsays@gmail.com
              </span>
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5">{t("navigate")}</p>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[15px] text-[var(--ink-2)] hover:text-white transition-colors"
                  >
                    {l.ns === "nav" ? tNav(l.key) : t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5">{t("elsewhere")}</p>
            <ul className="flex flex-col gap-2.5">
              {SOCIAL.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group inline-flex items-center gap-1 text-[15px] text-[var(--ink-2)] hover:text-white transition-colors"
                  >
                    {s.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 md:mt-20 pt-6 border-t border-[var(--line)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative inline-flex w-2 h-2">
              <span className="ping-soft absolute inline-flex w-full h-full rounded-full bg-[var(--success)]" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--success)]" />
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-3)]">
              {t("availability")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-3)]">
            <a href="tel:+233559602056" className="hover:text-white transition-colors">
              +233 559 602 056
            </a>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-[var(--ink-4)]" aria-hidden="true" />
            <span>{t("builtWith")}</span>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-[var(--ink-4)]" aria-hidden="true" />
            <span>&copy; {year} Aadam</span>
          </div>
        </div>

        {/* Oversized cropped wordmark */}
        <div aria-hidden="true" className="mt-10 -mb-10 overflow-hidden select-none">
          <p
            className="font-display uppercase text-[var(--ink-5)] translate-y-[35%] text-center whitespace-nowrap"
            style={{
              fontSize: "clamp(6rem, 20vw, 22rem)",
              lineHeight: 0.8,
              letterSpacing: "-0.02em",
            }}
          >
            Aadam
          </p>
        </div>
      </div>
    </footer>
  );
}
