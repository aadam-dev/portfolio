"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { COOKIE, checkPassword, issue, officeConfigured, signedIn } from "@/lib/office/auth";
import { OWNER, layout, sendMail } from "@/lib/office/mail";

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

export async function testEmail() {
  if (!(await signedIn())) redirect("/office/login");
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  const mail = layout({
    title: "Test email from the back office",
    intro: "If you can read this, form, ticket and visit emails will reach you.",
    rows: [["Sent from", origin], ["At", new Date().toUTCString()]],
    cta: { href: `${origin}/office`, label: "Back to the office" },
  });
  const r = await sendMail({ to: OWNER, subject: "Back office test email", ...mail });
  redirect(`/office?test=${r.ok ? "sent" : r.error}`);
}
