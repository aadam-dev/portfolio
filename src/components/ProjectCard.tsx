"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/lib/projects";

interface Props {
  project: Project;
  index: number;
  onClick: () => void;
}

export default function ProjectCard({ project, index, onClick }: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="text-left w-full glass-card rounded-2xl overflow-hidden group relative"
      whileHover={{ y: -8, scale: 1.01 }}
      style={{ outline: "none" }}
    >
      {/* Background ambient glow matching accent */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${project.accentColor}, transparent 80%)` 
        }} 
      />

      {/* Preview area */}
      <div
        className="relative overflow-hidden border-b border-white/5 flex items-center justify-center"
        style={{ height: 220, background: "linear-gradient(180deg, #0A0A10 0%, #050505 100%)" }}
      >
        {/* Abstract organic gradient mesh backdrop */}
        <div 
          className="absolute inset-0 transition-opacity duration-700 opacity-60 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 50% -20%, ${project.accentGlow}, transparent 75%),
                         radial-gradient(ellipse at 80% 120%, ${project.accentGlow}, transparent 65%)`
          }}
        />

        {/* Project Image or Fallback */}
        {project.imagePath ? (
          <Image
            src={project.imagePath}
            alt={project.name}
            fill
            className="object-cover z-10 transition-transform duration-[1500ms] group-hover:scale-110 opacity-70 group-hover:opacity-100"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={90}
          />
        ) : (
          <div 
            className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-4xl shadow-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${project.accentColor}40`,
              color: "#fff",
              fontFamily: "var(--font-space-grotesk)",
              textShadow: `0 0 20px ${project.accentColor}`,
              boxShadow: `inset 0 0 20px ${project.accentColor}20, 0 10px 40px ${project.accentColor}30`,
              backdropFilter: "blur(10px)"
            }}
          >
            {project.name.charAt(0)}
          </div>
        )}

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
            WebkitMaskImage: "-webkit-linear-gradient(top, black 30%, transparent 100%)"
          }}
        />

        {/* Category badge top-right */}
        <div
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-md"
          style={{
            background: `rgba(0, 0, 0, 0.4)`,
            border: `1px solid ${project.accentColor}40`,
            color: project.accentColor,
            boxShadow: `0 4px 20px ${project.accentGlow}`
          }}
        >
          {project.categoryLabel}
        </div>

        {/* Lead badge */}
        {project.isLead && (
          <div
            className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Lead
          </div>
        )}

        {/* Hover overlay hint */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide mt-12"
            style={{
              background: project.accentColor,
              color: "#000",
              boxShadow: `0 8px 32px ${project.accentGlow}`,
            }}
          >
            Explore Case Study
          </motion.div>
        </div>

        {/* Screen count indicator */}
        <div className="absolute bottom-4 left-4 flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity z-10">
          {project.screens.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === 0 ? 12 : 4,
                height: 4,
                borderRadius: 2,
                background: i === 0 ? project.accentColor : "rgba(255,255,255,0.2)",
                transition: "width 0.4s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        <h3
          className="text-lg font-bold mb-1.5 leading-tight group-hover:text-white transition-colors"
          style={{
            color: "#F8F8FF",
            fontFamily: "var(--font-space-grotesk)",
            letterSpacing: "-0.02em",
          }}
        >
          {project.name}
        </h3>
        <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: project.accentColor }}>
          {project.tagline}
        </p>
        <p
          className="text-sm leading-relaxed mb-6 line-clamp-2"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {project.description}
        </p>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md transition-colors"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span
              className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
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
