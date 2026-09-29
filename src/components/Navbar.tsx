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
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-black/95">
      {/* Üst Canlı Gökkuşağı Çizgisi */}
      <div className="rainbow-gradient-h h-1 w-full" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/img/logo.svg" alt="IELTS Akademi Logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            IELTS <span className="rainbow-text">Akademi</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-sm font-bold text-slate-600 dark:text-slate-300 md:flex">
          {[
            { href: "/bolum/gramer",   label: "Gramer" },
            { href: "/bolum/okuma",    label: "Okuma" },
            { href: "/bolum/dinleme",  label: "Dinleme" },
            { href: "/bolum/konusma",  label: "Speaking 🎙️" },
            { href: "/haberler",       label: "Haberler 🌍" },
            { href: "/bolum/kelime",   label: "Kelime" },
            { href: "/bolum/deneme",   label: "Deneme" },
            { href: "/sertifika",      label: "Sertifika 🏅" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="transition-colors hover:text-rose-500 dark:hover:text-rose-400"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/panel"
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-1.5 text-xs font-black text-white shadow-sm transition hover:opacity-90"
          >
            Öğrenci Paneli
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Tema Değiştir"
            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-800 dark:bg-[#111] dark:text-slate-300 dark:hover:bg-[#1a1a1a]"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <Link
            href="/giris"
            className="hidden rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-[#111] dark:text-slate-200 dark:hover:bg-[#1a1a1a] sm:inline-flex"
          >
            Giriş Yap
          </Link>
          <Link
            href="/kayit"
            className="rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:opacity-90"
          >
            Hemen Başla
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
            { href: "/bolum/konusma", label: "Speaking (Yapay Zekâ) 🎙️" },
            { href: "/haberler",      label: "Gündem Haberler 🌍" },
            { href: "/bolum/kelime",  label: "Kelime" },
            { href: "/bolum/deneme",  label: "Deneme Sınavı" },
            { href: "/sertifika",     label: "Sertifikalarım 🏅" },
            { href: "/panel",         label: "Öğrenci Panelim" },
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
