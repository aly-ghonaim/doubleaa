import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { HexField } from "@/components/HexField";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | doubleaa",
  description: "Tell Aly and Abdullah what you want built: a website, an n8n automation, or both.",
};

export default function ContactPage() {
  return (
    <>
      <HexField />
      <Nav />
      <main id="top" className="section wrap contact-page">
        <h1 className="sec-title font-display">
          Tell us what you want <span className="mark">built.</span>
        </h1>
        <p className="sec-sub">
          A site, a workflow, or both. Send the outcome you&apos;re after and we&apos;ll reply by email to scope it.
        </p>
        <ContactForm />
      </main>
    </>
  );
}
