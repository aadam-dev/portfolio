"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ChevronRight } from "lucide-react";
import { Project } from "@/lib/projects";
import BrowserMockup from "./BrowserMockup";
import PreviewRouter from "./previews/PreviewRouter";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  const [activeScreen, setActiveScreen] = useState<string>("");

  useEffect(() => {
    if (project) {
      setActiveScreen(project.screens[0].id);
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
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-4 z-50 flex gap-5 rounded-2xl overflow-hidden"
            style={{
              background: "#0F0F1A",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left panel — project info */}
            <div
              className="flex flex-col flex-shrink-0"
              style={{
                width: 280,
                padding: "28px 24px",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                background: "#0A0A14",
              }}
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="self-end mb-6 p-1.5 rounded-lg transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}
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
                Interactive preview — not a live deployment
              </div>
            </div>

            {/* Right panel — browser mockup */}
            <div className="flex-1 p-4 min-w-0">
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
