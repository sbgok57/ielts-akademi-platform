# 🎓 IELTS Akademi — (A1→C2 + IELTS Tam Platform)

IELTS Akademi; öğrencilerin A1 başlangıç seviyesinden C2 ileri düzeyine kadar adım adım ilerlemelerini sağlayan, IELTS Academic & General Training odaklı, modern, capcanlı tasarımlı ve yapay zekâ destekli (Lumi) eğitim platformudur.

---

## ⚡ Hızlı Başlangıç

### 1. Gereksinimler
- Node.js 18+ (Önerilen: v22.x)
- npm 10+
- PostgreSQL (yerel veya uzaktan bağlantı)

### 2. Kurulum
```bash
# Bağımlılıkları yükleyin
npm install

# Veritabanı şemasını oluşturun
npx prisma generate
# npx prisma migrate dev --name init (PostgreSQL bağlantısı sağlandığında)

# Geliştirme sunucusunu başlatın
npm run dev
```

### 3. Çekirdek Motorlar ve Öz-Testler
Sistem içinde yer alan 24 kod motoru ve 271 öz-testi çalıştırmak için:
```bash
node TEK-KOD.mjs                # Tüm öz-testleri koşturur
node TEK-KOD.mjs --coverage     # İçerik kapsam raporunu döker
node TEK-KOD.mjs --plan-demo    # Doğal dil programlama motorunu gösterir
node TEK-KOD.mjs --lumi-demo    # Lumi AI prompt ve çıktı denetimini test eder
```

---

## 📐 Mimari ve Tasarım
- **Front-end:** Next.js 15+ (App Router), React, TypeScript Strict (`noUncheckedIndexedAccess`).
- **Stil & Tema:** Tailwind CSS + CSS Custom Properties (`--brand-1` .. `--brand-6`), WCAG 2.2 AA kontrast ve anında light/dark geçişi.
- **Veri Modeli:** Prisma ORM, 48 model, pgvector desteği.
- **AI Mentor:** Lumi (`src/components/LumiChat.tsx`), RAG tabanlı kaynaklı doğruluk protokolü.
