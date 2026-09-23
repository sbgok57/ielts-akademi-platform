# 🔧 SİTE ONARIM KİTİ — önce bunu oku

Bu klasör, "site yapılmış gibi görünüyor ama bölümlere girilmiyor, hesap/giriş yok,
resim-GIF-animasyon yok" sorunlarını **sırayla** çözer. En hızlı yol:

## 1) 30 saniyede çalışan bir site görmek istiyorsan
```bash
node ONARIM/01-canli-site-demo/site-demo.mjs
# → http://localhost:3000  (önce /kayit ile hesap oluştur, sonra bölümlere gir)
```
Bu demo **gerçekten çalışır**: e-posta + şifre ile kayıt, giriş ekranı, HttpOnly oturum çerezi,
korumalı sayfalar, 12 bölüme gerçek giriş, animasyonlar, cevap denetimi, XP ve rozet kaydı.

## 2) Varlıkları (GIF/SVG) projeye koy
```bash
node TEK-YAMA.mjs --assets public          # public/anim (10 GIF) + public/img (21 SVG) üretir
```
Ardından sayfalarda kullan: `<img src="/anim/rozet-havai-fisek.gif" alt="Rozet kutlaması">`

## 3) Hesap + giriş sistemini projeye kopyala
`ONARIM/02-duzeltme-dosyalari/` içindeki dosyaları **aynı yollarına** kopyala:
- `auth.ts` → proje kökü (veya `src/auth.ts`)
- `middleware.ts` → proje kökü (korumalı rotalar)
- `app/giris/page.tsx`, `app/kayit/page.tsx`, `app/panel/page.tsx`, `app/cikis/route.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `src/lib/hesap.ts` (kayıt/giriş mantığı), `src/lib/varlik.ts` (görsel/GIF güvenli gösterim)
- `components/ModuleGrid.tsx` (ölü bağlantıları gerçek rotalara çevirir)
- `next.config.mjs` (güvenlik başlıkları)

## 4) Veritabanını kur
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

## 5) Son kontrol
```bash
node TEK-YAMA.mjs --doctor .        # siteyi tara: ölü bağlantı, hesap, varlık, mock veri
npm run dev                          # aç, /kayit → hesap oluştur → /bolum/gramer → soruları çöz
```

> **Altın kural:** Bir sayfa "var" olması yetmez. Şu 4 soruyu sor: (1) Rotası var mı?
> (2) İçeriği veritabanından/AI'dan mı geliyor? (3) Giriş yapmadan erişilebiliyor mu (olmamalı)?
> (4) Görseli/animasyonu yerel dosyadan mı yükleniyor? Dördü de "evet" değilse sayfa bitmemiştir.
