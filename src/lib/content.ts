export type Author = "Aly" | "Abdullah";
export type StatusKind = "ok" | "pending" | "neutral";
export type TileSize = "featured" | "narrow" | "wide";

export interface Project {
  title: string;
  role: string;
  blurb: string;
  author: Author;
  stack?: string[];
  flow?: string[];
  status: string;
  statusKind: StatusKind;
  size?: TileSize;
}

export const web: Project[] = [
  {
    title: "Rebell",
    role: "Gym brand landing page",
    blurb:
      "A high-contrast, animated marketing site for a combat-training gym — scroll-driven motion, glass navigation, a bold editorial hero. Built and production-bundled.",
    author: "Aly",
    stack: ["React", "Vite", "GSAP", "Tailwind"],
    status: "Built",
    statusKind: "ok",
    size: "featured",
  },
  {
    title: "Old Mill Cafe",
    role: "Hospitality website template",
    blurb:
      "A warm, historic-themed cafe site: earthy palette, custom wave dividers, a table-reservation call-to-action, and showcase grids for daily bakes and the gift shop. Reusable as a template for other hospitality brands.",
    author: "Abdullah",
    stack: ["HTML5", "CSS3", "JavaScript", "Local SEO"],
    status: "Template · reusable",
    statusKind: "neutral",
    size: "narrow",
  },
  {
    title: "Dolly House KW",
    role: "Custom Shopify storefront · Arabic-first (RTL) + English",
    blurb:
      "A custom Shopify Liquid theme for a Kuwaiti handcrafted-jewelry brand — bilingual with a full right-to-left layout, product pages with measurements and multiple angles, and the owner running her own catalogue. Security-audited before launch: visitor-input XSS found and fixed.",
    author: "Aly",
    stack: ["Shopify Liquid", "RTL / i18n", "security-audited"],
    status: "Live client",
    statusKind: "ok",
    size: "wide",
  },
];

export const automation: Project[] = [
  {
    title: "Lead Capture & AI Dispatch",
    role: "Form → AI triage → spreadsheet → email",
    blurb:
      "Incoming form submissions are evaluated by an AI model, routed on validation rules, synced to a sheet, and answered by a tailored email — no human in the loop.",
    author: "Abdullah",
    flow: ["Jotform", "OpenAI", "If", "Sheets", "Gmail"],
    stack: ["n8n"],
    status: "Built",
    statusKind: "ok",
    size: "featured",
  },
  {
    title: "Autonomous Video Publisher",
    role: "Script → render → YouTube, on a trigger",
    blurb:
      "A Telegram command or a cron schedule starts GPT-4 scriptwriting, renders Hook / Problem / Solution / CTA segments in parallel, and publishes to YouTube — with retry handling for API timeouts.",
    author: "Abdullah",
    flow: ["Telegram / cron", "GPT-4", "Render", "YouTube API"],
    stack: ["n8n"],
    status: "Built",
    statusKind: "ok",
    size: "narrow",
  },
  {
    title: "Rebell Membership & Payments",
    role: "Registration, payment confirmation & renewals",
    blurb:
      "A system design where registration pages post to n8n webhooks, coaches confirm desk payments behind an access code, every payment is appended to a ledger sheet, contracts generate as PDFs over WhatsApp, and a 9 AM job reports renewals. Google Sheets as the database.",
    author: "Aly",
    flow: ["Web form", "n8n webhook", "Sheets ledger", "WhatsApp PDF"],
    stack: ["n8n", "Google Sheets"],
    status: "Designed",
    statusKind: "pending",
  },
  {
    title: "Timetable Extractor",
    role: "Photo of a schedule → structured data",
    blurb:
      "A vision model reads a photographed university timetable and turns it into structured courses, days and slots, then tracks attendance against each session — AI integration inside a real Next.js app.",
    author: "Aly",
    stack: ["Next.js", "Gemini vision"],
    status: "Working",
    statusKind: "ok",
  },
];

export interface Capability {
  title: string;
  body: string;
  items: string[];
}

export const capabilities: Capability[] = [
  {
    title: "Websites & storefronts",
    body: "The part your customers see. Fast, responsive, and built to convert — from a one-page launch to a full custom storefront.",
    items: [
      "Marketing sites & landing pages",
      "Custom Shopify themes, Arabic-first (RTL) or English",
      "React & Next.js front-ends",
      "Security-audited before it goes live",
    ],
  },
  {
    title: "AI & n8n automation",
    body: "The machine behind it. The repetitive work that should run itself — triaged, routed, and answered without a human in the loop.",
    items: [
      "Form → AI triage → sheet → email pipelines",
      "Content generation & auto-publishing",
      "Vision & LLM integrations inside real apps",
      "Scheduled jobs, webhooks, and ledgers",
    ],
  },
];

// Honest proof — the tools we actually build with, not clients we don't have.
export const tools = ["Next.js", "React", "Shopify", "n8n", "OpenAI", "Tailwind"];

export const studioQA: { q: string; a: string }[] = [
  {
    q: "What we build",
    a: "Marketing sites and storefronts on the front, n8n and AI pipelines behind them. The work we like best is where the two meet — a form that feeds a workflow, a store that runs its own admin.",
  },
  {
    q: "How we work",
    a: "Tell us the outcome, not the ticket. We cut it down to the smallest thing that actually solves it, ship that, and add more only once it earns its place. One of us is a security person, so what we hand over is built to hold up.",
  },
  {
    q: "How to reach us",
    a: "Email us what you're building and where it's getting stuck. We read everything, and we write back.",
  },
];

export const EMAIL = "alyghoniam@gmail.com";
export const GITHUB = "https://github.com/aly-ghonaim";
