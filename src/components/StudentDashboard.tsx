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
  Mail,
  Key,
  HelpCircle,
  Check,
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
  setStudentLevel,
  resetStudentJourney,
  CEFRLevel,
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
  const [showGmailGuide, setShowGmailGuide] = useState(false);

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
            {(progress.isAdmin || progress.studentName.toLowerCase().includes("sbgok57")) && (
              <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-black uppercase text-white shadow-sm flex items-center gap-1">
                <span>👑 SİSTEM YÖNETİCİSİ (ADMIN)</span>
              </span>
            )}
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

      {/* 👑 YÖNETİCİ KONTROL PANELİ & ÖĞRENCİ GELİŞİM MERKEZİ (sbgok57 İÇİN ÖZEL) */}
      {(progress.isAdmin || progress.studentName.toLowerCase().includes("sbgok57")) && (
        <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/15 p-6 shadow-xl dark:bg-[#0c0c0c] space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👑</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Yönetici Kontrol Merkezi (Admin Panel) · sbgok57
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Sistem yöneticisi yetkileri devredildi: Platformu yönetebilir, kendi İngilizce seviyenizi belirleyip bir öğrenci gibi sıfırdan ilerleyebilir ve kurumsal e-postanızı yönetebilirsiniz.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const updated = { ...progress, xpTotal: progress.xpTotal + 1000 };
                  saveStudentProgress(updated);
                  setProgress(updated);
                  setImportStatus("Yönetici Bonusu: +1000 XP Hesaba Eklendi! 🎉");
                  setTimeout(() => setImportStatus(null), 3000);
                }}
                className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-black text-white hover:bg-amber-600 shadow-sm"
              >
                ⚡ +1000 XP Ekle
              </button>
              <Link
                href="/sertifika"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-2 text-xs font-black text-white hover:opacity-90 shadow-sm"
              >
                🏅 Sertifika Yönetimi
              </Link>
              <Link
                href="/haberler"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 px-3.5 py-2 text-xs font-black text-white hover:opacity-90 shadow-sm"
              >
                📰 2,000+ Haber Portalı
              </Link>
              <Link
                href="/posta"
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-xs font-black text-white hover:opacity-90 shadow-sm"
              >
                📬 Kurumsal Webmail
              </Link>
            </div>
          </div>

          {/* 🎓 KENDİ İNGİLİZCE GELİŞİMİNİZİ BİR ÖĞRENCİ GİBİ TAKİP ETME ALANI */}
          <div className="rounded-2xl border border-amber-500/30 bg-white/80 p-4 dark:bg-black/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                  <span>🎓 Kendi Öğrenci Gelişim Düzeyinizi Seçin (Öğrenci Gibi İlerleme)</span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Dilediğiniz seviyeyi seçerek platformdaki modülleri bir öğrenci gibi adım adım çalışabilir, testleri çözebilir ve ilerlemenizi yüzde olarak görebilirsiniz.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = resetStudentJourney("A1");
                  setProgress(updated);
                  setImportStatus("Öğrenci yolculuğunuz A1 seviyesinden sıfırlandı! Şimdi dersleri tamamlayarak ilerleyebilirsiniz. 🚀");
                  setTimeout(() => setImportStatus(null), 4000);
                }}
                className="shrink-0 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#141414] dark:text-slate-300"
              >
                🔄 Sıfırdan A1 ile Başla
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(["A1", "A2", "B1", "B2", "C1", "C2"] as CEFRLevel[]).map((lvl) => {
                const isCur = progress.currentCefr === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      const updated = setStudentLevel(lvl);
                      setProgress(updated);
                      setImportStatus(`Öğrenim seviyeniz ${lvl} olarak ayarlandı. Artık ${lvl} modüllerini tamamlayabilirsiniz! 🎯`);
                      setTimeout(() => setImportStatus(null), 3000);
                    }}
                    className={`rounded-xl py-2 px-3 text-xs font-black transition-all ${
                      isCur
                        ? "bg-amber-500 text-white shadow-md scale-105"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{lvl} Seviyesi</span>
                    {isCur && <span className="block text-[9px] font-normal">Aktif Düzey</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 📬 KURUMSAL E-POSTA & GMAIL ENTEGRASYONU */}
          <div className="rounded-2xl border border-blue-500/30 bg-white/80 p-4 dark:bg-black/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-md">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                      Kurumsal E-Posta: sbgok57@ieltsakademi.com
                    </h4>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      ✅ Doğrulanmış & Aktif
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Platform şifrenizle eşleştirildi. Kişisel Gmail hesabınızdan gelen/giden kutusu olarak kullanabilirsiniz.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGmailGuide(!showGmailGuide)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-black text-white hover:bg-blue-700 shadow-sm"
              >
                <span>{showGmailGuide ? "Rehberi Gizle" : "Gmail'e Bağlama Rehberi 📖"}</span>
              </button>
            </div>

            {/* Genişletilebilir Gmail Rehberi */}
            {showGmailGuide && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 text-xs text-slate-700 dark:text-slate-300 animate-fadeIn">
                <p className="font-bold text-slate-900 dark:text-white">
                  📌 <code>sbgok57@ieltsakademi.com</code> Adresini Gmail Üzerinden Kullanma Adımları:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-[#121212]">
                    <span className="font-black text-blue-600">1. Adım:</span>
                    <p className="mt-1">Kendi kişisel Gmail hesabınızı açın. Sağ üstteki <strong>Ayarlar (Çark İkonu) &gt; Tüm Ayarları Görüntüleyin</strong> bölümüne gidin.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-[#121212]">
                    <span className="font-black text-blue-600">2. Adım:</span>
                    <p className="mt-1"><strong>&quot;Hesaplar ve İçe Aktarma İşlemi&quot;</strong> sekmesinde <em>&quot;Postaları şu adresten gönder&quot;</em> ve <em>&quot;Diğer hesaplardaki postaları kontrol et&quot;</em> seçeneğine <code>sbgok57@ieltsakademi.com</code> ekleyin.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-[#121212]">
                    <span className="font-black text-blue-600">3. Adım:</span>
                    <p className="mt-1">Şifre olarak belirlediğiniz admin şifrenizi girin. Artık hem gelen mailler doğrudan Gmail kutunuza düşer hem de Gmail üzerinden bu adresle resmi mail atabilirsiniz!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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

      {/* ─── 2,000+ GÜNDEM İNGİLİZCE HABERLER ÖNE ÇIKAN KART ─── */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-500/5 via-teal-500/5 to-purple-500/5 p-6 dark:border-slate-800 dark:bg-[#0c0c0c] sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Headphones className="h-3.5 w-3.5" />
              2,000+ Gündem İngilizce Haber & Sesli Dinleme
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Gündem İngilizce Haber Portalı 🌍
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Teknoloji, bilim, çevre ve ekonomi alanındaki haberleri kadın veya erkek spiker sesiyle dinleyin, telefon kilitlense bile dinlemeye devam edin.
            </p>
          </div>
          <Link
            href="/haberler"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-600 px-5 py-3 text-xs font-black text-white shadow-md hover:opacity-95"
          >
            <span>Haberleri Dinle & Oku</span>
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
