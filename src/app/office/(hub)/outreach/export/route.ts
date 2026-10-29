import { NextResponse } from "next/server";
import { db } from "@/db";
import { signedIn } from "@/lib/office/auth";
import { listItems } from "@/lib/office/items";

const cell = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
};

/** The outreach tracker as a CSV, for a spreadsheet or a backup. */
export async function GET() {
  if (!(await signedIn())) return NextResponse.redirect(new URL("/office/login", "https://aadambuilds.dev"));
  const store = await db();
  if (!store) return new NextResponse("No database", { status: 503 });
  const rows = await listItems(store, ["outreach"]);
  const cols = ["name", "stage", "sector", "area", "channel", "phone", "email", "person", "pitch", "next_follow_up", "notes"];
  const lines = [cols.join(",")].concat(
    rows.map((r) => {
      const d = r.data as Record<string, unknown>;
      return [r.title, r.status, d.sector, d.area, d.channel, d.phone, d.email, d.person, d.pitch, r.due, d.notes].map(cell).join(",");
    }),
  );
  return new NextResponse(lines.join("\n") + "\n", { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="outreach-${new Date().toISOString().slice(0, 10)}.csv"` } });
}
