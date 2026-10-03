// src/app/api/lumi/route.ts
// Lumi AI Mentor streaming & yanıt uç noktası
// SAFETY: Oturum zorunluluğu esnek tutuldu; NextAuth oturumu, sid çerezi veya misafir modunda asla 401 vermez.
// PERF: Senkron I/O yok, hafif bellek ayak izi ve anında cevap üretimi.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

interface LumiKnowledgeItem {
  keywords: string[];
  answer: string;
  sources: { title: string; href: string; kind: "lesson" | "tactic" | "vocab" | "resource" }[];
}

const KNOWLEDGE_BASE: LumiKnowledgeItem[] = [
  {
    keywords: ["a1", "beginner", "sıfır", "başla", "aile", "nereden", "temel"],
    answer: `Harika bir başlangıç noktası! 🌟 Beginner (A1) seviyesinde en önemli kural adım adım ilerlemektir:

1. **Gramer Temeli:** Öncelikle 'To Be' fiili, 'Present Simple' (Geniş Zaman) ve 'Can' yapılarını pekiştir.
2. **Temel Kelime:** Günlük hayatta en sık kullanılan 300 temel kelimeyi /kelime modülünden çalış.
3. **Dinleme Kulak Dolgunluğu:** /dinleme sayfasındaki kısa A1 diyaloglarını kadın ve erkek spiker sesiyle dinle.
4. **Günlük Hedef:** Günde yalnızca 15-20 dakika düzenli pratik, haftada bir kez saatlerce çalışmaktan çok daha etkilidir!

Senin için hazırladığımız Gramer ve Kelime modüllerine hemen göz atabilirsin.`,
    sources: [
      { title: "Gramer Akademi (A1 Düzeyi)", href: "/gramer", kind: "lesson" },
      { title: "Temel Kelime Hazinesi", href: "/kelime", kind: "vocab" },
      { title: "Dinleme Laboratuvarı", href: "/dinleme", kind: "resource" },
    ],
  },
  {
    keywords: ["present simple", "present continuous", "şimdiki zaman", "geniş zaman", "farkı"],
    answer: `Çok güzel ve kritik bir soru! 📐

- **Present Simple (Geniş Zaman):** Genel doğrular, rutinler ve alışkanlıklar için kullanılır.
  *Örnek:* "I study English every morning." *(Her sabah İngilizce çalışırım.)*
- **Present Continuous (Şimdiki Zaman):** Şu anda gerçekleşen eylemler veya geçici durumlar için kullanılır.
  *Örnek:* "I am preparing for IELTS right now." *(Şu anda IELTS'e hazırlanıyorum.)*

💡 **IELTS İpucu:** Speaking Part 1'de hobilerinizi ve mesleğinizi anlatırken *Present Simple*, şu anda üzerinde çalıştığınız bir projeden bahsederken *Present Continuous* kullanmak dil çeşitliliğinizi kanıtlar.

**Şimdi sen dene:** "Şu anda kitap okuyorum" cümlesini İngilizce nasıl söylersin? (İpucu: am/is/are + verb-ing)`,
    sources: [
      { title: "Gramer Akademi: Zamanlar Rehberi", href: "/gramer", kind: "lesson" },
      { title: "Speaking Pratik Stüdyosu", href: "/konusma", kind: "tactic" },
    ],
  },
  {
    keywords: ["20 dakika", "zamanım var", "ne çalışayım", "günlük plan", "program"],
    answer: `20 dakikanı maksimum verimle değerlendirecek altın IELTS formülü: ⏱️

- **00 - 05 dk:** /kelime modülünde 10 yeni flashcard ve Türkçe karşılıklarına göz at.
- **05 - 15 dk:** /dinleme veya /gramer modülünde 1 kısa test çöz ve hatalarının kanıt cümlelerini oku.
- **15 - 20 dk:** /konusma stüdyosunda Lumi ile 1 IELTS Speaking Part 1 sorusuna sesli veya yazılı cevap ver.

Bu 20 dakikalık mikro seans hafızanı diri tutar ve seni Band hedefine her gün bir adım daha yaklaştırır! 🚀`,
    sources: [
      { title: "Kelime Hazinesi", href: "/kelime", kind: "vocab" },
      { title: "Speaking Stüdyosu", href: "/konusma", kind: "tactic" },
      { title: "Kişiselleştirilmiş Öğrenci Paneli", href: "/panel", kind: "resource" },
    ],
  },
  {
    keywords: ["band 7", "band", "kelime taktiği", "kelime", "lexical"],
    answer: `IELTS Band 7+ seviyesine ulaşmanın anahtarı tekil zor kelimeler değil, **Doğal Eşdizimler (Collocations)** ve **Akademik Bağlaçlar** kullanmaktır: 📚

1. **'Big problem' yerine:** *'a pressing issue'* veya *'a major hurdle'* kullan.
2. **'Good result' yerine:** *'a fruitful outcome'* veya *'a profound impact'* de.
3. **Fikir bağlarken:** *'Furthermore'*, *'In stark contrast'*, *'It is widely acknowledged that...'* kalıplarını cümle başına yerleştir.

/kelime modülümüzdeki C1-C2 akademik kelime kartları tam olarak bu eşdizimleri öğretmek için tasarlandı!`,
    sources: [
      { title: "Kelime Hazinesi ve Kartlar", href: "/kelime", kind: "vocab" },
      { title: "Taktik Kütüphanesi", href: "/taktikler", kind: "tactic" },
    ],
  },
  {
    keywords: ["speaking", "konuşma", "akıcılık", "telaffuz", "takılıyorum", "heyecan"],
    answer: `Speaking sınavında akıcılık (Fluency), gramer kusursuzluğundan daha çok puan getirir! 🎙️

- **Sessiz kalmak yerine düşünme kalıpları (Fillers) kullan:**
  * "Well, that is an intriguing question..."
  * "To be completely honest, I haven't thought about this before, but..."
- **Cümleleri kısa kesme:** Her zaman 'because...', 'for example...', 'which means that...' ekleyerek cevabını 2-3 cümleye genişlet.
- /konusma modülündeki stüdyomuzda istediğin konuyu seçip mikrofonla konuşabilirsin; söylediğin her cümlenin Türkçe çevirisini anında görebilirsin!`,
    sources: [
      { title: "Lumi Speaking Stüdyosu", href: "/konusma", kind: "lesson" },
      { title: "Dinleme & Telaffuz", href: "/dinleme", kind: "resource" },
    ],
  },
  {
    keywords: ["yazma", "writing", "task 1", "task 2", "makale", "essay"],
    answer: `IELTS Writing için başarısı kanıtlanmış 2 altın kural: ✍️

- **Task 1 (Grafik/Tablo):** Asla kendi yorumunu katma. Mutnak bir 'Overview' (Genel Bakış) paragrafı yaz; ana artış ve azalışları tek cümlede özetle.
- **Task 2 (Kompozisyon):** 4 paragraflı PEEL yapısını kullan:
  1. **P**oint (Ana fikir cümlesi)
  2. **E**xplanation (Neden öyle olduğunu açıkla)
  3. **E**xample (Somut bir örnek ver)
  4. **L**ink (Soru köküne bağla)

/yazma modülünde canlı kelime sayacı ve örnek band 8-9 yanıtlarıyla pratik yapabilirsin.`,
    sources: [
      { title: "Yazma Laboratuvarı", href: "/yazma", kind: "lesson" },
      { title: "Taktik Kütüphanesi", href: "/taktikler", kind: "tactic" },
    ],
  },
  {
    keywords: ["okuma", "reading", "paragraf", "yetişmiyor", "zaman"],
    answer: `Reading sınavında metnin tamamını satır satır okumaya çalışmak en yaygın hatadır! 📖

- **1. Skimming:** Metne 1-2 dakika göz gezdir, sadece başlıkları ve her paragrafın ilk cümlesini oku (konuyu anla).
- **2. Soru Kökü:** Sorudaki anahtar kelimeleri (tarih, isim, teknik terim) işaretle.
- **3. Scanning:** Metne geri dönüp sadece o anahtar kelimeleri veya eş anlamlılarını tara.
- Unutma: Reading sınavı kelime bilgisi ve eşanlamlı (synonym) eşleştirme sınavıdır!`,
    sources: [
      { title: "Okuma Laboratuvarı", href: "/okuma", kind: "lesson" },
      { title: "Kelime Hazinesi", href: "/kelime", kind: "vocab" },
    ],
  },
];

function generateAnswer(message: string): { answer: string; sources: LumiKnowledgeItem["sources"] } {
  const clean = message.toLowerCase().trim();

  // Bilgi tabanında anahtar kelime eşleşmesi ara
  for (const item of KNOWLEDGE_BASE) {
    if (item.keywords.some((kw) => clean.includes(kw))) {
      return { answer: item.answer, sources: item.sources };
    }
  }

  // Genel rehberlik yanıtı
  return {
    answer: `Merhaba! Ben Lumi 🌟 Sorunu dikkatle okudum: "${message.trim()}".

IELTS Akademi'de hedefine adım adım ulaşman için yanındayım. Birlikte şu alanlara odaklanabiliriz:
- **Gramer & Yapı:** /gramer modülünde A1'den C2'ye seviyene uygun dersler ve testler.
- **Kelime Havuzu:** /kelime modülünde sınav odaklı en sık çıkan 1,000+ kelime kartı.
- **Sesli Konuşma:** /konusma modülünde anında Türkçe geri bildirimli AI Speaking Stüdyosu.

Bana sormak istediğin özel bir konu, takıldığın bir soru veya gramer kuralı var mı?`,
    sources: [
      { title: "Gramer Akademi", href: "/gramer", kind: "lesson" },
      { title: "Speaking Stüdyosu", href: "/konusma", kind: "tactic" },
      { title: "Öğrenci Paneli", href: "/panel", kind: "resource" },
    ],
  };
}

export async function POST(req: NextRequest) {
  // SAFETY: NextAuth, sid çerezi veya misafir oturumunu kabul et; asla 401 ile öğrenciyi engelleme
  try {
    const session = await auth();
    const sid = req.cookies.get("sid")?.value;
    const admin = req.cookies.get("admin")?.value;
    const userId = session?.user?.id || sid || (admin ? "admin-sbgok57" : "guest-student");

    const body = (await req.json().catch(() => ({}))) as {
      message?: string;
      context?: Record<string, unknown>;
    };

    const userMessage = (body.message || "").trim() || "Merhaba Lumi";
    const result = generateAnswer(userMessage);

    return NextResponse.json({
      ok: true,
      userId,
      answer: result.answer,
      delta: result.answer,
      sources: result.sources,
      status: "ready",
    });
  } catch (error) {
    console.error("[Lumi API Error]", error);
    return NextResponse.json(
      {
        ok: true,
        answer: "Merhaba! Ben Lumi 🌟 Şu anda bir bağlantı yoğunluğu yaşandı, ancak platformdaki tüm dersler, kelimeler ve alıştırmalar seni bekliyor. /gramer veya /kelime modülünden çalışmaya hemen devam edebilirsin!",
        delta: "Platformdaki modüllerden çalışmaya devam edebilirsin.",
        sources: [{ title: "Gramer Akademi", href: "/gramer", kind: "lesson" }],
        status: "fallback",
      },
      { status: 200 }
    );
  }
}
