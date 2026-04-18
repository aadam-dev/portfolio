"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "Voices", href: "/#voices" },
  { label: "Contact", href: "/#contact" },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/aadam-dev" },
  { label: "LinkedIn", href: "https://linkedin.com/in/aadamsays" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setCondensed(y > 24);
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 px-4 md:px-6"
        animate={{
          paddingTop: condensed ? 10 : 18,
          paddingBottom: condensed ? 10 : 18,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: condensed
            ? "rgba(8, 8, 12, 0.72)"
            : "rgba(8, 8, 12, 0.35)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: condensed ? "1px solid var(--line)" : "1px solid transparent",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2"
            aria-label="Aadam — home"
          >
            <span className="relative inline-flex w-2 h-2">
              <span className="ping-soft absolute inline-flex w-full h-full rounded-full bg-[var(--success)]" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--success)] shadow-[0_0_10px_var(--success)]" />
            </span>
            <span
              className="font-display text-[22px] leading-none text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Aadam
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-1"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-[13px] text-[var(--ink-3)] hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex px-3 py-2 text-[13px] text-[var(--ink-3)] hover:text-white transition-colors"
              >
                {s.label}
              </a>
            ))}
            <a
              href="#contact"
              className="group inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium rounded-full border border-[var(--line-strong)] text-white hover:bg-white hover:text-black transition-colors"
            >
              Start a project
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="md:hidden p-2 rounded-full border border-[var(--line-strong)] text-white hover:bg-white/5"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{
                background: "rgba(8,8,12,0.85)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full flex flex-col px-6 pt-6 pb-10"
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-display text-[22px] text-white"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Aadam
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-full border border-[var(--line-strong)] text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav
                aria-label="Mobile primary"
                className="flex-1 flex flex-col justify-center gap-3"
              >
                {LINKS.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-[56px] leading-[0.95] text-white"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    {l.label}
                    <span className="text-[var(--accent)]">.</span>
                  </motion.a>
                ))}
              </nav>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-4 text-[var(--ink-3)]">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                  <a
                    href="mailto:aadamsays@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    Email
                  </a>
                </div>
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-between w-full px-5 py-4 rounded-full bg-white text-black text-sm font-medium"
                >
                  Start a project
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
