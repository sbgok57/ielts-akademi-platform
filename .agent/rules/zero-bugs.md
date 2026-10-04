# Kural: Sıfır Hata ve Otomatik Doğrulama Protokolü (Zero-Bugs Protocol)

Yapay zeka ajanı olarak her komutta veya kod üretiminde aşağıdaki döngüyü eksiksiz uygulamakla yükümlüsün:

1. **Önce Analiz Et:** Kod yazmadan veya değiştirmeden önce mevcut mimariyi, bağımlılıkları ve olası tip/mantık çakışmalarını incele.
2. **Kendi Kendini Test Et (Self-Correction):** Kodlama bittikten sonra terminali kullanarak `npx tsc --noEmit` ve `npm run build` testlerini çalıştır.
3. **Hata Yakalama Döngüsü:** Eğer yazdığın kodda bir syntax hatası, tip uyuşmazlığı (type error) veya mantıksal açık çıkarsa, kullanıcıya bildirmeden ve manuel müdahaleye gerek bırakmadan **hatayı kendi kendine analiz et ve hemen düzelt**.
4. **Doğrulama ve Yayın Güvencesi:** Kodun tamamen hatasız çalıştığından emin olduktan sonra, yapılan değişikliklerin özetini sun ve canlı yayını gerçekleştir. Asla test edilmemiş veya hata potansiyeli olan kırık kod teslim etme.
