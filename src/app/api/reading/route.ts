import { NextResponse } from "next/server";
import { db } from "@/db";
import { listItems } from "@/lib/office/items";

/** What I'm reading, from the Office's Life → Reading board: titles, authors and stage only, never notes. */
const FALLBACK = {
  reading: [{ title: "The Laws of Human Nature", author: "Robert Greene" }],
  next: [
    { title: "Mastery", author: "Robert Greene" },
    { title: "Quiet", author: "Susan Cain" },
  ],
  done: [] as { title: string; author: string }[],
};

export async function GET() {
  const headers = { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" };
  try {
    const store = await db();
    if (!store) return NextResponse.json(FALLBACK, { headers });
    const books = await listItems(store, ["book"]);
    const pick = (status: string) =>
      books
        .filter((b) => b.status === status)
        .slice(0, 6)
        .map((b) => ({ title: b.title, author: String((b.data as { author?: string })?.author ?? "") }));
    return NextResponse.json({ reading: pick("reading"), next: pick("to-read"), done: pick("done") }, { headers });
  } catch {
    return NextResponse.json(FALLBACK, { headers });
  }
}
