"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem("daa-theme");
    if (saved === "light") return "light";
  } catch {
    // localStorage blocked — fall through to the committed default
  }
  return "dark";
}

const SCROLL_THRESHOLD = 40;
const MAGNET_PULL = 0.25;
const MAGNET_MAX = 6;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Nav() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [scrolled, setScrolled] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

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

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("daa-theme", next);
    } catch {
      // persistence unavailable — the choice still applies for this session
    }
  };

  return (
    <header className={scrolled ? "bar is-scrolled" : "bar"}>
      <div className="bar-inner">
        <a href="#top" className="brand">
          Double<i>AA</i>
        </a>
        <nav className="bar-nav" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="bar-tools">
          <button
            type="button"
            className="toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title="Toggle theme"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <a href="#contact" className="bar-cta" ref={ctaRef}>
            Start a project
          </a>
        </div>
      </div>
    </header>
  );
}
