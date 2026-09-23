// src/lib/sampleContent.ts
// 12 Modülün gerçek eğitim içerikleri, alıştırmaları ve animasyon eşleşmeleri

export interface GramerItem {
  baslik: string;
  seviye: string;
  kural: string;
  ornek: string[];
  hatalar: string[];
  kritik: string;
}

export interface OkumaMetin {
  baslik: string;
  seviye: string;
  paragraflar: { no: number; metin: string }[];
  sorular: {
    no: number;
    soru: string;
    tur: "TFNG" | "MCQ";
    cevap: string;
    kanit: string;
  }[];
}

export interface KelimeItem {
  kelime: string;
  tr: string;
  orn: string;
  es: string;
  seviye: string;
}

export interface RozetItem {
  id: string;
  ad: string;
  sart: string;
  ikon: string;
}

export const GRAMER_LISTESI: GramerItem[] = [
  {
    baslik: "Present Simple",
    seviye: "A1",
    kural: "Özne + fiil + nesne. He/She/It ile fiile -s eklenir.",
    ornek: ["I work in Bursa.", "She works here.", "They do not work today."],
    hatalar: ["\"She work here\" → \"She works here\" (3. tekil şahısta -s zorunlu)"],
    kritik: "Listening bölümünde geniş zaman ifadeleri (usually, every day) cevabı doğrudan işaret eder.",
  },
  {
    baslik: "Present Perfect",
    seviye: "A2",
    kural: "have/has + V3. Belirli geçmiş zaman ifadesi (yesterday, in 2020) varsa Past Simple kullanılır; belirsiz veya etkisi süren durum için Present Perfect.",
    ornek: ["I have lived here for five years.", "She has already submitted her task."],
    hatalar: ["\"I have seen him yesterday\" → \"I saw him yesterday\" (yesterday ile Present Perfect kullanılmaz)"],
    kritik: "Writing Task 1 grafik anlatımında 'has increased since 2010' yapısı yüksek puan kazandırır.",
  },
  {
    baslik: "Conditionals (Type 2 & 3)",
    seviye: "B2",
    kural: "Type 2: If + Past Simple, would + V1. Type 3: If + Past Perfect, would have + V3.",
    ornek: [
      "If cities planted more trees, temperatures would drop.",
      "If they had insulated the roofs, energy costs would have fallen.",
    ],
    hatalar: ["\"If I would know\" → \"If I knew\" (If cümlesine would gelmez)"],
    kritik: "Speaking Part 3 hipotetik sorularda 'If governments had acted earlier...' yapısı Band 7+ kanıtıdır.",
  },
];

export const OKUMA_VERISI: OkumaMetin = {
  baslik: "Green Roofs in Modern Cities",
  seviye: "B1",
  paragraflar: [
    {
      no: 1,
      metin: "Green roofs are layers of plants grown on top of buildings. They are not a new idea: people have grown plants on roofs for hundreds of years.",
    },
    {
      no: 2,
      metin: "In cities, green roofs cool buildings in summer and keep heat inside during winter. They also slow rainwater, which reduces flooding after heavy storms.",
    },
    {
      no: 3,
      metin: "However, these projects are not cheap. A green roof requires stronger structural support, waterproof barriers, and regular maintenance by specialists.",
    },
    {
      no: 4,
      metin: "Many city planners now offer financial incentives or tax reductions to encourage property owners to install green roofs on commercial towers.",
    },
  ],
  sorular: [
    {
      no: 1,
      soru: "Green roofs were first invented in the twenty-first century.",
      tur: "TFNG",
      cevap: "FALSE",
      kanit: "Paragraf 1: 'They are not a new idea: people have grown plants on roofs for hundreds of years.'",
    },
    {
      no: 2,
      soru: "Green roofs help regulate the internal temperature of buildings.",
      tur: "TFNG",
      cevap: "TRUE",
      kanit: "Paragraf 2: 'green roofs cool buildings in summer and keep heat inside during winter.'",
    },
    {
      no: 3,
      soru: "All property owners receive free government grants for green roofs.",
      tur: "TFNG",
      cevap: "NOT GIVEN",
      kanit: "Paragraf 4 teşviklerden bahseder ancak tüm mülk sahiplerine ücretsiz hibe verildiğini söylemez.",
    },
  ],
};

export const DINLEME_VERISI = {
  baslik: "Kütüphane Kayıt Görüşmesi",
  seviye: "A2",
  not: "Gerçek insan sesi kayıtları (6 aksan × 2 cinsiyet) yerel audio motoruna bağlıdır. Aşağıda transkript ve etkileşimli dikte çalışması yer almaktadır.",
  satirlar: [
    ["Görevli", "Good morning, welcome to the Central Library."],
    ["Öğrenci", "Hello. I would like to register for a library membership."],
    ["Görevli", "Membership is free, but please show your national identity card."],
    ["Görevli", "Standard books can be borrowed for up to three weeks."],
  ],
  soru: {
    soru: "How long can a member borrow a standard book?",
    secenekler: ["One week", "Two weeks", "Three weeks", "One month"],
    cevap: "Three weeks",
  },
};

export const KELIME_LISTESI: KelimeItem[] = [
  { kelime: "mitigate", tr: "hafifletmek, azaltmak", orn: "Governments can mitigate the effects of drought.", es: "alleviate, reduce", seviye: "C1" },
  { kelime: "significant", tr: "önemli, kayda değer", orn: "There was a significant rise in international enrollment.", es: "considerable, notable", seviye: "B2" },
  { kelime: "curriculum", tr: "müfredat", orn: "Critical thinking is an essential part of the modern curriculum.", es: "syllabus", seviye: "B2" },
  { kelime: "sustainable", tr: "sürdürülebilir", orn: "Sustainable development preserves resources for future generations.", es: "viable, renewable", seviye: "B2" },
  { kelime: "prevalent", tr: "yaygın, hâkim", orn: "Remote learning became increasingly prevalent worldwide.", es: "widespread, common", seviye: "C1" },
];

export const KONUSMA_KARTLARI = [
  { kart: "İyi öğrendiğin bir beceriyi anlat (Part 2).", alt: ["Bu beceri nedir?", "Nasıl öğrendin?", "Kim yardım etti?", "Hayatını nasıl değiştirdi?"] },
  { kart: "Son zamanlarda okuduğun etkileyici bir haberi anlat.", alt: ["Ne hakkındaydı?", "Nereden okudun?", "Neden ilgini çekti?", "Kime anlatmak isterdin?"] },
  { kart: "Küçük bir hatadan öğrendiğin önemli bir dersi anlat.", alt: ["Hata neydi?", "Nasıl fark ettin?", "Ne öğrendin?", "Bugün neyi farklı yapıyorsun?"] },
];

export const YAZMA_VERISI = {
  baslik: "Some people believe private cars should be banned from city centres to reduce carbon emissions. To what extent do you agree or disagree?",
  tip: "Task 2 • Opinion Essay",
  minKelime: 250,
  anahtarlar: ["private cars", "city centres", "pedestrian zones", "public transit", "pollution"],
};

export const DENEME_SORULARI = [
  { id: "d1", tip: "Reading", soru: "The passage states green roofs 'slow rainwater'. What is the practical result?", secenekler: ["They prevent all precipitation", "They delay rainwater runoff and prevent sudden flooding", "They store fresh drinking water", "They increase roof temperature"], cevap: "They delay rainwater runoff and prevent sudden flooding", aciklama: "slow = yavaşlatmak → su akışını geciktirerek taşkın riskini azaltır." },
  { id: "d2", tip: "Grammar", soru: "Which sentence is grammatically correct in academic writing?", secenekler: ["If the government would invest, emissions decreased.", "If the government had invested earlier, emissions would have decreased.", "If the government invests, emissions will has decreased.", "If the government invested, emissions will decrease."], cevap: "If the government had invested earlier, emissions would have decreased.", aciklama: "Third conditional: If + Past Perfect, would have + V3." },
];

export const ARSIV_DONEMLERI = [
  { donem: "1989-1994", ozet: "IELTS ilk kez uluslararası ölçekte yürürlüğe girdi; iki genel ve iki akademik alt test uygulandı." },
  { donem: "1995-2000", ozet: "Academic Reading ve Writing tek oturumda birleştirildi; Reading üç uzun akademik metne çıkarıldı." },
  { donem: "2001-2004", ozet: "Günümüzün 3 bölümlü (Part 1, 2, 3) yüz yüze Speaking sınav formatı standartlaştırıldı." },
  { donem: "2005-2020", ozet: "Yarım band (ör. 6.5, 7.5) puanlama ve ayrıntılı 4 ölçütlü değerlendirme rubriği devreye alındı." },
  { donem: "2021-2026", ozet: "Bilgisayarlı IELTS (CDI) ve One Skill Retake (OSR) seçenekleri dünya genelinde aktifleşti." },
];

export const TAKTIKLER = [
  { baslik: "TFNG (True / False / Not Given)", aciklama: "Metinde açıkça söylenmeyen her iddia için NOT GIVEN seçilmelidir. 'Her zaman', 'kesinlikle' gibi aşırı genellemeler çoğunlukla tuzaktır.", sure: "80 sn / soru" },
  { baslik: "Dinleme: Sayı ve Birim Yakalama", aciklama: "Boşluk doldurmadan önce birimi belirleyin (para birimi, saat, yüzdelik). Cevapta para sembolü zaten yazılıysa tekrar £ yazmayın.", sure: "30 sn / soru" },
  { baslik: "Headings (Başlık Eşleştirme)", aciklama: "Yalnızca ilk cümleye değil, paragrafın bütün ana fikrine bakın. Paragraftaki bir kelimenin aynısını içeren başlıklar çoğunlukla çeldiricidir.", sure: "90 sn / soru" },
  { baslik: "Writing Task 1: Overview Zorunluluğu", aciklama: "Genel eğilimi (overall trend) içeren 1-2 cümlelik genel bakış paragrafı yazılmazsa Task Achievement puanı Band 5'i geçemez.", sure: "20 dakika toplam" },
];

export const ROZETLER: RozetItem[] = [
  { id: "b1", ad: "İlk Adım", sart: "İlk oturumunu aç ve platforma katıl", ikon: "rozet-bronze.svg" },
  { id: "b2", ad: "Okuma Kurdu", sart: "İlk okuma setini başarıyla tamamla", ikon: "rozet-silver.svg" },
  { id: "b3", ad: "Seri Başlangıcı", sart: "3 gün kesintisiz çalışma serisi yap", ikon: "rozet-gold.svg" },
  { id: "b4", ad: "Deneme Ustası", sart: "Tam bir deneme sınavını süresi içinde bitir", ikon: "rozet-platinum.svg" },
  { id: "b5", ad: "Kelime Avcısı", sart: "10 yeni akademik kelimeyi ezberine al", ikon: "rozet-gold.svg" },
  { id: "b6", ad: "Akademi Efsanesi", sart: "C2 seviyesine ve Band 8.5 seviyesine ulaş", ikon: "rozet-legendary.svg" },
];

export const MOTIVASYON_SOZLERI = [
  { tr: "Bugün ayırdığın 20 dakika, dün atladığın saatlerden daha değerlidir.", en: "The twenty minutes you spend today matter more than the hours you skipped yesterday." },
  { tr: "Hata yapmaktan korkmadan konuşmak, bilginin kalıcı hafızaya geçmesidir.", en: "Speaking without the fear of mistakes is how memory becomes permanent." },
  { tr: "Kelime öğrenmek bir yarış değil; her gün sağlam bir tuğla koymaktır.", en: "Learning vocabulary is not a race; it is building one brick each day." },
  { tr: "Deneme puanın kimliğin değildir; yalnızca bir sonraki adımın pusulasıdır.", en: "Your mock test score is not your identity; it is only a compass for your next step." },
  { tr: "Küçük ve düzenli adımlar, büyük hayalleri taşır.", en: "Small, consistent steps carry great ambitions." },
  { tr: "Anlamadığın noktayı cesaretle sormak, öğrenmenin en kestirme yoludur.", en: "Asking boldly about what you did not grasp is the shortest path to mastery." },
];
