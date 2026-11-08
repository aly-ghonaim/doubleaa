"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem("daa-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // localStorage blocked — fall through to system preference
  }
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function Nav() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("daa-theme", next);
    } catch {
      // persistence unavailable — the choice still applies for this session
    }
  };

  return (
    <nav className="nav" aria-label="Primary">
      <div className="pill">
        <a href="#top" className="brand">
          double<i>a</i>
          <i>a</i>
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
      <div className="pill pill-right">
        <a href="#contact" className="nav-cta">
          Start a project
        </a>
        <button
          type="button"
          className="toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title="Toggle theme"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </nav>
  );
}
