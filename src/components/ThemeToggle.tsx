"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = stored === "dark" || (!stored && prefersDark);
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-2xl border border-border bg-bg-soft opacity-0" />
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Aydınlık moda geç" : "Karanlık moda geç"}
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-bg-soft text-foreground shadow-sm transition-all duration-200 hover:scale-105 hover:border-brand-1/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-1"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-brand-1 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}
