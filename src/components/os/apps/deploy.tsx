"use client";

import { useState } from "react";
import ModeScreen from "@/components/fieldkit/ModeScreen";
import { Fit } from "@/components/replicas";
import type { ModeId } from "@/components/fieldkit/chapters";

export const DEPLOYS: { mode: ModeId; label: string; sub: string }[] = [
  { mode: "counter", label: "Al Boyut register", sub: "Point of sale" },
  { mode: "laundry", label: "An-Nur counter", sub: "Laundry workflow" },
  { mode: "atelier", label: "Fashion storefront", sub: "Two markets" },
  { mode: "analyst", label: "Deal screen", sub: "Finance models" },
  { mode: "ledger", label: "Delish on Odoo", sub: "Inventory" },
  { mode: "court", label: "Madina court", sub: "Live scorer" },
  { mode: "classroom", label: "Kōyi hub", sub: "Exam pathways" },
];

/** The playable systems from the Deployments section, one at a time. */
export default function DeployApp({ flat }: { flat: boolean }) {
  const [m, setM] = useState<ModeId>("counter");
  return (
    <div className="flex h-full">
      <nav aria-label="Systems" className="w-[180px] shrink-0 space-y-1 border-r border-white/10 p-2">
        {DEPLOYS.map((d) => (
          <button key={d.mode} onClick={() => setM(d.mode)} tabIndex={flat ? 0 : -1} aria-current={m === d.mode} className={`block w-full rounded-md px-2.5 py-1.5 text-left ${m === d.mode ? "bg-white/15" : "hover:bg-white/[0.06]"}`}>
            <span className="block text-[12.5px] text-white">{d.label}</span>
            <span className="block text-[11px] text-white/50">{d.sub}</span>
          </button>
        ))}
      </nav>
      <div className="relative min-w-0 flex-1 bg-black">
        {flat ? (
          <Fit w={640} h={400}>
            <ModeScreen mode={m} />
          </Fit>
        ) : (
          <p className="p-6 text-white/60">These run once you are at the desk.</p>
        )}
      </div>
    </div>
  );
}
