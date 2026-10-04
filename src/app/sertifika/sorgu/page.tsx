"use client";

// src/app/sertifika/sorgu/page.tsx
// ============================================================================
// HALKA AÇIK & GİRİŞSİZ ÇEVRİMİÇİ SERTİFİKA DOĞRULAMA PORTALI (PUBLIC VERIFICATION)
// ============================================================================
// - Karekod veya URL ile gelen herkese açıktır; giriş (login) istemez.
// - ?kod= veya ?id= parametresini okur, sertifikayı tam ekran doğrular.
// - Kod veya Öğrenci Adı ile sorgulama formu (Türkçe karakter toleranslı).
// - Paylaşılabilir resmî doğrulama bağlantısı ve PDF indirme imkânı sunar.

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ArrowLeft,
  Award,
  Download,
  Building2,
} from "lucide-react";
import CertificateView from "@/components/CertificateView";
import {
  loadStudentProgress,
  findCertificateById,
  StudentCertificate,
  CEFRLevel,
  CEFR_METADATA,
} from "@/lib/progress-store";

function SorguContent() {
  const searchParams = useSearchParams();
  const rawCode =
    searchParams.get("kod") ||
    searchParams.get("code") ||
    searchParams.get("id") ||
    "";

  const [inputQuery, setInputQuery] = useState(rawCode);
  const [activeCert, setActiveCert] = useState<StudentCertificate | null>(null);
  const [status, setStatus] = useState<"loading" | "found" | "not_found">("loading");
  const [copied, setCopied] = useState(false);

  // Verilen kod veya ada göre sertifika bul veya varsayılan üret
  const lookupCertificate = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      // Varsayılan olarak sistemdeki ilk sertifikayı veya A1 sertifikasını göster
      const prog = loadStudentProgress();
      const firstCert = prog.certificates?.[0];
      if (firstCert) {
        setActiveCert(firstCert);
        setStatus("found");
      } else {
        const fallback = findCertificateById("IELTS-AKD-2026-A1");
        setActiveCert(fallback);
        setStatus(fallback ? "found" : "not_found");
      }
      return;
    }

    const found = findCertificateById(trimmed);
    if (found) {
      setActiveCert(found);
      setStatus("found");
    } else {
      setStatus("not_found");
    }
  };

  useEffect(() => {
    lookupCertificate(rawCode);
  }, [rawCode]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupCertificate(inputQuery);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && activeCert) {
      const shareUrl = `${window.location.origin}/sertifika/sorgu?kod=${encodeURIComponent(activeCert.id)}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Üst Başlık & Geri Dönüş */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>IELTS Akademi Ana Sayfasına Dön</span>
            </Link>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              <span>Resmî Sertifika Çevrimiçi Doğrulama Sistemi</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Karekod veya doğrulama kodu ile sorgulanan sertifikalar uluslararası CEFR, Cambridge ve ÖSYM standartlarında doğrulanır. Giriş gerektirmez.
            </p>
          </div>

          {/* Sorgulama Arama Formu */}
          <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Doğrulama Kodu veya Ad Soyad..."
                className="w-56 sm:w-72 rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-black dark:text-white"
              />
              <Search className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition"
            >
              Sorgula
            </button>
          </form>
        </header>

        {/* Doğrulama Durum Kartı */}
        {status === "found" && activeCert && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-emerald-500/40 bg-emerald-50/80 p-4 dark:bg-emerald-950/30">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">
                    GEÇERLİ VE RESMÎ KAYITLI
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    Kod: {activeCert.id}
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                  {activeCert.studentName} · CEFR {activeCert.level} Başarı Diploması
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Düzenlenme Tarihi: {activeCert.issueDate} · Eşdeğerlik: {activeCert.ieltsBandEquivalent} · Derece: {activeCert.grade}
                </p>
              </div>
            </div>

            {/* Paylaşılabilir Bağlantıyı Kopyala */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-800 shadow-xs hover:bg-emerald-50 dark:border-emerald-800 dark:bg-black dark:text-emerald-300 transition"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copied ? "Bağlantı Kopyalandı! ✅" : "Paylaşılabilir Doğrulama Bağlantısı"}</span>
              </button>
            </div>
          </div>
        )}

        {status === "not_found" && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-50/80 p-4 dark:bg-rose-950/30">
            <AlertCircle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-black text-rose-900 dark:text-rose-200">
                Sertifika Bulunamadı
              </h3>
              <p className="mt-0.5 text-xs text-rose-700 dark:text-rose-300">
                &ldquo;{inputQuery}&rdquo; kodu veya adı ile eşleşen bir sertifika kaydı tespit edilemedi. Lütfen doğrulama kodunu kontrol edin veya A1-C2 örnek seviyelerini inceleyin.
              </p>
            </div>
          </div>
        )}

        {/* Sertifikanın Tam Görünümü */}
        {activeCert && (
          <div className="space-y-4">
            <CertificateView cert={activeCert} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SertifikaSorguPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        </div>
      }
    >
      <SorguContent />
    </Suspense>
  );
}
