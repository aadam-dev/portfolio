"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const LOCALES: { code: string; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "ع" },
];

function persistLocale(code: string) {
  document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; samesite=lax`;
}

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const [, startTransition] = useTransition();

  const setLocale = (code: string) => {
    if (code === locale) return;
    persistLocale(code);
    startTransition(() => router.refresh());
  };

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={`inline-flex items-center gap-0.5 rounded-full border border-[var(--line-strong)] p-0.5 ${className}`}
    >
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          onClick={() => setLocale(l.code)}
          aria-pressed={locale === l.code}
          className={`px-2.5 py-1.5 rounded-full font-mono text-[11px] tracking-[0.08em] uppercase transition-colors ${
            locale === l.code
              ? "bg-white text-black"
              : "text-[var(--ink-3)] hover:text-white"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
