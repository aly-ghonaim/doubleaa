"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  useEffect(() => {
    // Honor reduced-motion: leave native scrolling untouched.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Touch keeps native momentum scrolling (Lenis only smooths the wheel), so
    // phones never feel laggy or fight the finger.
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    // One clock for both: Lenis steps on GSAP's ticker and tells ScrollTrigger
    // the moment it moves, so pinned scenes never lag a frame behind the wheel.
    const unsubscribe = lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      unsubscribe();
      lenis.destroy();
    };
  }, []);

  return null;
}
