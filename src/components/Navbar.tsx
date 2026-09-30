"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import ThemePickerModal from "@/components/ThemePickerModal";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-black/95">
        {/* Üst Canlı Gökkuşağı Çizgisi */}
        <div className="rainbow-gradient-h h-1 w-full" />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

          {/* Logo — Sekmedeki ikon (/icon.svg) ile %100 aynı, ÇOK BÜYÜK ve GÖRKEMLİ resmi ikon */}
          <Link href="/" className="flex items-center gap-3.5 sm:gap-4 group py-1">
            <img
              src="/icon.svg"
              alt="IELTS Akademi Logo"
              width={80}
              height={80}
              className="h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-2xl sm:rounded-3xl shadow-xl shadow-purple-500/30 group-hover:scale-108 transition-all shrink-0 ring-2 ring-purple-500/40 hover:ring-purple-500/70 select-none"
            />
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                IELTS <span className="rainbow-text">Akademi</span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1">
                Resmi Eğitim Platformu
              </span>
            </div>
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
            { href: "/posta",          label: "Posta 📬" },
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
        <div className="flex items-center gap-2">
          {/* 200+ Renk Teması Seçici Butonu */}
          <button
            type="button"
            onClick={() => setThemePickerOpen(true)}
            aria-label="200'den Fazla Renk Teması Seç"
            className="flex items-center gap-1.5 rounded-xl border border-purple-300/80 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 px-3 py-1.5 text-xs font-black text-purple-700 dark:border-purple-800 dark:text-purple-300 hover:scale-105 shadow-sm transition"
            title="240 Renkli Temadan Birini Seç"
          >
            <Palette className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">200+ Renk Teması</span>
            <span className="sm:hidden">Temalar</span>
          </button>

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
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setThemePickerOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-500/15 py-2.5 my-2 text-xs font-black text-purple-600 dark:text-purple-300 border border-purple-500/20"
          >
            <Palette className="h-4 w-4" />
            <span>🎨 200+ Renk Teması Seç</span>
          </button>
          {[
            { href: "/bolum/gramer",  label: "Gramer" },
            { href: "/bolum/okuma",   label: "Okuma" },
            { href: "/bolum/dinleme", label: "Dinleme" },
            { href: "/bolum/konusma", label: "Speaking (Yapay Zekâ) 🎙️" },
            { href: "/haberler",      label: "Gündem Haberler 🌍" },
            { href: "/bolum/kelime",  label: "Kelime" },
            { href: "/bolum/deneme",  label: "Deneme Sınavı" },
            { href: "/sertifika",     label: "Sertifikalarım 🏅" },
            { href: "/posta",         label: "Kurumsal Posta 📬" },
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

    {/* 200'den Fazla Kişiselleştirme Teması Modalı */}
    <ThemePickerModal
      isOpen={themePickerOpen}
      onClose={() => setThemePickerOpen(false)}
    />
  </>
  );
}
