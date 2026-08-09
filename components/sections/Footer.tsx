"use client";

import { motion, useReducedMotion } from "motion/react";
import { event } from "@/content/event";
import { assets } from "@/lib/assets";
import { AssetImage } from "@/components/AssetImage";

export function Footer() {
  const reduced = useReducedMotion();

  return (
    <footer className="bg-paper">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <AssetImage
          asset={assets.footer}
          alt=""
          className="block h-auto w-full"
          fallback={
            <p className="py-16 text-center font-serif text-2xl italic text-navy sm:text-3xl">
              {event.bride.name}
              <span className="mx-3 text-navy/50">&amp;</span>
              {event.groom.name}
            </p>
          }
        />
      </motion.div>
    </footer>
  );
}
