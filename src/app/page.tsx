"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useInView, AnimatePresence } from "framer-motion";
import { projects, type Project, type ProjectCategory } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";

const CATEGORIES: { label: string; value: ProjectCategory | "all" }[] = [
  { label: "All Work", value: "all" },
  { label: "EdTech", value: "edtech" },
  { label: "FinTech", value: "fintech" },
  { label: "E-Commerce", value: "ecommerce" },
  { label: "PropTech", value: "proptech" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Community", value: "community" },
  { label: "Sports", value: "sports" },
  { label: "Fashion", value: "fashion" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Corporate", value: "corporate" },
  { label: "Automotive", value: "automotive" },
  { label: "Desktop", value: "desktop" },
  { label: "Creative", value: "creative" },
];

/* ── Animated count-up stat ─────────────────────────────────────────── */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    // Parse: "GHS 40K+" → prefix="GHS ", num=40, suffix="K+"
    const match = value.match(/^([A-Za-z\s]*)(\d+)(.*)$/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr, 10);
    const steps = 48;
    const stepMs = 1400 / steps;
    let current = 0;

    setDisplay(`${prefix}0${suffix}`);

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(`${prefix}${Math.floor(current)}${suffix}`);
      }
    }, stepMs);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref}>
      <div
        className="text-2xl font-bold tabular-nums"
        style={{ color: "#fff", fontFamily: "var(--font-space-grotesk)" }}
      >
        {display}
      </div>
      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
        {label}
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */
export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cursor, setCursor] = useState({ x: -1000, y: -1000 });

  const { scrollYProgress } = useScroll();

  const projectsRef = useRef(null);
  const impactRef = useRef(null);
  const projectsInView = useInView(projectsRef, { once: true, margin: "-80px" });
  const impactInView = useInView(impactRef, { once: true, margin: "-80px" });

  /* Track mouse for spotlight */
  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const filteredAll =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const filteredSelected = filteredAll.filter((p) => p.featured || p.isLead);

  return (
    <main className="min-h-screen grid-bg">

      {/* ── Scroll progress bar ──────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-px origin-left"
        style={{
          scaleX: scrollYProgress,
          background: "linear-gradient(90deg, #7C6AFA 0%, #A89FFF 100%)",
        }}
      />

      {/* ── Cursor spotlight ─────────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: `radial-gradient(600px circle at ${cursor.x}px ${cursor.y}px, rgba(124,106,250,0.055), transparent 40%)`,
        }}
      />

      {/* ── Grain texture ────────────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          opacity: 0.022,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── Header / Nav ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 px-6"
        style={{
          background: "rgba(8,8,15,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="max-w-6xl mx-auto flex items-center justify-between"
          style={{ height: 56 }}
        >
          <span
            className="font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#fff", fontSize: 17 }}
          >
            Aadam
            <span style={{ color: "#7C6AFA" }}>.</span>
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/aadam-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/aadamsays"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              LinkedIn
            </a>
            <a
              href="mailto:aadamsays@gmail.com?subject=Hi%20Aadam%20%E2%80%94%20Let%E2%80%99s%20Work%20Together&body=Hi%20Aadam%2C%0A%0A"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{
                background: "rgba(124,106,250,0.12)",
                border: "1px solid rgba(124,106,250,0.25)",
                color: "#A89FFF",
              }}
            >
              Get in touch
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-16 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Status pill — pulsing dot */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{
              background: "rgba(124,106,250,0.1)",
              border: "1px solid rgba(124,106,250,0.2)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#4ade80" }}
              />
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80" }}
              />
            </span>
            Available for new projects — Global · Remote (based in Accra)
          </div>

          {/* Roles */}
          <div
            className="flex items-center gap-3 mb-5 text-xs font-medium flex-wrap"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {["Analyst", "Full-Stack Developer", "Systems Builder"].map((role, i) => (
              <span key={role} className="flex items-center gap-3">
                {i > 0 && (
                  <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 16 }}>·</span>
                )}
                <span
                  style={{
                    color: i === 1 ? "#A89FFF" : "rgba(255,255,255,0.4)",
                    fontWeight: i === 1 ? 600 : 400,
                  }}
                >
                  {role}
                </span>
              </span>
            ))}
          </div>

          <h1
            className="font-bold mb-4 leading-none tracking-tight"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              letterSpacing: "-0.04em",
              color: "#fff",
              fontSize: "clamp(2.8rem, 6.5vw, 4.8rem)",
            }}
          >
            I build tools that
            <br />
            <span className="text-gradient">make businesses work.</span>
          </h1>

          <p
            className="text-lg mb-10 max-w-xl leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}
          >
            Multi-disciplinary professional at the intersection of investment and business analysis,
            data analysis, business development, and software engineering — with deep roots in Africa&apos;s emerging market.
            Click any project to explore interactive previews or open the live site.
          </p>

          {/* Quick stats — count-up */}
          <div className="flex gap-10 flex-wrap">
            {[
              ["50+", "SMEs Evaluated"],
              ["20+", "Products Shipped"],
              ["4+", "Years Experience"],
              ["GHS 40K+", "Community Funds Raised"],
            ].map(([val, label]) => (
              <AnimatedStat key={label} value={val} label={label} />
            ))}
          </div>
        </motion.div>

        {/* Floating accent glow */}
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: 480,
            height: 480,
            background: "radial-gradient(circle, rgba(124,106,250,0.07) 0%, transparent 70%)",
            transform: "translate(20%, -20%)",
          }}
        />
      </section>

      {/* Divider */}
      <div className="px-6 max-w-6xl mx-auto">
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* ── Projects section ─────────────────────────────────────── */}
      <motion.section
        ref={projectsRef}
        initial={{ opacity: 0, y: 28 }}
        animate={projectsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 pt-10 pb-20 max-w-6xl mx-auto"
      >
        {/* Header + filters */}
        <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{
                color: "#fff",
                fontFamily: "var(--font-space-grotesk)",
                letterSpacing: "-0.02em",
              }}
            >
              Interactive Case Studies
            </h2>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              {filteredSelected.length} projects — click to explore interactive previews or view the live site.
            </p>
          </div>

          {/* Category filters */}
          <div className="flex gap-2 flex-wrap justify-end">
            {CATEGORIES.filter(
              (c) => c.value === "all" || projects.some((p) => p.category === c.value)
            ).map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background:
                    activeCategory === cat.value
                      ? "rgba(124,106,250,0.18)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    activeCategory === cat.value
                      ? "1px solid rgba(124,106,250,0.35)"
                      : "1px solid rgba(255,255,255,0.06)",
                  color:
                    activeCategory === cat.value
                      ? "#A89FFF"
                      : "rgba(255,255,255,0.4)",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid with AnimatePresence for smooth category transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {filteredSelected.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Secondary list — more work */}
        {filteredAll.length > filteredSelected.length && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <p
              className="text-xs font-semibold mb-3 tracking-widest"
              style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.16em" }}
            >
              MORE WORK
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {filteredAll
                .filter((p) => !filteredSelected.includes(p))
                .map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 hover:opacity-80"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: project.accentColor }}
                    />
                    <span>{project.name}</span>
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* ── Impact & Leadership ───────────────────────────────────── */}
      <motion.section
        ref={impactRef}
        initial={{ opacity: 0, y: 28 }}
        animate={impactInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 pb-20 max-w-6xl mx-auto"
      >
        <div className="mb-6">
          <h2
            className="text-2xl font-bold"
            style={{
              color: "#fff",
              fontFamily: "var(--font-space-grotesk)",
              letterSpacing: "-0.02em",
            }}
          >
            Impact &amp; Leadership
          </h2>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Selected fellowships and community projects where I led analysis, operations, and communication.
          </p>
        </div>

        {/* Fellowships */}
        <div className="grid gap-3 md:grid-cols-2 mb-8">
          <div
            className="glass-card rounded-2xl p-4 flex flex-col gap-2"
            style={{
              background: "rgba(15,15,26,0.9)",
              borderColor: "rgba(148,163,184,0.5)",
            }}
          >
            <div className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: "rgba(148,163,184,0.9)" }}>
              Fellowship
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: "#fff", fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
            >
              Aspire Leaders Program — Cohort 4, 2025
            </div>
            <p className="text-xs" style={{ color: "rgba(226,232,240,0.8)" }}>
              Harvard‑affiliated global leadership fellowship for first‑generation and limited‑income students.
              Selected for faculty‑led modules in ethical leadership, problem‑solving, and international collaboration.
            </p>
          </div>

          <div
            className="glass-card rounded-2xl p-4 flex flex-col gap-2"
            style={{
              background: "rgba(15,15,26,0.9)",
              borderColor: "rgba(124,106,250,0.6)",
            }}
          >
            <div className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: "rgba(148,163,184,0.9)" }}>
              Fellowship
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: "#fff", fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
            >
              AI‑Integrated Leadership Program (AILP), 2026
            </div>
            <p className="text-xs" style={{ color: "rgba(226,232,240,0.8)" }}>
              Continuing fellow at Aspire Institute&apos;s AI‑Integrated Leadership Program, focused on applying AI tools
              to real‑world community and business challenges in emerging markets.
            </p>
          </div>
        </div>

        {/* Case studies */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {/* Madina Basketball */}
          <div
            className="glass-card rounded-2xl p-4 flex flex-col gap-3"
            style={{ borderColor: "rgba(234,179,8,0.5)" }}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#fff", fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.01em" }}
                >
                  Madina Basketball — Community Hub, Donors &amp; Data
                </p>
                <p className="text-[11px] mt-1 font-medium uppercase tracking-[0.16em]" style={{ color: "rgba(234,179,8,0.8)" }}>
                  Project management · Data analysis · Design · Engineering
                </p>
              </div>
            </div>
            <p className="text-xs" style={{ color: "rgba(226,232,240,0.8)" }}>
              Co‑led the transformation of an inactive, run‑down court in Libya Quarters into a solar‑powered
              basketball hub — sourcing engineers, planning the works, and staying on site through to completion and launch.
            </p>
            <ul className="space-y-1.5 text-xs" style={{ color: "rgba(148,163,184,0.95)" }}>
              <li>• Worked with community leaders and youth to scope the renovation, get estimates and budgets, and supervise site visits and construction.</li>
              <li>• Built Google Sheets dashboards to track donations, expenses and court activity; produced anonymised summaries for sponsors and the community.</li>
              <li>• Planned launch events and youth training sessions; designed posters and social assets; shipped the Madina Basketball site to document it all (madinabball.vercel.app).</li>
            </ul>
            <div className="flex flex-wrap gap-2 mt-3">
              <a
                href="https://madinabball.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold inline-flex items-center justify-center transition-opacity hover:opacity-80"
                style={{
                  background: "rgba(234,179,8,0.12)",
                  border: "1px solid rgba(234,179,8,0.5)",
                  color: "#facc15",
                }}
              >
                View live site
              </a>
              <button
                type="button"
                onClick={() => {
                  const project = projects.find((p) => p.id === "madinabasketball");
                  if (project) setSelectedProject(project);
                }}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-80"
                style={{
                  background: "rgba(15,15,26,0.9)",
                  border: "1px solid rgba(148,163,184,0.5)",
                  color: "rgba(226,232,240,0.9)",
                }}
              >
                Open preview
              </button>
            </div>
          </div>

          {/* NexaYouth */}
          <div
            className="glass-card rounded-2xl p-4 flex flex-col gap-3"
            style={{ borderColor: "rgba(59,130,246,0.5)" }}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#fff", fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.01em" }}
                >
                  NexaYouth — Climate &amp; Social Justice Advocacy (Remote)
                </p>
                <p className="text-[11px] mt-1 font-medium uppercase tracking-[0.16em]" style={{ color: "rgba(129,140,248,0.9)" }}>
                  Design · Writing · Global collaboration
                </p>
              </div>
            </div>
            <p className="text-xs" style={{ color: "rgba(226,232,240,0.8)" }}>
              Remote internship with NexaYouth (Washington DC), a youth organisation focused on climate and social justice advocacy.
            </p>
            <ul className="space-y-1.5 text-xs" style={{ color: "rgba(148,163,184,0.95)" }}>
              <li>• Met weekly with an international team to discuss social and climate issues, including emerging and trending topics.</li>
              <li>• Led grassroots activities such as campaign assets (PFAs, deforestation flyers, social tiles) and weekly article drafts on global climate and justice themes.</li>
              <li>• Had one article selected and published on NexaYouth&apos;s site; iterated on messaging and visuals across time zones.</li>
            </ul>
          </div>

          {/* IOU Accra Student Committee */}
          <div
            className="glass-card rounded-2xl p-4 flex flex-col gap-3"
            style={{ borderColor: "rgba(96,165,250,0.5)" }}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#fff", fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.01em" }}
                >
                  IOU Accra Student Committee — Training &amp; Outreach
                </p>
                <p className="text-[11px] mt-1 font-medium uppercase tracking-[0.16em]" style={{ color: "rgba(191,219,254,0.9)" }}>
                  Mentoring · Training · Systems
                </p>
              </div>
            </div>
            <p className="text-xs" style={{ color: "rgba(226,232,240,0.8)" }}>
              Part of the Accra Student Committee for a global online university, supporting students and leading
              outreach to less‑resourced schools.
            </p>
            <ul className="space-y-1.5 text-xs" style={{ color: "rgba(148,163,184,0.95)" }}>
              <li>• Delivered sessions for high‑school students on education pathways and career planning through outreach programs to less‑resourced schools.</li>
              <li>• Ran Google Workspace trainings (Docs, Sheets, Drive, Meet) for the Accra student base.</li>
              <li>• Built project‑tracking sheets and contributed to reports summarising local chapter initiatives.</li>
            </ul>
          </div>

          {/* Ramadan Kitchen */}
          <div
            className="glass-card rounded-2xl p-4 flex flex-col gap-3"
            style={{ borderColor: "rgba(248,113,113,0.6)" }}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#fff", fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.01em" }}
                >
                  Ramadan Kitchen — Food Security &amp; Field Operations
                </p>
                <p className="text-[11px] mt-1 font-medium uppercase tracking-[0.16em]" style={{ color: "rgba(248,250,252,0.9)" }}>
                  Operations · Data · Storytelling
                </p>
              </div>
            </div>
            <p className="text-xs" style={{ color: "rgba(226,232,240,0.8)" }}>
              Field‑kitchen initiative (Feb–Mar 2026) built for Ramadan, focused on transparent, tech‑forward food
              distribution from kitchen to campuses.
            </p>
            <ul className="space-y-1.5 text-xs" style={{ color: "rgba(148,163,184,0.95)" }}>
              <li>• Helped design the model for sourcing, prepping and delivering meals to campuses, with clear routes and responsibilities.</li>
              <li>• Built Google Sheets dashboards to track meals, campuses reached and nightly runs, keeping donors and volunteers informed at a high level.</li>
              <li>• Kept a movement journal and visual records that connected numbers (meals, routes, funds) to real people and decisions on the ground.</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer
        className="px-6 py-12 max-w-6xl mx-auto"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-start justify-between flex-wrap gap-8">
          <div>
            <p
              className="text-xl font-bold mb-2"
              style={{
                color: "#fff",
                fontFamily: "var(--font-space-grotesk)",
                letterSpacing: "-0.02em",
              }}
            >
              Let&apos;s build something together.
            </p>
            <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Open to analyst and engineering roles, freelance projects, contracts, and investment opportunities.
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              Based in Accra · Open to global roles (remote or on‑site)
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <a
                href="mailto:aadamsays@gmail.com?subject=Hi%20Aadam%20%E2%80%94%20Let%E2%80%99s%20Work%20Together&body=Hi%20Aadam%2C%0A%0A"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "#7C6AFA", color: "#fff" }}
              >
                aadamsays@gmail.com
              </a>
              <a
                href="https://github.com/aadam-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/aadamsays"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(124,106,250,0.4)",
                }}
              >
                LinkedIn
              </a>
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              +233 559 602 056 · UTC+0 (flexible hours)
            </p>
          </div>
        </div>
      </footer>

      {/* ── Project preview modal ─────────────────────────────────── */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </main>
  );
}
