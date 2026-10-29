import { NextResponse } from "next/server";
import { dbHealth } from "@/db";
import { telegramConfigured } from "@/lib/office/telegram";
import { mailConfigured } from "@/lib/office/mail";

export const dynamic = "force-dynamic";

/** Setup status, without values: database reachable and tables made, Telegram and email configured. */
export async function GET() {
  const db = await dbHealth();
  return NextResponse.json({ db, telegram: telegramConfigured(), email: mailConfigured() }, { headers: { "cache-control": "no-store" } });
}
