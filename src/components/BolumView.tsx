"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  GRAMER_LISTESI,
  OKUMA_VERISI,
  DINLEME_VERISI,
  KELIME_LISTESI,
  KONUSMA_KARTLARI,
  YAZMA_VERISI,
  DENEME_SORULARI,
  ARSIV_DONEMLERI,
  TAKTIKLER,
  ROZETLER,
  MOTIVASYON_SOZLERI,
} from "@/lib/sampleContent";

const MODUL_BILGILERI: Record<string, { ad: string; anim: string; renk: string; sonraki: string; sonrakiAd: string }> = {
  gramer: { ad: "Gramer Akademi", anim: "/anim/ilerleme-halkasi.gif", renk: "from-violet-600 to-indigo-600", sonraki: "okuma", sonrakiAd: "Okuma Laboratuvarı" },
  okuma: { ad: "Okuma Laboratuvarı", anim: "/anim/basari.gif", renk: "from-sky-600 to-blue-600", sonraki: "dinleme", sonrakiAd: "Dinleme Laboratuvarı" },
  dinleme: { ad: "Dinleme Laboratuvarı", anim: "/anim/dinleme-dalgasi.gif", renk: "from-teal-600 to-emerald-600", sonraki: "konusma", sonrakiAd: "Konuşma Laboratuvarı" },
  konusma: { ad: "Konuşma Laboratuvarı", anim: "/anim/lumi-maskot.gif", renk: "from-pink-600 to-rose-600", sonraki: "yazma", sonrakiAd: "Yazma Laboratuvarı" },
  yazma: { ad: "Yazma Laboratuvarı", anim: "/anim/kelime-karti.gif", renk: "from-amber-600 to-orange-600", sonraki: "kelime", sonrakiAd: "Kelime Hazinesi" },
  kelime: { ad: "Kelime Hazinesi", anim: "/anim/kelime-karti.gif", renk: "from-purple-600 to-violet-600", sonraki: "deneme", sonrakiAd: "Deneme Sınavı" },
  deneme: { ad: "Deneme Sınavı", anim: "/anim/sinav-zamanlayici.gif", renk: "from-rose-600 to-red-600", sonraki: "arsiv", sonrakiAd: "1989→2026 Arşiv" },
  arsiv: { ad: "1989→2026 Arşiv", anim: "/anim/yildiz-parlamasi.gif", renk: "from-indigo-600 to-blue-600", sonraki: "bilim", sonrakiAd: "Bilim Kütüphanesi" },
  bilim: { ad: "Bilim Kütüphanesi", anim: "/anim/yildiz-parlamasi.gif", renk: "from-emerald-600 to-green-600", sonraki: "taktik", sonrakiAd: "Taktik Kütüphanesi" },
  taktik: { ad: "Taktik Kütüphanesi", anim: "/anim/basari.gif", renk: "from-orange-600 to-amber-600", sonraki: "rozet", sonrakiAd: "Rozetler" },
  taktikler: { ad: "Taktik Kütüphanesi", anim: "/anim/basari.gif", renk: "from-orange-600 to-amber-600", sonraki: "rozetler", sonrakiAd: "Rozetler" },
  rozet: { ad: "Rozetler", anim: "/anim/rozet-havai-fisek.gif", renk: "from-yellow-500 to-amber-600", sonraki: "soz", sonrakiAd: "Motivasyon" },
  rozetler: { ad: "Rozetler", anim: "/anim/rozet-havai-fisek.gif", renk: "from-yellow-500 to-amber-600", sonraki: "sozler", sonrakiAd: "Motivasyon" },
  soz: { ad: "Motivasyon", anim: "/anim/konfeti.gif", renk: "from-pink-500 to-rose-600", sonraki: "panel", sonrakiAd: "Öğrenci Paneli" },
  sozler: { ad: "Motivasyon", anim: "/anim/konfeti.gif", renk: "from-pink-500 to-rose-600", sonraki: "panel", sonrakiAd: "Öğrenci Paneli" },
};

export default function BolumView({ slug: propSlug }: { slug?: string }) {
  const routeParams = useParams();
  const rawSlug = propSlug ?? (typeof routeParams?.slug === "string" ? routeParams.slug : "okuma");
  const slug = rawSlug.toLowerCase();
  const bilgi = MODUL_BILGILERI[slug] || MODUL_BILGILERI.okuma!;

  // Etkileşim durumları
  const [cevaplar, setCevaplar] = useState<Record<string, string>>({});
  const [sonuclar, setSonuclar] = useState<Record<string, { dogru: boolean; kanit: string }>>({});
  const [kazanilanXp, setKazanilanXp] = useState(0);
  const [yazilanKelimeSayisi, setYazilanKelimeSayisi] = useState(0);
  const [kayitDurumu, setKayitDurumu] = useState<"bosta" | "kaydediliyor" | "tamam">("bosta");

  const soruCevapla = (soruId: string, secilen: string, dogruCevap: string, kanit: string) => {
    setCevaplar((prev) => ({ ...prev, [soruId]: secilen }));
    const dogruMu = secilen.trim().toLowerCase() === dogruCevap.trim().toLowerCase();
    setSonuclar((prev) => ({
      ...prev,
      [soruId]: { dogru: dogruMu, kanit },
    }));
    if (dogruMu && !sonuclar[soruId]?.dogru) {
      setKazanilanXp((x) => x + 10);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Üst Başlık & Animasyon */}
      <section className="flex flex-col-reverse items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              Gerçek İçerik Modülü
            </span>
            {kazanilanXp > 0 && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                +{kazanilanXp} XP Kazandın 🎉
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            {bilgi.ad}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            A1→C2 hedeflerin ve IELTS sınav stratejin için yapılandırılmış çalışma ortamı.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/panel"
              className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              ← Panele Dön
            </Link>
            <Link
              href={bilgi.sonraki === "panel" ? "/panel" : `/bolum/${bilgi.sonraki}`}
              className="inline-flex items-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:bg-violet-700"
            >
              Sonraki Adım: {bilgi.sonrakiAd} →
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={bilgi.anim}
            alt={bilgi.ad}
            className="h-32 w-32 rounded-2xl object-contain drop-shadow md:h-40 md:w-40"
          />
        </div>
      </section>

      {/* 1. OKUMA MODÜLÜ */}
      {slug === "okuma" && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-sky-100 px-2.5 py-0.5 text-xs font-extrabold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                Seviye: {OKUMA_VERISI.seviye}
              </span>
              <span className="text-xs text-slate-500">IELTS Academic Reading • Pasaj 1</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{OKUMA_VERISI.baslik}</h2>
            <div className="mt-4 space-y-3 leading-relaxed text-slate-700 dark:text-slate-300">
              {OKUMA_VERISI.paragraflar.map((p) => (
                <p key={p.no}>
                  <strong className="text-violet-600 dark:text-violet-400">[{p.no}]</strong> {p.metin}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Alıştırma Soruları (TFNG)</h3>
            <p className="mt-1 text-sm text-slate-500">
              Metne göre True / False / Not Given seçeneğini işaretleyip &ldquo;Kontrol Et&rdquo;e basın.
            </p>

            <div className="mt-6 space-y-6">
              {OKUMA_VERISI.sorular.map((s) => {
                const sonuc = sonuclar[`okuma-${s.no}`];
                const secilen = cevaplar[`okuma-${s.no}`];
                return (
                  <div key={s.no} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      {s.no}. {s.soru}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["TRUE", "FALSE", "NOT GIVEN"].map((secenek) => (
                        <button
                          key={secenek}
                          type="button"
                          onClick={() => soruCevapla(`okuma-${s.no}`, secenek, s.cevap, s.kanit)}
                          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                            secilen === secenek
                              ? "bg-violet-600 text-white"
                              : "border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                          }`}
                        >
                          {secenek}
                        </button>
                      ))}
                    </div>

                    {sonuc && (
                      <div
                        className={`mt-3 rounded-xl p-3 text-sm font-medium ${
                          sonuc.dogru
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                        }`}
                      >
                        <p className="font-bold">{sonuc.dogru ? "✅ Doğru! +10 XP" : "❌ Yanlış cevap"}</p>
                        <p className="mt-1 text-xs">{sonuc.kanit}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 2. GRAMER MODÜLÜ */}
      {slug === "gramer" && (
        <section className="space-y-6">
          {GRAMER_LISTESI.map((g, idx) => (
            <div
              key={g.baslik}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-extrabold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  {g.seviye}
                </span>
                <span className="text-xs text-slate-500">9 Bloklu Ders Yapısı • Blok {idx + 1}</span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{g.baslik}</h2>
              <p className="mt-2 text-slate-700 dark:text-slate-300">
                <strong>Kural:</strong> {g.kural}
              </p>
              <div className="mt-3 space-y-1">
                <strong className="text-sm text-slate-600 dark:text-slate-400">Doğru Örnekler:</strong>
                <ul className="list-inside list-disc text-sm text-slate-700 dark:text-slate-300">
                  {g.ornek.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                <strong>⚠️ Klasik Türk Öğrenci Tuzağı:</strong> {g.hatalar[0]}
              </div>
              <div className="mt-2 rounded-xl bg-violet-50 p-3 text-xs text-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
                <strong>🎯 Sınav Kritik Detayı:</strong> {g.kritik}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 3. DİNLEME MODÜLÜ */}
      {slug === "dinleme" && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="rounded-md bg-teal-100 px-2.5 py-0.5 text-xs font-extrabold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              Seviye: {DINLEME_VERISI.seviye}
            </span>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{DINLEME_VERISI.baslik}</h2>
            <p className="mt-2 text-sm text-slate-500">{DINLEME_VERISI.not}</p>

            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <strong className="text-sm text-slate-700 dark:text-slate-300">Görüşme Transkripti:</strong>
              {DINLEME_VERISI.satirlar.map(([konusan, metin], i) => (
                <p key={i} className="text-sm">
                  <span className="font-bold text-teal-600 dark:text-teal-400">{konusan}:</span> {metin}
                </p>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-white">{DINLEME_VERISI.soru.soru}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {DINLEME_VERISI.soru.secenekler.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      soruCevapla("dinleme-1", opt, DINLEME_VERISI.soru.cevap, "Transkript: 'borrowed for up to three weeks'")
                    }
                    className={`rounded-xl border p-3 text-left font-medium transition ${
                      cevaplar["dinleme-1"] === opt
                        ? "border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950/50 dark:text-teal-200"
                        : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {sonuclar["dinleme-1"] && (
                <div
                  className={`mt-4 rounded-xl p-3 text-sm font-semibold ${
                    sonuclar["dinleme-1"].dogru
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                  }`}
                >
                  {sonuclar["dinleme-1"].dogru ? "✅ Doğru! +10 XP" : "❌ Tekrar transkripti incele."}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. KONUŞMA MODÜLÜ */}
      {slug === "konusma" && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Speaking Part 2 Görev Kartı</h2>
            <div className="mt-4 space-y-4">
              {KONUSMA_KARTLARI.map((k, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <h3 className="font-extrabold text-pink-600 dark:text-pink-400">{k.kart}</h3>
                  <ul className="mt-2 list-inside list-disc text-sm text-slate-600 dark:text-slate-300">
                    {k.alt.map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-pink-50 p-6 text-center dark:bg-pink-950/30">
              <p className="font-bold text-pink-950 dark:text-pink-200">
                Mikrofon Kayıt ve Öz-Değerlendirme
              </p>
              <p className="mt-1 text-xs text-pink-800 dark:text-pink-300">
                1 dakika düşünme süresi sonrası 2 dakika kesintisiz konuşmayı kaydet.
              </p>
              <button
                type="button"
                onClick={() => {
                  setKayitDurumu(kayitDurumu === "kaydediliyor" ? "tamam" : "kaydediliyor");
                  if (kayitDurumu !== "tamam") setKazanilanXp((x) => x + 15);
                }}
                className="mt-4 rounded-xl bg-pink-600 px-6 py-2.5 font-bold text-white shadow hover:bg-pink-700"
              >
                {kayitDurumu === "kaydediliyor"
                  ? "⏹️ Kaydı Bitir (Dinle & Değerlendir)"
                  : kayitDurumu === "tamam"
                  ? "🎙️ Kayıt Tamamlandı (+15 XP) • Yeniden Kaydet"
                  : "🎙️ Konuşmayı Kaydetmeye Başla"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. YAZMA MODÜLÜ */}
      {slug === "yazma" && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              {YAZMA_VERISI.tip}
            </span>
            <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{YAZMA_VERISI.baslik}</h2>
            <div className="mt-2 flex flex-wrap gap-1 text-xs text-slate-500">
              <span>Anahtar Terimler:</span>
              {YAZMA_VERISI.anahtarlar.map((t) => (
                <span key={t} className="rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label htmlFor="essay" className="font-bold text-slate-800 dark:text-slate-200">
                  Kompozisyon Taslağın:
                </label>
                <span
                  className={`text-sm font-extrabold ${
                    yazilanKelimeSayisi >= YAZMA_VERISI.minKelime ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {yazilanKelimeSayisi} / {YAZMA_VERISI.minKelime} kelime
                </span>
              </div>
              <textarea
                id="essay"
                rows={10}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                  setYazilanKelimeSayisi(words.length);
                }}
                className="mt-2 w-full rounded-2xl border border-slate-300 p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-950"
                placeholder="Paragraf 1: Giriş ve tez cümlesi (Introduction & Thesis)..."
              />
              <button
                type="button"
                onClick={() => setKazanilanXp((x) => x + 20)}
                className="mt-4 rounded-xl bg-amber-600 px-6 py-2.5 font-bold text-white shadow hover:bg-amber-700"
              >
                Geri Bildirim Al & Taslağı Kaydet (+20 XP)
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 6. KELİME MODÜLÜ */}
      {slug === "kelime" && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KELIME_LISTESI.map((k) => (
            <div
              key={k.kelime}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <strong className="text-lg font-extrabold text-purple-600 dark:text-purple-400">
                  {k.kelime}
                </strong>
                <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  {k.seviye}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                🇹🇷 {k.tr}
              </p>
              <p className="mt-1 text-xs text-slate-500">Eş Anlamlı: {k.es}</p>
              <div className="mt-3 rounded-xl bg-slate-50 p-2 text-xs italic text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                &ldquo;{k.orn}&rdquo;
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 7. DENEME MODÜLÜ */}
      {slug === "deneme" && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Deneme Sınav Modu</h2>
            <p className="mt-1 text-sm text-slate-500">
              Süre kontrollü, tam ölçekli IELTS deneme soruları.
            </p>

            <div className="mt-6 space-y-6">
              {DENEME_SORULARI.map((s) => (
                <div key={s.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                    {s.tip}
                  </span>
                  <p className="mt-2 font-bold text-slate-800 dark:text-slate-100">{s.soru}</p>
                  <div className="mt-3 space-y-2">
                    {s.secenekler.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => soruCevapla(s.id, opt, s.cevap, s.aciklama)}
                        className={`w-full rounded-xl border p-3 text-left text-sm font-medium transition ${
                          cevaplar[s.id] === opt
                            ? "border-red-500 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200"
                            : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {(() => {
                    const res = sonuclar[s.id];
                    if (!res) return null;
                    return (
                      <div
                        className={`mt-3 rounded-xl p-3 text-xs font-semibold ${
                          res.dogru ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {res.dogru ? "✅ Tebrikler!" : "❌ Çözüm:"} {res.kanit}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. ARŞİV MODÜLÜ */}
      {slug === "arsiv" && (
        <section className="space-y-4">
          {ARSIV_DONEMLERI.map((a) => (
            <div
              key={a.donem}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{a.donem} Dönemi</h2>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{a.ozet}</p>
            </div>
          ))}
        </section>
      )}

      {/* 9. BİLİM MODÜLÜ */}
      {slug === "bilim" && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">6 Akademik Alan Kütüphanesi</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Biyoloji, Çevre Bilimi, Psikoloji, Teknoloji, Sosyoloji ve Astronomi alanlarında A1→C2 akademik okuma parçaları ve terim sözlükleri.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Environmental Science (Çevre Bilimi)", "Cognitive Psychology (Bilişsel Psikoloji)", "Robotics & AI (Robotik ve Yapay Zekâ)", "Marine Biology (Deniz Biyolojisi)"].map((d) => (
                <div key={d} className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 font-semibold text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200">
                  📚 {d}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. TAKTİKLER */}
      {(slug === "taktik" || slug === "taktikler") && (
        <section className="space-y-4">
          {TAKTIKLER.map((t) => (
            <div
              key={t.baslik}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-orange-600 dark:text-orange-400">{t.baslik}</h2>
                <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-800 dark:bg-orange-950 dark:text-orange-200">
                  ⏱️ {t.sure}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{t.aciklama}</p>
            </div>
          ))}
        </section>
      )}

      {/* 11. ROZETLER */}
      {(slug === "rozet" || slug === "rozetler") && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROZETLER.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <img src={`/img/${r.ikon}`} alt={r.ad} width={48} height={48} className="rounded-xl" />
              <div>
                <strong className="block text-slate-900 dark:text-white">{r.ad}</strong>
                <span className="text-xs text-slate-500">{r.sart}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 12. SÖZLER */}
      {(slug === "soz" || slug === "sozler") && (
        <section className="space-y-4">
          {MOTIVASYON_SOZLERI.map((m, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-base font-semibold text-slate-900 dark:text-white">&ldquo;{m.tr}&rdquo;</p>
              <p className="mt-1 text-sm italic text-slate-500">— {m.en}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
