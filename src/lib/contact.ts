// Contact form shape + validation, used by the API route (the trust boundary).
export const PROJECT_TYPES = ["Website", "Automation", "Both"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export interface ContactInput {
  name: string;
  email: string;
  type: ProjectType | "";
  message: string;
}

export type ContactResult =
  | { ok: true; spam: boolean; data: ContactInput }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Validates an untrusted body. `website` is a honeypot: humans never see it, bots fill it. */
export function validateContact(body: unknown): ContactResult {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Invalid request." };
  const b = body as Record<string, unknown>;
  // collapse line breaks so the name can't inject anything into the email subject
  const name = str(b.name).replace(/[\r\n]+/g, " ");
  const email = str(b.email);
  const message = str(b.message);
  const type = str(b.type);

  if (!name || name.length > 100) return { ok: false, error: "Please add your name." };
  if (!EMAIL_RE.test(email) || email.length > 200) return { ok: false, error: "That email doesn't look right." };
  if (message.length < 10) return { ok: false, error: "Tell us a little more about the project." };
  if (message.length > 5000) return { ok: false, error: "That's a long one. Please keep it under 5,000 characters." };
  if (type && !(PROJECT_TYPES as readonly string[]).includes(type)) return { ok: false, error: "Invalid request." };

  return {
    ok: true,
    spam: str(b.website) !== "",
    data: { name, email, message, type: type as ProjectType | "" },
  };
}
