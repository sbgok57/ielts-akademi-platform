"use client";

// src/components/StudentDashboard.tsx
// Kalıcı Öğrenci İlerleme Dashboard'u, Yüzdelikler, Seviye Atlama ve Sertifikalar

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Sparkles,
  Flame,
  Zap,
  Target,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  CheckCircle2,
  ArrowRight,
  Download,
  Upload,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  loadStudentProgress,
  saveStudentProgress,
  exportProgressAsJson,
  importProgressFromJson,
  StudentProgress,
  StudentCertificate,
  CEFR_METADATA,
  getLevelFromNumber,
} from "@/lib/progress-store";
import LevelUpModal from "@/components/LevelUpModal";
import ModuleGrid from "@/components/ModuleGrid";

interface Props {
  initialName?: string;
  initialEmail?: string;
}

export default function StudentDashboard({ initialName, initialEmail }: Props) {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Kalıcı progress'i yükle ve oturumdaki isimle senkronize et
  useEffect(() => {
    const data = loadStudentProgress();
    if (initialName && initialName !== "Öğrenci" && (!data.studentName || data.studentName === "Öğrenci")) {
      data.studentName = initialName;
      if (initialEmail) data.email = initialEmail;
      saveStudentProgress(data);
    }
    setProgress(data);

    const onUpdate = (e: any) => {
      if (e.detail) setProgress(e.detail);
    };
    window.addEventListener("student_progress_updated", onUpdate);
    return () => window.removeEventListener("student_progress_updated", onUpdate);
  }, [initialName, initialEmail]);

  if (!progress) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  const currentMeta = CEFR_METADATA[progress.currentCefr];
  const nextLevelNum = Math.min(6, progress.currentLevelNumber + 1);
  const nextCefr = getLevelFromNumber(nextLevelNum);
  const nextMeta = CEFR_METADATA[nextCefr];

  // Dosyadan JSON yedeği yükleme
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && importProgressFromJson(text)) {
        setProgress(loadStudentProgress());
        setImportStatus("İlerlemeniz başarıyla geri yüklendi! ✅");
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        setImportStatus("Geçersiz yedek dosyası ❌");
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handleLevelUpSuccess = (newCert: StudentCertificate) => {
    setProgress(loadStudentProgress());
  };

  return (
    <div className="space-y-8">
      {/* ─── HOŞ GELDİN & HIZLI EYLEMLER ─── */}
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-black/95 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Kalıcı Öğrenci Hesabı Aktif
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Merhaba, {progress.studentName} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Mevcut Düzey: <strong className="text-slate-800 dark:text-slate-200">{progress.currentCefr} ({currentMeta.name})</strong> · Hedef: IELTS Band {progress.targetBand}
          </p>
        </div>

        {/* Veri Yedekleme ve Çıkış */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportProgressAsJson}
            title="İlerlemenizi JSON dosyası olarak kaydedin"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300"
          >
            <Download className="h-3.5 w-3.5 text-blue-500" />
            <span>İlerlemeyi Yedekle</span>
          </button>

          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300">
            <Upload className="h-3.5 w-3.5 text-emerald-500" />
            <span>Yedek Yükle</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <form action="/cikis" method="post">
            <button
              type="submit"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-rose-500 hover:text-rose-600 dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300"
            >
              Çıkış
            </button>
          </form>
        </div>
      </header>

      {importStatus && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 animate-fadeIn">
          {importStatus}
        </div>
      )}

      {/* ─── DİNAMİK 5'Lİ METRİK KARTLARI ─── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { etiket: "Toplam XP", deger: progress.xpTotal.toLocaleString("tr"), ikon: "⚡", renk: "text-amber-500", border: "border-amber-500/20" },
          { etiket: "Günlük Seri", deger: `${progress.streakDays} Gün`, ikon: "🔥", renk: "text-rose-500", border: "border-rose-500/20" },
          { etiket: "CEFR Seviyesi", deger: progress.currentCefr, ikon: "🎯", renk: "text-emerald-500", border: "border-emerald-500/20" },
          { etiket: "Genel İlerleme", deger: `%${progress.overallPercentage}`, ikon: "📈", renk: "text-blue-500", border: "border-blue-500/20" },
          { etiket: "Sertifikalar", deger: `${progress.certificates.length} Adet`, ikon: "🏅", renk: "text-purple-500", border: "border-purple-500/20" },
        ].map((m) => (
          <div
            key={m.etiket}
            className={`rounded-3xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0a0a0a] ${m.border}`}
          >
            <p className="text-2xl">{m.ikon}</p>
            <p className={`mt-1 text-xl font-black ${m.renk}`}>{m.deger}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{m.etiket}</p>
          </div>
        ))}
      </div>

      {/* ─── SEVİYE ATLAMA BANNER'I (HER SEVİYEDE BİR BİTİRME SERTİFİKASI) ─── */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 p-6 shadow-md dark:bg-black sm:p-8">
        <div className="rainbow-gradient-h absolute top-0 inset-x-0 h-1.5" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-3.5 py-1 text-xs font-black uppercase text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Seviye Atlama & Sertifika Fırsatı
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {progress.currentCefr} Seviyesini Bitir → {nextCefr} Seviyesine Yüksel 🎓
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Sınavı başarıyla geçtiğinde adınıza özel, kriptografik doğrulamalı, renkli ve geçerli <strong>CEFR {progress.currentCefr} Bitirme Sertifikası</strong> anında verilecektir.
            </p>

            {/* Seviye İlerleme Çubuğu */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>{progress.currentCefr} Seviye Tamamlanma Oranı</span>
                <span className="text-amber-600 dark:text-amber-400">%{progress.levelProgressPercentage}</span>
              </div>
              <div className="h-3.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 transition-all duration-700"
                  style={{ width: `${progress.levelProgressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Seviye Atlama Eylem Butonu */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setLevelUpModalOpen(true)}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Award className="h-5 w-5" />
              <span>Seviye Atlama Sınavını Başlat</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
              Cambridge & CEFR Standartlarında Resmi Sertifika
            </p>
          </div>
        </div>
      </div>

      {/* ─── AI SPEAKING PRATİĞİ ÖNE ÇIKAN KART ─── */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-pink-500/5 via-violet-500/5 to-teal-500/5 p-6 dark:border-slate-800 dark:bg-[#0c0c0c] sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
              <Mic className="h-3.5 w-3.5" />
              Yapay Zekâ ile İngilizce Speaking Pratiği
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Lumi Speaking Stüdyosu 🎙️
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Mikrofonla konuşun veya klavyeyle yazın. Anlamadığınız her cümlenin üzerine tıklayarak Türkçe çevirisini anında öğrenin.
            </p>
          </div>
          <Link
            href="/konusma"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 px-5 py-3 text-xs font-black text-white shadow-md hover:opacity-95"
          >
            <span>Speaking Pratiğine Başla</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ─── BECERİ İLERLEMESİ YÜZDELİKLERİ (Öğrencinin İlerlemesi) ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Beceri İlerleme Yüzdelerin (% Oranlar)
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Genel Ortalama: <strong className="text-emerald-600">%{progress.overallPercentage}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { ad: "Okuma (Reading)", slug: "okuma", icon: "📖", yuzde: progress.skills.okuma, renk: "from-teal-500 to-emerald-500", textRenk: "text-teal-600" },
            { ad: "Dinleme (Listening)", slug: "dinleme", icon: "🎧", yuzde: progress.skills.dinleme, renk: "from-blue-500 to-cyan-500", textRenk: "text-blue-600" },
            { ad: "Konuşma (Speaking)", slug: "konusma", icon: "🎤", yuzde: progress.skills.konusma, renk: "from-pink-500 to-rose-500", textRenk: "text-pink-600" },
            { ad: "Yazma (Writing)", slug: "yazma", icon: "✍️", yuzde: progress.skills.yazma, renk: "from-indigo-500 to-violet-500", textRenk: "text-indigo-600" },
            { ad: "Gramer Akademi", slug: "gramer", icon: "📐", yuzde: progress.skills.gramer, renk: "from-purple-500 to-pink-500", textRenk: "text-purple-600" },
            { ad: "Kelime Hazinesi", slug: "kelime", icon: "📚", yuzde: progress.skills.kelime, renk: "from-amber-500 to-orange-500", textRenk: "text-amber-600" },
          ].map((b) => (
            <Link
              key={b.slug}
              href={`/bolum/${b.slug}`}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#0e0e0e]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{b.icon}</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{b.ad}</span>
                </div>
                <span className={`text-sm font-black ${b.textRenk}`}>%{b.yuzde}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${b.renk} transition-all duration-700`}
                  style={{ width: `${b.yuzde}%` }}
                />
              </div>
              <p className="mt-2.5 text-[11px] font-bold text-slate-400 group-hover:text-amber-500 transition-colors">
                Pratik Yap & XP Kazan →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── KAZANILAN RESMİ SERTİFİKALAR (Renkli & Kesinlikle Geçerli) ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Resmî Başarı Sertifikalarım 🏅
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tüm seviyeler için oluşturulan ve kamuya açık doğrulanabilir belgeleriniz.
            </p>
          </div>
          <Link
            href="/sertifika"
            className="text-xs font-bold text-amber-600 hover:underline dark:text-amber-400"
          >
            Tüm Sertifikaları Gör & Doğrula →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {progress.certificates.map((cert) => (
            <div
              key={cert.id}
              className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-white p-5 shadow-md dark:bg-[#101010]"
            >
              <div className="rainbow-gradient-h -mx-5 -mt-5 mb-4 h-1.5" />

              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    CEFR {cert.level} Diploması
                  </span>
                  <h3 className="mt-2 text-base font-black text-slate-900 dark:text-white">
                    {cert.levelTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {cert.ieltsBandEquivalent} · Başarı Derecesi: {cert.grade}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                  <Award className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
                <span className="font-mono">Kod: {cert.verificationCode}</span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Resmî Geçerli
                </span>
              </div>

              <div className="mt-3">
                <Link
                  href={`/sertifika?id=${cert.id}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-700 transition hover:bg-amber-500 hover:text-white dark:bg-[#1a1a1a] dark:text-slate-200"
                >
                  <span>Renkli Sertifikayı Görüntüle & Yazdır</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TÜM BÖLÜMLER MODÜL IZGARASI ─── */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Tüm Akademi Eğitim Modülleri
        </h2>
        <ModuleGrid />
      </section>

      {/* Seviye Atlama Modali */}
      <LevelUpModal
        isOpen={levelUpModalOpen}
        onClose={() => setLevelUpModalOpen(false)}
        currentCefr={progress.currentCefr}
        currentLevelNumber={progress.currentLevelNumber}
        xpTotal={progress.xpTotal}
        studentName={progress.studentName}
        onLevelUpSuccess={handleLevelUpSuccess}
      />
    </div>
  );
}
