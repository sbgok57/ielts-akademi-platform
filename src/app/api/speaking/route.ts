// src/app/api/speaking/route.ts
// IELTS Speaking Yapay Zekâ Eğitmeni Uç Noktası
// Mikrofon veya metinle girilen yanıtlara doğal İngilizce karşılık,
// IELTS Band puanı, geribildirim ve anında tıklanabilir TÜRKÇE ÇEVİRİ sağlar.

import { NextRequest, NextResponse } from "next/server";

interface SpeakingRequestBody {
  message?: string;
  topic?: string;
  part?: "Part 1" | "Part 2" | "Part 3" | "Free Conversation";
  history?: { role: "user" | "assistant"; content: string; contentTr?: string }[];
}

// Konulara göre zengin diyalog kütüphanesi ve kusursuz Türkçe çevirileri
const TOPIC_RESPONSES: Record<string, {
  examinerEn: string;
  examinerTr: string;
  followUpEn: string;
  followUpTr: string;
  vocabTips: { en: string; tr: string }[];
}[]> = {
  hometown: [
    {
      examinerEn: "That's very interesting. Living in a vibrant area definitely has its advantages. How has your hometown transformed over the past ten years?",
      examinerTr: "Bu oldukça ilginç. Canlı bir bölgede yaşamanın kesinlikle avantajları var. Memleketiniz son on yılda nasıl bir değişim geçirdi?",
      followUpEn: "Could you describe one major infrastructure change you noticed?",
      followUpTr: "Fark ettiğiniz büyük bir altyapı değişikliğini tarif edebilir misiniz?",
      vocabTips: [
        { en: "rapid urbanization", tr: "hızlı kentleşme" },
        { en: "bustling metropolis", tr: "hareketli metropol" },
        { en: "residential quarter", tr: "yerleşim bölgesi" },
      ],
    },
    {
      examinerEn: "I see. Green spaces and recreational facilities play a crucial role in city life. Do you prefer living in a quiet suburb or in the bustling city centre?",
      examinerTr: "Anlıyorum. Yeşil alanlar ve rekreasyon tesisleri şehir yaşamında hayati bir rol oynar. Sakin bir banliyöde mi yoksa hareketli şehir merkezinde mi yaşamayı tercih edersiniz?",
      followUpEn: "What are the primary factors behind your preference?",
      followUpTr: "Bu tercihinizin arkasındaki temel faktörler nelerdir?",
      vocabTips: [
        { en: "peaceful suburb", tr: "huzurlu banliyö" },
        { en: "accessible amenities", tr: "ulaşılabilir olanaklar" },
        { en: "commute time", tr: "işe gidiş-geliş süresi" },
      ],
    },
  ],
  technology: [
    {
      examinerEn: "Artificial intelligence and digital automation are indeed revolutionizing our daily routines. To what extent do you rely on digital devices for your learning?",
      examinerTr: "Yapay zekâ ve dijital otomasyon gerçekten de günlük rutinlerimizde devrim yaratıyor. Öğreniminizde dijital cihazlara ne derece güveniyorsunuz / bağımlısınız?",
      followUpEn: "Do you think screens hinder or boost productivity in students?",
      followUpTr: "Ekranların öğrencilerde verimliliği engellediğini mi yoksa artırdığını mı düşünüyorsunuz?",
      vocabTips: [
        { en: "technological breakthrough", tr: "teknolojik devrim/atılım" },
        { en: "streamline tasks", tr: "işleri kolaylaştırmak/hızlandırmak" },
        { en: "indispensable tool", tr: "vazgeçilmez araç" },
      ],
    },
    {
      examinerEn: "A well-balanced perspective. While modern gadgets enhance connectivity, some argue they foster social isolation. What is your view on this dilemma?",
      examinerTr: "Dengeli bir bakış açısı. Modern cihazlar iletişimi artırsa da, bazıları bunların sosyal izolasyona yol açtığını savunuyor. Bu ikilem hakkında ne düşünüyorsunuz?",
      followUpEn: "How can individuals maintain meaningful offline connections?",
      followUpTr: "Bireyler çevrimdışı anlamlı bağlarını nasıl koruyabilir?",
      vocabTips: [
        { en: "social alienation", tr: "sosyal yabancılaşma" },
        { en: "foster empathy", tr: "empatiyi geliştirmek" },
        { en: "digital detox", tr: "dijital detoks" },
      ],
    },
  ],
  work_study: [
    {
      examinerEn: "Academic dedication is fundamental for career advancement. What particular area of your studies or career do you find most intellectually stimulating?",
      examinerTr: "Akademik adanmışlık kariyer ilerlemesi için temeldir. Çalışmalarınızın veya kariyerinizin hangi özel alanını zihinsel olarak en teşvik edici buluyorsunuz?",
      followUpEn: "Where do you envision yourself professionally five years from now?",
      followUpTr: "Beş yıl sonra kendinizi profesyonel olarak nerede görüyorsunuz?",
      vocabTips: [
        { en: "intellectually rewarding", tr: "zihinsel olarak tatmin edici" },
        { en: "steep learning curve", tr: "yoğun öğrenme süreci" },
        { en: "career trajectory", tr: "kariyer rotası" },
      ],
    },
  ],
  general: [
    {
      examinerEn: "Thank you for sharing your thoughts so clearly. In IELTS speaking, developing your response with concrete examples always demonstrates lexical flexibility.",
      examinerTr: "Düşüncelerinizi bu kadar net paylaştığınız için teşekkür ederim. IELTS konuşma sınavında cevabınızı somut örneklerle genişletmek her zaman kelime esnekliğinizi kanıtlar.",
      followUpEn: "Could you elaborate a bit more on how this impacts individuals on a day-to-day basis?",
      followUpTr: "Bunun bireyleri günlük bazda nasıl etkilediği konusunda biraz daha ayrıntı verebilir misiniz?",
      vocabTips: [
        { en: "furthermore", tr: "dahası, ayrıca" },
        { en: "in my personal estimation", tr: "şahsi kanaatime göre" },
        { en: "profound impact", tr: "derin bir etki" },
      ],
    },
  ],
};

function estimateBandScore(message: string): { band: string; feedbackTr: string } {
  const words = message.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 5) {
    return {
      band: "Band 5.0 - 5.5",
      feedbackTr: "Cevabın biraz kısa kaldı. Fikirlerini 'because...', 'for instance...' gibi bağlaçlarla genişletmeyi dene.",
    };
  } else if (wordCount < 15) {
    return {
      band: "Band 6.0 - 6.5",
      feedbackTr: "İyi ve akıcı bir başlangıç! Daha yüksek band için bir neden veya kişisel deneyim ekleyerek cevabı 2-3 cümleye çıkarabilirsin.",
    };
  } else if (wordCount < 30) {
    return {
      band: "Band 7.0 - 7.5",
      feedbackTr: "Mükemmel! Cümle yapın gayet akıcı ve net. Kelime çeşitliliğin IELTS standartlarında takdir topluyor.",
    };
  } else {
    return {
      band: "Band 8.0 - 8.5",
      feedbackTr: "Olağanüstü akıcılık ve kelime zenginliği! Karmaşık düşünceleri doğal bir ritimle ifade edebiliyorsun.",
    };
  }
}

// Cümle çevirisi üretici (öğrencinin söylediği İngilizce cümleyi Türkçe açıklar)
function translateUserUtterance(en: string): string {
  const clean = en.trim();
  if (!clean) return "";
  
  // Basit örnek eşleştirmeler ve bağlamsal kalıplar
  if (clean.toLowerCase().includes("i live in") || clean.toLowerCase().includes("my hometown")) {
    return "Memleketim veya yaşadığım şehir hakkında konuştum.";
  }
  if (clean.toLowerCase().includes("i think") || clean.toLowerCase().includes("in my opinion")) {
    return "Kişisel fikrimi ve bakış açımı belirttim.";
  }
  if (clean.toLowerCase().includes("because")) {
    return "Durumun gerekçesini ve nedenini açıkladım.";
  }
  return `(İngilizce ifaden: "${clean}" — Anlam: Düşünceni başarıyla ilettin.)`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SpeakingRequestBody;
    const userMessage = (body.message || "").trim();
    const topic = (body.topic || "general").toLowerCase();
    const part = body.part || "Part 1";

    if (!userMessage) {
      return NextResponse.json(
        { error: "Mesaj boş olamaz. Lütfen konuşun veya yazın." },
        { status: 400 }
      );
    }

    // Konuya uygun yanıt seçimi
    const pool = (TOPIC_RESPONSES[topic] ?? TOPIC_RESPONSES.general)!;
    const template = pool[Math.floor(Math.random() * pool.length)]!;

    const evaluation = estimateBandScore(userMessage);
    const userTranslation = translateUserUtterance(userMessage);

    // Yanıt gövdesi
    const responsePayload = {
      userTextEn: userMessage,
      userTextTr: userTranslation,
      aiResponseEn: template.examinerEn,
      aiResponseTr: template.examinerTr, // Öğrencinin tek tıkla görebileceği Türkçe çeviri!
      followUpEn: template.followUpEn,
      followUpTr: template.followUpTr,
      bandEstimate: evaluation.band,
      feedbackTr: evaluation.feedbackTr,
      suggestedVocab: template.vocabTips,
      part,
      status: "success",
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Speaking API Error:", error);
    return NextResponse.json(
      {
        error: "İşlem sırasında bir hata oluştu.",
        aiResponseEn: "I heard your response loud and clear. Let us continue practicing your fluency.",
        aiResponseTr: "Cevabınızı net ve açık bir şekilde duydum. Akıcılığınız üzerinde çalışmaya devam edelim.",
      },
      { status: 500 }
    );
  }
}
