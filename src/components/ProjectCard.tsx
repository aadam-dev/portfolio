"use client";

import { motion } from "framer-motion";
import { Project } from "@/lib/projects";

interface Props {
  project: Project;
  index: number;
  onClick: () => void;
}

export default function ProjectCard({ project, index, onClick }: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="text-left w-full glass-card rounded-2xl overflow-hidden group"
      whileHover={{ y: -4 }}
      style={{ outline: "none" }}
    >
      {/* Preview area */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 180,
          background: `radial-gradient(ellipse at 50% 0%, ${project.accentGlow}, transparent 70%), #0C0C18`,
        }}
      >
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Category badge top-right */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: `${project.accentColor}18`,
            border: `1px solid ${project.accentColor}30`,
            color: project.accentColor,
          }}
        >
          {project.categoryLabel}
        </div>

        {/* Lead badge */}
        {project.isLead && (
          <div
            className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-semibold"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.4)",
              fontSize: 10,
            }}
          >
            SRS Lead
          </div>
        )}

        {/* Accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5"
          style={{ background: project.accentColor }}
          initial={{ width: "0%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Hover preview hint */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              background: project.accentColor,
              color: "#fff",
              boxShadow: `0 4px 20px ${project.accentGlow}`,
            }}
          >
            <span className="text-base">▶</span>
            Open Preview
          </div>
        </div>

        {/* Screen count indicator */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {project.screens.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === 0 ? 16 : 4,
                height: 4,
                borderRadius: 2,
                background: i === 0 ? project.accentColor : "rgba(255,255,255,0.15)",
                transition: "width 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="text-base font-bold mb-1 leading-tight"
          style={{
            color: "#fff",
            fontFamily: "var(--font-space-grotesk)",
            letterSpacing: "-0.02em",
          }}
        >
          {project.name}
        </h3>
        <p className="text-xs font-medium mb-3" style={{ color: project.accentColor }}>
          {project.tagline}
        </p>
        <p
          className="text-xs leading-relaxed mb-4 line-clamp-2"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {project.description}
        </p>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              +{project.stack.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
