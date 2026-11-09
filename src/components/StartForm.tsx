"use client";

import Link from "next/link";

import { useRef, useState, type FormEvent } from "react";
import { EMAIL } from "@/lib/content";
import { LIMITS, PROJECT_TYPES, validateContact, type FieldErrors } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * The "Start a project" form. Validates in the browser with the same rules the
 * server uses, posts to /api/contact, and swaps itself for a confirmation once
 * the email is on its way.
 */
export function StartForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [sentName, setSentName] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const { data, errors: found } = validateContact(raw);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      // move focus to the first field with a problem
      const first = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: FieldErrors };
      if (!res.ok || !json.ok) {
        setErrors(json.errors ?? {});
        setStatus("error");
        setMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSentName(data.name.split(" ")[0]);
      setStatus("sent");
    } catch {
      setStatus("error");
      setMessage("You seem to be offline. Please try again when you're connected.");
    }
  }

  if (status === "sent") {
    return (
      <div className="start-done" role="status">
        <p className="start-done-kicker">Sent</p>
        <h2 className="start-done-title font-display">Thanks, {sentName}. It&apos;s in our inbox.</h2>
        <p className="start-done-sub">
          We read every request ourselves and will reply by email to set up a
          call at a time that suits you.
        </p>
        <Link className="btn btn-ghost" href="/">
          Back to the site
        </Link>
      </div>
    );
  }

  const field = (name: keyof FieldErrors) => ({
    name,
    id: `f-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `e-${name}` : undefined,
  });
  const err = (name: keyof FieldErrors) =>
    errors[name] ? (
      <span className="field-error" id={`e-${name}`}>
        {errors[name]}
      </span>
    ) : null;

  return (
    <form ref={formRef} className="start-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <label className="field" htmlFor="f-name">
          <span className="field-label">Your name</span>
          <input {...field("name")} type="text" autoComplete="name" maxLength={LIMITS.name} required />
          {err("name")}
        </label>
        <label className="field" htmlFor="f-email">
          <span className="field-label">Email</span>
          <input {...field("email")} type="email" autoComplete="email" maxLength={LIMITS.email} required />
          {err("email")}
        </label>
        <label className="field" htmlFor="f-phone">
          <span className="field-label">
            Phone / WhatsApp <em>optional</em>
          </span>
          <input {...field("phone")} type="tel" autoComplete="tel" maxLength={LIMITS.phone} />
          {err("phone")}
        </label>
        <label className="field" htmlFor="f-company">
          <span className="field-label">
            Company or project <em>optional</em>
          </span>
          <input {...field("company")} type="text" autoComplete="organization" maxLength={LIMITS.company} />
          {err("company")}
        </label>
      </div>

      <fieldset className="field chips">
        <legend className="field-label">What do you need?</legend>
        <div className="chip-row">
          {PROJECT_TYPES.map((t, i) => (
            <label key={t} className="chip">
              <input type="radio" name="type" value={t} defaultChecked={i === 0} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field" htmlFor="f-message">
        <span className="field-label">Tell us about it</span>
        <textarea
          {...field("message")}
          rows={6}
          maxLength={LIMITS.message}
          placeholder="What you want built, what's getting in the way, any deadline."
          required
        />
        {err("message")}
      </label>

      <label className="field" htmlFor="f-callTime">
        <span className="field-label">
          Good time for a call <em>optional</em>
        </span>
        <input
          {...field("callTime")}
          type="text"
          maxLength={LIMITS.callTime}
          placeholder="e.g. weekday evenings, Cairo time"
        />
        {err("callTime")}
      </label>

      {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
      <div className="hp" aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="form-foot">
        <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send request"}
        </button>
        <p className={`form-status${status === "error" ? " is-error" : ""}`} role="status" aria-live="polite">
          {status === "error" && message ? (
            <>
              {message} You can also email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </>
          ) : (
            "It comes straight to our inbox. We reply by email to set up a call."
          )}
        </p>
      </div>
    </form>
  );
}
