"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * The close. As the contact band arrives, the whole page ground deepens toward
 * the logo's navy and stays there: the page lands somewhere and holds, it does
 * not fade out. Opacity-only, so it is identical with reduced motion.
 */
export function DriftClose({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });

  return (
    <div ref={ref}>
      <motion.div className="drift-ground" style={{ opacity }} aria-hidden="true" />
      {children}
    </div>
  );
}
