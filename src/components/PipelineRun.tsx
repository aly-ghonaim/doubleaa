"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useRef, useState, type CSSProperties } from "react";

/*
 * The peak: "the machine runs". A sample execution of the Lead Capture & AI
 * Dispatch workflow, computed in this component from the data below. Scroll
 * position is the execution clock: the form fills, the model classifies, the
 * branch decides, a row lands in the sheet, the reply is written and sent.
 * Every value on screen is derived from `p`; nothing is a recording.
 */

// ---- sample data (fictional, and labelled as such on the surface) ----------
const LEAD = [
  ["name", "Mona Haddad"],
  ["company", "Sample Bakery Co."],
  ["email", "mona@sample-bakery.test"],
  ["message", "We need a new website, and orders should land in a sheet on their own."],
] as const;

const AI_OUT = [
  ["intent", "website + automation"],
  ["urgency", "this month"],
  ["qualified", "true"],
  ["tone", "warm, direct"],
] as const;

const REPLY = {
  to: "mona@sample-bakery.test",
  subject: "Re: your website + automation project",
  body: "Hi Mona, thanks for the detail. Here is how we would build the site and wire your orders straight into a sheet.",
};

// ---- the workflow ------------------------------------------------------------
// [start, end] in act progress. Durations (ms) are what the log reports.
const NODES = [
  { id: "form", name: "Jotform", role: "Form trigger", span: [0.08, 0.32], ms: 0 },
  { id: "ai", name: "OpenAI", role: "Classify lead", span: [0.32, 0.5], ms: 1184 },
  { id: "if", name: "If", role: "Qualified?", span: [0.5, 0.58], ms: 3 },
  { id: "sheet", name: "Sheets", role: "Append row", span: [0.58, 0.74], ms: 412 },
  { id: "mail", name: "Gmail", role: "Send reply", span: [0.74, 0.9], ms: 631 },
] as const;

const DONE_AT = 0.9;
const T0 = { h: 14, m: 2, s: 7, ms: 120 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const local = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));

function stamp(offsetMs: number) {
  const total = ((T0.h * 60 + T0.m) * 60 + T0.s) * 1000 + T0.ms + offsetMs;
  const h = Math.floor(total / 3600000);
  const m = Math.floor(total / 60000) % 60;
  const s = Math.floor(total / 1000) % 60;
  const ms = total % 1000;
  const two = (n: number) => String(n).padStart(2, "0");
  return `${two(h)}:${two(m)}:${two(s)}.${String(ms).padStart(3, "0")}`;
}

// Cumulative ms at the END of each node, for log stamps and the final runtime.
const ENDS = NODES.reduce<number[]>((acc, n, i) => [...acc, (acc[i - 1] ?? 0) + n.ms], []);

/** Type `text` out across t in 0..1. */
const typed = (text: string, t: number) => text.slice(0, Math.round(text.length * clamp01(t)));

interface LogLine {
  t: string;
  text: string;
  kind?: "ok" | "info";
}

function deriveRun(p: number) {
  const nodeT = NODES.map((n) => local(p, n.span));
  const active = NODES.findIndex((n) => p >= n.span[0] && p < n.span[1]);
  const done = p >= DONE_AT;

  // Form: characters across all fields in order.
  const leadChars = LEAD.reduce((a, [, v]) => a + v.length, 0);
  let budget = Math.round(leadChars * nodeT[0]);
  const lead = LEAD.map(([k, v]) => {
    const n = Math.min(v.length, budget);
    budget -= n;
    return [k, v.slice(0, n)] as const;
  });

  // AI: first 40% "thinking", then fields resolve one at a time.
  const aiT = nodeT[1];
  const aiThinking = aiT > 0 && aiT < 0.4;
  const aiShown = aiT < 0.4 ? 0 : Math.ceil(((aiT - 0.4) / 0.6) * AI_OUT.length);

  const log: LogLine[] = [];
  if (p < NODES[0].span[0]) log.push({ t: stamp(0), text: "Waiting for trigger…", kind: "info" });
  NODES.forEach((n, i) => {
    if (nodeT[i] > 0) log.push({ t: stamp(ENDS[i - 1] ?? 0), text: `${n.name}: started` });
    if (nodeT[i] >= 1) {
      const detail =
        n.id === "form" ? "1 item received"
        : n.id === "ai" ? "classified: website + automation"
        : n.id === "if" ? "qualified = true → true branch"
        : n.id === "sheet" ? "1 row appended to Leads"
        : "reply sent to mona@sample-bakery.test";
      log.push({ t: stamp(ENDS[i]), text: `${n.name}: ${detail}`, kind: "ok" });
    }
  });
  if (done) log.push({ t: stamp(ENDS[ENDS.length - 1]), text: `Execution succeeded in ${(ENDS[ENDS.length - 1] / 1000).toFixed(2)}s`, kind: "ok" });

  const status = done
    ? `Succeeded · ${(ENDS[ENDS.length - 1] / 1000).toFixed(2)}s`
    : active >= 0
      ? `Running · step ${active + 1} of ${NODES.length}`
      : "Waiting for trigger";

  return { nodeT, active, done, lead, aiThinking, aiShown, log, status };
}

export function PipelineRun() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [p, setP] = useState(0);

  // Quantised so React re-renders only when something visible can change.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const q = Math.round(v * 500) / 500;
    setP((prev) => (prev === q ? prev : q));
  });

  const run = deriveRun(reduce ? 1 : p);
  const { nodeT, active, done, lead, aiThinking, aiShown, log } = run;

  // What the inspector shows: the output of the furthest node that has started.
  const focus = done ? 4 : Math.max(0, active === -1 ? (nodeT[0] >= 1 ? 4 : 0) : active);

  return (
    <section
      ref={ref}
      id="run"
      className={reduce ? "run run--static" : "run"}
      aria-labelledby="run-title"
    >
      <div className="run-stage">
        <div className="wrap run-wrap">
          <p className="run-note">
            <span id="run-title">Sample execution</span> of a workflow we built.
            Fictional lead, computed live in this page as you move through it.
          </p>

          <div className={`surface${done ? " is-done" : ""}`}>
            <div className="surface-bar">
              <span className="surface-name">Lead Capture &amp; AI Dispatch</span>
              <span className={`surface-status${done ? " is-ok" : active >= 0 ? " is-running" : ""}`}>
                {run.status}
              </span>
            </div>

            <ol className="canvas" aria-label="Workflow steps">
              {NODES.map((n, i) => {
                const state = nodeT[i] >= 1 ? "done" : nodeT[i] > 0 ? "active" : "idle";
                return (
                  <li key={n.id} className={`wf-node is-${state}`}>
                    <span className="wf-name">{n.name}</span>
                    <span className="wf-role">{n.role}</span>
                    <span className="wf-mark" aria-hidden="true">
                      {state === "done" ? "✓" : ""}
                    </span>
                    {i < NODES.length - 1 && (
                      <span
                        className="wf-link"
                        aria-hidden="true"
                        style={{ "--fill": nodeT[i] >= 1 ? local(p, [n.span[1], n.span[1] + 0.03]) : 0 } as CSSProperties}
                      />
                    )}
                  </li>
                );
              })}
            </ol>

            <div className="panes">
              <div className="pane pane-item">
                <div className="pane-head">{NODES[focus].name} · output</div>
                {focus === 0 && (
                  <dl className="kv">
                    {lead.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>
                          {v}
                          {active === 0 && v.length > 0 && v.length < (LEAD.find(([kk]) => kk === k)?.[1].length ?? 0) && (
                            <span className="caret" aria-hidden="true" />
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
                {focus === 1 && (
                  aiThinking ? (
                    <p className="thinking">Reading the message…</p>
                  ) : (
                    <dl className="kv">
                      {AI_OUT.slice(0, aiShown).map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )
                )}
                {focus === 2 && (
                  <div className="branch">
                    <span className={nodeT[2] > 0.4 ? "is-on" : ""}>true → Sheets, Gmail</span>
                    <span className="is-off">false → archive</span>
                  </div>
                )}
                {focus === 3 && (
                  <table className="sheet">
                    <thead>
                      <tr><th>name</th><th>company</th><th>intent</th><th>status</th></tr>
                    </thead>
                    <tbody>
                      <tr className={nodeT[3] > 0.35 ? "row-in" : "row-pending"}>
                        <td>Mona Haddad</td><td>Sample Bakery Co.</td><td>website + automation</td><td>new</td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {focus === 4 && (
                  <div className="mail">
                    <div><span>to</span> {REPLY.to}</div>
                    <div><span>subject</span> {typed(REPLY.subject, done ? 1 : nodeT[4] * 2)}</div>
                    <p>{typed(REPLY.body, done ? 1 : (nodeT[4] - 0.4) / 0.55)}</p>
                    {done && <div className="mail-sent">Sent</div>}
                  </div>
                )}
              </div>

              <div className="pane pane-log">
                <div className="pane-head">Execution log</div>
                <ol className="log">
                  {log.slice(-7).map((l, i) => (
                    <li key={`${l.t}-${l.text}-${i}`} className={l.kind ? `is-${l.kind}` : undefined}>
                      <time>{l.t}</time> {l.text}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
