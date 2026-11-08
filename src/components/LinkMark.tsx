"use client";

import { motion, motionValue, useTransform, type MotionValue } from "framer-motion";
import { useId } from "react";

interface LinkMarkProps {
  /** 0 = linked (the logo), 1 = pulled fully apart. Omit for a static, linked mark. */
  spread?: MotionValue<number>;
  className?: string;
  title?: string;
}

// Geometry: two rounded squares turned 45°, centred 50 units apart, so their
// edges cross at (100, 35.5) and (100, 84.5). Blue passes over silver at the
// bottom crossing and under it at the top, which is what reads as "linked".
const LOOP = { size: 70, r: 20, stroke: 17 };

// Constant source for the static (always linked) mark.
const ZERO = motionValue(0);

function Loop({ cx, color }: { cx: number; color: string }) {
  const h = LOOP.size / 2;
  return (
    <rect
      x={cx - h}
      y={60 - h}
      width={LOOP.size}
      height={LOOP.size}
      rx={LOOP.r}
      transform={`rotate(45 ${cx} 60)`}
      fill="none"
      stroke={color}
      strokeWidth={LOOP.stroke}
    />
  );
}

/**
 * The DoubleAA mark, drawn in code so scroll can take it apart and link it
 * again. Blue is the website, silver is the machine.
 */
export function LinkMark({ spread, className, title }: LinkMarkProps) {
  const clipId = useId().replace(/:/g, "");
  const blueX = useTransform(spread ?? ZERO, (s) => s * -44);
  const silverX = useTransform(spread ?? ZERO, (s) => s * 44);

  return (
    <svg
      className={className}
      viewBox="0 0 200 120"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <rect x="86" y="70" width="28" height="30" />
        </clipPath>
      </defs>
      <motion.g style={{ x: blueX }}>
        <Loop cx={75} color="var(--accent-fill)" />
      </motion.g>
      <motion.g style={{ x: silverX }}>
        <Loop cx={125} color="var(--silver)" />
      </motion.g>
      {/* blue re-drawn over silver at the lower crossing only */}
      <motion.g style={{ x: blueX }} clipPath={`url(#${clipId})`}>
        <Loop cx={75} color="var(--accent-fill)" />
      </motion.g>
    </svg>
  );
}
