"use client";
// Copy this file into your PORTFOLIO project (e.g. components/VisitTracker.tsx)
// and render <VisitTracker /> once inside app/layout.tsx's <body>.
// Set NEXT_PUBLIC_SCOUT_URL=https://your-scout-bot.vercel.app in the portfolio's env vars.
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SCOUT_URL;
    if (!url || process.env.NODE_ENV !== "production") return;
    if (localStorage.getItem("scout-ignore") === "1") return; // run localStorage.setItem("scout-ignore","1") to skip your own visits

    let sessionId = sessionStorage.getItem("scout-sid");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("scout-sid", sessionId);
    }
    const params = new URLSearchParams(location.search);
    const utm = ["utm_source", "utm_medium", "utm_campaign"]
      .map((k) => params.get(k) && `${k.slice(4)}=${params.get(k)}`).filter(Boolean).join(" ");

    fetch(`${url}/api/track`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        sessionId,
        path: pathname + location.search,
        referrer: document.referrer,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: `${screen.width}x${screen.height}`,
        utm,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
