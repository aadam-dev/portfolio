"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { Project, projectSlug } from "@/lib/projects";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import ScrollProgress from "@/components/site/ScrollProgress";
import BrowserMockup from "@/components/BrowserMockup";
import PreviewRouter from "@/components/previews/PreviewRouter";
import ScaledIframe from "@/components/ui/ScaledIframe";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";

type Mode = "simulated" | "live";

interface Props {
  project: Project;
  next: Project;
}

function buildLiveUrl(project: Project, screenId: string): string {
  const base = project.liveBaseUrl?.replace(/\/$/, "") ?? "";
  const path = project.liveScreenPaths?.[screenId] ?? "/";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function CaseStudy({ project, next }: Props) {
  const [screen, setScreen] = useState(project.screens[0]?.id ?? "landing");
  const [mode, setMode] = useState<Mode>("simulated");

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="main" className="relative pt-24 md:pt-28">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section
          className="relative px-4 md:px-6 pb-10 md:pb-16"
          aria-labelledby="case-heading"
        >
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: "min(900px, 100vw)",
              height: "500px",
              background: `radial-gradient(ellipse at center, ${project.accentGlow} 0%, transparent 60%)`,
              filter: "blur(40px)",
              zIndex: 0,
            }}
          />

          <div className="relative z-10 max-w-[1280px] mx-auto">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-[13px] text-[var(--ink-3)] hover:text-white transition-colors mb-8 md:mb-10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Selected work
            </Link>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-[0.18em]"
                style={{
                  background: `${project.accentColor}18`,
                  border: `1px solid ${project.accentColor}40`,
                  color: project.accentColor,
                }}
              >
                {project.categoryLabel}
              </span>
              {project.isLead && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] border border-[var(--line-strong)] text-[var(--ink-2)]">
                  SRS Lead
                </span>
              )}
              {project.year && (
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-4)]">
                  {project.year}
                </span>
              )}
              {project.location && (
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-4)]">
                  · {project.location}
                </span>
              )}
            </div>

            <h1
              id="case-heading"
              className="font-display text-white text-balance"
              style={{
                fontSize: "clamp(2.5rem, 9vw, 7.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.035em",
              }}
            >
              {project.name}
            </h1>
            <p
              className="mt-4 md:mt-6 font-display italic text-[var(--ink-2)] text-balance"
              style={{
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                letterSpacing: "-0.015em",
              }}
            >
              {project.tagline}
            </p>
          </div>
        </section>

        {/* ── Preview ─────────────────────────────────────── */}
        <section className="relative px-4 md:px-6" aria-label="Project preview">
          <div className="max-w-[1280px] mx-auto">
            {/* Mode toggle */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              {project.liveBaseUrl ? (
                <div
                  className="inline-flex p-1 rounded-full border border-[var(--line)]"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                  role="tablist"
                  aria-label="Preview mode"
                >
                  <ToggleBtn
                    active={mode === "simulated"}
                    onClick={() => setMode("simulated")}
                  >
                    Simulated
                  </ToggleBtn>
                  <ToggleBtn
                    active={mode === "live"}
                    onClick={() => setMode("live")}
                  >
                    Live site
                  </ToggleBtn>
                </div>
              ) : (
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-4)]">
                  Simulated preview
                </span>
              )}

              {mode === "live" && project.liveBaseUrl && (
                <a
                  href={buildLiveUrl(project, screen)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-3)] hover:text-white transition-colors"
                >
                  Open in new tab
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <Reveal>
              <div className="w-full">
                <AnimatePresence mode="wait">
                  {mode === "live" && project.liveBaseUrl ? (
                    <motion.div
                      key="live"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-2xl overflow-hidden border border-[var(--line)]"
                    >
                      <BrowserMockup
                        project={project}
                        activeScreen={screen}
                        onScreenChange={setScreen}
                        compact
                      >
                        <ScaledIframe
                          src={buildLiveUrl(project, screen)}
                          title={`${project.name} · live preview`}
                        />
                      </BrowserMockup>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sim"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-2xl overflow-hidden border border-[var(--line)]"
                    >
                      <BrowserMockup
                        project={project}
                        activeScreen={screen}
                        onScreenChange={setScreen}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={screen}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.18 }}
                          >
                            <PreviewRouter
                              projectId={project.id}
                              screen={screen}
                            />
                          </motion.div>
                        </AnimatePresence>
                      </BrowserMockup>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Narrative ───────────────────────────────────── */}
        <section className="relative px-4 md:px-6 pt-20 md:pt-28 pb-10 md:pb-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
            <div className="md:col-span-7">
              <Reveal>
                <p className="eyebrow mb-4">Overview</p>
                <p
                  className="font-display text-white text-balance"
                  style={{
                    fontSize: "clamp(1.4rem, 2.6vw, 2rem)",
                    lineHeight: 1.3,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {project.description}
                </p>
              </Reveal>

              {project.impact && project.impact.length > 0 && (
                <Reveal delay={0.1}>
                  <div className="mt-12 md:mt-16">
                    <p className="eyebrow mb-5">What this proves</p>
                    <ul className="space-y-4">
                      {project.impact.map((pt, i) => (
                        <li
                          key={pt}
                          className="flex gap-4 border-t border-[var(--line)] pt-4"
                        >
                          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-4)] pt-1 shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <p className="text-[15px] md:text-[17px] leading-relaxed text-[var(--ink-2)] text-pretty">
                            {pt}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>

            <aside className="md:col-span-5 md:sticky md:top-28 self-start space-y-8">
              {project.role && (
                <Reveal>
                  <p className="eyebrow mb-2">Role</p>
                  <p className="text-[15px] text-white">{project.role}</p>
                </Reveal>
              )}

              {project.services && project.services.length > 0 && (
                <Reveal delay={0.05}>
                  <p className="eyebrow mb-2">Services</p>
                  <ul className="space-y-1.5">
                    {project.services.map((s) => (
                      <li key={s} className="text-[14px] text-[var(--ink-2)]">
                        {s}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              <Reveal delay={0.1}>
                <p className="eyebrow mb-3">Stack</p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full font-mono text-[11px] uppercase tracking-[0.14em] border border-[var(--line-strong)] text-[var(--ink-2)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>

              {project.outcomes && project.outcomes.length > 0 && (
                <Reveal delay={0.15}>
                  <p className="eyebrow mb-3">Outcomes</p>
                  <dl className="grid grid-cols-2 gap-4">
                    {project.outcomes.map((o) => (
                      <div
                        key={o.label}
                        className="rounded-xl p-4 border border-[var(--line)]"
                        style={{ background: "rgba(255,255,255,0.015)" }}
                      >
                        <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-4)]">
                          {o.label}
                        </dt>
                        <dd
                          className="mt-1 font-display text-white"
                          style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}
                        >
                          {o.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              )}

              {project.liveBaseUrl && (
                <Reveal delay={0.2}>
                  <MagneticButton
                    href={project.liveBaseUrl}
                    external
                    variant="secondary"
                  >
                    Visit the live site
                    <ArrowUpRight className="w-4 h-4" />
                  </MagneticButton>
                </Reveal>
              )}
            </aside>
          </div>
        </section>

        {/* ── Next project ────────────────────────────────── */}
        <section className="relative px-4 md:px-6 pt-20 md:pt-28 pb-16 md:pb-24 border-t border-[var(--line)] mt-10">
          <div className="max-w-[1280px] mx-auto">
            <p className="eyebrow mb-5">Next project</p>
            <Link
              href={`/work/${projectSlug(next)}`}
              className="group block"
              aria-label={`Next project: ${next.name}`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3
                  className="font-display text-white text-balance"
                  style={{
                    fontSize: "clamp(2.5rem, 8vw, 6rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.03em",
                  }}
                >
                  <span className="transition-transform duration-500 inline-block group-hover:translate-x-3">
                    {next.name}
                  </span>
                </h3>
                <ArrowUpRight className="w-10 h-10 md:w-16 md:h-16 text-[var(--ink-3)] group-hover:text-white transition-all group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <p className="mt-3 text-[14px] md:text-[15px] text-[var(--ink-3)]">
                {next.tagline}
              </p>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className="px-4 py-1.5 rounded-full text-[12px] font-mono uppercase tracking-[0.14em] transition-colors"
      style={{
        background: active ? "#fff" : "transparent",
        color: active ? "#000" : "var(--ink-3)",
      }}
    >
      {children}
    </button>
  );
}
