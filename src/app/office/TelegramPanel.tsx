"use client";

import { useActionState, useEffect } from "react";
import { findChats, pickChat, type ChatList } from "./actions";

/** Pick the Telegram chat that gets website updates. */
export default function TelegramPanel({ token, chat, fromEnv }: { token: boolean; chat: string | null; fromEnv: boolean }) {
  const [state, find, pending] = useActionState<ChatList, FormData>(() => findChats(), {});
  return (
    <section className="card p-5">
      <h2 className="label">Telegram updates</h2>
      <p className="mt-3 text-[14px] text-[var(--ink-2)]">
        {!token
          ? "Add TELEGRAM_BOT_TOKEN in Vercel to turn updates on."
          : chat
            ? `Updates go to chat ${chat}${fromEnv ? " (set by TELEGRAM_CHAT_ID)" : ""}.`
            : "Send any message to your bot in Telegram, then find your chat here."}
      </p>
      {token && !fromEnv && (
        <form action={find} className="mt-3">
          <button className="btn btn-line" disabled={pending}>
            {pending ? "Looking" : "Find my chat"}
          </button>
        </form>
      )}
      {state.error && (
        <p className="mt-3 text-[13px] text-[#f0b45a]">
          Telegram said: {state.error}. If the bot runs a webhook for other jobs, set TELEGRAM_CHAT_ID in Vercel instead.
        </p>
      )}
      {state.chats && !state.chats.length && <p className="mt-3 text-[13px] text-[var(--ink-3)]">No recent messages to the bot. Send it one and try again.</p>}
      {state.chats && state.chats.length > 0 && (
        <ul className="mt-3 space-y-2">
          {state.chats.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 text-[14px]">
              <span>
                {c.name} <span className="text-[var(--ink-3)]">({c.type}, {c.id})</span>
              </span>
              <form action={pickChat}>
                <input type="hidden" name="id" value={c.id} />
                <button className="btn btn-line !h-9">Use this chat</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Mark this browser as the owner's, so the tracker skips your own visits. */
export function OwnerMark() {
  useEffect(() => {
    try {
      localStorage.setItem("visit-owner", "1");
    } catch {}
  }, []);
  return null;
}
