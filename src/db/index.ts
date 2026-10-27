import "server-only";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

let cached: Db | null | undefined;

/**
 * The database, or null when DATABASE_URL is not set: every caller treats
 * null as "storage off" and carries on, so the site never breaks without it.
 * Neon URLs use the HTTP driver (fast from serverless); anything else uses pg.
 */
export function db(): Db | null {
  if (cached !== undefined) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) return (cached = null);
  cached = (
    /neon\.tech/.test(url)
      ? neonDrizzle(neon(url), { schema })
      : pgDrizzle(new Pool({ connectionString: url, max: 3 }), { schema })
  ) as unknown as Db;
  return cached;
}

export { schema };
