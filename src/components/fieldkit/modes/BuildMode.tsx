"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { emit, sessionSummary } from "../events";
import { usePrinter } from "../Receipt";
import { EASE_OUT } from "@/lib/motion";

const WHATSAPP = "233559602056";

type Track = "Brand" | "Web" | "Ops" | "Data";
const TRACKS: Track[] = ["Brand", "Web", "Ops", "Data"];
const TRACK_TONE: Record<Track, string> = { Brand: "#e07a9a", Web: "#5fa8d3", Ops: "#ff5b1f", Data: "#a78bfa" };

const ITEMS: { id: string; label: string; weeks: number; track: Track }[] = [
  { id: "storefront", label: "Storefront", weeks: 3, track: "Web" },
  { id: "pos", label: "POS register", weeks: 3, track: "Ops" },
  { id: "inventory", label: "Inventory & stock-takes", weeks: 2, track: "Ops" },
  { id: "backoffice", label: "Back office", weeks: 3, track: "Data" },
  { id: "whatsapp", label: "WhatsApp ordering", weeks: 1, track: "Web" },
  { id: "payments", label: "Payments", weeks: 1.5, track: "Web" },
  { id: "odoo", label: "Odoo ERP setup", weeks: 4, track: "Ops" },
  { id: "data", label: "Data model & reporting", weeks: 2, track: "Data" },
  { id: "brand", label: "Brand identity", weeks: 2, track: "Brand" },
  { id: "i18n", label: "i18n EN/FR/AR", weeks: 1, track: "Web" },
  { id: "ai", label: "AI assistant", weeks: 2, track: "Data" },
];
const DISCOVERY = 1; // week one: embed and map the workflow

const ROLES = ["Full-time FDE", "Contract", "Embedded per project"] as const;
const STARTS = ["Now", "In 2 to 4 weeks", "Next quarter"] as const;
const STACK = ["TypeScript · Next.js", "Postgres · Drizzle", "Python", "Odoo", "SQL · analytics", "Finance models"] as const;

// My working window in GMT (Accra), wide enough to overlap EU and US East.
const MY_START = 8;
const MY_END = 20;

const fmtW = (w: number) => `${Number.isInteger(w) ? w : w.toFixed(1)} wk${w === 1 ? "" : "s"}`;

function useTz() {
  return useSyncExternalStore(
    () => () => {},
    () => {
      const off = -new Date().getTimezoneOffset() / 60;
      return `${Intl.DateTimeFormat().resolvedOptions().timeZone ?? "local"}|${off}`;
    },
    () => "UTC|0",
  );
}

function SlideSwitch({ value, onChange }: { value: "hire" | "build"; onChange: (v: "hire" | "build") => void }) {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value === "build"}
      aria-label="Hire or build"
      onClick={() => onChange(value === "hire" ? "build" : "hire")}
      className="relative flex items-center h-8 w-[150px] rounded-[9px] p-[3px] font-mono text-[10px] tracking-[0.18em]"
      style={{ background: "#050504", boxShadow: "inset 0 2px 5px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.08)" }}
    >
      <motion.span
        className="absolute top-[3px] bottom-[3px] w-[72px] rounded-[7px]"
        style={{
          background: "linear-gradient(180deg, #4a4640, #2c2a26)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
        initial={false}
        animate={{ x: value === "build" ? 72 : 0 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 34 }}
      />
      <span className={`relative z-10 flex-1 text-center ${value === "hire" ? "text-[#F2EEE6]" : "text-white/35"}`}>HIRE</span>
      <span className={`relative z-10 flex-1 text-center ${value === "build" ? "text-[var(--accent)]" : "text-white/35"}`}>BUILD</span>
    </button>
  );
}

export default function BuildMode() {
  const reduce = useReducedMotion();
  const print = usePrinter();
  const tz = useTz();
  const [mode, setMode] = useState<"hire" | "build">("build");
  const [picked, setPicked] = useState<string[]>(["pos", "inventory"]);
  const [role, setRole] = useState<(typeof ROLES)[number]>("Full-time FDE");
  const [start, setStart] = useState<(typeof STARTS)[number]>("In 2 to 4 weeks");
  const [stack, setStack] = useState<string[]>(["TypeScript · Next.js", "Odoo"]);
  const [step, setStep] = useState<"compose" | "send" | "sending" | "sent" | "fallback">("compose");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [ticketText, setTicketText] = useState("");

  // Build plan: tracks in parallel, items in sequence within a track.
  const chosen = ITEMS.filter((i) => picked.includes(i.id));
  const lanes = TRACKS.map((t) => {
    let at = DISCOVERY;
    const segs = chosen
      .filter((i) => i.track === t)
      .map((i) => {
        const s = { ...i, from: at };
        at += i.weeks;
        return s;
      });
    return { track: t, segs, end: at };
  });
  const totalWeeks = chosen.length ? Math.max(...lanes.map((l) => l.end)) : 0;
  const serialWeeks = DISCOVERY + chosen.reduce((a, i) => a + i.weeks, 0);
  const span = Math.max(totalWeeks, 8);

  // Timezone overlap (hours in UTC)
  const [tzName, offStr] = tz.split("|");
  const off = Number(offStr);
  const theirStart = (((9 - off) % 24) + 24) % 24;
  const theirEnd = theirStart + 8;
  const overlap = Math.max(0, Math.min(MY_END, theirEnd) - Math.max(MY_START, theirStart)) + Math.max(0, Math.min(MY_END, theirEnd - 24) - Math.max(MY_START, theirStart - 24));

  const toggle = (id: string) => {
    const on = !picked.includes(id);
    setPicked((p) => (on ? [...p, id] : p.filter((x) => x !== id)));
    const it = ITEMS.find((i) => i.id === id)!;
    emit("build", on ? "item.added" : "item.removed", `${it.label} · ${fmtW(it.weeks)} · ${it.track}`);
    setStep("compose");
  };

  const compose = () => {
    const did = sessionSummary();
    const lines =
      mode === "build"
        ? chosen.map((i) => ({ l: i.label, r: fmtW(i.weeks) }))
        : [
            { l: "Role", r: role },
            { l: "Start", r: start },
            { l: "Overlap", r: `${overlap} h/day` },
            ...stack.map((s) => ({ l: "Stack", r: s })),
          ];
    const total =
      mode === "build" ? { l: "Estimate", r: `~${fmtW(totalWeeks)}` } : { l: "Timezone", r: `${tzName} (GMT${off >= 0 ? "+" : ""}${off})` };
    const foot = [did.length ? `On the kit you ${did.join(", ")}.` : "You went straight to the build desk.", "Aadam · forward deployed engineer"];
    print({
      head: mode === "build" ? "Build ticket" : "Hire ticket",
      sub: `${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · FDE-08`,
      lines: mode === "build" ? [{ l: "Embed & map", r: fmtW(DISCOVERY) }, ...lines] : lines,
      total,
      foot,
    });
    const text = [
      mode === "build" ? "BUILD TICKET" : "HIRE TICKET",
      ...(mode === "build" ? [`Embed & map: ${fmtW(DISCOVERY)}`] : []),
      ...lines.map((l) => `${l.l}: ${l.r}`),
      `${total.l}: ${total.r}`,
      mode === "build" ? `Tracks in parallel (sequential would be ~${fmtW(serialWeeks)})` : "",
      "",
      foot[0],
    ]
      .filter((x) => x !== "")
      .join("\n");
    setTicketText(text);
    emit("build", "ticket.printed", mode === "build" ? `${chosen.length} items · ~${fmtW(totalWeeks)}` : `${role} · ${start}`);
    setStep("send");
  };

  const whatsappUrl = () =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Aadam, from the Field Kit.\nName: ${name}\nContact: ${contact}\n\n${ticketText}`)}`;

  const send = async () => {
    if (!name.trim() || !contact.trim()) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setStep("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          budget: mode === "build" ? `Build ticket ~${fmtW(totalWeeks)}` : `Hire: ${role}`,
          message: ticketText,
        }),
      });
      if (res.ok) {
        setStep("sent");
        emit("build", "ticket.sent", `to Aadam · ${mode}`);
        return;
      }
    } catch {
      // network failure: WhatsApp instead
    }
    setStep("fallback");
    emit("build", "ticket.fallback", "opening WhatsApp");
    window.open(whatsappUrl(), "_blank", "noopener,noreferrer");
  };

  const chip = (on: boolean) =>
    `rounded-[7px] border text-[10.5px] leading-tight transition-colors ${
      on ? "border-[var(--accent)] bg-[var(--accent)]/12 text-[#F2EEE6]" : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
    }`;

  return (
    <div className="flex flex-col h-full gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <SlideSwitch
          value={mode}
          onChange={(v) => {
            setMode(v);
            setStep("compose");
            emit("build", "switch", v.toUpperCase());
          }}
        />
        <span className="font-mono text-[9px] text-white/35 text-right leading-tight">
          {mode === "build" ? "Weeks, not prices" : "Remote · GMT+0"}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {mode === "build" ? (
          <motion.div
            key="build"
            className="flex flex-col gap-2.5 flex-1 min-h-0"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <div className="grid grid-cols-2 @[440px]:grid-cols-4 gap-1.5" role="group" aria-label="Build catalogue">
              {ITEMS.map((i) => {
                const on = picked.includes(i.id);
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => toggle(i.id)}
                    aria-pressed={on}
                    className={`${chip(on)} text-left px-2 py-1.5`}
                  >
                    <span className="block truncate">{i.label}</span>
                    <span className="flex justify-between font-mono text-[8.5px] text-white/40 mt-0.5">
                      <span style={{ color: on ? TRACK_TONE[i.track] : undefined }}>{i.track}</span>
                      <span>{fmtW(i.weeks)}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-[8px] bg-[#13120F] border border-white/[0.06] px-2.5 py-2" aria-label="Timeline">
              <div className="flex justify-between font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/40">
                <span>Timeline · tracks run in parallel</span>
                <span>sequential ~{fmtW(serialWeeks)}</span>
              </div>
              <div className="mt-1.5 space-y-[3px]">
                {lanes.map((l) => (
                  <div key={l.track} className="grid grid-cols-[38px_1fr] items-center gap-2">
                    <span className="font-mono text-[8.5px] text-white/40">{l.track}</span>
                    <div className="relative h-[9px] rounded-[2px] bg-white/[0.04]">
                      <span className="absolute left-0 top-0 bottom-0 bg-white/15 rounded-l-[2px]" style={{ width: `${(DISCOVERY / span) * 100}%` }} />
                      {l.segs.map((s) => (
                        <motion.span
                          key={s.id}
                          className="absolute top-0 bottom-0 rounded-[2px] border-r border-[#13120F]"
                          style={{ background: TRACK_TONE[l.track] }}
                          initial={reduce ? false : { opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1, left: `${(s.from / span) * 100}%`, width: `${(s.weeks / span) * 100}%` }}
                          transition={{ duration: 0.4, ease: EASE_OUT }}
                          title={`${s.label} · ${fmtW(s.weeks)}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="hire"
            className="flex flex-col gap-2 flex-1 min-h-0"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Role">
              {ROLES.map((r) => (
                <button key={r} type="button" onClick={() => setRole(r)} aria-pressed={role === r} className={`${chip(role === r)} h-9 px-2`}>
                  {r}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Start window">
              {STARTS.map((s) => (
                <button key={s} type="button" onClick={() => setStart(s)} aria-pressed={start === s} className={`${chip(start === s)} h-7 px-2 font-mono !text-[9.5px]`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="rounded-[8px] bg-[#13120F] border border-white/[0.06] px-2.5 py-2">
              <div className="flex justify-between font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/40">
                <span>Working hours, GMT</span>
                <span className={overlap >= 4 ? "text-[#86efac]" : "text-[var(--accent)]"}>{overlap} h overlap</span>
              </div>
              {[
                { l: "Aadam", a: MY_START, b: MY_END, c: "var(--accent)" },
                { l: "You", a: theirStart, b: theirEnd, c: "#5fa8d3" },
              ].map((r) => (
                <div key={r.l} className="mt-1.5 grid grid-cols-[38px_1fr] items-center gap-2">
                  <span className="font-mono text-[8.5px] text-white/45">{r.l}</span>
                  <div className="relative h-[9px] rounded-[2px] bg-white/[0.04] overflow-hidden">
                    <span className="absolute top-0 bottom-0 rounded-[2px]" style={{ left: `${(r.a / 24) * 100}%`, width: `${((Math.min(r.b, 24) - r.a) / 24) * 100}%`, background: r.c }} />
                    {r.b > 24 && <span className="absolute top-0 bottom-0 left-0 rounded-[2px]" style={{ width: `${((r.b - 24) / 24) * 100}%`, background: r.c }} />}
                  </div>
                </div>
              ))}
              <div className="mt-1 grid grid-cols-[38px_1fr] gap-2 font-mono text-[8px] text-white/30">
                <span />
                <span className="flex justify-between">
                  <span>00</span>
                  <span>06</span>
                  <span>12</span>
                  <span>18</span>
                  <span>24</span>
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1" role="group" aria-label="Stack focus">
              {STACK.map((s) => {
                const on = stack.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStack((p) => (on ? p.filter((x) => x !== s) : [...p, s]))}
                    aria-pressed={on}
                    className={`${chip(on)} h-6 px-2 font-mono !text-[9px]`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer: estimate, print, send */}
      <div className="mt-auto">
        {step === "compose" && (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/40">
                {mode === "build" ? "Estimate" : "Overlap with you"}
              </div>
              <div className="font-mono text-[18px] text-[#F2EEE6] leading-tight">
                {mode === "build" ? (chosen.length ? `~${fmtW(totalWeeks)}` : "pick a key") : `${overlap} h / day`}
              </div>
            </div>
            <button
              type="button"
              onClick={compose}
              disabled={mode === "build" && !chosen.length}
              className="h-9 px-4 rounded-[8px] bg-[var(--accent)] text-[var(--on-accent)] text-[12px] font-semibold disabled:bg-white/[0.07] disabled:text-white/30"
            >
              Print ticket
            </button>
          </div>
        )}
        {(step === "send" || step === "sending") && (
          <form
            className="flex flex-col gap-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            noValidate
          >
            <div className="grid grid-cols-2 gap-1.5">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                aria-label="Your name"
                autoComplete="name"
                className="h-8 rounded-[7px] bg-white/[0.05] border border-white/10 px-2.5 text-[11.5px] text-white placeholder:text-white/30 focus:border-[var(--accent)] outline-none"
              />
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email or WhatsApp"
                aria-label="Email or WhatsApp"
                autoComplete="email"
                className="h-8 rounded-[7px] bg-white/[0.05] border border-white/10 px-2.5 text-[11.5px] text-white placeholder:text-white/30 focus:border-[var(--accent)] outline-none"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] ${invalid ? "text-[var(--accent)]" : "text-white/40"}`}>
                {invalid ? "Add your name and a way to reach you." : "Ticket printed. Send it to me?"}
              </span>
              <button
                type="submit"
                disabled={step === "sending"}
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[8px] bg-[var(--accent)] text-[var(--on-accent)] text-[12px] font-semibold disabled:opacity-60"
              >
                {step === "sending" ? (
                  <>
                    Sending <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </>
                ) : (
                  <>
                    Send ticket <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
        {(step === "sent" || step === "fallback") && (
          <div role="status" className="flex items-center justify-between gap-2 rounded-[8px] border border-white/10 px-2.5 py-2">
            <span className="text-[11px] text-white/80">
              {step === "sent" ? "Sent. I reply within one business day." : "Couldn't send from here, so WhatsApp opened with your ticket."}
            </span>
            {step === "fallback" ? (
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.1em] text-[#25d366]">
                Open again ↗
              </a>
            ) : (
              <button type="button" onClick={() => setStep("compose")} className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.1em] text-white/50 hover:text-white">
                New ticket
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
