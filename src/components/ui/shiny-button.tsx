import Link from "next/link";
import type { ReactNode } from "react";

/* Our own take on a "shiny button": a conic-gradient rim that circles the pill, a
   shimmer that sweeps across, and a halftone dot field inside. All styling lives in
   globals.css (.shiny-btn) so it shares the site tokens. */
export function ShinyButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="shiny-btn">
      <span className="shiny-btn-dots" aria-hidden="true" />
      <span className="shiny-btn-label">{children}</span>
    </Link>
  );
}
