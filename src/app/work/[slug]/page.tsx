import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { findProject, projects, projectSlug, localizedProject } from "@/lib/projects";
import CaseStudy from "./CaseStudy";

interface Params {
  slug: string;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: projectSlug(p) }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const p = findProject(slug);
  if (!p) return {};

  const locale = await getLocale();
  const loc = localizedProject(p, locale);
  const title = `${p.name} · ${loc.tagline}`;
  const description = loc.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: p.imagePath ? [{ url: p.imagePath }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: p.imagePath ? [p.imagePath] : undefined,
    },
  };
}

export default async function WorkPage(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  // Next and prev for bottom nav
  const i = projects.findIndex((p) => projectSlug(p) === slug);
  const next = projects[(i + 1) % projects.length];

  return <CaseStudy project={project} next={next} />;
}
