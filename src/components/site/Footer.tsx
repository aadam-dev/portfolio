"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const QUICK_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "Impact", href: "/#impact" },
  { label: "Voices", href: "/#voices" },
  { label: "Contact", href: "/#contact" },
];

const SOCIAL = [
  { label: "GitHub", href: "https://github.com/aadam-dev" },
  { label: "LinkedIn", href: "https://linkedin.com/in/aadamsays" },
  { label: "Email", href: "mailto:aadamsays@gmail.com" },
];

export default function Footer() {
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
            "radial-gradient(ellipse at center, rgba(124,106,250,0.18) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-6">
            <p className="eyebrow mb-6">Studio · Aadam</p>
            <h2
              id="footer-heading"
              className="font-display text-white text-balance"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 6.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
              }}
            >
              Let&rsquo;s build
              <br />
              <span className="italic text-[var(--ink-2)]">something that pays rent.</span>
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
            <p className="eyebrow mb-5">Navigate</p>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[15px] text-[var(--ink-2)] hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5">Elsewhere</p>
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
              Accra · Available globally · UTC
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-3)]">
            <a href="tel:+233559602056" className="hover:text-white transition-colors">
              +233 559 602 056
            </a>
            <span className="w-1 h-1 rounded-full bg-[var(--ink-4)]" aria-hidden="true" />
            <span>&copy; {year} Aadam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
