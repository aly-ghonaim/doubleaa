"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect } from "react";

/**
 * Page-wide touches that are not tied to one section:
 *  - a 2px progress rail at the very top that tracks how far down the page you are
 *  - a soft spotlight on cards (.tile, .cap) that follows the cursor
 */
export function PageFx() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  // One delegated listener for every card, instead of one per card.
  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const card = (e.target as Element | null)?.closest<HTMLElement>(".tile, .cap");
      if (!card) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--sx", `${e.clientX - r.left}px`);
        card.style.setProperty("--sy", `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}
