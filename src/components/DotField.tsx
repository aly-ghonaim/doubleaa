"use client";

import { useEffect, useRef } from "react";

// Must match .dot-field background-size, so the swelled dots sit exactly on the grid.
const GAP = 22;
const REACH = 160; // px around the pointer that responds
const FOLLOW = 0.16; // pointer easing per 60Hz frame
const FADE = 0.08; // on/off easing per 60Hz frame
const CORAL = "255, 77, 46"; // --cobalt, as rgb for canvas

/** Swells the halftone grid around the pointer. Fine pointers with motion allowed only;
    everyone else keeps the static CSS grid. Redraws only while something is changing. */
export function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      kick();
    };

    const goal = { x: -1e4, y: -1e4 };
    const cur = { x: -1e4, y: -1e4 };
    let on = 0;
    let target = 0;
    let raf = 0;
    let last = 0;

    function draw(now: number) {
      // frame-rate independent easing, so 120Hz screens don't feel twice as snappy
      const steps = last ? Math.min((now - last) / (1000 / 60), 4) : 1;
      last = now;
      const follow = 1 - (1 - FOLLOW) ** steps;
      cur.x += (goal.x - cur.x) * follow;
      cur.y += (goal.y - cur.y) * follow;
      on += (target - on) * (1 - (1 - FADE) ** steps);
      ctx!.clearRect(0, 0, w, h);

      if (on > 0.005) {
        const i0 = Math.max(0, Math.floor((cur.x - REACH) / GAP));
        const i1 = Math.ceil((cur.x + REACH) / GAP);
        const j0 = Math.max(0, Math.floor((cur.y - REACH) / GAP));
        const j1 = Math.ceil((cur.y + REACH) / GAP);
        for (let i = i0; i <= i1; i++) {
          const x = GAP / 2 + i * GAP;
          for (let j = j0; j <= j1; j++) {
            const y = GAP / 2 + j * GAP;
            const t = 1 - Math.hypot(x - cur.x, y - cur.y) / REACH;
            if (t <= 0) continue;
            const k = t * t * (3 - 2 * t) * on;
            ctx!.fillStyle = `rgba(${CORAL}, ${(0.1 + 0.55 * k).toFixed(3)})`;
            ctx!.beginPath();
            ctx!.arc(x, y, 0.9 + 2.3 * k, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
      }

      const settled = Math.abs(target - on) < 0.002 && Math.hypot(goal.x - cur.x, goal.y - cur.y) < 0.3;
      raf = settled ? 0 : requestAnimationFrame(draw);
      if (!raf) last = 0;
    }
    function kick() {
      if (!raf) raf = requestAnimationFrame(draw);
    }

    const move = (e: PointerEvent) => {
      if (target === 0) {
        // re-entering: start from the pointer instead of sliding in from the last spot
        cur.x = e.clientX;
        cur.y = e.clientY;
      }
      goal.x = e.clientX;
      goal.y = e.clientY;
      target = 1;
      kick();
    };
    const leave = () => {
      target = 0;
      kick();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} className="dot-field" aria-hidden="true" />;
}
