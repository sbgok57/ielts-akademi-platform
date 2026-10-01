"use client";

// src/components/VocabularyVaultExplorer.tsx
// 1,250+ IELTS & YDS Kelime Envanteri — 7 Doğal Aksan (Kadın/Erkek) + Seviye Bazlı Öğrenim + Oyunlaştırma & Skor Takip
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Volume2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Filter,
  Globe,
  Trophy,
  Flame,
  Award,
  Gamepad2,
  RotateCcw,
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Target,
  ListFilter,
  BookmarkCheck,
  HelpCircle,
} from "lucide-react";
import {
  loadStudentProgress,
  recordWordLearned,
  setPersonalizedStartingLevel,
  CEFRLevel,
  CEFR_METADATA,
} from "@/lib/progress-store";

export interface WordItem {
  id: string;
  kelime: string;
  tur?: string;
  tr: string;
  en?: string;
  enTanim?: string;
  es: string[] | string;
  ornek?: string;
  ornEn?: string;
  ornekTr?: string;
  ornTr?: string;
  seviye: CEFRLevel;
  alan?: string;
  ydsFrequency?: string;
}

// 7 Doğal Aksan Profili (Kadın & Erkek)
export const ACCENTS = [
  { code: "en-GB", label: "İngiliz (British)", flag: "🇬🇧", voicePref: ["en-GB", "British", "Daniel", "Oliver", "Victoria", "Hazel"] },
  { code: "en-US", label: "Amerikan (American)", flag: "🇺🇸", voicePref: ["en-US", "American", "Samantha", "Alex", "Fred", "Victoria"] },
  { code: "en-AU", label: "Avustralya (Australian)", flag: "🇦🇺", voicePref: ["en-AU", "Karen", "Lee", "Australian"] },
  { code: "en-CA", label: "Kanada (Canadian)", flag: "🇨🇦", voicePref: ["en-CA", "Canadian", "Clara"] },
  { code: "en-NZ", label: "Yeni Zelanda (NZ)", flag: "🇳🇿", voicePref: ["en-NZ", "Mitchell"] },
  { code: "en-GB-scot", label: "İskoçya (Scottish)", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", voicePref: ["en-GB", "Scottish", "Fiona"] },
  { code: "en-IN", label: "Hindistan (Indian)", flag: "🇮🇳", voicePref: ["en-IN", "Veena", "Rishi", "Indian"] },
];

export default function VocabularyVaultExplorer() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"liste" | "oyun" | "seviye-tespit">("liste");
  
  // Arama & Filtreleme
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("Tümü");
  const [filterLearned, setFilterLearned] = useState<"tumu" | "ogrenilenler" | "ogrenilecek">("tumu");
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  // Ses & Aksan
  const [selectedAccent, setSelectedAccent] = useState(ACCENTS[0]!);
  const [voiceGender, setVoiceGender] = useState<"kadin" | "erkek">("kadin");

  // Öğrenci İlerleme & Skor Verisi
  const [studentProgress, setStudentProgress] = useState(() => loadStudentProgress());
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Oyun Durumu
  const [gameIndex, setGameIndex] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [gameStreak, setGameStreak] = useState(0);
  const [gameFeedback, setGameFeedback] = useState<{ isCorrect: boolean; selected: string; correct: string } | null>(null);
  const [gameOptions, setGameOptions] = useState<string[]>([]);

  // Seviye Teşhis Testi Durumu
  const [diagStep, setDiagStep] = useState(0);
  const [diagAnswers, setDiagAnswers] = useState<Record<number, boolean>>({});
  const [diagResult, setDiagResult] = useState<CEFRLevel | null>(null);

  // 1. Veri Yükleme (kelime-hepsi.json -> fallback: kelime-01.json)
  useEffect(() => {
    async function loadVocab() {
      try {
        let res = await fetch("/data/site/kelime/kelime-hepsi.json");
        if (!res.ok) {
          res = await fetch("/data/site/kelime/kelime-01.json");
        }
        if (res.ok) {
          const raw = await res.json();
          const mapped: WordItem[] = raw.map((item: any, idx: number) => ({
            id: item.id || `w-${idx}`,
            kelime: item.kelime || item.term || "vocabulary",
            tur: item.tur || "v.",
            tr: item.tr || item.trAnlam || item.meaningTr || "",
            en: item.en || item.enTanim || item.definitionEn || "",
            enTanim: item.enTanim || item.en || item.definitionEn || "",
            es: item.es || item.esAnlam || item.synonyms || [],
            ornek: item.ornek || item.ornEn || item.exampleEn || "",
            ornEn: item.ornEn || item.ornek || item.exampleEn || "",
            ornekTr: item.ornekTr || item.ornTr || item.exampleTr || "",
            ornTr: item.ornTr || item.ornekTr || item.exampleTr || "",
            seviye: (item.seviye as CEFRLevel) || "B2",
            alan: item.alan || "Akademik",
            ydsFrequency: item.ydsFrequency || "Yüksek (P1)",
          }));
          setWords(mapped);

          // Başlangıç seviyesi kayıtlıysa doğrudan o seviyeyi seç
          const currentProg = loadStudentProgress();
          if (currentProg.selectedStartingLevel) {
            setSelectedLevel(currentProg.selectedStartingLevel);
          }
        }
      } catch (err) {
        console.error("Kelime envanteri yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVocab();

    const onProgUpdate = () => setStudentProgress(loadStudentProgress());
    window.addEventListener("student_progress_updated", onProgUpdate);
    return () => window.removeEventListener("student_progress_updated", onProgUpdate);
  }, []);

  // Filtrelenmiş kelimeler
  const learnedSet = useMemo(() => new Set(studentProgress.learnedWordIds || []), [studentProgress.learnedWordIds]);

  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      const matchLevel = selectedLevel === "Tümü" || w.seviye === selectedLevel;
      const q = search.toLowerCase().trim();
      const esStr = Array.isArray(w.es) ? w.es.join(" ") : String(w.es || "");
      const matchSearch =
        !q ||
        w.kelime.toLowerCase().includes(q) ||
        w.tr.toLowerCase().includes(q) ||
        esStr.toLowerCase().includes(q) ||
        (w.alan && w.alan.toLowerCase().includes(q));

      const isLearned = learnedSet.has(w.id);
      const matchLearned =
        filterLearned === "tumu" ||
        (filterLearned === "ogrenilenler" && isLearned) ||
        (filterLearned === "ogrenilecek" && !isLearned);

      return matchLevel && matchSearch && matchLearned;
    });
  }, [words, selectedLevel, search, filterLearned, learnedSet]);

  const totalPages = Math.max(1, Math.ceil(filteredWords.length / itemsPerPage));
  const paginatedWords = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredWords.slice(start, start + itemsPerPage);
  }, [filteredWords, page]);

  // Seviye değiştiğinde sayfayı başa sar
  useEffect(() => {
    setPage(1);
  }, [selectedLevel, search, filterLearned]);

  // 7 Aksanlı Doğal Ses Sentezi
  const playPronunciation = (word: string, exampleSentence?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const textToSpeak = exampleSentence ? `${word}. ${exampleSentence}` : word;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = selectedAccent.code.startsWith("en-GB") ? "en-GB" : selectedAccent.code;
    utterance.rate = 0.88; // Doğal ve anlaşılır çalışma hızı

    const voices = window.speechSynthesis.getVoices();
    const langVoices = voices.filter((v) =>
      v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase().slice(0, 5))
    );

    if (langVoices.length > 0) {
      if (voiceGender === "kadin") {
        const f = langVoices.find((v) =>
          /female|woman|karen|samantha|victoria|zira|fiona|veena/i.test(v.name)
        );
        if (f) utterance.voice = f;
        utterance.pitch = 1.05;
      } else {
        const m = langVoices.find((v) =>
          /male|man|daniel|alex|oliver|david|george|rishi/i.test(v.name)
        );
        if (m) utterance.voice = m;
        utterance.pitch = 0.9;
      }
    }

    window.speechSynthesis.speak(utterance);
  };

  // Öğrenildi olarak işaretle
  const toggleLearned = (wordId: string) => {
    const isNowLearned = !learnedSet.has(wordId);
    const updated = recordWordLearned(wordId, isNowLearned, isNowLearned ? 15 : 0);
    setStudentProgress(updated);
    if (isNowLearned) {
      setActiveNotification(`🎉 Kelime öğrenildi (+15 Puan, +10 XP)!`);
      setTimeout(() => setActiveNotification(null), 3000);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // OYUNLAŞTIRMA & TEST MODU MANTIĞI
  // ─────────────────────────────────────────────────────────────
  const gameWordList = useMemo(() => {
    if (filteredWords.length >= 4) return filteredWords;
    return words;
  }, [filteredWords, words]);

  const currentGameWord = gameWordList[gameIndex % gameWordList.length];

  // Oyun seçeneklerini hazırla
  useEffect(() => {
    if (!currentGameWord || gameWordList.length < 4) return;
    const correct = currentGameWord.tr;
    const pool = gameWordList.filter((w) => w.id !== currentGameWord.id);
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
    const opts = [correct, ...shuffledPool.map((w) => w.tr)].sort(() => 0.5 - Math.random());
    setGameOptions(opts);
    setGameFeedback(null);
  }, [gameIndex, currentGameWord, gameWordList]);

  const handleGameAnswer = (selectedTr: string) => {
    if (gameFeedback || !currentGameWord) return;
    const isCorrect = selectedTr === currentGameWord.tr;
    setGameFeedback({ isCorrect, selected: selectedTr, correct: currentGameWord.tr });

    if (isCorrect) {
      const newStreak = gameStreak + 1;
      setGameStreak(newStreak);
      const points = 15 * (newStreak > 3 ? 2 : 1);
      setGameScore((s) => s + points);
      const updated = recordWordLearned(currentGameWord.id, true, points);
      setStudentProgress(updated);
    } else {
      setGameStreak(0);
    }

    // 1.4 saniye sonra sonraki soruya geç
    setTimeout(() => {
      setGameIndex((i) => i + 1);
    }, 1400);
  };

  // ─────────────────────────────────────────────────────────────
  // "SENİN SEVİYEN BU, HADİ ŞURADAN BAŞLAYALIM" TEŞHİS TESTİ
  // ─────────────────────────────────────────────────────────────
  const DIAG_QUESTIONS: { level: CEFRLevel; word: string; tr: string; options: string[] }[] = [
    { level: "A1", word: "achieve", tr: "başarmak", options: ["başarmak", "unutmak", "satın almak", "kaçmak"] },
    { level: "A2", word: "accurate", tr: "doğru, kesin", options: ["tehlikeli", "doğru, kesin", "yavaş", "şüpheli"] },
    { level: "B1", word: "although", tr: "rağmen, -e karşın", options: ["çünkü", "rağmen, -e karşın", "bu yüzden", "birlikte"] },
    { level: "B2", word: "indispensable", tr: "vazgeçilmez", options: ["vazgeçilmez", "zararlı", "rastgele", "geçici"] },
    { level: "C1", word: "detrimental", tr: "zararlı, hasar veren", options: ["zararlı, hasar veren", "faydalı", "hızlı", "tarafsız"] },
    { level: "C2", word: "ubiquitous", tr: "her yerde bulunan", options: ["nadir", "gizli", "her yerde bulunan", "tehlikeli"] },
  ];

  const handleDiagAnswer = (selected: string) => {
    const currentQ = DIAG_QUESTIONS[diagStep];
    if (!currentQ) return;
    const isOk = selected === currentQ.tr;
    setDiagAnswers((prev) => ({ ...prev, [diagStep]: isOk }));

    if (diagStep < DIAG_QUESTIONS.length - 1) {
      setDiagStep((s) => s + 1);
    } else {
      // Test bitti — Seviyeyi hesapla
      let evaluatedLevel: CEFRLevel = "A1";
      if (diagAnswers[0] && isOk) evaluatedLevel = "A2";
      if (diagAnswers[0] && diagAnswers[1] && isOk) evaluatedLevel = "B1";
      if (diagAnswers[0] && diagAnswers[1] && diagAnswers[2] && isOk) evaluatedLevel = "B2";
      if (diagAnswers[0] && diagAnswers[1] && diagAnswers[2] && diagAnswers[3] && isOk) evaluatedLevel = "C1";
      if (diagAnswers[0] && diagAnswers[1] && diagAnswers[2] && diagAnswers[3] && diagAnswers[4] && isOk) evaluatedLevel = "C2";

      setDiagResult(evaluatedLevel);
    }
  };

  const applyDiagnosedLevel = (lvl: CEFRLevel) => {
    const updated = setPersonalizedStartingLevel(lvl);
    setStudentProgress(updated);
    setSelectedLevel(lvl);
    setActiveTab("liste");
    setActiveNotification(`🎯 Seviyeniz ${lvl} olarak ayarlandı! Senin seviyen bu, hadi ${lvl} kelimeleriyle başlayalım! 🚀`);
    setTimeout(() => setActiveNotification(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* ─── 1. BİLGİ & KUMANDA PANELİ (DÖNEN KÜP YERİNE MODERN STATS MERKEZİ) ─── */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0c0c0c] space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                1,250+ IELTS, YDS & YDT Kelime Envanteri
              </span>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-black text-amber-700 dark:text-amber-300">
                A1 → C2 CEFR Standartları
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Kelime Hazinesi & Telaffuz Stüdyosu 📚
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Cambridge, Oxford, Macmillan, Dilko ve Akın Dil YDS/YDT müfredatındaki tüm kelimeler.
            </p>
          </div>

          {/* İstatistik Rozetleri */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl border border-purple-500/20 bg-purple-50/50 px-3.5 py-2 dark:bg-purple-950/20">
              <BookmarkCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Öğrenilen</p>
                <p className="text-sm font-black text-purple-700 dark:text-purple-300">
                  {learnedSet.size} / {words.length || 1257}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-50/50 px-3.5 py-2 dark:bg-amber-950/20">
              <Trophy className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Kelime Skoru</p>
                <p className="text-sm font-black text-amber-600 dark:text-amber-400">
                  {studentProgress.vocabularyScore || 0} Puan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 px-3.5 py-2 dark:bg-emerald-950/20">
              <Target className="h-4 w-4 text-emerald-500" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Aktif Düzey</p>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {selectedLevel === "Tümü" ? studentProgress.currentCefr : selectedLevel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 7 DOĞAL AKSAN VE KADIN / ERKEK SEÇİCİ ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-black text-slate-700 dark:text-slate-300">7 Doğal İnsan Aksanı:</span>
            <div className="flex flex-wrap gap-1">
              {ACCENTS.map((acc) => (
                <button
                  key={acc.code}
                  type="button"
                  onClick={() => setSelectedAccent(acc)}
                  className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
                    selectedAccent.code === acc.code
                      ? "bg-purple-600 text-white shadow-sm scale-105"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <span>{acc.flag}</span>
                  <span className="hidden sm:inline">{acc.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Kadın / Erkek Tını */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-0.5 text-xs font-bold dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setVoiceGender("kadin")}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                voiceGender === "kadin"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-[#222] dark:text-white"
                  : "text-slate-500"
              }`}
            >
              👩 Kadın Ses
            </button>
            <button
              type="button"
              onClick={() => setVoiceGender("erkek")}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                voiceGender === "erkek"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-[#222] dark:text-white"
                  : "text-slate-500"
              }`}
            >
              👨 Erkek Ses
            </button>
          </div>
        </div>

        {/* ─── MOD SEÇİCİ SEKMELER (SÖZLÜK, OYUN, SEVİYE TESPİTİ) ─── */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab("liste")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black transition-all ${
              activeTab === "liste"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>📚 Kelime Envanteri ({filteredWords.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("oyun")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black transition-all ${
              activeTab === "oyun"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>🎮 Kelime Oyunu & Çoktan Seçmeli Test</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("seviye-tespit");
              setDiagStep(0);
              setDiagAnswers({});
              setDiagResult(null);
            }}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black transition-all ${
              activeTab === "seviye-tespit"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>🎯 2 Dakikada Seviyeni Belirle & Başla</span>
          </button>
        </div>
      </div>

      {/* Bildirim Toast'ı */}
      {activeNotification && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/15 p-3.5 text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-fadeIn">
          <span>{activeNotification}</span>
        </div>
      )}

      {/* ─── 2. SEVİYE TESPİTİ ("Senin Seviyen Bu, Hadi Şuradan Başlayalım") ─── */}
      {activeTab === "seviye-tespit" && (
        <div className="rounded-3xl border border-emerald-500/30 bg-white p-6 shadow-sm dark:border-emerald-500/20 dark:bg-[#0c0c0c] space-y-6">
          {!diagResult ? (
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                    Kişiselleştirilmiş Teşhis Testi
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Soru {diagStep + 1} / {DIAG_QUESTIONS.length} · Hedef Seviye: {DIAG_QUESTIONS[diagStep]?.level}
                  </h3>
                </div>
                <span className="rounded-xl bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {DIAG_QUESTIONS[diagStep]?.level} Soru
                </span>
              </div>

              <div className="py-6 text-center space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aşağıdaki kelimenin Türkçe karşılığı nedir?</p>
                <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-6 py-4 dark:bg-[#141414] border border-slate-200 dark:border-slate-800">
                  <span className="text-3xl font-black text-purple-600 dark:text-purple-400">
                    {DIAG_QUESTIONS[diagStep]?.word}
                  </span>
                  <button
                    type="button"
                    onClick={() => playPronunciation(DIAG_QUESTIONS[diagStep]?.word || "")}
                    className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                {DIAG_QUESTIONS[diagStep]?.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleDiagAnswer(opt)}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-[#141414] dark:text-slate-200 dark:hover:bg-emerald-950/30 transition-all text-center"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4 max-w-lg mx-auto">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Tebrikler! Seviyeniz Belirlendi: {diagResult} 🎓
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                &ldquo;<strong>Senin seviyen {diagResult}, hadi doğrudan {diagResult} seviyesindeki kelimelerle çalışmaya başlayalım!</strong>&rdquo;
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => applyDiagnosedLevel(diagResult)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700"
                >
                  <span>{diagResult} Seviyesiyle Şimdi Başla</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDiagStep(0);
                    setDiagAnswers({});
                    setDiagResult(null);
                  }}
                  className="w-full sm:w-auto rounded-2xl border border-slate-200 px-4 py-3.5 text-xs font-bold text-slate-600 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#141414]"
                >
                  Testi Tekrarla
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── 3. KELİME OYUNU & ÇOKTAN SEÇMELİ TEST MODU (OYUNLAŞTIRMA & SKOR) ─── */}
      {activeTab === "oyun" && currentGameWord && (
        <div className="rounded-3xl border border-amber-500/30 bg-white p-6 shadow-sm dark:border-amber-500/20 dark:bg-[#0c0c0c] space-y-6">
          {/* Oyun Üst Göstergesi */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                <Gamepad2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  YDS & IELTS Kelime Oyunu
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Her doğru cevap +15 Puan · Kombo serisiyle katla!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600 dark:bg-orange-950/40 dark:text-orange-300">
                <Flame className="h-4 w-4" />
                <span>{gameStreak}x Kombo</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <Trophy className="h-4 w-4" />
                <span>{gameScore} Skor</span>
              </div>
            </div>
          </div>

          {/* Soru Alanı */}
          <div className="text-center py-6 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-0.5 text-xs font-black text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <span>Seviye: {currentGameWord.seviye}</span>
              <span>·</span>
              <span>{currentGameWord.alan}</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {currentGameWord.kelime}
              </h2>
              <button
                type="button"
                onClick={() => playPronunciation(currentGameWord.kelime, currentGameWord.ornEn)}
                title={`${selectedAccent.label} ile Dinle`}
                className="p-2.5 rounded-2xl text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/50 transition-all"
              >
                <Volume2 className="h-6 w-6" />
              </button>
            </div>

            {currentGameWord.enTanim && (
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto italic">
                &ldquo;{currentGameWord.enTanim}&rdquo;
              </p>
            )}
          </div>

          {/* 4 Şıklı Seçenek Izgarası */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {gameOptions.map((opt) => {
              const isSelected = gameFeedback?.selected === opt;
              const isCorrectOpt = gameFeedback?.correct === opt;
              let btnClass = "border-slate-200 bg-white text-slate-800 hover:border-purple-400 hover:bg-purple-50 dark:border-slate-800 dark:bg-[#141414] dark:text-slate-200";

              if (gameFeedback) {
                if (isCorrectOpt) {
                  btnClass = "border-emerald-500 bg-emerald-500 text-white font-black scale-105";
                } else if (isSelected && !gameFeedback.isCorrect) {
                  btnClass = "border-rose-500 bg-rose-500 text-white font-black";
                } else {
                  btnClass = "border-slate-200 bg-slate-100 text-slate-400 opacity-60 dark:bg-slate-900";
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={Boolean(gameFeedback)}
                  onClick={() => handleGameAnswer(opt)}
                  className={`rounded-2xl border p-4 text-sm font-bold transition-all text-center ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Oyun Geri Bildirimi */}
          {gameFeedback && (
            <div
              className={`rounded-2xl p-3.5 text-center text-xs font-black animate-fadeIn ${
                gameFeedback.isCorrect
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
              }`}
            >
              {gameFeedback.isCorrect ? "✅ Harika! Doğru Cevap (+15 Puan Kazandın)" : `❌ Doğru cevap: ${gameFeedback.correct}`}
            </div>
          )}

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setGameIndex((i) => i + 1)}
              className="text-xs font-bold text-slate-500 hover:text-purple-600 underline"
            >
              Sonraki Kelimeye Geç →
            </button>
          </div>
        </div>
      )}

      {/* ─── 4. KELİME ENVANTERİ LİSTE GÖRÜNÜMÜ (ARAMA, SEVİYE & ÖĞRENİLENLER) ─── */}
      {activeTab === "liste" && (
        <div className="space-y-5">
          {/* Arama ve Filtre Çubuğu */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-[#0c0c0c] space-y-3.5">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Arama Girişi */}
              <div className="relative w-full sm:flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="1,250+ kelime içinde ara (İngilizce, Türkçe anlam, eş anlamlı)..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-xs font-medium text-slate-900 outline-none transition focus:border-purple-500 dark:border-slate-800 dark:bg-[#141414] dark:text-white"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>

              {/* Öğrenilme Durumu Filtresi */}
              <div className="flex rounded-xl bg-slate-100 p-0.5 text-xs font-bold dark:bg-slate-800 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setFilterLearned("tumu")}
                  className={`flex-1 sm:flex-none rounded-lg px-3 py-1.5 transition-all ${
                    filterLearned === "tumu"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-[#222] dark:text-white"
                      : "text-slate-500"
                  }`}
                >
                  Tümü ({words.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterLearned("ogrenilenler")}
                  className={`flex-1 sm:flex-none rounded-lg px-3 py-1.5 transition-all ${
                    filterLearned === "ogrenilenler"
                      ? "bg-white text-emerald-600 shadow-sm dark:bg-[#222] dark:text-emerald-400"
                      : "text-slate-500"
                  }`}
                >
                  Öğrendiklerim ({learnedSet.size})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterLearned("ogrenilecek")}
                  className={`flex-1 sm:flex-none rounded-lg px-3 py-1.5 transition-all ${
                    filterLearned === "ogrenilecek"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-[#222] dark:text-white"
                      : "text-slate-500"
                  }`}
                >
                  Kalan ({words.length - learnedSet.size})
                </button>
              </div>
            </div>

            {/* CEFR Seviye Filtre Düğmeleri */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1">Seviyeler:</span>
              {["Tümü", "A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => {
                const isSelected = selectedLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                      isSelected
                        ? "bg-purple-600 text-white shadow-sm scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{lvl}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kelime Kartları Izgarası */}
          {loading ? (
            <div className="p-16 text-center text-sm font-bold text-slate-400 animate-pulse">
              1,250+ IELTS & YDS Kelime Envanteri Yükleniyor...
            </div>
          ) : paginatedWords.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-500">Aramanıza veya filtrenize uygun kelime bulunamadı.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedLevel("Tümü");
                  setFilterLearned("tumu");
                }}
                className="mt-3 text-xs font-black text-purple-600 hover:underline"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedWords.map((item) => {
                const isLearned = learnedSet.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`relative flex flex-col justify-between rounded-3xl border p-5 shadow-sm transition-all hover:shadow-md ${
                      isLearned
                        ? "border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f0f0f]"
                    }`}
                  >
                    <div>
                      {/* Üst Başlık & Aksanlı Ses */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-purple-600 dark:text-purple-400">
                              {item.kelime}
                            </h3>
                            {item.tur && (
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                {item.tur}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                            🇹🇷 {item.tr}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            className="rounded-lg px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-sm"
                            style={{ backgroundColor: CEFR_METADATA[item.seviye]?.color || "#8B5CF6" }}
                          >
                            {item.seviye}
                          </span>
                          <button
                            type="button"
                            onClick={() => playPronunciation(item.kelime, item.ornEn)}
                            title={`${selectedAccent.label} (${voiceGender}) ile Dinle`}
                            className="rounded-xl p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* İngilizce Açıklama */}
                      {item.enTanim && (
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-snug">
                          {item.enTanim}
                        </p>
                      )}

                      {/* Eş Anlamlılar */}
                      {Boolean(item.es) && (
                        <div className="mt-3 flex flex-wrap items-center gap-1 text-[11px]">
                          <span className="font-bold text-slate-400">Eş Anlamlı:</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {Array.isArray(item.es) ? item.es.join(", ") : item.es}
                          </span>
                        </div>
                      )}

                      {/* Örnek Cümle & Çeviri */}
                      {Boolean(item.ornEn) && (
                        <div className="mt-3 rounded-2xl bg-slate-50 p-2.5 text-xs text-slate-700 dark:bg-[#161616] dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                          <div className="flex items-start justify-between gap-1">
                            <p className="font-semibold italic">&ldquo;{item.ornEn}&rdquo;</p>
                            <button
                              type="button"
                              onClick={() => playPronunciation(item.kelime, item.ornEn)}
                              title="Cümleyi Dinle"
                              className="text-slate-400 hover:text-purple-500 shrink-0 p-0.5"
                            >
                              <Volume2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {item.ornTr && (
                            <p className="mt-1 text-[11px] text-slate-400">{item.ornTr}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Alt Çubuk: Alan & Öğrendim Butonu */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
                      <span className="text-[10px] text-slate-400 font-semibold">{item.alan || "YDS"}</span>
                      <button
                        type="button"
                        onClick={() => toggleLearned(item.id)}
                        className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
                          isLearned
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-purple-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{isLearned ? "Öğrenildi ✓" : "Öğrendim (+15 Puan)"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sayfalama Kontrolleri */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sayfa {page} / {totalPages} (Toplam {filteredWords.length} kelime)
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-40 dark:border-slate-800 dark:text-slate-300"
                >
                  ← Önceki
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-40 dark:border-slate-800 dark:text-slate-300"
                >
                  Sonraki →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
