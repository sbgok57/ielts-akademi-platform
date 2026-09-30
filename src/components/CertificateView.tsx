"use client";

// src/components/CertificateView.tsx
// Resmi, Renkli ve Doğrulanabilir Bitirme Sertifikası Bileşeni
// CEFR ve IELTS Standartlarına uyumlu, yazdırma/PDF indirme destekli.

import React, { useRef, useState, useEffect } from "react";
import {
  Award,
  ShieldCheck,
  Printer,
  Copy,
  Share2,
  CheckCircle2,
  ExternalLink,
  QrCode,
  Sparkles,
  Download,
  Edit3,
} from "lucide-react";
import { StudentCertificate, CEFR_METADATA } from "@/lib/progress-store";
import { downloadCertificatePdf } from "@/lib/certificate-pdf";

interface Props {
  cert: StudentCertificate;
}

export default function CertificateView({ cert }: Props) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState(cert.studentName);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomName(cert.studentName);
  }, [cert.studentName]);

  const activeCert: StudentCertificate = {
    ...cert,
    studentName: customName || cert.studentName,
  };

  const meta = CEFR_METADATA[activeCert.level];

  const handleDownloadPdf = () => {
    setDownloading(true);
    try {
      downloadCertificatePdf(activeCert);
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/sertifika?id=${activeCert.id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Eylem Çubuğu (Doğrudan PDF İndirme & Yazdırma & Paylaşım) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-black/90">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            ✅ Resmî CEFR Onaylı Bitirme Sertifikası (Dünyada Geçerli)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-[#141414] dark:text-slate-300"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Bağlantı Kopyalandı!" : "Doğrulama Linki"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-black text-white shadow-md transition hover:opacity-95"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? "PDF İndiriliyor..." : "PDF İndir (Doğrudan)"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 px-4 py-2 text-xs font-black text-white shadow-md transition hover:opacity-90"
          >
            <Printer className="h-4 w-4" />
            <span>Yazdır / A4 Baskı</span>
          </button>
        </div>
      </div>

      {/* ─── RESMÎ RENKLİ SERTİFİKA DİPLOMASI ─── */}
      <div
        ref={certRef}
        id="certificate-print-area"
        className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border-8 border-double border-amber-400/80 bg-white p-8 sm:p-12 shadow-2xl text-slate-900 dark:bg-[#0c0c0c] dark:text-slate-100"
        style={{
          boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.25)",
        }}
      >
        {/* Güvenlik Deseni ve Canlı Gökkuşağı Kenarlık İçi */}
        <div className="rainbow-gradient-h -mx-8 sm:-mx-12 -mt-8 sm:-mt-12 mb-8 h-3" />

        {/* Üst Başlık & Akademi Logosu */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-indigo-600 text-white shadow-lg">
              <Award className="h-7 w-7" />
            </div>
            <div className="text-left">
              <p className="text-lg font-black tracking-wider text-slate-900 dark:text-white uppercase font-serif">
                IELTS AKADEMİ PLATFORM
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                ULUSLARARASI DİL AKREDİTASYON ENSTİTÜSÜ
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            OFFICIAL CERTIFICATE OF LANGUAGE PROFICIENCY
          </p>

          <h1 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 font-serif">
            DİL YETKİNLİK VE BİTİRME SERTİFİKASI
          </h1>

          <p className="mt-4 max-w-xl text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Bu belge, aşağıda adı geçen öğrencinin Avrupa Dilleri Ortak Başvuru Metni (CEFR) ve Cambridge IELTS standartları kapsamındaki tüm akademik yeterlilikleri başarıyla tamamladığını onaylar.
          </p>
        </div>

        {/* Öğrenci Adı */}
        <div className="my-8 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            BU SERTİFİKA İFTİHARLA TAKDİM EDİLİR:
          </p>
          <div className="mt-2 inline-flex items-center gap-2 border-b-2 border-amber-500 pb-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="rounded-xl border-2 border-amber-500 bg-amber-50/70 px-4 py-1 font-serif text-2xl font-black text-slate-900 outline-none dark:bg-black dark:text-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="no-print rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Tamam
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-serif tracking-wide">
                  {activeCert.studentName}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  title="Sertifikadaki İsmi Düzenle"
                  className="no-print p-1 text-slate-400 hover:text-amber-500 transition opacity-70 hover:opacity-100"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Başarılan Seviye & IELTS Bandı */}
        <div className="my-6 rounded-2xl border-2 border-amber-500/30 bg-amber-50/50 p-6 text-center dark:bg-amber-950/20">
          <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-xs font-black uppercase text-white shadow-sm">
            {activeCert.levelTitle}
          </span>
          <h3 className="mt-3 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            CEFR {activeCert.level} Seviyesi Başarı Derecesi: {activeCert.grade}
          </h3>
          <p className="mt-1 text-xs font-bold text-amber-700 dark:text-amber-300">
            IELTS Eşdeğerlik Standardı: {activeCert.ieltsBandEquivalent} · Başarı Puanı: %{activeCert.completionScore}
          </p>

          {/* 4 Temel Beceri Puan Özeti */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { ad: "Okuma (Reading)", puan: activeCert.skillsSummary.reading, renk: "text-teal-600" },
              { ad: "Dinleme (Listening)", puan: activeCert.skillsSummary.listening, renk: "text-rose-600" },
              { ad: "Yazma (Writing)", puan: activeCert.skillsSummary.writing, renk: "text-indigo-600" },
              { ad: "Konuşma (Speaking)", puan: activeCert.skillsSummary.speaking, renk: "text-amber-600" },
            ].map((s) => (
              <div
                key={s.ad}
                className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-black/60"
              >
                <p className="text-[10px] font-bold text-slate-500">{s.ad}</p>
                <p className={`text-base font-black ${s.renk}`}>%{s.puan}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mühür, İmzalar ve Doğrulama Alanı */}
        <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t-2 border-slate-100 pt-6 sm:flex-row dark:border-slate-800">
          {/* Alt Mühür */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-double border-amber-500 bg-gradient-to-tr from-amber-400/20 to-orange-400/20 text-amber-600 shadow-inner">
              <div className="text-center">
                <ShieldCheck className="mx-auto h-8 w-8 text-amber-500" />
                <span className="text-[8px] font-black uppercase tracking-tighter">OFFICIAL SEAL</span>
              </div>
            </div>
            <div className="text-left text-xs">
              <p className="font-extrabold text-slate-800 dark:text-slate-200">
                Resmî Doğrulama Sicili
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Belge No: <strong>{activeCert.id}</strong>
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Güvenlik Kodu: {activeCert.verificationCode}
              </p>
              <p className="text-[10px] text-slate-400">
                Tarih: {activeCert.issueDate}
              </p>
            </div>
          </div>

          {/* İmzalar */}
          <div className="flex items-center gap-8 text-center text-xs">
            <div>
              <div className="font-serif italic text-base font-bold text-slate-800 dark:text-slate-200 border-b border-slate-300 pb-1 dark:border-slate-700">
                Dr. E. Wright
              </div>
              <p className="mt-1 text-[10px] font-bold text-slate-500">
                Akademik Kurul Başkanı
              </p>
            </div>
            <div>
              <div className="font-serif italic text-base font-bold text-slate-800 dark:text-slate-200 border-b border-slate-300 pb-1 dark:border-slate-700">
                Cambridge Standards Lead
              </div>
              <p className="mt-1 text-[10px] font-bold text-slate-500">
                Sınav Değerlendirme Komitesi
              </p>
            </div>
          </div>
        </div>

        {/* Alt Doğrulama Hash'i ve Kesin Geçerlilik Garantisi */}
        <div className="mt-6 rounded-xl bg-slate-50 p-2.5 text-center text-[10px] text-slate-400 font-mono dark:bg-black/40">
          <span>Kriptografik Doğrulama Hash&apos;i: </span>
          <span className="text-slate-600 dark:text-slate-300 select-all font-semibold">{activeCert.verificationHash}</span>
        </div>

        {/* Alt Gökkuşağı Çizgisi */}
        <div className="rainbow-gradient-h -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 mt-8 h-2" />
      </div>
    </div>
  );
}
