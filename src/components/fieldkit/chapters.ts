/**
 * The deployments told on the home page. Copy lives in messages/*.json under
 * fieldkit.chapters.<mode>; metrics are taken from the project records in
 * src/lib/projects.ts, never invented here.
 */

export type ModeId = "counter" | "laundry" | "analyst";

export interface ChapterMetric {
  value: string;
  label: string;
}

export interface ChapterProject {
  slug: string;
  /** Overrides the project name on the chip (e.g. a sub-system of a project). */
  label?: string;
}

export interface Chapter {
  mode: ModeId;
  metrics: ChapterMetric[];
  projects: ChapterProject[];
}

export const CHAPTERS: Chapter[] = [
  {
    mode: "counter",
    metrics: [
      { value: "450+", label: "Catalogue items live · Al Boyut" },
      { value: "20+", label: "Back-office modules · PrimeTijara" },
      { value: "4", label: "Order channels · Jireh" },
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
    mode: "laundry",
    metrics: [
      { value: "Scan", label: "Out at collection" },
      { value: "Public", label: "Order tracking" },
      { value: "Live", label: "On the counter today" },
    ],
    projects: [{ slug: "al-boyut", label: "An-Nur laundry" }],
  },
  {
    mode: "analyst",
    metrics: [
      { value: "50+", label: "SMEs evaluated" },
      { value: "5", label: "Investment models · Lady Angel" },
      { value: "4", label: "Decision tools · Ethika" },
    ],
    projects: [{ slug: "ethika" }, { slug: "ladyangel" }, { slug: "siif" }],
  },
];

export const chapterId = (mode: ModeId) => `deploy-${mode}`;
