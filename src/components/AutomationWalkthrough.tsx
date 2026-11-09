"use client";

import type { CSSProperties } from "react";
import DimensionalWorkflowHero from "@/components/ui/dimensional-workflow-hero";
import type { ScrollExperienceContent, WorkflowChapter } from "@/components/ui/dimensional-workflow-hero";
import { automation } from "@/lib/content";

// Token colours as hex (coral accent, peach glow): node colours also feed SVG
// gradient stops, which can't read CSS vars.
const COBALT = "#e8664a";
const FLAME = "#f2d4b0";
const SHADOW = "#060204";

function project(title: string) {
  const found = automation.find((p) => p.title === title);
  if (!found) throw new Error(`[automation walkthrough] no project titled "${title}" in content.ts`);
  return found;
}

/** Chapter copy comes from content.ts; diagrams are simplified from each real n8n flow. */
function chapter(
  title: string,
  rest: Pick<WorkflowChapter, "tag" | "title" | "steps" | "diagram">,
): WorkflowChapter {
  const p = project(title);
  return {
    kind: "workflow",
    name: p.title,
    description: p.blurb,
    color: COBALT,
    status: `${p.status} · n8n`,
    panelLabel: `by ${p.author}`,
    footerLabel: "Simplified from the real workflow",
    ...rest,
  };
}

const content: ScrollExperienceContent = {
  ariaLabel: "Walk through three n8n automations we built",
  skip: { label: "Skip the automation walkthrough", target: "#automations-end" },
  intro: {
    eyebrow: "AUTOMATION · N8N",
    title: { lines: ["The work that", "runs itself."], emphasis: "runs itself." },
    description: [
      "Three n8n systems we've built,",
      "walked through one step at a time.",
    ],
    cta: "Walk through them",
  },
  chapters: [
    chapter("Lead Capture & AI Dispatch", {
      tag: "LEAD INTAKE",
      title: ["A form comes in.", "A reply goes out."],
      steps: [
        { title: "Form submitted", body: "A Jotform submission starts the workflow." },
        { title: "AI triage", body: "An OpenAI model evaluates it, and validation rules route it." },
        { title: "Logged and answered", body: "The lead is synced to a sheet and answered by a tailored email." },
      ],
      diagram: {
        nodes: [
          { icon: "message-square", label: "Jotform", caption: "NEW SUBMISSION", x: 2, y: 38, step: 0, color: COBALT },
          { icon: "bot", label: "OpenAI", caption: "EVALUATES", x: 26, y: 38, step: 1, color: COBALT },
          { icon: "shield-check", label: "If", caption: "VALIDATION RULES", x: 50, y: 38, step: 1, color: FLAME },
          { icon: "database", label: "Sheets", caption: "LEAD SYNCED", x: 76, y: 16, step: 2, color: COBALT },
          { icon: "mail", label: "Gmail", caption: "TAILORED REPLY", x: 76, y: 60, step: 2, color: COBALT },
        ],
        edges: [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 2, to: 4 },
        ],
        note: "ONE SUBMISSION · NO HUMAN IN THE LOOP",
        gradient: [COBALT, COBALT, FLAME],
      },
    }),
    chapter("Autonomous Video Publisher", {
      tag: "CONTENT PIPELINE",
      title: ["One command.", "A published video."],
      steps: [
        { title: "Triggered", body: "A Telegram command or a cron schedule kicks it off." },
        { title: "Scripted and rendered", body: "GPT-4 writes the script; Hook, Problem, Solution and CTA segments render in parallel." },
        { title: "Published", body: "The video goes up through the YouTube API, with retries when the API times out." },
      ],
      diagram: {
        nodes: [
          { icon: "bell", label: "Telegram / cron", caption: "TRIGGER", x: 2, y: 38, step: 0, color: COBALT },
          { icon: "bot", label: "GPT-4", caption: "WRITES THE SCRIPT", x: 27, y: 16, step: 1, color: COBALT },
          { icon: "clapperboard", label: "Render", caption: "4 SEGMENTS IN PARALLEL", x: 52, y: 60, step: 1, color: FLAME },
          { icon: "upload", label: "YouTube API", caption: "PUBLISHED · RETRIES", x: 77, y: 38, step: 2, color: COBALT },
        ],
        edges: [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 2, to: 3 },
        ],
        note: "ONE TRIGGER · ONE PUBLISHED VIDEO",
        gradient: [COBALT, FLAME, COBALT],
      },
    }),
    chapter("Rebell Membership & Payments", {
      tag: "GYM MEMBERSHIPS",
      title: ["No payment counts", "until it's confirmed."],
      steps: [
        { title: "Payment comes in", body: "A member pays for their subscription." },
        { title: "Two-factor confirmation", body: "The payment has to pass a 2FA check before it counts." },
        { title: "Recorded and tracked", body: "Only then is the money recorded against the member's subscription." },
      ],
      diagram: {
        nodes: [
          { icon: "credit-card", label: "Payment", caption: "MEMBER PAYS", x: 3, y: 38, step: 0, color: COBALT },
          { icon: "shield-check", label: "2FA confirm", caption: "MUST PASS", x: 29, y: 38, step: 1, color: FLAME },
          { icon: "database", label: "Recorded", caption: "MONEY TRACKED", x: 60, y: 16, step: 2, color: COBALT },
          { icon: "user-round", label: "Subscription", caption: "MEMBER UP TO DATE", x: 60, y: 60, step: 2, color: COBALT },
        ],
        edges: [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 2, to: 3, out: "bottom", in: "top" },
        ],
        note: "NOTHING IS RECORDED WITHOUT CONFIRMATION",
        gradient: [COBALT, FLAME, COBALT],
      },
    }),
  ],
  finale: {
    eyebrow: "YOUR WORKFLOW NEXT",
    title: { lines: ["Got a job that should", "run on its own?"], emphasis: "run on its own?" },
    cta: { label: "Start a project", href: "#contact" },
  },
  navLabel: "Choose an automation",
  footer: {
    disclaimer: "DIAGRAMS SIMPLIFIED FROM OUR REAL N8N WORKFLOWS",
    scrollHint: "SCROLL TO WALK THROUGH",
  },
};

// Map the component's theme hooks onto the riso tokens in globals.css.
const theme = {
  "--color-background": "var(--paper)",
  "--color-foreground": "var(--ink)",
  "--color-card": "var(--card)",
  "--color-card-foreground": "var(--ink)",
  "--color-muted-foreground": "var(--muted)",
  "--color-border": "var(--line-2)",
  "--color-primary": "var(--cobalt)",
  "--color-primary-foreground": "var(--paper)",
  "--workflow-shadow-color": SHADOW,
  "--workflow-signal-color": "var(--flame)",
  "--font-hero-body": "var(--font-sans), system-ui, sans-serif",
  "--font-hero-display": "var(--font-display), Georgia, serif",
  "--font-hero-mono": "var(--font-mono), ui-monospace, monospace",
} as CSSProperties;

// ~1 viewport per chapter keeps the pinned section short.
const motion = { viewportsPerChapter: 1, scrub: 0.65 };

export function AutomationWalkthrough() {
  return (
    <>
      <DimensionalWorkflowHero content={content} motion={motion} style={theme} />
      <div id="automations-end" tabIndex={-1} />
    </>
  );
}
