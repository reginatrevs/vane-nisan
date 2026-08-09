"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ *
 * Sprig — small symmetrical botanical mark used above headings.
 * ------------------------------------------------------------------ */

export function Sprig({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  const line = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.1, ease: EASE, delay: i * 0.12 },
        opacity: { duration: 0.4, delay: i * 0.12 },
      },
    }),
  };

  return (
    <svg viewBox="0 0 80 44" className={className} aria-hidden="true">
      <motion.g
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "show"}
        viewport={{ once: true, amount: 0.6 }}
      >
        <motion.path d="M40 40 C 40 28 40 16 40 6" {...line} custom={0} variants={draw} />
        {[1, -1].map((dir) => (
          <g key={dir} transform={dir === -1 ? "scale(-1,1) translate(-80,0)" : undefined}>
            <motion.path
              d="M40 30 C 48 30 56 26 60 20"
              {...line} custom={1} variants={draw}
            />
            <motion.path
              d="M60 20 C 66 20 70 15 69 9 C 63 10 60 14 60 20 Z"
              {...line} custom={2} variants={draw}
            />
            <motion.path
              d="M40 20 C 46 19 50 15 51 10"
              {...line} custom={2} variants={draw}
            />
            <motion.circle cx="52" cy="7" r="2" {...line} custom={3} variants={draw} />
          </g>
        ))}
        <motion.circle cx="40" cy="4" r="2.2" {...line} custom={3} variants={draw} />
      </motion.g>
    </svg>
  );
}
