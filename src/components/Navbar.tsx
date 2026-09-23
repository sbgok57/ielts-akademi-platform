"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
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
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight text-slate-900 dark:text-white">
          <img src="/img/logo.svg" alt="IELTS Akademi Logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-xl">IELTS Akademi</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
          <Link href="/bolum/gramer" className="hover:text-violet-600 dark:hover:text-violet-400">Gramer</Link>
          <Link href="/bolum/okuma" className="hover:text-violet-600 dark:hover:text-violet-400">Okuma</Link>
          <Link href="/bolum/dinleme" className="hover:text-violet-600 dark:hover:text-violet-400">Dinleme</Link>
          <Link href="/bolum/kelime" className="hover:text-violet-600 dark:hover:text-violet-400">Kelime</Link>
          <Link href="/bolum/deneme" className="hover:text-violet-600 dark:hover:text-violet-400">Deneme</Link>
          <Link href="/panel" className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">Panelim</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Tema Değiştir"
            className="rounded-xl border border-slate-200 p-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isDark ? "☀️ Açık" : "🌙 Koyu"}
          </button>
          <Link
            href="/giris"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:text-violet-600 dark:text-slate-200"
          >
            Giriş
          </Link>
          <Link
            href="/kayit"
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:bg-violet-700"
          >
            Ücretsiz Kayıt
          </Link>
        </div>
      </div>
    </header>
  );
}
