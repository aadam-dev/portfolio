import { db } from "@/db";
import { anyGuestImage } from "@/lib/guests";
import { signedIn } from "@/lib/office/auth";

export const runtime = "nodejs";

/** Any visitor photo, pending included, for me to look at before approving. */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await signedIn())) return new Response("Not found", { status: 404 });
  const id = Number((await params).id);
  const store = await db().catch(() => null);
  const img = store && Number.isInteger(id) ? await anyGuestImage(store, id) : null;
  if (!img) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(img.image!), { headers: { "Content-Type": img.mime ?? "image/jpeg", "Cache-Control": "private, no-store" } });
}
