import { NextResponse } from "next/server";
import { db } from "@/db";
import { listItems } from "@/lib/office/items";
import { visibleProjects } from "@/lib/projects";

/** What I'm building right now, from the Office's projects board: names of public projects only. */
export async function GET() {
  const headers = { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400" };
  try {
    const store = await db();
    if (!store) return NextResponse.json({ building: [] }, { headers });
    const rows = await listItems(store, ["project"]);
    // only projects already public on the site: the board also holds private client work
    const known = new Set(visibleProjects().map((p) => p.name.toLowerCase()));
    const building = rows.filter((r) => r.status === "building" && known.has(r.title.toLowerCase())).slice(0, 5).map((r) => r.title);
    return NextResponse.json({ building }, { headers });
  } catch {
    return NextResponse.json({ building: [] }, { headers });
  }
}
