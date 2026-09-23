# Çalışan demo site (30 saniye)

```bash
node site-demo.mjs
# → http://localhost:3000
```

1. `/kayit` → e-posta + en az 8 karakter şifre ile hesap oluştur.
2. `/panel` → korumalı panel açılır (giriş yapmadan açılmaz, `/giris`e yönlendirir).
3. `/bolum/okuma`, `/bolum/dinleme`, `/bolum/gramer` → soruları çöz, ✅/❌ geri bildirim ve XP kazan.
4. `/varliklar` → 10 GIF + 21 SVG'nin oynadığını gör.
5. `data/` klasörünü silersen tüm hesaplar ve ilerleme sıfırlanır.

Bu dosya; hesap sistemi, oturum çerezi, korumalı sayfalar, animasyonlar ve cevap denetimi
referans uygulamasıdır. Next.js projesine taşırken `TEK-KOMUT.md` P1–P3 fazlarını uygula.