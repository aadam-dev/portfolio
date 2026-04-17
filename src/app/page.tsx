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
      <section className="relative pt-24 pb-24 px-6 max-w-6xl mx-auto min-h-[85vh] flex flex-col justify-center">
        {/* Abstract glowing sphere behind text */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle at center, rgba(124,106,250,0.12) 0%, transparent 60%)",
            filter: "blur(60px)",
            zIndex: 0
          }}
        />

        <motion.div
          className="relative z-10 w-full flex flex-col items-center text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Status pill — pulsing dot */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8, y: 20 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-12 backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.7)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#4ade80" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "#4ade80", boxShadow: "0 0 10px #4ade80" }}
              />
            </span>
            Available for new projects · Global
          </motion.div>

          {/* Massive Typography */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="font-bold leading-[0.95] tracking-tighter w-full"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "#fff",
              fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
            }}
          >
            Designing tools that
            <br />
            <span 
              className="px-2 pb-1 relative inline-block"
              style={{
                textShadow: "0 0 80px rgba(124,106,250,0.4)",
              }}
            >
              <span className="text-gradient">make businesses work.</span>
              {/* Subtle underline stroke */}
              <motion.span 
                className="absolute bottom-1 left-0 w-full h-[6px] rounded-full"
                style={{ background: "linear-gradient(90deg, #7C6AFA 0%, #06B6D4 100%)" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="text-lg md:text-xl mt-12 mb-16 max-w-2xl leading-relaxed"
            style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400 }}
          >
            Multi-disciplinary professional at the intersection of investment analysis,
            data strategy, and high-performance software engineering.
          </motion.p>

          {/* Quick stats — count-up in a sleek row */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="flex flex-wrap items-center justify-center gap-12 sm:gap-20"
          >
            {[
              ["50+", "SMEs Evaluated"],
              ["20+", "Products Shipped"],
              ["4+", "Years Experience"],
              ["GHS 40K+", "Funds Raised"],
            ].map(([val, label]) => (
              <div key={label} className="flex flex-col items-center">
                <AnimatedStat value={val} label={""} />
                <div className="text-[10px] uppercase tracking-[0.2em] mt-2 font-bold opacity-40">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="px-6 max-w-6xl mx-auto">
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* ── Projects section ─────────────────────────────────────── */}
      <motion.section
        ref={projectsRef}
        initial={{ opacity: 0, y: 40 }}
        animate={projectsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 pt-16 pb-24 max-w-6xl mx-auto"
      >
        {/* Header + filters */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                color: "#fff",
                fontFamily: "var(--font-space-grotesk)",
                letterSpacing: "-0.03em",
                lineHeight: 1
              }}
            >
              Selected Work.
            </h2>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.4)" }}>
              A curated selection from over 70+ premium digital products spanning EdTech, FinTech, and Enterprise ecosystems. Explore a legacy of high-performance deployments through interactive previews.
            </p>
          </div>

          {/* Category filters */}
          <div className="flex gap-2.5 flex-wrap justify-start md:justify-end">
            {CATEGORIES.filter(
              (c) => c.value === "all" || projects.some((p) => p.category === c.value)
            ).map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                style={{
                  background:
                    activeCategory === cat.value
                      ? "rgba(124,106,250,0.15)"
                      : "rgba(255,255,255,0.02)",
                  border:
                    activeCategory === cat.value
                      ? "1px solid rgba(124,106,250,0.4)"
                      : "1px solid rgba(255,255,255,0.05)",
                  color:
                    activeCategory === cat.value
                      ? "#fff"
                      : "rgba(255,255,255,0.4)",
                  boxShadow: activeCategory === cat.value ? "0 4px 20px rgba(124,106,250,0.2)" : "none"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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
        initial={{ opacity: 0, y: 40 }}
        animate={impactInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 pb-24 max-w-6xl mx-auto"
      >
        <div className="mb-12 max-w-xl">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              color: "#fff",
              fontFamily: "var(--font-space-grotesk)",
              letterSpacing: "-0.03em",
              lineHeight: 1
            }}
          >
            Impact &amp; Leadership.
          </h2>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.4)" }}>
            Selected global fellowships and community-centric operations where I led analysis, strategy, and engineering.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
          {/* Fellowship 1 - Span 1 column */}
          <div
            className="glass-card rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative"
            style={{
              background: "rgba(10,10,14,0.6)",
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-indigo-400">
                Fellowship
              </div>
              <h3
                className="text-xl font-bold leading-tight mb-2 text-white"
                style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
              >
                Aspire Leaders Program<br/>Cohort 4, 2025
              </h3>
            </div>
            <p className="text-sm text-white/50 relative z-10 mt-4 leading-relaxed">
              Harvard‑affiliated global leadership fellowship. Selected for faculty‑led modules in ethical leadership and international collaboration.
            </p>
          </div>

          {/* Special Case Study: Madina Basketball - Span 2 columns */}
          <div
            className="glass-card rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative md:col-span-2"
            style={{ borderColor: "rgba(234,179,8,0.2)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start justify-between">
              <div className="flex-1">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-yellow-500">
                  Project Management · Data · Engineering
                </div>
                <h3
                  className="text-2xl font-bold leading-tight mb-3 text-white"
                  style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
                >
                  Madina Basketball<br/>Community Hub &amp; Data Transparency
                </h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-lg mb-6">
                  Co‑led the transformation of an inactive court in Libya Quarters into a solar‑powered basketball hub. Engineered Google Sheets dashboards to track donations and activities, ensuring absolute transparency.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://madinabball.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "rgba(234,179,8,0.15)",
                      border: "1px solid rgba(234,179,8,0.4)",
                      color: "#facc15",
                    }}
                  >
                    View Live Site
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Fellowship 2 */}
          <div
            className="glass-card rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative"
            style={{
              background: "rgba(10,10,14,0.6)",
              borderColor: "rgba(124,106,250,0.3)",
            }}
          >
             <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-[#7C6AFA]">
                Fellowship
              </div>
              <h3
                className="text-xl font-bold leading-tight mb-2 text-white"
                style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
              >
                AI‑Integrated Leadership Program (AILP), 2026
              </h3>
            </div>
            <p className="text-sm text-white/50 relative z-10 mt-4 leading-relaxed">
              Continuing fellow at Aspire Institute&apos;s AI‑Integrated Leadership Program, applying complex AI tools to emerging market challenges.
            </p>
          </div>

          {/* Small Bento items */}
          <div className="glass-card rounded-3xl p-8 flex flex-col group overflow-hidden relative" style={{ borderColor: "rgba(59,130,246,0.2)" }}>
             <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-blue-400 relative z-10">
              NexaYouth
            </div>
            <h3 className="text-lg font-bold text-white mb-2 relative z-10" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Climate &amp; Social Justice Advocacy
            </h3>
            <p className="text-xs text-white/50 relative z-10">
              Remote internship (Washington DC). Led global grassroots article drafting and campaign activities across time zones.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 flex flex-col group overflow-hidden relative" style={{ borderColor: "rgba(248,113,113,0.2)" }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-red-400 relative z-10">
              Ramadan Kitchen
            </div>
            <h3 className="text-lg font-bold text-white mb-2 relative z-10" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Food Security Ops
            </h3>
            <p className="text-xs text-white/50 relative z-10">
              Tech-forward food distribution. Built transparent delivery dashboards and tracking logistics for nightly campus runs.
            </p>
          </div>
        </div>

      </motion.section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="relative w-full overflow-hidden" style={{ background: "#020202", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Glow behind footer */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "100%",
            height: "400px",
            background: "radial-gradient(ellipse at bottom, rgba(124,106,250,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: 0
          }}
        />

        <div className="px-6 py-24 max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
            Ready to scale?
          </p>
          <a
            href="mailto:aadamsays@gmail.com?subject=Hi%20Aadam%20%E2%80%94%20Let%E2%80%99s%20Work%20Together"
            className="group block"
          >
            <h2
              className="text-5xl md:text-8xl font-bold mb-8 transition-transform duration-500 group-hover:scale-105"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                letterSpacing: "-0.04em",
                color: "#fff",
                lineHeight: 0.9,
              }}
            >
              Let&apos;s build
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400" style={{ textShadow: "0 0 40px rgba(124,106,250,0.3)" }}>
                something together.
              </span>
            </h2>
          </a>
          
          <p className="text-base md:text-lg max-w-xl mx-auto mb-12" style={{ color: "rgba(255,255,255,0.4)" }}>
            Open to analyst and engineering roles, freelance projects, contracts, and strategic investment opportunities globally.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <a
              href="mailto:aadamsays@gmail.com"
              className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(124,106,250,0.2)] hover:shadow-[0_0_60px_rgba(124,106,250,0.4)]"
              style={{ background: "#7C6AFA", color: "#fff" }}
            >
              Get in Touch
            </a>
            <a
              href="https://github.com/aadam-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/aadamsays"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              LinkedIn
            </a>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center justify-between pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="w-2 h-2 rounded-full absolute" style={{ background: "#4ade80", boxShadow: "0 0 10px #4ade80" }}></span>
              <span className="w-2 h-2 rounded-full absolute animate-ping" style={{ background: "#4ade80" }}></span>
              <span className="text-[10px] uppercase font-bold tracking-widest pl-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                Based in Accra, Available Globally
              </span>
            </div>
            
            <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
              +233 559 602 056 · UTC+0
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
