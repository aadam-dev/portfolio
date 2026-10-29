import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";
import { SCHEMA_SQL } from "./sql";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

/** Supabase (DATABASE_URL, or POSTGRES_URL from the Supabase Vercel integration). */
export const dbUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

let pool: Pool | null = null;
let cached: Db | null | undefined;
let prepared: Promise<boolean> | null = null;

function connect(): Db | null {
  if (cached !== undefined) return cached;
  const url = dbUrl();
  if (!url) return (cached = null);
  // Supabase's pooler presents its own CA; the connection is still TLS.
  const ssl = /supabase\.(co|com)|pooler\.supabase/.test(url) ? { rejectUnauthorized: false } : undefined;
  pool = new Pool({ connectionString: url.replace(/[?&]sslmode=[^&]*/, ""), max: 3, ssl });
  cached = drizzle(pool, { schema }) as unknown as Db;
  return cached;
}

/** Create any missing tables once per server instance (every statement is idempotent). */
function ready(): Promise<boolean> {
  if (!prepared) {
    prepared = (pool as Pool)
      .query(SCHEMA_SQL)
      .then(() => true)
      .catch((e) => {
        console.error("[db] schema setup failed", e);
        prepared = null; // try again on the next request
        return false;
      });
  }
  return prepared;
}

/**
 * The database, or null when no connection string is set: every caller
 * treats null as "storage off" and carries on, so the site never breaks
 * without it.
 */
export async function db(): Promise<Db | null> {
  const d = connect();
  if (!d) return null;
  await ready();
  return d;
}

export { schema };
