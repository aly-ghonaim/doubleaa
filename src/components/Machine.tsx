import type { CSSProperties } from "react";

/*
 * The machine — doubleaa's signature focal block. A dithered, inked automation
 * schematic (the real shape of our n8n work: form → AI triage → sheet + email)
 * with a flame pulse running the wires. Pure SVG + CSS animation, no JS: the
 * pulse is gated off under prefers-reduced-motion in globals.css.
 */

interface NodeSpec {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

const NODES: NodeSpec[] = [
  { x: 24, y: 130, w: 126, h: 46, label: "FORM" },
  { x: 250, y: 130, w: 140, h: 46, label: "AI TRIAGE" },
  { x: 486, y: 74, w: 126, h: 46, label: "SHEET" },
  { x: 486, y: 186, w: 126, h: 46, label: "EMAIL" },
];

// Wires (static) and the two pulse routes that run through them.
const WIRES = [
  "M150,153 H250",
  "M390,153 C 430,153 446,97 486,97",
  "M390,153 C 430,153 446,209 486,209",
];
const PULSE_TO_SHEET = "M96,153 H390 C 430,153 446,97 486,97";
const PULSE_TO_EMAIL = "M96,153 H390 C 430,153 446,209 486,209";

export function Machine() {
  return (
    <svg
      className="machine-svg"
      viewBox="0 0 636 306"
      role="img"
      aria-label="Automation schematic: a form feeds an AI triage step that routes to a spreadsheet and an email."
    >
      {/* wires */}
      {WIRES.map((d) => (
        <path key={d} className="machine-wire" d={d} />
      ))}

      {/* running light */}
      <path className="machine-pulse" d={PULSE_TO_SHEET} />
      <path
        className="machine-pulse"
        d={PULSE_TO_EMAIL}
        style={{ animationDelay: "-1.7s" } as CSSProperties}
      />

      {/* endpoint ticks */}
      <circle className="machine-dot" cx={612} cy={97} r={3} />
      <circle className="machine-dot" cx={612} cy={209} r={3} />

      {/* nodes */}
      {NODES.map((n) => (
        <g key={n.label}>
          <rect
            className="machine-node-fill"
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            rx={4}
          />
          <rect
            className="machine-node-box"
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            rx={4}
          />
          <text
            className="machine-label"
            x={n.x + n.w / 2}
            y={n.y + n.h / 2}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
