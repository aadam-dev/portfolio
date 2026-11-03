import { db } from "@/db";
import { guestImage } from "@/lib/guests";

export const runtime = "nodejs";

/** An approved visitor photo. Pending or rejected ones are never served here. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return new Response("Not found", { status: 404 });
  const store = await db().catch(() => null);
  const img = store ? await guestImage(store, id) : null;
  if (!img) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(img.image!), {
    headers: { "Content-Type": img.mime ?? "image/jpeg", "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff" },
  });
}
