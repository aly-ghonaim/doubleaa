"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

export type RevealVariant = "rise" | "panel" | "left" | "right";

interface RevealProps {
  children: ReactNode;
  /** Entrance shape. rise = default fade-up; panel = "flying" tile; left/right = assemble from a side. */
  variant?: RevealVariant;
  /** Position within a group — adds a capped stagger delay. */
  index?: number;
  delay?: number;
  className?: string;
}

const FROM: Record<RevealVariant, { x?: number; y?: number; scale?: number }> = {
  rise: { y: 18 },
  panel: { y: 40, scale: 0.96 },
  left: { x: -56 },
  right: { x: 56 },
};

const DURATION: Record<RevealVariant, number> = {
  rise: 0.4,
  panel: 0.45,
  left: 0.5,
  right: 0.5,
};

// ~45ms per step, total stagger capped so a long grid never drags.
const STEP = 0.045;
const MAX_STAGGER = 0.2;

export function Reveal({
  children,
  variant = "rise",
  index = 0,
  delay = 0,
  className,
}: RevealProps) {
  const reduce = useReducedMotion();
  const stagger = Math.min(index * STEP, MAX_STAGGER);

  // Reduced motion: opacity only, no spatial movement.
  const from = reduce ? {} : FROM[variant];

  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: reduce ? 0.2 : DURATION[variant],
        ease: EASE,
        delay: reduce ? 0 : delay + stagger,
      }}
    >
      {children}
    </motion.div>
  );
}
