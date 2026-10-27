import { findProject, projectSlug } from "@/lib/projects";

export const MODES = [
  { id: "counter", key: "POS", label: "Counter", sub: "Point of sale & ops" },
  { id: "laundry", key: "WSH", label: "Laundry", sub: "Service workflow" },
  { id: "atelier", key: "ATL", label: "Atelier", sub: "Fashion commerce" },
  { id: "analyst", key: "FIN", label: "Analyst desk", sub: "Finance models" },
  { id: "ledger", key: "ERP", label: "Ledger", sub: "ERP, Odoo & data" },
  { id: "court", key: "CRT", label: "Court", sub: "Sports & community data" },
  { id: "classroom", key: "EDU", label: "Classroom", sub: "Edtech & platforms" },
  { id: "build", key: "BLD", label: "Build desk", sub: "Hire or build" },
] as const;

export type ModeId = (typeof MODES)[number]["id"];
export const modeIndex = (id: ModeId) => MODES.findIndex((m) => m.id === id);

export interface ChapterProject {
  slug: string;
  /** Optional display name, when the chapter refers to part of a project. */
  label?: string;
  hash?: string;
}

export interface Chapter {
  /** i18n key under fieldkit.chapters */
  id: string;
  n: string;
  mode: ModeId;
  metrics: { value: string; key: string }[];
  projects: ChapterProject[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: "c01",
    n: "01",
    mode: "counter",
    metrics: [
      { value: "450+", key: "m1" },
      { value: "4", key: "m2" },
      { value: "20+", key: "m3" },
    ],
    projects: [
      { slug: "al-boyut" },
      { slug: "primetijara" },
      { slug: "jireh" },
      { slug: "anisfoods" },
      { slug: "makossa" },
      { slug: "redrow" },
    ],
  },
  {
    id: "c02",
    n: "02",
    mode: "laundry",
    metrics: [
      { value: "5", key: "m1" },
      { value: "1", key: "m2" },
      { value: "SMS", key: "m3" },
    ],
    projects: [{ slug: "al-boyut", label: "An-Nur Laundry", hash: "walkthrough" }],
  },
  {
    id: "c03",
    n: "03",
    mode: "atelier",
    metrics: [
      { value: "2", key: "m1" },
      { value: "3", key: "m2" },
      { value: "1", key: "m3" },
    ],
    projects: [{ slug: "munamuse" }, { slug: "zainas" }, { slug: "chalesocks" }, { slug: "gaskiya" }],
  },
  {
    id: "c04",
    n: "04",
    mode: "analyst",
    metrics: [
      { value: "50+", key: "m1" },
      { value: "5", key: "m2" },
      { value: "4", key: "m3" },
    ],
    projects: [{ slug: "ethika" }, { slug: "ladyangel" }, { slug: "siif" }],
  },
  {
    id: "c05",
    n: "05",
    mode: "ledger",
    metrics: [
      { value: "130+", key: "m1" },
      { value: "59", key: "m2" },
      { value: "3", key: "m3" },
    ],
    projects: [
      { slug: "enterprise-erp" },
      { slug: "anisfoods" },
      { slug: "jireh" },
      { slug: "primetijara" },
    ],
  },
  {
    id: "c06",
    n: "06",
    mode: "court",
    metrics: [
      { value: "GHS 40K+", key: "m1" },
      { value: "1", key: "m2" },
      { value: "2", key: "m3" },
    ],
    projects: [{ slug: "madinabasketball" }],
  },
  {
    id: "c07",
    n: "07",
    mode: "classroom",
    metrics: [
      { value: "7", key: "m1" },
      { value: "3", key: "m2" },
      { value: "40+", key: "m3" },
    ],
    projects: [
      { slug: "koyi" },
      { slug: "rentcheck" },
      { slug: "lenus" },
      { slug: "rockmotion" },
      { slug: "pronaj" },
      { slug: "thepalms" },
      { slug: "magilo" },
    ],
  },
];

/** Resolve chapter project refs to listed projects (hidden ones drop out). */
export function chapterProjects(c: Chapter) {
  return c.projects.flatMap((ref) => {
    const p = findProject(ref.slug);
    if (!p || p.hidden) return [];
    return [
      {
        name: ref.label ?? p.name,
        href: `/work/${projectSlug(p)}${ref.hash ? `#${ref.hash}` : ""}`,
        image: p.imagePath,
        accent: p.accentColor,
        project: p,
      },
    ];
  });
}
