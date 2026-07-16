"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { EASE_OUT } from "@/lib/motion";

const BUDGETS = ["b0", "b1", "b2", "b3", "b4"] as const;
const WHATSAPP = "233559602056";

type Status = "idle" | "sending" | "sent" | "fallback";

export default function InquiryForm() {
  const t = useTranslations("form");
  const [status, setStatus] = useState<Status>("idle");
  const [invalid, setInvalid] = useState(false);
  const [fields, setFields] = useState({ name: "", contact: "", budget: "b0", message: "" });

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  const whatsappUrl = () => {
    const text = `Hi Aadam — project inquiry.\nName: ${fields.name}\nContact: ${fields.contact}\nBudget: ${t(`budgets.${fields.budget}`)}\n\n${fields.message}`;
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name.trim() || !fields.contact.trim() || !fields.message.trim()) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, budget: t(`budgets.${fields.budget}`) }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
    } catch {
      // network failure — fall through to WhatsApp
    }
    setStatus("fallback");
    window.open(whatsappUrl(), "_blank", "noopener,noreferrer");
  };

  const inputCls =
    "w-full rounded-xl border border-[var(--line-strong)] bg-[var(--surface-2)] px-4 py-3 text-[15px] text-[var(--foreground)] placeholder:text-[var(--ink-4)] focus:outline-none focus:border-[var(--accent)] transition-colors";

  if (status === "sent") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        role="status"
        className="mt-12 max-w-xl rounded-2xl border border-[var(--line-strong)] bg-[var(--surface-2)] p-6 text-[15px] text-[var(--foreground)]"
      >
        {t("sent")}
      </motion.p>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      onSubmit={submit}
      className="mt-14 max-w-xl"
      noValidate
    >
      <p className="eyebrow mb-6">{t("title")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          value={fields.name}
          onChange={set("name")}
          placeholder={t("name")}
          autoComplete="name"
          aria-label={t("name")}
          className={inputCls}
        />
        <input
          value={fields.contact}
          onChange={set("contact")}
          placeholder={t("contact")}
          autoComplete="email"
          inputMode="email"
          aria-label={t("contact")}
          className={inputCls}
        />
      </div>
      <select
        value={fields.budget}
        onChange={set("budget")}
        aria-label={t("budget")}
        className={`${inputCls} mt-3 appearance-none`}
      >
        {BUDGETS.map((b) => (
          <option key={b} value={b} className="bg-[var(--surface-2)]">
            {t("budget")}: {t(`budgets.${b}`)}
          </option>
        ))}
      </select>
      <textarea
        value={fields.message}
        onChange={set("message")}
        placeholder={t("message")}
        rows={4}
        aria-label={t("message")}
        className={`${inputCls} mt-3 resize-y`}
      />

      {invalid && (
        <p role="alert" className="mt-3 text-[13px] text-[var(--accent)]">
          {t("required")}
        </p>
      )}
      {status === "fallback" && (
        <p role="alert" className="mt-3 text-[13px] text-[var(--ink-2)]">
          {t("error")}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-white text-black px-7 py-3.5 text-sm font-medium disabled:opacity-60 hover:bg-[var(--accent)] transition-colors"
        >
          {status === "sending" ? (
            <>
              {t("sending")} <Loader2 className="w-4 h-4 animate-spin" />
            </>
          ) : (
            <>
              {t("send")} <ArrowUpRight className="w-4 h-4" />
            </>
          )}
        </button>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-3)] hover:text-[#25d366] transition-colors"
        >
          {t("whatsappInstead")} ↗
        </a>
      </div>
    </motion.form>
  );
}
