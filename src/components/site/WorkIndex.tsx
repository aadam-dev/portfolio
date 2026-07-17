"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  projects,
  visibleProjects,
  projectSlug,
  type Project,
  type ProjectCategory,
} from "@/lib/projects";
import { useTranslations } from "next-intl";
import { drawLine } from "@/lib/motion";

const FILTERS: { label: string; value: ProjectCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Enterprise", value: "enterprise" },
  { label: "EdTech", value: "edtech" },
  { label: "Fintech", value: "fintech" },
  { label: "Finance", value: "community" },
  { label: "Commerce", value: "ecommerce" },
  { label: "PropTech", value: "proptech" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Corporate", value: "corporate" },
  { label: "Automotive", value: "automotive" },
  { label: "Fashion", value: "fashion" },
  { label: "Creative", value: "creative" },
  { label: "Sports", value: "sports" },
];

function usePointerFine() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(pointer: fine)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(pointer: fine)").matches,
    () => false
  );
}

export default function WorkIndex() {
  const t = useTranslations("work");
  const [active, setActive] = useState<ProjectCategory | "all">("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = !!useReducedMotion();
  const pointerFine = usePointerFine();
  const listRef = useRef<HTMLDivElement>(null);

  // Floating preview follows cursor with lag
  const PANEL_W = 440;
  const PANEL_H = 300;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 150, damping: 20 });
  const py = useSpring(my, { stiffness: 150, damping: 20 });
  const vx = useVelocity(px);
  const rotate = useTransform(vx, [-1200, 1200], [-3, 3]);
  // Clamp inside the viewport so the panel never renders clipped/offscreen.
  const panelX = useTransform(px, (v) => {
    if (typeof window === "undefined") return v;
    const half = PANEL_W / 2;
    return Math.min(Math.max(v, half + 16), window.innerWidth - half - 16);
  });
  // Flip below the cursor when hovering rows near the top of the viewport.
  const panelY = useTransform(py, (v) => (v < PANEL_H + 72 ? v + 28 : v - PANEL_H - 28));

  // Projects without a live deployment sink to the bottom (stable within groups).
  const visible = [...visibleProjects()].sort(
    (a, b) => Number(!!b.liveBaseUrl) - Number(!!a.liveBaseUrl)
  );
  const filtered =
    active === "all" ? visible : visible.filter((p) => p.category === active);

  const hoveredProject = projects.find((p) => p.id === hovered);
  const showPanel = pointerFine && !reduce && !!hoveredProject?.imagePath;

  return (
    <section
      id="work"
      className="relative px-4 md:px-6 py-24 md:py-32"
      aria-labelledby="work-heading"
      onMouseMove={(e) => {
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        <header className="mb-10 md:mb-14">
          <p className="eyebrow mb-5">{t("eyebrow")}</p>
          <h2
            id="work-heading"
            className="font-display text-balance"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", lineHeight: 1 }}
          >
            {t("headingCount", { count: visible.length })}{" "}
            <span className="font-serif-it text-[var(--ink-2)] lowercase">
              {t("headingAccent")}
            </span>
          </h2>

          {/* Filters as inline mono links */}
          <nav
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2"
            aria-label="Filter projects by category"
          >
            {FILTERS.filter(
              (f) => f.value === "all" || visible.some((p) => p.category === f.value)
            ).map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setActive(f.value)}
                aria-pressed={active === f.value}
                className={`font-mono text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 ${
                  active === f.value
                    ? "text-[var(--accent)]"
                    : "text-[var(--ink-4)] hover:text-[var(--ink-2)]"
                }`}
              >
                {f.value === "all" ? t("filterAll") : f.label}
                {active === f.value && (
                  <span aria-hidden="true"> ({filtered.length})</span>
                )}
              </button>
            ))}
          </nav>
          <motion.div
            variants={drawLine}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-6 h-px bg-[var(--line-strong)] origin-left"
          />
        </header>

        {/* Editorial rows */}
        <div ref={listRef} onMouseLeave={() => setHovered(null)}>
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((p, i) => (
              <IndexRow
                key={p.id}
                project={p}
                index={i}
                dimmed={hovered !== null && hovered !== p.id}
                onHover={setHovered}
                pointerFine={pointerFine}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating preview panel */}
      <AnimatePresence>
        {showPanel && hoveredProject?.imagePath && (
          <motion.div
            key={hoveredProject.id}
            className="fixed z-40 pointer-events-none hidden md:block"
            style={{
              left: panelX,
              top: panelY,
              x: "-50%",
              rotate,
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-[440px] h-[300px] rounded-xl overflow-hidden border border-[var(--line-strong)] shadow-2xl bg-[var(--surface-2)]">
              <Image
                src={hoveredProject.imagePath}
                alt=""
                fill
                sizes="440px"
                className="object-cover object-top"
              />
              <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 font-mono text-[10px] tracking-[0.14em] uppercase text-white/90 backdrop-blur">
                {hoveredProject.name}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function IndexRow({
  project,
  index,
  dimmed,
  onHover,
  pointerFine,
}: {
  project: Project;
  index: number;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  pointerFine: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: dimmed ? 0.35 : 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        delay: Math.min(index * 0.04, 0.3),
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 0.3 },
      }}
      onMouseEnter={() => onHover(project.id)}
    >
      <Link
        href={`/work/${projectSlug(project)}`}
        data-project-row={project.id}
        className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[3rem_1fr_auto_2.5rem] items-center gap-4 md:gap-8 py-5 md:py-6 border-b border-[var(--line)] focus:outline-none focus-visible:bg-[var(--surface)]"
        aria-label={`${project.name} — ${project.tagline}`}
      >
        <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--ink-4)] tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="flex items-center gap-4 min-w-0">
          {/* Inline thumbnail on touch/small screens */}
          {!pointerFine && project.imagePath && (
            <span className="relative w-16 h-11 rounded-md overflow-hidden border border-[var(--line)] shrink-0">
              <Image
                src={project.imagePath}
                alt=""
                fill
                sizes="64px"
                className="object-cover object-top"
              />
            </span>
          )}
          <span
            className="font-display truncate transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3"
            style={{
              fontSize: "clamp(1.5rem, 3.2vw, 2.6rem)",
              lineHeight: 1.05,
            }}
          >
            {project.name}
          </span>
        </span>

        <span className="hidden md:flex flex-col items-end gap-0.5 whitespace-nowrap">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-3)]">
            {project.categoryLabel}
          </span>
          {project.year && (
            <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--ink-4)]">
              {project.year}
            </span>
          )}
        </span>

        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-[var(--ink-4)] transition-all duration-500 group-hover:rotate-45 group-hover:text-[var(--accent)] justify-self-end" />
      </Link>
    </motion.div>
  );
}
