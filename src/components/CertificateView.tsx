"use client";

// src/components/CertificateView.tsx
// ============================================================================
// ULUSLARARASI CEFR & CAMBRIDGE STANDARTLARINDA RESMÎ SERTİFİKA DİPLOMASI
// ============================================================================
// - Katı CSS Grid & Flexbox yapısı (milimetrik hizalama)
// - A4 Landscape (1120px x 790px) sabit sınır kilidi (fit-to-single-page)
// - Yüksek çözünürlüklü rasterizasyon + Vektörel PDF indirme
// - Kurumsal doğrulama: ID, Kriptografik Hash, CEFR Seviyesi, İmzalar, Mühür

import React, { useRef, useState, useEffect } from "react";
import {
  Award,
  ShieldCheck,
  Printer,
  Copy,
  CheckCircle2,
  Download,
  Edit3,
  Globe2,
  FileCheck2,
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

  const handleDownloadPdf = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadCertificatePdf(activeCert, certRef.current);
    } catch (err) {
      console.error("PDF oluşturma hatası:", err);
    } finally {
      setDownloading(false);
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
      {/* ─── Üst Eylem Çubuğu ─── */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-black/90">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              CEFR & Cambridge Uyumlu Resmî Bitirme Belgesi
            </span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              A4 Landscape (Yatay)
            </span>
          </div>
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
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-black text-white shadow-md transition hover:opacity-95 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? "Yüksek Kalite PDF Hazırlanıyor..." : "Resmî PDF İndir (A4 Landscape)"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 px-4 py-2 text-xs font-black text-white shadow-md transition hover:opacity-90"
          >
            <Printer className="h-4 w-4" />
            <span>Yazdır / Baskı Al</span>
          </button>
        </div>
      </div>

      {/* ─── SERTİFİKA TAŞMA KORUYUCU KONTEYNER ─── */}
      <div className="overflow-x-auto pb-4">
        {/* ─── RESMÎ A4 LANDSCAPE DİPLOMA (SABİT 1120px x 790px İLE KUSURSUZ TEK SAYFA FIT) ─── */}
        <div
          ref={certRef}
          id="certificate-print-area"
          className="relative mx-auto bg-white text-slate-900 border-8 border-double border-amber-500/80 shadow-2xl transition-all"
          style={{
            width: "1120px",
            minWidth: "1120px",
            maxWidth: "1120px",
            height: "790px",
            minHeight: "790px",
            maxHeight: "790px",
            boxSizing: "border-box",
            padding: "36px 48px",
            fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            boxShadow: "0 25px 60px -15px rgba(217, 119, 6, 0.25)",
            pageBreakInside: "avoid",
          }}
        >
          {/* Üst Gökkuşağı Emniyet Şeridi */}
          <div
            className="absolute top-0 left-0 right-0 h-3"
            style={{
              background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 20%, #EC4899 40%, #EF4444 60%, #F59E0B 80%, #10B981 100%)",
            }}
          />

          {/* İç Çift Altın İnce Çerçeve */}
          <div className="pointer-events-none absolute inset-3 border border-amber-300/60 rounded-xl" />

          {/* DİKEY ESNEK IZGARA (FLEXBOX GRID) - TÜM ÖĞELERİ 790px ALANA DENGELİ DAĞITIR */}
          <div className="flex h-full flex-col justify-between">
            {/* 1. ÜST HEADER: Logo, Kurum Adı ve CEFR Akreditasyon Damgası */}
            <header className="flex items-center justify-between border-b-2 border-amber-100 pb-3">
              {/* Sol: Enstitü Logosu & Başlık */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600 text-white shadow-md">
                  <Award className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-serif text-lg font-black tracking-wider text-slate-900 uppercase">
                    IELTS AKADEMİ PLATFORM
                  </p>
                  <p className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">
                    INTERNATIONAL LANGUAGE ACCREDITATION INSTITUTE
                  </p>
                </div>
              </div>

              {/* Sağ: CEFR & Cambridge Resmi Standart Rozeti */}
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-right">
                <Globe2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-[10px] font-black text-emerald-900 uppercase tracking-tight">
                    CEFR EUROPEAN FRAMEWORK
                  </p>
                  <p className="text-[9px] font-bold text-emerald-700">
                    Cambridge Assessment Equivalence
                  </p>
                </div>
              </div>
            </header>

            {/* 2. DİPLOMA BAŞLIK ALANI */}
            <div className="text-center pt-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
                OFFICIAL CERTIFICATE OF LANGUAGE PROFICIENCY
              </p>
              <h1 className="mt-1 font-serif text-3xl font-black tracking-tight text-slate-900">
                ULUSLARARASI DİL YETKİNLİK VE BİTİRME SERTİFİKASI
              </h1>
              <p className="mx-auto mt-1 max-w-2xl text-[12px] leading-relaxed text-slate-600">
                Bu resmî belge, aşağıda kimlik bilgileri yer alan adayın Avrupa Konseyi Yabancı Diller Ortak Başvuru Metni (CEFR)
                ve Cambridge ESOL ölçütleri doğrultusunda belirlenen akademik programı başarıyla tamamladığını tescil eder.
              </p>
            </div>

            {/* 3. ÖĞRENCİ ADI ALANI (Öne Çıkarılmış & Düzenlenebilir) */}
            <div className="text-center my-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                BU SERTİFİKA İFTİHARLA TAKDİM EDİLİR:
              </p>
              <div className="mt-1 inline-flex items-center justify-center gap-2 border-b-2 border-amber-500 pb-1 px-8">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="rounded-lg border-2 border-amber-500 bg-amber-50 px-3 py-0.5 font-serif text-2xl font-black text-slate-900 outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="no-print rounded bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      Kaydet
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-3xl font-black tracking-wide text-slate-950">
                      {activeCert.studentName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      title="İsmi Düzenle"
                      className="no-print p-1 text-slate-300 hover:text-amber-500 transition"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 4. CEFR SEVİYE & YETKİNLİK BİLGİ KUTUSU (KATIK GRID SİSTEMİ) */}
            <div className="rounded-2xl border-2 border-amber-400/40 bg-amber-50/40 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-0.5 text-[11px] font-black uppercase text-white shadow-sm">
                  {activeCert.levelTitle}
                </span>
                <span className="rounded-full bg-slate-900 px-3 py-0.5 text-[11px] font-black text-white">
                  Seviye: CEFR {activeCert.level}
                </span>
              </div>

              <h2 className="mt-2 text-lg font-black text-slate-900">
                Yetkinlik Derecesi: <span className="text-amber-700">{activeCert.grade}</span> · Başarı Skoru: %{activeCert.completionScore}
              </h2>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-600">
                Uluslararası IELTS Eşdeğerlik Standardı: <strong className="text-slate-900">{activeCert.ieltsBandEquivalent}</strong> (Cambridge Assessment)
              </p>

              {/* 4 Temel Beceri Puan Matrisi (Katı 4 Sütun Grid) */}
              <div className="mt-2.5 grid grid-cols-4 gap-3 text-left">
                {[
                  { ad: "Okuma (Reading)", puan: activeCert.skillsSummary.reading, renk: "text-teal-700", bg: "bg-teal-50/80", border: "border-teal-200" },
                  { ad: "Dinleme (Listening)", puan: activeCert.skillsSummary.listening, renk: "text-sky-700", bg: "bg-sky-50/80", border: "border-sky-200" },
                  { ad: "Yazma (Writing)", puan: activeCert.skillsSummary.writing, renk: "text-indigo-700", bg: "bg-indigo-50/80", border: "border-indigo-200" },
                  { ad: "Konuşma (Speaking)", puan: activeCert.skillsSummary.speaking, renk: "text-amber-700", bg: "bg-amber-50/80", border: "border-amber-200" },
                ].map((s) => (
                  <div
                    key={s.ad}
                    className={`rounded-xl border ${s.border} ${s.bg} p-2 text-center shadow-xs`}
                  >
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{s.ad}</p>
                    <p className={`text-base font-black ${s.renk}`}>%{s.puan}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. RESMÎ MÜHÜR, DOĞRULAMA SİCİLİ VE İMZA BLOĞU (FLEXBOX IZGARASI) */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              {/* Sol: Altın Resmi Mühür & Doğrulama Meta Verileri */}
              <div className="flex items-center gap-3">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-double border-amber-500 bg-amber-100/50 text-amber-700 shadow-inner">
                  <div className="text-center">
                    <ShieldCheck className="mx-auto h-6 w-6 text-amber-600" />
                    <span className="block text-[7px] font-black uppercase tracking-tighter">OFFICIAL SEAL</span>
                  </div>
                </div>
                <div className="text-left text-xs">
                  <p className="font-extrabold text-slate-900 flex items-center gap-1">
                    <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
                    Resmî Sertifika Sicil Kaydı
                  </p>
                  <p className="text-[11px] font-mono text-slate-600">
                    Sertifika No: <strong>{activeCert.id}</strong>
                  </p>
                  <p className="text-[10px] font-mono text-slate-500">
                    Güvenlik Doğrulama Kodu: <strong>{activeCert.verificationCode}</strong>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Tanzim Tarihi: {activeCert.issueDate}
                  </p>
                </div>
              </div>

              {/* Sağ: İmzalar (Milimetrik Çizgili İmzalar) */}
              <div className="flex items-center gap-8 text-center">
                <div className="w-36">
                  <div className="border-b border-slate-400 pb-1 font-serif italic text-sm font-bold text-slate-900">
                    Dr. E. Wright
                  </div>
                  <p className="mt-1 text-[9px] font-bold text-slate-600 uppercase">
                    Akademik Kurul Başkanı
                  </p>
                </div>

                <div className="w-40">
                  <div className="border-b border-slate-400 pb-1 font-serif italic text-sm font-bold text-slate-900">
                    Prof. M. Stirling, PhD
                  </div>
                  <p className="mt-1 text-[9px] font-bold text-slate-600 uppercase">
                    Cambridge Standards Lead
                  </p>
                </div>
              </div>
            </div>

            {/* 6. ALT DOĞRULAMA HASH'İ VE AKREDİTASYON NOTU */}
            <div className="rounded-lg bg-slate-50 py-1 px-3 text-center text-[9px] text-slate-500 font-mono border border-slate-200/60">
              <span>Doğrulama Portalı: https://ielts-akademi-platform.vercel.app/sertifika?id={activeCert.id} · SHA-256 Hash: </span>
              <strong className="text-slate-700">{activeCert.verificationHash}</strong>
            </div>
          </div>

          {/* Alt Gökkuşağı Emniyet Şeridi */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2"
            style={{
              background: "linear-gradient(90deg, #10B981 0%, #F59E0B 20%, #EF4444 40%, #EC4899 60%, #8B5CF6 80%, #6366F1 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
