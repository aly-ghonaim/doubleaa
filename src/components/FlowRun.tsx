"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { EASE } from "@/lib/motion";

interface FlowRunProps {
  flow: string[];
}

const NODE_STAGGER = 0.04;
// Pulse step between successive node/arrow beats — keep in sync with --pulse-step in CSS.
const PULSE_STEP_MS = 75;

/**
 * "The machine runs." Nodes assemble left-to-right when the tile enters view,
 * then a pulse of light travels node → arrow → node. Re-runs on tile hover.
 */
export function FlowRun({ flow }: FlowRunProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const running = useRef(false);

  const run = useCallback(() => {
    const el = ref.current;
    if (!el || reduce || running.current) return;
    running.current = true;
    el.classList.remove("is-running");
    void el.offsetWidth; // restart the CSS animation
    el.classList.add("is-running");
    const beats = flow.length * 2 - 1;
    window.setTimeout(() => {
      running.current = false;
    }, beats * PULSE_STEP_MS + 600);
  }, [flow.length, reduce]);

  // First run once the nodes have assembled.
  useEffect(() => {
    if (!inView || reduce) return;
    const t = window.setTimeout(run, flow.length * NODE_STAGGER * 1000 + 200);
    return () => window.clearTimeout(t);
  }, [inView, reduce, run, flow.length]);

  // Re-run when the whole tile is hovered, not just the chips.
  useEffect(() => {
    const tile = ref.current?.closest(".tile, .pf");
    if (!tile || reduce) return;
    tile.addEventListener("pointerenter", run);
    return () => tile.removeEventListener("pointerenter", run);
  }, [run, reduce]);

  return (
    <div ref={ref} className="flow" aria-label="Workflow steps">
      {flow.map((node, i) => (
        <motion.span
          key={node}
          data-reveal=""
          className="flow-step"
          initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{
            duration: reduce ? 0.2 : 0.32,
            ease: EASE,
            delay: reduce ? 0 : i * NODE_STAGGER,
          }}
        >
          <span className="node" style={{ "--beat": i * 2 } as CSSProperties}>
            {node}
          </span>
          {i < flow.length - 1 && (
            <span
              className="arr"
              aria-hidden="true"
              style={{ "--beat": i * 2 + 1 } as CSSProperties}
            >
              →
            </span>
          )}
        </motion.span>
      ))}
    </div>
  );
}
