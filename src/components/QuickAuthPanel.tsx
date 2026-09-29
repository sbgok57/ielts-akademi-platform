"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Sparkles, UserCheck, ShieldCheck } from "lucide-react";

export default function QuickAuthPanel() {
  const [tab, setTab] = useState<"giris" | "kayit">("giris");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SAFETY: NextAuth credentials girişi
  async function handleGiris(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/panel",
      });

      setLoading(false);
      if (!res || res.error) {
        setError("Giriş bilgileri doğrulanamadı. Lütfen kontrol edin.");
        return;
      }
      window.location.href = res.url ?? "/panel";
    } catch {
      setLoading(false);
      setError("Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    }
  }

  // SAFETY: Yeni öğrenci kaydı
  async function handleKayit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/kayit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad: name, email, password }),
      });

      const data = (await res.json().catch(() => ({}))) as { messageTr?: string };

      if (!res.ok) {
        setLoading(false);
        setError(data.messageTr ?? "Kayıt işlemi tamamlanamadı.");
        return;
      }

      // Kayıttan sonra otomatik oturum aç
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/panel",
      });

      setLoading(false);
      window.location.href = loginRes?.url ?? "/panel";
    } catch {
      setLoading(false);
      setError("Kayıt sırasında bir hata oluştu.");
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-[#0a0a0a]/95 sm:p-7">
      {/* Üst Gökkuşağı İnce Çizgi */}
      <div className="rainbow-gradient-h -mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-5 h-1.5 rounded-t-3xl" />

      {/* Başlık & Sekmeler */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-500 dark:text-rose-400">
            <Sparkles className="h-3.5 w-3.5" />
            Öğrenci Portalı
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {tab === "giris" ? "Akademiye Giriş Yap" : "Ücretsiz Başla"}
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-[#141414]">
          <button
            type="button"
            onClick={() => { setTab("giris"); setError(null); }}
            className={`rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
              tab === "giris"
                ? "bg-white text-slate-900 shadow-sm dark:bg-[#222] dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            Giriş
          </button>
          <button
            type="button"
            onClick={() => { setTab("kayit"); setError(null); }}
            className={`rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
              tab === "kayit"
                ? "bg-white text-slate-900 shadow-sm dark:bg-[#222] dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            Kayıt
          </button>
        </div>
      </div>

      {/* Hata Bildirimi */}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Form Alanı */}
      <form onSubmit={tab === "giris" ? handleGiris : handleKayit} className="space-y-3.5">
        {tab === "kayit" && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Adın Soyadın
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Sinem Kaya"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/20 dark:border-slate-800 dark:bg-[#121212] dark:text-white dark:focus:border-rose-400"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            E-posta Adresi
          </label>
          <div className="relative mt-1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ogrenci@ieltsakademi.com"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 pl-10 text-sm font-medium text-slate-900 outline-none transition focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/20 dark:border-slate-800 dark:bg-[#121212] dark:text-white dark:focus:border-rose-400"
            />
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Şifre
            </label>
            {tab === "giris" && (
              <span className="text-[11px] font-semibold text-slate-400">
                En az 6 karakter
              </span>
            )}
          </div>
          <div className="relative mt-1">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 pl-10 text-sm font-medium text-slate-900 outline-none transition focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/20 dark:border-slate-800 dark:bg-[#121212] dark:text-white dark:focus:border-rose-400"
            />
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Gönder Butonu */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-md shadow-rose-500/20 transition-all hover:opacity-95 hover:shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>{tab === "giris" ? "Akademiye Giriş Yap" : "Hesabımı Başlat"}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Hızlı Paneline Git Butonları */}
      <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Link
          href="/panel"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-[#141414] dark:text-slate-300 dark:hover:bg-[#1e1e1e]"
        >
          <UserCheck className="h-4 w-4 text-emerald-500" />
          <span>Doğrudan Öğrenci Paneline Git</span>
        </Link>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Şifrelenmiş güvenli oturum · Cambridge standartlarında müfredat</span>
        </div>
      </div>
    </div>
  );
}
