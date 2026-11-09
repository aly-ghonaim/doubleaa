// Shared between the form (client) and the route (server), so both enforce
// exactly the same rules.

export const PROJECT_TYPES = ["Website", "Automation", "Both", "Not sure yet"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  type: ProjectType;
  callTime: string;
  message: string;
  /** Honeypot: hidden from people, filled in by bots. Must stay empty. */
  website: string;
}

export const LIMITS = {
  name: 100,
  email: 200,
  phone: 40,
  company: 120,
  callTime: 120,
  message: 4000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type FieldErrors = Partial<Record<keyof ContactRequest, string>>;

/** Trim every field and return the first problem per field, if any. */
export function validateContact(input: Partial<Record<keyof ContactRequest, unknown>>): {
  data: ContactRequest;
  errors: FieldErrors;
} {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const data: ContactRequest = {
    name: str(input.name),
    email: str(input.email),
    phone: str(input.phone),
    company: str(input.company),
    type: (PROJECT_TYPES as readonly string[]).includes(str(input.type))
      ? (str(input.type) as ProjectType)
      : "Not sure yet",
    callTime: str(input.callTime),
    message: str(input.message),
    website: str(input.website),
  };

  const errors: FieldErrors = {};
  if (!data.name) errors.name = "Please tell us your name.";
  if (!data.email) errors.email = "We need an email to reply to.";
  else if (!EMAIL_RE.test(data.email)) errors.email = "That email doesn't look right.";
  if (data.message.length < 10) errors.message = "A sentence or two about the project, please.";

  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    if (data[key].length > LIMITS[key]) errors[key] = `Please keep this under ${LIMITS[key]} characters.`;
  }
  return { data, errors };
}
