"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { visitSession } from "@/components/site/Tracker";
import { useOsText, intlLocale } from "../l10n";

// Accra is GMT+0 all year, so my working day is a fixed UTC window
const DAY = 86_400_000;
const SLOT = 30; // minutes
const OPEN = 11; // bookable from 11:00, after the morning's deep work
const CLOSE = 17;

type Block = { start: number; end: number; kind: "slot" | "deep" | "ship" };

function dayBlocks(day: number, now: number): Block[] {
  const d = new Date(day);
  const wd = d.getUTCDay();
  if (wd === 0 || wd === 6) return [];
  const at = (h: number, m = 0) => day + (h * 60 + m) * 60_000;
  const out: Block[] = [{ start: at(9), end: at(OPEN), kind: "deep" }];
  const shipFrom = wd === 5 ? at(15) : at(CLOSE);
  for (let t = at(OPEN); t < shipFrom; t += SLOT * 60_000) if (t > now + 3 * 3_600_000) out.push({ start: t, end: t + SLOT * 60_000, kind: "slot" });
  if (wd === 5) out.push({ start: at(15), end: at(17), kind: "ship" });
  return out;
}

const stamp = (t: number) => new Date(t).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function icsFor(start: number, end: number) {
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//aadambuilds.dev//call//EN",
    "BEGIN:VEVENT",
    `UID:${start}-${Math.random().toString(36).slice(2)}@aadambuilds.dev`,
    `DTSTAMP:${stamp(Date.now())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    "SUMMARY:Call with Aadam (to be confirmed)",
    "DESCRIPTION:Requested on aadambuilds.dev. Aadam confirms by email or WhatsApp with a link.",
    "STATUS:TENTATIVE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
}

/** Calendar: my week in your time zone, and a real request for a call that lands in my Leads. */
export default function CalendarApp() {
  const t = useOsText().calendar;
  const locale = useLocale();
  const [now] = useState(() => Date.now());
  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", []);
  const today = Math.floor(now / DAY) * DAY;
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => today + i * DAY), [today]);
  const firstOpen = days.find((d) => dayBlocks(d, now).some((b) => b.kind === "slot")) ?? today;
  const [day, setDay] = useState(firstOpen);
  const [pick, setPick] = useState<Block | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [ics, setIcs] = useState<string | null>(null);

  const fmtDay = (d: number, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(intlLocale(locale), { ...o, timeZone: "UTC" }).format(d);
  const fmtTime = (x: number, zone = tz) => new Intl.DateTimeFormat(intlLocale(locale), { hour: "2-digit", minute: "2-digit", timeZone: zone }).format(x);
  const blocks = dayBlocks(day, now);

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pick) return;
    const f = new FormData(e.currentTarget);
    setState("sending");
    const when = new Date(pick.start);
    const message = [
      `Call request for ${when.toUTCString().replace(" GMT", "")} Accra time (${fmtTime(pick.start)} in ${tz}).`,
      f.get("topic") ? `Topic: ${f.get("topic")}` : null,
      "Booked from the phone's Calendar.",
    ]
      .filter(Boolean)
      .join("\n");
    const r = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "call", name: f.get("name"), contact: f.get("contact"), message, budget: "30 min call", sid: visitSession() }),
    }).catch(() => null);
    if (r?.ok) {
      setIcs(icsFor(pick.start, pick.end));
      setState("sent");
    } else setState("error");
  };

  return (
    <div className="flex min-h-full flex-col bg-[#f6f5f2] text-[#1c1c1e]">
      <div className="px-4 pt-2">
        <p className="text-[26px] font-bold capitalize">{fmtDay(day, { month: "long", year: "numeric" })}</p>
        <p className="text-[12.5px] text-black/55">{t.hours}</p>
        <p className="text-[12.5px] text-black/55">{t.yourTime(tz.replace(/_/g, " "))}</p>
      </div>

      {/* two weeks, a strip you can swipe */}
      <div className="mt-3 flex snap-x gap-1.5 overflow-x-auto px-3 pb-2 [scrollbar-width:none]" data-lenis-prevent>
        {days.map((d) => {
          const wd = new Date(d).getUTCDay();
          const off = wd === 0 || wd === 6;
          const on = d === day;
          return (
            <button
              key={d}
              onClick={() => {
                setDay(d);
                setPick(null);
                setState("idle");
              }}
              aria-pressed={on}
              className={`flex w-[46px] shrink-0 snap-start flex-col items-center rounded-2xl py-2 ${on ? "bg-[#ff3b30] text-white" : off ? "text-black/30" : "bg-white text-black"}`}
            >
              <span className="text-[10.5px] uppercase">{fmtDay(d, { weekday: "short" })}</span>
              <span className="text-[18px] font-semibold tabular-nums">{fmtDay(d, { day: "numeric" })}</span>
              {d === today && <span className={`mt-0.5 h-1 w-1 rounded-full ${on ? "bg-white" : "bg-[#ff3b30]"}`} aria-label={t.today} />}
            </button>
          );
        })}
      </div>

      {state === "sent" && pick ? (
        <div className="m-4 rounded-2xl bg-white p-5">
          <p className="text-[17px] font-semibold">✓ {t.sent}</p>
          <p className="mt-1 text-[13px] text-black/60">
            {fmtDay(pick.start, { weekday: "long", day: "numeric", month: "long" })} · {fmtTime(pick.start)} ({t.minutes})
          </p>
          {ics && (
            <a href={ics} download="call-with-aadam.ics" className="mt-4 inline-block rounded-full bg-black px-4 py-2 text-[13px] font-semibold text-white">
              {t.ics}
            </a>
          )}
        </div>
      ) : pick ? (
        <form onSubmit={send} className="m-4 space-y-2.5 rounded-2xl bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold">
              {fmtDay(pick.start, { weekday: "short", day: "numeric", month: "short" })} · {fmtTime(pick.start)}
            </p>
            <button type="button" onClick={() => setPick(null)} className="text-[13px] text-[#007aff]">
              {t.change}
            </button>
          </div>
          <p className="text-[12px] text-black/50">
            {t.minutes} · Accra {fmtTime(pick.start, "Africa/Accra")}
          </p>
          <input name="name" required maxLength={120} placeholder={t.name} className="w-full rounded-xl bg-black/[0.05] px-3 py-2.5 text-[14px] outline-none" />
          <input name="contact" required maxLength={160} placeholder={t.contact} className="w-full rounded-xl bg-black/[0.05] px-3 py-2.5 text-[14px] outline-none" />
          <textarea name="topic" rows={2} maxLength={600} placeholder={t.topic} className="w-full resize-none rounded-xl bg-black/[0.05] px-3 py-2.5 text-[14px] outline-none" />
          <button type="submit" disabled={state === "sending"} className="w-full rounded-full bg-[#ff3b30] py-3 text-[15px] font-semibold text-white disabled:opacity-60">
            {state === "sending" ? t.sending : t.request}
          </button>
          {state === "error" && <p className="text-[12.5px] text-[#c0392b]">{t.error}</p>}
        </form>
      ) : (
        <div className="px-4 pb-6">
          <p className="mb-2 mt-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-black/45">{t.pick}</p>
          {!blocks.length && <p className="rounded-xl bg-white p-4 text-[14px] text-black/60">{t.weekend}</p>}
          {blocks.length > 0 && !blocks.some((b) => b.kind === "slot") && <p className="mb-2 rounded-xl bg-white p-4 text-[14px] text-black/60">{t.none}</p>}
          <div className="grid grid-cols-3 gap-2">
            {blocks.map((b) =>
              b.kind === "slot" ? (
                <button key={b.start} onClick={() => setPick(b)} className="rounded-xl bg-white py-2.5 text-[14px] font-medium tabular-nums text-[#ff3b30] shadow-sm">
                  {fmtTime(b.start)}
                </button>
              ) : (
                <div key={b.start} className="col-span-3 rounded-xl border-l-4 border-[#5856d6] bg-[#5856d6]/10 px-3 py-2 text-[13px]">
                  <span className="font-semibold">{b.kind === "deep" ? t.deep : t.ship}</span>
                  <span className="ml-2 tabular-nums text-black/55">{t.range(fmtTime(b.start), fmtTime(b.end))}</span>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
