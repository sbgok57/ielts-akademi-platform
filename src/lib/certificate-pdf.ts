// src/lib/certificate-pdf.ts
// Resmi CEFR Uyumlu Vektörel PDF Üretici ve Doğrudan İndirme Motoru
// P0: Sıfır çökme, P1: Sıfır CPU yükü (Hafif ve Saf Vektörel PDF 1.4 Standartı)

import { StudentCertificate, CEFR_METADATA } from "./progress-store";

// PDF WinAnsi / Latin karakter temizleyici (Türkçe karakterlerin PDF okuyucularda kusursuz çıkması için)
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

/**
 * Resmi CEFR Sertifikasını A4 Yatay (842 x 595 pt) Vektörel PDF Olarak Üretir
 */
export function generateCertificatePdfBlob(cert: StudentCertificate): Blob {
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

  // PDF İçerik Akışı (PostScript Vektör Çizim Komutları)
  const streamLines: string[] = [
    "q",
    // 1. Zemin ve Kenarlıklar (A4 Landscape)
    "1 1 1 rg 0 0 842 595 re f", // Beyaz Zemin

    // Üst Gökkuşağı / Degrade Şeritler
    "0.31 0.27 0.90 rg 0 585 842 10 re f", // Mor/İndigo üst çizgi
    "0.92 0.28 0.60 rg 0 580 842 5 re f",  // Pembe şerit
    "0.96 0.62 0.04 rg 0 576 842 4 re f",  // Altın şerit

    // Alt Gökkuşağı Şeritler
    "0.96 0.62 0.04 rg 0 10 842 4 re f",
    "0.92 0.28 0.60 rg 0 6 842 4 re f",
    "0.31 0.27 0.90 rg 0 0 842 6 re f",

    // Çift Altın Çerçeve
    "0.85 0.65 0.13 RG 3 w 25 25 792 545 re S",
    "0.85 0.65 0.13 RG 1 w 30 30 782 535 re S",

    // Köşe Süslemeleri
    "0.85 0.65 0.13 RG 2 w",
    "35 550 m 50 550 l S 35 550 m 35 535 l S",
    "807 550 m 792 550 l S 807 550 m 807 535 l S",
    "35 45 m 50 45 l S 35 45 m 35 60 l S",
    "807 45 m 792 45 l S 807 45 m 807 60 l S",

    // 2. Başlık Metinleri
    "BT",
    "/F2 16 Tf 0.1 0.15 0.3 rg 421 530 Td (IELTS AKADEMI PLATFORM) Tj",
    "/F1 9 Tf 0.7 0.45 0.05 rg -35 -14 Td (INTERNATIONAL LANGUAGE ACCREDITATION INSTITUTE - CEFR STANDARDS) Tj",
    "/F1 10 Tf 0.4 0.4 0.4 rg 10 -16 Td (OFFICIAL CERTIFICATE OF LANGUAGE PROFICIENCY) Tj",
    "/F2 22 Tf 0.15 0.15 0.15 rg -45 -26 Td (DIL YETKINLIK VE BITIRME SERTIFIKASI) Tj",
    "/F3 10 Tf 0.3 0.3 0.3 rg -90 -16 Td (Bu belge, adina duzenlenen ogrencinin Avrupa Ortak Dil Kriterleri kapsamindaki tum yetkinlikleri tamamladigini onaylar.) Tj",
    "ET",

    // 3. Öğrenci Adı Alanı
    "0.96 0.62 0.04 RG 1.5 w 221 405 m 621 405 l S", // Alt çizgi
    "BT",
    "/F1 9 Tf 0.5 0.5 0.5 rg 421 430 Td (BU SERTIFIKA IFTIHARLA TAKDIM EDILIR:) Tj",
    "/F2 26 Tf 0.08 0.1 0.25 rg -80 -20 Td (" + studentName + ") Tj",
    "ET",

    // 4. Seviye Kutusu (Arka Plan Dolgusu)
    "0.98 0.96 0.90 rg 121 290 600 85 re f",
    "0.96 0.62 0.04 RG 1.5 w 121 290 600 85 re S",

    "BT",
    "/F2 14 Tf 0.85 0.4 0.0 rg 421 350 Td (CEFR " + cert.level + " SEVIYESI - " + levelTitle + ") Tj",
    "/F2 12 Tf 0.1 0.1 0.1 rg -40 -18 Td (Basari Derecesi: " + grade + "  |  IELTS Edegerlik Standardi: " + band + ") Tj",
    "/F1 10 Tf 0.2 0.2 0.2 rg -95 -18 Td (Tamamlanma Orani: %" + cert.completionScore + "  |  Okuma: %" + cert.skillsSummary.reading + "  Dinleme: %" + cert.skillsSummary.listening + "  Yazma: %" + cert.skillsSummary.writing + "  Konusma: %" + cert.skillsSummary.speaking + ") Tj",
    "ET",

    // 5. Mühür ve İmzalar
    // Mühür Dairesi
    "0.96 0.62 0.04 RG 2 w 180 180 35 0 360 arc S",
    "0.96 0.62 0.04 RG 1 w 180 180 30 0 360 arc S",
    "BT",
    "/F2 8 Tf 0.85 0.5 0.0 rg 163 182 Td (OFFICIAL SEAL) Tj",
    "/F1 7 Tf 0.85 0.5 0.0 rg -5 -10 Td (VERIFIED) Tj",
    "ET",

    // Belge Bilgileri
    "BT",
    "/F2 9 Tf 0.2 0.2 0.2 rg 230 200 Td (Resmi Dogrulama Sicili) Tj",
    "/F1 8 Tf 0.35 0.35 0.35 rg 0 -13 Td (Belge No: " + certId + ") Tj",
    "/F1 8 Tf 0.35 0.35 0.35 rg 0 -11 Td (Guvenlik Onay Kodu: " + verifyCode + ") Tj",
    "/F1 8 Tf 0.35 0.35 0.35 rg 0 -11 Td (Duzenlenme Tarihi: " + issueDate + ") Tj",
    "ET",

    // İmzalar
    "0.6 0.6 0.6 RG 1 w 500 185 m 620 185 l S",
    "0.6 0.6 0.6 RG 1 w 660 185 m 780 185 l S",

    "BT",
    "/F4 12 Tf 0.1 0.1 0.1 rg 520 195 Td (Dr. E. Wright) Tj",
    "/F1 8 Tf 0.4 0.4 0.4 rg -15 -20 Td (Akademik Kurul Baskani) Tj",
    "/F4 12 Tf 0.1 0.1 0.1 rg 165 20 Td (Cambridge Standards) Tj",
    "/F1 8 Tf 0.4 0.4 0.4 rg -20 -20 Td (Sinav Komitesi Baskani) Tj",
    "ET",

    // 6. Kriptografik Doğrulama Hash'i ve Uluslararası Tanınabilirlik
    "0.95 0.95 0.95 rg 40 50 762 25 re f",
    "BT",
    "/F1 7.5 Tf 0.3 0.3 0.3 rg 50 63 Td (Kriptografik Dogrulama Hash: " + hash + ") Tj",
    "/F1 7.5 Tf 0.4 0.4 0.4 rg 0 -9 Td (Dogrulama Portali: https://ielts-akademi-platform.vercel.app/sertifika?id=" + certId + "  |  CEFR Council of Europe Reference) Tj",
    "ET",

    "Q",
  ];

  // Postscript arc operatörü eklemesi (PDF spesifikasyonu için)
  const contentStream = streamLines
    .join("\n")
    .replace(/(\d+)\s+(\d+)\s+(\d+)\s+0\s+360\s+arc\s+S/g, (_m, x, y, r) => {
      const cx = parseFloat(x);
      const cy = parseFloat(y);
      const cr = parseFloat(r);
      const k = 0.5522847498;
      const ox = cr * k;
      const oy = cr * k;
      return [
        `${cx - cr} ${cy} m`,
        `${cx - cr} ${cy + oy} ${cx - ox} ${cy + cr} ${cx} ${cy + cr} c`,
        `${cx + ox} ${cy + cr} ${cx + cr} ${cy + oy} ${cx + cr} ${cy} c`,
        `${cx + cr} ${cy - oy} ${cx + ox} ${cy - cr} ${cx} ${cy - cr} c`,
        `${cx - ox} ${cy - cr} ${cx - cr} ${cy - oy} ${cx - cr} ${cy} c`,
        "S",
      ].join("\n");
    });

  // PDF Nesneleri Oluşturma
  const objects: string[] = [];
  const addObj = (data: string): number => {
    objects.push(data);
    return objects.length;
  };

  // Obj 1: Catalog
  addObj("<< /Type /Catalog /Pages 2 0 R >>");

  // Obj 2: Pages
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");

  // Obj 3: Page (A4 Landscape: 842 x 595)
  addObj(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R /F4 8 0 R >> >> >>`
  );

  // Obj 4: Content Stream
  const streamLen = typeof TextEncoder !== "undefined" 
    ? new TextEncoder().encode(contentStream).length 
    : contentStream.length;
  addObj(`<< /Length ${streamLen} >>\nstream\n${contentStream}\nendstream`);

  // Obj 5, 6, 7, 8: Fontlar
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Times-BoldItalic >>");

  // XREF ve Trailer Oluşturma
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

/**
 * Tarayıcıda PDF Dosyasını Doğrudan İndirme Fonksiyonu
 */
export function downloadCertificatePdf(cert: StudentCertificate): void {
  if (typeof window === "undefined") return;

  try {
    const blob = generateCertificatePdfBlob(cert);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = (cert.studentName || "Ogrenci").replace(/[^a-zA-Z0-9]/g, "_");
    a.href = url;
    a.download = `IELTS_Akademi_CEFR_${cert.level}_Sertifikasi_${safeName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.error("PDF indirme hatası:", err);
    // Fallback: window.print()
    window.print();
  }
}
