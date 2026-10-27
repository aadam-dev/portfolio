import "server-only";
import { createHash } from "node:crypto";
import { and, asc, eq, sql } from "drizzle-orm";
import UAParser from "ua-parser-js";
import type { Db } from "@/db";
import { events, sessions, visitors, type Session } from "@/db/schema";
import { OWNER, layout, sendMail } from "./mail";

const salt = () => process.env.TRACK_SALT ?? process.env.SESSION_SECRET ?? "aadam";

/**
 * A visitor id: the browser's own random id when it keeps one, otherwise
 * IP + user agent + day. Either way it is hashed with a secret salt, so the
 * raw values never reach the database.
 */
export function visitorId(o: { vid?: string; ip?: string; ua: string }) {
  const day = new Date().toISOString().slice(0, 10);
  const basis = o.vid ? `vid:${o.vid}` : `ip:${o.ip ?? ""}|${o.ua}|${day}`;
  return createHash("sha256").update(`${salt()}|${basis}`).digest("base64url").slice(0, 32);
}

export function parseUa(ua: string) {
  const r = new UAParser(ua).getResult();
  const type = r.device.type === "mobile" ? "mobile" : r.device.type === "tablet" ? "tablet" : "desktop";
  return {
    device: type,
    browser: [r.browser.name, r.browser.major].filter(Boolean).join(" ") || null,
    os: [r.os.name, r.os.version].filter(Boolean).join(" ") || null,
  };
}

/** Kit events that count as "played with the site". */
const PLAYED = /^(court\.ball|kit\.car|finance\.|pos\.sale|laundry\.|atelier\.|ledger\.|class\.|build\.ticket)/;

const LABELS: [RegExp, string][] = [
  [/^pos\.sale\.completed/, "Rang up a sale"],
  [/^finance\.shock\.applied/, "Stressed the model"],
  [/^finance\.model\.exported/, "Exported the model"],
  [/^build\.ticket\.printed/, "Printed a brief"],
  [/^build\.ticket\.sent/, "Sent a brief"],
  [/^build\.item\./, "Built a project plan"],
  [/^court\.ball/, "Bounced the ball"],
  [/^court\.shot/, "Took a shot"],
  [/^kit\.car\.race/, "Raced the car"],
  [/^kit\.car\./, "Took the car apart"],
  [/^ledger\./, "Counted stock"],
  [/^laundry\./, "Ran a laundry ticket"],
  [/^atelier\./, "Shopped a storefront"],
  [/^class\./, "Checked an exam pathway"],
];

/** Plain words for a kit event name. */
export function eventLabel(name: string | null) {
  if (!name) return "Unknown";
  return LABELS.find(([r]) => r.test(name))?.[1] ?? name;
}

export function flagEmoji(cc?: string | null) {
  if (!cc || cc.length !== 2) return "";
  return String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

export function place(s: Pick<Session, "city" | "region" | "country">) {
  const country = s.country ? (new Intl.DisplayNames(["en"], { type: "region" }).of(s.country) ?? s.country) : "";
  return [s.city ? decodeURIComponent(s.city) : "", country].filter(Boolean).join(", ") || "Unknown place";
}

export async function sessionStory(db: Db, sid: string) {
  const [s] = await db.select().from(sessions).where(eq(sessions.id, sid)).limit(1);
  if (!s) return null;
  const ev = await db.select().from(events).where(eq(events.sessionId, sid)).orderBy(asc(events.at)).limit(200);
  const pages = [...new Set(ev.filter((e) => e.type === "view").map((e) => e.path ?? ""))].filter(Boolean);
  const did = ev.filter((e) => e.type === "kit").map((e) => `${eventLabel(e.name)}${e.detail ? ` (${e.detail})` : ""}`);
  const raw = ev.filter((e) => e.type === "kit").map((e) => e.name ?? "");
  return { s, pages, did, raw };
}

/** Why a session deserves an instant email, or null if it does not. */
export function notable(s: Session, story: { pages: string[]; did: string[]; raw: string[] }) {
  const why: string[] = [];
  if (s.returning) why.push("came back");
  if (s.seconds >= 60) why.push(`stayed ${Math.round(s.seconds)}s`);
  const cases = story.pages.filter((p) => p.startsWith("/work/"));
  if (cases.length) why.push(`opened ${cases.length === 1 ? "a case study" : `${cases.length} case studies`}`);
  const played = story.raw.filter((d) => PLAYED.test(d));
  if (played.length) why.push("played with the desk or the Lab");
  return why.length ? why : null;
}

export function sessionRows(s: Session, story: { pages: string[]; did: string[] }): [string, string][] {
  return [
    ["Where", `${flagEmoji(s.country)} ${place(s)}`.trim()],
    ["Device", [s.device, s.browser, s.os].filter(Boolean).join(", ")],
    ["Arrived from", s.referrer || "Direct"],
    ["Campaign", s.utm ? Object.entries(s.utm).map(([k, v]) => `${k}=${v}`).join(", ") : ""],
    ["Landed on", s.landing ?? ""],
    ["Pages", story.pages.join("  ") || "-"],
    ["Time on site", `${Math.round(s.seconds)}s`],
    ["Did", story.did.slice(0, 12).join("; ")],
  ];
}

export interface TrackItem {
  type: "view" | "kit";
  path?: string;
  name?: string;
  detail?: string;
}

export interface TrackInput {
  sid: string;
  vid?: string;
  ref?: string;
  utm?: Record<string, string>;
  seconds?: number;
  items: TrackItem[];
}

/** Store one beacon: create or extend the session, add events, maybe alert. */
export async function record(
  db: Db,
  t: TrackInput,
  ctx: { ip?: string; ua: string; geo: { city?: string; country?: string; countryRegion?: string; latitude?: string; longitude?: string }; origin: string },
) {
  const vid = visitorId({ vid: t.vid, ip: ctx.ip, ua: ctx.ua });
  const views = t.items.filter((i) => i.type === "view");
  const [existing] = await db.select().from(sessions).where(eq(sessions.id, t.sid)).limit(1);

  if (!existing) {
    const [v] = await db
      .insert(visitors)
      .values({ id: vid })
      .onConflictDoUpdate({ target: visitors.id, set: { lastSeen: sql`now()`, visits: sql`${visitors.visits} + 1` } })
      .returning();
    const ua = parseUa(ctx.ua);
    await db
      .insert(sessions)
      .values({
        id: t.sid,
        visitorId: vid,
        country: ctx.geo.country ?? null,
        region: ctx.geo.countryRegion ?? null,
        city: ctx.geo.city ?? null,
        lat: ctx.geo.latitude ? Number(ctx.geo.latitude) : null,
        lng: ctx.geo.longitude ? Number(ctx.geo.longitude) : null,
        ...ua,
        referrer: t.ref ? t.ref.slice(0, 300) : null,
        utm: t.utm && Object.keys(t.utm).length ? t.utm : null,
        landing: views[0]?.path ?? null,
        pages: views.length,
        seconds: Math.max(0, Math.min(t.seconds ?? 0, 6 * 3600)),
        returning: v.visits > 1,
      })
      .onConflictDoNothing();
  } else {
    await db
      .update(sessions)
      .set({
        lastSeen: sql`now()`,
        pages: sql`${sessions.pages} + ${views.length}`,
        seconds: sql`greatest(${sessions.seconds}, ${Math.max(0, Math.min(t.seconds ?? 0, 6 * 3600))})`,
      })
      .where(eq(sessions.id, t.sid));
  }

  if (t.items.length) {
    await db.insert(events).values(
      t.items.slice(0, 50).map((i) => ({
        sessionId: t.sid,
        type: i.type,
        path: i.path?.slice(0, 300) ?? null,
        name: i.name?.slice(0, 80) ?? null,
        detail: i.detail?.slice(0, 200) ?? null,
      })),
    );
  }

  // instant email for a notable visit, once per session
  const story = await sessionStory(db, t.sid);
  if (!story || story.s.alerted) return { alerted: false };
  const why = notable(story.s, story);
  if (!why) return { alerted: false };
  const claimed = await db
    .update(sessions)
    .set({ alerted: true })
    .where(and(eq(sessions.id, t.sid), eq(sessions.alerted, false)))
    .returning({ id: sessions.id });
  if (!claimed.length) return { alerted: false };
  const mail = layout({
    title: `${flagEmoji(story.s.country)} Someone from ${place(story.s)} is on the site`,
    intro: `This visit ${why.join(", ")}.`,
    rows: sessionRows(story.s, story),
    cta: { href: `${ctx.origin}/office`, label: "Open the back office" },
  });
  await sendMail({ to: OWNER, subject: `Visitor: ${place(story.s)}, ${why[0]}`, ...mail });
  return { alerted: true };
}
