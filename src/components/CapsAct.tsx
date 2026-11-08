"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LinkMark } from "@/components/LinkMark";
import { capabilities } from "@/lib/content";

/**
 * "Two halves of one build." Scroll links the mark: the blue loop (website) and
 * the silver loop (machine) start apart and close into the logo while the two
 * panels wipe in from opposite sides. Scroll-linked, not pinned: the page keeps
 * moving so the only pinned act on the site stays the peak.
 */
export function CapsAct() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // 0 when the block's top enters the bottom of the viewport, 1 when its top
  // reaches 35% from the top: the link completes while it is in comfortable view.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });

  const spread = useTransform(scrollYProgress, [0, 0.85], reduce ? [0, 0] : [1, 0], { clamp: true });
  const wipe = useTransform(scrollYProgress, [0.1, 0.9], reduce ? [0, 0] : [100, 0], { clamp: true });
  const leftClip = useTransform(wipe, (w) => `inset(0 ${w}% 0 0 round 22px)`);
  const rightClip = useTransform(wipe, (w) => `inset(0 0 0 ${w}% round 22px)`);
  const clips = [leftClip, rightClip];

  return (
    <div ref={ref} className="caps-act">
      <div className="caps-mark">
        <LinkMark spread={spread} className="caps-mark-svg" />
        <span className="caps-mark-label caps-mark-label--l">website</span>
        <span className="caps-mark-label caps-mark-label--r">machine</span>
      </div>
      <div className="caps">
        {capabilities.map((cap, i) => (
          <motion.div key={cap.title} data-reveal="" style={{ clipPath: clips[i % 2] }}>
            <div className="cap">
              <h3 className="font-display">{cap.title}</h3>
              <p>{cap.body}</p>
              <ul className="cap-list">
                {cap.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
