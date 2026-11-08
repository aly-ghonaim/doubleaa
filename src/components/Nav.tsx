"use client";

import { useEffect, useRef, useState } from "react";
import { setTheme, useTheme, type Theme } from "@/lib/theme";

const SCROLL_THRESHOLD = 40;
const MAGNET_PULL = 0.25;
const MAGNET_MAX = 6;

const SECTIONS = ["work", "studio", "contact"] as const;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Nav() {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);

  // Condense the bar after a short scroll. Passive + rAF-throttled.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      // The section crossing 40% of the viewport is the current one.
      const line = window.innerHeight * 0.4;
      const current = SECTIONS.find((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return r ? r.top <= line && r.bottom > line : false;
      });
      setActive(current ?? null);
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

  // Slide the indicator under the current section's link.
  useEffect(() => {
    const ink = inkRef.current;
    const nav = navRef.current;
    if (!ink || !nav) return;
    const link = active ? nav.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`) : null;
    if (!link) {
      ink.style.opacity = "0";
      return;
    }
    ink.style.opacity = "1";
    ink.style.transform = `translateX(${link.offsetLeft}px) scaleX(${link.offsetWidth})`;
  }, [active]);

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
  };

  return (
    <header className={scrolled ? "bar is-scrolled" : "bar"}>
      <div className="bar-inner">
        <a href="#top" className="brand">
          Double<i>AA</i>
        </a>
        <nav className="bar-nav" aria-label="Primary" ref={navRef}>
          {SECTIONS.map((id) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>
              {id[0].toUpperCase() + id.slice(1)}
            </a>
          ))}
          <span className="nav-ink" ref={inkRef} aria-hidden="true" />
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
