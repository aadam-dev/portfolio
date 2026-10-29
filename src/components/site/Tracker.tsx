"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { onEmit } from "@/components/fieldkit/events";
import { IGNORE_KEY, isIgnored, setIgnored } from "@/lib/ignore";

/**
 * First-party visit tracking for the back office: page views, what people
 * played with, and time on site. Runs only on Vercel deployments, never for
 * visitors who ask not to be tracked, and never inside /office.
 */
const ON = !!process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NEXT_PUBLIC_TRACK_LOCAL === "1";

type Item = { type: "view" | "kit"; path?: string; name?: string; detail?: string };

function id(storage: Storage | null, key: string) {
  try {
    let v = storage?.getItem(key);
    if (!v) {
      v = crypto.randomUUID();
      storage?.setItem(key, v);
    }
    return v;
  } catch {
    return crypto.randomUUID();
  }
}

/** This visit's id, so forms can tie a message to the visit behind it. */
export function visitSession() {
  if (typeof window === "undefined") return undefined;
  try {
    return sessionStorage.getItem("visit-sid") ?? undefined;
  } catch {
    return undefined;
  }
}

class Beacon {
  queue: Item[] = [];
  sid = "";
  vid: string | undefined;
  visible = 0; // ms the page has been visible this visit
  since = 0;
  first = true;
  timer = 0;

  start() {
    this.sid = id(typeof sessionStorage === "undefined" ? null : sessionStorage, "visit-sid");
    try {
      this.vid = id(localStorage, "visit-vid");
    } catch {
      this.vid = undefined;
    }
    try {
      this.visible = Number(sessionStorage.getItem("visit-ms") ?? 0);
    } catch {}
    this.since = document.visibilityState === "visible" ? performance.now() : 0;
  }

  seconds() {
    const live = this.since ? performance.now() - this.since : 0;
    return Math.round((this.visible + live) / 1000);
  }

  pause() {
    if (this.since) this.visible += performance.now() - this.since;
    this.since = 0;
    try {
      sessionStorage.setItem("visit-ms", String(Math.round(this.visible)));
    } catch {}
  }

  resume() {
    if (!this.since) this.since = performance.now();
  }

  push(i: Item) {
    this.queue.push(i);
    if (i.type === "view") this.flush();
    else if (!this.timer) this.timer = window.setTimeout(() => this.flush(), 4000);
  }

  flush(leaving = false) {
    window.clearTimeout(this.timer);
    this.timer = 0;
    if (!this.queue.length && !leaving) return;
    const body: Record<string, unknown> = { sid: this.sid, vid: this.vid, seconds: this.seconds(), items: this.queue.splice(0, 50) };
    if (this.first) {
      this.first = false;
      const q = new URLSearchParams(location.search);
      const utm = Object.fromEntries([...q].filter(([k]) => k.startsWith("utm_")));
      body.ref = document.referrer && !document.referrer.startsWith(location.origin) ? document.referrer : undefined;
      body.utm = utm;
    }
    const json = JSON.stringify(body);
    if (leaving && navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([json], { type: "text/plain" }));
    else fetch("/api/track", { method: "POST", body: json, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(() => {});
  }
}

let beacon: Beacon | null = null;

export default function Tracker() {
  const path = usePathname();
  const [toast, setToast] = useState<string | null>(null);

  // ?scout-ignore=1 (or 0) switches counting off (or on) for this browser: no console needed on a phone
  useEffect(() => {
    const url = new URL(window.location.href);
    const v = url.searchParams.get(IGNORE_KEY);
    if (v !== "1" && v !== "0") return;
    setIgnored(v === "1");
    url.searchParams.delete(IGNORE_KEY);
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    const show = window.setTimeout(() => setToast(v === "1" ? "This browser won't be counted" : "This browser is counted again"), 0);
    const hide = window.setTimeout(() => setToast(null), 3600);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (!ON || beacon) return;
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return;
    // the owner's own devices (scout-ignore, also set on signing in to /office) are never tracked
    if (isIgnored()) return;
    const b = new Beacon();
    b.start();
    beacon = b;
    const off = onEmit((e) => !location.pathname.startsWith("/office") && b.push({ type: "kit", name: `${e.source}.${e.name}`, detail: e.detail }));
    const vis = () => {
      if (document.visibilityState === "hidden") {
        b.pause();
        b.flush(true);
      } else b.resume();
    };
    document.addEventListener("visibilitychange", vis);
    window.addEventListener("pagehide", vis);
    return () => {
      off();
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("pagehide", vis);
      beacon = null;
    };
  }, []);

  useEffect(() => {
    // the first effect may not have run yet on the very first render
    const t = window.setTimeout(() => {
      if (!beacon || path.startsWith("/office")) return;
      beacon.push({ type: "view", path });
    }, 0);
    return () => window.clearTimeout(t);
  }, [path]);

  if (!toast) return null;
  return (
    <div role="status" className="theme-fixed fixed left-1/2 bottom-6 z-[100] -translate-x-1/2 rounded-full border border-[var(--line-strong)] bg-[#12100d]/95 px-4 py-2.5 text-[13px] text-[var(--foreground)] shadow-[0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur">
      {toast}
    </div>
  );
}
