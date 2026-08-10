"use client";

import { motion, useReducedMotion } from "motion/react";
import { event } from "@/content/event";
import { assets } from "@/lib/assets";
import { AssetImage } from "@/components/AssetImage";
import { useLocale } from "@/lib/locale";
import {
  bigDateParts,
  calendarUrl,
  formatEventTime,
} from "@/lib/date";

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function DateBlock() {
  const { t, locale } = useLocale();
  const { day, month, year } = bigDateParts(locale);

  return (
    <section
      id="details"
      className="bg-paper px-6 pb-14 pt-16 text-center sm:pb-20 sm:pt-24"
    >
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="font-body text-[clamp(1.05rem,4.1vw,1.75rem)] font-light tracking-wide text-navy">
            {t.invite.line}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-6 flex justify-center sm:mt-9">
          <AssetImage
            asset={assets.date}
            alt={`${day} ${month} ${year}`}
            sizes="(min-width: 560px) 560px, 100vw"
            className="h-auto w-full max-w-[560px]"
            fallback={
              <h1 className="font-display text-[clamp(1.9rem,9.5vw,5.25rem)] font-medium leading-[1.08] tracking-[0.02em] text-navy-deep">
                {day} {month} {year}
              </h1>
            }
          />
        </Reveal>

        <Reveal delay={0.28} className="mt-6 space-y-1 sm:mt-8">
          {event.venue.name && (
            <p className="font-body text-base font-light text-navy sm:text-lg">
              {event.venue.name}
            </p>
          )}
          <p className="font-body text-[clamp(1rem,3.8vw,1.5rem)] font-light text-navy">
            {event.venue.address}, {event.venue.city}{" "}
            {/* Kept together so the time never wraps away from its "at". */}
            <span className="whitespace-nowrap">
              <span className="text-navy/60">{t.details.at}</span>{" "}
              {formatEventTime(locale)}
            </span>
          </p>
        </Reveal>

        {event.dressCode && (
          <Reveal delay={0.34} className="mt-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-navy-soft">
              {t.details.dressLabel}
            </p>
            <p className="mt-1 font-serif text-base italic text-navy">
              {event.dressCode[locale]}
            </p>
          </Reveal>
        )}

        <Reveal
          delay={0.4}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          <a
            href={event.venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-navy/30 pb-0.5 font-serif text-sm uppercase italic tracking-[0.18em] text-navy transition-colors hover:border-navy sm:text-base"
          >
            {t.details.directions}
          </a>
          <a
            href={calendarUrl(`${event.bride.name} & ${event.groom.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-navy/30 pb-0.5 font-serif text-sm uppercase italic tracking-[0.18em] text-navy transition-colors hover:border-navy sm:text-base"
          >
            {t.details.addToCalendar}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
