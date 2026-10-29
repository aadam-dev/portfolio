"use client";

import { useState } from "react";
import Link from "next/link";
import { DESTINATIONS, VEHICLES, type Vehicle } from "@/lib/rockmotion";
import { emit } from "@/components/fieldkit/events";

const BLUE = "#2563EB";
const mono = "font-mono uppercase tracking-[0.18em]";

/**
 * Rockmotion's Global Shipping Calculator, as on rockmotion.vercel.app/shipping:
 * vehicle type and destination in, destination port and port-to-port transit
 * time out. At the site's 640 x 400 design size, in Rockmotion's style.
 */
export default function Rockmotion() {
  const [vehicle, setVehicle] = useState<Vehicle | "">("");
  const [destId, setDestId] = useState("");
  const [shown, setShown] = useState<{ dest: string; vehicle: Vehicle } | null>(null);
  const dest = DESTINATIONS.find((d) => d.id === shown?.dest);
  const ready = vehicle && destId;

  const sel = "h-10 w-full rounded-md bg-[#111113] border border-white/10 px-3 text-[12.5px] text-white outline-none focus:border-[#2563EB]";

  return (
    <div className="w-[640px] h-[400px] bg-[#0A0A0B] text-[#F1F5F9] flex flex-col" style={{ fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif" }}>
      <header className="flex items-center justify-between px-5 h-11 border-b border-white/[0.06] shrink-0">
        <span className="flex items-center gap-2 text-[13px] font-bold tracking-wide">
          <span className="grid place-items-center w-6 h-6 rounded-[5px] text-[10px]" style={{ background: BLUE }}>
            RM
          </span>
          ROCKMOTION
        </span>
        <nav className="flex gap-4 text-[10.5px] font-medium text-[#94A3B8]">
          <span>INVENTORY</span>
          <span className="text-white">GLOBAL SHIPPING</span>
          <span>PROCESS</span>
          <span>CONTACT</span>
        </nav>
      </header>

      <div className="flex-1 px-7 pt-5 text-center">
        <p className={`${mono} text-[9.5px]`} style={{ color: BLUE }}>
          Instant estimate
        </p>
        <p className="mt-1 text-[22px] font-bold leading-tight">Global Shipping Calculator</p>
        <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#111113] p-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={`${mono} text-[8.5px] text-[#64748B]`}>Vehicle type</span>
              <select className={`${sel} mt-1`} value={vehicle} onChange={(e) => setVehicle(e.target.value as Vehicle)}>
                <option value="">Select vehicle type...</option>
                {VEHICLES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={`${mono} text-[8.5px] text-[#64748B]`}>Destination country</span>
              <select className={`${sel} mt-1`} value={destId} onChange={(e) => setDestId(e.target.value)}>
                <option value="">Select destination...</option>
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.flag} {d.country}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            disabled={!ready}
            onClick={() => {
              if (!vehicle || !destId) return;
              setShown({ dest: destId, vehicle });
              emit("kit", "rockmotion.route", destId);
            }}
            className={`mt-3 w-full h-10 rounded-md text-[11px] font-semibold ${mono} !tracking-[0.12em] transition-opacity disabled:opacity-40`}
            style={{ background: BLUE }}
          >
            Calculate transit time
          </button>
          {dest && shown && (
            <div className="mt-3 grid grid-cols-3 rounded-lg border border-white/[0.08] divide-x divide-white/[0.08] text-center">
              {[
                [dest.port, "Destination port"],
                [`${dest.days[0]}–${dest.days[1]} Days`, "Transit time"],
                [VEHICLES.find((v) => v.id === shown.vehicle)?.label ?? "", "Vehicle type"],
              ].map(([v, l]) => (
                <div key={l} className="py-2.5 px-2 min-w-0">
                  <p className="font-mono text-[13px] font-semibold truncate">{v}</p>
                  <p className={`${mono} mt-0.5 text-[7.5px] text-[#64748B]`}>{l}</p>
                </div>
              ))}
            </div>
          )}
          <p className="mt-2.5 text-[9.5px] text-[#64748B]">
            * Transit time is port-to-port. Customs clearance and inland delivery may add additional time. Contact us for a full landed cost estimate.
          </p>
        </div>
      </div>
      <Link href="/lab/car" className="mx-7 mb-3 text-[11px] text-[#94A3B8] hover:text-white">
        Check a VIN, walk round the car and add up the landed cost in the Lab →
      </Link>
    </div>
  );
}
