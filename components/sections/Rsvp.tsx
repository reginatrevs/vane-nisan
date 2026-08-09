"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/locale";
import type { PublicRsvp } from "@/lib/rsvp";
import { emptyValues, RsvpForm, type RsvpFormValues } from "@/components/RsvpForm";
import { CodeCard } from "@/components/CodeCard";

export function Rsvp() {
  const { t, locale } = useLocale();
  const reduced = useReducedMotion();

  const [values, setValues] = useState<RsvpFormValues>(emptyValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicRsvp | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          attending: values.attending,
          partySize: values.partySize,
          note: values.note,
          locale,
        }),
      });

      if (!res.ok) {
        setError(t.rsvp.errorGeneric);
        return;
      }

      const json = (await res.json()) as { rsvp: PublicRsvp };
      setResult(json.rsvp);
    } catch {
      setError(t.rsvp.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="rsvp"
      className="relative overflow-hidden bg-paper px-6 pb-20 pt-16 sm:pb-24 sm:pt-24"
    >
      <div className="mx-auto w-full max-w-xl">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="done"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center"
            >
              <h2 className="font-serif italic text-5xl text-navy-deep sm:text-5xl">
                {result.attending ? t.success.yesTitle : t.success.noTitle}
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy/75">
                {result.attending ? t.success.yesBody : t.success.noBody}
              </p>

              <CodeCard code={result.code} className="mt-9" />

              <Link
                href="/rsvp/find"
                className="mt-8 border-b border-navy/35 pb-0.5 text-[11px] uppercase tracking-[0.18em] text-navy transition-colors hover:border-navy"
              >
                {t.success.editLink}
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={false}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-11 flex flex-col items-center text-center">
                <span className="h-0.5 w-16 rounded-full bg-navy/45 sm:w-20" />
                <h2 className="mt-7 font-serif italic text-5xl text-navy-deep sm:text-6xl">
                  {t.rsvp.title}
                </h2>
              </div>

              <RsvpForm
                values={values}
                onChange={setValues}
                onSubmit={submit}
                submitting={submitting}
                error={error}
                submitLabel={t.rsvp.submit}
              />

              <div className="mt-10 flex flex-col items-center gap-1.5 text-center">
                <span className="text-xs uppercase tracking-[0.14em] text-navy/65">
                  {t.footer.alreadyReplied}
                </span>
                <Link
                  href="/rsvp/find"
                  className="border-b border-navy/35 pb-0.5 text-xs tracking-wide text-navy transition-colors hover:border-navy"
                >
                  {t.footer.lookupLink}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
