"use client";

import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { WorkTile } from "@/components/WorkTile";
import { web, automation } from "@/lib/content";

const GROUPS = [
  { label: "Web", projects: web },
  { label: "Automation", projects: automation },
];
const TITLE = "Selected work.";
const SUB =
  "Real projects with honest labels — built, live, designed, or in progress. Nothing inflated.";

// The ribbon needs room, motion and WebGL2; everything else gets the static bento.
const QUERY = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

let webgl2: boolean | undefined;
function hasWebGL2(): boolean {
  if (webgl2 === undefined) {
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      webgl2 = gl !== null;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webgl2 = false;
    }
  }
  return webgl2;
}

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const canRibbon = () => window.matchMedia(QUERY).matches && hasWebGL2();

function Cell({ animate, index, className, children }: {
  animate: boolean;
  index: number;
  className?: string;
  children: ReactNode;
}) {
  return animate ? (
    <Reveal variant="panel" index={index} className={className}>
      {children}
    </Reveal>
  ) : (
    <div className={className}>{children}</div>
  );
}

function StaticWork({ animate }: { animate: boolean }) {
  return (
    <>
      <h2 className="sec-title font-display">{TITLE}</h2>
      <p className="sec-sub">{SUB}</p>
      {GROUPS.map((group) => (
        <Fragment key={group.label}>
          <h3 className="group-label">{group.label}</h3>
          <div className="bento">
            {group.projects.map((project, i) => (
              <Cell
                key={project.title}
                animate={animate}
                index={i}
                className={project.size ? `cell-${project.size}` : undefined}
              >
                <WorkTile project={project} />
              </Cell>
            ))}
            {group.label === "Automation" && (
              <Cell animate={animate} index={group.projects.length} className="cell-wide">
                <div className="slot">
                  <b className="font-display">More automations in progress</b>
                  Additional n8n workflows are being repurposed for the studio and
                  will be added here as they land.
                </div>
              </Cell>
            )}
          </div>
        </Fragment>
      ))}
    </>
  );
}

function Ribbon({ onFail }: { onFail: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const [t, s, h, p] = [track.current, stage.current, head.current, pill.current];
    if (!t || !s || !h || !p) return;
    const dom = {
      track: t,
      stage: s,
      head: h,
      pill: p,
      labels: labels.current.filter((l): l is HTMLDivElement => l !== null),
    };

    let destroy: (() => void) | undefined;
    let cancelled = false;
    import("@/lib/ribbon")
      .then(({ mountRibbon }) => mountRibbon(dom, GROUPS.map((g) => g.projects)))
      .then((d) => {
        if (cancelled) d();
        else destroy = d;
      })
      .catch((err: unknown) => {
        console.error("[ribbon] falling back to the static grid", err);
        if (!cancelled) onFail();
      });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [onFail]);

  return (
    <div className="ribbon-track" ref={track} aria-hidden="true">
      <div className="ribbon-stage" ref={stage}>
        <div className="ribbon-head wrap" ref={head}>
          <p className="sec-title font-display">{TITLE}</p>
          <p className="sec-sub">{SUB}</p>
        </div>
        {/* the WebGL canvas is inserted here by mountRibbon */}
        {GROUPS.map((group, i) => (
          <div
            key={group.label}
            className="group-label ribbon-label"
            ref={(el) => {
              labels.current[i] = el;
            }}
          >
            {group.label}
          </div>
        ))}
        <div className="ribbon-pill" ref={pill}>
          <b />
          <span />
        </div>
      </div>
    </div>
  );
}

export function WorkShowcase() {
  const supported = useSyncExternalStore(subscribe, canRibbon, () => false);
  const [failed, setFailed] = useState(false);
  const fail = useCallback(() => setFailed(true), []);

  if (!supported || failed) {
    return (
      <div className="section wrap">
        <StaticWork animate />
      </div>
    );
  }
  return (
    <>
      {/* the ribbon is decorative; screen readers get the full cards */}
      <div className="sr-only">
        <StaticWork animate={false} />
      </div>
      <Ribbon onFail={fail} />
    </>
  );
}
