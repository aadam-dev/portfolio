import "server-only";
import { and, asc, desc, eq, inArray, isNotNull, lte, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { itemEvents, items, type Item } from "@/db/schema";
import { KINDS, type Kind } from "./kinds";
import { seedOffice } from "./seed";

export type { Item };

/** Clean a free-form patch against the kind's fields: known keys, strings, sane lengths. */
export function cleanData(kind: Kind, data: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of KINDS[kind].fields) {
    const v = data[f.key];
    if (v === undefined) continue;
    if (f.type === "checklist") {
      if (Array.isArray(v)) out[f.key] = v.slice(0, 40).map((c) => ({ text: String((c as { text?: unknown }).text ?? "").slice(0, 200), done: !!(c as { done?: unknown }).done }));
      continue;
    }
    out[f.key] = String(v ?? "").slice(0, f.type === "textarea" ? 8000 : 400);
  }
  // keys the app itself keeps (import provenance, links back)
  for (const k of ["pushed", "caseStudy", "messageId", "touches", "doneWeek"]) if (data[k] !== undefined) out[k] = data[k];
  return out;
}

export async function listItems(store: Db, kinds: Kind[]) {
  await seedOffice(store);
  return store
    .select()
    .from(items)
    .where(inArray(items.kind, kinds))
    .orderBy(asc(items.sort), desc(items.updatedAt));
}

export async function getEvents(store: Db, itemId: number) {
  return store.select().from(itemEvents).where(eq(itemEvents.itemId, itemId)).orderBy(desc(itemEvents.at)).limit(50);
}

export async function createItem(store: Db, kind: Kind, v: { title: string; status?: string; due?: string | null; projectId?: number | null; data?: Record<string, unknown>; priority?: number }) {
  const stage = v.status ?? KINDS[kind].stages[0].id;
  const [{ max }] = await store.select({ max: sql<number>`coalesce(max(${items.sort}), 0)` }).from(items).where(and(eq(items.kind, kind), eq(items.status, stage)));
  const [row] = await store
    .insert(items)
    .values({ kind, title: v.title.slice(0, 200), status: stage, due: v.due || null, projectId: v.projectId ?? null, priority: v.priority ?? 0, data: cleanData(kind, v.data ?? {}), sort: (max ?? 0) + 1 })
    .returning();
  await store.insert(itemEvents).values({ itemId: row.id, text: "Created" });
  return row;
}

export async function updateItem(store: Db, id: number, patch: { title?: string; status?: string; due?: string | null; projectId?: number | null; priority?: number; data?: Record<string, unknown> }) {
  const [cur] = await store.select().from(items).where(eq(items.id, id)).limit(1);
  if (!cur) return null;
  const kind = cur.kind as Kind;
  const set: Partial<Item> = { updatedAt: new Date() };
  if (patch.title !== undefined) set.title = patch.title.slice(0, 200) || cur.title;
  if (patch.status !== undefined && KINDS[kind].stages.some((s) => s.id === patch.status)) set.status = patch.status;
  if (patch.due !== undefined) set.due = patch.due || null;
  if (patch.projectId !== undefined) set.projectId = patch.projectId;
  if (patch.priority !== undefined) set.priority = patch.priority;
  if (patch.data) set.data = { ...cur.data, ...cleanData(kind, patch.data) };
  const [row] = await store.update(items).set(set).where(eq(items.id, id)).returning();
  if (set.status && set.status !== cur.status) {
    const label = (s: string) => KINDS[kind].stages.find((x) => x.id === s)?.label ?? s;
    await store.insert(itemEvents).values({ itemId: id, text: `${label(cur.status)} → ${label(set.status)}` });
  }
  return row;
}

/** Drop a card in a column, between two others (sort is a float, so nothing else moves). */
export async function moveItem(store: Db, id: number, status: string, before: number | null, after: number | null) {
  const sort = before != null && after != null ? (before + after) / 2 : before != null ? before + 1 : after != null ? after - 1 : 0;
  await updateItem(store, id, { status });
  await store.update(items).set({ sort }).where(eq(items.id, id));
}

export async function deleteItem(store: Db, id: number) {
  await store.delete(itemEvents).where(eq(itemEvents.itemId, id));
  await store.delete(items).where(eq(items.id, id));
}

export async function logEvent(store: Db, id: number, text: string) {
  await store.insert(itemEvents).values({ itemId: id, text: text.slice(0, 500) });
  await store.update(items).set({ updatedAt: new Date() }).where(eq(items.id, id));
}

/** What needs me today: follow-ups and deadlines up to today, tasks in progress. */
export async function today(store: Db) {
  await seedOffice(store);
  const day = new Date().toISOString().slice(0, 10);
  const due = await store
    .select()
    .from(items)
    .where(and(isNotNull(items.due), lte(items.due, day), inArray(items.kind, ["outreach", "lead", "task", "grad", "project"]), sql`${items.status} not in ('done','won','lost','not-now','admitted','declined','paused')`))
    .orderBy(asc(items.due))
    .limit(30);
  const doing = await store.select().from(items).where(and(eq(items.kind, "task"), eq(items.status, "doing"))).limit(12);
  const leads = await store.select().from(items).where(and(eq(items.kind, "lead"), eq(items.status, "new"))).orderBy(desc(items.createdAt)).limit(8);
  const shipped = await store
    .select()
    .from(items)
    .where(and(eq(items.kind, "ship"), sql`${items.createdAt} > now() - interval '30 days'`))
    .orderBy(desc(items.createdAt))
    .limit(8);
  const reading = await store.select().from(items).where(and(eq(items.kind, "book"), eq(items.status, "reading"))).limit(3);
  const pipeline = await store
    .select({ status: items.status, n: sql<number>`count(*)::int`, value: sql<number>`coalesce(sum(nullif(regexp_replace(${items.data}->>'value', '[^0-9.]', '', 'g'), '')::numeric), 0)::float` })
    .from(items)
    .where(eq(items.kind, "lead"))
    .groupBy(items.status);
  const outreach = await store.select({ status: items.status, n: sql<number>`count(*)::int` }).from(items).where(eq(items.kind, "outreach")).groupBy(items.status);
  const building = await store.select().from(items).where(and(eq(items.kind, "project"), eq(items.status, "building"))).orderBy(asc(items.sort)).limit(8);
  return { day, due, doing, leads, shipped, reading, pipeline, outreach, building };
}
