"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Loader2, Plane, Printer } from "lucide-react";
import { visitSession } from "@/components/site/Tracker";
import { useTranslations } from "next-intl";
import Gantt from "./Gantt";
import Clock24 from "./Clock24";
import Ticket, { type TicketData } from "./Ticket";
import Schematic from "@/components/map/Schematic";
import { PLACES } from "@/components/map/places";
import { emit, sessionSummary } from "@/components/fieldkit/events";
import {
  MY_HOURS,
  ROLES,
  SERVICES,
  STACK,
  STARTS,
  TRACK_TONE,
  encodeBrief,
  fmtW,
  overlapHours,
  plan,
  type Brief,
} from "@/lib/brief";

const WHATSAPP = "233559602056";

// city codes for the boarding pass, where the first three letters would mislead
const CODES: Record<string, string> = {
  "New York": "NYC", "Los Angeles": "LAX", "San Francisco": "SFO", Chicago: "CHI", Toronto: "YTO",
  Lagos: "LOS", Johannesburg: "JNB", Nairobi: "NBO", Dubai: "DXB", Kigali: "KGL", Dakar: "DKR", Abidjan: "ABJ",
  Tokyo: "TYO", Singapore: "SIN", "Sao Paulo": "SAO", "Mexico City": "MEX",
};

function useVisitorZone() {
  const raw = useSyncExternalStore(
    () => () => {},
    () => `${Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC"}|${-new Date().getTimezoneOffset() / 60}`,
    () => "Africa/Accra|0",
  );
  const [zone, off] = raw.split("|");
  const city = (zone.split("/").pop() ?? zone).replace(/_/g, " ");
  return { zone, offset: Number(off), city, code: CODES[city] ?? city.slice(0, 3).toUpperCase() };
}

function Thumb({ thumb }: { thumb: string }) {
  if (thumb === "map")
    return (
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <Schematic places={PLACES} selected="alboyut" interactive={false} />
      </div>
    );
  return <Image src={thumb} alt="" fill sizes="240px" className="object-cover object-top" />;
}

type Step = "compose" | "printed" | "sending" | "sent" | "fallback";

export default function BuildDesk() {
  const t = useTranslations("home.build");
  const zone = useVisitorZone();
  const [mode, setMode] = useState<"build" | "hire">("build");
  const [ids, setIds] = useState<string[]>(["pos", "inventory"]);
  const [role, setRole] = useState(0);
  const [start, setStart] = useState(1);
  const [stack, setStack] = useState<number[]>([0, 3]);
  const [step, setStep] = useState<Step>("compose");
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [printId, setPrintId] = useState(0);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [invalid, setInvalid] = useState(false);

  const p = useMemo(() => plan(ids), [ids]);
  const ov = overlapHours(zone.offset);
  // overlap window in each place's local hours
  const ovStartGmt = Math.max(MY_HOURS[0], ov.start);
  const ovEndGmt = Math.min(MY_HOURS[1], ov.end);
  const overlapGmt: [number, number] | null = ov.hours ? [ovStartGmt, ovEndGmt] : null;

  const brief: Brief = mode === "build" ? { kind: "build", ids } : { kind: "hire", role, start, stack };

  const toggle = (id: string) => {
    const on = !ids.includes(id);
    setIds((x) => (on ? [...x, id] : x.filter((y) => y !== id)));
    const s = SERVICES.find((x) => x.id === id)!;
    emit("build", on ? "item.added" : "item.removed", `${s.label}, ${fmtW(s.weeks)}`);
    setStep("compose");
  };

  const print = () => {
    const url = `${window.location.origin}/brief/${encodeBrief(brief)}`;
    const did = sessionSummary();
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const data: TicketData =
      mode === "build"
        ? {
            head: "Project brief",
            sub: date,
            lines: [{ l: "Discovery", r: fmtW(1) }, ...p.chosen.map((s) => ({ l: s.label, r: fmtW(s.weeks) }))],
            total: { l: "Estimate", r: `~${fmtW(p.weeks)}` },
            note: `Tracks run in parallel; one after another it would be ~${fmtW(p.serial)}.${did.length ? ` On the site you ${did.join(", ")}.` : ""}`,
            url,
          }
        : {
            head: "Hire brief",
            sub: date,
            lines: [
              { l: "Role", r: ROLES[role] },
              { l: "Start", r: STARTS[start] },
              { l: "Your time", r: `${zone.city} (GMT${zone.offset >= 0 ? "+" : ""}${zone.offset})` },
              ...stack.map((i) => ({ l: "Stack", r: STACK[i] })),
            ],
            total: { l: "Overlap", r: `${ov.hours} h a day` },
            note: did.length ? `On the site you ${did.join(", ")}.` : undefined,
            url,
          };
    setTicket(data);
    setPrintId((n) => n + 1);
    setStep("printed");
    emit("build", "ticket.printed", mode === "build" ? `${p.chosen.length} items, ~${fmtW(p.weeks)}` : `${ROLES[role]}, ${STARTS[start]}`);
  };

  const text = () =>
    ticket
      ? [ticket.head.toUpperCase(), ...ticket.lines.map((l) => `${l.l}: ${l.r}`), `${ticket.total.l}: ${ticket.total.r}`, ticket.note ?? "", `Brief: ${ticket.url}`]
          .filter(Boolean)
          .join("\n")
      : "";
  const whatsapp = () =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Aadam, from aadambuilds.dev.\nName: ${name}\nContact: ${contact}\n\n${text()}`)}`;

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
          kind: mode,
          budget: mode === "build" ? `Build brief ~${fmtW(p.weeks)}` : `Hire: ${ROLES[role]}`,
          message: text(),
          brief: ticket?.url,
          sid: visitSession(),
        }),
      });
      if (res.ok) {
        setStep("sent");
        emit("build", "ticket.sent", mode);
        return;
      }
    } catch {
      // network failure: WhatsApp instead
    }
    setStep("fallback");
    window.open(whatsapp(), "_blank", "noopener,noreferrer");
  };

  const canPrint = mode === "hire" || p.chosen.length > 0;

  const output = (
    <div className="mt-5">
      {step === "compose" ? (
        <button
          type="button"
          onClick={print}
          disabled={!canPrint}
          className="btn btn-primary w-full"
        >
          <Printer className="w-4 h-4" /> {t("print")}
        </button>
      ) : (
        <div>
          {/* printer slot */}
          <div className="h-2.5 rounded-full bg-black mx-2 shadow-[inset_0_2px_3px_rgba(0,0,0,0.9)]" />
          {ticket && <Ticket data={ticket} id={printId} />}
          <div className="mt-4">
            {(step === "printed" || step === "sending") && (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("name")} aria-label={t("name")} autoComplete="name" className="field" />
                  <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t("contact")} aria-label={t("contact")} autoComplete="email" className="field" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[12.5px] ${invalid ? "text-[var(--accent)]" : "text-[var(--ink-3)]"}`}>{invalid ? t("invalid") : t("sendHint")}</span>
                  <button type="submit" disabled={step === "sending"} className="btn btn-primary shrink-0">
                    {step === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                    {t("send")}
                  </button>
                </div>
              </form>
            )}
            {(step === "sent" || step === "fallback") && (
              <div role="status" className="card px-4 py-3 text-[13.5px] flex-row items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--success)]" />
                  {step === "sent" ? t("sent") : t("fallback")}
                </span>
                {step === "fallback" ? (
                  <a href={whatsapp()} target="_blank" rel="noreferrer" className="shrink-0 text-[#25d366]">
                    WhatsApp
                  </a>
                ) : (
                  <button type="button" onClick={() => setStep("compose")} className="shrink-0 text-[var(--ink-2)] hover:text-[var(--foreground)]">
                    {t("again")}
                  </button>
                )}
              </div>
            )}
            {step !== "sent" && (
              <button type="button" onClick={() => setStep("compose")} className="mt-3 text-[12.5px] text-[var(--ink-3)] hover:text-[var(--foreground)]">
                {t("edit")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section id="build" aria-labelledby="build-heading" className="theme-fixed relative px-4 md:px-6 py-24 md:py-32 bg-[var(--background)] text-[var(--foreground)] scroll-mt-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-end">
          <h2 id="build-heading" className="md:col-span-7 font-display text-balance" style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.25rem)", lineHeight: 0.98, letterSpacing: "-0.03em" }}>
            {t("title")}
          </h2>
          <p className="md:col-span-5 text-[15px] md:text-[16px] leading-[1.65] text-[var(--ink-2)] text-pretty">{t("sub")}</p>
        </div>

        <div className="mt-10 seg" role="tablist" aria-label={t("switch")}>
          {(["build", "hire"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setStep("compose");
              }}
              className="seg-item"
            >
              {t(m)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {mode === "build" ? (
            <motion.div key="build" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <ul className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3" aria-label={t("catalogue")}>
                {SERVICES.map((s) => {
                  const on = ids.includes(s.id);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(s.id)}
                        className={`card card-link w-full h-full ${on ? "card-on" : ""}`}
                      >
                        <span className="card-check" aria-hidden="true">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <div className="card-media">
                          <Thumb thumb={s.thumb} />
                        </div>
                        <div className="px-3.5 py-3">
                          <p className="text-[14px] font-medium leading-tight">{s.label}</p>
                          <p className="mt-1.5 card-meta">
                            <span className="card-dot" style={{ background: TRACK_TONE[s.track] }} />
                            {fmtW(s.weeks)}, {s.track}
                          </p>
                          <p className="mt-0.5 card-meta block truncate">Built for {s.proof}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="lg:col-span-5">
                <div className="card lg:sticky lg:top-24 p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="stat-label">{t("board")}</p>
                    <p className="stat-value !mt-0">{p.chosen.length ? `~${fmtW(p.weeks)}` : "-"}</p>
                  </div>
                  <p className="mt-1 card-meta">{p.chosen.length ? t("parallel", { serial: fmtW(p.serial) }) : t("pick")}</p>
                  <div className="mt-4">
                    <Gantt lanes={p.lanes} weeks={p.weeks} />
                  </div>
                  {output}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="hire" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mt-6">
              {/* boarding pass */}
              <div className="card grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="theme-paper p-5 md:p-7">
                  <div className="flex items-center justify-between gap-4 label">
                    <span>{t("pass")}</span>
                    <span>Remote</span>
                  </div>
                  <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div>
                      <p className="font-display text-[44px] md:text-[56px] leading-none">ACC</p>
                      <p className="card-meta">Accra, GMT+0</p>
                    </div>
                    <Plane className="w-6 h-6 text-[var(--accent)]" />
                    <div className="text-right">
                      <p className="font-display text-[44px] md:text-[56px] leading-none">{zone.code}</p>
                      <p className="card-meta">
                        {zone.city}, GMT{zone.offset >= 0 ? "+" : ""}
                        {zone.offset}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-around gap-6 rounded-[var(--radius-field)] bg-[var(--tint)] border border-[var(--line)] py-4">
                    <Clock24 offset={0} work={MY_HOURS} overlap={overlapGmt} tone="#ff5b1f" label="Aadam, Accra" />
                    <div className="text-center">
                      <p className="font-display text-[40px] leading-none tabular-nums">{ov.hours}h</p>
                      <p className="card-meta">{t("overlap")}</p>
                    </div>
                    <Clock24
                      offset={zone.offset}
                      work={[9, 17]}
                      overlap={overlapGmt ? [overlapGmt[0] + zone.offset, overlapGmt[1] + zone.offset] : null}
                      tone="#2f7fb5"
                      label={t("you", { city: zone.city })}
                    />
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <fieldset>
                      <legend className="label">{t("role")}</legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {ROLES.map((r, i) => (
                          <button key={r} type="button" aria-pressed={role === i} onClick={() => { setRole(i); setStep("compose"); }} className="pill">
                            {r}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend className="label">{t("departs")}</legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {STARTS.map((s, i) => (
                          <button key={s} type="button" aria-pressed={start === i} onClick={() => { setStart(i); setStep("compose"); }} className="pill">
                            {s}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                  <fieldset className="mt-5">
                    <legend className="label">{t("stack")}</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {STACK.map((s, i) => {
                        const on = stack.includes(i);
                        return (
                          <button
                            key={s}
                            type="button"
                            aria-pressed={on}
                            onClick={() => {
                              setStack((x) => (on ? x.filter((y) => y !== i) : [...x, i].sort()));
                              setStep("compose");
                            }}
                            className="pill"
                          >
                            {on && <Check className="w-3.5 h-3.5" />}
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>
                {/* stub */}
                <div className="relative p-5 md:p-6 border-t lg:border-t-0 lg:border-l border-dashed border-[var(--line-strong)]">
                  <p className="label">{t("stub")}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-y-3 text-[13px]">
                    <dt className="text-[var(--ink-3)]">{t("role")}</dt>
                    <dd className="text-right">{ROLES[role]}</dd>
                    <dt className="text-[var(--ink-3)]">{t("departs")}</dt>
                    <dd className="text-right">{STARTS[start]}</dd>
                    <dt className="text-[var(--ink-3)]">{t("overlapLabel")}</dt>
                    <dd className="text-right tabular-nums">{ov.hours} h a day</dd>
                  </dl>
                  {output}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
