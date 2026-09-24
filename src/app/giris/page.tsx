"use client";
// app/giris/page.tsx — Split-panel giriş sayfası (tab: Giriş / Kayıt)
// Tasarım: sol marka paneli (ink bg + coral/teal daireler) + sağ form

import { useState } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";


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

  /* ─── Giriş handler ─── */
  async function gonder(e: FormEvent) {
    e.preventDefault();
    setGHata(null);
    setGYukleniyor(true);
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
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <img src="/img/logo.svg" alt="Logo" width={36} height={36} />
            <span className="font-display text-2xl font-bold text-white">
              IELTS <span style={{ color: "var(--sun)" }}>Akademi</span>
            </span>
          </Link>

          <h1 className="font-display text-4xl font-bold leading-tight text-white">
            A1&apos;den C2&apos;ye<br />
            <span style={{ color: "var(--coral)" }}>gerçek ilerleme.</span>
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
                  className="font-display text-2xl font-bold"
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
                    placeholder="En az 8 karakter"
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

              <p className="mt-5 text-center text-sm" style={{ color: "var(--text-muted)" }}>
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
