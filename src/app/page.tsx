"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  { label: "Desktop", value: "desktop" },
  { label: "Creative", value: "creative" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredAll =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const filteredSelected = filteredAll.filter((p) => p.featured || p.isLead);

  return (
    <main className="min-h-screen grid-bg">
      {/* Header / Nav */}
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
              className="text-xs font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/aadamsays"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              LinkedIn
            </a>
            <a
              href="mailto:aadamsays@gmail.com"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
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

      {/* Hero */}
      <section className="relative pt-16 pb-16 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Status */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{
              background: "rgba(124,106,250,0.1)",
              border: "1px solid rgba(124,106,250,0.2)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80" }}
            />
            Available for new projects — Accra, Ghana · Remote
          </div>

          {/* Roles */}
          <div
            className="flex items-center gap-3 mb-5 text-xs font-medium flex-wrap"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {["Investment Analyst", "Full-Stack Developer", "Systems Builder"].map((role, i) => (
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
            Multi-disciplinary professional operating at the intersection of investment analysis,
            software engineering, and operations — with deep roots in Ghana&apos;s emerging market.
            Click any project to see it live.
          </p>

          {/* Quick stats */}
          <div className="flex gap-10 flex-wrap">
            {[
              ["50+", "SMEs Evaluated"],
              ["20+", "Products Shipped"],
              ["4+", "Years Experience"],
              ["GHS 40K+", "Community Funds Raised"],
            ].map(([val, label]) => (
              <div key={label}>
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: "#fff",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {val}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {label}
                </div>
              </div>
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

      {/* Projects section */}
      <section className="px-6 pt-10 pb-20 max-w-6xl mx-auto">
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
              Selected Work
            </h2>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              {filteredSelected.length} highlighted project
              {filteredSelected.length !== 1 ? "s" : ""} · Click to preview
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

        {/* Grid */}
        <motion.div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
          layout
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

        {/* Secondary list of additional work */}
        {filteredAll.length > filteredSelected.length && (
          <div className="mt-10">
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
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full transition-colors"
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
          </div>
        )}
      </section>

      {/* Footer */}
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
              Open to freelance projects, contracts, full-time roles, and investment opportunities.
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              Based in Accra, Ghana · Available Remotely
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <a
                href="mailto:aadamsays@gmail.com"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{ background: "#7C6AFA", color: "#fff" }}
              >
                aadamsays@gmail.com
              </a>
              <a
                href="https://github.com/aadam-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
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
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
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
              +233 559 602 056 · Accra, Ghana
            </p>
          </div>
        </div>
      </footer>

      {/* Project preview modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </main>
  );
}
