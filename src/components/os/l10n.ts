"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";

/** Every string the phone and Aadam OS show, in one place per language. */
const en = {
  phone: {
    label: "Aadam's phone",
    home: "Home",
    goHome: "Go home",
    putDown: "Put it down",
    page: (n: number) => `Page ${n}`,
    swipeMore: "Swipe for more apps",
    scrollCue: "Scroll for the work",
    heroHint: "This is my phone, and everything on it works. Take a selfie for my wall, book a call, leave a note or play with the systems I have built.",
    apps: {
      camera: "Camera",
      photos: "Photos",
      calendar: "Calendar",
      notes: "Notes",
      music: "Music",
      maps: "Maps",
      wallet: "Wallet",
      files: "Files",
      kits: "Kits",
      systems: "Systems",
      bloom: "Bloom Boba",
      alboyut: "Al Boyut",
      court: "Court",
      safari: "Safari",
      mail: "Mail",
      whatsapp: "WhatsApp",
      contacts: "Contacts",
      clock: "Clock",
      settings: "Settings",
      about: "About",
    },
    widget: {
      available: "Available for remote work",
      hours: "EU and US hours",
      accra: "Accra · GMT+0",
      nowPlaying: "Now playing",
      paused: "Paused",
      tapRain: "Tap to play the rain",
      weather: "Accra",
      noDst: "Ghana · GMT+0 all year, no clock changes",
      feels: (c: number) => `Feels like ${c}°`,
      weatherCodes: { clear: "Clear", cloudy: "Cloudy", fog: "Haze", rain: "Rain", storm: "Thunderstorms" },
    },
  },
  camera: {
    title: "Leave your face on my wall",
    body: "Take a selfie or pick a photo. It stays on this phone, and if you like, it goes to my Visitors album once I have approved it.",
    turnOn: "Turn on the camera",
    choose: "Choose a photo",
    blocked: "The camera is off or blocked here. You can still choose a photo.",
    shutter: "Take the photo",
    flip: "Flip camera",
    cancel: "Cancel",
    retake: "Retake",
    send: "Save and send for approval",
    keep: "Save on this phone only",
    name: "Your name (optional)",
    consent: "Sending it means I may show it in the Visitors album after I approve it. Ask me any time and I will take it down.",
    sending: "Sending…",
    stamp: (d: string) => `aadambuilds.dev · ${d}`,
  },
  photos: {
    albums: "Albums",
    yours: "Yours",
    visitors: "Visitors",
    desk: "Desk",
    work: "Work",
    count: (n: number) => (n === 1 ? "1 photo" : `${n} photos`),
    pending: "Waiting for approval",
    local: "On this phone only",
    approved: "Approved",
    failed: "Not sent",
    emptyYours: "Nothing yet. Open the Camera and leave one.",
    openCamera: "Open the Camera",
    emptyVisitors: "No approved visitor photos yet. Be the first.",
    remove: "Delete from this phone",
    sendNow: "Send for approval",
    openProject: "Open the project",
    back: "Albums",
    visitor: "A visitor",
  },
  calendar: {
    title: "Book a call",
    hours: "My hours: 09:00 to 17:00 in Accra (GMT+0), Monday to Friday.",
    yourTime: (tz: string) => `Times in your time zone, ${tz}.`,
    today: "Today",
    pick: "Pick a time",
    deep: "Deep work",
    ship: "Weekly ship",
    weekend: "I keep weekends for the court and the shop.",
    none: "Nothing left on this day. Try another one.",
    name: "Your name",
    contact: "Email or WhatsApp number",
    topic: "What would you like to talk about? (optional)",
    request: "Request this time",
    sending: "Sending…",
    sent: "Requested. I'll confirm by email or WhatsApp within a day.",
    ics: "Add it to my calendar",
    error: "That didn't send. Try again, or use WhatsApp.",
    change: "Change",
    range: (a: string, b: string) => `${a} to ${b}`,
    minutes: "30 minutes, video call",
  },
  maps: {
    title: "Where the work runs",
    accra: "Accra",
    world: "World",
    failed: "The map didn't load, so here is the list.",
  },
  wallet: {
    hint: "Tap a pass to open it",
    card: "Business card",
  },
  files: {
    press: "Press kit",
    shots: "Screenshots",
    code: "Code",
    notes: "Notes",
    kits: "Starter kits",
    download: "Download",
  },
  systems: {
    hint: "These are the real systems, scaled down. Tap around.",
  },
  safari: {
    favourites: "Favourites",
    newTab: "Open in a new tab",
    framed: "Some sites won't open inside another page. The arrow opens it in a tab.",
  },
  contacts: {
    save: "Add to contacts",
    whatsapp: "WhatsApp",
    email: "Email",
    based: "Based in",
    hours: "Hours",
    site: "Site",
    role: "Forward deployed engineer",
  },
  clock: {
    world: "World clock",
    you: "You",
    me: "Me, Accra",
    ahead: (h: number) => (h === 0 ? "Same time as me" : h > 0 ? `${h} h ahead of me` : `${-h} h behind me`),
    working: "I'm working now",
    off: "I'm off for the day",
  },
  settings: {
    appearance: "Appearance",
    light: "Light",
    dark: "Dark",
    language: "Language",
    wallpaper: "Wallpaper",
    desk: "My desk",
    swirl: "Swirl",
    aboutPhone: "About this phone",
    aboutBody: "Everything here is real: the systems run, the mail reaches me, the photos and notes wait for my approval. Built with Next.js, by me.",
  },
};

export type OsText = typeof en;
type Partial2<T> = { [K in keyof T]?: T[K] extends (...a: never[]) => unknown ? T[K] : T[K] extends object ? Partial2<T[K]> : T[K] };

// French and Arabic are filled in with the translations pass; anything missing falls back to English
const DICT: Record<string, Partial2<OsText>> = { fr: {}, ar: {} };

function merge<T>(base: T, over?: Partial2<T>): T {
  if (!over) return base;
  const out = { ...base } as Record<string, unknown>;
  for (const [k, v] of Object.entries(over)) {
    const b = (base as Record<string, unknown>)[k];
    out[k] = v && typeof v === "object" && b && typeof b === "object" ? merge(b, v as never) : v;
  }
  return out as T;
}

export function osText(locale: string): OsText {
  return merge(en, DICT[locale]);
}

export function useOsText(): OsText {
  const locale = useLocale();
  return useMemo(() => osText(locale), [locale]);
}
