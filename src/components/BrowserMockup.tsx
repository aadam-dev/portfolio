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
    <div className="flex flex-col h-full rounded-xl overflow-hidden shadow-2xl"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Title bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3"
        style={{ background: "#1A1A2E", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:opacity-80 cursor-pointer transition-opacity flex items-center justify-center group">
            <X className="w-1.5 h-1.5 text-[#8B1F1A] opacity-0 group-hover:opacity-100" />
          </div>
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:opacity-80 cursor-pointer transition-opacity flex items-center justify-center group">
            <Minus className="w-1.5 h-1.5 text-[#8B6B00] opacity-0 group-hover:opacity-100" />
          </div>
          <div className="w-3 h-3 rounded-full bg-[#28C840] hover:opacity-80 cursor-pointer transition-opacity flex items-center justify-center group">
            <Maximize2 className="w-1.5 h-1.5 text-[#115A1B] opacity-0 group-hover:opacity-100" />
          </div>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="p-1 rounded transition-colors disabled:opacity-30"
            style={{ color: "#8585A8" }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleForward}
            disabled={currentIndex === screens.length - 1}
            className="p-1 rounded transition-colors disabled:opacity-30"
            style={{ color: "#8585A8" }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-1 rounded transition-colors opacity-30" style={{ color: "#8585A8" }}>
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
          style={{ background: "#0F0F1A", border: "1px solid rgba(255,255,255,0.06)", color: "#8585A8" }}>
          <Lock className="w-3 h-3 flex-shrink-0" style={{ color: "#10B981" }} />
          <span className="truncate font-mono text-xs">{url}</span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 ml-2 overflow-x-auto max-w-[280px]">
          {screens.map((screen) => (
            <button
              key={screen.id}
              onClick={() => onScreenChange(screen.id)}
              className="flex-shrink-0 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200"
              style={{
                background: activeScreen === screen.id
                  ? `${project.accentColor}20`
                  : "transparent",
                color: activeScreen === screen.id
                  ? project.accentColor
                  : "#8585A8",
                border: activeScreen === screen.id
                  ? `1px solid ${project.accentColor}40`
                  : "1px solid transparent",
              }}
            >
              {screen.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto preview-scroll" style={{ background: "#0A0A0F" }}>
        {children}
      </div>
    </div>
  );
}
