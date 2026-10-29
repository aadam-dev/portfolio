import Link from "next/link";
import { redirect } from "next/navigation";
import { gte, sql } from "drizzle-orm";
import { LogOut } from "lucide-react";
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { signedIn } from "@/lib/office/auth";
import { logout } from "../actions";
import { OwnerMark } from "../TelegramPanel";
import Nav from "../ui/Nav";

export const dynamic = "force-dynamic";

const fiveMinutesAgo = () => new Date(Date.now() - 5 * 60e3);

/** The Office: one shell for every section, signed in or sent to the code pad. */
export default async function HubLayout({ children }: { children: React.ReactNode }) {
  if (!(await signedIn())) redirect("/office/login");
  const store = await db();
  const live = store
    ? ((await store.select({ n: sql<number>`count(*)::int` }).from(sessions).where(gte(sessions.lastSeen, fiveMinutesAgo())).catch(() => [{ n: 0 }]))[0]?.n ?? 0)
    : 0;
  return (
    <div className="theme-fixed min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <OwnerMark />
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[#0b0a08]/85 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-14 flex items-center gap-3">
          <Link href="/office" className="flex items-center gap-2 text-[15px] font-semibold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" /> Aadam
            <span className="text-[var(--ink-4)] font-normal">/</span>
            <span className="font-normal text-[var(--ink-2)]">Office</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/office/site" className="hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-full border border-[var(--line)] text-[12.5px] text-[var(--ink-2)] hover:border-[var(--line-strong)]">
              <span className="relative flex w-2 h-2">
                {live > 0 && <span className="absolute inset-0 rounded-full animate-ping bg-[#0ca30c] opacity-60" />}
                <span className="relative w-2 h-2 rounded-full" style={{ background: live ? "#0ca30c" : "var(--ink-4)" }} />
              </span>
              {live} on the site now
            </Link>
            <Link href="/" className="hidden md:inline-flex h-9 px-3 items-center rounded-full border border-[var(--line)] text-[12.5px] text-[var(--ink-2)] hover:border-[var(--line-strong)]">
              View site
            </Link>
            <form action={logout}>
              <button className="grid place-items-center w-9 h-9 rounded-full border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--foreground)]" aria-label="Sign out" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 md:grid md:grid-cols-[188px_minmax(0,1fr)] md:gap-8">
        <Nav />
        <main className="min-w-0 pt-5 md:pt-7 pb-28 md:pb-16">{children}</main>
      </div>
    </div>
  );
}
