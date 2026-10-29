import { Send } from "lucide-react";
import { codeSource } from "@/lib/office/auth";
import { chatId, telegramConfigured } from "@/lib/office/telegram";
import { dbHealth } from "@/db";
import { testTelegram } from "../../actions";
import TelegramPanel, { ThisBrowser } from "../../TelegramPanel";
import CodeForm from "../../ui/CodeForm";
import { Panel } from "../../ui/parts";
import { Setup } from "../../ui/Setup";

export const dynamic = "force-dynamic";

export default async function Settings({ searchParams }: { searchParams: Promise<{ test?: string; chat?: string }> }) {
  const { test, chat: chatNote } = await searchParams;
  const chat = telegramConfigured() ? await chatId() : null;
  const fromEnv = !!process.env.TELEGRAM_CHAT_ID?.trim();
  const health = await dbHealth();
  const note = test ? (test === "sent" ? "Test sent to Telegram." : `Telegram test failed: ${test}`) : chatNote ? (chatNote === "saved" ? "Chat saved. Updates will go there." : `Chat not saved: ${chatNote}`) : null;
  return (
    <div className="space-y-4 md:space-y-5 max-w-[860px]">
      <h1 className="text-[26px] md:text-[30px] font-semibold tracking-[-0.02em]">Settings</h1>
      {note && <p className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-[13px] text-[var(--ink-2)]">{note}</p>}
      <Panel title="Sign-in code">
        <CodeForm source={await codeSource()} />
      </Panel>
      <TelegramPanel token={telegramConfigured()} chat={chat} fromEnv={fromEnv} />
      {telegramConfigured() && chat && (
        <form action={testTelegram}>
          <button className="btn btn-line !h-10 !px-4 !text-[13px]">
            <Send className="w-4 h-4" /> Send a test update
          </button>
        </form>
      )}
      <ThisBrowser />
      <Panel title="Setup">
        <Setup tables={health.ok} chat={!!chat} />
      </Panel>
    </div>
  );
}
