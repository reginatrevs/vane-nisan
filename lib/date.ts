import { event } from "@/content/event";
import type { Locale } from "@/content/i18n";

const BCP47: Record<Locale, string> = {
  en: "en-GB",
  es: "es-MX",
  tr: "tr-TR",
};

export function formatEventDate(locale: Locale): string {
  return new Intl.DateTimeFormat(BCP47[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: event.timeZone,
  }).format(new Date(event.startsAt));
}

/** Always 24-hour ("18:00") so it matches the printed invitation. */
export function formatEventTime(locale: Locale): string {
  return new Intl.DateTimeFormat(BCP47[locale], {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: event.timeZone,
  }).format(new Date(event.startsAt));
}

/**
 * The big display date, split so it can be typeset as
 * "26 AUGUST 2026" without any locale's connecting words ("de", etc).
 */
export function bigDateParts(locale: Locale): {
  day: string;
  month: string;
  year: string;
} {
  const parts = new Intl.DateTimeFormat(BCP47[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: event.timeZone,
  }).formatToParts(new Date(event.startsAt));

  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return {
    day: pick("day"),
    month: pick("month").toLocaleUpperCase(BCP47[locale]),
    year: pick("year"),
  };
}

export function formatDeadline(locale: Locale): string | null {
  if (!event.rsvpDeadline) return null;
  return new Intl.DateTimeFormat(BCP47[locale], {
    day: "numeric",
    month: "long",
  }).format(new Date(`${event.rsvpDeadline}T12:00:00Z`));
}

/** Google Calendar link. Event assumed to run 4 hours. */
export function calendarUrl(title: string): string {
  const start = new Date(event.startsAt);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${stamp(start)}/${stamp(end)}`,
    location: `${event.venue.name}, ${event.venue.address}, ${event.venue.city}`,
    ctz: event.timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
