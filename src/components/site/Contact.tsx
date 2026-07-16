"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import InquiryForm from "./InquiryForm";

const EMAIL = "aadamsays@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=Hi%20Aadam%20%E2%80%94%20Let%E2%80%99s%20Work%20Together`;

const LINKS = [
  { key: "whatsapp", href: "https://wa.me/233559602056" },
  { key: "linkedin", href: "https://linkedin.com/in/aadamsays" },
  { key: "phone", href: "tel:+233559602056" },
] as const;

export default function Contact() {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — mailto link still works
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative px-4 md:px-6 py-32 md:py-44 border-t border-[var(--line)] overflow-hidden min-h-[70vh] flex items-center"
    >
      {/* Single gold glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "min(900px, 110vw)",
          height: "480px",
          background:
            "radial-gradient(ellipse at center bottom, var(--accent-glow) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-[1440px] w-full mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="eyebrow mb-8"
        >
          {t("eyebrow")}
        </motion.p>

        <h2 id="contact-heading" className="sr-only">
          {t("heading")}
        </h2>

        {/* Giant mailto */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="overflow-hidden">
            <motion.a
              href={MAILTO}
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.0, ease: EASE_OUT }}
              className="group relative block font-display lowercase break-all"
              style={{
                fontSize: "clamp(1.8rem, 6.5vw, 6.2rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {EMAIL}
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-1 md:-bottom-2 h-[3px] w-full bg-[var(--accent)] origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100"
              />
            </motion.a>
          </div>

          <button
            type="button"
            onClick={copyEmail}
            aria-label={copied ? t("copiedAria") : t("copyAria")}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <span className="relative inline-grid overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={copied ? "copied" : "copy"}
                  className="col-start-1 row-start-1 inline-flex items-center gap-2"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.3, ease: EASE_IN_OUT }}
                >
                  {copied ? (
                    <>
                      {t("copied")} <Check className="w-3.5 h-3.5 text-[var(--success)]" />
                    </>
                  ) : (
                    <>
                      {t("copy")} <Copy className="w-3.5 h-3.5" />
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: EASE_OUT }}
          className="mt-8 max-w-lg text-[16px] leading-[1.65] text-[var(--ink-2)] text-pretty"
        >
          {t("note")}
        </motion.p>

        <motion.nav
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
          aria-label="Other channels"
        >
          {LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="font-mono text-[12px] tracking-[0.16em] uppercase text-[var(--ink-3)] hover:text-[var(--accent)] transition-colors"
            >
              {t(l.key)} ↗
            </a>
          ))}
        </motion.nav>

        <InquiryForm />
      </div>
    </section>
  );
}
