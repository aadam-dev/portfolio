import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/** The back office uses one password and a signed, httpOnly cookie that lasts 14 days. */
export const COOKIE = "office";
const DAYS = 14;

const secret = () => process.env.SESSION_SECRET ?? "";
const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("base64url");

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function officeConfigured() {
  return !!process.env.OFFICE_PASSWORD && secret().length >= 16;
}

export function checkPassword(p: string) {
  const want = process.env.OFFICE_PASSWORD ?? "";
  return !!want && same(p, want);
}

export function issue() {
  const exp = String(Date.now() + DAYS * 864e5);
  return { value: `${exp}.${sign(exp)}`, maxAge: DAYS * 86400 };
}

export async function signedIn() {
  if (!officeConfigured()) return false;
  const v = (await cookies()).get(COOKIE)?.value ?? "";
  const [exp, mac] = v.split(".");
  if (!exp || !mac || !same(mac, sign(exp))) return false;
  return Number(exp) > Date.now();
}
