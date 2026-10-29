"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, RotateCw, X } from "lucide-react";
import { useTranslations } from "next-intl";

const HINT_KEY = "desk-viewer-hint";
const W = 640;
const H = 400;

/**
 * The app at its design size, scaled to fit the space it is given. On a
 * portrait phone it turns sideways, which nearly doubles its size; turning
 * the phone then reads it upright.
 */
function Fit({ children, onTurn }: { children: React.ReactNode; onTurn: (turned: boolean) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ k: 0, turned: false });
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const cw = el.clientWidth, ch = el.clientHeight;
      const flat = Math.min(cw / W, ch / H);
      const side = Math.min(cw / H, ch / W);
      const turned = cw < 700 && side > flat * 1.3;
      setFit({ k: turned ? side : flat, turned });
      onTurn(turned);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [onTurn]);
  const { k, turned } = fit;
  const bw = (turned ? H : W) * k, bh = (turned ? W : H) * k;
  return (
    <div ref={box} className="pointer-events-none relative w-full h-full grid place-items-center overflow-hidden">
      <div className="pointer-events-auto theme-fixed shrink-0 overflow-hidden rounded-[10px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]" style={{ width: bw, height: bh, visibility: k ? "visible" : "hidden" }}>
        <div style={{ width: W, height: H, transformOrigin: "0 0", transform: turned ? `translate(${H * k}px, 0) rotate(90deg) scale(${k})` : `scale(${k})` }}>{children}</div>
      </div>
    </div>
  );
}

/**
 * One desk screen, opened full size. Every way out works: the Back button,
 * the close button, Esc, a tap on the backdrop, the phone's back gesture
 * (it owns one history entry) and a swipe down on the bar.
 */
export default function ScreenViewer({ open, label, onClose, children }: { open: boolean; label: string; onClose: () => void; children: React.ReactNode }) {
  const t = useTranslations("home.desk");
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const pushed = useRef(false);
  const [hint, setHint] = useState(false);
  const [turned, setTurned] = useState(false);
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);

  // closing goes through history, so the entry is always given back
  const dismiss = () => {
    if (pushed.current) history.back();
    else close.current();
  };

  // history entry, Esc, focus, scroll lock
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    // one history entry per opening, so Back closes it (guarded for effect re-runs)
    if (!pushed.current) {
      history.pushState({ ...(history.state ?? {}), deskViewer: true }, "");
      pushed.current = true;
    }
    const onPop = () => {
      pushed.current = false;
      close.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
      }
      if (e.key === "Tab" && panel.current) {
        const f = [...panel.current.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")].filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    const y = window.scrollY;
    html.style.overflow = "hidden";
    const f = requestAnimationFrame(() => back.current?.focus({ preventScroll: true }));
    let seen = false;
    try {
      seen = localStorage.getItem(HINT_KEY) === "1";
      localStorage.setItem(HINT_KEY, "1");
    } catch {}
    const h0 = window.setTimeout(() => setHint(!seen), 0);
    const h1 = window.setTimeout(() => setHint(false), 5200);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
      // leave the page exactly where it was, whatever the history step did
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior }));
      cancelAnimationFrame(f);
      window.clearTimeout(h0);
      window.clearTimeout(h1);
      const el = opener.current as HTMLElement | null;
      el?.focus?.({ preventScroll: true });
    };
  }, [open]);


  // swipe down on the bar or the backdrop closes it on phones
  const start = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (start.current = e.touches[0].clientY);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (start.current != null && e.changedTouches[0].clientY - start.current > 70) dismiss();
    start.current = null;
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="viewer"
          className="theme-fixed fixed inset-0 z-[120] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          ref={panel}
        >
          {/* the backdrop: a tap anywhere outside the screen goes back (keyboard users have the buttons and Esc) */}
          <div aria-hidden className="absolute inset-0 bg-[#0b0a08]/80 backdrop-blur-md cursor-zoom-out" onClick={dismiss} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} />
          <div className="relative z-10 flex items-center justify-between gap-3 px-3 md:px-6 pt-[max(12px,env(safe-area-inset-top))] pb-3" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <button
              ref={back}
              type="button"
              onClick={dismiss}
              className="inline-flex items-center gap-2 h-11 pl-3.5 pr-4 rounded-full bg-white text-[#14120f] text-[14px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden /> {t("back")}
            </button>
            <p className="min-w-0 flex-1 line-clamp-2 text-center text-[12px] sm:text-[13px] leading-snug text-white/80" aria-live="polite">
              {hint ? t("viewerHint") : label}
            </p>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t("close")}
              className="grid place-items-center w-11 h-11 rounded-full bg-white/12 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <X className="w-5 h-5" aria-hidden />
            </button>
          </div>
          <motion.div
            className="relative z-10 flex-1 min-h-0 px-3 md:px-10 pb-[max(16px,env(safe-area-inset-bottom))] pointer-events-none"
            initial={{ scale: reduce ? 1 : 0.96, y: reduce ? 0 : 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: reduce ? 1 : 0.97, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-full h-full max-w-[1280px] mx-auto">
              <Fit onTurn={setTurned}>{children}</Fit>
            </div>
          </motion.div>
          {turned && (
            <p className="pointer-events-none absolute z-20 left-0 right-0 bottom-[max(14px,env(safe-area-inset-bottom))] flex items-center justify-center gap-1.5 text-[12px] text-white/70">
              <RotateCw className="w-3.5 h-3.5" aria-hidden /> {t("rotate")}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
