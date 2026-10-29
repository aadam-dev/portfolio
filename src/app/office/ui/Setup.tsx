import { CheckCircle2, CircleDashed } from "lucide-react";
import { dbUrl } from "@/db";
import { officeConfigured } from "@/lib/office/auth";
import { mailConfigured } from "@/lib/office/mail";
import { telegramConfigured } from "@/lib/office/telegram";
import { STATUS } from "./parts";

export function Setup({ tables, chat }: { tables: boolean; chat: boolean }) {
  const items: [string, boolean, string, boolean?][] = [
    ["Supabase", !!dbUrl(), "Connect → Transaction pooler URI, as DATABASE_URL in Vercel (or POSTGRES_URL from the Supabase integration)."],
    ["Tables", tables, "Created automatically the first time the site uses the database."],
    ["Telegram bot", telegramConfigured(), "TELEGRAM_BOT_TOKEN from @BotFather, in Vercel only."],
    ["Telegram chat", chat, "Message the bot, then use Find my chat, or set TELEGRAM_CHAT_ID."],
    ["Office sign-in", officeConfigured(), "OFFICE_CODE and SESSION_SECRET in Vercel."],
    ["Daily digest", !!process.env.CRON_SECRET, "CRON_SECRET: any long random string."],
    ["Email confirmations", mailConfigured(), "Optional: RESEND_API_KEY and INQUIRY_FROM (docs/resend.md).", true],
  ];
  const list = (
    <ul className="divide-y divide-[var(--line)]">
      {items.map(([k, ok, how, optional]) => (
        <li key={k} className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
          {ok ? (
            <CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0" style={{ color: STATUS.good }} aria-hidden />
          ) : (
            <CircleDashed className="mt-0.5 w-4 h-4 shrink-0" style={{ color: optional ? "var(--ink-4)" : STATUS.warning }} aria-hidden />
          )}
          <div className="min-w-0">
            <p className="text-[13px] text-[var(--foreground)]">
              {k} <span className="text-[var(--ink-3)]">{ok ? "Ready" : optional ? "Optional" : "To do"}</span>
            </p>
            {!ok && <p className="mt-0.5 text-[12px] leading-snug text-[var(--ink-3)]">{how}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
  const missing = items.filter(([, ok, , optional]) => !ok && !optional).length;
  if (missing) return list;
  return (
    <details className="group">
      <summary className="cursor-pointer list-none flex items-center gap-2 text-[13.5px]">
        <CheckCircle2 className="w-4 h-4" style={{ color: STATUS.good }} aria-hidden />
        Everything is connected
        <span className="ml-auto text-[12px] text-[var(--ink-3)] group-open:hidden">Details</span>
      </summary>
      <div className="mt-4">{list}</div>
    </details>
  );
}

