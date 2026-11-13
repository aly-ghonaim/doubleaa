import Link from "next/link";
import type { ReactNode } from "react";

/* The large contact CTA. The effect itself is the .shiny class in globals.css. */
export function ShinyButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="shiny shiny-btn">
      {children}
    </Link>
  );
}
