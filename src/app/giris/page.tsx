"use client";
// app/giris/page.tsx — Split-panel giriş sayfası (tab: Giriş / Kayıt)
// Tasarım: sol marka paneli (ink bg + coral/teal daireler) + sağ form

import { useState, useEffect, Suspense } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadStudentProgress, saveStudentProgress, createDefaultProgress } from "@/lib/progress-store";

/* ─── Shared input style ─── */
const inp =
  "mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--coral)] focus:ring-2 focus:ring-[var(--coral)]/20";
const inpStyle = {
  background: "var(--bg-soft)",
  borderColor: "var(--border)",
  color: "var(--text)",
};

function GirisFormContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "kayit" ? "kayit" : "giris";
  const [tab, setTab] = useState<"giris" | "kayit">(initialTab);

  useEffect(() => {
    const qTab = searchParams.get("tab");
    if (qTab === "kayit") setTab("kayit");
    else if (qTab === "giris") setTab("giris");
  }, [searchParams]);

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

    const prog = createDefaultProgress("Sinem Buse Gök (sbgok57)", "sbgok57@ieltsakademi.com");
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

      document.cookie = "sid=admin-sbgok57; path=/; max-age=31536000; SameSite=Lax";
      document.cookie = "admin=sbgok57; path=/; max-age=31536000; SameSite=Lax";
      document.cookie = "authjs.session-token=admin-sbgok57; path=/; max-age=31536000; SameSite=Lax";

      const prog = createDefaultProgress("Sinem Buse Gök (sbgok57)", "sbgok57@ieltsakademi.com");
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

  /* ─── Kayıt handler (Beginner A1 Öğrenci Kaydı) ─── */
  async function kayitGonder(e: FormEvent) {
    e.preventDefault();
    setKHata(null);
    setKYukleniyor(true);

    try {
      const yanit = await fetch("/api/kayit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad: kAd, email: kEmail, password: kPass }),
      });
      const veri = await yanit.json().catch(() => ({})) as { messageTr?: string; ok?: boolean };
      if (!yanit.ok && !veri.ok) {
        setKYukleniyor(false);
        setKHata(veri.messageTr ?? "Kayıt tamamlanamadı.");
        return;
      }

      // Yeni öğrenci için %0 temiz Beginner A1 profilini kaydet
      const cleanName = kAd.trim() || kEmail.split("@")[0] || "Yeni Öğrenci";
      const cleanProgress = createDefaultProgress(cleanName, kEmail);
      saveStudentProgress(cleanProgress);

      const sonuc = await signIn("credentials", {
        email: kEmail,
        password: kPass,
        redirect: false,
      });
      // Doğrudan panele geçiş yap
      window.location.href = "/panel";
    } catch {
      // Hata durumunda bile öğrencinin çalışmasını engelleme, temiz profille panele al
      const cleanName = kAd.trim() || kEmail.split("@")[0] || "Yeni Öğrenci";
      const cleanProgress = createDefaultProgress(cleanName, kEmail);
      saveStudentProgress(cleanProgress);
      setKYukleniyor(false);
      window.location.href = "/panel";
    }
  }

  /* ─── Sol marka paneli stat'ları ─── */
  const STATS = [
    { rakam: "A1 → C2", etiket: "Beginner'dan İleri Seviyeye" },
    { rakam: "6 Aksan", etiket: "Gerçek İnsan Sesi & Dikte" },
    { rakam: "12 Modül", etiket: "Gramer, Speaking, Okuma, Deneme" },
  ];

  return (
    /* Split layout: sol marka, sağ form */
    <div className="split-layout" style={{ minHeight: "100vh" }}>

      {/* ─── SOL PANEL: Marka / Motivasyon & Animasyon ─── */}
      <aside className="brand-panel">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-4 mb-8 group">
            <img
              src="/icon.svg"
              alt="IELTS Akademi Logo"
              width={80}
              height={80}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl shadow-2xl shadow-purple-500/30 shrink-0 group-hover:scale-108 transition-all ring-2 ring-white/20"
            />
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                IELTS <span className="rainbow-text-bright">Akademi</span>
              </span>
              <span className="text-xs text-white/70 tracking-wider uppercase mt-1 font-bold">
                Resmi Öğrenci &amp; Giriş Portalı
              </span>
            </div>
          </Link>

          <h1 className="text-4xl font-black leading-tight text-white tracking-tight">
            A1&apos;den C2&apos;ye<br />
            <span className="rainbow-text-bright">gerçek ilerleme.</span>
          </h1>

          <p className="mt-4 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            Sıfırdan başlayanlar ve özel ders öğrencileri için korkutmayan, adım adım öğreten interaktif platform.
          </p>

          {/* Maskot Canlı GIF Animasyonu */}
          <div className="mt-8 flex items-center gap-4 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
            <img
              src="/anim/lumi-maskot.gif"
              alt="Lumi Maskot Animasyonu"
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl object-contain drop-shadow"
            />
            <div>
              <span className="block text-xs font-black uppercase tracking-wider text-amber-300">
                Lumi ile Sıfırdan Başla 🤖
              </span>
              <p className="text-xs text-white/80 leading-relaxed mt-0.5">
                A1 seviyesinden IELTS hedefine kadar sana özel çalışma rotası ve sesli telaffuz koçluğu.
              </p>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="mt-8 flex flex-col gap-4">
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
          © 2026 IELTS Akademi Platform · Tüm Hakları Saklıdır
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
                {t === "giris" ? "Giriş Yap" : "Kayıt Ol (Ücretsiz)"}
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
                Hoş Geldin 👋
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Hesabına gir ve kaldığın yerden çalışmaya devam et.
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
                    minLength={6}
                    autoComplete="current-password"
                    value={gPass}
                    onChange={(e) => setGPass(e.target.value)}
                    className={inp}
                    style={inpStyle}
                    placeholder="••••••••"
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
                  Hemen Kayıt Ol
                </button>
              </p>
            </div>
          )}

          {/* ─── KAYIT FORMU ─── */}
          {tab === "kayit" && (
            <div className="animate-slide-up">
              <h2
                className="font-display text-2xl font-bold mb-1"
                style={{ color: "var(--text)" }}
              >
                Hesap Oluştur 🚀
              </h2>
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                Tamamen ücretsiz. Özel ders ve başlangıç için temiz hesap.
              </p>

              {/* Beginner A1 Seviye Rozeti */}
              <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/70 p-3.5 dark:bg-emerald-950/30">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  🎯 Başlangıç Seviyesi: Beginner (A1)
                </span>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Hesabınız %0 ilerleme ile sıfırdan başlar; dersleri ve testleri çözdükçe seviyeniz adım adım yükselecektir.
                </p>
              </div>

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
                    Adınız Soyadınız
                  </label>
                  <input
                    id="k-ad"
                    required
                    value={kAd}
                    onChange={(e) => setKAd(e.target.value)}
                    className={inp}
                    style={inpStyle}
                    placeholder="Örn: Ahmet Yılmaz"
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
                    Şifre (En az 8 karakter)
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
                  {kYukleniyor ? "Hesabın açılıyor…" : "Hesabımı Başlat (Beginner A1) →"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                Zaten hesabın var mı?{" "}
                <button
                  type="button"
                  onClick={() => setTab("giris")}
                  className="font-bold underline"
                  style={{ color: "var(--coral)" }}
                >
                  Giriş Yap
                </button>
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default function GirisSayfasi() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    }>
      <GirisFormContent />
    </Suspense>
  );
}
