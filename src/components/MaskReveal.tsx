"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fragment, type ReactNode } from "react";
import { EASE } from "@/lib/motion";

interface MaskRevealProps {
  /** Each unit rises out of its own clipped band. Lines are blocks; words are inline. */
  units: ReactNode[];
  mode?: "line" | "word";
  stagger?: number;
  delay?: number;
  duration?: number;
}

/**
 * Clip-up text reveal. Render inside the heading element; the heading keeps its
 * own semantics and the text stays in the DOM (readable by AT and without JS
 * via the <noscript> override in layout).
 */
export function MaskReveal({
  units,
  mode = "line",
  stagger = 0.09,
  delay = 0,
  duration = 0.7,
}: MaskRevealProps) {
  const reduce = useReducedMotion();

  const hidden = reduce ? { opacity: 0 } : { y: "110%" };
  const shown = reduce ? { opacity: 1 } : { y: "0%" };
  return (
    <motion.span
      className={`mask-group mask-${mode}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        shown: {
          transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay },
        },
      }}
    >
      {units.map((unit, i) => (
        <Fragment key={i}>
          <span className="mask">
            <motion.span
              data-reveal=""
              className="mask-inner"
              variants={{
                hidden,
                shown: { ...shown, transition: { duration: reduce ? 0.2 : duration, ease: EASE } },
              }}
            >
              {unit}
            </motion.span>
          </span>
          {mode === "word" && i < units.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}
