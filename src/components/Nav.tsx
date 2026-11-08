"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem("daa-theme");
    if (saved === "light") return "light";
  } catch {
    // localStorage blocked — fall through to the committed default
  }
  return "dark";
}

export function Nav() {
  const [theme, setTheme] = useState<Theme>("dark");

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
    <header className="bar">
      <div className="bar-inner">
        <a href="#top" className="brand">
          double<i>aa</i>
        </a>
        <nav className="bar-nav" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="bar-tools">
          <button
            type="button"
            className="toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title="Toggle theme"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <a href="#contact" className="bar-cta">
            Start a project
          </a>
        </div>
      </div>
    </header>
  );
}
