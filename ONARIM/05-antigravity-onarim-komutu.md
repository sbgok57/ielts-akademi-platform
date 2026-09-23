# 🛠️ ANTIGRAVITY ONARIM KOMUTU (yapıştırmaya hazır)

Aşağıdaki metnin tamamını Antigravity'ye ver. Amaç: var olan siteyi **bitmiş** hâle getirmek.

---

## GÖREV: Sitedeki 4 kritik kusuru onar

Şu an sitede: (1) sayfalar "yapılmış" görünüyor ama içerik veri katmanına bağlı değil,
(2) bölüm bağlantıları ölü (href="#"), (3) e-posta/şifre ile hesap ve giriş ekranı yok,
(4) görsel/GIF/animasyon dosyaları yok. Aşağıdakileri sırayla uygula, her adımdan sonra raporla.

### 1. Teşhis
- `node TEK-YAMA.mjs --doctor .` çalıştır ve çıkan raporu özetle (hata + uyarı sayısı).
- Sayfa sayısı / API rotası sayısı / animasyon sayısı / giriş sayfası var mı? Bunları raporla.

### 2. Varlıklar
- `node TEK-YAMA.mjs --assets public` çalıştır (10 GIF + 21 SVG, telifsiz, yerel).
- Tüm sayfalardaki dış görsel bağlantılarını kaldır; `src/lib/varlik.ts` içindeki
  `varlik()` fonksiyonuyla yerel yollara bağla. Kırık görsel kalmayacak.
- Rozet kutlaması, seri alevi, dinleme dalgası, zamanlayıcı ve maskot animasyonlarını
  ilgili sayfalara yerleştir.

### 3. Hesap + giriş + korumalı sayfalar
- `ONARIM/02-duzeltme-dosyalari/` içeriğini aynı yollara kopyala: `auth.ts`, `middleware.ts`,
  `app/giris/page.tsx`, `app/kayit/page.tsx`, `app/panel/page.tsx`, `app/cikis/route.ts`,
  `app/api/auth/[...nextauth]/route.ts`, `app/api/kayit/route.ts`, `src/lib/varlik.ts`,
  `components/ModuleGrid.tsx`, `next.config.mjs`.
- Prisma şemasında `User.passwordHash` alanı yoksa ekle; `npx prisma migrate dev --name hesap-sistemi` çalıştır.
- Şifreler bcrypt ile hash'lenmeli; `.env.local` içine `AUTH_SECRET` ve `DATABASE_URL` yaz.

### 4. Ölü bağlantı ve "sahte bitmişlik" temizliği
- Tüm `href="#"` ve boş `href` bağlantılarını gerçek rotalara çevir (`ModuleGrid.tsx` hazır).
- `mockData`, `dummy`, `örnek veri` kalıplarını Prisma sorguları veya `content/*.json` ile değiştir.
- Her bölüm sayfası şunu içermeli: başlık, seviye etiketi, gerçek içerik, en az 1 alıştırma,
  en az 1 animasyon ve "sonraki adım" düğmesi. Aksi hâlde sayfa "taslak" sayılır ve menüde
  "yakında" etiketi görünür — yarım sayfa bitmiş gibi gösterilmez.

### 5. Doğrulama (kanıtla)
- `node TEK-YAMA.mjs --doctor .` → hata sayısı 0 olana kadar düzelt.
- `npm run build` hatasız geçmeli; `npm run dev` ile:
  1) /kayit üzerinden hesap oluştur → 2) çıkış yap → 3) /giris ile gir →
  4) giriş yapmadan /panel ve /bolum/gramer erişiminin **engellendiğini** göster →
  5) bölümlerden birinde soru çöz, XP'nin arttığını göster.
- Raporunda şu tabloyu ver: bölüm | rota var mı | içerik gerçek mi | animasyon var mı | giriş korumalı mı.

Bu 5 adım bitmeden işi "tamamlandı" sayma.
