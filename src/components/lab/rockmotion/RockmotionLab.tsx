"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Vin from "./Vin";
import Inspection from "./Inspection";
import Journey, { RouteMap } from "./Journey";
import LandedCost, { type CostFields } from "./LandedCost";
import type { View } from "./Stage";
import type { HingeId } from "./CarModel";
import { AREAS, DESTINATIONS, METHODS, SAMPLE_VINS, US_PORTS, VEHICLES, shippingFor, truckingFor, type AreaId, type Method, type Vehicle } from "@/lib/rockmotion";
import { clean } from "@/lib/vin";
import { emit, emitOnce } from "@/components/fieldkit/events";
import { detectTier } from "@/lib/tier";

const Stage = dynamic(() => import("./Stage"), { ssr: false });

type Step = "vin" | "inspect" | "ship" | "cost";
const STEPS: { id: Step; label: string; short: string; title: string }[] = [
  { id: "vin", label: "Check the VIN", short: "VIN", title: "Is it the car they say it is?" },
  { id: "inspect", label: "Walk round it", short: "Inspect", title: "Inspect it from 9,000 km away" },
  { id: "ship", label: "Ship it", short: "Ship", title: "From the lot to your port" },
  { id: "cost", label: "Landed cost", short: "Cost", title: "What it costs on arrival" },
];

const PAINTS = [
  { v: 0, label: "Carmine", hex: "#8f0a17" },
  { v: 1, label: "Pearl", hex: "#d8d6cf" },
  { v: 2, label: "Graphite", hex: "#3a3d42" },
];

const HINTS: Record<Step, string> = {
  vin: "The VIN tag on the dash, as the inspector photographs it",
  inspect: "Drag to walk round it. Tap a number.",
  ship: "",
  cost: "Drag to turn it",
};

/** ?gfx=hq|lite|none overrides the device check, for testing. */
function pickGfx(): "hq" | "lite" | "none" {
  const forced = new URLSearchParams(location.search).get("gfx");
  if (forced === "hq" || forced === "lite" || forced === "none") return forced;
  return webgl() ? (detectTier() === "high" ? "hq" : "lite") : "none";
}

function webgl() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

export default function RockmotionLab() {
  const reduce = !!useReducedMotion();
  const [gfx] = useState(pickGfx);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<Step>("vin");
  const [paint, setPaint] = useState(0);
  const [vin, setVin] = useState(SAMPLE_VINS[0].vin);
  const [area, setAreaState] = useState<AreaId | null>(null);
  const [checks, setChecks] = useState<Set<string>>(() => new Set());
  const [damaged, setDamaged] = useState<Set<string>>(() => new Set());
  const [method, setMethodState] = useState<Method>("roro");
  const [vehicle, setVehicleState] = useState<Vehicle>("sedan");
  const [portId, setPortId] = useState("baltimore");
  const [destId, setDestId] = useState("tema");
  const [run, setRun] = useState(0);
  const [stage, setStageIdx] = useState(0);
  const [edits, setEdits] = useState<Partial<CostFields>>({});
  const dest = DESTINATIONS.find((d) => d.id === destId) ?? DESTINATIONS[0];
  const port = US_PORTS.find((p) => p.id === portId) ?? US_PORTS[0];

  const cost: CostFields = {
    price: 18500,
    inland: truckingFor(port),
    shipping: shippingFor(dest, method, vehicle),
    duty: 30,
    port: 900,
    rate: dest.rate,
    ...edits,
  };
  // a new route means new example freight, trucking and currency
  const resetRoute = () =>
    setEdits((e) => {
      const n = { ...e };
      delete n.shipping;
      delete n.inland;
      delete n.rate;
      return n;
    });

  const go = (s: Step) => {
    setStep(s);
    emit("kit", "rockmotion.step", s);
    if (s === "cost") emitOnce("rm-cost", "kit", "rockmotion.cost", dest.port);
  };
  const setArea = (a: AreaId | null) => {
    setAreaState(a);
    if (a) emit("kit", "rockmotion.inspect", a);
  };
  const togglePanel = (p: string) => {
    setDamaged((d) => {
      const n = new Set(d);
      if (n.has(p)) n.delete(p);
      else {
        n.add(p);
        emit("kit", "rockmotion.damage", p);
      }
      return n;
    });
  };
  const toggleCheck = (k: string) =>
    setChecks((c) => {
      const n = new Set(c);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  const view: View = step === "vin" ? "vin" : step === "inspect" ? (area ?? "walk") : step === "cost" ? "cost" : "intro";
  const open: Partial<Record<HingeId, boolean>> =
    step !== "inspect" ? {} : area === "engine" ? { hood: true } : area === "cabin" ? { doorL: true } : area === "wheels" ? { steerL: true, steerR: true } : {};
  const i = STEPS.findIndex((s) => s.id === step);
  const next = STEPS[i + 1];
  const plate = clean(vin);
  const freightHint = `example, ${VEHICLES.find((v) => v.id === vehicle)?.label.toLowerCase()} by ${METHODS[method].short}`;

  return (
    <div className="theme-fixed card !bg-[#0c0d0f]">
      <div className="flex flex-wrap items-center gap-3 px-3 py-3 border-b border-[var(--line)]">
        <div className="seg max-w-full overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Steps">
          {STEPS.map((s, j) => (
            <button key={s.id} type="button" role="tab" aria-selected={step === s.id} onClick={() => go(s.id)} className="seg-item !px-3.5 md:!px-4">
              <span className="tabular-nums opacity-60 mr-1.5">{j + 1}</span>
              <span className="sm:hidden">{s.short}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
        {gfx !== "none" && step !== "ship" && (
          <div className="ml-auto flex items-center gap-2" role="group" aria-label="Paint">
            {PAINTS.map((p) => (
              <button
                key={p.v}
                type="button"
                aria-label={`Paint: ${p.label}`}
                aria-pressed={paint === p.v}
                title={p.label}
                onClick={() => setPaint(p.v)}
                className={`w-7 h-7 rounded-full border-2 transition-colors ${paint === p.v ? "border-white" : "border-white/15 hover:border-white/40"}`}
                style={{ background: p.hex }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className={`relative overflow-hidden ${step === "ship" ? "lg:h-[700px] flex items-center" : gfx === "none" ? "aspect-[16/10] lg:aspect-auto lg:h-[700px]" : "h-[56svh] min-h-[380px] max-h-[620px] lg:max-h-none lg:h-[700px]"}`}>
          {gfx !== "none" && (
            <div className={`absolute inset-0 transition-opacity duration-700 ${step === "ship" ? "invisible" : ""} ${ready ? "opacity-100" : "opacity-0"}`}>
              <Stage
                view={view}
                hq={gfx === "hq"}
                paused={step === "ship"}
                reduce={reduce}
                variant={paint}
                open={open}
                lifted={step === "inspect" && area === "under"}
                damaged={damaged}
                marking={step === "inspect" && area === "body"}
                vin={plate}
                hotspots={step === "inspect" && !area}
                area={area}
                onArea={setArea}
                onPanel={togglePanel}
                onReady={() => setReady(true)}
              />
            </div>
          )}
          {step !== "ship" && (gfx === "none" || !ready) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/lab/car-poster.webp" alt="The car in the studio, three-quarter view" className="absolute inset-0 w-full h-full object-cover" />
          )}
          {step === "ship" && (
            <div className="w-full p-2 md:p-6">
              <RouteMap
                dest={dest}
                port={port}
                method={method}
                run={run}
                reduce={reduce}
                onStage={setStageIdx}
                onPick={(id) => {
                  setDestId(id);
                  resetRoute();
                }}
              />
            </div>
          )}
          {HINTS[step] && gfx !== "none" && (
            <p className="pointer-events-none absolute left-3 bottom-3 rounded-full bg-black/55 backdrop-blur px-3.5 py-2 text-[12.5px] text-white/85">{HINTS[step]}</p>
          )}
          {step === "inspect" && area === "body" && damaged.size > 0 && (
            <p className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-[#e8a13a] px-3.5 py-2 text-[12.5px] font-medium text-black">
              {damaged.size} panel{damaged.size === 1 ? "" : "s"} marked
            </p>
          )}
        </div>

        <aside className="border-t lg:border-t-0 lg:border-l border-[var(--line)] p-5 lg:max-h-[700px] lg:overflow-y-auto" aria-live="polite">
          <p className="card-meta">
            <span className="card-dot bg-[#2f6bff]" />
            Step {i + 1} of {STEPS.length}
          </p>
          <h2 className="mt-2 card-title !text-[22px]">{STEPS[i].title}</h2>
          <div className="mt-5">
            {step === "vin" && <Vin vin={vin} setVin={setVin} />}
            {step === "inspect" && (
              <Inspection
                area={area}
                setArea={setArea}
                checks={checks}
                toggleCheck={toggleCheck}
                damaged={damaged}
                togglePanel={togglePanel}
                reset={() => {
                  setChecks(new Set());
                  setDamaged(new Set());
                }}
              />
            )}
            {step === "ship" && (
              <Journey
                dest={dest}
                setDest={(id) => {
                  setDestId(id);
                  resetRoute();
                  emit("kit", "rockmotion.route", id);
                }}
                port={port}
                setPort={(id) => {
                  setPortId(id);
                  resetRoute();
                }}
                method={method}
                setMethod={(m) => {
                  setMethodState(m);
                  resetRoute();
                }}
                vehicle={vehicle}
                setVehicle={(v) => {
                  setVehicleState(v);
                  resetRoute();
                }}
                stage={run ? stage : -1}
                play={() => {
                  setRun((r) => r + 1);
                  emit("kit", "rockmotion.route", dest.id);
                }}
              />
            )}
            {step === "cost" && <LandedCost f={cost} set={(p) => setEdits((e) => ({ ...e, ...p }))} dest={dest} freightHint={freightHint} />}
          </div>
          {next && (step !== "inspect" || !area) && (
            <button type="button" onClick={() => go(next.id)} className="btn btn-line w-full mt-8">
              Next: {next.label} <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {step === "inspect" && area === AREAS[AREAS.length - 1].id && next && (
            <button type="button" onClick={() => go(next.id)} className="btn btn-line w-full mt-3">
              Next: {next.label} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
