# 🗺️ IELTS AKADEMİ — 11 FAZLIK YOL HARİTASI (00-YOL-HARITASI.md)
**Hedef:** A1'den C2'ye + IELTS Tam Platform (29 Bölüm, 17 Modül, 24 Motor)  
**Protokol:** Her faz sonunda DUR → Bölüm 17 Raporu Sun → Onay Bekle.

---

## Faz Planı ve Kilometre Taşları

### 🏁 P0 — İskelet, Tasarım Sistemi ve Hazırlık (ŞU ANKİ FAZ)
- [x] `TEK-KOD.mjs` 271/271 öz-test doğrulaması
- [x] `TEK-KOD.mjs --emit-all .` ile veri modelleri, seed dosyaları ve gömülü bileşenlerin çıkarılması
- [x] Keşif Raporu (`docs/00-KESIF-RAPORU.md`) ve Yol Haritası (`docs/00-YOL-HARITASI.md`)
- [x] Karar ve varsayımlar belgesi (`ASSUMPTIONS.md`)
- [x] Next.js 15+ + TypeScript Strict + Tailwind CSS (Bölüm 7.1 CSS değişken token'ları)
- [x] Prisma ORM singleton ve PostgreSQL şeması
- [x] Canlı karşılama ekranı (`page.tsx`), ThemeToggle (light/dark) ve LumiBubble entegrasyonu
- [x] `npm run typecheck`, `npm run dev` yeşil durumu

---

### 🔑 P1 — Kimlik, Hesaplar, Onboarding ve Yerleştirme Sınavı (M0)
- **Kapsam:** Auth.js v5 Credentials (`email`/`username` + `argon2id`), JWT + oturum yönetimi, şifre sıfırlama, rate limiting.
- **Onboarding:** 5 adımlı hedef belirleme, avatar seçimi, CEFR ve hedef band (Academic / General) ayarı, KVKK / Veli onayı.
- **Placement Engine:** 40 soruluk adaptif yerleştirme testi (Grammar, Vocab, Reading, Listening), beceri haritası ve tahmini başlangıç bandı.
- **Çıktı:** Kişiselleştirilmiş ilk hafta çalışma programı.

---

### 🧩 P2 — Grammar Academy ve Taktik Kütüphanesi (M1, M10)
- **Kapsam:** 9 bloklu `LessonRenderer` şablonu (Kanca, Sezgi/Metafor, Kural Tablosu, Animasyonlu Örnekler, ⚠️ Kritik Detay, 🇹🇷 Klasik Hatalar, 8-15 soruluk Mikro Test, IELTS Taktikleri, SRS Kalıcılık).
- **İçerik:** A1 40 konu + A2 45 konu tam doldurma; B1 55 konu pipeline.
- **Taktikler:** Beceri başına ≥25 taktik makalesi (`tactic_lesson` çapraz bağlantıları).
- **SRS SM-2:** Gramer kartlarının tekrar kuyruğuna aktarımı ve günlük tekrar ekranı.

---

### 📚 P3 — Vocabulary Vault (Kelime Kasası - M6)
- **Kapsam:** 23 alanlı tam kelime şeması (IPA, CEFR, collocation, aile ağacı, TR/EN tanımlar, görsel/lottie, 2 aksanlı ses kaydı, mnemonik, tuzak analizleri).
- **İçerik:** AWL Sublists + Oxford 3000/5000 ilk 1200 kelime tam içerik (5000 pipeline).
- **Etkileşim:** 8 quiz tipi, kart çevirme, Kelime Arena, "Kesem" sözlüğü.

---

### 🎮 P4 — Oyunlaştırma, 1000 Rozet, 1000 Söz ve Lumi Altyapısı (M11, M13, M15)
- **Oyunlaştırma:** İdempotent XP motoru, 10 seviye unvanı, dondurma ve kurtarma haklı seri (streak) takvimi.
- **1000 Rozet:** 12 aile × 8 metrik × 10 kademe + 40 özel rozet. Havai fişek + konfeti partikül motoru (`BadgeFireworks.tsx`), 1080x1080 sosyal paylaşım kartı üreticisi, vitrin paneli.
- **1000 Motivasyon Sözü:** Günlük ve ziyaret bazlı deterministik hash seçici, favorileme, sesli okuma.
- **Lumi AI Mentor:** Sağ altta sabit / sürüklenebilir `LumiChat.tsx`, ⌘K kısayolu, streaming API, 10 maddelik hata protokolü, 300 soruluk Golden Set RAG doğrulaması (%95 eşik).

---

### 📖 P5 — Reading Lab ve Bilim Kütüphanesi (M2, M9)
- **Reading:** 13 IELTS okuma soru tipi (MCQ, TFNG, YNG, Headings, Sentence Completion vb.), metin içi birebir kanıt vurgulama, skimming cetveli.
- **İçerik:** A1 (40), A2 (50), B1 (40) toplam 130 set yayında.
- **Bilim Kütüphanesi:** 14 alan, A1→C2 aralığında bilimsel metinler, terim kartları, dinle-oku modu ve konuşma/yazma bağlantı soruları.

---

### 🎧 P6 — Listening Lab ve Ses Altyapısı (M3, Bölüm 6)
- **Ses Sözleşmesi:** `isHuman: true` gerçek insan ses kayıtları (sentetik ses yayında yasak).
- **6 Aksan × 2 Cinsiyet:** en-GB, en-US, en-CA, en-AU, en-NZ, en-IN profilleri.
- **AccentPlayer:** Dikte modu, gölgeleme (shadowing), A-B tekrarı, karaoke transkript, canlı ses dalgası (Web Audio API), veri tasarrufu modu ve Sınav Modu (tek dinleme).
- **İçerik:** Section 1–4 formatlarında 110 set ve 120 çekirdek stüdyo kaydı.

---

### ✍️ P7 — Writing & Speaking Akademi (M4, M5)
- **Writing:** Task 1 (grafik/süreç/harita) & Task 2 (makale) motoru, kelime sayacı, süre tutucu, 4 ölçütlü (TR/TA, CC, LR, GRA) rubric değerlendirmesi ve model metinler.
- **Speaking:** Part 1, 2 (Cue Card 1 dk hazırlık + 2 dk konuşma) ve Part 3 simülatörü, ses kayıt, WPM/akıcılık analizi, insan değerlendirme yönlendirmesi.

---

### 🎯 P8 — Deneme Sınavı Motoru ve Tarihî Arşiv (M7, M8)
- **CD-IELTS Simülasyonu:** 2026 sınav gerçekliği (bölünmüş ekran, süre sayacı, kağıt aktarma süresi yok, klavye kısayolları).
- **Puanlama & OSR:** Band dönüşüm tabloları, hata analizi, One Skill Retake karar ağacı.
- **Tarihî Arşiv (1989→2026):** 9 dönem kartı, interaktif zaman çizelgesi, format değişim analizleri, özgün dönem mock'ları ve resmî telif beyanları.

---

### 📅 P9 — Kişisel Çalışma Programı ve Öğretmen/Veli Paneli (M12, M14)
- **Program:** R1–R8 kuralları denetimli haftalık adaptif takvim, Pazartesi/Çarşamba canlı ders ısınma entegrasyonu, ICS takvim ihracı.
- **Doğal Dil Programlama:** "Günde 25 dk, okuma ağırlıklı, pazar tatil" metnini programa dönüştürme.
- **Paneller:** Öğretmen ödev atama, öğrenci hata günlüğü izleme, veli özet ekranı ve davet kodu sistemi.

---

### 🚀 P10 — Cila, PWA Offline, A11y, Güvenlik ve Yayın
- **PWA & Offline:** Service Worker, manifest, IndexedDB olay kuyruğu ile çevrimdışı XP/rozet senkronizasyonu.
- **Erişilebilirlik (A11y):** WCAG 2.2 AA tam uyum, klavye ile uçtan uca navigasyon, metin boyutu seçici, `prefers-reduced-motion`.
- **Performans:** Lighthouse mobil ≥90/95 skorları, LCP < 2.0s, bundle optimizasyonu.
- **KVKK & Güvenlik:** Veri indirme/silme API'leri, prompt-injection koruması, yayın öncesi 12 kapı denetim raporu.
