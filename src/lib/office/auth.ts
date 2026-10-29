import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { loginAttempts, settings } from "@/db/schema";

/**
 * The Office opens with a short numeric code (OFFICE_CODE at first, then
 * whatever is set in Settings, stored as a scrypt hash) and a signed,
 * httpOnly cookie that lasts 30 days. A short code is easy to guess, so
 * wrong tries lock the address for 15 minutes after 5, and lock sign-in
 * for everyone for an hour after 20. Changing the code signs every other
 * device out.
 */
export const COOKIE = "office";
const DAYS = 30;
const CODE_KEY = "office_code";
const EPOCH_KEY = "office_epoch";
export const PER_IP = 5;
export const SITE_WIDE = 20;

const secret = () => process.env.SESSION_SECRET ?? "";
const envCode = () => (process.env.OFFICE_CODE || process.env.OFFICE_PASSWORD || "").trim();
const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("base64url");

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function officeConfigured() {
  return secret().length >= 16 && !!envCode();
}

async function setting(key: string) {
  const store = await db();
  if (!store) return null;
  const [row] = await store
    .select()
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1)
    .catch(() => [] as { value: string }[]);
  return row?.value ?? null;
}

async function put(key: string, value: string) {
  const store = await db();
  if (!store) return false;
  await store
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: sql`now()` } });
  return true;
}

const hash = (code: string, salt = randomBytes(16).toString("base64url")) => `${salt}:${scryptSync(code, salt, 32).toString("base64url")}`;

export async function checkCode(code: string) {
  const stored = await setting(CODE_KEY);
  if (stored) {
    const [salt, h] = stored.split(":");
    return !!salt && !!h && same(hash(code, salt).split(":")[1], h);
  }
  const want = envCode();
  return !!want && same(code, want);
}

/** Sign-in is locked for this address, or for everyone, after too many wrong codes. */
export async function lockState(ip: string | null) {
  try {
    return await lockStateOf(ip);
  } catch (e) {
    // the database is down: sign-in still works, slowed by the pause on each wrong code
    console.error("[office] lock check failed", e);
    return { locked: false, minutes: 0 };
  }
}

async function lockStateOf(ip: string | null): Promise<{ locked: boolean; minutes: number; everyone?: boolean; triesLeft?: number }> {
  const store = await db();
  if (!store) return { locked: false, minutes: 0 };
  const now = Date.now();
  const [mine] = await store
    .select({ n: sql<number>`count(*)::int`, first: sql<string>`min(${loginAttempts.at})` })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.ok, false), eq(loginAttempts.ip, ip ?? ""), gte(loginAttempts.at, new Date(now - 15 * 60e3))));
  const [all] = await store
    .select({ n: sql<number>`count(*)::int` })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.ok, false), gte(loginAttempts.at, new Date(now - 60 * 60e3))));
  if ((all?.n ?? 0) >= SITE_WIDE) return { locked: true, minutes: 60, everyone: true };
  if ((mine?.n ?? 0) >= PER_IP) {
    const left = Math.max(1, Math.ceil((new Date(mine.first).getTime() + 15 * 60e3 - now) / 60e3));
    return { locked: true, minutes: left };
  }
  return { locked: false, minutes: 0, triesLeft: PER_IP - (mine?.n ?? 0) };
}

export async function noteAttempt(ip: string | null, ok: boolean) {
  const store = await db();
  if (!store) return 0;
  return noteAttemptIn(store, ip, ok).catch(() => 0);
}

async function noteAttemptIn(store: NonNullable<Awaited<ReturnType<typeof db>>>, ip: string | null, ok: boolean) {
  await store.insert(loginAttempts).values({ ip: ip ?? "", ok });
  if (ok) return 0;
  const [all] = await store
    .select({ n: sql<number>`count(*)::int` })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.ok, false), gte(loginAttempts.at, new Date(Date.now() - 60 * 60e3))));
  return all?.n ?? 0;
}

const epoch = async () => (await setting(EPOCH_KEY)) ?? "0";

export async function issue() {
  const exp = String(Date.now() + DAYS * 864e5);
  const e = await epoch();
  return { value: `${exp}.${e}.${sign(`${exp}.${e}`)}`, maxAge: DAYS * 86400 };
}

export const cookieOptions = (maxAge: number) => ({ httpOnly: true, secure: true, sameSite: "strict" as const, path: "/office", maxAge });

export async function signedIn() {
  if (secret().length < 16) return false;
  const v = (await cookies()).get(COOKIE)?.value ?? "";
  const [exp, e, mac] = v.split(".");
  if (!exp || !e || !mac || !same(mac, sign(`${exp}.${e}`))) return false;
  if (Number(exp) <= Date.now()) return false;
  return e === (await epoch());
}

/** Store a new code (4 to 8 digits) and sign out every other device. */
export async function changeCode(next: string) {
  if (!/^\d{4,8}$/.test(next)) return { ok: false as const, error: "Use 4 to 8 digits." };
  const ok = await put(CODE_KEY, hash(next));
  if (!ok) return { ok: false as const, error: "The database is not connected, so the code can't be saved." };
  await put(EPOCH_KEY, String(Date.now()));
  return { ok: true as const };
}

export async function codeSource() {
  return (await setting(CODE_KEY)) ? "settings" : envCode() ? "env" : "none";
}
