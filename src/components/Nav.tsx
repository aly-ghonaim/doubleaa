"use client";

import Link from "next/link";

import { useEffect, useRef, useState } from "react";

const SCROLL_THRESHOLD = 40;
const MAGNET_PULL = 0.25;
const MAGNET_MAX = 6;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Condense the bar after a short scroll. Passive + rAF-throttled.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Magnetic CTA: a bounded pull toward the cursor, released on leave.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * MAGNET_PULL;
      const dy = (e.clientY - (r.top + r.height / 2)) * MAGNET_PULL;
      const clamp = (v: number) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, v));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${clamp(dx)}px`);
        el.style.setProperty("--my", `${clamp(dy)}px`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <header className={scrolled ? "bar is-scrolled" : "bar"}>
      <div className="bar-inner">
        <Link href="/#top" className="brand">
          double<i>aa</i>
        </Link>
        <nav className="bar-nav" aria-label="Primary">
          <Link href="/#work">Work</Link>
          <Link href="/#studio">Studio</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <div className="bar-tools">
          <a href="/start" className="bar-cta" ref={ctaRef}>
            Start a project
          </a>
        </div>
      </div>
    </header>
  );
}
