"use client";

import { useState } from "react";
import { X, Minus, Maximize2, ChevronLeft, ChevronRight, RotateCcw, Lock } from "lucide-react";
import { Project } from "@/lib/projects";

interface BrowserMockupProps {
  project: Project;
  activeScreen: string;
  onScreenChange: (screen: string) => void;
  children: React.ReactNode;
}

const urlMap: Record<string, Record<string, string>> = {
  koyi: {
    landing: "koyiacademy.com",
    courses: "koyiacademy.com/courses",
    lesson: "koyiacademy.com/learn/wassce-maths/lesson-3",
    dashboard: "koyiacademy.com/dashboard",
  },
  primehub: {
    landing: "primehub.com.gh",
    products: "primehub.com.gh/products",
    quote: "primehub.com.gh/quote/new",
  },
  ethika: {
    landing: "ethikawestafrica.com",
    comparison: "ethikawestafrica.com/compare",
    vault: "ethikawestafrica.com/knowledge",
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
    events: "madinabball.vercel.app/events",
  },
  pronaj: {
    landing: "pronajinternational.com",
    sectors: "pronajinternational.com/sectors",
    contact: "pronajinternational.com/contact",
  },
  makossa: {
    pos: "app://makossa-shop/pos",
    inventory: "app://makossa-shop/inventory",
    reports: "app://makossa-shop/reports",
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
  jireh: {
    landing: "jirehnaturalfoods.vercel.app",
    menu: "jirehnaturalfoods.vercel.app/#menu",
    contact: "jirehnaturalfoods.vercel.app/#contact",
  },
};

export default function BrowserMockup({
  project,
  activeScreen,
  onScreenChange,
  children,
}: BrowserMockupProps) {
  const [historyIndex, setHistoryIndex] = useState(0);
  const screens = project.screens;
  const currentIndex = screens.findIndex((s) => s.id === activeScreen);
  const url = urlMap[project.id]?.[activeScreen] ?? project.id + ".com";

  const handleBack = () => {
    if (currentIndex > 0) {
      onScreenChange(screens[currentIndex - 1].id);
    }
  };

  const handleForward = () => {
    if (currentIndex < screens.length - 1) {
      onScreenChange(screens[currentIndex + 1].id);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] relative"
      style={{ border: "1px solid rgba(255,255,255,0.06)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 60px -15px rgba(0,0,0,0.8)" }}>
      {/* Title bar */}
      <div className="flex-shrink-0 flex items-center justify-between gap-2 px-3 py-2 md:px-4 md:py-3"
        style={{ background: "linear-gradient(180deg, #1A1A2E 0%, #131322 100%)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        
        <div className="flex items-center gap-4 w-auto md:w-1/4">
          {/* Traffic lights - hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:opacity-80 cursor-pointer transition-opacity flex items-center justify-center group shadow-inner">
              <X className="w-2 h-2 text-[#8B1F1A] opacity-0 group-hover:opacity-100" />
            </div>
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:opacity-80 cursor-pointer transition-opacity flex items-center justify-center group shadow-inner">
              <Minus className="w-2 h-2 text-[#8B6B00] opacity-0 group-hover:opacity-100" />
            </div>
            <div className="w-3 h-3 rounded-full bg-[#28C840] hover:opacity-80 cursor-pointer transition-opacity flex items-center justify-center group shadow-inner">
              <Maximize2 className="w-2 h-2 text-[#115A1B] opacity-0 group-hover:opacity-100" />
            </div>
          </div>

          {/* Nav buttons */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="p-1 rounded-md transition-all hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
              style={{ color: "#8585A8" }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleForward}
              disabled={currentIndex === screens.length - 1}
              className="p-1 rounded-md transition-all hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
              style={{ color: "#8585A8" }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-md transition-all hover:bg-white/5 opacity-50" style={{ color: "#8585A8" }}>
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-lg flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 rounded-lg text-[10px] md:text-[11px] shadow-inner transition-colors hover:bg-[#0b0b14]"
          style={{ background: "#08080C", border: "1px solid rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}>
          <Lock className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" style={{ color: "#10B981" }} />
          <span className="truncate font-mono tracking-wide">{url}</span>
        </div>

        {/* Tabs - Aligned Right */}
        <div className="hidden lg:flex items-center justify-end gap-1.5 w-auto md:w-1/4">
          <div className="bg-[#0A0A0F] rounded-lg p-0.5 border border-white/5 shadow-inner">
            {screens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => onScreenChange(screen.id)}
                className="flex-shrink-0 px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all duration-300"
                style={{
                  background: activeScreen === screen.id
                    ? `${project.accentColor}1A`
                    : "transparent",
                  color: activeScreen === screen.id
                    ? project.accentColor
                    : "rgba(255,255,255,0.3)",
                  boxShadow: activeScreen === screen.id ? "0 1px 3px rgba(0,0,0,0.5)" : "none"
                }}
              >
                {screen.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto preview-scroll relative bg-[#050505]">
        {children}
      </div>
    </div>
  );
}
