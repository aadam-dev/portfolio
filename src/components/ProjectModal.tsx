"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ChevronRight } from "lucide-react";
import { Project } from "@/lib/projects";
import BrowserMockup from "./BrowserMockup";
import PreviewRouter from "./previews/PreviewRouter";

type ViewMode = "simulated" | "live";

interface Props {
  project: Project | null;
  onClose: () => void;
}

function getLiveUrl(project: Project, screenId: string): string {
  const base = project.liveBaseUrl?.replace(/\/$/, "") ?? "";
  const path = project.liveScreenPaths?.[screenId] ?? "/";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function ProjectModal({ project, onClose }: Props) {
  const [activeScreen, setActiveScreen] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("simulated");

  useEffect(() => {
    if (project) {
      setActiveScreen(project.screens[0].id);
      setViewMode("simulated");
    }
  }, [project]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
            className="fixed inset-4 md:inset-8 z-50 flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden"
            style={{
              background: "#08080C",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `0 32px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left panel — project info */}
            <div
              className="flex flex-col flex-shrink-0 w-full md:w-[320px] 2xl:w-[380px] h-full overflow-y-auto"
              style={{
                padding: "32px",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                background: "linear-gradient(180deg, #0A0A14 0%, #05050A 100%)",
              }}
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="self-end mb-8 p-2 rounded-full transition-all hover:scale-110 hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Category badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 self-start"
                style={{
                  background: `${project.accentColor}15`,
                  border: `1px solid ${project.accentColor}30`,
                  color: project.accentColor,
                }}
              >
                {project.categoryLabel}
                {project.isLead && (
                  <span className="ml-1 opacity-60 text-[10px]">· SRS Lead</span>
                )}
              </div>

              {/* Name */}
              <h2
                className="text-2xl font-bold mb-2 leading-tight"
                style={{ color: "#fff", fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
              >
                {project.name}
              </h2>
              <p className="text-sm font-medium mb-4" style={{ color: project.accentColor }}>
                {project.tagline}
              </p>

              {/* Divider */}
              <div className="mb-4" style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

              {/* Description */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                {project.description}
              </p>

              {/* Role & impact */}
              {(project.role || project.impact) && (
                <div className="mb-6">
                  {project.role && (
                    <p
                      className="text-xs font-semibold mb-2 tracking-widest"
                      style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}
                    >
                      ROLE
                    </p>
                  )}
                  {project.role && (
                    <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {project.role}
                    </p>
                  )}
                  {project.impact && project.impact.length > 0 && (
                    <>
                      <p
                        className="text-xs font-semibold mb-2 tracking-widest"
                        style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}
                      >
                        WHAT THIS PROJECT PROVES
                      </p>
                      <ul className="space-y-1.5">
                        {project.impact.map((point) => (
                          <li
                            key={point}
                            className="text-xs"
                            style={{ color: "rgba(255,255,255,0.6)" }}
                          >
                            • {point}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {/* Stack */}
              <p
                className="text-xs font-semibold mb-3 tracking-widest"
                style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}
              >
                STACK
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1 rounded-md font-medium"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Screens nav */}
              <p
                className="text-xs font-semibold mb-3 tracking-widest"
                style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}
              >
                PREVIEW SCREENS
              </p>
              <div className="flex flex-col gap-1">
                {project.screens.map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => setActiveScreen(screen.id)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-left transition-all duration-200"
                    style={{
                      background:
                        activeScreen === screen.id
                          ? `${project.accentColor}15`
                          : "transparent",
                      color:
                        activeScreen === screen.id
                          ? project.accentColor
                          : "rgba(255,255,255,0.45)",
                      border:
                        activeScreen === screen.id
                          ? `1px solid ${project.accentColor}30`
                          : "1px solid transparent",
                    }}
                  >
                    {screen.label}
                    {activeScreen === screen.id && (
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </button>
                ))}
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Footer */}
              <div
                className="mt-6 pt-4 text-xs"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)" }}
              >
                Use the tabs to switch screens; toggle &quot;Live site&quot; to open the real project.
              </div>
            </div>

            {/* Right panel — live site iframe or simulated preview */}
            <div className="flex-1 flex flex-col p-4 min-w-0 min-h-0">
              {project.liveBaseUrl && (
                <div
                  className="flex-shrink-0 flex gap-1 mb-3"
                  style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, width: "fit-content" }}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("simulated")}
                    className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                    style={{
                      background: viewMode === "simulated" ? "rgba(255,255,255,0.08)" : "transparent",
                      color: viewMode === "simulated" ? "#fff" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    Simulated preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("live")}
                    className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                    style={{
                      background: viewMode === "live" ? project.accentColor : "transparent",
                      color: viewMode === "live" ? "#fff" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    Live site
                  </button>
                </div>
              )}

              {viewMode === "live" && project.liveBaseUrl ? (
                <div className="flex-1 flex flex-col min-h-0 rounded-xl overflow-hidden border border-white/10">
                  <iframe
                    key={getLiveUrl(project, activeScreen)}
                    src={getLiveUrl(project, activeScreen)}
                    title={`${project.name} — live`}
                    className="flex-1 w-full min-h-[400px] bg-white"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    className="flex-shrink-0 flex items-center justify-between gap-2 px-3 py-2 text-xs"
                    style={{ background: "#0A0A14", borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
                  >
                    <span>Exact project — real homepages, logos &amp; media.</span>
                    <a
                      href={getLiveUrl(project, activeScreen)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium transition-colors hover:text-white"
                      style={{ color: project.accentColor }}
                    >
                      Open in new tab <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <BrowserMockup
                  project={project}
                  activeScreen={activeScreen}
                  onScreenChange={setActiveScreen}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeScreen}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="min-h-full"
                    >
                      <PreviewRouter projectId={project.id} screen={activeScreen} />
                    </motion.div>
                  </AnimatePresence>
                </BrowserMockup>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
