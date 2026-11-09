"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { PROJECT_TYPES } from "@/lib/contact";
import { EMAIL } from "@/lib/content";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "We couldn't send that just now.");
      form.reset();
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "We couldn't send that just now." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="cf-done" role="status">
        <h2 className="font-display">Got it. Thank you.</h2>
        <p>Your message is with us. We&apos;ll reply to the email you gave.</p>
        <button type="button" className="btn btn-ghost" onClick={() => setStatus({ kind: "idle" })}>
          Send another
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";
  return (
    <form className="cf" onSubmit={onSubmit} noValidate={false}>
      <div className="cf-row">
        <label className="cf-field">
          <span>Name</span>
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label className="cf-field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
      </div>

      <fieldset className="cf-types">
        <legend>What do you need?</legend>
        {PROJECT_TYPES.map((t) => (
          <label key={t} className="cf-pill">
            <input type="radio" name="type" value={t} />
            <span>{t}</span>
          </label>
        ))}
      </fieldset>

      <label className="cf-field">
        <span>Tell us about it</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder="What it should do, who it's for, and any deadline."
        />
      </label>

      {/* honeypot: hidden from people, irresistible to bots */}
      <label className="cf-hp" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {status.kind === "error" && (
        <p className="cf-error" role="alert">
          {status.message} You can also email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      )}

      <button type="submit" className="btn shiny cf-submit" disabled={sending}>
        {sending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
