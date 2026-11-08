import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

// The theme lives on <html data-theme>, set before paint by the inline script
// in layout.tsx. Reading it as an external store keeps SSR (always "dark") and
// the client in agreement without a setState-in-effect.
const THEME_EVENT = "daa-theme";

function subscribe(cb: () => void) {
  window.addEventListener(THEME_EVENT, cb);
  return () => window.removeEventListener(THEME_EVENT, cb);
}

function read(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, (): Theme => "dark");
}

export function setTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("daa-theme", next);
  } catch {
    // persistence unavailable: the choice still applies for this session
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}
