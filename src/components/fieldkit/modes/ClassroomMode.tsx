"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { emit } from "../events";
import { EASE_OUT } from "@/lib/motion";

const CORE = ["English", "Core Maths", "Int. Science", "Social Studies"] as const;
const ELECTIVES = ["Biology", "Chemistry", "Physics", "Elec. Maths", "Economics", "Literature", "Government", "Accounting"] as const;
type Subject = (typeof CORE)[number] | (typeof ELECTIVES)[number];

interface Programme {
  id: string;
  name: string;
  need: Partial<Record<Subject, string>>;
  /** Pick one of these. */
  oneOf?: Subject[];
  aggregate: string;
}

// Typical WASSCE entry patterns, simplified for the demo.
const PROGRAMMES: Programme[] = [
  {
    id: "med",
    name: "Medicine",
    need: { English: "B3", "Core Maths": "B3", "Int. Science": "B3", "Social Studies": "C6", Biology: "B3", Chemistry: "B3" },
    oneOf: ["Physics", "Elec. Maths"],
    aggregate: "06 to 10",
  },
  {
    id: "eng",
    name: "Engineering",
    need: { English: "C6", "Core Maths": "C6", "Int. Science": "C6", "Social Studies": "C6", "Elec. Maths": "B3", Physics: "B3", Chemistry: "C6" },
    aggregate: "08 to 14",
  },
  {
    id: "cs",
    name: "Computer Science",
    need: { English: "C6", "Core Maths": "C6", "Int. Science": "C6", "Social Studies": "C6", "Elec. Maths": "C6" },
    oneOf: ["Physics", "Economics"],
    aggregate: "10 to 18",
  },
  {
    id: "law",
    name: "Law",
    need: { English: "B3", "Core Maths": "C6", "Int. Science": "C6", "Social Studies": "C6" },
    oneOf: ["Literature", "Government", "Economics"],
    aggregate: "06 to 12",
  },
  {
    id: "bus",
    name: "Business",
    need: { English: "C6", "Core Maths": "C6", "Int. Science": "C6", "Social Studies": "C6", Economics: "C6", Accounting: "C6" },
    aggregate: "12 to 20",
  },
];

function Cell({ s, grade, either, delay }: { s: Subject; grade?: string; either: boolean; delay: number }) {
  const reduce = useReducedMotion();
  const on = !!grade || either;
  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor: on ? (either && !grade ? "rgba(255,91,31,0.08)" : "rgba(255,91,31,0.16)") : "rgba(255,255,255,0.03)",
        borderColor: on ? "rgba(255,91,31,0.55)" : "rgba(255,255,255,0.07)",
      }}
      transition={{ delay: reduce ? 0 : delay, duration: 0.35, ease: EASE_OUT }}
      className="relative rounded-[7px] border px-1.5 @[440px]:px-2 py-1.5 min-w-0"
      style={either && !grade ? { borderStyle: "dashed" } : undefined}
    >
      <div className={`text-[10px] @[440px]:text-[10.5px] leading-tight break-words ${on ? "text-[#F2EEE6]" : "text-white/35"}`}>{s}</div>
      <div className="font-mono text-[8.5px] mt-0.5 text-white/40">{grade ? `min ${grade}` : either ? "one of" : "·"}</div>
    </motion.div>
  );
}

export default function ClassroomMode() {
  const reduce = useReducedMotion();
  const [pid, setPid] = useState<string | null>(null);
  const prog = PROGRAMMES.find((p) => p.id === pid) ?? null;

  const pick = (p: Programme) => {
    setPid(p.id);
    emit("class", "pathway.picked", `WASSCE → ${p.name} · aggregate ${p.aggregate}`);
  };

  return (
    <div className="absolute inset-0 bg-white font-body">
      <Image unoptimized src="/previews/koyi/pathway.webp" alt="Kōyi Knowledge Hub: the WASSCE pathway page" fill sizes="600px" className="object-cover object-left-top" />
      <div className="absolute inset-0 bg-[#0d2a1f]/20" />
      <div className="theme-fixed absolute left-3 right-3 bottom-3 @[480px]:left-auto @[480px]:top-3 @[480px]:w-[300px] rounded-[10px] bg-[#0f1714] text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] border border-white/10 p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold">Pick a programme</span>
          <span className="text-[8.5px] text-white/40">EN · FR · AR</span>
        </div>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Target programme">
          {PROGRAMMES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => pick(p)}
              aria-pressed={pid === p.id}
              className={`h-[22px] px-2 rounded-full border text-[9.5px] transition-colors ${
                pid === p.id ? "bg-[#22c55e] text-[#052e16] border-[#22c55e] font-semibold" : "border-white/15 text-white/75 hover:border-white/40"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="text-[8px] uppercase tracking-[0.12em] text-white/35">Core</div>
        <div className="grid grid-cols-4 gap-1">
          {CORE.map((s, i) => (
            <Cell key={s} s={s} grade={prog?.need[s]} either={false} delay={i * 0.04} />
          ))}
        </div>
        <div className="text-[8px] uppercase tracking-[0.12em] text-white/35">Electives</div>
        <div className="grid grid-cols-4 gap-1">
          {ELECTIVES.map((s, i) => (
            <Cell key={s} s={s} grade={prog?.need[s]} either={!!prog?.oneOf?.includes(s)} delay={0.16 + i * 0.04} />
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={pid ?? "none"}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[9.5px] leading-snug text-white/70"
          >
            {prog
              ? `${prog.name}: typical aggregate ${prog.aggregate} across the best six. Each university publishes its own list.`
              : "The subjects and minimum grades it needs light up, as on the Knowledge Hub."}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
