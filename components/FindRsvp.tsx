"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/locale";
import { isCodeShaped, type PublicRsvp } from "@/lib/rsvp";
import { TextField } from "@/components/ui/Field";
import {
  RsvpForm,
  valuesFromRsvp,
  type RsvpFormValues,
} from "@/components/RsvpForm";

type View =
  | { kind: "search" }
  | { kind: "found"; rsvp: PublicRsvp }
  | { kind: "edit"; rsvp: PublicRsvp; values: RsvpFormValues }
  | { kind: "cancelled" };

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

export function FindRsvp() {
  const { t, fill, locale } = useLocale();
  const reduced = useReducedMotion();

  const [view, setView] = useState<View>({ kind: "search" });
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const motionProps = reduced ? {} : fade;

  async function search() {
    if (!isCodeShaped(query)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (res.status === 404) {
        setError(t.lookup.notFound);
        return;
      }
      if (!res.ok) {
        setError(t.rsvp.errorGeneric);
        return;
      }
      const json = (await res.json()) as { rsvp: PublicRsvp };
      setView({ kind: "found", rsvp: json.rsvp });
    } catch {
      setError(t.rsvp.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (view.kind !== "edit") return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/rsvp/${view.rsvp.code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: view.values.name,
          attending: view.values.attending,
          partySize: view.values.partySize,
          note: view.values.note,
          locale,
        }),
      });
      if (!res.ok) {
        setError(t.rsvp.errorGeneric);
        return;
      }
      const json = (await res.json()) as { rsvp: PublicRsvp };
      setView({ kind: "found", rsvp: json.rsvp });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 3500);
    } catch {
      setError(t.rsvp.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  async function cancelRsvp() {
    if (view.kind !== "found") return;
    if (!window.confirm(t.lookup.cancelConfirm)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/rsvp/${view.rsvp.code}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError(t.rsvp.errorGeneric);
        return;
      }
      setView({ kind: "cancelled" });
    } catch {
      setError(t.rsvp.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-xl">
      <AnimatePresence mode="wait">
        {/* ---------- SEARCH ---------- */}
        {view.kind === "search" && (
          <motion.div key="search" {...motionProps}>
            <div className="mb-10 flex flex-col items-center text-center">
              <h1 className="font-display text-4xl text-navy-deep sm:text-5xl">
                {t.lookup.title}
              </h1>
              <p className="mt-3 max-w-md whitespace-pre-line text-sm leading-relaxed text-navy/80">
                {t.lookup.subtitle}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                search();
              }}
              className="flex flex-col gap-6"
            >
              <TextField
                label={t.lookup.inputLabel}
                value={query}
                onChange={(v) => setQuery(v.toUpperCase())}
                placeholder={t.lookup.inputPlaceholder}
                autoComplete="off"
                maxLength={6}
              />
              {error && (
                <p className="text-sm text-navy" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={busy || !isCodeShaped(query)}
                className="group relative overflow-hidden rounded-xl bg-navy-deep px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-paper disabled:cursor-not-allowed disabled:opacity-35"
              >
                <span className="relative z-10">
                  {busy ? t.lookup.searching : t.lookup.search}
                </span>
                <span className="absolute inset-0 z-0 -translate-x-full bg-navy transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-disabled:translate-x-full" />
              </button>
            </form>

            <BackLink label={t.lookup.back} />
          </motion.div>
        )}

        {/* ---------- FOUND ---------- */}
        {view.kind === "found" && (
          <motion.div key="found" {...motionProps}>
            <div className="mb-8 flex flex-col items-center text-center">
              <h1 className="font-display text-4xl text-navy-deep sm:text-5xl">
                {t.lookup.foundTitle}
              </h1>
              {savedFlash && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-sm text-navy"
                >
                  {t.lookup.saved}
                </motion.p>
              )}
            </div>

            <div className="border border-navy-soft/30 bg-paper-warm/40 px-6 py-8 text-center sm:px-10">
              <p className="font-display text-3xl text-navy-deep sm:text-4xl">
                {view.rsvp.name}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-navy">
                {view.rsvp.attending
                  ? t.lookup.attending
                  : t.lookup.notAttending}
              </p>
              {view.rsvp.attending && (
                <p className="mt-1 text-sm text-navy/80">
                  {fill(t.lookup.partySize, { n: view.rsvp.partySize })}
                </p>
              )}
              <p className="mt-6 text-xs uppercase tracking-[0.14em] text-navy/75">
                {t.success.codeLabel} · {view.rsvp.code}
              </p>
            </div>

            {error && (
              <p className="mt-4 text-center text-sm text-navy" role="alert">
                {error}
              </p>
            )}

            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setView({
                    kind: "edit",
                    rsvp: view.rsvp,
                    values: valuesFromRsvp(view.rsvp),
                  })
                }
                className="w-full rounded-xl bg-navy-deep px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-paper transition-colors hover:bg-navy"
              >
                {t.lookup.edit}
              </button>
              <button
                type="button"
                onClick={cancelRsvp}
                disabled={busy}
                className="text-[11px] uppercase tracking-[0.18em] text-navy/60 underline-offset-4 transition-colors hover:text-navy hover:underline disabled:opacity-40"
              >
                {t.lookup.cancel}
              </button>
            </div>

            <BackLink label={t.lookup.back} />
          </motion.div>
        )}

        {/* ---------- EDIT ---------- */}
        {view.kind === "edit" && (
          <motion.div key="edit" {...motionProps}>
            <div className="mb-10 flex flex-col items-center text-center">
              <h1 className="font-display text-4xl text-navy-deep sm:text-5xl">
                {t.lookup.edit}
              </h1>
            </div>

            <RsvpForm
              values={view.values}
              onChange={(values) => setView({ ...view, values })}
              onSubmit={save}
              submitting={busy}
              error={error}
              submitLabel={t.lookup.save}
              lockName
            />

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setView({ kind: "found", rsvp: view.rsvp })}
                className="text-[11px] uppercase tracking-[0.18em] text-navy/60 transition-colors hover:text-navy"
              >
                {t.lookup.back}
              </button>
            </div>
          </motion.div>
        )}

        {/* ---------- CANCELLED ---------- */}
        {view.kind === "cancelled" && (
          <motion.div
            key="cancelled"
            {...motionProps}
            className="flex flex-col items-center text-center"
          >
            <p className="font-display text-3xl text-navy-deep sm:text-4xl">
              {t.lookup.cancelled}
            </p>
            <BackLink label={t.lookup.back} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BackLink({ label }: { label: string }) {
  return (
    <div className="mt-12 text-center">
      <Link
        href="/"
        className="border-b border-navy/40 pb-0.5 text-[11px] uppercase tracking-[0.18em] text-navy transition-colors hover:border-navy"
      >
        {label}
      </Link>
    </div>
  );
}
