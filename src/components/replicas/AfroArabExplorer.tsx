"use client";

import { useState } from "react";
import { ArrowUpRight, Box } from "lucide-react";
import { useMediaQuery } from "@/lib/useMediaQuery";

const EXPLORER = "https://afroarab-properties.vercel.app/lands/titled-lands-green-valley/explorer?plot=17";

/**
 * The real Afro Arab plot explorer, not a copy: it is a WebGL estate, so the portfolio loads the live
 * preview in a frame, only when asked. Phones get the recording and a link out, since a 3D estate
 * inside a card inside a phone is too small to use.
 */
export default function AfroArabExplorer() {
  const roomy = useMediaQuery("(min-width: 768px)");
  const [on, setOn] = useState(false);

  if (roomy === false) {
    return (
      <div className="theme-fixed relative h-full w-full bg-[#0f1c16] text-white">
        <video src="/walkthroughs/afroarab-explorer.mp4" poster="/previews/afroarab/explorer.webp" muted loop autoPlay playsInline preload="metadata" className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4 pt-16">
          <a href={EXPLORER} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#C9A35C] px-4 text-[13px] font-semibold text-black">
            Open the explorer <ArrowUpRight className="h-4 w-4" />
          </a>
          <p className="mt-2 text-[11.5px] text-white/65">Plot layout, sizes and prices are illustrative.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-fixed relative h-full w-full bg-[#cfe0e6]">
      {on ? (
        <iframe
          title="Afro Arab: Green Valley plot explorer (live preview)"
          src={EXPLORER}
          sandbox="allow-scripts allow-same-origin allow-popups"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/previews/afroarab/explorer.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 grid place-items-center bg-black/25">
            <div className="flex flex-col items-center gap-3 text-center">
              <button onClick={() => setOn(true)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0f1c16] px-6 text-[14px] font-semibold text-white shadow-lg hover:bg-[#1b3022]">
                <Box className="h-4 w-4 text-[#C9A35C]" /> Launch the 3D explorer
              </button>
              <a href={EXPLORER} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-black/45 px-3 py-1.5 text-[12px] text-white">
                or open it in a new tab <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </>
      )}
      <p className="pointer-events-none absolute bottom-2 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white/85">
        Live preview · plot layout, sizes and prices are illustrative
      </p>
    </div>
  );
}
