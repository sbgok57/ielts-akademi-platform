# 📌 IELTS AKADEMİ — MİMARİ KARARLAR VE VARSAYIMLAR (ASSUMPTIONS.md)
**Son Güncelleme:** 22 Eylül 2026  
**Referans:** `TEK-KOMUT.md` Bölüm 19 ve Bölüm 28.3

Aşağıdaki kararlar, platform geliştirme sürecini aksatmadan ilerletmek üzere belirlenmiş bağlayıcı varsayımlardır. Gerek duyulduğunda öğretmen/kullanıcı onayı ile güncellenebilir.

---

### Karar 1: Arayüz Dili ve Çok Dillilik
- **Varsayım:** Arayüz dili **Türkçe (TR) birincil**, **İngilizce (EN) ikincil** olarak yapılandırılır (`next-intl` altyapısı).
- **Gerekçe:** Öğrenci kitlesi Türkçe konuşan bireylerdir; bilişsel yükü azaltmak adına yönergeler, taktikler ve geri bildirimler samimi ve cesaret verici bir Türkçe ile sunulur. Kod, değişkenler ve teknik terimler uluslararası standartlarda İngilizce tutulur.

### Karar 2: Ses Üretimi ve İnsan Sesi Sözleşmesi
- **Varsayım:** Sistemde yayınlanan tüm listening ve telaffuz sesleri **`isHuman: true`** şartına tabidir. İlk etapta **120 çekirdek stüdyo kaydı** (Section 1-2 ve AWL kelime setleri) 6 aksan profili üzerinden native speaker seslendirmenlerle sağlanır.
- **Gerekçe:** IELTS dinleme sınavında sentetik/yapay seslerin ritim ve nefes doğallığı sınav gerçekliğini yansıtmaz. Yayın bekleyen içerikler "🎙️ hazırlanıyor" etiketiyle işaretlenir, asla sahte sesle yayınlanmaz.

### Karar 3: Ödeme ve Abonelik Modeli
- **Varsayım:** Başlangıç aşamasında ödeme/abonelik duvarı (paywall) **kapsam dışıdır**; sistem aile içi ve özel ders öğrencileri için tam açık geliştirilir.
- **Gerekçe:** Öncelik P0 kararlılığı, içerik doğruluğu ve öğrenme kalıcılığıdır. Veritabanında Stripe/Iyzico entegrasyonu için gerekli alanlar hazır bırakılacak ancak P0-P10 akışını bloklamayacaktır.

### Karar 4: Deneme Sınavı Ortamı
- **Varsayım:** Deneme sınavları platform içinde özel bir **"Sınav Modu" (CD-IELTS Simülasyonu)** olarak çalıştırılır.
- **Gerekçe:** 2026 itibarıyla IELTS bilgisayar ortamına taşınmıştır. Tarayıcı tabanlı imla denetimi kapatılır, ekran bölmeli (metin solda, sorular sağda) tasarım ve geri sayım kronometresi uygulanır.

### Karar 5: İçerik Üretim Hattı ve Kalite Kapıları
- **Varsayım:** İçerikler toplu halde körü körüne üretilmez; **12 Kalite Kapısı** (Gramer 9 blok, Reading kanıt eşleşmesi, Distractor haritası, CEFR metrikleri) denetim scriptleri ile doğrulanarak yayın onay kuyruğuna alınır.
- **Gerekçe:** IELTS hazırlığında yanlış cevap anahtarı veya hatalı kural öğrencinin sınav başarısını doğrudan riske atar.

### Karar 6: Barındırma ve Veritabanı
- **Varsayım:** PostgreSQL (Supabase / Neon uyumlu) + Prisma ORM + S3/R2 uyumlu medya depolama.
- **Gerekçe:** Yüksek performans, pgvector ile RAG desteği, ilişkilendirilmiş güçlü veri bütünlüğü ve düşük işletme maliyeti sağlar.

### Karar 7: 18 Yaş Altı Öğrenci Verisi ve KVKK
- **Varsayım:** 18 yaş altı kullanıcılar için veli e-posta onayı (`GuardianConsent` tablosu) akışı zorunlu tutulur.
- **Gerekçe:** KVKK ve uluslararası çocuk veri koruma prensiplerine tam uyum.
