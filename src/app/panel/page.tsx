// app/panel/page.tsx — KORUNAN öğrenci dashboard'u
// Tasarım: coral/teal/sun/indigo palet + Fraunces başlıklar + skill kartları
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ModuleGrid from "@/components/ModuleGrid";

export const dynamic = "force-dynamic";

/* ─── Beceri kartı veri tipi ─── */
interface BeceriKarti {
  slug: string;
  ad: string;
  icon: string;
  renk: string;    /* CSS color token */
  yuzde: number;
}

export default async function Panel() {
  const oturum = await auth();
  if (!oturum?.user) redirect("/giris?donus=/panel");

  const kullanici = await prisma.user.findUnique({
    where: { id: oturum.user.id },
    select: {
      name: true,
      email: true,
      cefrLevel: true,
      targetBand: true,
      streakDays: true,
      xpTotal: true,
    },
  });

  const ad = kullanici?.name ?? kullanici?.email ?? "Öğrenci";
  const xp = kullanici?.xpTotal ?? 0;
  const seri = kullanici?.streakDays ?? 0;
  const cefr = kullanici?.cefrLevel ?? "A1";
  const band = kullanici?.targetBand ?? "6.0";

  /* XP'ye göre basit seviye hesabı (her 500 XP = 1 seviye) */
  const seviye = Math.floor(xp / 500) + 1;
  const seviyeYuzde = ((xp % 500) / 500) * 100;

  /* Beceri kartları — production'da DB'den gelir, şimdilik statik demo */
  const beceriler: BeceriKarti[] = [
    { slug: "okuma",   ad: "Okuma",   icon: "📖", renk: "var(--teal)",   yuzde: 72 },
    { slug: "dinleme", ad: "Dinleme", icon: "🎧", renk: "var(--coral)",  yuzde: 58 },
    { slug: "yazma",   ad: "Yazma",   icon: "✍️", renk: "var(--indigo)", yuzde: 45 },
    { slug: "konusma", ad: "Konuşma", icon: "🎤", renk: "var(--sun)",    yuzde: 61 },
  ];

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="mx-auto max-w-5xl">

        {/* ─── KARŞILAMA BAŞLIĞI ─── */}
        <header className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className="font-display text-3xl font-bold"
              style={{ color: "var(--text)" }}
            >
              Merhaba, {ad} 👋
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Seviye {seviye} · {cefr} · Hedef Band {band}
            </p>
          </div>
          <form action="/cikis" method="post">
            <button
              className="rounded-2xl border px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              Çıkış yap
            </button>
          </form>
        </header>

        {/* ─── ÖZET SAYAÇLAR ─── */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { etiket: "XP Puanı",       deger: xp.toLocaleString("tr"),     renk: "var(--sun)",    ikon: "⚡" },
            { etiket: "Günlük Seri",    deger: `${seri} gün`,               renk: "var(--coral)",  ikon: "🔥" },
            { etiket: "CEFR Seviyesi",  deger: cefr,                        renk: "var(--teal)",   ikon: "🎯" },
            { etiket: "Hedef Band",     deger: band,                         renk: "var(--indigo)", ikon: "🏆" },
          ].map((k) => (
            <div
              key={k.etiket}
              className="rounded-3xl border p-4"
              style={{
                background: "var(--bg-soft)",
                borderColor: "var(--border)",
              }}
            >
              <p className="text-2xl">{k.ikon}</p>
              <p
                className="font-display text-xl font-bold mt-1"
                style={{ color: k.renk }}
              >
                {k.deger}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {k.etiket}
              </p>
            </div>
          ))}
        </div>

        {/* ─── XP İLERLEME ÇUBUĞU ─── */}
        <div
          className="mb-8 rounded-3xl border p-5"
          style={{ background: "var(--bg-soft)", borderColor: "var(--border)" }}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Seviye {seviye} → {seviye + 1}
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {xp % 500} / 500 XP
            </p>
          </div>
          {/* PERF: width set via inline style; Tailwind arbitrary value would require purge-safe class */}
          <div
            className="h-3 overflow-hidden rounded-full"
            style={{ background: "var(--border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${seviyeYuzde.toFixed(1)}%`,
                background: "linear-gradient(90deg, var(--coral), var(--teal))",
              }}
            />
          </div>
          {/* Animasyon görüntüsü */}
          <img
            src="/anim/ilerleme-halkasi.gif"
            alt="İlerleme animasyonu"
            width={64}
            height={64}
            className="mt-4 rounded-xl"
            loading="lazy"
          />
        </div>

        {/* ─── BECERİ KARTLARI ─── */}
        <section className="mb-8">
          <h2
            className="font-display text-xl font-bold mb-4"
            style={{ color: "var(--text)" }}
          >
            Beceri İlerlemen
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {beceriler.map((b) => (
              <Link
                key={b.slug}
                href={`/bolum/${b.slug}`}
                className="group rounded-3xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background: "var(--bg-soft)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{b.icon}</span>
                    <span
                      className="font-display font-bold"
                      style={{ color: "var(--text)" }}
                    >
                      {b.ad}
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: b.renk }}
                  >
                    %{b.yuzde}
                  </span>
                </div>
                {/* Skill progress bar */}
                <div
                  className="h-2 overflow-hidden rounded-full"
                  style={{ background: "var(--border)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${b.yuzde}%`,
                      background: b.renk,
                    }}
                  />
                </div>
                <p className="mt-2 text-xs group-hover:text-[var(--coral)] transition-colors"
                   style={{ color: "var(--text-muted)" }}>
                  Devam et →
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── TÜM BÖLÜMLER ─── */}
        <section className="mb-8">
          <h2
            className="font-display text-xl font-bold mb-4"
            style={{ color: "var(--text)" }}
          >
            Tüm Bölümler
          </h2>
          <ModuleGrid />
        </section>

        {/* ─── ALT LİNKLER ─── */}
        <footer className="flex flex-wrap gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/varliklar" className="underline hover:text-[var(--teal)]">
            Varlık Durumu (GIF/SVG)
          </Link>
          <Link href="/rozetler" className="underline hover:text-[var(--sun)]">
            Rozetlerim
          </Link>
          <Link href="/sozler" className="underline hover:text-[var(--coral)]">
            Motivasyon Sözleri
          </Link>
        </footer>
      </div>
    </div>
  );
}
