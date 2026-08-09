"use client";

import { motion } from "motion/react";
import { LOCALES, LOCALE_LABELS, LOCALE_NAMES } from "@/content/i18n";
import { useLocale } from "@/lib/locale";

export function LanguageSwitcher({
  className = "fixed inset-x-0 top-3 z-50 flex justify-center sm:top-5",
}: {
  /** Wrapper positioning. Defaults to pinned to the top of the viewport. */
  className?: string;
}) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className={className} role="group" aria-label={t.lang.label}>
      <div className="flex items-center gap-1 rounded-full border border-navy/25 bg-paper/85 px-1 py-1 shadow-[0_2px_10px_-4px_rgba(43,53,99,0.3)] backdrop-blur-md">
        {LOCALES.map((code) => {
          const active = code === locale;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              aria-label={LOCALE_NAMES[code]}
              aria-pressed={active}
              className="relative rounded-full px-3 py-1 text-[10px] font-medium tracking-[0.16em] sm:px-3.5 sm:text-[11px]"
            >
              {active && (
                <motion.span
                  layoutId="lang-pill"
                  className="absolute inset-0 rounded-full bg-navy"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className={
                  active
                    ? "relative text-paper"
                    : "relative text-navy/55 transition-colors hover:text-navy"
                }
              >
                {LOCALE_LABELS[code]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
