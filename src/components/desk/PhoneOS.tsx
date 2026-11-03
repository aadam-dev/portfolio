"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { findProject } from "@/lib/projects";
import { SERVICES } from "@/lib/services";

type App = "home" | "bloom" | "safari" | "alboyut" | "court" | "notes";

/**
 * The phone on the desk, picked up: an iOS-style home screen with real projects as apps.
 * Opens as a modal; Esc or the home bar closes the app, then the phone.
 */
export default function PhoneOS({ onClose }: { onClose: () => void }) {
  const [app, setApp] = useState<App>("home");
  const [time, setTime] = useState("");
  const alboyut = findProject("al-boyut");
  const court = findProject("madinabasketball");

  useEffect(() => {
    const fmt = () => setTime(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Accra" }).format(new Date()));
    fmt();
    const t = setInterval(fmt, 20000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setApp((a) => (a === "home" ? (onClose(), a) : "home"));
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      clearInterval(t);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [onClose]);

  const apps: { id: App | "mail" | "whatsapp"; name: string; icon: string; bg?: string; href?: string }[] = [
    { id: "bloom", name: "Bloom Boba", icon: "/studio/bloom-builder-taro.webp" },
    { id: "safari", name: "Safari", icon: "", bg: "linear-gradient(160deg,#5ac8fa,#007aff)" },
    { id: "alboyut", name: "Al Boyut", icon: alboyut?.mobileShowcase?.[0]?.src ?? "" },
    { id: "court", name: "Court", icon: "/previews/madinabasketball/court.webp" },
    { id: "notes", name: "Notes", icon: "", bg: "linear-gradient(180deg,#ffd60a 0 24%,#fffdf5 24%)" },
    { id: "mail", name: "Mail", icon: "", bg: "linear-gradient(160deg,#4fc3ff,#1a73e8)", href: "/#contact" },
    { id: "whatsapp", name: "WhatsApp", icon: "", bg: "linear-gradient(160deg,#5be37d,#1fa851)", href: "https://wa.me/233559602056" },
  ];

  return (
    <div className="theme-fixed fixed inset-0 z-[95] flex items-center justify-center bg-black/70 backdrop-blur-md [animation:aos-pop_.4s_cubic-bezier(.22,1,.36,1)_both]" role="dialog" aria-modal="true" aria-label="Aadam's phone">
      <button onClick={onClose} className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white hover:bg-white/20">
        Put it down ✕
      </button>

      {/* the phone */}
      <div className="relative aspect-[9/19.5] h-[min(86svh,860px)] max-w-[92vw] rounded-[54px] bg-[#1a1a1c] p-[11px] shadow-[0_40px_120px_rgba(0,0,0,0.6),inset_0_0_0_2px_#3a3a3c]">
        <div className="relative h-full w-full overflow-hidden rounded-[44px] bg-black text-white" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, var(--font-sans)" }}>
          {/* wallpaper */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/os/wallpaper-swirl.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_50%]" />
          <div className="absolute inset-0 bg-black/25" />

          {/* status bar + island */}
          <div className="absolute inset-x-0 top-0 z-20 flex h-12 items-center justify-between px-7 text-[14px] font-semibold">
            <span>{time}</span>
            <span className="absolute left-1/2 top-2.5 h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1.5 text-[12px]">
              <span>●●●</span>
              <span className="inline-block h-[11px] w-[22px] rounded-[3px] border border-white/80 p-[1.5px]">
                <span className="block h-full w-[80%] rounded-[1px] bg-white" />
              </span>
            </span>
          </div>

          {app === "home" && (
            <div className="absolute inset-0 z-10 flex flex-col px-5 pb-6 pt-16">
              {/* widget */}
              <div className="rounded-[22px] bg-white/15 p-4 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/70">Accra · GMT+0</p>
                <p className="mt-1 text-[34px] font-light leading-none tabular-nums">{time}</p>
                <p className="mt-2 text-[12px] text-white/80">Available for remote work · EU & US hours</p>
              </div>
              <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-5">
                {apps.map((a) => {
                  const icon = (
                    <>
                      <span className="block aspect-square w-full overflow-hidden rounded-[15px] shadow-[0_6px_18px_rgba(0,0,0,0.35)]" style={{ background: a.bg ?? "#222" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {a.icon && <img src={a.icon} alt="" className="h-full w-full object-cover" />}
                        {a.id === "safari" && (
                          <svg viewBox="0 0 40 40" className="h-full w-full p-2.5" aria-hidden>
                            <circle cx="20" cy="20" r="16" fill="none" stroke="#fff" strokeWidth="2" />
                            <path d="M27 13l-9 5-5 9 9-5z" fill="#fff" />
                            <path d="M13 27l5-9 4 4z" fill="#ff3b30" />
                          </svg>
                        )}
                      </span>
                      <span className="mt-1.5 block truncate text-center text-[11px] text-white [text-shadow:0_1px_3px_rgba(0,0,0,.6)]">{a.name}</span>
                    </>
                  );
                  return a.href ? (
                    <a key={a.id} href={a.href} target={a.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" onClick={a.href.startsWith("/") ? onClose : undefined} className="block">
                      {icon}
                    </a>
                  ) : (
                    <button key={a.id} onClick={() => setApp(a.id as App)} className="block text-left" aria-label={`Open ${a.name}`}>
                      {icon}
                    </button>
                  );
                })}
              </div>
              <p className="mt-auto text-center text-[12px] text-white/70">Tap an app · Esc to put it down</p>
            </div>
          )}

          {app === "bloom" && (
            <Screen title="Bloom Boba" onHome={() => setApp("home")}>
              <video src="/walkthroughs/bloom-boba-mobile.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
            </Screen>
          )}
          {app === "safari" && (
            <Screen title="bloom-boba.vercel.app" onHome={() => setApp("home")}>
              <iframe src="https://bloom-boba.vercel.app" title="Bloom Boba, live" className="h-full w-full border-0 bg-black" />
            </Screen>
          )}
          {app === "alboyut" && (
            <Screen title="Al Boyut · counter" onHome={() => setApp("home")}>
              <div className="flex h-full snap-x snap-mandatory overflow-x-auto" data-lenis-prevent>
                {(alboyut?.mobileShowcase ?? []).map((m) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={m.src} src={m.src} alt={m.label} className="h-full w-full shrink-0 snap-center object-cover object-top" />
                ))}
              </div>
            </Screen>
          )}
          {app === "court" && (
            <Screen title="Madina court" onHome={() => setApp("home")}>
              <div className="h-full overflow-y-auto bg-[#0d0d0d] p-4" data-lenis-prevent>
                {["court", "events", "landing"].map((k) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={k} src={`/previews/madinabasketball/${k}.webp`} alt="" className="mb-3 w-full rounded-xl" />
                ))}
                <p className="text-[13px] text-white/70">{court?.tagline}. Game clips coming soon.</p>
                <Link href="/work/madinabasketball" onClick={onClose} className="mt-3 inline-block text-[13px] text-[#ff8a5c]">
                  Open the project →
                </Link>
              </div>
            </Screen>
          )}
          {app === "notes" && (
            <Screen title="Notes" onHome={() => setApp("home")} light>
              <div className="h-full overflow-y-auto bg-[#fffdf5] p-5 text-[#1c1c1e]" data-lenis-prevent>
                <p className="text-[22px] font-bold">What I do</p>
                {SERVICES.map((s) => (
                  <div key={s.n} className="mt-4">
                    <p className="text-[14px] font-semibold">
                      {s.n} {s.title}
                    </p>
                    <p className="text-[13px] text-black/60">{s.short}</p>
                  </div>
                ))}
              </div>
            </Screen>
          )}

          {/* home bar */}
          <button onClick={() => (app === "home" ? onClose() : setApp("home"))} className="absolute bottom-2 left-1/2 z-30 h-[5px] w-[130px] -translate-x-1/2 rounded-full bg-white/80" aria-label={app === "home" ? "Put the phone down" : "Go home"} />
        </div>
      </div>
    </div>
  );
}

function Screen({ title, onHome, children, light }: { title: string; onHome: () => void; children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`absolute inset-0 z-10 flex flex-col pt-12 ${light ? "bg-[#fffdf5]" : "bg-black"} [animation:aos-pop_.3s_cubic-bezier(.22,1,.36,1)_both]`}>
      <div className={`flex items-center justify-between px-4 pb-2 text-[13px] ${light ? "text-[#007aff]" : "text-white/70"}`}>
        <button onClick={onHome}>‹ Home</button>
        <span className={`max-w-[60%] truncate ${light ? "text-black/60" : ""}`}>{title}</span>
        <span className="w-10" />
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
