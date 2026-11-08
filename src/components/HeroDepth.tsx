"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { LinkMark } from "@/components/LinkMark";

// Foreground plane: the steps of a real pipeline we built, floating in front of
// the mark. Positions are percentages of the depth box.
const CHIPS = [
  { label: "Webhook", x: 64, y: 16 },
  { label: "OpenAI", x: 88, y: 34 },
  { label: "Sheets", x: 70, y: 68 },
  { label: "Gmail", x: 92, y: 80 },
];

/**
 * Hero depth: three planes behind/around the headline, each moving at its own
 * rate as the hero scrolls away, plus a small pointer offset on desktop.
 *   back  — blueprint grid, slowest
 *   mid   — the linked-loop mark, sits under the headline (type occludes it)
 *   front — workflow chips, fastest, never over the headline column
 * Purely decorative: aria-hidden, pointer-events none.
 */
export function HeroDepth() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // pointer offset, -1..1, springed so it never jitters
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  const k = reduce ? 0 : 1;
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 60 * k]);
  const markY = useTransform(scrollYProgress, [0, 1], [0, -140 * k]);
  const markR = useTransform(scrollYProgress, [0, 1], [0, -8 * k]);
  const chipsY = useTransform(scrollYProgress, [0, 1], [0, -320 * k]);
  const markPX = useTransform(sx, (v) => v * 10 * k);
  const markPY = useTransform(sy, (v) => v * 8 * k);
  const chipsPX = useTransform(sx, (v) => v * 22 * k);
  const chipsPY = useTransform(sy, (v) => v * 16 * k);

  return (
    <div ref={ref} className="hero-depth" aria-hidden="true">
      <motion.div className="hero-plane hero-grid" style={{ y: gridY }} />
      <motion.div className="hero-plane hero-mark-wrap" style={{ y: markY, rotate: markR }}>
        <motion.div style={{ x: markPX, y: markPY }}>
          <LinkMark className="hero-mark" />
        </motion.div>
      </motion.div>
      <motion.div className="hero-plane hero-chips" style={{ y: chipsY }}>
        <motion.div className="hero-chips-inner" style={{ x: chipsPX, y: chipsPY }}>
          {CHIPS.map((c, i) => (
            <span
              key={c.label}
              className="hero-chip"
              style={{ left: `${c.x}%`, top: `${c.y}%`, ["--i" as string]: i }}
            >
              {c.label}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
