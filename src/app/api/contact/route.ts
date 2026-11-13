import { validateContact, type ContactRequest } from "@/lib/contact";
import { EMAIL } from "@/lib/content";

/*
 * POST /api/contact — the "Start a project" form.
 *
 * Sends the request to our inbox through Resend (https://resend.com).
 * Configure in Vercel → Project → Settings → Environment Variables:
 *   RESEND_API_KEY  the API key from resend.com/api-keys
 *   CONTACT_TO      optional; the inbox(es) that receive requests, comma-separated.
 *                   Defaults to the public studio EMAIL.
 *   CONTACT_FROM    optional; defaults to Resend's shared test sender, which
 *                   only delivers to the email that owns the Resend account.
 *                   Once a domain is verified in Resend, set e.g.
 *                   "doubleaa <hello@yourdomain.com>".
 * The client's address is set as Reply-To, so replying in Gmail answers them.
 */

const DEFAULT_FROM = "doubleaa website <onboarding@resend.dev>";

// Best-effort flood guard: a few requests per address per 10 minutes. It lives
// in memory, so it resets when the function cold-starts — enough to stop a
// stuck submit button or a casual bot, not a determined attacker.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function render(d: ContactRequest) {
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Phone / WhatsApp", d.phone || "—"],
    ["Company / project", d.company || "—"],
    ["Needs", d.type],
    ["Good time for a call", d.callTime || "—"],
  ];
  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nMessage:\n${d.message}\n\n— sent from the doubleaa website`;
  const html = `
<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#1a1a1a;max-width:560px">
  <h2 style="margin:0 0 16px;font-size:20px">New project request</h2>
  <table style="border-collapse:collapse;width:100%;font-size:14px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${escape(k)}</td><td style="padding:6px 0">${escape(v)}</td></tr>`,
      )
      .join("")}
  </table>
  <h3 style="margin:20px 0 8px;font-size:15px">Message</h3>
  <p style="white-space:pre-wrap;font-size:14px;line-height:1.55;margin:0">${escape(d.message)}</p>
  <p style="margin-top:24px;font-size:12px;color:#888">Reply to this email to answer ${escape(d.name)} directly.</p>
</div>`;
  return { text, html };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { data, errors } = validateContact((body ?? {}) as Record<string, unknown>);

  // A filled honeypot is a bot: answer as if it worked and send nothing.
  if (data.website) return Response.json({ ok: true });

  if (Object.keys(errors).length) {
    return Response.json({ ok: false, error: "Please check the highlighted fields.", errors }, { status: 422 });
  }

  // Only real send attempts count, so a client fixing typos never locks themselves out.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || EMAIL;
  if (!key) {
    console.error("contact: RESEND_API_KEY is not set");
    return Response.json(
      { ok: false, error: "The form isn't connected yet." },
      { status: 503 },
    );
  }

  const { text, html } = render(data);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || DEFAULT_FROM,
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: data.email,
      subject: `New project request: ${data.name} (${data.type})`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    console.error("contact: Resend rejected the email", res.status, await res.text().catch(() => ""));
    return Response.json(
      { ok: false, error: "We couldn't send that just now. Please try again." },
      { status: 502 },
    );
  }
  return Response.json({ ok: true });
}
