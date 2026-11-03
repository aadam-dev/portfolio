"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sends page views to Scout, my separate visit bot (NEXT_PUBLIC_SCOUT_URL), alongside the
 * site's own tracker. Production only. It skips the Office, honours Do Not Track and Global
 * Privacy Control, and sends the path without its query string (UTM tags are sent on their own).
 * To leave out your own visits: localStorage.setItem("scout-ignore", "1").
 */
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SCOUT_URL;
    if (!url || process.env.NODE_ENV !== "production") return;
    if (pathname.startsWith("/office")) return;
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return;
    try {
      if (localStorage.getItem("scout-ignore") === "1") return;
    } catch {
      // storage blocked: carry on
    }

    let sessionId: string | null = null;
    try {
      sessionId = sessionStorage.getItem("scout-sid");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem("scout-sid", sessionId);
      }
    } catch {
      sessionId = crypto.randomUUID();
    }
    const params = new URLSearchParams(location.search);
    const utm = ["utm_source", "utm_medium", "utm_campaign"]
      .map((k) => params.get(k) && `${k.slice(4)}=${params.get(k)}`)
      .filter(Boolean)
      .join(" ");

    fetch(`${url}/api/track`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        sessionId,
        path: pathname,
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
