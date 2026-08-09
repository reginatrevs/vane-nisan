"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useLocale } from "@/lib/locale";

export function CodeCard({
  code,
  className = "",
}: {
  code: string;
  className?: string;
}) {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the code is visible on screen anyway */
    }
  }

  return (
    <div
      className={`relative w-full max-w-xs border border-navy-soft/40 bg-paper px-6 py-7 ${className}`}
    >

      <p className="text-[10px] uppercase tracking-[0.2em] text-navy/70">
        {t.success.codeLabel}
      </p>

      <div className="mt-3 flex items-baseline justify-center gap-1">
        {code.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={reduced ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.25 + i * 0.07, duration: 0.5 }}
            className="font-display text-4xl tracking-[0.1em] text-navy-deep sm:text-5xl"
          >
            {char}
          </motion.span>
        ))}
      </div>

      <button
        type="button"
        onClick={copy}
        className="mt-5 text-[10px] uppercase tracking-[0.2em] text-navy transition-opacity hover:opacity-70"
      >
        {copied ? t.success.copied : t.success.copy}
      </button>
    </div>
  );
}
