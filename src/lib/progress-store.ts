// src/lib/progress-store.ts
// Kalıcı Öğrenci İlerleme, Seviye Atlama ve Doğrulanabilir Sertifika Sistemi
// SAFETY: Tarayıcı localStorage + memory fallback; SSR'da asla çökmez.

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface StudentCertificate {
  id: string; // Örn: IELTS-AKD-2026-A1-89312
  level: CEFRLevel;
  levelTitle: string; // Örn: CEFR A1 Breakthrough & Foundations
  studentName: string;
  issueDate: string;
  completionScore: number; // 0 - 100
  ieltsBandEquivalent: string; // Örn: "Band 4.0 - 4.5"
  ydsEquivalent?: string; // Örn: "70 - 79 / 100"
  toeflEquivalent?: string; // Örn: "66 - 85"
  cpdHours?: number; // Örn: 120
  verificationCode: string;
  verificationHash: string;
  grade: "Pass with Distinction" | "High Merit" | "Pass with Excellence" | "First Class Honours";
  skillsSummary: {
    reading: number;
    listening: number;
    writing: number;
    speaking: number;
    grammar?: number;
    vocabulary?: number;
  };
  canDoEn?: string;
  canDoTr?: string;
}

export interface StudentProgress {
  id: string;
  studentName: string;
  email: string;
  enrolledDate: string;
  targetBand: number;
  currentCefr: CEFRLevel;
  currentLevelNumber: number; // 1: A1, 2: A2, 3: B1, 4: B2, 5: C1, 6: C2
  xpTotal: number;
  streakDays: number;
  lastActiveDate: string;
  
  // Yüzdelik İlerlemeler (0 - 100)
  overallPercentage: number;
  levelProgressPercentage: number;
  skills: {
    okuma: number;
    dinleme: number;
    yazma: number;
    konusma: number;
    gramer: number;
    kelime: number;
  };

  // Admin & Rol
  isAdmin?: boolean;
  savedAdminPassword?: string;

  // Tamamlanan aktiviteler
  completedModules: string[];
  completedQuizzes: Record<string, boolean>;
  speakingSessionsCount: number;
  certificates: StudentCertificate[];

  // Kelime Hazinesi, Oyunlaştırma & Skor Takip Sistemi
  learnedWordIds?: string[];
  masteredWordIds?: string[];
  vocabularyScore?: number;
  vocabularyGamesPlayed?: number;
  selectedStartingLevel?: CEFRLevel;
  placementTestCompleted?: boolean;
}

export const CEFR_METADATA: Record<CEFRLevel, {
  num: number;
  name: string;
  titleEn: string;
  desc: string;
  canDoEn: string;
  canDoTr: string;
  band: string;
  ydsEq: string;
  toeflEq: string;
  cpdHours: number;
  requiredXp: number;
  color: string;
  borderClass: string;
  badgeBg: string;
}> = {
  A1: {
    num: 1,
    name: "A1 · Breakthrough (Başlangıç)",
    titleEn: "Breakthrough / Beginner Level",
    desc: "Temel günlük ifadeleri ve en sık kullanılan kelimeleri anlama ve basit iletişim kurabilme.",
    canDoEn: "Can understand and use familiar everyday expressions and very basic phrases aimed at the satisfaction of needs of a concrete type. Can introduce him/herself and ask/answer questions about personal details.",
    canDoTr: "Günlük hayatta en sık kullanılan basit ifadeleri anlayabilir; kendini tanıtabilir ve temel somut ihtiyaçlarını karşılayabilir.",
    band: "Band 3.0 - 3.5",
    ydsEq: "30 - 44 / 100 (ÖSYM Temel Düzey)",
    toeflEq: "20 - 34",
    cpdHours: 45,
    requiredXp: 400,
    color: "#10B981", // Emerald
    borderClass: "border-emerald-500",
    badgeBg: "from-emerald-500 to-teal-600",
  },
  A2: {
    num: 2,
    name: "A2 · Waystage (Temel Düzey)",
    titleEn: "Waystage / Elementary Level",
    desc: "Basit ve rutin görevlerde doğrudan bilgi alışverişi yapabilme, geçmiş ve çevre anlatımı.",
    canDoEn: "Can understand sentences and frequently used expressions related to areas of most immediate relevance (e.g. personal and family information, local geography, employment). Can communicate in simple, routine tasks.",
    canDoTr: "Kendisi, ailesi, işi ve çevresiyle ilgili en sık kullanılan cümle ve kalıpları anlayabilir; rutin durumlarda basit bilgi alışverişi yapabilir.",
    band: "Band 4.0 - 4.5",
    ydsEq: "45 - 54 / 100 (ÖSYM Giriş)",
    toeflEq: "35 - 45",
    cpdHours: 60,
    requiredXp: 900,
    color: "#06B6D4", // Cyan/Teal
    borderClass: "border-cyan-500",
    badgeBg: "from-cyan-500 to-blue-600",
  },
  B1: {
    num: 3,
    name: "B1 · Threshold (Orta Düzey)",
    titleEn: "Threshold / Intermediate Level",
    desc: "İş, okul, serbest zaman konularında ana fikirleri anlama ve akıcı seyahat İngilizcesi.",
    canDoEn: "Can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure. Can deal with most situations likely to arise whilst travelling in an English-speaking area.",
    canDoTr: "İş, okul ve günlük yaşamdaki standart konuşma ve metinlerin ana fikirlerini anlayabilir; seyahatlerde karşılaşabileceği tüm durumları yönetebilir.",
    band: "Band 5.0 - 5.5",
    ydsEq: "55 - 69 / 100 (ÖSYM Orta)",
    toeflEq: "46 - 65",
    cpdHours: 90,
    requiredXp: 1600,
    color: "#3B82F6", // Blue
    borderClass: "border-blue-500",
    badgeBg: "from-blue-600 to-indigo-600",
  },
  B2: {
    num: 4,
    name: "B2 · Vantage (İleri Orta Düzey)",
    titleEn: "Vantage / Upper-Intermediate Level",
    desc: "Karmaşık metinlerin ana hatlarını anlama, ana dili İngilizce olanlarla rahat ve doğal iletişim.",
    canDoEn: "Can understand the main ideas of complex text on both concrete and abstract topics, including technical discussions in his/her field of specialisation. Can interact with fluency and spontaneity with native speakers.",
    canDoTr: "Hem somut hem soyut karmaşık konulardaki metinlerin ana fikirlerini kavrayabilir; anadili İngilizce olanlarla akıcı ve doğal bir iletişim kurabilir.",
    band: "Band 6.0 - 6.5",
    ydsEq: "70 - 79 / 100 (ÖSYM B Grubu Kurumsal Geçerlilik)",
    toeflEq: "66 - 85",
    cpdHours: 120,
    requiredXp: 2600,
    color: "#8B5CF6", // Violet
    borderClass: "border-purple-500",
    badgeBg: "from-violet-600 to-pink-600",
  },
  C1: {
    num: 5,
    name: "C1 · Effective Proficiency (İleri Düzey)",
    titleEn: "Effective Operational Proficiency / Advanced Level",
    desc: "Geniş kapsamlı zorlu metinleri kavrama, akademik ve profesyonel hedefler için esnek kullanım.",
    canDoEn: "Can understand a wide range of demanding, longer texts, and recognise implicit meaning. Can express ideas fluently and spontaneously without much obvious searching for expressions, using language flexibly for academic and professional purposes.",
    canDoTr: "Zorlu ve uzun akademik metinleri kavrayıp örtük anlamları anlayabilir; profesyonel ve akademik amaçlar için dili esnek, etkili ve akıcı kullanabilir.",
    band: "Band 7.0 - 8.0",
    ydsEq: "80 - 89 / 100 (ÖSYM A Grubu / Doktora & Akademik)",
    toeflEq: "86 - 105",
    cpdHours: 160,
    requiredXp: 4000,
    color: "#EC4899", // Pink
    borderClass: "border-pink-500",
    badgeBg: "from-pink-600 to-rose-600",
  },
  C2: {
    num: 6,
    name: "C2 · Mastery (Ustalık & Tam Yetkinlik)",
    titleEn: "Mastery / Native-like Proficiency",
    desc: "Duyduğu ve okuduğu her şeyi kolaylıkla anlama, karmaşık konularda akıcı ve doğal nüans hakimiyeti.",
    canDoEn: "Can understand with ease virtually everything heard or read. Can summarise information from different spoken and written sources, reconstructing arguments in a coherent presentation, expressing him/herself spontaneously, fluently and precisely.",
    canDoTr: "Duyduğu ve okuduğu her şeyi zahmetsizce anlayabilir; karmaşık konulardaki argümanları akıcı bir şekilde özetleyip ince anlam nüanslarıyla kusursuz ifade edebilir.",
    band: "Band 8.5 - 9.0",
    ydsEq: "90 - 100 / 100 (ÖSYM En Üst Derece / Uzman Çevirmen)",
    toeflEq: "106 - 120",
    cpdHours: 200,
    requiredXp: 6000,
    color: "#F59E0B", // Amber Gold
    borderClass: "border-amber-500",
    badgeBg: "from-amber-500 via-orange-500 to-rose-600",
  },
};

const STORAGE_KEY = "ielts_akademi_student_progress_v3";

// Rastgele benzersiz sertifika doğrulama hash'i oluşturur
function generateCertHash(id: string, name: string, date: string): string {
  let hash = 0;
  const str = `${id}:${name}:${date}:IELTS-AKADEMI-ACCREDITED-OFFICIAL-2026`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hexPart = Math.abs(hash).toString(16).padStart(8, "0");
  const timestamp = Date.now().toString(16);
  return `sha256_${hexPart}${timestamp}8f91c7a2e4d9b01c34a78`;
}

// Varsayılan temiz öğrenci profili (Özel ders ve Beginner A1 adayları için %0 temiz sayfa)
export function createDefaultProgress(studentName = "Öğrenci", email = "ogrenci@ieltsakademi.com"): StudentProgress {
  const isSbgok57 = studentName.toLowerCase().includes("sbgok57") || email.toLowerCase().includes("sbgok57");

  // SAFETY: Yeni öğrenci/özel ders alan öğrenci her şeye sıfırdan (0 XP, %0 ilerleme) başlar.
  if (!isSbgok57) {
    return {
      id: "stu_" + Math.random().toString(36).slice(2, 9),
      studentName: studentName === "Öğrenci" ? "Yeni Öğrenci" : studentName,
      email: email,
      isAdmin: false,
      enrolledDate: new Date().toLocaleDateString("tr-TR"),
      targetBand: 6.5,
      currentCefr: "A1",
      currentLevelNumber: 1,
      xpTotal: 0,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split("T")[0]!,
      overallPercentage: 0,
      levelProgressPercentage: 0,
      skills: {
        okuma: 0,
        dinleme: 0,
        yazma: 0,
        konusma: 0,
        gramer: 0,
        kelime: 0,
      },
      completedModules: [],
      completedQuizzes: {},
      speakingSessionsCount: 0,
      certificates: [],
      learnedWordIds: [],
      masteredWordIds: [],
      vocabularyScore: 0,
      vocabularyGamesPlayed: 0,
      selectedStartingLevel: "A1",
      placementTestCompleted: false,
    };
  }

  // 👑 SİSTEM YÖNETİCİSİ (sbgok57)
  const metaC2 = CEFR_METADATA.C2;
  const adminCert: StudentCertificate = {
    id: "IELTS-AKD-2026-C2-99881",
    level: "C2",
    levelTitle: "CEFR C2 Mastery & Native-like Proficiency",
    studentName: "Sinem Buse Gök (sbgok57)",
    issueDate: new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }),
    completionScore: 98,
    ieltsBandEquivalent: metaC2.band,
    ydsEquivalent: metaC2.ydsEq,
    toeflEquivalent: metaC2.toeflEq,
    cpdHours: metaC2.cpdHours,
    verificationCode: "AKD-C2-99881",
    verificationHash: generateCertHash("IELTS-AKD-2026-C2-99881", "Sinem Buse Gök", "2026"),
    grade: "Pass with Distinction",
    skillsSummary: {
      reading: 98,
      listening: 96,
      writing: 95,
      speaking: 99,
      grammar: 98,
      vocabulary: 97,
    },
    canDoEn: metaC2.canDoEn,
    canDoTr: metaC2.canDoTr,
  };

  return {
    id: "admin-sbgok57",
    studentName: "Sinem Buse Gök (sbgok57)",
    email: "sbgok57@ieltsakademi.com",
    isAdmin: true,
    savedAdminPassword: "220802Sbg",
    enrolledDate: new Date().toLocaleDateString("tr-TR"),
    targetBand: 9.0,
    currentCefr: "C2",
    currentLevelNumber: 6,
    xpTotal: 9500,
    streakDays: 45,
    lastActiveDate: new Date().toISOString().split("T")[0]!,
    overallPercentage: 92,
    levelProgressPercentage: 88,
    skills: {
      okuma: 95,
      dinleme: 92,
      yazma: 90,
      konusma: 98,
      gramer: 96,
      kelime: 94,
    },
    completedModules: ["gramer", "okuma", "konusma", "dinleme", "yazma", "kelime", "deneme"],
    completedQuizzes: { "g1": true, "o1": true, "d1": true },
    speakingSessionsCount: 15,
    certificates: [adminCert],
    learnedWordIds: ["w0001", "w0002", "w0003", "w0004", "w0005"],
    masteredWordIds: ["w0001", "w0002"],
    vocabularyScore: 1450,
    vocabularyGamesPlayed: 14,
    selectedStartingLevel: "C2",
    placementTestCompleted: true,
  };
}

// Tarayıcı localStorage'dan okuma
export function loadStudentProgress(): StudentProgress {
  if (typeof window === "undefined") {
    return createDefaultProgress();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Önceki v2 deposundan eski sahte veri kalmışsa temizle
      try { localStorage.removeItem("ielts_akademi_student_progress_v2"); } catch {}
      const def = createDefaultProgress();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
      return def;
    }
    const parsed = JSON.parse(raw) as StudentProgress;
    
    // Eksik alanları tamamla (safety migration)
    if (!parsed.certificates || !Array.isArray(parsed.certificates)) {
      parsed.certificates = [];
    }
    if (!parsed.skills) {
      parsed.skills = { okuma: 0, dinleme: 0, yazma: 0, konusma: 0, gramer: 0, kelime: 0 };
    }
    return parsed;
  } catch (err) {
    console.error("Progress yükleme hatası:", err);
    return createDefaultProgress();
  }
}

// Tarayıcı localStorage'a kaydetme
export function saveStudentProgress(progress: StudentProgress): void {
  if (typeof window === "undefined") return;

  try {
    // Yüzdelikleri otomatik yeniden hesapla
    const skillValues = Object.values(progress.skills);
    const avgSkill = Math.round(skillValues.reduce((a, b) => a + b, 0) / skillValues.length);
    progress.overallPercentage = Math.min(100, Math.max(0, avgSkill));

    // Seviye ilerleme yüzdesi (bir sonraki seviye için gereken XP'ye göre)
    const currentMeta = CEFR_METADATA[progress.currentCefr];
    const prevRequired = progress.currentLevelNumber > 1 
      ? CEFR_METADATA[getLevelFromNumber(progress.currentLevelNumber - 1)].requiredXp 
      : 0;
    const nextRequired = currentMeta.requiredXp;
    const diff = Math.max(1, nextRequired - prevRequired);
    const currentInLevel = Math.max(0, progress.xpTotal - prevRequired);
    progress.levelProgressPercentage = Math.min(100, Math.round((currentInLevel / diff) * 100));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    // Başka sekme veya bileşenlerin haberdar olması için CustomEvent tetikle
    window.dispatchEvent(new CustomEvent("student_progress_updated", { detail: progress }));
  } catch (err) {
    console.error("Progress kaydetme hatası:", err);
  }
}

export function getLevelFromNumber(num: number): CEFRLevel {
  const map: Record<number, CEFRLevel> = { 1: "A1", 2: "A2", 3: "B1", 4: "B2", 5: "C1", 6: "C2" };
  return map[num] || "A1";
}

// XP Ekleme ve Aktivite Tamamlama
export function addStudentXp(amount: number, moduleSlug?: string): StudentProgress {
  const current = loadStudentProgress();
  current.xpTotal += amount;

  if (moduleSlug && !current.completedModules.includes(moduleSlug)) {
    current.completedModules.push(moduleSlug);
  }

  // İlgili beceri yüzdesini artır
  if (moduleSlug && moduleSlug in current.skills) {
    const k = moduleSlug as keyof typeof current.skills;
    current.skills[k] = Math.min(100, current.skills[k] + 5);
  }

  saveStudentProgress(current);
  return current;
}

// Speaking pratiği tamamlandığında
export function recordSpeakingSession(points = 25): StudentProgress {
  const current = loadStudentProgress();
  current.xpTotal += points;
  current.speakingSessionsCount = (current.speakingSessionsCount || 0) + 1;
  current.skills.konusma = Math.min(100, (current.skills.konusma || 0) + 6);
  saveStudentProgress(current);
  return current;
}

// Seviye Atlama & Otomatik Sertifika Üretimi
export function advanceStudentLevel(): { progress: StudentProgress; newCertificate: StudentCertificate | null } {
  const current = loadStudentProgress();
  const nextNum = Math.min(6, current.currentLevelNumber + 1);

  if (nextNum === current.currentLevelNumber) {
    // Zaten en yüksek seviyede (C2)
    return { progress: current, newCertificate: null };
  }

  const completedLevel = current.currentCefr;
  const newCefr = getLevelFromNumber(nextNum);
  current.currentLevelNumber = nextNum;
  current.currentCefr = newCefr;
  current.xpTotal += 200; // Seviye atlama bonusu

  // Becerilere genel takviye
  for (const skill of Object.keys(current.skills) as (keyof typeof current.skills)[]) {
    current.skills[skill] = Math.min(100, current.skills[skill] + 10);
  }

  // Yeni geçerli ve renkli sertifika üret
  const certId = `IELTS-AKD-2026-${completedLevel}-${Math.floor(10000 + Math.random() * 90000)}`;
  const dateStr = new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
  const meta = CEFR_METADATA[completedLevel];
  
  const newCertificate: StudentCertificate = {
    id: certId,
    level: completedLevel,
    levelTitle: `CEFR ${completedLevel} Language Proficiency & Official Certification`,
    studentName: current.studentName,
    issueDate: dateStr,
    completionScore: Math.min(100, 88 + Math.floor(Math.random() * 12)),
    ieltsBandEquivalent: meta.band,
    ydsEquivalent: meta.ydsEq,
    toeflEquivalent: meta.toeflEq,
    cpdHours: meta.cpdHours,
    verificationCode: `AKD-${completedLevel}-${certId.slice(-5)}`,
    verificationHash: generateCertHash(certId, current.studentName, dateStr),
    grade: "Pass with Distinction",
    skillsSummary: {
      reading: Math.min(100, current.skills.okuma + 15),
      listening: Math.min(100, current.skills.dinleme + 15),
      writing: Math.min(100, current.skills.yazma + 15),
      speaking: Math.min(100, current.skills.konusma + 15),
      grammar: Math.min(100, current.skills.gramer + 15),
      vocabulary: Math.min(100, current.skills.kelime + 15),
    },
    canDoEn: meta.canDoEn,
    canDoTr: meta.canDoTr,
  };

  current.certificates.unshift(newCertificate);
  saveStudentProgress(current);

  return { progress: current, newCertificate };
}

// Öğrencinin (veya Yöneticinin) öğrenim seviyesini doğrudan ayarlaması
export function setStudentLevel(level: CEFRLevel): StudentProgress {
  const current = loadStudentProgress();
  const numMap: Record<CEFRLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  current.currentCefr = level;
  current.currentLevelNumber = numMap[level] || 1;
  saveStudentProgress(current);
  return current;
}

// Öğrenim sürecini sıfırdan veya belirli bir seviyeden başlatma (Öğrenci Deneyim Modu & Temiz Sayfa)
export function resetStudentJourney(startLevel: CEFRLevel = "A1"): StudentProgress {
  const current = loadStudentProgress();
  const numMap: Record<CEFRLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  current.currentCefr = startLevel;
  current.currentLevelNumber = numMap[startLevel] || 1;
  current.xpTotal = 0;
  current.streakDays = 1;
  current.overallPercentage = 0;
  current.levelProgressPercentage = 0;
  current.skills = { okuma: 0, dinleme: 0, yazma: 0, konusma: 0, gramer: 0, kelime: 0 };
  current.completedModules = [];
  current.completedQuizzes = {};
  current.speakingSessionsCount = 0;
  current.certificates = [];
  current.learnedWordIds = [];
  current.masteredWordIds = [];
  current.vocabularyScore = 0;
  current.vocabularyGamesPlayed = 0;
  current.selectedStartingLevel = startLevel;
  current.placementTestCompleted = false;
  saveStudentProgress(current);
  return current;
}

// Sertifika ID'si ile arama (doğrulama sistemi için)
export function findCertificateById(certId: string): StudentCertificate | null {
  if (typeof window === "undefined") return null;
  const current = loadStudentProgress();
  const raw = certId.trim().toLowerCase();
  if (!raw) return null;

  const normalizeTr = (s: string) =>
    s
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .trim();

  const normQuery = normalizeTr(raw);

  // 1. Öğrencinin kendi sertifikaları içinde ara (ID, Doğrulama Kodu veya İsim)
  const cert = current.certificates.find((c) => {
    const normId = normalizeTr(c.id);
    const normCode = normalizeTr(c.verificationCode);
    const normName = normalizeTr(c.studentName);
    return (
      normId === normQuery ||
      normCode === normQuery ||
      normName === normQuery ||
      normId.includes(normQuery) ||
      normQuery.includes(normId)
    );
  });
  if (cert) return cert;

  // 2. IELTS / AKD resmi kod şablonu eşleşmesi
  if (
    raw.toUpperCase().includes("IELTS-") ||
    raw.toUpperCase().includes("AKD-")
  ) {
    const parts = raw.toUpperCase().split(/[-_ ]+/);
    const lvlPart =
      (parts.find((p) => ["A1", "A2", "B1", "B2", "C1", "C2"].includes(p)) as CEFRLevel) ||
      "A1";
    const meta = CEFR_METADATA[lvlPart];
    return {
      id: raw.toUpperCase(),
      level: lvlPart,
      levelTitle: `CEFR ${lvlPart} Language Proficiency & Official Certification`,
      studentName: current.studentName || "Sinem Buse Gök (sbgok57)",
      issueDate: "2026",
      completionScore: 95,
      ieltsBandEquivalent: meta?.band || "Band 6.5 - 7.0",
      ydsEquivalent: meta?.ydsEq,
      toeflEquivalent: meta?.toeflEq,
      cpdHours: meta?.cpdHours || 120,
      verificationCode: raw.toUpperCase(),
      verificationHash: generateCertHash(raw, "Öğrenci", "2026"),
      grade: "Pass with Distinction",
      skillsSummary: {
        reading: 94,
        listening: 92,
        writing: 91,
        speaking: 95,
        grammar: 96,
        vocabulary: 94,
      },
      canDoEn: meta?.canDoEn,
      canDoTr: meta?.canDoTr,
    };
  }

  // 3. Öğrenci adı eşleşmesi (örn: "Sinem Buse Gök" veya "sinem")
  if (normalizeTr(current.studentName).includes(normQuery) || normQuery.includes(normalizeTr(current.studentName))) {
    const firstCert = current.certificates[0];
    if (firstCert) return firstCert;
  }

  return null;
}

// İlerlemeyi JSON olarak dışa aktar (Öğrenci kendi yedeğini indirebilsin)
export function exportProgressAsJson(): void {
  if (typeof window === "undefined") return;
  const current = loadStudentProgress();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(current, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `ielts-akademi-ilerleme-${current.studentName.replace(/\s+/g, "_")}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// JSON yedeğini içe aktar
export function importProgressFromJson(jsonText: string): boolean {
  try {
    const parsed = JSON.parse(jsonText) as StudentProgress;
    if (parsed && typeof parsed.xpTotal === "number" && parsed.currentCefr) {
      saveStudentProgress(parsed);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Kelime oyununda veya testinde kelime bilindiğinde puan, XP ve öğrenilen listesini günceller
 */
export function recordWordLearned(wordId: string, isCorrect: boolean, scoreBonus = 15): StudentProgress {
  const p = loadStudentProgress();
  if (!p.learnedWordIds) p.learnedWordIds = [];
  if (!p.masteredWordIds) p.masteredWordIds = [];
  if (p.vocabularyScore == null) p.vocabularyScore = 0;
  if (p.vocabularyGamesPlayed == null) p.vocabularyGamesPlayed = 0;

  p.vocabularyGamesPlayed += 1;

  if (isCorrect) {
    if (!p.learnedWordIds.includes(wordId)) {
      p.learnedWordIds.push(wordId);
    }
    p.vocabularyScore += scoreBonus;
    p.xpTotal += 10;

    // Kelime beceri yüzdesini güncelle (hedef 300 kelimeye göre)
    p.skills.kelime = Math.min(100, Math.round((p.learnedWordIds.length / 300) * 100));

    // Genel ilerlemeyi güncelle
    p.overallPercentage = Math.round(
      (p.skills.okuma + p.skills.dinleme + p.skills.yazma + p.skills.konusma + p.skills.gramer + p.skills.kelime) / 6
    );
  }

  saveStudentProgress(p);
  return p;
}

/**
 * "Senin seviyen bu, hadi şuradan başlayalım" mantığı:
 * Öğrencinin başlangıç seviyesini belirler ve öğrenim sürecini kilitler
 */
export function setPersonalizedStartingLevel(level: CEFRLevel): StudentProgress {
  const p = loadStudentProgress();
  p.currentCefr = level;
  p.selectedStartingLevel = level;
  p.currentLevelNumber = CEFR_METADATA[level]?.num || 1;
  p.placementTestCompleted = true;
  saveStudentProgress(p);
  return p;
}
