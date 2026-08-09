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
          below them, before the calligraphy. Kept tighter on phones so the
          calligraphy and the frames still land on the first screen once
          browser chrome has taken its cut. */}
      <div className="px-6 pb-9 pt-2 sm:pb-20 sm:pt-3">
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

        {/* Arrives just after the calligraphy has settled, so the two read as
            one gesture rather than appearing at once. */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 26, scale: 0.96 }}
          animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          className="mt-9 w-full max-w-[360px] sm:mt-12 sm:max-w-[620px]"
        >
          {/* Nested so the endless drift doesn't fight the entrance above.
              The frames sway like something pinned to a wall. */}
          <motion.div
            animate={
              reduced ? undefined : { y: [0, -8, 0], rotate: [0, -0.7, 0] }
            }
            transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
            whileHover={reduced ? undefined : { scale: 1.035, rotate: 0.9 }}
            whileTap={reduced ? undefined : { scale: 0.975, rotate: -0.9 }}
          >
            {/* Decorative — the calligraphy above already announces the names. */}
            <AssetImage
              asset={assets.photos}
              alt=""
              eager
              sizes="(min-width: 640px) 620px, 100vw"
              className="h-auto w-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </header>
  );
}
