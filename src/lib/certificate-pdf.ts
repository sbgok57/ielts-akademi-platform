// src/lib/certificate-pdf.ts
// ============================================================================
// ULUSLARARASI CEFR & CAMBRIDGE IELTS RESMÎ SERTİFİKA PDF MOTORU (A4 LANDSCAPE)
// ============================================================================
// PERF: Yüksek çözünürlüklü rasterizasyon + font embedding + fit-to-single-page
// SAFETY: Fallback zinciri (jsPDF + html2canvas scale: 2.5 -> saf vektör PDF) asla çökmez.

import { StudentCertificate, CEFR_METADATA } from "./progress-store";

/**
 * Resmi fontların hazır olduğunu garanti altına alır.
 */
async function ensureFontsReady(): Promise<void> {
  if (typeof document !== "undefined" && "fonts" in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Font yükleme zaman aşımı durumunda sessizce devam et
    }
  }
}

/**
 * Resmi CEFR Sertifikasını A4 Landscape (297mm x 210mm) tek sayfa olarak
 * yüksek çözünürlüklü (scale: 2.5 anti-aliasing) ve taşmasız şekilde PDF'e dönüştürür.
 */
export async function downloadCertificatePdf(
  cert: StudentCertificate,
  elementOrId?: HTMLElement | string | null
): Promise<void> {
  if (typeof window === "undefined") return;

  const safeName = (cert.studentName || "Ogrenci")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\u00C0-\u017F-]/g, "");
  const fileName = `IELTS_Akademi_CEFR_${cert.level}_Sertifikasi_${safeName}.pdf`;

  // 1. Hedef HTML/DOM elementini tespit et
  let targetElement: HTMLElement | null = null;
  if (elementOrId instanceof HTMLElement) {
    targetElement = elementOrId;
  } else if (typeof elementOrId === "string") {
    targetElement = document.getElementById(elementOrId);
  } else {
    targetElement = document.getElementById("certificate-print-area");
  }

  // 2. jsPDF ve html2canvas ile ultra-yüksek kaliteli A4 Yatay render
  if (targetElement) {
    try {
      await ensureFontsReady();

      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      // A4 Yatay Standart Ölçüleri: 297mm genişlik x 210mm yükseklik
      const pdfWidthMm = 297;
      const pdfHeightMm = 210;

      // Anti-aliasing ve kristal netlik için scale: 2.5 (Retina/Baskı kalitesi ~300 DPI)
      const canvas = await html2canvas(targetElement, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FFFFFF",
        logging: false,
        imageTimeout: 10000,
        windowWidth: 1200, // Sabit genişlik bağlamı ile responsive kırılmaları önle
        onclone: (clonedDoc) => {
          const clonedCert = clonedDoc.getElementById("certificate-print-area");
          if (clonedCert) {
            // Yazdırma sırasında no-print elemanlarını ve butonları gizle
            const noPrints = clonedCert.querySelectorAll(".no-print");
            noPrints.forEach((el) => ((el as HTMLElement).style.display = "none"));
            
            // Sertifika sınırlarını ve arka planını zorla sabitle
            clonedCert.style.margin = "0";
            clonedCert.style.borderRadius = "0";
            clonedCert.style.boxShadow = "none";
            clonedCert.style.width = "1120px";
            clonedCert.style.minWidth = "1120px";
            clonedCert.style.maxWidth = "1120px";
            clonedCert.style.height = "790px";
            clonedCert.style.maxHeight = "790px";
            clonedCert.style.backgroundColor = "#FFFFFF";
            clonedCert.style.color = "#0F172A";
          }
        },
      });

      // Canvas verisini yüksek kaliteli PNG olarak al
      const imgData = canvas.toDataURL("image/png", 1.0);

      // jsPDF örneğini oluştur: landscape, mm, a4
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Fit-to-page: 297mm x 210mm tek sayfaya tam oturt, taşma yok
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidthMm, pdfHeightMm, undefined, "FAST");

      // PDF Doküman Meta Verilerini Ekle
      pdf.setProperties({
        title: `Official CEFR ${cert.level} Certificate - ${cert.studentName}`,
        subject: `CEFR ${cert.level} Language Proficiency Certification`,
        author: "IELTS Akademi Uluslararası Dil Akreditasyon Enstitüsü",
        keywords: `IELTS, CEFR, ${cert.level}, Certificate, Language Proficiency, Cambridge`,
        creator: "IELTS Akademi Platform (https://ielts-akademi-platform.vercel.app)",
      });

      // Doğrudan kullanıcıya indir
      pdf.save(fileName);
      return;
    } catch (renderError) {
      console.warn("html2canvas/jsPDF render hatası, vektörel motora geçiliyor:", renderError);
    }
  }

  // 3. Fallback: Bağımsız Vektörel PDF Üretici
  try {
    const blob = generateFallbackVectorPdf(cert);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (vectorError) {
    console.error("Vektörel PDF hatası:", vectorError);
    window.print();
  }
}

/**
 * PDF 1.4 Standartı ile Saf Vektörel Yedek PDF Oluşturucu
 */
function cleanTextForPdf(str: string): string {
  if (!str) return "";
  return str
    .replace(/ğ/g, "g").replace(/Ğ/g, "G")
    .replace(/ü/g, "u").replace(/Ü/g, "U")
    .replace(/ş/g, "s").replace(/Ş/g, "S")
    .replace(/ı/g, "i").replace(/İ/g, "I")
    .replace(/ö/g, "o").replace(/Ö/g, "O")
    .replace(/ç/g, "c").replace(/Ç/g, "C")
    .replace(/[^\x20-\x7E]/g, " ");
}

export function generateFallbackVectorPdf(cert: StudentCertificate): Blob {
  const width = 842;
  const height = 595;
  const meta = CEFR_METADATA[cert.level];

  const studentName = cleanTextForPdf(cert.studentName || "Ogrenci");
  const levelTitle = cleanTextForPdf(cert.levelTitle || `CEFR ${cert.level} Language Proficiency`);
  const certId = cleanTextForPdf(cert.id);
  const verifyCode = cleanTextForPdf(cert.verificationCode);
  const issueDate = cleanTextForPdf(cert.issueDate);
  const band = cleanTextForPdf(cert.ieltsBandEquivalent);
  const hash = cleanTextForPdf(cert.verificationHash);
  const grade = cleanTextForPdf(cert.grade);

  const streamLines: string[] = [
    "q",
    "1 1 1 rg 0 0 842 595 re f",
    // Renk şeritleri
    "0.31 0.27 0.90 rg 0 585 842 10 re f",
    "0.92 0.28 0.60 rg 0 580 842 5 re f",
    "0.96 0.62 0.04 rg 0 576 842 4 re f",
    "0.96 0.62 0.04 rg 0 10 842 4 re f",
    "0.92 0.28 0.60 rg 0 6 842 4 re f",
    "0.31 0.27 0.90 rg 0 0 842 6 re f",
    // Çerçeve
    "0.85 0.65 0.13 RG 3 w 25 25 792 545 re S",
    "0.85 0.65 0.13 RG 1 w 30 30 782 535 re S",
    // Başlık
    "BT",
    "/F2 16 Tf 0.1 0.15 0.3 rg 421 530 Td (IELTS AKADEMI PLATFORM) Tj",
    "/F1 9 Tf 0.7 0.45 0.05 rg -35 -14 Td (INTERNATIONAL LANGUAGE ACCREDITATION INSTITUTE - CEFR STANDARDS) Tj",
    "/F1 10 Tf 0.4 0.4 0.4 rg 10 -16 Td (OFFICIAL CERTIFICATE OF LANGUAGE PROFICIENCY) Tj",
    "/F2 22 Tf 0.15 0.15 0.15 rg -45 -26 Td (DIL YETKINLIK VE BITIRME SERTIFIKASI) Tj",
    "/F3 10 Tf 0.3 0.3 0.3 rg -90 -16 Td (Bu belge, CEFR ve Cambridge standartlarinda yetkinligi onaylar.) Tj",
    "ET",
    // Öğrenci Adı
    "0.96 0.62 0.04 RG 1.5 w 221 405 m 621 405 l S",
    "BT",
    "/F1 9 Tf 0.5 0.5 0.5 rg 421 430 Td (BU SERTIFIKA IFTIHARLA TAKDIM EDILIR:) Tj",
    "/F2 26 Tf 0.08 0.1 0.25 rg -80 -20 Td (" + studentName + ") Tj",
    "ET",
    // Seviye Kutusu
    "0.98 0.96 0.90 rg 121 290 600 85 re f",
    "0.96 0.62 0.04 RG 1.5 w 121 290 600 85 re S",
    "BT",
    "/F2 14 Tf 0.85 0.4 0.0 rg 421 350 Td (CEFR " + cert.level + " SEVIYESI - " + levelTitle + ") Tj",
    "/F2 12 Tf 0.1 0.1 0.1 rg -40 -18 Td (Basari Derecesi: " + grade + "  |  IELTS Standardi: " + band + ") Tj",
    "/F1 10 Tf 0.2 0.2 0.2 rg -95 -18 Td (Puan: %" + cert.completionScore + " | Okuma: %" + cert.skillsSummary.reading + " Dinleme: %" + cert.skillsSummary.listening + " Yazma: %" + cert.skillsSummary.writing + " Konusma: %" + cert.skillsSummary.speaking + ") Tj",
    "ET",
    // Doğrulama ve İmzalar
    "BT",
    "/F2 9 Tf 0.2 0.2 0.2 rg 230 200 Td (Resmi Dogrulama Sicili) Tj",
    "/F1 8 Tf 0.35 0.35 0.35 rg 0 -13 Td (Belge No: " + certId + ") Tj",
    "/F1 8 Tf 0.35 0.35 0.35 rg 0 -11 Td (Guvenlik Onay Kodu: " + verifyCode + ") Tj",
    "/F1 8 Tf 0.35 0.35 0.35 rg 0 -11 Td (Duzenlenme Tarihi: " + issueDate + ") Tj",
    "ET",
    "0.6 0.6 0.6 RG 1 w 500 185 m 620 185 l S",
    "0.6 0.6 0.6 RG 1 w 660 185 m 780 185 l S",
    "BT",
    "/F4 12 Tf 0.1 0.1 0.1 rg 520 195 Td (Dr. E. Wright) Tj",
    "/F1 8 Tf 0.4 0.4 0.4 rg -15 -20 Td (Akademik Kurul Baskani) Tj",
    "/F4 12 Tf 0.1 0.1 0.1 rg 165 20 Td (Cambridge Standards) Tj",
    "/F1 8 Tf 0.4 0.4 0.4 rg -20 -20 Td (Sinav Komitesi Baskani) Tj",
    "ET",
    "0.95 0.95 0.95 rg 40 50 762 25 re f",
    "BT",
    "/F1 7.5 Tf 0.3 0.3 0.3 rg 50 63 Td (Kriptografik Dogrulama Hash: " + hash + ") Tj",
    "/F1 7.5 Tf 0.4 0.4 0.4 rg 0 -9 Td (Dogrulama Portali: https://ielts-akademi-platform.vercel.app/sertifika?id=" + certId + ") Tj",
    "ET",
    "Q",
  ];

  const contentStream = streamLines.join("\n");
  const objects: string[] = [];
  const addObj = (data: string): number => {
    objects.push(data);
    return objects.length;
  };

  addObj("<< /Type /Catalog /Pages 2 0 R >>");
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObj(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R /F4 8 0 R >> >> >>`);

  const streamLen = typeof TextEncoder !== "undefined"
    ? new TextEncoder().encode(contentStream).length
    : contentStream.length;
  addObj(`<< /Length ${streamLen} >>\nstream\n${contentStream}\nendstream`);

  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Times-BoldItalic >>");

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const startxref = pdf.length;
  pdf += "xref\n";
  pdf += `0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  pdf += "trailer\n";
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += "startxref\n";
  pdf += `${startxref}\n`;
  pdf += "%%EOF\n";

  return new Blob([pdf], { type: "application/pdf" });
}
