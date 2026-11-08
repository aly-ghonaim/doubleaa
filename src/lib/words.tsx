import type { ReactNode } from "react";

/** Split plain strings and marked phrases into word units for MaskReveal mode="word". */
export function toWords(parts: (string | { mark: string })[]): ReactNode[] {
  const out: ReactNode[] = [];
  for (const part of parts) {
    if (typeof part === "string") {
      out.push(...part.split(/\s+/).filter(Boolean));
    } else {
      for (const w of part.mark.split(/\s+/).filter(Boolean)) {
        out.push(
          <span key={`m-${out.length}`} className="mark">
            {w}
          </span>,
        );
      }
    }
  }
  return out;
}
