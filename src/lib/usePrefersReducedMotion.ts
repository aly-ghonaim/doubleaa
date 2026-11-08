import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Reduced-motion preference that is safe for SSR'd text: the server snapshot
 * (false) is used during hydration, then React re-renders with the real value.
 * framer's useReducedMotion is fine for motion values, but not for choosing
 * which text to render, because it differs between server and first client pass.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
