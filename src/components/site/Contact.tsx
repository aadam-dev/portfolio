"use client";

import { ArrowUpRight, Mail, Phone, Calendar } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "aadamsays@gmail.com",
    href: "mailto:aadamsays@gmail.com?subject=Hi%20Aadam%20%E2%80%94%20Let%E2%80%99s%20Work%20Together",
  },
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+233 559 602 056",
    href: "tel:+233559602056",
  },
  {
    icon: Calendar,
    label: "Book a call",
    value: "30 min intro · any timezone",
    href: "mailto:aadamsays@gmail.com?subject=Intro%20call%20%E2%80%94%20Aadam",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative px-4 md:px-6 py-24 md:py-32 border-t border-[var(--line)] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "min(900px, 110vw)",
          height: "600px",
          background:
            "radial-gradient(ellipse at center top, rgba(124,106,250,0.18) 0%, transparent 60%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5">Contact · Currently taking Q2 work</p>
            <h2
              id="contact-heading"
              className="font-display text-white text-balance"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 6.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.035em",
              }}
            >
              Tell me what&rsquo;s{" "}
              <span className="italic text-[var(--ink-2)]">keeping you up at night.</span>
            </h2>
            <p className="mt-6 text-[16px] md:text-[17px] leading-[1.65] text-[var(--ink-2)] max-w-lg text-pretty">
              Shortest path is email. I read every message personally and reply
              within one business day. If it&rsquo;s urgent, call or message on
              WhatsApp.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton
                href="mailto:aadamsays@gmail.com?subject=Hi%20Aadam%20%E2%80%94%20Let%E2%80%99s%20Work%20Together"
                variant="primary"
              >
                Start the conversation
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
              <MagneticButton
                href="https://linkedin.com/in/aadamsays"
                external
                variant="secondary"
              >
                Connect on LinkedIn
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>

          <div className="md:col-span-5">
            <ul className="space-y-3">
              {CHANNELS.map((c, i) => (
                <Reveal key={c.label} delay={i * 0.08}>
                  <li>
                    <a
                      href={c.href}
                      className="group flex items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--line)] transition-colors hover:border-white/20"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span
                          className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl"
                          style={{
                            background: "rgba(124,106,250,0.12)",
                            border: "1px solid rgba(124,106,250,0.25)",
                            color: "var(--accent-2)",
                          }}
                          aria-hidden="true"
                        >
                          <c.icon className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-4)]">
                            {c.label}
                          </p>
                          <p className="mt-0.5 text-[15px] text-white truncate">
                            {c.value}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[var(--ink-3)] transition-all group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
