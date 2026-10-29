"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { COOKIE, checkPassword, issue, officeConfigured, signedIn } from "@/lib/office/auth";
import { frame, line, recentChats, saveChat, send } from "@/lib/office/telegram";

// slow down guessing: a pause on every wrong password
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(_: unknown, form: FormData) {
  if (!officeConfigured()) return { error: "The back office is not set up yet. Add OFFICE_PASSWORD and SESSION_SECRET in Vercel." };
  const password = String(form.get("password") ?? "");
  if (!checkPassword(password)) {
    await wait(900);
    return { error: "That password is not right." };
  }
  const c = issue();
  (await cookies()).set(COOKIE, c.value, { httpOnly: true, secure: true, sameSite: "lax", path: "/office", maxAge: c.maxAge });
  redirect("/office");
}

export async function logout() {
  (await cookies()).delete({ name: COOKIE, path: "/office" });
  redirect("/office/login");
}

export async function setStatus(form: FormData) {
  if (!(await signedIn())) redirect("/office/login");
  const id = Number(form.get("id"));
  const status = String(form.get("status"));
  const store = await db();
  if (!store || !Number.isInteger(id) || !["new", "replied", "archived"].includes(status)) return;
  await store.update(messages).set({ status }).where(eq(messages.id, id));
  revalidatePath("/office");
}

export async function testTelegram() {
  if (!(await signedIn())) redirect("/office/login");
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  const r = await send(
    frame("test", ["If you can read this, new visits, notable visits, messages and the daily digest will reach this chat.", "", line("Sent from", origin), line("At", new Date().toUTCString())], "🧪 Test from the back office"),
    { buttons: [[{ text: "Open the back office", url: `${origin}/office` }]] },
  );
  redirect(`/office?test=${r.ok ? "sent" : encodeURIComponent(r.error)}`);
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
  if (!/^-?\d{3,20}$/.test(id)) redirect("/office?chat=invalid");
  const ok = await saveChat(id);
  redirect(`/office?chat=${ok ? "saved" : "no_database"}`);
}
