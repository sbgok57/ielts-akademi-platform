# ✅ Dosyalar kök dizine taşındı — artık "dosya bulunamadı" olmayacak

Daha önce dosyalar bir alt klasörün içindeydi (`IELTS-Antigravity/`); görüntüleyici/kopyalama orada takıldıysa artık **hepsi çalışma alanının kökünde**. İçerik aynı, aşağıdaki SHA-256 özetleri dosyaların bozulmadığını kanıtlar.

## 📄 Kök dizindeki dosyalar (kopyalamak için hangisini istersen)

| Dosya | Ne işe yarar | Boyut | sha256 (ilk 12) |
|---|---|---|---|
| **`TEK-KOMUT.md`** | Antigravity'ye **yapıştıracağın tek komut** (29 bölüm). Markdown olarak açılır, doğrudan metin kopyalanabilir. | 124.829 bayt | `5291e2519d27` |
| **`TEK-KOD.txt`** | **Kodun kopyalaması en kolay sürümü** (düz metin). `.mjs` tarayıcıda açılmazsa bunu kullan. | 343.605 bayt | `d8bd71fba6e4` |
| **`TEK-KOD.mjs`** | Aynı kodun **çalıştırılabilir** sürümü (`node TEK-KOD.mjs`). | 343.605 bayt | `d8bd71fba6e4` |
| **`IELTS-TEK-PAKET.zip`** | Dördünü tek dosyada indir (öngörülemeyen tarayıcı sorunlarına karşı en güvenli yol). | 274.365 bayt | `ffea2c8b00e2` |
| `OKU-BENI.md` | Bu dosya. | 5.268 bayt | `f956b407670d` |

> Yedek olarak her şey bir de `IELTS-Antigravity/` klasöründe duruyor (aynı içerik) — istersen oradan da alabilirsin.

---

## ⚡ Kullanım (3 adım)

```bash
# 1) Kod kendini test eder (beklenen: 271 geçti / 0 başarısız, çıkış kodu 0)
node TEK-KOD.mjs

# 2) Şema + bileşenler + API rotaları + 10 örnek içerik + 1000'lik seed dosyaları projeye yazılır
node TEK-KOD.mjs --emit-all .

# 3) TEK-KOMUT.md'nin TAMAMINI Antigravity'ye yapıştır
#    → P0'ı bitirir, Bölüm 17 formatında raporlar ve DURUR.
```

### Diğer komutlar
```bash
node TEK-KOD.mjs --self-test-full   # testlerin JSON çıktısı (CI; hata varsa çıkış kodu 1)
node TEK-KOD.mjs --coverage         # bağlayıcı içerik sayıları raporu
node TEK-KOD.mjs --placement-demo   # yerleştirme: CEFR + band tahmini + ilk hafta planı
node TEK-KOD.mjs --plan-demo        # doğal dilden program + R1–R8 denetimi
node TEK-KOD.mjs --eras             # 1989→2026 arşiv dönemleri
node TEK-KOD.mjs --lumi-demo        # Lumi tam istemi + çıktı denetimi
node TEK-KOD.mjs --emit-ui DIZIN    # yalnız 5 UI bileşeni
node TEK-KOD.mjs --emit-api DIZIN   # API rotaları, kütüphaneler, seed betiği
node TEK-KOD.mjs --json             # özet istatistikler
```

---

## 🔍 Sorun devam ederse (30 saniyelik çözümler)

1. **Kopyalarken takılırsan:** `TEK-KOD.txt` dosyasını aç (düz metin olduğu için görüntüleyici sorun çıkarmaz) ve "tümünü seç → kopyala" yap.
2. **Çok uzun metinde tarayıcı kasıyorsa:** `IELTS-TEK-PAKET.zip` dosyasını indirip bilgisayarında aç — dosyalar oradan da kopyalanabilir.
3. **Uzantı engelleniyorsa:** `TEK-KOD.txt` → kendi dosyanda içeriği yapıştırıp adını `TEK-KOD.mjs` yap; içerik birebir aynıdır (sha256 eşit).
4. **Dosya adını bilgisayarında değiştirirken:** Türkçe karakter kullanma; `TEK-KOMUT.md` ve `TEK-KOD.mjs` adlarını koru (Antigravity bölüm 20'de bu adları arıyor).

---

## 📦 Bu pakette ne var?

- **`TEK-KOMUT.md` (29 bölüm):** protokol · M0–M17 modülleri · teknik yığın · veri modeli · içerik üretim hattı + 12 kalite kapısı · gerçek insan sesli 6 aksan sistemi · light/dark capcanlı tasarım · ton · hesaplar · erişilebilirlik · öğrenme bilimi · Lumi altyapısı · telif + 1989→2026 arşivi + KVKK · rozet/söz sözleşmesi · P0→P10 faz planı · kabul kriterleri · 7 karar · **280 gramer konusunun tam listesi** · **soru tipi mekaniği kitapçığı** · **band tabloları + OSR karar ağacı** · **1000 rozetin tam sözleşmesi** · **Lumi'nin tam sistem istemi ve hata protokolü** · **faz faz dosya teslim listesi** · sözlük/SSS
- **`TEK-KOD.mjs` (24 motor + 271 öz-test):** SRS, XP/seviye/seri, band dönüşümü, cevap eşleştirici, program üretici (R1–R8 + TR doğal dil), söz motoru, rozet motoru, CEFR kalibrasyonu, şema doğrulayıcıları, yerleştirme, yazma/konuşma değerlendirici, görev üretici, hata günlüğü, seri takvimi, Lumi istem+denetim, kapsam raporu, arşiv dönemleri, KVKK dışa aktarma + 14 gömülü kaynak dosyası + 10 içerik örneği.
