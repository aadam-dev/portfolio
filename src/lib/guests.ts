import { and, count, desc, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { guestPosts } from "@/db/schema";

export type GuestKind = "note" | "photo";
export const GUEST_KINDS: GuestKind[] = ["note", "photo"];

/** What the public sees: approved posts only, never the address or the raw image. */
export async function approvedGuests(store: Db, kind: GuestKind, limit = 40) {
  const rows = await store
    .select({ id: guestPosts.id, name: guestPosts.name, body: guestPosts.body, rating: guestPosts.rating, at: guestPosts.createdAt })
    .from(guestPosts)
    .where(and(eq(guestPosts.kind, kind), eq(guestPosts.status, "approved")))
    .orderBy(desc(guestPosts.createdAt))
    .limit(limit);
  return rows.map((r) => ({ ...r, at: r.at.toISOString(), image: kind === "photo" ? `/api/guest/${r.id}/image` : undefined }));
}

export async function guestImage(store: Db, id: number) {
  const [row] = await store
    .select({ image: guestPosts.image, mime: guestPosts.mime })
    .from(guestPosts)
    .where(and(eq(guestPosts.id, id), eq(guestPosts.kind, "photo"), eq(guestPosts.status, "approved")))
    .limit(1);
  return row?.image ? row : null;
}

/** For the Office: everything, newest first, without the image bytes. */
export async function officeGuests(store: Db) {
  return store
    .select({ id: guestPosts.id, kind: guestPosts.kind, name: guestPosts.name, body: guestPosts.body, rating: guestPosts.rating, status: guestPosts.status, ip: guestPosts.ip, at: guestPosts.createdAt })
    .from(guestPosts)
    .orderBy(desc(guestPosts.createdAt))
    .limit(300);
}

/** The Office can see a pending photo before deciding. */
export async function anyGuestImage(store: Db, id: number) {
  const [row] = await store.select({ image: guestPosts.image, mime: guestPosts.mime }).from(guestPosts).where(eq(guestPosts.id, id)).limit(1);
  return row?.image ? row : null;
}

export async function pendingGuests(store: Db) {
  const [r] = await store.select({ n: count() }).from(guestPosts).where(eq(guestPosts.status, "pending"));
  return r?.n ?? 0;
}

export async function setGuestStatus(store: Db, id: number, status: "approved" | "rejected" | "pending") {
  await store.update(guestPosts).set({ status }).where(eq(guestPosts.id, id));
}

export async function deleteGuest(store: Db, id: number) {
  await store.delete(guestPosts).where(eq(guestPosts.id, id));
}
