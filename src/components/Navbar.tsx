"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // SAFETY: SSR'da localStorage yoktur; sadece client'ta çalışır
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-[var(--bg-soft)]/90 backdrop-blur-md"
            style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/img/logo.svg" alt="IELTS Akademi Logo" width={32} height={32} className="h-8 w-8" />
          <span
            className="font-display text-xl font-bold tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            IELTS <span style={{ color: "var(--coral)" }}>Akademi</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-5 text-sm font-semibold md:flex"
             style={{ color: "var(--text-muted)" }}>
          {[
            { href: "/bolum/gramer",   label: "Gramer" },
            { href: "/bolum/okuma",    label: "Okuma" },
            { href: "/bolum/dinleme",  label: "Dinleme" },
            { href: "/bolum/kelime",   label: "Kelime" },
            { href: "/bolum/deneme",   label: "Deneme" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="transition-colors hover:text-[var(--coral)]"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/panel"
            className="rounded-xl px-3 py-1.5 text-sm font-bold transition-colors"
            style={{ background: "var(--teal)", color: "#fff" }}
          >
            Panelim
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Tema Değiştir"
            className="rounded-xl border px-2.5 py-2 text-sm font-medium transition-colors"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <Link
            href="/giris"
            className="hidden rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:text-[var(--coral)] sm:inline-flex"
            style={{ color: "var(--text-muted)" }}
          >
            Giriş
          </Link>
          <Link
            href="/kayit"
            className="rounded-xl px-4 py-2 text-sm font-extrabold text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ background: "var(--coral)" }}
          >
            Ücretsiz Kayıt
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Menüyü Aç"
            onClick={() => setMenuOpen((p) => !p)}
            className="ml-1 rounded-xl border p-2 md:hidden"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="border-t px-4 pb-4 pt-2 md:hidden"
          style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
        >
          {[
            { href: "/bolum/gramer",  label: "Gramer" },
            { href: "/bolum/okuma",   label: "Okuma" },
            { href: "/bolum/dinleme", label: "Dinleme" },
            { href: "/bolum/kelime",  label: "Kelime" },
            { href: "/bolum/deneme",  label: "Deneme" },
            { href: "/panel",         label: "Panelim" },
            { href: "/giris",         label: "Giriş yap" },
            { href: "/kayit",         label: "Ücretsiz Kayıt" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-semibold transition-colors hover:text-[var(--coral)]"
              style={{ color: "var(--text-muted)" }}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
