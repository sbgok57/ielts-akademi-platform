# 📋 IELTS AKADEMİ — KEŞİF RAPORU (00-KESIF-RAPORU.md)
**Tarih:** 22 Eylül 2026  
**Sürüm:** 1.0.0-p0  
**Hazırlayan:** Antigravity (Kıdemli Full-Stack Mimar & DELTA/CELTA Öğretim Tasarımcısı)

---

## 1. Yönetici Özeti
Bu keşif çalışması; A1 seviyesinden C2 seviyesine kadar uzanan, hem IELTS Academic hem de IELTS General Training modüllerini kapsayan, oyunlaştırılmış ve yapay zekâ destekli **IELTS Akademi** platformunun teknik ve pedagojik temelini atmak amacıyla gerçekleştirilmiştir.

Sistemde bulunan `TEK-KOD.mjs` çekirdek motoru çalıştırılmış; **271 öz-testin 271'i de 0 hata ile (57 ms içinde)** başarıyla geçmiştir. `--emit-all .` komutu ile 26 temel varlık (tam Prisma şeması, 1000 adet rozet tanımı, 1000 adet çift dilli motivasyon sözü, 5 çekirdek UI bileşeni, 10 gerçek içerik seti ve API rotaları) çalışma alanına yazılmıştır.

---

## 2. Ortam ve Altyapı Envanteri

| Bileşen | Tespit Edilen / Hedeflenen Versiyon | Durum |
|---|---|---|
| **Çalışma Ortamı** | macOS Darwin 24.x, Apple Silicon / ZSH | Aktif |
| **Node.js** | v22.23.2 | Uyumlu |
| **Paket Yöneticisi** | npm v10.9.8 | Uyumlu |
| **Web Çatısı** | Next.js 15+ (App Router, Server Actions) | P0 İskeletinde Kuruldu |
| **Dil & Tip Sistemi** | TypeScript 5.5+ (`strict: true`, `noUncheckedIndexedAccess: true`) | Yapılandırıldı |
| **Stil & Tasarım** | Tailwind CSS + CSS Custom Properties (Bölüm 7.1) | Yapılandırıldı |
| **Veritabanı / ORM** | PostgreSQL + Prisma ORM + pgvector | Şema hazır (48 Model) |
| **Yapay Zekâ (AI)** | Lumi (Bağımsız AI Provider katmanı + Golden Set RAG) | Prompt & Altyapı Hazır |

---

## 3. Doğrulanan Çekirdek Motorlar (24 Motor, 271 Test)

1. **SRS Motoru (SM-2 Varyantı):** Kart oluşturma, aralık hesaplama (1, 3, 7, 21 gün), olgunluk (`new`, `learning`, `young`, `mature`) ve günlük yük bütçelemesi.
2. **XP & Seviye & Seri (Streak):** Seviye eğrisi ($100 \times \text{level}^{1.5}$), 10 unvan kademesi, dondurma/kurtarma hakları ve idempotent anahtar mekanizması (`xp:userId:reason:refId`).
3. **Band Dönüşümü & Raporlama:** Listening, Academic Reading ve General Reading için ham puan tablosu (0-40 → 0-9.0 band), yuvarlama kuralları (.25 ve .75 mantığı), One Skill Retake (OSR) tavsiye ağacı.
4. **Akıllı Cevap Eşleştirici:** İngiliz/Amerikan imla varyantları (`colour/color`, `theatre/theater`), rakam-sözcük eşdeğerliği (`two/2`), tarih biçimlendirmeleri, kelime sınırı denetimi (`NO MORE THAN TWO WORDS`), Levenshtein mesafe toleransı (1 harf hatası bildirimi).
5. **Çoktan Seçmeli ve TFNG / YNG:** `TRUE/FALSE/NOT GIVEN` kesinlik eşleştirmesi, kanıt cümlesi doğrulaması ve tuzak analizi.
6. **Adaptif Çalışma Programı (R1–R8):** Pazartesi & Çarşamba canlı ders günleri koruması, CEFR odak süreleri (A1-A2 için max 20 dk bloklar), haftalık deneme zorunluluğu, hafif gün dinlenmesi ve ICS takvim çıktısı.
7. **Motivasyon Sözü Motoru:** 1000 adet TR+EN özgün söz, 10 kategori, deterministik hash ile gün/ziyaret bazlı yenileme.
8. **Rozet Motoru:** 1000 adet rozet (12 aile × 8 metrik × 10 kademe + 40 özel rozet), havai fişek ve GIF kutlama sözleşmesi, canvas paylaşım kartı üretimi.
9. **CEFR Kalibratörü:** Flesch-Kincaid okunabilirlik indeksi, ortalama cümle/kelime uzunluğu ve hece analizi.
10. **İçerik Şema Doğrulayıcıları:** 12 kalite kapısı: Gramer 9 blok zorunluluğu, Reading ≥10 soru + metin içi kanıt eşleşmesi, Listening `isHuman: true` + 6 aksan profili, Vocab 23 alan standardı.

---

## 4. Mevcut Proje ve Dizin İlişkisi

- **Çalışma Alanı:** `/Users/sbgok57/Desktop/Antigravity/Özel Dersler İçin Materyaller`
- **İlişkili Projeler:** Üst dizinde yer alan `antigravity-platform-enterprise` ve `ingilizce-materyaller` yapıları incelenmiştir.
- **Karar:** IELTS platformu; bağımsız, temiz ve taşınabilir bir mimari ile bu dizin altında tam teşekküllü olarak yapılandırılmaktadır. Üst dizindeki paket havuzundan gerek duyulduğunda faydalanılabilir, ancak proje kendi başına derlenebilir ve çalıştırılabilir olacaktır.

---

## 5. P0 İçin Alınan Aksiyonlar

1. `TEK-KOD.mjs` çalıştırıldı, 271/271 test onaylandı.
2. `--emit-all .` ile veri modelleri ve bileşenler projeye aktarıldı.
3. `package.json`, `tsconfig.json` ve `tailwind.config.ts` katı kurallarla hazırlandı.
4. Bölüm 7.1 tasarım token'ları `src/app/globals.css` içerisine eksiksiz işlendi.
5. Aydınlık/Karanlık tema anahtarı (`ThemeToggle.tsx`) ve Lumi baloncuğu (`LumiBubble.tsx`) oluşturuldu.
6. İlk karşılama ekranı (`src/app/page.tsx`) hayata geçirildi.
