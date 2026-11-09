import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { StartForm } from "@/components/StartForm";

export const metadata: Metadata = {
  title: "Start a project · doubleaa",
  description: "Tell us what you want built. It comes straight to our inbox and we reply to book a call.",
};

export default function StartPage() {
  return (
    <>
      <Nav />
      <main id="top" className="start wrap">
        <Link className="start-back" href="/">
          ← Back to the site
        </Link>
        <div className="start-grid">
          <div className="start-intro">
            <h1 className="sec-title font-display">
              Start a <span className="mark">project.</span>
            </h1>
            <p className="sec-sub">
              Tell us what you want built: a website, the automation behind it,
              or both. It goes straight to our inbox, and we&apos;ll reply to
              book a call.
            </p>
            <ol className="start-steps">
              <li>
                <span>
                  <b>You send this.</b> A few lines is plenty.
                </span>
              </li>
              <li>
                <span>
                  <b>We reply.</b> Questions, if we have any, and a time to talk.
                </span>
              </li>
              <li>
                <span>
                  <b>We scope it together</b> on a short call, then send a plan.
                </span>
              </li>
            </ol>
          </div>
          <div className="start-card">
            <StartForm />
          </div>
        </div>
      </main>
    </>
  );
}
