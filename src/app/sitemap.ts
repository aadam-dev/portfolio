import type { MetadataRoute } from "next";
import { projects, projectSlug } from "@/lib/projects";

const BASE = "https://aadam.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
  ];

  const workEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/work/${projectSlug(p)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...workEntries];
}
