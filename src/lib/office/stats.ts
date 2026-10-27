import "server-only";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { events, messages, sessions } from "@/db/schema";

const since = (hours: number) => new Date(Date.now() - hours * 3600e3);

/** The numbers the digest and the back office share. */
export async function stats(db: Db, hours: number) {
  const from = since(hours);
  const [totals] = await db
    .select({
      sessions: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${sessions.visitorId})::int`,
      seconds: sql<number>`coalesce(avg(${sessions.seconds}), 0)::float`,
      returning: sql<number>`count(*) filter (where ${sessions.returning})::int`,
    })
    .from(sessions)
    .where(gte(sessions.startedAt, from));
  const group = async (col: typeof sessions.country | typeof sessions.device | typeof sessions.referrer | typeof sessions.city) =>
    db
      .select({ key: col, n: sql<number>`count(*)::int` })
      .from(sessions)
      .where(gte(sessions.startedAt, from))
      .groupBy(col)
      .orderBy(desc(sql`count(*)`))
      .limit(8);
  const [countries, devices, referrers, cities] = await Promise.all([group(sessions.country), group(sessions.device), group(sessions.referrer), group(sessions.city)]);
  const pages = await db
    .select({ key: events.path, n: sql<number>`count(*)::int` })
    .from(events)
    .where(and(gte(events.at, from), eq(events.type, "view")))
    .groupBy(events.path)
    .orderBy(desc(sql`count(*)`))
    .limit(10);
  const played = await db
    .select({ key: events.name, n: sql<number>`count(*)::int` })
    .from(events)
    .where(and(gte(events.at, from), eq(events.type, "kit")))
    .groupBy(events.name)
    .orderBy(desc(sql`count(*)`))
    .limit(10);
  const inbox = await db.select().from(messages).where(gte(messages.at, from)).orderBy(desc(messages.at)).limit(20);
  return { totals, countries, devices, referrers, cities, pages, played, inbox };
}

export async function perDay(db: Db, days: number) {
  return db
    .select({ day: sql<string>`to_char(date_trunc('day', ${sessions.startedAt} at time zone 'UTC'), 'YYYY-MM-DD')`, n: sql<number>`count(*)::int` })
    .from(sessions)
    .where(gte(sessions.startedAt, since(days * 24)))
    .groupBy(sql`1`)
    .orderBy(sql`1`);
}
