import type { CSSProperties, ReactNode } from "react";
import { tools } from "@/lib/content";

/*
 * Hero — the authored focal entrance. Driven by CSS keyframes (not JS) so it
 * plays the moment the stylesheet lands, before hydration: the headline is the
 * LCP element and must never wait on a JS bundle. Sequence and timing live in
 * globals.css (.hero-line / .hero-follow).
 */

// Headline lines, each rising out of its own clipped band ~92ms apart.
const LINES: ReactNode[] = [
  "We build",
  "the website —",
  <>
    and the <span className="mark">machine</span>
  </>,
  "behind it.",
];

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export function Hero() {
  return (
    <section className="hero wrap">
      <div className="hero-teaser" aria-hidden="true">
        <svg viewBox="0 0 240 150" className="hero-teaser-svg">
          <g className="ht-wire">
            <path d="M84 71 H118 C134 71 134 37 150 37" />
            <path d="M84 71 H118 C134 71 134 109 150 109" />
          </g>
          <g className="ht-box">
            <rect x="6" y="52" width="78" height="38" rx="4" />
            <rect x="150" y="18" width="80" height="38" rx="4" />
            <rect x="150" y="90" width="80" height="38" rx="4" />
          </g>
          <circle className="ht-dot" cx="150" cy="37" r="2.6" />
          <circle className="ht-dot" cx="150" cy="109" r="2.6" />
        </svg>
      </div>
      <h1 className="hero-title font-display">
        {LINES.map((line, n) => (
          <span key={n} className="hero-line">
            <span style={i(n)}>{line}</span>
          </span>
        ))}
      </h1>
      <p className="hero-lede hero-follow" style={i(0)}>
        We&apos;re Aly and Abdullah, a two-person studio. One of us comes from the
        front end and security, the other from full-stack and AI automation. We
        make clean, fast interfaces and the n8n workflows behind them — first
        sketch to production — so the thing you launch keeps running without you
        babysitting it.
      </p>
      <div className="hero-actions hero-follow" style={i(1)}>
        <a href="#contact" className="btn btn-primary">
          Start a project
          <i className="i-arrow" aria-hidden="true" />
        </a>
        <a href="#work" className="btn btn-ghost">
          See the work
        </a>
      </div>
      <div className="proof hero-follow" style={i(2)}>
        <span className="proof-label">Built with</span>
        <div className="proof-list">
          {tools.map((tool) => (
            <span key={tool} className="proof-item">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
