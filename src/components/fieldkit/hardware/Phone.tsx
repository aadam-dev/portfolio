"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAccraClock } from "../clock";

export interface Notice {
  id: number;
  app: string;
  icon?: string;
  title: string;
  body: string;
}

type NotifyFn = (n: Omit<Notice, "id">) => void;
const NotifyContext = createContext<NotifyFn>(() => {});
export const useNotify = () => useContext(NotifyContext);

/** A modern phone: thin metal rail, glass, island, status bar, notification banners. */
export default function Phone({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  const reduce = useReducedMotion();
  const time = useAccraClock();
  const [notice, setNotice] = useState<Notice | null>(null);
  const seq = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((n: Omit<Notice, "id">) => {
    seq.current += 1;
    setNotice({ ...n, id: seq.current });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(null), 4200);
  }, []);

  return (
    <NotifyContext.Provider value={notify}>
      <div
        className="relative mx-auto w-[min(304px,86vw)] h-[620px] rounded-[52px] p-[3px]"
        style={{
          background: "linear-gradient(135deg, var(--hw-rail-hi) 0%, var(--hw-rail) 30%, var(--hw-rail-lo) 70%, var(--hw-rail-hi) 100%)",
          boxShadow: "0 40px 70px -34px rgba(0,0,0,0.6), 0 14px 28px -14px rgba(0,0,0,0.45)",
        }}
      >
        {/* side buttons */}
        <span className="absolute -left-[2px] top-[118px] w-[3px] h-[28px] rounded-l bg-[var(--hw-rail-lo)]" aria-hidden="true" />
        <span className="absolute -left-[2px] top-[160px] w-[3px] h-[48px] rounded-l bg-[var(--hw-rail-lo)]" aria-hidden="true" />
        <span className="absolute -right-[2px] top-[150px] w-[3px] h-[70px] rounded-r bg-[var(--hw-rail-lo)]" aria-hidden="true" />
        <div className="relative w-full h-full rounded-[49px] bg-black p-[9px]">
          <div className={`theme-fixed relative w-full h-full overflow-hidden rounded-[40px] ${dark ? "bg-[#0d1222]" : "bg-white"}`}>
            {/* status bar */}
            <div
              className="absolute inset-x-0 top-0 z-30 h-[40px] flex items-center justify-between px-[26px] pt-[6px] text-[11.5px] font-semibold text-white mix-blend-difference"
              aria-hidden="true"
            >
              <span className="tabular-nums w-[44px]">{time || "9:41"}</span>
              <span className="flex items-center gap-[5px]">
                <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
                  <rect x="0" y="6" width="3" height="4" rx="0.8" />
                  <rect x="4.3" y="4" width="3" height="6" rx="0.8" />
                  <rect x="8.6" y="2" width="3" height="8" rx="0.8" />
                  <rect x="12.9" y="0" width="3" height="10" rx="0.8" />
                </svg>
                <svg width="22" height="11" viewBox="0 0 22 11" fill="none" stroke="currentColor">
                  <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" opacity="0.4" />
                  <rect x="2" y="2" width="13" height="7" rx="1.4" fill="currentColor" stroke="none" />
                  <path d="M20.5 4v3" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </div>
            {/* island */}
            <span className="absolute top-[10px] left-1/2 -ml-[46px] w-[92px] h-[26px] rounded-full bg-black z-40" aria-hidden="true" />

            <div className="@container absolute inset-x-0 bottom-0 top-[40px]">{children}</div>

            {/* notification */}
            <AnimatePresence>
              {notice && (
                <motion.div
                  key={notice.id}
                  role="status"
                  className="absolute left-[8px] right-[8px] top-[8px] z-50 rounded-[22px] bg-[#f2f2f4]/95 text-black px-3 py-2.5 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]"
                  initial={reduce ? { opacity: 0 } : { y: -90, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { y: -90, opacity: 0 }}
                  transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 380, damping: 30 }}
                >
                  <div className="flex items-center gap-2 text-[10.5px] text-black/55">
                    {notice.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={notice.icon} alt="" width={18} height={18} className="w-[18px] h-[18px] rounded-[5px]" />
                    ) : (
                      <span className="w-[18px] h-[18px] rounded-[5px] bg-[#34c759]" />
                    )}
                    <span className="uppercase tracking-[0.04em]">{notice.app}</span>
                    <span className="ml-auto">now</span>
                  </div>
                  <div className="mt-1 text-[12.5px] font-semibold leading-tight">{notice.title}</div>
                  <div className="text-[12px] leading-snug text-black/80">{notice.body}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* home indicator */}
            <span
              className={`absolute bottom-[7px] left-1/2 -ml-[58px] w-[116px] h-[4px] rounded-full z-40 ${dark ? "bg-white/80" : "bg-black/80"}`}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </NotifyContext.Provider>
  );
}
