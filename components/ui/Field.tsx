"use client";

import { useEffect, useId, useState } from "react";

const baseInput =
  "w-full border-b border-navy/25 bg-transparent px-0 py-3 font-display text-xl text-navy-deep " +
  "placeholder:font-body placeholder:text-sm placeholder:text-navy/40 " +
  "transition-colors focus:border-navy focus:outline-none";

/**
 * Shared style for every form label. Kept in one place because these were
 * originally 10px at 70% opacity with wide tracking, which was hard to read.
 * Exported so the fieldset legends in RsvpForm match exactly.
 */
export const fieldLabel =
  "mb-2 block text-xs uppercase tracking-[0.14em] text-navy/85";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  maxLength = 80,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className={fieldLabel}
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        required={required}
        className={baseInput}
      />
    </div>
  );
}

/**
 * Digits-only field. Keeps its own text buffer so the box can sit empty while
 * someone is retyping, instead of snapping back to 0 on the first keystroke.
 */
export function NumberField({
  label,
  value,
  onChange,
  max,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max: number;
  placeholder?: string;
}) {
  const id = useId();
  const [text, setText] = useState(String(value));

  // Re-sync when the value is changed from outside (e.g. loading a saved reply).
  useEffect(() => setText(String(value)), [value]);

  return (
    <div>
      <label
        htmlFor={id}
        className={fieldLabel}
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={text}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
          if (digits === "") {
            setText("");
            onChange(0);
            return;
          }
          const n = Math.min(Number(digits), max);
          setText(String(n));
          onChange(n);
        }}
        onBlur={() => setText(String(value))}
        placeholder={placeholder}
        className={`${baseInput} w-24`}
      />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  maxLength = 500,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className={fieldLabel}
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className={`${baseInput} resize-none font-body text-base leading-relaxed`}
      />
    </div>
  );
}
