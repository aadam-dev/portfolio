import { boolean, doublePrecision, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Visitors are identified by a salted hash of IP, user agent and day, so no
 * raw IP is stored and the id rotates daily. Sessions carry the place and
 * device; events record page views and what people did on the site.
 */
export const visitors = pgTable("visitors", {
  id: text("id").primaryKey(), // sha256(salt + ip + ua + day)
  firstSeen: timestamp("first_seen", { withTimezone: true }).defaultNow().notNull(),
  lastSeen: timestamp("last_seen", { withTimezone: true }).defaultNow().notNull(),
  visits: integer("visits").default(1).notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(), // random, from the browser (sessionStorage)
    visitorId: text("visitor_id").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    lastSeen: timestamp("last_seen", { withTimezone: true }).defaultNow().notNull(),
    seconds: integer("seconds").default(0).notNull(),
    pages: integer("pages").default(0).notNull(),
    country: text("country"),
    region: text("region"),
    city: text("city"),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    device: text("device"), // desktop, mobile, tablet
    browser: text("browser"),
    os: text("os"),
    referrer: text("referrer"),
    utm: jsonb("utm").$type<Record<string, string>>(),
    landing: text("landing"),
    returning: boolean("returning").default(false).notNull(),
    alerted: boolean("alerted").default(false).notNull(),
  },
  (t) => [index("sessions_started_idx").on(t.startedAt)],
);

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    at: timestamp("at", { withTimezone: true }).defaultNow().notNull(),
    type: text("type").notNull(), // pageview | kit
    path: text("path"),
    name: text("name"), // e.g. pos.sale.completed
    detail: text("detail"),
  },
  (t) => [index("events_session_idx").on(t.sessionId), index("events_at_idx").on(t.at)],
);

export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    at: timestamp("at", { withTimezone: true }).defaultNow().notNull(),
    kind: text("kind").notNull(), // contact | build | hire
    name: text("name").notNull(),
    contact: text("contact").notNull(),
    budget: text("budget"),
    body: text("body").notNull(),
    brief: text("brief"),
    sessionId: text("session_id"),
    status: text("status").default("new").notNull(), // new | replied | archived
    emailed: boolean("emailed").default(false).notNull(),
  },
  (t) => [index("messages_at_idx").on(t.at)],
);

export type Session = typeof sessions.$inferSelect;
export type Message = typeof messages.$inferSelect;
