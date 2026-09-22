# TEK-KOD.mjs — Kullanım

Bu paket, "IELTS Akademi" platformunun `--emit-all` ile dışa aktarılmış dosyalarıdır.

## Üretilenler
- `prisma/schema.prisma` — tam veri modeli
- `prisma/seed-data/badges.json` — **1000 rozet**
- `prisma/seed-data/quotes.json` — **1000 motivasyon sözü** (TR+EN)
- `src/components/BadgeFireworks.tsx` — havai fişekli rozet kutlaması
- `src/components/AccentPlayer.tsx` — 6 aksan × 2 cinsiyet dinleme oynatıcısı (dikte/gölgeleme/sınav modu)
- `src/components/LumiChat.tsx` — sağ altta AI mentor
- `content-samples/*.json` — 9 bloklu gramer dersi, 12 soruluk reading seti, 10 soruluk listening seti, 23 alanlı kelime kayıtları
- `public/lumi/lumi-avatar.svg` — Lumi avatarı

## Seed
```bash
npx prisma migrate dev --name init
npx prisma db seed        # package.json'da: node prisma/seed-data/*.json işleyen script
```
`badges.json` kayıtları `Badge` tablosuna, `quotes.json` kayıtları `Quote` tablosuna yazılır;
kural alanı doğrudan `Badge.condition` (jsonb) olarak kullanılır.

## Not
Motorların (SRS, XP, band dönüşümü, cevap eşleştirici, plan üretici, rozet motoru, CEFR kalibrasyonu)
çalışan referansı `TEK-KOD.mjs` içindedir — Antigravity bunları TypeScript'e taşır.
