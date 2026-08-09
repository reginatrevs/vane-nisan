import { event } from "@/content/event";
import { LOCALES, type Locale } from "@/content/i18n";

/**
 * Normalise a name for duplicate detection and lookup:
 * strip accents, collapse whitespace, lowercase.
 * "José  MARÍA " -> "jose maria"
 * Turkish dotted/dotless i is folded so "Ayşe" and "AYŞE" match.
 */
export function nameKey(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Confirmation code. Crockford-ish alphabet: no 0/O/1/I/L to avoid
 * people mistyping when reading it off a screen.
 */
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateCode(length = 6): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return out;
}

export function isCodeShaped(input: string): boolean {
  return new RegExp(`^[${CODE_ALPHABET}]{6}$`).test(input.toUpperCase().trim());
}

export const MAX_PARTY = event.maxGuests + 1;

export type RsvpInput = {
  name: string;
  attending: boolean;
  partySize: number;
  note: string | null;
  locale: Locale;
};

export type ValidationResult =
  | { ok: true; value: RsvpInput }
  | { ok: false; error: string };

/** Validate and clean an RSVP payload arriving from the browser. */
export function validateRsvp(raw: unknown): ValidationResult {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "invalid_payload" };
  }
  const body = raw as Record<string, unknown>;

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "invalid_name" };
  }

  if (typeof body.attending !== "boolean") {
    return { ok: false, error: "invalid_attending" };
  }
  const attending = body.attending;

  let partySize = 1;
  if (attending) {
    const n = Number(body.partySize);
    if (!Number.isInteger(n) || n < 1 || n > MAX_PARTY) {
      return { ok: false, error: "invalid_party_size" };
    }
    partySize = n;
  }

  const noteRaw = typeof body.note === "string" ? body.note.trim() : "";
  const note = noteRaw.length ? noteRaw.slice(0, 500) : null;

  const locale =
    typeof body.locale === "string" &&
    (LOCALES as readonly string[]).includes(body.locale)
      ? (body.locale as Locale)
      : "en";

  return {
    ok: true,
    value: { name, attending, partySize, note, locale },
  };
}

/** Shape returned to the browser. Never leaks internal ids. */
export function publicRsvp(row: {
  code: string;
  name: string;
  attending: boolean;
  party_size: number;
  note: string | null;
}) {
  return {
    code: row.code,
    name: row.name,
    attending: row.attending,
    partySize: row.party_size,
    note: row.note,
  };
}

export type PublicRsvp = ReturnType<typeof publicRsvp>;
