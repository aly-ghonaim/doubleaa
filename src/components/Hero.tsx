import type { CSSProperties, ReactNode } from "react";
import { HeroDepth } from "@/components/HeroDepth";
import { tools } from "@/lib/content";

/*
 * Hero: the authored focal entrance. Driven by CSS keyframes (not JS) so it
 * plays the moment the stylesheet lands, before hydration: the headline is the
 * LCP element and must never wait on a JS bundle. Sequence and timing live in
 * globals.css (.hero-line / .hero-follow).
 */

// Headline lines, each rising out of its own clipped band ~60ms apart.
const LINES: ReactNode[] = [
  "We build",
  "the website,",
  <>
    and the <span className="mark">machine</span>
  </>,
  "behind it.",
];

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export function Hero() {
  return (
    <section className="hero wrap">
      <HeroDepth />
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
        make clean, fast interfaces and the n8n workflows behind them, first
        sketch to production, so the thing you launch keeps running without you
        babysitting it.
      </p>
      <div className="hero-actions hero-follow" style={i(1)}>
        <a href="#contact" className="btn btn-primary">
          Start a project
        </a>
        <a href="#work" className="btn btn-ghost">
          See the work
        </a>
      </div>
      <div className="proof hero-follow" style={i(2)}>
        <span className="proof-label">Built with</span>
        {/* Two identical tracks loop seamlessly; the copy is hidden from AT. */}
        <div className="proof-list marquee">
          {[false, true].map((dup) => (
            <div key={String(dup)} className="marquee-track" aria-hidden={dup || undefined}>
              {tools.map((tool) => (
                <span key={tool} className="proof-item">
                  {tool}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
