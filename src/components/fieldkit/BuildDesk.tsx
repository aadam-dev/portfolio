"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { EASE_OUT } from "@/lib/motion";
import PosTerminal from "./hardware/PosTerminal";
import ModeScreen from "./ModeScreen";
import EventLog from "./EventLog";

export default function BuildDesk() {
  const t = useTranslations("fieldkit.buildDesk");
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.2 });
  const near = useInView(ref, { once: true, margin: "600px 0px 600px 0px" });

  return (
    <section
      ref={ref}
      id="build"
      aria-labelledby="build-heading"
      className="relative px-4 md:px-6 pt-28 md:pt-40 pb-16 border-t border-[var(--line)] overflow-hidden scroll-mt-10"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "min(1000px, 110vw)",
          height: "600px",
          background: "radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 65%)",
        }}
      />
      <div className="relative max-w-[1280px] mx-auto">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="eyebrow">
            <span className="text-[var(--accent)]">08</span> · {t("eyebrow")}
          </p>
          <motion.h2
            id="build-heading"
            className="mt-5 font-display text-balance"
            style={{ fontSize: "clamp(2.4rem, 5.4vw, 4.8rem)", lineHeight: 1, letterSpacing: "-0.04em" }}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={seen ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={reduce ? { duration: 0.3, y: { duration: 0 }, scale: { duration: 0 } } : { duration: 1, ease: EASE_OUT }}
          >
            {t("title")} <span className="font-serif-it text-[var(--accent)]">{t("accent")}</span>
          </motion.h2>
          <motion.p
            className="mt-6 text-[16px] md:text-[17px] leading-[1.6] text-[var(--ink-2)] text-pretty"
            initial={{ opacity: 0 }}
            animate={seen ? { opacity: 1 } : undefined}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {t("note")}
          </motion.p>
        </div>

        <motion.div
          className="mt-14 md:mt-20 mx-auto max-w-[760px] min-h-[740px] @container"
          initial={{ opacity: 0, y: 80 }}
          animate={seen ? { opacity: 1, y: 0 } : undefined}
          transition={
            reduce ? { duration: 0.3, y: { duration: 0 } } : { delay: 0.1, type: "spring", stiffness: 90, damping: 20 }
          }
        >
          {near && (
            <>
              <PosTerminal screenClass="h-[600px] @[560px]/pos:h-[420px]">
                <ModeScreen mode="build" />
              </PosTerminal>
              <div className="theme-fixed mt-4 rounded-[10px] bg-[#0e0d0b] px-3 py-2 border border-white/[0.06]">
                <EventLog lines={2} />
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
