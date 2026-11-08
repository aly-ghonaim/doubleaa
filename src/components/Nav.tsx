"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem("daa-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore storage errors
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export function Nav() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("daa-theme", next);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <header className="bar">
      <div className="wrap bar-inner">
        <a href="#top" className="brand" aria-label="doubleaa home">
          double<i>a</i><i>a</i>
        </a>
        <nav className="nav-links" aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="#contact">Contact</a>
        </nav>
        <button
          type="button"
          className="toggle"
          onClick={handleToggle}
          aria-label="Toggle colour theme"
        >
          {mounted ? (theme === "dark" ? "☾ dark" : "☀ light") : "theme"}
        </button>
      </div>
    </header>
  );
}
