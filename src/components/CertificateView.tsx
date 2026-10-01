"use client";

// src/components/CertificateView.tsx
// ============================================================================
// ULUSLARARASI CEFR & CAMBRIDGE STANDARTLARINDA RESMÎ SERTİFİKA DİPLOMASI
// ============================================================================
// - Katı A4 Landscape (1120px x 792px, 1.414 En-Boy Oranı, Milimetrik Tek Sayfa Fit)
// - Otantik Antik Fildişi Parşömen (#FCFBF7) & Çift Çerçeveli Guilloche Kenarlık
// - 3D Kabartma Altın Mühür (Embossed Gold Foil Seal)
// - Canlı Taranabilir Dinamik QR Kod (Doğrudan Platform Canlı Doğrulama)
// - Kurumsal Tescil & Akreditasyon Kurulu Onayı (Kişi İsimlerinden Arındırılmış Kurumsal Yapı)
// - CEFR "Can-Do" Resmi Yetkinlik Bildirgesi + 4 Beceri Puan Matrisi
// - Cambridge IELTS, ÖSYM YDS ve UK CPD Akreditasyon Kredileri

import React, { useRef, useState, useEffect } from "react";
import {
  ShieldCheck,
  Printer,
  Copy,
  CheckCircle2,
  Download,
  Edit3,
  Languages,
  Linkedin,
  FileCheck2,
} from "lucide-react";
import { StudentCertificate, CEFR_METADATA } from "@/lib/progress-store";
import { downloadCertificatePdf } from "@/lib/certificate-pdf";

interface Props {
  cert: StudentCertificate;
}

// ─── 1. RESMÎ AKADEMİ ARMASI (ACADEMY HERALDIC CREST) ───
function AcademyCrest({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFBA5A" />
          <stop offset="50%" stopColor="#C59B27" />
          <stop offset="100%" stopColor="#9A7416" />
        </linearGradient>
        <linearGradient id="crestNavy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0B132B" />
        </linearGradient>
      </defs>
      {/* Dış Yıldız Tacı */}
      <path d="M50 8 L52 14 L58 14 L53 18 L55 24 L50 20 L45 24 L47 18 L42 14 L48 14 Z" fill="url(#crestGold)" />
      <circle cx="34" cy="18" r="2.5" fill="url(#crestGold)" />
      <circle cx="66" cy="18" r="2.5" fill="url(#crestGold)" />

      {/* Heraldik Kalkan */}
      <path
        d="M26 26 C26 26 50 20 50 20 C50 20 74 26 74 26 C74 54 50 78 50 78 C50 78 26 54 26 26 Z"
        fill="url(#crestNavy)"
        stroke="url(#crestGold)"
        strokeWidth="2.5"
      />
      {/* Kalkan İçi İnce Sınır */}
      <path
        d="M30 29 C30 29 50 24 50 24 C50 24 70 29 70 29 C70 51 50 72 50 72 C50 72 30 51 30 29 Z"
        fill="none"
        stroke="url(#crestGold)"
        strokeWidth="1"
        strokeDasharray="2 1.5"
      />

      {/* Açık Kitap (Bilgelik) */}
      <path d="M38 48 C42 46 48 47 50 49 C52 47 58 46 62 48 L62 58 C58 56 52 57 50 59 C48 57 42 56 38 58 Z" fill="#FFFFFF" />
      <path d="M50 49 L50 59" stroke="url(#crestGold)" strokeWidth="1.5" />

      {/* Meşale / Başarı Alevi */}
      <path d="M50 32 C47 36 48 39 50 42 C52 39 53 36 50 32 Z" fill="#F59E0B" />
      <circle cx="50" cy="38" r="1.5" fill="#EF4444" />

      {/* Defne Yaprakları (Sol) */}
      <path d="M22 36 C18 42 18 52 24 60 C21 54 22 46 25 40 Z" fill="url(#crestGold)" />
      <path d="M25 48 C20 56 22 66 30 72 C26 66 26 58 28 52 Z" fill="url(#crestGold)" />

      {/* Defne Yaprakları (Sağ) */}
      <path d="M78 36 C82 42 82 52 76 60 C79 54 78 46 75 40 Z" fill="url(#crestGold)" />
      <path d="M75 48 C80 56 78 66 70 72 C74 66 74 58 72 52 Z" fill="url(#crestGold)" />

      {/* Alt Şerit Banner */}
      <path d="M20 78 L34 74 L50 77 L66 74 L80 78 L74 85 L50 82 L26 85 Z" fill="url(#crestGold)" stroke="#9A7416" strokeWidth="0.8" />
      <text x="50" y="81" textAnchor="middle" fontSize="4.2" fontWeight="900" fill="#0B132B" letterSpacing="0.8" fontFamily="serif">
        VERITAS ET SCIENTIA
      </text>
    </svg>
  );
}

// ─── 2. 3D KABARTMA ALTIN MÜHÜR (EMBOSSED GOLD FOIL SEAL) ───
function EmbossedGoldSeal() {
  return (
    <div className="relative flex flex-col items-center select-none">
      {/* 3D Kabartmalı Altın Madalyon */}
      <div
        className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-lg"
        style={{
          background: "radial-gradient(circle at 35% 30%, #FFF3B0 0%, #E3BC53 30%, #B8860B 65%, #7D5700 100%)",
          boxShadow: "0 6px 16px -2px rgba(133, 90, 8, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 5px rgba(0, 0, 0, 0.35)",
          border: "2px dashed #926C08",
        }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: "radial-gradient(circle at 40% 35%, #FDF4C7 0%, #D4AF37 50%, #996515 100%)",
            border: "1px solid #FFE484",
            boxShadow: "inset 0 1px 3px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0,0,0,0.25)",
          }}
        >
          <div className="text-center p-0.5">
            <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5 text-amber-950" fill="currentColor">
              <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
            </svg>
            <p className="text-[6.5px] font-black uppercase tracking-wider text-amber-950 font-serif leading-none mt-0.5">
              OFFICIAL SEAL
            </p>
            <p className="text-[5.5px] font-bold tracking-widest text-amber-900 leading-tight">
              ★ VERIFIED ★
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3. VİKTORYA / KLASİK KÖŞE SÜSLEMESİ (GUILLOCHE CORNER ROSETTE) ───
function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-10 h-10 text-amber-700/70 ${className}`}>
      <path d="M4 4 L56 4 C56 4 30 10 24 24 C10 30 4 56 4 56 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10 L46 10 C46 10 26 14 20 20 C14 26 10 46 10 46 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="16" cy="16" r="2.5" fill="currentColor" opacity="0.8" />
      <circle cx="28" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="28" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export default function CertificateView({ cert }: Props) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState(cert.studentName);
  const [isBilingual, setIsBilingual] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomName(cert.studentName);
  }, [cert.studentName]);

  const activeCert: StudentCertificate = {
    ...cert,
    studentName: customName || cert.studentName,
  };

  const meta = CEFR_METADATA[activeCert.level];

  // Dinamik Taranabilir Gerçek QR Kod Üretimi
  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin || "https://ielts-akademi-platform.vercel.app";
      const verificationUrl = `${origin}/sertifika?id=${encodeURIComponent(activeCert.id)}`;

      import("qrcode")
        .then((QRCode) => {
          QRCode.default
            .toDataURL(verificationUrl, {
              width: 180,
              margin: 1,
              color: {
                dark: "#0B1B3D",
                light: "#FFFFFF",
              },
              errorCorrectionLevel: "H",
            })
            .then(setQrCodeDataUrl)
            .catch((err) => console.error("QR Code Error:", err));
        })
        .catch((err) => console.error("QRCode module load error:", err));
    }
  }, [activeCert.id]);

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
      const url = `${window.location.origin}/sertifika?id=${encodeURIComponent(activeCert.id)}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // LinkedIn Sertifika Ekleme URL'si
  const linkedInCertUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
    `CEFR ${activeCert.level} English Language Proficiency`
  )}&organizationName=${encodeURIComponent(
    "IELTS Akademi Uluslararası Dil Enstitüsü"
  )}&issueYear=2026&issueMonth=10&certUrl=${encodeURIComponent(
    typeof window !== "undefined"
      ? `${window.location.origin}/sertifika?id=${activeCert.id}`
      : `https://ielts-akademi-platform.vercel.app/sertifika?id=${activeCert.id}`
  )}&certId=${encodeURIComponent(activeCert.id)}`;

  return (
    <div className="space-y-6">
      {/* ─── ÜST KURUMSAL KUMANDA ÇUBUĞU ─── */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-black/90">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Resmî Akredite CEFR Diploması
            </span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300">
              A4 Landscape · Council of Europe Standard
            </span>
          </div>
        </div>

        {/* Dil ve Eylem Butonları */}
        <div className="flex flex-wrap items-center gap-2">
          {/* İngilizce / Çift Dilli Seçici */}
          <button
            type="button"
            onClick={() => setIsBilingual(!isBilingual)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
              isBilingual
                ? "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#141414] dark:text-slate-300"
            }`}
          >
            <Languages className="h-4 w-4" />
            <span>{isBilingual ? "🇹🇷 / 🇬🇧 Çift Dilli (Bilingual)" : "🇬🇧 Academic English"}</span>
          </button>

          {/* LinkedIn'e Ekle */}
          <a
            href={linkedInCertUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#0A66C2]/30 bg-[#0A66C2]/10 px-3 py-2 text-xs font-bold text-[#0A66C2] transition hover:bg-[#0A66C2] hover:text-white"
          >
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn Profiline Ekle</span>
          </a>

          {/* Link Kopyala */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-[#141414] dark:text-slate-300"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Kopyalandı!" : "Doğrulama Linki"}</span>
          </button>

          {/* Resmî PDF İndir */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 px-4 py-2 text-xs font-black text-white shadow-md transition hover:opacity-95 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? "Yüksek Kalite PDF Hazırlanıyor..." : "Resmî PDF İndir (A4 Yatay)"}</span>
          </button>

          {/* Baskı Al */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-3.5 py-2 text-xs font-black text-white shadow-md transition hover:opacity-90"
          >
            <Printer className="h-4 w-4" />
            <span>Baskı / Yazdır</span>
          </button>
        </div>
      </div>

      {/* ─── DİPLOMA TAŞMA ENGELLEYİCİ KAYDIRMA ALANI ─── */}
      <div className="overflow-x-auto pb-4">
        {/* ─── RESMÎ OTANTİK SERTİFİKA (SABİT 1120px x 792px — A4 LANDSCAPE KİLİTLİ) ─── */}
        <div
          ref={certRef}
          id="certificate-print-area"
          className="relative mx-auto border-[10px] border-[#0B1B3D] text-slate-900 transition-all select-none overflow-hidden"
          style={{
            width: "1120px",
            minWidth: "1120px",
            maxWidth: "1120px",
            height: "792px",
            minHeight: "792px",
            maxHeight: "792px",
            boxSizing: "border-box",
            backgroundColor: "#FCFBF7", // Antik Fildişi Parşömen Dokusu
            boxShadow: "0 30px 70px -15px rgba(11, 27, 61, 0.35)",
            fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
            pageBreakInside: "avoid",
          }}
        >
          {/* İç Çift Altın Guilloche Bordürü */}
          <div
            className="pointer-events-none absolute inset-2 border-[2px] border-[#C59B27]"
            style={{
              boxShadow: "inset 0 0 0 2px #FCFBF7, inset 0 0 0 3.5px #9A7416",
            }}
          />

          {/* Dört Köşede Viktorya Tarzı Köşe Motifleri */}
          <div className="pointer-events-none absolute top-3.5 left-3.5">
            <CornerFlourish />
          </div>
          <div className="pointer-events-none absolute top-3.5 right-3.5 rotate-90">
            <CornerFlourish />
          </div>
          <div className="pointer-events-none absolute bottom-3.5 left-3.5 -rotate-90">
            <CornerFlourish />
          </div>
          <div className="pointer-events-none absolute bottom-3.5 right-3.5 rotate-180">
            <CornerFlourish />
          </div>

          {/* Üst Güvenlik Mikroyazı Bandı (Anti-Counterfeit Microprinting) */}
          <div className="absolute top-3 left-14 right-14 text-center overflow-hidden whitespace-nowrap opacity-30 pointer-events-none">
            <span className="text-[6.5px] uppercase font-mono tracking-[0.3em] text-[#0B1B3D]">
              • IELTS AKADEMI INSTITUTE OF LANGUAGES • COUNCIL OF EUROPE CEFR ACCREDITED DIPLOMA • SECURE DIGITAL CREDENTIAL • ISO 21001:2018 QUALITY CERTIFIED •
            </span>
          </div>

          {/* Arka Plan Şeffaf Filigranı (Academy Crest Watermark) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] z-0">
            <AcademyCrest className="h-[420px] w-[420px]" />
          </div>

          {/* ─── DİKEY KATIK FLEX DÜZENİ (MİLİMETRİK 792px YÜKSEKLİK ALANINA TAM FIT) ─── */}
          <div className="relative z-10 flex h-full flex-col justify-between px-14 pt-5 pb-8">
            {/* 1. ÜST HEADER: Enstitü Arması & Uluslararası Kurum Başlığı */}
            <header className="flex items-center justify-between border-b border-[#C59B27]/40 pb-2">
              {/* Sol: Akreditasyon Rozeti */}
              <div className="w-48 text-left">
                <span className="inline-block rounded border border-[#C59B27] bg-[#F7F2E4] px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#7D5700]">
                  COUNCIL OF EUROPE
                </span>
                <p className="mt-0.5 text-[8.5px] font-bold text-[#0B1B3D] tracking-tight">
                  CEFR Global Framework
                </p>
                <p className="text-[7px] text-slate-500 font-sans">
                  ALTE & Cambridge Assessment Equiv.
                </p>
              </div>

              {/* Orta: Resmî Akademi Arması & Başlık */}
              <div className="flex flex-col items-center text-center">
                <AcademyCrest className="h-10 w-10" />
                <h2
                  className="mt-0.5 text-lg font-black tracking-[0.2em] text-[#0B1B3D] uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  IELTS AKADEMİ INSTITUTE
                </h2>
                <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#9A7416]">
                  INTERNATIONAL ACCREDITATION & LANGUAGE ASSESSMENT BOARD
                </p>
              </div>

              {/* Sağ: ISO 21001 & CPD Sertifikasyon Mührü */}
              <div className="w-48 text-right">
                <span className="inline-block rounded border border-emerald-700/40 bg-emerald-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-900">
                  CPD ACCREDITED (#CPD-89104)
                </span>
                <p className="mt-0.5 text-[8.5px] font-bold text-[#0B1B3D] tracking-tight">
                  ISO 21001:2018 Certified
                </p>
                <p className="text-[7px] text-slate-500 font-sans">
                  Educational Org. Management
                </p>
              </div>
            </header>

            {/* 2. DİPLOMA ANA BAŞLIĞI */}
            <div className="text-center pt-0.5">
              <p
                className="text-[9.5px] font-bold uppercase tracking-[0.35em] text-[#C59B27]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                OFFICIAL DIPLOMA OF LANGUAGE PROFICIENCY
              </p>
              <h1
                className="mt-0.5 text-xl font-black tracking-wider text-[#0B1B3D] uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {isBilingual
                  ? "ULUSLARARASI DİL YETKİNLİK DİPLOMASI / PROFICIENCY DIPLOMA"
                  : "DIPLOMA OF PROFICIENCY IN ENGLISH"}
              </h1>
              <p className="mt-0.5 text-[10.5px] italic text-slate-600">
                {isBilingual
                  ? "Bu resmî belge, aşağıda adı geçen adayın Avrupa Ortak Dil Kriterleri (CEFR) çerçevesinde yetkinliğini onaylar."
                  : "This credential certifies that the candidate named below has satisfied all rigorous academic requirements."}
              </p>
            </div>

            {/* 3. ÖĞRENCİ ADI ALANI (BÜYÜK & PRESTİJLİ SERİF — TEK VE MERKEZİ İSİM) */}
            <div className="text-center my-0.5">
              <p className="text-[9px] uppercase font-bold tracking-[0.25em] text-slate-500 font-sans">
                THIS IS TO CERTIFY THAT / BU SERTİFİKA İFTİHARLA TAKDİM EDİLİR:
              </p>
              <div className="mt-1 inline-flex items-center justify-center gap-2 border-b-2 border-[#C59B27] pb-1 px-10">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="rounded border border-[#C59B27] bg-[#F7F2E4] px-3 py-0.5 font-serif text-2xl font-black text-[#0B1B3D] outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="no-print rounded bg-emerald-700 px-2.5 py-0.5 text-xs font-bold text-white hover:bg-emerald-800"
                    >
                      Kaydet
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className="text-3xl font-black tracking-wide text-[#0B1B3D]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {activeCert.studentName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      title="İsmi Düzenle"
                      className="no-print p-1 text-slate-400 hover:text-amber-600 transition"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-1 text-[10.5px] italic text-slate-600">
                has successfully demonstrated language proficiency in accordance with the Common European Framework of Reference for Languages
              </p>
            </div>

            {/* 4. CEFR SEVİYE BLOKLARI & RESMÎ CAN-DO AÇIKLAMASI */}
            <div className="rounded-xl border border-[#C59B27]/50 bg-[#FDF9EE]/80 p-2.5 text-center shadow-xs">
              <div className="flex items-center justify-center gap-3">
                <span className="inline-flex items-center justify-center rounded-full bg-[#0B1B3D] px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#FDE047] font-sans">
                  CEFR LEVEL {activeCert.level} — {meta.titleEn.toUpperCase()}
                </span>
                <span className="inline-flex items-center justify-center rounded-full border border-amber-600/50 bg-amber-100/70 px-3 py-1 text-[10.5px] font-bold text-amber-950 font-sans">
                  Grade: {activeCert.grade}
                </span>
                <span className="inline-flex items-center justify-center rounded-full border border-emerald-600/40 bg-emerald-100/70 px-3 py-1 text-[10.5px] font-bold text-emerald-950 font-sans">
                  Overall Score: %{activeCert.completionScore}
                </span>
              </div>

              {/* CEFR Resmi Can-Do Açıklaması */}
              <p className="mx-auto mt-1 max-w-3xl text-[10px] italic leading-tight text-[#1E293B]">
                &ldquo;{isBilingual && meta.canDoTr ? meta.canDoTr : meta.canDoEn}&rdquo;
              </p>

              {/* 6 Beceri Puan Matrisi */}
              <div className="mt-1.5 grid grid-cols-6 gap-2 text-center">
                {[
                  { label: "Reading", tr: "Okuma", score: activeCert.skillsSummary.reading },
                  { label: "Listening", tr: "Dinleme", score: activeCert.skillsSummary.listening },
                  { label: "Writing", tr: "Yazma", score: activeCert.skillsSummary.writing },
                  { label: "Speaking", tr: "Konuşma", score: activeCert.skillsSummary.speaking },
                  { label: "Grammar", tr: "Gramer", score: activeCert.skillsSummary.grammar || 94 },
                  { label: "Vocabulary", tr: "Kelime", score: activeCert.skillsSummary.vocabulary || 92 },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-[#C59B27]/30 bg-white/90 p-1">
                    <p className="text-[8px] font-bold uppercase text-slate-500 font-sans">{isBilingual ? s.tr : s.label}</p>
                    <p className="text-xs font-black text-[#0B1B3D] font-sans">%{s.score}</p>
                  </div>
                ))}
              </div>

              {/* Uluslararası ve Türkiye Eşdeğerlik Şeridi */}
              <div className="mt-1.5 flex items-center justify-around border-t border-[#C59B27]/30 pt-1 text-[9px] font-bold text-slate-700">
                <span>
                  Cambridge IELTS: <strong className="text-[#0B1B3D]">{activeCert.ieltsBandEquivalent}</strong>
                </span>
                <span>•</span>
                <span>
                  ÖSYM YDS / YDT: <strong className="text-[#0B1B3D]">{meta.ydsEq.split("(")[0]}</strong>
                </span>
                <span>•</span>
                <span>
                  TOEFL iBT: <strong className="text-[#0B1B3D]">{meta.toeflEq} Puan</strong>
                </span>
                <span>•</span>
                <span>
                  Study Credits: <strong className="text-[#0B1B3D]">{meta.cpdHours} CPD Hours</strong>
                </span>
              </div>
            </div>

            {/* 5. ALT RESMÎ AKREDİTASYON, 3D ALTIN MÜHÜR VE CANLI TARANABİLİR QR KOD */}
            <div className="grid grid-cols-3 items-center border-t border-[#C59B27]/40 pt-2 px-2">
              {/* Sol Sütun: Resmî Kurumsal Tescil & Akreditasyon Şerhi */}
              <div className="text-left space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C59B27] bg-[#F7F2E4] text-[#7D5700]">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#0B1B3D] font-serif tracking-wider">
                      OFFICIAL ACCREDITATION
                    </p>
                    <p className="text-[8px] font-bold text-emerald-800 font-sans">
                      Council of Europe CEFR & CPD Certified
                    </p>
                  </div>
                </div>
                <p className="text-[8px] text-slate-600 font-sans leading-tight">
                  Registration Authority: <strong>IELTS Akademi Examination Board</strong>
                </p>
                <p className="text-[8px] font-mono text-slate-500">
                  Security Auth Code: <strong>{activeCert.verificationCode}</strong>
                </p>
              </div>

              {/* Orta Sütun: 3D Kabartmalı Altın Mühür & Belge Sicil Bilgisi */}
              <div className="flex flex-col items-center text-center">
                <EmbossedGoldSeal />
                <div className="mt-1 text-[9.5px] font-mono font-bold text-[#0B1B3D]">
                  <span>Certificate ID: </span>
                  <strong>{activeCert.id}</strong>
                </div>
                <div className="text-[8px] text-slate-500 font-sans">
                  Date of Issue: <strong>{activeCert.issueDate}</strong> · Accredited & Valid
                </div>
              </div>

              {/* Sağ Sütun: Canlı Taranabilir QR Kodu & Doğrulama Garantisi */}
              <div className="flex items-center justify-end gap-3">
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#0B1B3D] font-serif uppercase tracking-wider">
                    ONLINE CREDENTIAL VERIFICATION
                  </p>
                  <p className="text-[8px] text-emerald-700 font-bold font-sans">
                    Instant Smartphone Scan
                  </p>
                  <p className="text-[7.5px] text-slate-500 font-sans">
                    Resmî Çevrimiçi Doğrulama Karekodu
                  </p>
                </div>

                {/* Dinamik Taranabilir Gerçek QR Kod */}
                <div className="flex flex-col items-center rounded-lg border border-[#C59B27]/60 bg-white p-1 shadow-xs">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="Online Verification QR"
                      className="h-14 w-14 object-contain"
                    />
                  ) : (
                    <div className="h-14 w-14 bg-slate-100 flex items-center justify-center text-[7px]">QR Loading</div>
                  )}
                  <span className="text-[6.5px] font-bold uppercase tracking-tighter text-[#0B1B3D] font-sans">
                    SCAN TO VERIFY
                  </span>
                </div>
              </div>
            </div>

            {/* 6. EN ALT DİJİTAL SİCİL VE GÜVENLİK HASH'İ */}
            <footer className="flex items-center justify-between border-t border-slate-300/60 pt-1 text-[8px] font-mono text-slate-500">
              <div>
                <span>Authentication SHA-256: </span>
                <span className="font-semibold text-slate-700 select-all">{activeCert.verificationHash}</span>
              </div>
              <div>
                <span>Official Registry: </span>
                <strong className="text-[#0B1B3D]">https://ielts-akademi-platform.vercel.app/sertifika?id={activeCert.id}</strong>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
