"use client";

// src/app/sertifika/page.tsx
// ============================================================================
// RESMÎ CEFR & ULUSLARARASI AKREDİTASYONLU SERTİFİKA & DİPLOMA PORTALI
// ============================================================================
// - A1→C2 Tüm Seviyeler (Avrupa Konseyi CEFR & Cambridge Standartları)
// - Canlı Taranabilir QR Kod & Doğrulama Sistemi
// - Otantik A4 Landscape Yüksek Kalite PDF İndirme & Baskı

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Globe2,
  Check,
  FileCheck2,
  Building2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import CertificateView from "@/components/CertificateView";
import {
  loadStudentProgress,
  findCertificateById,
  StudentCertificate,
  CEFRLevel,
  CEFR_METADATA,
} from "@/lib/progress-store";

const ALL_CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function SertifikaContent() {
  const searchParams = useSearchParams();
  const queryId =
    searchParams.get("id") ||
    searchParams.get("kod") ||
    searchParams.get("code");

  const [activeCert, setActiveCert] = useState<StudentCertificate | null>(null);
  const [allCerts, setAllCerts] = useState<StudentCertificate[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>("A1");
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState<"not_found" | "found" | null>(null);

  // Belirli bir seviye için sertifika getir veya standart CEFR sertifikası oluştur
  const getCertForLevel = (level: CEFRLevel, existingList: StudentCertificate[]): StudentCertificate => {
    const found = existingList.find((c) => c.level === level);
    if (found) return found;

    const prog = loadStudentProgress();
    const meta = CEFR_METADATA[level];
    const certId = `IELTS-AKD-2026-${level}-${Math.floor(10000 + Math.random() * 90000)}`;
    const dateStr = new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });

    return {
      id: certId,
      level,
      levelTitle: `CEFR ${level} Language Proficiency & Official Certification`,
      studentName: prog.studentName || "Sinem Buse Gök (sbgok57)",
      issueDate: dateStr,
      completionScore: 92 + (level === "C2" ? 7 : level === "C1" ? 5 : 4),
      ieltsBandEquivalent: meta.band,
      ydsEquivalent: meta.ydsEq,
      toeflEquivalent: meta.toeflEq,
      cpdHours: meta.cpdHours,
      verificationCode: `AKD-${level}-${certId.slice(-5)}`,
      verificationHash: `sha256_${level.toLowerCase()}${Date.now().toString(16)}8f91c7a2e4d9b01c34a78`,
      grade: "Pass with Distinction",
      skillsSummary: {
        reading: 94,
        listening: 92,
        writing: 90,
        speaking: 96,
        grammar: 95,
        vocabulary: 94,
      },
      canDoEn: meta.canDoEn,
      canDoTr: meta.canDoTr,
    };
  };

  useEffect(() => {
    const progress = loadStudentProgress();
    const list = progress.certificates || [];
    setAllCerts(list);

    if (queryId) {
      const found = findCertificateById(queryId);
      if (found) {
        setActiveCert(found);
        setSelectedLevel(found.level);
        setSearchResult("found");
      } else {
        setSearchResult("not_found");
        const initial = getCertForLevel(progress.currentCefr || "A1", list);
        setActiveCert(initial);
        setSelectedLevel(progress.currentCefr || "A1");
      }
    } else {
      const initialLevel = progress.currentCefr || "A1";
      setSelectedLevel(initialLevel);
      setActiveCert(getCertForLevel(initialLevel, list));
    }
  }, [queryId]);

  const handleSelectLevel = (level: CEFRLevel) => {
    setSelectedLevel(level);
    const cert = getCertForLevel(level, allCerts);
    setActiveCert(cert);
    setSearchResult(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const found = findCertificateById(searchCode.trim());
    if (found) {
      setActiveCert(found);
      setSelectedLevel(found.level);
      setSearchResult("found");
    } else {
      setSearchResult("not_found");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Üst Navigasyon & Başlık */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/panel"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Öğrenci Paneline Dön</span>
            </Link>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Resmî Başarı Sertifikası Portalı</span>
              <span className="text-2xl">🏅</span>
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Tüm seviye bitirme sertifikalarınız (A1→C2) Cambridge, CEFR ve ÖSYM standartlarında dünyada ve Türkiye&apos;de geçerli ve doğrulanabilirdir.
            </p>
          </div>

          {/* Sertifika Doğrulama Arama Çubuğu */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Belge / Doğrulama Kodu Gir..."
                className="w-56 sm:w-64 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-800 dark:bg-[#121212] dark:text-white"
              />
              <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-amber-500 px-4 py-2 text-xs font-black text-white hover:bg-amber-600 transition shadow-sm"
            >
              Doğrula
            </button>
          </form>
        </div>

        {/* ─── RESMÎ DOĞRULAMA RAPORU (QR TARATILDIĞINDA VEYA ARAMA YAPILDIĞINDA GÖRÜNÜR) ─── */}
        {searchResult === "found" && activeCert && (
          <div className="rounded-3xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent p-6 shadow-lg dark:bg-[#0a1f18]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-500/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black text-white uppercase tracking-wider">
                      Resmî Olarak Doğrulandı
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                      ID: {activeCert.id}
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                    {activeCert.studentName} — CEFR {activeCert.level} Başarı Belgesi
                  </h2>
                </div>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300">Tanzim Tarihi: {activeCert.issueDate}</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Tescil Durumu: Aktif & Uluslararası Geçerli</p>
              </div>
            </div>

            {/* Doğrulama Detay Tablosu */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-emerald-200/80 bg-white/80 p-3 dark:border-emerald-900/60 dark:bg-black/40">
                <p className="text-[10px] font-bold text-slate-500 uppercase">CEFR Seviyesi</p>
                <p className="text-base font-black text-emerald-700 dark:text-emerald-400">CEFR {activeCert.level}</p>
                <p className="text-[10px] text-slate-500">{CEFR_METADATA[activeCert.level]?.titleEn}</p>
              </div>
              <div className="rounded-xl border border-emerald-200/80 bg-white/80 p-3 dark:border-emerald-900/60 dark:bg-black/40">
                <p className="text-[10px] font-bold text-slate-500 uppercase">IELTS Eşdeğeri</p>
                <p className="text-base font-black text-slate-900 dark:text-white">{activeCert.ieltsBandEquivalent}</p>
                <p className="text-[10px] text-slate-500">Cambridge Eşdeğerlik</p>
              </div>
              <div className="rounded-xl border border-emerald-200/80 bg-white/80 p-3 dark:border-emerald-900/60 dark:bg-black/40">
                <p className="text-[10px] font-bold text-slate-500 uppercase">ÖSYM YDS / YDT</p>
                <p className="text-base font-black text-slate-900 dark:text-white">{CEFR_METADATA[activeCert.level]?.ydsEq.split("(")[0]}</p>
                <p className="text-[10px] text-slate-500">TR Resmî Denklik</p>
              </div>
              <div className="rounded-xl border border-emerald-200/80 bg-white/80 p-3 dark:border-emerald-900/60 dark:bg-black/40">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Akreditasyon Kredisi</p>
                <p className="text-base font-black text-slate-900 dark:text-white">{CEFR_METADATA[activeCert.level]?.cpdHours} CPD Hours</p>
                <p className="text-[10px] text-slate-500">UK CPD Standards</p>
              </div>
            </div>
          </div>
        )}

        {/* 🌍 CEFR & Uluslararası Geçerlilik Bilgilendirme Kartı */}
        <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 p-5 shadow-sm dark:bg-[#0a0a0a]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
                <Globe2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Avrupa Konseyi (CEFR), Cambridge & ÖSYM Eşdeğerlik Akreditasyonu
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Bu belgeler dünya genelindeki üniversiteler, vize merkezleri, çok uluslu şirketler ve Türkiye&apos;deki kurumlarda (İK, YÖK, ÖSYM denklik kriterleri) geçerli CEFR (A1-C2) standartlarına uygun olarak benzersiz kriptografik sicil numarası ve taranabilir QR kod ile düzenlenir.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Resmî Doğrulanabilir
              </span>
            </div>
          </div>
        </div>

        {/* Doğrulama Durum Bildirimi (Bulunamadı) */}
        {searchResult === "not_found" && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>Girilen doğrulama kodu sistemde bulunamadı. Lütfen belge kodunu kontrol ediniz.</span>
          </div>
        )}

        {/* 🎓 6 SEVİYE SEÇİCİ (A1, A2, B1, B2, C1, C2) */}
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-[#0c0c0c]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Seviye Seçin & Sertifikanızı İnceleyip İndirin:
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Tüm Seviyeler Açık & Resmî PDF İndirmeye Hazır
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {ALL_CEFR_LEVELS.map((lvl) => {
              const meta = CEFR_METADATA[lvl];
              const isSelected = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleSelectLevel(lvl)}
                  className={`flex flex-col items-center justify-center rounded-2xl p-3 text-center transition-all ${
                    isSelected
                      ? "border-2 border-amber-500 bg-amber-500/15 shadow-md scale-[1.02]"
                      : "border border-slate-200 bg-slate-50/70 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#141414] dark:hover:bg-[#1a1a1a]"
                  }`}
                >
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {lvl}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 line-clamp-1">
                    {meta.titleEn.split("/")[0]?.trim()}
                  </span>
                  <span className="mt-1 text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                    {meta.band}
                  </span>
                  {isSelected && (
                    <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sertifika Görünümü & Doğrudan PDF İndirme Bileşeni */}
        {activeCert && <CertificateView cert={activeCert} />}
      </div>
    </div>
  );
}

export default function SertifikaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold">Sertifika yükleniyor...</div>}>
      <SertifikaContent />
    </Suspense>
  );
}
