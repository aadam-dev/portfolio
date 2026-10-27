"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { emit } from "../events";
import { EASE_OUT } from "@/lib/motion";
import { findProject, projectSlug } from "@/lib/projects";

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

const PLATFORMS = ["rentcheck", "lenus", "rockmotion", "pronaj", "thepalms", "magilo"]
  .map((slug) => findProject(slug))
  .filter((p): p is NonNullable<typeof p> => !!p && !p.hidden);

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
  const [hover, setHover] = useState<string | null>(null);
  const prog = PROGRAMMES.find((p) => p.id === pid) ?? null;
  const preview = PLATFORMS.find((p) => p.id === hover);

  const pick = (p: Programme) => {
    setPid(p.id);
    emit("class", "pathway.picked", `WASSCE → ${p.name} · aggregate ${p.aggregate}`);
  };

  return (
    <div className="grid grid-cols-1 @[440px]:grid-cols-[minmax(0,1fr)_150px] gap-3 h-full">
      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">Kōyi · WASSCE pathway</span>
          <span className="font-mono text-[9px] text-white/30">EN · FR · AR</span>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Target programme">
          {PROGRAMMES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => pick(p)}
              aria-pressed={pid === p.id}
              className={`h-7 px-2.5 rounded-full border text-[11px] transition-colors ${
                pid === p.id ? "bg-[#F2EEE6] text-[#14100A] border-[#F2EEE6]" : "border-white/12 text-white/70 hover:border-white/35"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/35 mt-0.5">Core</div>
        <div className="grid grid-cols-4 gap-1.5">
          {CORE.map((s, i) => (
            <Cell key={s} s={s} grade={prog?.need[s]} either={false} delay={i * 0.04} />
          ))}
        </div>
        <div className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/35">Electives</div>
        <div className="grid grid-cols-4 gap-1.5">
          {ELECTIVES.map((s, i) => (
            <Cell key={s} s={s} grade={prog?.need[s]} either={!!prog?.oneOf?.includes(s)} delay={0.16 + i * 0.04} />
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 rounded-[8px] bg-[#13120F] border border-white/[0.06] px-2.5 py-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={pid ?? "none"}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[10.5px] text-white/70 leading-snug"
            >
              {prog
                ? `${prog.name}: typical aggregate ${prog.aggregate} across best six. Check each university's list.`
                : "Pick a programme. The subjects and grades it needs light up."}
            </motion.span>
          </AnimatePresence>
          {prog && <span className="font-mono text-[15px] text-[var(--accent)] shrink-0">{prog.aggregate.split(" ")[0]}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">Also shipped</span>
        <div className="relative h-[78px] rounded-[8px] overflow-hidden border border-white/[0.06] bg-[#13120F]">
          <AnimatePresence mode="wait">
            {preview?.imagePath ? (
              <motion.div
                key={preview.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Image src={preview.imagePath} alt="" fill sizes="150px" className="object-cover object-top" />
                <span className="absolute left-1.5 bottom-1.5 right-1.5 truncate rounded bg-black/65 px-1.5 py-0.5 font-mono text-[8.5px] text-white/85">
                  {preview.tagline}
                </span>
              </motion.div>
            ) : (
              <motion.span
                key="empty"
                className="absolute inset-0 grid place-items-center px-3 text-center font-mono text-[9px] leading-snug text-white/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                hover a platform
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <ul className="grid grid-cols-2 @[440px]:grid-cols-1 gap-1">
          {PLATFORMS.map((p) => (
            <li key={p.id}>
              <Link
                href={`/work/${projectSlug(p)}`}
                onMouseEnter={() => setHover(p.id)}
                onFocus={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                onBlur={() => setHover(null)}
                className="group flex items-center justify-between gap-1 rounded-[6px] border border-white/[0.08] px-2 h-[26px] text-[10.5px] text-white/70 hover:text-white hover:border-white/30"
              >
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.accentColor }} />
                  <span className="truncate">{p.name}</span>
                </span>
                <ArrowUpRight className="w-3 h-3 opacity-40 group-hover:opacity-100 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
