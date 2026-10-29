import "server-only";
import { db } from "@/db";
import { listItems } from "@/lib/office/items";
import type { Kind } from "@/lib/office/kinds";
import type { Row } from "./Editor";

/** Items of some kinds, shaped for the client boards. */
export async function load(kinds: Kind[]) {
  const store = await db();
  if (!store) return null;
  const rows = (await listItems(store, kinds)) as unknown as Row[];
  return { store, rows, of: (k: Kind) => rows.filter((r) => r.kind === k) };
}
