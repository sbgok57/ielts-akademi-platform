"use client";

// src/app/sertifika/page.tsx
// Resmi Sertifika Görüntüleme & Herkese Açık Doğrulama Portalı
// "sertifika da renkli olsun ve kesinlikle geçerli olsun"

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
} from "lucide-react";
import CertificateView from "@/components/CertificateView";
import {
  loadStudentProgress,
  findCertificateById,
  StudentCertificate,
} from "@/lib/progress-store";

function SertifikaContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  const [activeCert, setActiveCert] = useState<StudentCertificate | null>(null);
  const [allCerts, setAllCerts] = useState<StudentCertificate[]>([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState<"not_found" | "found" | null>(null);

  useEffect(() => {
    const progress = loadStudentProgress();
    setAllCerts(progress.certificates || []);

    if (queryId) {
      const found = findCertificateById(queryId);
      if (found) {
        setActiveCert(found);
        setSearchResult("found");
      } else {
        setSearchResult("not_found");
      }
    } else if (progress.certificates && progress.certificates.length > 0) {
      setActiveCert(progress.certificates[0]!);
    }
  }, [queryId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const found = findCertificateById(searchCode.trim());
    if (found) {
      setActiveCert(found);
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
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Resmî Başarı Sertifikası Portalı 🏅
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Tüm seviye bitirme sertifikalarınız Cambridge ve CEFR standartlarında doğrulanabilir ve kalıcıdır.
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
              className="rounded-2xl bg-amber-500 px-4 py-2 text-xs font-black text-white hover:bg-amber-600"
            >
              Doğrula
            </button>
          </form>
        </div>

        {/* Doğrulama Durum Bildirimi */}
        {searchResult === "not_found" && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>Girilen doğrulama kodu sistemde bulunamadı. Lütfen belge kodunu kontrol ediniz.</span>
          </div>
        )}

        {/* Çoklu Sertifika Sekmeleri (Öğrencinin bitirdiği diğer seviyeler) */}
        {allCerts.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 dark:border-slate-800 dark:bg-[#101010]">
            <span className="text-xs font-black text-slate-400 px-2">Kazanılan Sertifikalarım:</span>
            {allCerts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveCert(c);
                  setSearchResult(null);
                }}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  activeCert?.id === c.id
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Award className="h-3.5 w-3.5" />
                <span>{c.level} Sertifikası</span>
              </button>
            ))}
          </div>
        )}

        {/* Sertifika Görünümü */}
        {activeCert ? (
          <CertificateView cert={activeCert} />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-[#121212]">
            <Award className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-400">
              Henüz tamamlanan bir sertifika bulunmuyor.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Öğrenci panelinden seviye atlama sınavını tamamlayarak resmi sertifikanızı alabilirsiniz.
            </p>
            <Link
              href="/panel"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 text-xs font-black text-white hover:bg-amber-600"
            >
              <span>Seviye Atlama Sınavına Git</span>
            </Link>
          </div>
        )}
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
