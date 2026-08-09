"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useLocale } from "@/lib/locale";
import { MAX_PARTY, type PublicRsvp } from "@/lib/rsvp";
import {
  fieldLabel,
  NumberField,
  TextArea,
  TextField,
} from "@/components/ui/Field";

const collapse = {
  hidden: { height: 0, opacity: 0 },
  show: { height: "auto", opacity: 1 },
};
const spring = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

export type RsvpFormValues = {
  name: string;
  attending: boolean | null;
  partySize: number;
  note: string;
};

export function emptyValues(): RsvpFormValues {
  return {
    name: "",
    attending: null,
    partySize: 1,
    note: "",
  };
}

export function valuesFromRsvp(rsvp: PublicRsvp): RsvpFormValues {
  return {
    name: rsvp.name,
    attending: rsvp.attending,
    partySize: rsvp.partySize,
    note: rsvp.note ?? "",
  };
}

export function RsvpForm({
  values,
  onChange,
  onSubmit,
  submitting,
  error,
  submitLabel,
  lockName = false,
}: {
  values: RsvpFormValues;
  onChange: (next: RsvpFormValues) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
  submitLabel: string;
  lockName?: boolean;
}) {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const [touched, setTouched] = useState(false);

  const set = <K extends keyof RsvpFormValues>(
    key: K,
    value: RsvpFormValues[K],
  ) => onChange({ ...values, [key]: value });

  /** The form asks for *additional* guests; the record stores the total. */
  const additional = values.partySize - 1;

  const setAdditional = (n: number) =>
    set("partySize", Math.min(Math.max(n + 1, 1), MAX_PARTY));

  const nameMissing = touched && values.name.trim().length < 2;
  const canSubmit =
    values.name.trim().length >= 2 && values.attending !== null && !submitting;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (canSubmit) onSubmit();
      }}
      className="flex flex-col gap-8"
    >
      {lockName ? (
        <div>
          <p className={fieldLabel}>{t.rsvp.nameLabel}</p>
          <p className="border-b border-navy/15 py-3 font-display text-xl text-navy-deep/70">
            {values.name}
          </p>
        </div>
      ) : (
        <div>
          <TextField
            label={t.rsvp.nameLabel}
            value={values.name}
            onChange={(v) => set("name", v)}
            placeholder={t.rsvp.namePlaceholder}
            autoComplete="name"
          />
          {nameMissing && (
            <p className="mt-2 text-xs text-navy">
              {t.rsvp.errorRequired}
            </p>
          )}
        </div>
      )}

      {/* Attending toggle */}
      <fieldset>
        <legend className={fieldLabel}>
          {t.rsvp.attendingLabel}
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {([true, false] as const).map((choice) => {
            const active = values.attending === choice;
            return (
              <button
                key={String(choice)}
                type="button"
                onClick={() => set("attending", choice)}
                aria-pressed={active}
                className={`relative overflow-hidden rounded-xl border px-4 py-4 text-sm tracking-wide transition-colors ${
                  active
                    ? "border-navy text-paper"
                    : "border-navy/25 text-navy-deep/70 hover:border-navy/50"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="attend-fill"
                    className="absolute inset-0 bg-navy"
                    transition={{ type: "spring", stiffness: 330, damping: 34 }}
                  />
                )}
                <span className="relative">
                  {choice ? t.rsvp.yes : t.rsvp.no}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Party size, only when attending */}
      <AnimatePresence initial={false}>
        {values.attending === true && (
          <motion.div
            key="party"
            variants={reduced ? undefined : collapse}
            initial={reduced ? false : "hidden"}
            animate="show"
            exit={reduced ? undefined : "hidden"}
            transition={spring}
            className="overflow-hidden"
          >
            <div className="pt-px">
              <NumberField
                label={t.rsvp.guestsLabel}
                value={additional}
                onChange={setAdditional}
                max={MAX_PARTY - 1}
                placeholder="0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TextArea
        label={t.rsvp.noteLabel}
        value={values.note}
        onChange={(v) => set("note", v)}
        placeholder={t.rsvp.notePlaceholder}
      />

      {error && (
        <motion.p
          initial={reduced ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-navy"
          role="alert"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={!canSubmit}
        whileHover={reduced || !canSubmit ? undefined : { scale: 1.015 }}
        whileTap={reduced || !canSubmit ? undefined : { scale: 0.985 }}
        className="group relative overflow-hidden rounded-xl bg-navy-deep px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-paper transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
      >
        <span className="relative z-10">
          {submitting ? t.rsvp.submitting : submitLabel}
        </span>
        <span className="absolute inset-0 z-0 -translate-x-full bg-navy transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-disabled:translate-x-full" />
      </motion.button>
    </form>
  );
}
