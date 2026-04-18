"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Project, projectSlug } from "@/lib/projects";

interface Props {
  project: Project;
  index: number;
  /** When true, uses a larger "feature" layout (first card in the grid). */
  feature?: boolean;
  priority?: boolean;
}

export default function ProjectCard({ project, index, feature, priority }: Props) {
  const href = `/work/${projectSlug(project)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative ${feature ? "md:col-span-2" : ""}`}
    >
      <Link
        href={href}
        className="block focus:outline-none"
        aria-label={`${project.name} — ${project.tagline}`}
      >
        {/* Image / preview */}
        <div
          className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]"
          style={{
            aspectRatio: feature ? "16 / 9" : "4 / 3",
          }}
        >
          {project.imagePath ? (
            <Image
              src={project.imagePath}
              alt={project.name}
              fill
              priority={priority}
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              sizes={
                feature
                  ? "(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1200px"
                  : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
              }
              quality={90}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${project.accentGlow}, transparent 70%)`,
              }}
            >
              <span
                className="font-display text-white"
                style={{ fontSize: feature ? 180 : 120 }}
              >
                {project.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Overlay vignette */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,8,12,0) 40%, rgba(8,8,12,0.75) 100%)",
            }}
          />

          {/* Corner CTA */}
          <div
            aria-hidden="true"
            className="absolute right-3 top-3 md:right-4 md:top-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-90 transition-all duration-500 group-hover:bg-white group-hover:text-black group-hover:scale-110"
          >
            <ArrowUpRight className="w-4 h-4" />
          </div>

          {/* Index number */}
          <div
            aria-hidden="true"
            className="absolute left-3 top-3 md:left-4 md:top-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white/70 mix-blend-difference"
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Bottom meta band (always visible on mobile, fade-up on desktop) */}
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p
                className="font-mono text-[10px] tracking-[0.22em] uppercase"
                style={{ color: project.accentColor }}
              >
                {project.categoryLabel}
              </p>
            </div>
            {project.year && (
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60 whitespace-nowrap">
                {project.year}
              </span>
            )}
          </div>
        </div>

        {/* Title + meta */}
        <div className="mt-4 md:mt-5 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h3
              className="font-display text-white transition-colors"
              style={{
                fontSize: feature ? "clamp(1.75rem, 3.5vw, 2.5rem)" : "clamp(1.35rem, 2.2vw, 1.75rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              {project.name}
            </h3>
            <p className="mt-1 text-[13px] md:text-[14px] text-[var(--ink-3)] line-clamp-1">
              {project.tagline}
            </p>
          </div>
          {project.location && (
            <p className="hidden sm:block font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--ink-4)] whitespace-nowrap pt-2">
              {project.location}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
