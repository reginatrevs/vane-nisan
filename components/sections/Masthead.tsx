"use client";

import { motion, useReducedMotion } from "motion/react";
import { event } from "@/content/event";
import { assets } from "@/lib/assets";
import { AssetImage } from "@/components/AssetImage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Masthead() {
  const reduced = useReducedMotion();
  const names = `${event.bride.name} & ${event.groom.name}`;

  return (
    <header className="bg-paper">
      {/* Marbled botanical cap, edge to edge */}
      <AssetImage
        asset={assets.topBand}
        alt=""
        eager
        sizes="100vw"
        className="block h-auto w-full"
      />

      {/* Pills sit close under the botanical arch; the breathing room goes
          below them, before the calligraphy. */}
      <div className="px-6 pb-14 pt-2 sm:pb-20 sm:pt-3">
        <LanguageSwitcher className="flex justify-center" />
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
        className="flex flex-col items-center px-6"
      >
        <AssetImage
          asset={assets.names}
          alt={names}
          eager
          sizes="(min-width: 640px) 520px, 100vw"
          className="h-auto w-full max-w-[300px] sm:max-w-[520px]"
          fallback={
            <p className="py-10 text-center font-serif text-4xl italic text-navy">
              {names}
            </p>
          }
        />

        {/* Decorative — the calligraphy above already announces the names. */}
        <AssetImage
          asset={assets.photos}
          alt=""
          eager
          sizes="(min-width: 640px) 620px, 100vw"
          className="mt-2 h-auto w-full max-w-[360px] sm:mt-4 sm:max-w-[620px]"
        />
      </motion.div>
    </header>
  );
}
