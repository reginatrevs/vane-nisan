/**
 * ============================================================
 *  EDIT THIS FILE to change event details.
 * ============================================================
 */

export const event = {
  bride: { name: "Vanessa" },
  groom: { name: "Sami" },

  /** ISO 8601 with offset. Ottawa is UTC-4 in August (EDT). */
  startsAt: "2026-08-26T18:00:00-04:00",
  timeZone: "America/Toronto",

  venue: {
    /** Optional venue name shown above the address. Empty string hides it. */
    name: "",
    address: "1910 Bank St",
    city: "Ottawa, ON K1V 2B2",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=1910+Bank+St+Ottawa+ON+K1V+2B2",
  },

  /** Set to null to hide the dress code line. */
  dressCode: null as null | Record<"en" | "es" | "tr", string>,

  /** ISO date, or null for no deadline. */
  rsvpDeadline: "2026-08-01",

  /**
   * Most ADDITIONAL guests one person may register. Deliberately generous —
   * this is a sanity cap against typos, not a real limit on the party.
   */
  maxGuests: 20,
};
