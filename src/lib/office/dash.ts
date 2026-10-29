import "server-only";
import { and, desc, eq, gte, inArray, isNotNull, lt, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { events, messages, sessions } from "@/db/schema";

export type Range = "24h" | "7d" | "30d";
export const RANGES: { id: Range; label: string; hours: number; bucket: "hour" | "day" }[] = [
  { id: "24h", label: "24 hours", hours: 24, bucket: "hour" },
  { id: "7d", label: "7 days", hours: 24 * 7, bucket: "day" },
  { id: "30d", label: "30 days", hours: 24 * 30, bucket: "day" },
];
export const rangeOf = (r?: string) => RANGES.find((x) => x.id === r) ?? RANGES[1];

export interface Point {
  t: string;
  visits: number;
  visitors: number;
  seconds: number;
  messages: number;
}

async function totals(db: Db, from: Date, to: Date) {
  const [s] = await db
    .select({
      visits: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${sessions.visitorId})::int`,
      seconds: sql<number>`coalesce(avg(${sessions.seconds}), 0)::float`,
      returning: sql<number>`count(*) filter (where ${sessions.returning})::int`,
    })
    .from(sessions)
    .where(and(gte(sessions.startedAt, from), lt(sessions.startedAt, to)));
  const [m] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(messages)
    .where(and(gte(messages.at, from), lt(messages.at, to)));
  return { ...s, messages: m?.n ?? 0 };
}

/** Everything the back office shows for one range, plus the range before it for the deltas. */
export async function dashboard(db: Db, range: Range) {
  const r = rangeOf(range);
  const now = new Date();
  const from = new Date(now.getTime() - r.hours * 3600e3);
  const before = new Date(from.getTime() - r.hours * 3600e3);
  const unit = r.bucket;
  const steps = unit === "hour" ? r.hours : r.hours / 24;

  // one row per bucket, empty buckets included
  const series = (await db.execute(sql`
    with b as (
      select generate_series(date_trunc(${unit}, now() at time zone 'UTC') - (${steps - 1} * ('1 ' || ${unit})::interval), date_trunc(${unit}, now() at time zone 'UTC'), ('1 ' || ${unit})::interval) as t
    ),
    s as (
      select date_trunc(${unit}, started_at at time zone 'UTC') as t, count(*)::int as visits, count(distinct visitor_id)::int as visitors, coalesce(avg(seconds), 0)::float as seconds
      from sessions where started_at >= ${from} group by 1
    ),
    m as (
      select date_trunc(${unit}, at at time zone 'UTC') as t, count(*)::int as messages from messages where at >= ${from} group by 1
    )
    select to_char(b.t, 'YYYY-MM-DD"T"HH24:00') as t, coalesce(s.visits, 0) as visits, coalesce(s.visitors, 0) as visitors, coalesce(s.seconds, 0) as seconds, coalesce(m.messages, 0) as messages
    from b left join s on s.t = b.t left join m on m.t = b.t order by b.t
  `)) as unknown as { rows?: Point[] } | Point[];
  const points: Point[] = (Array.isArray(series) ? series : (series.rows ?? [])).map((p) => ({
    t: p.t,
    visits: Number(p.visits),
    visitors: Number(p.visitors),
    seconds: Number(p.seconds),
    messages: Number(p.messages),
  }));

  const group = async (col: typeof sessions.country | typeof sessions.device | typeof sessions.referrer | typeof sessions.city) =>
    db
      .select({ key: col, n: sql<number>`count(*)::int` })
      .from(sessions)
      .where(gte(sessions.startedAt, from))
      .groupBy(col)
      .orderBy(desc(sql`count(*)`))
      .limit(6);
  const top = (type: "view" | "kit", col: typeof events.path | typeof events.name) =>
    db
      .select({ key: col, n: sql<number>`count(*)::int` })
      .from(events)
      .where(and(gte(events.at, from), eq(events.type, type)))
      .groupBy(col)
      .orderBy(desc(sql`count(*)`))
      .limit(6);

  const [cur, prev, countries, devices, referrers, pages, played, live, located, recent, inbox, unread] = await Promise.all([
    totals(db, from, now),
    totals(db, before, from),
    group(sessions.country),
    group(sessions.device),
    group(sessions.referrer),
    top("view", events.path),
    top("kit", events.name),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(sessions)
      .where(gte(sessions.lastSeen, new Date(Date.now() - 5 * 60e3))),
    db
      .select({ lat: sessions.lat, lng: sessions.lng, city: sessions.city, country: sessions.country, n: sql<number>`count(*)::int` })
      .from(sessions)
      .where(and(isNotNull(sessions.lat), gte(sessions.startedAt, from)))
      .groupBy(sessions.lat, sessions.lng, sessions.city, sessions.country),
    db.select().from(sessions).orderBy(desc(sessions.startedAt)).limit(40),
    db.select().from(messages).orderBy(desc(messages.at)).limit(60),
    db.select({ n: sql<number>`count(*)::int` }).from(messages).where(eq(messages.status, "new")),
  ]);
  const ids = recent.map((s) => s.id);
  const trail = ids.length
    ? await db
        .select({ sessionId: events.sessionId, type: events.type, path: events.path, name: events.name })
        .from(events)
        .where(inArray(events.sessionId, ids))
        .orderBy(events.at)
    : [];

  return { range: r, points, cur, prev, countries, devices, referrers, pages, played, live: live[0]?.n ?? 0, located, recent, trail, inbox, unread: unread[0]?.n ?? 0 };
}

export type Dashboard = Awaited<ReturnType<typeof dashboard>>;
