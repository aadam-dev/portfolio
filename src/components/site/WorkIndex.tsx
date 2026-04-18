"use client";

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  projects,
  projectSlug,
  type Project,
  type ProjectCategory,
} from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";

const FILTERS: { label: string; value: ProjectCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Enterprise", value: "enterprise" },
  { label: "EdTech", value: "edtech" },
  { label: "Finance", value: "community" },
  { label: "Commerce", value: "ecommerce" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Corporate", value: "corporate" },
  { label: "Automotive", value: "automotive" },
  { label: "Fashion", value: "fashion" },
  { label: "Creative", value: "creative" },
  { label: "Sports", value: "sports" },
];

export default function WorkIndex() {
  const [active, setActive] = useState<ProjectCategory | "all">("all");

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => p.category === active);

  const [feature, ...rest] = filtered;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative px-4 md:px-6 pt-24 md:pt-36 pb-20 md:pb-28"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">Selected Work · 2022 — 2026</p>
            <h2
              id="work-heading"
              className="font-display text-white text-balance"
              style={{
                fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
              }}
            >
              Projects that moved{" "}
              <span className="italic text-[var(--ink-2)]">real businesses forward.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[15px] text-[var(--ink-3)] leading-relaxed">
            A curated cut from 20+ production products across EdTech,
            FinTech, e-commerce and enterprise ecosystems.
          </p>
        </div>

        {/* Filters — horizontal scroll on mobile */}
        <div
          role="toolbar"
          aria-label="Filter projects by category"
          className="relative mb-10 md:mb-14"
        >
          <div className="edge-fade-x -mx-4 md:mx-0 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2 px-4 md:px-0 w-max md:w-auto md:flex-wrap">
              {FILTERS.filter(
                (f) =>
                  f.value === "all" ||
                  projects.some((p) => p.category === f.value),
              ).map((f) => {
                const isActive = active === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setActive(f.value)}
                    aria-pressed={isActive}
                    className={`whitespace-nowrap px-4 py-2 text-[12px] font-mono uppercase tracking-[0.16em] rounded-full border transition-colors ${
                      isActive
                        ? "bg-white text-black border-white"
                        : "text-[var(--ink-3)] border-[var(--line-strong)] hover:text-white hover:border-white/30"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
          >
            {feature && (
              <ProjectCard
                key={feature.id}
                project={feature}
                index={0}
                feature
                priority
              />
            )}
            {rest.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i + 1}
                priority={i < 2}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Editorial Index */}
        <IndexList projects={filtered} />
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────
   Editorial numbered index — magazine-masthead style.
   Desktop: hovering a row reveals a floating preview image.
   Mobile: each row shows compact meta.
   ─────────────────────────────────────────────────────────── */
function IndexList({ projects }: { projects: Project[] }) {
  const [hover, setHover] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        if (!containerRef.current) return;
        const r = containerRef.current.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className="relative mt-24 md:mt-32"
    >
      <div className="flex items-end justify-between mb-8 md:mb-10">
        <p className="eyebrow">Index · A–Z</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-4)]">
          {String(projects.length).padStart(2, "0")} entries
        </p>
      </div>

      <ul className="relative">
        {projects.map((p, i) => {
          const href = `/work/${projectSlug(p)}`;
          return (
            <li
              key={p.id}
              className="border-t border-[var(--line)] last:border-b"
              onMouseEnter={() => setHover(p)}
              onMouseLeave={() => setHover(null)}
            >
              <Link
                href={href}
                className="group flex items-center gap-4 md:gap-8 py-5 md:py-7"
              >
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-4)] w-10 md:w-12 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className="flex-1 min-w-0 font-display text-white transition-transform duration-500 group-hover:translate-x-2"
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 3rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {p.name}
                </span>

                <span className="hidden md:inline font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-3)] w-48 truncate">
                  {p.categoryLabel}
                </span>

                <span className="hidden sm:inline font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-4)] w-20 text-right">
                  {p.year ?? ""}
                </span>

                <ArrowUpRight className="w-4 h-4 text-[var(--ink-4)] transition-all group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Floating hover preview (desktop only) */}
      <AnimatePresence>
        {hover && hover.imagePath && (
          <motion.div
            key={hover.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block pointer-events-none absolute top-0 left-0 z-10"
            style={{
              x: sx,
              y: sy,
              translateX: "-50%",
              translateY: "-110%",
            }}
          >
            <div
              className="relative overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
              style={{ width: 360, aspectRatio: "16 / 10" }}
            >
              <Image
                src={hover.imagePath}
                alt={hover.name}
                fill
                sizes="360px"
                className="object-cover"
                quality={90}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
