import { validateContact } from "@/lib/contact";
import { EMAIL } from "@/lib/content";

const RESEND_URL = "https://api.resend.com/emails";
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// shortcut: per-instance memory, so the limit resets on cold starts and isn't shared
// across instances. Upgrade to a KV/Upstash limiter if the form starts getting abused.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.set(ip, [...recent, now]);
  return recent.length >= MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set");
    return Response.json({ ok: false, error: "The form isn't connected yet." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many messages. Try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const result = validateContact(body);
  if (!result.ok) return Response.json(result, { status: 400 });
  // bots get a success so they don't retry; nothing is sent
  if (result.spam) return Response.json({ ok: true });

  const { name, email, type, message } = result.data;
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      // onboarding@resend.dev works until a domain is verified in Resend; then set CONTACT_FROM
      from: process.env.CONTACT_FROM || "doubleaa site <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO || EMAIL],
      reply_to: email,
      subject: `New project enquiry from ${name}`,
      // plain text only: visitor input never becomes HTML
      text: `Name: ${name}\nEmail: ${email}\nProject: ${type || "Not specified"}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend rejected the email", res.status, await res.text());
    return Response.json({ ok: false, error: "We couldn't send that just now." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
