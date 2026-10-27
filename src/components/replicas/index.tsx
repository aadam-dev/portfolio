"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType } from "react";
import type { ModeId } from "@/components/fieldkit/chapters";

const Loading = () => <div className="h-full grid place-items-center text-[12px] text-white/40 bg-[#0b0b0d]">Loading…</div>;

const Mode = dynamic(() => import("@/components/fieldkit/ModeScreen"), { ssr: false, loading: Loading });
const mode = (m: ModeId) => {
  const M = () => <Mode mode={m} />;
  M.displayName = `Replica(${m})`;
  return M;
};

export interface Replica {
  /** What the button opens, e.g. "the register". */
  label: string;
  /** Address shown in the browser bar while the replica is open. */
  url: string;
  Component: ComponentType;
  /** Fixed design size, scaled to fit (the shared desk modes are 640 x 400). */
  native?: [number, number];
}

/**
 * Working copies of each system's key screen, built from its real menu,
 * stock and prices. Each one is shared by the desk, Work in motion and the
 * case studies, so a system is built once.
 */
export const REPLICAS: Record<string, Replica> = {
  jireh: {
    label: "Try the register",
    url: "backoffice.jireh.app/pos",
    Component: dynamic(() => import("./JirehPos"), { ssr: false, loading: Loading }),
  },
  primehub: {
    label: "Open a shift",
    url: "primetijara.com/pos",
    Component: dynamic(() => import("./PrimeShift"), { ssr: false, loading: Loading }),
  },
  alboyut: { label: "Try the register", url: "alboyut.com/pos/terminal", Component: mode("counter"), native: [640, 400] },
  "enterprise-erp": { label: "Try the back office", url: "delish-services.odoo.com", Component: mode("ledger"), native: [640, 400] },
  zainas: { label: "Try the shop", url: "temporaryzainascouturedomain.vercel.app/shop", Component: mode("atelier"), native: [640, 400] },
  munamuse: { label: "Try the shop", url: "temporarymunamusedomain.vercel.app/shop", Component: mode("atelier"), native: [640, 400] },
  ethika: { label: "Try the model", url: "ethika.vercel.app/en/tools", Component: mode("analyst"), native: [640, 400] },
  madinabasketball: { label: "Try the court", url: "madinabball.vercel.app/court", Component: mode("court"), native: [640, 400] },
  koyi: { label: "Try the hub", url: "koyi-web.vercel.app/en/hub", Component: mode("classroom"), native: [640, 400] },
};

/** Render a fixed-size screen scaled to fill its box, centred, like a device. */
export function Fit({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(Math.min(el.clientWidth / w, el.clientHeight / h)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h]);
  return (
    <div ref={box} className="absolute inset-0 grid place-items-center overflow-hidden">
      <div style={{ width: w, height: h, transform: `scale(${k})`, opacity: k ? 1 : 0 }} className="shrink-0 overflow-hidden bg-white">
        {children}
      </div>
    </div>
  );
}
