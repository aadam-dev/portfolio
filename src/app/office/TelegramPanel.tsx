"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, Search } from "lucide-react";
import { findChats, pickChat, type ChatList } from "./actions";
import { isIgnored, setIgnored } from "@/lib/ignore";

const GOOD = "#0ca30c";
const WARN = "#fab219";

/** Where the website updates go, and a way to pick the chat. */
export default function TelegramPanel({ token, chat, fromEnv }: { token: boolean; chat: string | null; fromEnv: boolean }) {
  const [state, find, pending] = useActionState<ChatList, FormData>(() => findChats(), {});
  const ready = token && !!chat;
  return (
    <section className="card p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-medium text-[var(--ink-2)]">Telegram updates</h2>
          <p className="mt-2 inline-flex items-center gap-2 text-[15px] font-medium">
            {ready ? <CheckCircle2 className="w-4 h-4" style={{ color: GOOD }} /> : <CircleDashed className="w-4 h-4" style={{ color: WARN }} />}
            {ready ? "Updates are on" : token ? "Pick a chat" : "Add the bot token"}
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--ink-3)]">
            {!token
              ? "Set TELEGRAM_BOT_TOKEN in Vercel, then redeploy."
              : chat
                ? `Sending to chat ${chat}${fromEnv ? ", set by TELEGRAM_CHAT_ID" : ""}. Each update starts with “🌐 aadambuilds.dev” and ends with #site.`
                : "Send any message to your bot in Telegram, then find your chat here."}
          </p>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-[var(--ink-2)]">
        {[
          ["👋", "New visit", "silent"],
          ["🔔", "Notable visit", "with sound"],
          ["📩", "Messages", "with sound"],
          ["📊", "Daily digest", "08:00"],
        ].map(([e, l, n]) => (
          <li key={l} className="rounded-lg border border-[var(--line)] px-2.5 py-2">
            <span aria-hidden>{e}</span> {l} <span className="block text-[11px] text-[var(--ink-4)]">{n}</span>
          </li>
        ))}
      </ul>
      {token && !fromEnv && (
        <form action={find} className="mt-4">
          <button className="btn btn-line !h-9 !px-4 !text-[13px]" disabled={pending}>
            <Search className="w-3.5 h-3.5" /> {pending ? "Looking" : chat ? "Change chat" : "Find my chat"}
          </button>
        </form>
      )}
      {state.error && (
        <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: WARN }}>
          Telegram said: {state.error}. If the bot runs a webhook for other jobs, set TELEGRAM_CHAT_ID in Vercel instead.
        </p>
      )}
      {state.chats && !state.chats.length && <p className="mt-3 text-[12.5px] text-[var(--ink-3)]">No recent messages to the bot. Send it one and try again.</p>}
      {state.chats && state.chats.length > 0 && (
        <ul className="mt-3 divide-y divide-[var(--line)] rounded-xl border border-[var(--line)]">
          {state.chats.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-[13px]">
              <span className="min-w-0 truncate">
                {c.name} <span className="text-[var(--ink-3)]">{c.type}</span>
              </span>
              <form action={pickChat}>
                <input type="hidden" name="id" value={c.id} />
                <button className="btn btn-solid !h-8 !px-3 !text-[12.5px]">Use this chat</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Signing in marks this browser as yours (scout-ignore), so your own visits never alert. */
export function OwnerMark() {
  useEffect(() => setIgnored(true), []);
  return null;
}

/** Whether this browser is counted, with a switch, and how to do the same on other devices. */
export function ThisBrowser() {
  const [ignored, setState] = useState<boolean | null>(null);
  useEffect(() => {
    const t = window.setTimeout(() => setState(isIgnored()), 0);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <section className="card p-5 md:p-6">
      <h2 className="text-[13px] font-medium text-[var(--ink-2)]">This browser</h2>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-[15px] font-medium">
          {ignored ? <CheckCircle2 className="w-4 h-4" style={{ color: GOOD }} /> : <CircleDashed className="w-4 h-4" style={{ color: WARN }} />}
          {ignored == null ? "Checking" : ignored ? "Not counted" : "Counted as a visitor"}
        </p>
        {ignored != null && (
          <button
            type="button"
            className="btn btn-line !h-8 !px-3 !text-[12.5px]"
            onClick={() => {
              setIgnored(!ignored);
              setState(!ignored);
            }}
          >
            {ignored ? "Count it again" : "Stop counting this browser"}
          </button>
        )}
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-3)]">
        On your other devices, open <code className="text-[var(--ink-2)]">aadambuilds.dev/?scout-ignore=1</code> once, or run{" "}
        <code className="text-[var(--ink-2)]">localStorage.setItem(&quot;scout-ignore&quot;,&quot;1&quot;)</code> in the console. The same key silences the Scout tracker.
      </p>
    </section>
  );
}
