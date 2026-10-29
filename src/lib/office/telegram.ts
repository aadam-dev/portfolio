import "server-only";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { sessions, settings } from "@/db/schema";

/**
 * Website updates to the owner's Telegram. The bot is shared with other
 * jobs, so every update opens with the same site header and ends with
 * hashtags (#site #visit, #site #message, ...) that can be searched.
 * This code only sends: it never sets a webhook and never polls, except
 * when the owner asks /office to look up their chat.
 */

const SITE = "aadambuilds.dev";
const token = () => process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
// TELEGRAM_API_BASE lets a test point the bot at a local capture server
const api = (method: string) => `${process.env.TELEGRAM_API_BASE ?? "https://api.telegram.org"}/bot${token()}/${method}`;

export const CHAT_KEY = "telegram_chat_id";

export function telegramConfigured() {
  return /^\d+:[\w-]{20,}$/.test(token());
}

/** The chat that gets updates: TELEGRAM_CHAT_ID, else the one picked in /office. */
export async function chatId(): Promise<string | null> {
  const env = process.env.TELEGRAM_CHAT_ID?.trim();
  if (env) return env;
  const store = await db();
  if (!store) return null;
  const [row] = await store.select().from(settings).where(eq(settings.key, CHAT_KEY)).limit(1).catch(() => []);
  return row?.value ?? null;
}

export async function saveChat(id: string) {
  const store = await db();
  if (!store) return false;
  await store
    .insert(settings)
    .values({ key: CHAT_KEY, value: id })
    .onConflictDoUpdate({ target: settings.key, set: { value: id, updatedAt: sql`now()` } });
  return true;
}

/** Ready to send: a token and a chat. */
export async function telegramReady() {
  return telegramConfigured() && !!(await chatId());
}

export const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

export type Kind = "visit" | "notable" | "message" | "digest" | "test";
const HEAD: Record<Kind, string> = {
  visit: "👋 New visit",
  notable: "🔔 Notable visit",
  message: "📩 New message",
  digest: "📊 Daily digest",
  test: "🧪 Test",
};

/**
 * One update: the site header, a title, lines of already-escaped HTML, and
 * the hashtags. Kept under Telegram's 4,096 character limit.
 */
export function frame(kind: Kind, lines: (string | null)[], title?: string) {
  const head = `🌐 <b>${SITE}</b> · <b>${esc(title ?? HEAD[kind])}</b>`;
  // null lines are skipped; "" is kept as a blank spacer line
  const body = lines
    .filter((l): l is string => l !== null)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const tags = `#site #${kind}`;
  const room = 4000 - head.length - tags.length;
  return `${head}\n\n${body.length > room ? `${body.slice(0, room)}…` : body}\n\n${tags}`;
}

/** A label: value line, with the value escaped; null (skipped) when there is no value. */
export const line = (k: string, v: string | null | undefined) => (v ? `<b>${esc(k)}:</b> ${esc(v)}` : null);

type Button = { text: string; url: string };

async function call<T>(method: string, body: Record<string, unknown>): Promise<{ ok: true; result: T } | { ok: false; error: string }> {
  if (!telegramConfigured()) return { ok: false, error: "not_configured" };
  try {
    const res = await fetch(api(method), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = (await res.json().catch(() => ({}))) as { ok?: boolean; result?: T; description?: string };
    if (!res.ok || !j.ok) {
      // never log the URL: it carries the token
      console.error("telegram", method, res.status, j.description ?? "");
      return { ok: false, error: j.description ?? `http_${res.status}` };
    }
    return { ok: true, result: j.result as T };
  } catch (e) {
    console.error("telegram", method, "network", (e as Error).message);
    return { ok: false, error: "network" };
  }
}

/**
 * Send an update. `silent` delivers without a sound (used for every new
 * visit); `replyTo` threads it under an earlier update.
 */
export async function send(text: string, o: { buttons?: Button[][]; silent?: boolean; replyTo?: number | null } = {}) {
  const chat = await chatId();
  if (!chat) return { ok: false as const, error: "no_chat" };
  // Telegram only accepts public https links on buttons
  const buttons = o.buttons?.map((row) => row.filter((b) => /^https:\/\/(?!localhost|127\.)/.test(b.url))).filter((row) => row.length);
  const r = await call<{ message_id: number }>("sendMessage", {
    chat_id: chat,
    text,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    disable_notification: !!o.silent,
    ...(o.replyTo ? { reply_parameters: { message_id: o.replyTo, allow_sending_without_reply: true } } : {}),
    ...(buttons?.length ? { reply_markup: { inline_keyboard: buttons } } : {}),
  });
  return r.ok ? { ok: true as const, messageId: r.result.message_id } : r;
}

/** People and groups that have recently messaged the bot, so /office can pick the chat. */
export async function recentChats() {
  const r = await call<{ message?: { chat: Chat }; my_chat_member?: { chat: Chat } }[]>("getUpdates", { limit: 50, allowed_updates: ["message", "my_chat_member"] });
  if (!r.ok) return r;
  const seen = new Map<string, { id: string; name: string; type: string }>();
  for (const u of r.result) {
    const c = u.message?.chat ?? u.my_chat_member?.chat;
    if (!c) continue;
    const name = c.title || [c.first_name, c.last_name].filter(Boolean).join(" ") || c.username || String(c.id);
    seen.set(String(c.id), { id: String(c.id), name: c.username ? `${name} (@${c.username})` : name, type: c.type });
  }
  return { ok: true as const, chats: [...seen.values()] };
}
type Chat = { id: number; type: string; title?: string; first_name?: string; last_name?: string; username?: string };

/** New-visit lines in the last hour, to keep a busy hour from flooding the chat. */
export const VISIT_CAP = 30;
export async function visitLinesLastHour() {
  const store = await db();
  if (!store) return 0;
  const [r] = await store
    .select({ n: sql<number>`count(*)::int` })
    .from(sessions)
    .where(sql`${sessions.startedAt} > now() - interval '1 hour' and ${sessions.tgMsgId} is not null`);
  return r?.n ?? 0;
}
