"use client";

import { useState } from "react";
import { EMAIL } from "@/lib/content";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // clipboard blocked — select the text so the viewer can copy manually
      const node = document.getElementById("email-label");
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  };

  return (
    <button type="button" className="btn btn-primary" onClick={handleCopy}>
      <span id="email-label">{copied ? "copied ✓" : EMAIL}</span>
    </button>
  );
}
