import { bigint, boolean, date, doublePrecision, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Keep in step with ./sql.ts, which creates these tables on Supabase.
 *
 * Visitors are identified by the browser's own random id (or, without one, a
 * hash of IP, user agent and day). Sessions carry the IP address, place and
 * device; events record page views and what people did on the site.
 */
export const visitors = pgTable("visitors", {
  id: text("id").primaryKey(), // hash of the browser id, or of ip + ua + day
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
    ip: text("ip"),
    device: text("device"), // desktop, mobile, tablet
    browser: text("browser"),
    os: text("os"),
    referrer: text("referrer"),
    utm: jsonb("utm").$type<Record<string, string>>(),
    landing: text("landing"),
    returning: boolean("returning").default(false).notNull(),
    alerted: boolean("alerted").default(false).notNull(),
    /** The Telegram "new visit" message, so the notable alert can reply under it. */
    tgMsgId: bigint("tg_msg_id", { mode: "number" }),
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
    notified: boolean("notified").default(false).notNull(),
  },
  (t) => [index("messages_at_idx").on(t.at)],
);

/** Small key/value store, e.g. the Telegram chat picked in /office. */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Everything planned in the Office: one table, told apart by kind; per-kind fields live in data. */
export const items = pgTable(
  "items",
  {
    id: serial("id").primaryKey(),
    kind: text("kind").notNull(),
    title: text("title").notNull(),
    status: text("status").default("").notNull(),
    priority: integer("priority").default(0).notNull(),
    due: date("due", { mode: "string" }),
    projectId: integer("project_id"),
    data: jsonb("data").$type<Record<string, unknown>>().default({}).notNull(),
    sort: doublePrecision("sort").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("items_kind_idx").on(t.kind, t.status), index("items_due_idx").on(t.due)],
);

/** A dated line in an item's history: touches, stage moves, notes. */
export const itemEvents = pgTable(
  "item_events",
  {
    id: serial("id").primaryKey(),
    itemId: integer("item_id").notNull(),
    at: timestamp("at", { withTimezone: true }).defaultNow().notNull(),
    text: text("text").notNull(),
  },
  (t) => [index("item_events_item_idx").on(t.itemId, t.at)],
);

/** Office sign-in attempts, for the lockout. */
export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: serial("id").primaryKey(),
    ip: text("ip"),
    at: timestamp("at", { withTimezone: true }).defaultNow().notNull(),
    ok: boolean("ok").default(false).notNull(),
  },
  (t) => [index("login_attempts_at_idx").on(t.at)],
);

export type Item = typeof items.$inferSelect;
export type ItemEvent = typeof itemEvents.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Message = typeof messages.$inferSelect;
