"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { EASE_OUT } from "@/lib/motion";

const WHATSAPP_URL =
  "https://wa.me/233559602056?text=Hi%20Aadam%20%E2%80%94%20I%27d%20like%20to%20start%20a%20project.";

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

/** Visible after ~1.5 viewport-heights, hidden again near the contact section. */
function useShowBar() {
  return useSyncExternalStore(
    subscribeScroll,
    () => {
      const past = window.scrollY > window.innerHeight * 1.5;
      const contact = document.getElementById("contact");
      const beforeContact =
        !contact || contact.getBoundingClientRect().top > window.innerHeight;
      return past && beforeContact;
    },
    () => false
  );
}

export default function MobileCtaBar() {
  const t = useTranslations("cta");
  const show = useShowBar();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 72, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="fixed bottom-0 inset-x-0 z-50 md:hidden px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div className="flex items-stretch gap-2 rounded-2xl border border-[var(--line-strong)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-md p-2 shadow-2xl">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25d366] text-black font-medium text-[13px] py-3"
            >
              <MessageCircle className="w-4 h-4" />
              {t("whatsapp")}
            </a>
            <Link
              href="/#contact"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white text-black font-medium text-[13px] py-3"
            >
              {t("startProject")}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
