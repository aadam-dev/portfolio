"use client";

import { useState } from "react";
import Link from "next/link";
import { decode } from "@/lib/vin";
import { BODIES, DESTINATIONS, SAMPLE_VINS, freightFor, totalDays, usd, type Body, type Shipping } from "@/lib/rockmotion";
import { emit } from "@/components/fieldkit/events";

const BLUE = "#2563EB";
const mono = "font-mono uppercase tracking-[0.18em]";

/**
 * Rockmotion's shipping calculator and VIN check, at the site's 640 x 400
 * design size, in Rockmotion's own dark blue style.
 */
export default function Rockmotion() {
  const [tab, setTab] = useState<"ship" | "vin">("ship");
  const [body, setBody] = useState<Body>("sedan");
  const [destId, setDestId] = useState("tema");
  const [method, setMethod] = useState<Shipping>("roro");
  const [done, setDone] = useState(false);
  const [vin, setVin] = useState(SAMPLE_VINS[2].vin);
  const dest = DESTINATIONS.find((d) => d.id === destId)!;
  const [lo, hi] = totalDays(dest);
  const d = decode(vin);

  const sel = "h-9 w-full rounded-md bg-[#0f1117] border border-white/10 px-2.5 text-[12.5px] text-white outline-none focus:border-[#2563EB]";

  return (
    <div className="w-[640px] h-[400px] bg-[#07080b] text-white flex flex-col" style={{ fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif" }}>
      <header className="flex items-center justify-between px-5 h-12 border-b border-white/[0.06]">
        <span className="flex items-center gap-2 text-[13px] font-bold tracking-wide">
          <span className="grid place-items-center w-6 h-6 rounded-[5px] text-[10px]" style={{ background: BLUE }}>
            RM
          </span>
          ROCKMOTION
        </span>
        <nav className="flex gap-1 text-[11px] font-medium">
          {(["ship", "vin"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`px-3 h-7 rounded-md ${tab === t ? "bg-white/10 text-white" : "text-white/55 hover:text-white"}`}>
              {t === "ship" ? "GLOBAL SHIPPING" : "VIN CHECK"}
            </button>
          ))}
        </nav>
      </header>

      {tab === "ship" ? (
        <div className="flex-1 px-6 pt-5">
          <p className={`${mono} text-[9.5px]`} style={{ color: BLUE }}>
            Instant estimate
          </p>
          <p className="mt-1 text-[22px] font-bold leading-tight">Global Shipping Calculator</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <label className="block">
              <span className={`${mono} text-[8.5px] text-white/45`}>Vehicle type</span>
              <select className={`${sel} mt-1`} value={body} onChange={(e) => { setBody(e.target.value as Body); setDone(false); }}>
                {BODIES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={`${mono} text-[8.5px] text-white/45`}>Destination</span>
              <select className={`${sel} mt-1`} value={destId} onChange={(e) => { setDestId(e.target.value); setDone(false); }}>
                {DESTINATIONS.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.port}, {x.country}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={`${mono} text-[8.5px] text-white/45`}>Method</span>
              <select className={`${sel} mt-1`} value={method} onChange={(e) => { setMethod(e.target.value as Shipping); setDone(false); }}>
                <option value="roro">RoRo</option>
                <option value="container">Container</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              setDone(true);
              emit("kit", "rockmotion.route", dest.id);
            }}
            className={`mt-4 w-full h-10 rounded-md text-[11.5px] font-semibold ${mono} !tracking-[0.12em]`}
            style={{ background: BLUE }}
          >
            Calculate transit time
          </button>
          {done && (
            <div className="mt-4 grid grid-cols-3 rounded-lg border border-white/[0.08] divide-x divide-white/[0.08] text-center">
              {[
                [`${lo} to ${hi}`, "days, lot to release"],
                [`${dest.sea[0]} to ${dest.sea[1]}`, "days at sea"],
                [usd(freightFor(dest, method, body)), "example freight"],
              ].map(([v, l]) => (
                <div key={l} className="py-3">
                  <p className="font-mono text-[17px] font-semibold">{v}</p>
                  <p className={`${mono} mt-0.5 text-[8px] text-white/45`}>{l}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 px-6 pt-5">
          <p className={`${mono} text-[9.5px]`} style={{ color: BLUE }}>
            Before you pay
          </p>
          <p className="mt-1 text-[22px] font-bold leading-tight">Check the VIN</p>
          <input
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase().slice(0, 20))}
            onBlur={() => d.ok && emit("kit", "rockmotion.vin", d.vin.slice(0, 3))}
            spellCheck={false}
            className="mt-4 h-10 w-full rounded-md bg-[#0f1117] border border-white/10 px-3 font-mono tracking-[0.18em] text-[14px] outline-none focus:border-[#2563EB]"
            aria-label="VIN"
          />
          {d.ok ? (
            <dl className="mt-3 grid grid-cols-4 gap-2">
              {[
                ["Maker", d.maker],
                ["Built in", d.country],
                ["Year", String(d.year ?? "?")],
                ["Check digit", d.valid ? `${d.found}, valid` : `should be ${d.expected}`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-md bg-white/[0.04] px-2.5 py-2 min-w-0">
                  <dt className={`${mono} text-[8px] text-white/45`}>{k}</dt>
                  <dd className={`mt-1 text-[12px] leading-tight ${k === "Check digit" && !d.valid ? "text-amber-400" : ""}`}>{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-3 text-[12px] text-amber-400">{d.error}</p>
          )}
          <p className="mt-3 text-[11px] text-white/45">Next, a history report: title brands, auctions, accidents, odometer.</p>
        </div>
      )}
      <Link href="/lab/car" className="mx-6 mb-4 text-[11px] text-white/55 hover:text-white">
        Walk round the car, ship it and cost it in the Lab →
      </Link>
    </div>
  );
}
