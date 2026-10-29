import "server-only";
import { eq, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { items, messages, settings } from "@/db/schema";
import { projects } from "@/lib/projects";
import { GRAD_CHECKLIST } from "./kinds";

/**
 * First-run contents of the Office: my own GitHub repositories (forks left
 * out) as projects, joined to the portfolio's case studies where there is
 * one; Koflex Fitness; the three books on the desk; and outreach message
 * templates. Stages for repos without a case study are guessed from the
 * last push and say so. Personal plans start empty: nothing is invented.
 */
const REPOS: [string, string][] = [
  ["portfolio", "2026-10-29"],
  ["Madina-Basketball", "2026-10-28"],
  ["mirepa-platform", "2026-10-26"],
  ["al-boyut", "2026-10-24"],
  ["anis-food", "2026-10-08"],
  ["ghana-hajj", "2026-10-05"],
  ["themakossashop", "2026-10-01"],
  ["PrimeHub", "2026-09-30"],
  ["ProNaj", "2026-09-22"],
  ["edis-mart", "2026-09-16"],
  ["muna-muse", "2026-09-16"],
  ["shop-with-rabi", "2026-09-16"],
  ["zainas-couture", "2026-09-16"],
  ["scos", "2026-09-14"],
  ["Ethika", "2026-09-11"],
  ["Koyi", "2026-08-29"],
  ["jireh-foods", "2026-08-18"],
  ["urban-innovations", "2026-07-22"],
  ["bainas-space", "2026-07-08"],
  ["level-fellowship", "2026-06-11"],
  ["IFinCert", "2026-06-09"],
  ["jamis-kitchen", "2026-05-29"],
  ["susu-sync", "2026-05-29"],
  ["salmas-eatery", "2026-05-27"],
  ["delish", "2026-05-27"],
  ["med-easy", "2026-05-19"],
  ["lenuspharma", "2026-05-15"],
  ["AlNasserTradeConnect", "2026-04-11"],
  ["chale-socks", "2026-04-03"],
  ["lady-angel", "2026-04-02"],
  ["SIIF", "2026-04-02"],
  ["habs-collection", "2026-04-01"],
  ["rockmotion", "2026-03-23"],
  ["her-space", "2026-03-23"],
  ["magilo", "2026-03-21"],
  ["her-letter", "2026-03-10"],
  ["aadam-dev", "2026-03-07"],
  ["rentcheck", "2026-03-05"],
  ["ramadan-kitchen", "2026-03-02"],
  ["bwoodinnsports", "2026-01-11"],
  ["LearnWithRS", "2026-01-02"],
];
/** repo -> portfolio project id, where the names differ */
const CASE: Record<string, string> = {
  PrimeHub: "primehub",
  "al-boyut": "alboyut",
  delish: "enterprise-erp",
  "jireh-foods": "jireh",
  "anis-food": "anisfoods",
  "Madina-Basketball": "madinabasketball",
  lenuspharma: "lenus",
  themakossashop: "makossa",
  "chale-socks": "chalesocks",
  "lady-angel": "ladyangel",
  "muna-muse": "munamuse",
  "zainas-couture": "zainas",
};
const pretty = (repo: string) =>
  repo
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const TEMPLATES = [
  {
    title: "First message (WhatsApp)",
    data: {
      channel: "WhatsApp",
      body: "Hello {name}, I'm Aadam, a developer in Accra. I build point of sale, stock and online ordering systems for businesses like {business}. I recently set up the counter, stock and storefront for a building materials shop on Lakeside. Could I show you in 10 minutes how {pitch} would work for you? No cost to look.",
    },
  },
  {
    title: "First email",
    data: {
      channel: "Email",
      subject: "{business}: a quick idea",
      body: "Hello {name},\n\nI'm Aadam, a developer in Accra (aadambuilds.dev). I build the systems small businesses run on: point of sale, stock, online orders, and the numbers behind them.\n\nFor {business}, I think {pitch} could save time at the counter and show you what sells. I'd be glad to show you a working example in 15 minutes, at your place or on a call.\n\nThanks,\nAadam\nadam@aadambuilds.dev",
    },
  },
  {
    title: "Follow-up",
    data: { channel: "WhatsApp", body: "Hello {name}, following up on my message about {pitch} for {business}. Happy to drop by with a working demo this week if that helps." },
  },
];

export async function seedOffice(store: Db) {
  const [done] = await store.select().from(settings).where(eq(settings.key, "office_seeded")).limit(1);
  if (done) return false;
  const byId = new Map(projects.map((p) => [p.id, p]));
  const recent = (d: string) => Date.now() - new Date(d).getTime() < 45 * 864e5;
  const rows = REPOS.map(([repo, pushed], i) => {
    const p = byId.get(CASE[repo] ?? repo.toLowerCase());
    const stage = p ? (repo === "al-boyut" ? "maintaining" : "live") : recent(pushed) ? "building" : "paused";
    return {
      kind: "project",
      title: p?.name ?? pretty(repo),
      status: repo === "portfolio" || repo === "mirepa-platform" ? "building" : stage,
      sort: i,
      data: {
        repo: `https://github.com/aadam-dev/${repo}`,
        pushed,
        ...(p ? { url: p.liveBaseUrl ?? "", client: p.name, caseStudy: `/work/${p.slug ?? p.id}` } : { notes: "Imported from GitHub. Stage guessed from the last push; set it." }),
      },
    };
  });
  rows.unshift({ kind: "project", title: "Koflex Fitness", status: "building", sort: -1, data: { client: "Koflex Fitness", notes: "Gym system: members, subscriptions, check-ins and payments." } as never });
  await store.insert(items).values(rows);
  await store.insert(items).values([
    { kind: "book", title: "The Laws of Human Nature", status: "reading", data: { author: "Robert Greene" } },
    { kind: "book", title: "Mastery", status: "to-read", data: { author: "Robert Greene" } },
    { kind: "book", title: "Quiet", status: "to-read", data: { author: "Susan Cain" } },
    ...TEMPLATES.map((t) => ({ kind: "template", title: t.title, status: "", data: t.data })),
  ]);
  // every website message so far becomes a lead
  const old = await store.select().from(messages);
  if (old.length)
    await store.insert(items).values(
      old.map((m) => ({ kind: "lead", title: m.name, status: m.status === "replied" ? "replied" : "new", data: { contact: m.contact, source: "Website", brief: m.brief ?? "", messageId: m.id, notes: m.body.slice(0, 2000) } })),
    );
  await store.insert(settings).values({ key: "office_seeded", value: new Date().toISOString() }).onConflictDoNothing();
  return true;
}

export const newGrad = () => ({ checklist: GRAD_CHECKLIST.map((text) => ({ text, done: false })) });

/** A website message lands in Leads straight away. */
export async function leadFromMessage(store: Db, m: { id: number; name: string; contact: string; kind: string; brief?: string | null; body: string; budget?: string | null }) {
  await store.insert(items).values({
    kind: "lead",
    title: m.name,
    status: "new",
    due: sql`current_date + 1` as unknown as string,
    data: { contact: m.contact, source: "Website", brief: m.brief ?? "", messageId: m.id, value: "", next: m.kind === "contact" ? "Reply" : `Reply to the ${m.kind} brief`, notes: [m.budget ? `Budget: ${m.budget}` : "", m.body].filter(Boolean).join("\n\n").slice(0, 2000) },
  });
}
