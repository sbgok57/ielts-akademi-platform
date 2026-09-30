"use client";
// app/giris/page.tsx — Split-panel giriş sayfası (tab: Giriş / Kayıt)
// Tasarım: sol marka paneli (ink bg + coral/teal daireler) + sağ form

import { useState } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { loadStudentProgress, saveStudentProgress } from "@/lib/progress-store";


/* ─── Shared input style ─── */
const inp =
  "mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--coral)] focus:ring-2 focus:ring-[var(--coral)]/20";
const inpStyle = {
  background: "var(--bg-soft)",
  borderColor: "var(--border)",
  color: "var(--text)",
};

export default function GirisSayfasi() {
  /* Tab durumu — bu sayfa hem giriş hem kayıt'ı yönetir */
  const [tab, setTab] = useState<"giris" | "kayit">("giris");

  /* Giriş formu state */
  const [gEmail, setGEmail] = useState("");
  const [gPass, setGPass] = useState("");
  const [gHata, setGHata] = useState<string | null>(null);
  const [gYukleniyor, setGYukleniyor] = useState(false);

  /* Kayıt formu state */
  const [kAd, setKAd] = useState("");
  const [kEmail, setKEmail] = useState("");
  const [kPass, setKPass] = useState("");
  const [kHata, setKHata] = useState<string | null>(null);
  const [kYukleniyor, setKYukleniyor] = useState(false);

  /* ─── Yönetici (sbgok57) 1-Tıkla Doğrudan Giriş ─── */
  async function handleAdminDirectLogin() {
    setGHata(null);
    setGYukleniyor(true);
    setGEmail("sbgok57@ieltsakademi.com");
    setGPass("220802Sbg");

    try {
      await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "sbgok57@ieltsakademi.com", password: "220802Sbg" }),
      });
    } catch {}

    document.cookie = "sid=admin-sbgok57; path=/; max-age=31536000; SameSite=Lax";
    document.cookie = "admin=sbgok57; path=/; max-age=31536000; SameSite=Lax";
    document.cookie = "authjs.session-token=admin-sbgok57; path=/; max-age=31536000; SameSite=Lax";

    const prog = loadStudentProgress();
    prog.email = "sbgok57@ieltsakademi.com";
    prog.studentName = "Sinem Buse Gök (sbgok57)";
    prog.isAdmin = true;
    (prog as any).savedAdminPassword = "220802Sbg";
    saveStudentProgress(prog);

    try {
      await signIn("credentials", {
        email: "sbgok57@ieltsakademi.com",
        password: "220802Sbg",
        redirect: false,
        callbackUrl: "/panel",
      });
    } catch {}

    setGYukleniyor(false);
    window.location.href = "/panel";
  }

  /* ─── Giriş handler ─── */
  async function gonder(e: FormEvent) {
    e.preventDefault();
    setGHata(null);
    setGYukleniyor(true);

    const isSbgok = gEmail.trim().toLowerCase().includes("sbgok57");

    if (isSbgok) {
      // 👑 ADMIN KULLANICI: Chrome'da kayıtlı her şifreyi doğru kabul et!
      try {
        await fetch("/api/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: gEmail, password: gPass || "220802Sbg" }),
        });
      } catch {}

      // Tarayıcı çerezlerini doğrudan yaz (Middleware & Server Component güvencesi)
      document.cookie = "sid=admin-sbgok57; path=/; max-age=31536000; SameSite=Lax";
      document.cookie = "admin=sbgok57; path=/; max-age=31536000; SameSite=Lax";
      document.cookie = "authjs.session-token=admin-sbgok57; path=/; max-age=31536000; SameSite=Lax";

      const prog = loadStudentProgress();
      prog.email = "sbgok57@ieltsakademi.com";
      prog.studentName = "Sinem Buse Gök (sbgok57)";
      prog.isAdmin = true;
      (prog as any).savedAdminPassword = gPass || "220802Sbg";
      saveStudentProgress(prog);

      try {
        await signIn("credentials", {
          email: "sbgok57@ieltsakademi.com",
          password: gPass || "220802Sbg",
          redirect: false,
          callbackUrl: "/panel",
        });
      } catch {}

      setGYukleniyor(false);
      window.location.href = "/panel";
      return;
    }

    const sonuc = await signIn("credentials", {
      email: gEmail,
      password: gPass,
      redirect: false,
      callbackUrl: "/panel",
    });
    setGYukleniyor(false);
    if (!sonuc || sonuc.error) {
      setGHata("E-posta veya şifre hatalı. Tekrar dene.");
      return;
    }
    window.location.href = sonuc.url ?? "/panel";
  }

  /* ─── Kayıt handler ─── */
  async function kayitGonder(e: FormEvent) {
    e.preventDefault();
    setKHata(null);
    setKYukleniyor(true);
    const yanit = await fetch("/api/kayit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ad: kAd, email: kEmail, password: kPass }),
    });
    const veri = await yanit.json().catch(() => ({})) as { messageTr?: string };
    if (!yanit.ok) {
      setKYukleniyor(false);
      setKHata(veri.messageTr ?? "Kayıt tamamlanamadı.");
      return;
    }
    const sonuc = await signIn("credentials", {
      email: kEmail,
      password: kPass,
      redirect: false,
    });
    setKYukleniyor(false);
    window.location.href = sonuc?.error ? "/giris" : "/panel";
  }

  /* ─── Sol marka paneli stat'ları ─── */
  const STATS = [
    { rakam: "50 000+", etiket: "Aktif öğrenci" },
    { rakam: "Band 7+", etiket: "Ortalama hedef skor" },
    { rakam: "12",      etiket: "Modül ve bölüm" },
  ];

  return (
    /* Split layout: sol marka, sağ form */
    <div className="split-layout" style={{ minHeight: "100vh" }}>

      {/* ─── SOL PANEL: Marka / Motivasyon ─── */}
      <aside className="brand-panel">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <img
              src="/icon.svg"
              alt="IELTS Akademi Logo"
              width={44}
              height={44}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl shadow-lg shadow-purple-500/25 shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-black text-white tracking-tight">
              IELTS <span className="rainbow-text-bright">Akademi</span>
            </span>
          </Link>

          <h1 className="text-4xl font-black leading-tight text-white tracking-tight">
            A1&apos;den C2&apos;ye<br />
            <span className="rainbow-text-bright">gerçek ilerleme.</span>
          </h1>

          <p className="mt-4 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            12 modül, oyunlaştırılmış sistem, 6 aksanlı gerçek insan sesi.
            Öğrenmeyi alışkanlığa dönüştür.
          </p>

          {/* İstatistikler */}
          <div className="mt-10 flex flex-col gap-4">
            {STATS.map((s) => (
              <div key={s.etiket} className="flex items-center gap-3">
                <span
                  className="text-2xl font-black"
                  style={{ color: "var(--sun)" }}
                >
                  {s.rakam}
                </span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {s.etiket}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alt logo/telif */}
        <p className="relative z-10 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          © 2025 IELTS Akademi Platform
        </p>
      </aside>

      {/* ─── SAĞ PANEL: Form ─── */}
      <main
        className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16"
        style={{ background: "var(--bg)" }}
      >
        <div className="mx-auto w-full max-w-md">

          {/* Tab seçici */}
          <div
            className="mb-8 flex rounded-2xl p-1"
            style={{ background: "var(--bg-soft)", border: "1px solid var(--border)" }}
          >
            {(["giris", "kayit"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold transition-all"
                style={
                  tab === t
                    ? { background: "var(--coral)", color: "#fff" }
                    : { color: "var(--text-muted)", background: "transparent" }
                }
              >
                {t === "giris" ? "Giriş Yap" : "Kayıt Ol"}
              </button>
            ))}
          </div>

          {/* ─── GİRİŞ FORMU ─── */}
          {tab === "giris" && (
            <div className="animate-slide-up">
              <h2
                className="font-display text-2xl font-bold mb-1"
                style={{ color: "var(--text)" }}
              >
                Hoşgeldin 👋
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Hesabına gir ve kaldığın yerden devam et.
              </p>

              {gHata && (
                <p role="alert" className="mb-4 rounded-xl px-4 py-3 text-sm font-semibold"
                   style={{ background: "rgba(255,90,78,0.1)", color: "var(--coral)" }}>
                  {gHata}
                </p>
              )}

              {/* 👑 SBGOK57 YÖNETİCİ & ÖĞRENCİ HIZLI GİRİŞ KARTI */}
              <div className="mb-5 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      👑 Otomatik Yönetici Girişi
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Sinem Buse Gök (sbgok57)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      sbgok57@ieltsakademi.com
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdminDirectLogin}
                    disabled={gYukleniyor}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-black text-white shadow-md hover:opacity-95 transition"
                  >
                    {gYukleniyor ? "Giriş yapılıyor…" : "1 Tıkla Giriş Yap 🚀"}
                  </button>
                </div>
              </div>

              <form onSubmit={gonder} className="space-y-4">
                <div>
                  <label htmlFor="g-email" className="block text-sm font-semibold mb-1"
                         style={{ color: "var(--text)" }}>
                    E-posta
                  </label>
                  <input
                    id="g-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={gEmail}
                    onChange={(e) => setGEmail(e.target.value)}
                    className={inp}
                    style={inpStyle}
                    placeholder="ornek@eposta.com"
                  />
                </div>
                <div>
                  <label htmlFor="g-pass" className="block text-sm font-semibold mb-1"
                         style={{ color: "var(--text)" }}>
                    Şifre
                  </label>
                  <input
                    id="g-pass"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="current-password"
                    value={gPass}
                    onChange={(e) => setGPass(e.target.value)}
                    className={inp}
                    style={inpStyle}
                    placeholder="En az 8 karakter (veya 220802Sbg)"
                  />
                </div>
                <button
                  type="submit"
                  disabled={gYukleniyor}
                  className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--coral)" }}
                >
                  {gYukleniyor ? "Giriş yapılıyor…" : "Giriş Yap →"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                Hesabın yok mu?{" "}
                <button
                  type="button"
                  onClick={() => setTab("kayit")}
                  className="font-bold underline"
                  style={{ color: "var(--teal)" }}
                >
                  Kayıt ol
                </button>
              </p>

              {/* Hızlı Kurumsal E-Posta & Gmail Rehberi Bağlantıları */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <Link
                  href="/posta"
                  className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs font-bold text-blue-700 hover:bg-blue-100/70 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300 transition"
                >
                  <span className="flex items-center gap-1.5">
                    📬 <span>Kurumsal Webmail Kutusuna Git</span>
                  </span>
                  <span>Aç →</span>
                </Link>

                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-[11px] text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                  <strong className="block font-bold">💡 Gmail&apos;de Doğrudan Girişte &quot;Hesap Bulunamadı&quot; mı diyor?</strong>
                  <span className="mt-1 block text-slate-600 dark:text-slate-300 leading-relaxed">
                    Google kendi dışındaki alan adlarını (@ieltsakademi.com) doğrudan tanımaz. E-posta kutunuz platformumuzun <strong>/posta</strong> adresinde 50 GB kapasiteyle ZATEN aktiftir. Gmail ile bağlama adımlarını da <strong>/posta</strong> sayfasından anında yapabilirsiniz.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ─── KAYIT FORMU ─── */}
          {tab === "kayit" && (
            <div className="animate-slide-up">
              <h2
                className="font-display text-2xl font-bold mb-1"
                style={{ color: "var(--text)" }}
              >
                Hesap oluştur 🚀
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Tamamen ücretsiz. Kredi kartı gerekmez.
              </p>

              {kHata && (
                <p role="alert" className="mb-4 rounded-xl px-4 py-3 text-sm font-semibold"
                   style={{ background: "rgba(255,90,78,0.1)", color: "var(--coral)" }}>
                  {kHata}
                </p>
              )}

              <form onSubmit={kayitGonder} className="space-y-4">
                <div>
                  <label htmlFor="k-ad" className="block text-sm font-semibold mb-1"
                         style={{ color: "var(--text)" }}>
                    Adın <span style={{ color: "var(--text-muted)" }}>(isteğe bağlı)</span>
                  </label>
                  <input
                    id="k-ad"
                    value={kAd}
                    onChange={(e) => setKAd(e.target.value)}
                    className={inp}
                    style={inpStyle}
                    placeholder="Adın"
                  />
                </div>
                <div>
                  <label htmlFor="k-email" className="block text-sm font-semibold mb-1"
                         style={{ color: "var(--text)" }}>
                    E-posta
                  </label>
                  <input
                    id="k-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={kEmail}
                    onChange={(e) => setKEmail(e.target.value)}
                    className={inp}
                    style={inpStyle}
                    placeholder="ornek@eposta.com"
                  />
                </div>
                <div>
                  <label htmlFor="k-pass" className="block text-sm font-semibold mb-1"
                         style={{ color: "var(--text)" }}>
                    Şifre
                  </label>
                  <input
                    id="k-pass"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={kPass}
                    onChange={(e) => setKPass(e.target.value)}
                    className={inp}
                    style={inpStyle}
                    placeholder="En az 8 karakter"
                  />
                </div>
                <button
                  type="submit"
                  disabled={kYukleniyor}
                  className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--teal)" }}
                >
                  {kYukleniyor ? "Hesap oluşturuluyor…" : "Ücretsiz Kayıt Ol →"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                Zaten üye misin?{" "}
                <button
                  type="button"
                  onClick={() => setTab("giris")}
                  className="font-bold underline"
                  style={{ color: "var(--coral)" }}
                >
                  Giriş yap
                </button>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
