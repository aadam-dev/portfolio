"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { items, messages } from "@/db/schema";
import { changeCode, checkCode, COOKIE, cookieOptions, issue, lockState, noteAttempt, officeConfigured, signedIn, SITE_WIDE } from "@/lib/office/auth";
import { createItem, deleteItem, getEvents, logEvent, moveItem, updateItem } from "@/lib/office/items";
import { isKind } from "@/lib/office/kinds";
import { newGrad } from "@/lib/office/seed";
import { frame, line, recentChats, saveChat, send } from "@/lib/office/telegram";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
// Vercel sets x-real-ip itself; x-forwarded-for is the fallback off Vercel
const ipOf = async () => {
  const h = await headers();
  return h.get("x-real-ip")?.trim() || h.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
};
async function guard() {
  if (!(await signedIn())) redirect("/office/login");
  const store = await db();
  if (!store) throw new Error("The database is not connected.");
  return store;
}
const refresh = () => revalidatePath("/office", "layout");

export async function login(_: unknown, form: FormData) {
  if (!officeConfigured()) return { error: "The Office is not set up yet: OFFICE_CODE and SESSION_SECRET are needed in Vercel." };
  const ip = await ipOf();
  const lock = await lockState(ip);
  if (lock.locked) return { error: lock.everyone ? "Too many wrong codes. Sign-in is paused for an hour." : `Too many wrong codes. Try again in ${lock.minutes} minute${lock.minutes === 1 ? "" : "s"}.` };
  const code = String(form.get("code") ?? "").replace(/\D/g, "");
  if (!(await checkCode(code))) {
    await wait(900);
    const fails = await noteAttempt(ip, false);
    if (fails === SITE_WIDE) {
      await send(frame("test", [`${SITE_WIDE} wrong Office codes in the last hour. Sign-in is paused for an hour.`, line("Last from", ip ?? "unknown")], "🔒 Office sign-in paused")).catch(() => {});
    }
    const left = (lock.triesLeft ?? 5) - 1;
    return { error: left > 0 ? `That code is not right. ${left} ${left === 1 ? "try" : "tries"} left.` : "That code is not right. Sign-in is locked for 15 minutes." };
  }
  await noteAttempt(ip, true);
  const c = await issue();
  (await cookies()).set(COOKIE, c.value, cookieOptions(c.maxAge));
  redirect("/office");
}

export async function logout() {
  (await cookies()).delete({ name: COOKIE, path: "/office" });
  redirect("/office/login");
}

export async function setCode(_: unknown, form: FormData) {
  if (!(await signedIn())) redirect("/office/login");
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  if (next !== String(form.get("confirm") ?? "")) return { error: "The new codes don't match." };
  if (!(await checkCode(current))) {
    await wait(900);
    return { error: "The current code is not right." };
  }
  const r = await changeCode(next);
  if (!r.ok) return { error: r.error };
  // this browser stays signed in under the new code; every other device is signed out
  const c = await issue();
  (await cookies()).set(COOKIE, c.value, cookieOptions(c.maxAge));
  return { ok: "Code changed. Other devices are signed out." };
}

/* ------------------------------------------------------------------ items */

export interface ItemInput {
  id?: number;
  kind: string;
  title?: string;
  status?: string;
  due?: string | null;
  projectId?: number | null;
  priority?: number;
  data?: Record<string, unknown>;
}

export async function saveItem(v: ItemInput) {
  const store = await guard();
  if (!isKind(v.kind)) throw new Error("Unknown kind");
  const due = v.due && /^\d{4}-\d{2}-\d{2}$/.test(v.due) ? v.due : v.due === "" ? null : undefined;
  if (v.id) {
    const row = await updateItem(store, v.id, { title: v.title, status: v.status, due, projectId: v.projectId, priority: v.priority, data: v.data });
    refresh();
    return row;
  }
  const title = (v.title ?? "").trim();
  if (!title) throw new Error("A title is needed");
  const data = v.kind === "grad" && !v.data?.checklist ? { ...newGrad(), ...(v.data ?? {}) } : v.data;
  const row = await createItem(store, v.kind, { title, status: v.status, due: due ?? null, projectId: v.projectId ?? null, priority: v.priority, data });
  refresh();
  return row;
}

export async function moveCard(id: number, status: string, before: number | null, after: number | null) {
  const store = await guard();
  await moveItem(store, id, status, before, after);
  refresh();
}

export async function removeItem(id: number) {
  const store = await guard();
  await deleteItem(store, id);
  refresh();
}

export async function itemHistory(id: number) {
  const store = await guard();
  return (await getEvents(store, id)).map((e) => ({ at: e.at.toISOString(), text: e.text }));
}

/** An outreach message went out: log it, move "to contact" on, and set the next follow-up. */
export async function touched(id: number, channel: string, days = 3) {
  const store = await guard();
  const [it] = await store.select().from(items).where(eq(items.id, id)).limit(1);
  if (!it) return;
  const next = new Date(Date.now() + days * 864e5).toISOString().slice(0, 10);
  const touches = Number((it.data as { touches?: number }).touches ?? 0) + 1;
  await updateItem(store, id, { status: it.status === "to-contact" ? "contacted" : it.status, due: next, data: { touches } });
  await logEvent(store, id, `Messaged on ${channel}, follow up ${next}`);
  refresh();
}

export async function addNote(id: number, text: string) {
  const store = await guard();
  if (text.trim()) await logEvent(store, id, text.trim());
  refresh();
}

/** Paste or upload a CSV of businesses: name, sector, area, phone, email, person, notes (header row optional). */
export async function importOutreach(csv: string) {
  const store = await guard();
  const rows = parseCsv(csv).filter((r) => r.some((c) => c.trim()));
  if (!rows.length) return { added: 0 };
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const hasHead = head.includes("name") || head.includes("business");
  const cols = hasHead ? head : ["name", "sector", "area", "phone", "email", "person", "notes"];
  const body = hasHead ? rows.slice(1) : rows;
  let added = 0;
  for (const r of body.slice(0, 500)) {
    const get = (k: string) => r[cols.indexOf(k)]?.trim() ?? "";
    const name = get("name") || get("business");
    if (!name) continue;
    await createItem(store, "outreach", { title: name, data: { sector: get("sector"), area: get("area"), phone: get("phone"), email: get("email"), person: get("person") || get("contact"), notes: get("notes"), pitch: get("pitch"), channel: get("email") && !get("phone") ? "Email" : "WhatsApp" } });
    added++;
  }
  refresh();
  return { added };
}

function parseCsv(s: string) {
  const out: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '"' && s[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === "," || c === "\t") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(cell);
      out.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  row.push(cell);
  out.push(row);
  return out;
}

/** An optional starting week for the workout plan; every session can be edited or deleted. */
export async function workoutTemplate() {
  const store = await guard();
  const week: [string, string, string][] = [
    ["mon", "Upper body", "Push-ups 4×12\nDumbbell press 4×10\nRows 4×10\nShoulder press 3×10\nPlank 3×45s"],
    ["tue", "Run", "Easy run 30 min\nStretch 10 min"],
    ["thu", "Lower body", "Squats 4×10\nRomanian deadlift 4×10\nLunges 3×12 each\nCalf raises 3×15"],
    ["sat", "Basketball", "Shooting: 100 makes\nPickup games 60 min"],
  ];
  for (const [day, title, exercises] of week) await createItem(store, "workout", { title, status: day, data: { exercises } });
  refresh();
}

/** Leads: mirror the website message's status when a lead moves. */
export async function leadStage(id: number, status: string) {
  const store = await guard();
  const row = await updateItem(store, id, { status });
  const mid = Number((row?.data as { messageId?: number } | undefined)?.messageId);
  if (Number.isInteger(mid) && mid > 0 && status !== "new") await store.update(messages).set({ status: status === "lost" ? "archived" : "replied" }).where(eq(messages.id, mid));
  refresh();
}

/* ------------------------------------------------------------------ site + telegram (unchanged behaviour) */

export async function setStatus(form: FormData) {
  if (!(await signedIn())) redirect("/office/login");
  const id = Number(form.get("id"));
  const status = String(form.get("status"));
  const store = await db();
  if (!store || !Number.isInteger(id) || !["new", "replied", "archived"].includes(status)) return;
  await store.update(messages).set({ status }).where(eq(messages.id, id));
  refresh();
}

export async function testTelegram() {
  if (!(await signedIn())) redirect("/office/login");
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  const r = await send(
    frame("test", ["If you can read this, new visits, notable visits, messages and the daily digest will reach this chat.", "", line("Sent from", origin), line("At", new Date().toUTCString())], "🧪 Test from the Office"),
    { buttons: [[{ text: "Open the Office", url: `${origin}/office` }]] },
  );
  redirect(`/office/settings?test=${r.ok ? "sent" : encodeURIComponent(r.error)}`);
}

export type ChatList = { error?: string; chats?: { id: string; name: string; type: string }[] };

/** List the chats that recently messaged the bot (works while the bot has no webhook). */
export async function findChats(): Promise<ChatList> {
  if (!(await signedIn())) redirect("/office/login");
  const r = await recentChats();
  if (!r.ok) return { error: r.error };
  return { chats: r.chats };
}

export async function pickChat(form: FormData) {
  if (!(await signedIn())) redirect("/office/login");
  const id = String(form.get("id") ?? "");
  if (!/^-?\d{3,20}$/.test(id)) redirect("/office/settings?chat=invalid");
  const ok = await saveChat(id);
  redirect(`/office/settings?chat=${ok ? "saved" : "no_database"}`);
}

