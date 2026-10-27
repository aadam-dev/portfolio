"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  RotateCcw,
} from "lucide-react";
import { Project } from "@/lib/projects";

interface BrowserMockupProps {
  project: Project;
  activeScreen: string;
  onScreenChange: (screen: string) => void;
  children: React.ReactNode;
  /** Hide the simulated address bar for a tighter live-site framing. */
  compact?: boolean;
}

const urlMap: Record<string, Record<string, string>> = {
  "enterprise-erp": {
    site: "delish-rho.vercel.app",
    menu: "delish-rho.vercel.app/menu",
    backend: "delish-services.odoo.com",
  },
  koyi: {
    hub: "koyi-web.vercel.app/en/hub",
    pathway: "koyi-web.vercel.app/en/hub/pathways/wassce",
    schools: "koyi-web.vercel.app/en/hub/schools",
    madrasah: "koyi-web.vercel.app/en/madrasah",
  },
  munamuse: {
    landing: "temporarymunamusedomain.vercel.app",
    shop: "temporarymunamusedomain.vercel.app/shop",
    product: "temporarymunamusedomain.vercel.app/product/emerald-feather-kaftan",
    about: "temporarymunamusedomain.vercel.app/about",
  },
  zainas: {
    landing: "temporaryzainascouturedomain.vercel.app",
    shop: "temporaryzainascouturedomain.vercel.app/shop",
    product: "temporaryzainascouturedomain.vercel.app/product/naa-corset-midi",
    about: "temporaryzainascouturedomain.vercel.app/about",
  },
  primehub: {
    landing: "primetijara.com",
    products: "primetijara.com/products",
    categories: "primetijara.com/categories",
    admin: "primetijara.com/admin",
    orders: "primetijara.com/admin/orders",
    inventory: "primetijara.com/admin/inventory",
    pos: "primetijara.com/pos",
  },
  ethika: {
    landing: "ethika.vercel.app/en",
    regulation: "ethika.vercel.app/en/regulation",
    vault: "ethika.vercel.app/en/education",
    tools: "ethika.vercel.app/en/tools",
  },
  anisfoods: {
    landing: "anisfoods.com",
    pos: "pos.anisfoods.com/cashier",
    dashboard: "admin.anisfoods.com/dashboard",
    reports: "admin.anisfoods.com/reports/monthly",
  },
  rentcheck: {
    landing: "rentcheck.com.gh",
    listings: "rentcheck.com.gh/listings",
    detail: "rentcheck.com.gh/property/akr-2024-007",
  },
  lenus: {
    landing: "lenuspharmacy.com.gh",
    shop: "lenuspharmacy.com.gh/shop",
    checkout: "lenuspharmacy.com.gh/checkout",
  },
  ladyangel: {
    landing: "ladyangelnetwork.com",
    membership: "ladyangelnetwork.com/membership",
    portfolio: "ladyangelnetwork.com/portfolio",
  },
  madinabasketball: {
    landing: "madinabball.vercel.app",
    court: "madinabball.vercel.app/court",
    events: "madinabball.vercel.app/media",
  },
  pronaj: {
    landing: "pronajgh.com",
    digital: "pronajgh.com/digital",
    global: "pronajgh.com/global",
    contact: "pronajgh.com/contact",
  },
  makossa: {
    landing: "makossashop.vercel.app/en",
    catalog: "makossashop.vercel.app/en/catalog",
    locations: "makossashop.vercel.app/en/locations",
  },
  gaskiya: {
    landing: "gaskiya.com",
    collections: "gaskiya.com/collections",
    product: "gaskiya.com/products/eid-collection-001",
  },
  thepalms: {
    landing: "thepalmsbyeagles.com",
    rooms: "thepalmsbyeagles.com/rooms",
    amenities: "thepalmsbyeagles.com/amenities",
  },
  magilo: {
    landing: "magilo.com.gh",
    services: "magilo.com.gh/services",
    college: "magilo.com.gh/college",
  },
  rockmotion: {
    landing: "rockmotionautogroup.com",
    inventory: "rockmotionautogroup.com/inventory",
    process: "rockmotionautogroup.com/process",
  },
  alboyut: {
    landing: "alboyut.com",
    products: "alboyut.com/products",
    pos: "alboyut.com/pos/terminal",
    queue: "alboyut.com/pos/terminal",
    orders: "alboyut.com/admin/orders",
    inventory: "alboyut.com/admin/inventory",
    sales: "alboyut.com/admin/analytics",
    laundry: "alboyut.com/laundry",
    contact: "alboyut.com/contact",
  },
  jireh: {
    landing: "jirehnaturalfoods.vercel.app",
    menu: "backoffice.jireh.app/admin/menu",
    pos: "backoffice.jireh.app/pos",
    orders: "backoffice.jireh.app/admin/orders",
    inventory: "backoffice.jireh.app/admin/inventory",
    dashboard: "backoffice.jireh.app/admin",
    reports: "backoffice.jireh.app/admin/reports",
  },
};

export default function BrowserMockup({
  project,
  activeScreen,
  onScreenChange,
  children,
  compact,
}: BrowserMockupProps) {
  const screens = project.screens;
  const currentIndex = screens.findIndex((s) => s.id === activeScreen);
  const url = urlMap[project.id]?.[activeScreen] ?? `${project.id}.com`;

  const goPrev = () => {
    if (currentIndex > 0) onScreenChange(screens[currentIndex - 1].id);
  };
  const goNext = () => {
    if (currentIndex < screens.length - 1)
      onScreenChange(screens[currentIndex + 1].id);
  };

  return (
    <div
      className="theme-fixed flex flex-col h-full w-full overflow-hidden"
      style={{ background: "#050507" }}
    >
      {/* Chrome bar */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5"
        style={{
          background: "linear-gradient(180deg, #14141c 0%, #0d0d14 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>

        {/* Nav buttons (desktop only) */}
        <div className="hidden md:flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex <= 0}
            aria-label="Previous screen"
            className="p-1.5 rounded-md text-[var(--ink-3)] transition-all hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex >= screens.length - 1}
            aria-label="Next screen"
            className="p-1.5 rounded-md text-[var(--ink-3)] transition-all hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-md text-[var(--ink-4)] opacity-50"
            aria-hidden="true"
            tabIndex={-1}
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* URL bar */}
        <div
          className="flex-1 min-w-0 flex items-center justify-center gap-1.5 md:gap-2 px-3 py-1 rounded-md text-[10px] md:text-[11px]"
          style={{
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <Lock
            className="w-2.5 h-2.5 md:w-3 md:h-3 shrink-0"
            style={{ color: "#10B981" }}
          />
          <span className="truncate font-mono">{url}</span>
        </div>

        <div className="w-[44px] md:w-[72px] shrink-0" aria-hidden="true" />
      </div>

      {/* Screen tab strip - visible on all sizes, horizontally scrollable on small */}
      {!compact && screens.length > 1 && (
        <div
          className="flex-shrink-0 border-b border-[rgba(255,255,255,0.05)] overflow-x-auto scrollbar-none"
          role="tablist"
          aria-label="Screens"
        >
          <div className="flex items-center gap-1 px-2 py-1.5 w-max min-w-full">
            {screens.map((screen) => {
              const active = activeScreen === screen.id;
              return (
                <button
                  key={screen.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onScreenChange(screen.id)}
                  className="px-3 py-1.5 rounded-md text-[10px] md:text-[11px] uppercase font-mono tracking-[0.16em] transition-colors whitespace-nowrap"
                  style={{
                    background: active
                      ? `${project.accentColor}22`
                      : "transparent",
                    color: active
                      ? project.accentColor
                      : "rgba(255,255,255,0.45)",
                    border: active
                      ? `1px solid ${project.accentColor}40`
                      : "1px solid transparent",
                  }}
                >
                  {screen.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto preview-scroll relative bg-[#050505] min-h-[320px]">
        <ScaledPreview>{children}</ScaledPreview>
      </div>
    </div>
  );
}

/**
 * Coded previews are desktop layouts; below ~700px they collapse into
 * one-word-per-line columns. Render them at a fixed desktop width and
 * scale down to fit narrow containers instead.
 */
const PREVIEW_DESKTOP_WIDTH = 1024;

function ScaledPreview({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const measure = () => {
      const w = outer.clientWidth;
      const s = w >= 700 ? 1 : w / PREVIEW_DESKTOP_WIDTH;
      setScale(s);
      const inner = innerRef.current;
      setScaledHeight(s < 1 && inner ? inner.scrollHeight * s : undefined);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, []);

  if (scale >= 1) {
    return <div ref={outerRef} className="min-h-full">{children}</div>;
  }
  return (
    <div ref={outerRef} style={{ height: scaledHeight }} className="overflow-hidden">
      <div
        ref={innerRef}
        style={{
          width: PREVIEW_DESKTOP_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
