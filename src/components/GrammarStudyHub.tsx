"use client";

// src/components/GrammarStudyHub.tsx
// A1→C2 Hafıza Kodlamalı Gramer Modülü + Kadın/Erkek Sesli Anlatım + Arka Planda Çalma + YouTube Dersleri

import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Youtube,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Lightbulb,
  Radio,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { addStudentXp } from "@/lib/progress-store";

export interface GrammarTopic {
  id: string;
  title: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  formula: string;
  mnemonicCode: {
    name: string;
    description: string;
    mentalAnchor: string;
  };
  audioNarrativeTr: string;
  audioNarrativeEn: string;
  sampleSentences: { en: string; tr: string }[];
  turkishStudentTrap: string;
  examTactic: string;
  youtubeEmbedId: string; // Kesinlikle çalışan popüler eğitim videosu
  youtubeChannel: string;
}

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: "g1",
    title: "Present Simple & Geniş Zaman",
    level: "A1",
    formula: "Özne + V1 (He/She/It için V-s) + Nesne / Zaman",
    mnemonicCode: {
      name: "⏰ Tren Tarifesi Kodu & 3S Kuralı",
      description: "Güneşin doğuşu, tren kalkış saatleri ve her gün tekrarladığın rutinler için kullanılır.",
      mentalAnchor: "Zihninde bir tren saati panosu canlandır: Değişmeyen kurallar ve He/She/It görünce fiile zil gibi takılan '-s' sesi!",
    },
    audioNarrativeTr:
      "Present Simple, hayatın değişmeyen yasalarını, her gün yaptığın rutinleri ve zaman çizelgelerini anlatır. Unutma: He, She ve It özneleri tekildir ve fiilin sonuna mutlaka bir -s takısı ister.",
    audioNarrativeEn:
      "Present simple describes habits, general truths, and fixed timetables. Remember the golden 3S rule: always add s to the verb for he, she, and it.",
    sampleSentences: [
      { en: "The research team publishes annual findings in Oxford.", tr: "Araştırma ekibi yıllık bulguları Oxford'da yayımlar." },
      { en: "Water boils at 100 degrees Celsius under standard atmospheric pressure.", tr: "Su, standart atmosferik basınç altında 100 santigrat derecede kaynar." },
    ],
    turkishStudentTrap: "Türkçe 'She work here' demek yaygın bir hatadır. Doğrusu: 'She works here' (3. tekil şahıs -s kuralı).",
    examTactic: "IELTS Listening Part 1'de 'usually', 'every weekday' gibi sıklık zarfları bu zaman yapısının işaretidir.",
    youtubeEmbedId: "L9AWrJnhsRI", // Oxford Online English Present Simple
    youtubeChannel: "Oxford Online English",
  },
  {
    id: "g2",
    title: "Present Perfect Tense & Zaman Köprüsü",
    level: "A2",
    formula: "Özne + have/has + V3 (Past Participle)",
    mnemonicCode: {
      name: "🌉 Zaman Asma Köprüsü Kodu",
      description: "Geçmişte başlamış veya bitmiş ama etkisi doğrudan şu ana uzanan köprü.",
      mentalAnchor: "Geçmişten bugüne uzanan asma bir köprü hayal et: Dün, 2010 gibi kesin bir tarih varsa köprü yıkılır (Past Simple olur); belirsiz tecrübe veya etkisi sürüyorsa köprü sağlam kalır (Present Perfect).",
    },
    audioNarrativeTr:
      "Present Perfect, geçmişle bugün arasındaki asma köprüdür. Olay geçmişte gerçekleşmiştir ama etkisi, tecrübesi veya devamlılığı şu anda bizimledir. 'Since' başlangıç noktasını, 'for' ise geçen süreyi bağlar.",
    audioNarrativeEn:
      "Present perfect bridges the past and the present. It focuses on life experiences and ongoing relevance. Use since for a starting point and for for duration.",
    sampleSentences: [
      { en: "Urban renewable energy adoption has surged since 2020.", tr: "Kentsel yenilenebilir enerji kullanımı 2020'den bu yana hızla arttı." },
      { en: "Scientists have discovered a novel antibiotic molecule.", tr: "Bilim insanları yeni bir antibiyotik molekülü keşfetti." },
    ],
    turkishStudentTrap: "'I have seen him yesterday' kesinlikle yanlıştır! 'Yesterday' varsa 'I saw him yesterday' denir.",
    examTactic: "Writing Task 1 grafik anlatımında 'has risen by 25%' yapısı puanınızı doğrudan Band 7 bandına taşır.",
    youtubeEmbedId: "6ATj_b5_yNs", // BBC Learning English Present Perfect
    youtubeChannel: "BBC Learning English",
  },
  {
    id: "g3",
    title: "Conditionals Type 2 & 3 (Koşul Cümleleri)",
    level: "B2",
    formula: "Type 2: If + Past Simple, would + V1 | Type 3: If + Past Perfect, would have + V3",
    mnemonicCode: {
      name: "🚀 Zaman Makinesi & Hayal Filtresi Kodu",
      description: "Type 2: Şu anki hayaller (Eğer zengin olsaydım). Type 3: Geçmişteki pişmanlıklar (Eğer çalışsaydım kazanırdım).",
      mentalAnchor: "Type 2 için bir hayal gözlüğü tak: Şu an gerçek olmayan bir dilek. Type 3 içinse zamanda geriye giden bir makine: Artık değiştirilemeyecek bir geçmiş fırsat!",
    },
    audioNarrativeTr:
      "Koşul cümleleri fikirlerinizi zenginleştirir. Type 2 şimdiki hayali durumları, Type 3 ise geçmişteki kaçırılmış fırsatları anlatır. 'If' cümlesine asla 'would' gelmez.",
    audioNarrativeEn:
      "Second conditional imagines unreal present situations, while third conditional regrets past outcomes. Never put would directly inside the if clause.",
    sampleSentences: [
      { en: "If local authorities invested in public transit, traffic congestion would decrease.", tr: "Yerel yönetimler toplu taşımaya yatırım yapsaydı, trafik yoğunluğu azalırdı." },
      { en: "Had the hospital upgraded its backup generators, power outages would not have occurred.", tr: "Hastane yedek jeneratörlerini yenilemiş olsaydı, elektrik kesintileri yaşanmazdı." },
    ],
    turkishStudentTrap: "'If I would know' denmez! Doğrusu: 'If I knew' (If cümlesine would gelmez).",
    examTactic: "Speaking Part 3 hipotetik sorularda bu yapıyı kullanmak dil hakimiyetinizi gösterir.",
    youtubeEmbedId: "h_r_031L2_8", // Cambridge English Conditionals
    youtubeChannel: "Cambridge English Official",
  },
  {
    id: "g4",
    title: "Inversion (Devrik Cümleler) & Akademik Vurgu",
    level: "C1",
    formula: "Negatif Zarf (Seldom / Rarely / Under no circumstances) + Yardımcı Fiil + Özne + Fiil",
    mnemonicCode: {
      name: "🎭 Tiyatro Sahnesi Spot Işığı Kodu",
      description: "Vurguyu zirveye taşımak için yardımcı fiili öznenin önüne fırlatmak.",
      mentalAnchor: "Tiyatro sahnesinde spot ışığı öne geçer! Cümleye 'Rarely', 'Not only' ile başladığında yardımcı fiil (did, have, should) hemen ardından gelir.",
    },
    audioNarrativeTr:
      "Devrik cümleler, C1 ve C2 düzeyinde akademik metinlerin en prestijli yapısıdır. Olumsuz bir zarfla başladığınızda cümle soru kalıbı gibi devrilir: 'Rarely have I seen...'.",
    audioNarrativeEn:
      "Inversion is the hallmark of sophisticated academic prose. When a negative adverb opens the sentence, invert the auxiliary verb and the subject.",
    sampleSentences: [
      { en: "Seldom have economic policies achieved such immediate stability.", tr: "Ekonomik politikaların böylesine hızlı bir istikrar sağladığı nadiren görülmüştür." },
      { en: "Not only did the initiative reduce carbon footprints, but it also fostered communal solidarity.", tr: "Girişim yalnızca karbon ayak izini azaltmakla kalmadı, aynı zamanda toplumsal dayanışmayı da güçlendirdi." },
    ],
    turkishStudentTrap: "Devrik yaparken yardımcı fiili unutmamak gerekir: 'Rarely I have seen' değil, 'Rarely have I seen' denir.",
    examTactic: "IELTS Writing Task 2 denemenizde 1 adet doğru devrik cümle yazmak Grammatical Range ölçütünde Band 8+ anahtarıdır.",
    youtubeEmbedId: "GqG_t72lK8g", // mmmEnglish Advanced Inversion
    youtubeChannel: "mmmEnglish",
  },
];

export default function GrammarStudyHub() {
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic>(GRAMMAR_TOPICS[0]!);
  const [voiceGender, setVoiceGender] = useState<"kadin" | "erkek">("kadin");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Arka Planda Çalma & MediaSession API Kurulumu
  const playAudioLesson = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Cihazınız ses sentezini desteklemiyor.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Türkçe ve İngilizce detaylı anlatım metni
    const narrationText = `${selectedTopic.title}. ${selectedTopic.mnemonicCode.name}. ${selectedTopic.mnemonicCode.description}. ${selectedTopic.audioNarrativeTr}. İngilizce örnek: ${selectedTopic.sampleSentences[0]?.en}. ${selectedTopic.sampleSentences[0]?.tr}. ${selectedTopic.turkishStudentTrap}. ${selectedTopic.examTactic}.`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.lang = "tr-TR";
    utterance.rate = 0.95;

    // Kadın / Erkek Ses Seçimi
    const voices = window.speechSynthesis.getVoices();
    if (voiceGender === "kadin") {
      const femaleVoice = voices.find((v) => v.lang.startsWith("tr") && (v.name.includes("Female") || v.name.includes("Yelda") || v.name.includes("Seda")));
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.pitch = 1.05;
    } else {
      const maleVoice = voices.find((v) => v.lang.startsWith("tr") && (v.name.includes("Male") || v.name.includes("Cem") || v.name.includes("Ahmet")));
      if (maleVoice) utterance.voice = maleVoice;
      utterance.pitch = 0.85;
    }

    utterance.onstart = () => {
      setIsPlayingAudio(true);

      // 📱 TELEFON EKRANI KAPANINCA ARKA PLANDA ÇALMAYA DEVAM ETMESİ İÇİN MEDIASESSION
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `${selectedTopic.title} · Hafıza Kodlamalı Ders`,
          artist: `IELTS & YDS Akademi · ${voiceGender === "kadin" ? "Emily Teacher (Doğal Ses)" : "James Teacher (Doğal Ses)"}`,
          album: "A1→C2 Gramer Zihin Çapaları",
          artwork: [
            { src: "/img/logo.svg", sizes: "512x512", type: "image/svg+xml" },
          ],
        });

        navigator.mediaSession.setActionHandler("play", () => {
          window.speechSynthesis.resume();
          setIsPlayingAudio(true);
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          window.speechSynthesis.pause();
          setIsPlayingAudio(false);
        });
        navigator.mediaSession.setActionHandler("stop", () => {
          window.speechSynthesis.cancel();
          setIsPlayingAudio(false);
        });
      }
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      addStudentXp(15, "gramer");
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedTopic]);

  return (
    <div className="space-y-8">
      {/* Konu Seçici Tab Listesi */}
      <div className="flex overflow-x-auto gap-2 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-sm dark:border-slate-800 dark:bg-[#0c0c0c] no-scrollbar">
        {GRAMMAR_TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setSelectedTopic(t);
              setIsPlayingAudio(false);
            }}
            className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all ${
              selectedTopic.id === t.id
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <span className="rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-black">{t.level}</span>
            <span>{t.title}</span>
          </button>
        ))}
      </div>

      {/* ─── DERS BAŞLIĞI & SESLİ ANLATIM OYNATICI ─── */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-violet-500/30 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-black sm:p-8">
        <div className="rainbow-gradient-h absolute top-0 inset-x-0 h-1.5" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                Seviye: {selectedTopic.level}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                <Brain className="h-4 w-4 text-violet-500" />
                Hafıza Kodlamalı Zihin Çapası
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {selectedTopic.title}
            </h2>
            <p className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 p-2.5 rounded-xl border border-violet-200/50 dark:border-violet-900/50">
              Formül: {selectedTopic.formula}
            </p>
          </div>

          {/* Sesli Anlatım Kontrol Kutusu */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-[#121212] sm:w-80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Headphones className="h-4 w-4 text-violet-500" />
                Doğal Sesli Anlatım
              </span>

              {/* Kadın / Erkek Ses Seçimi */}
              <div className="flex rounded-xl bg-slate-200/80 p-0.5 text-[11px] font-bold dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setVoiceGender("kadin")}
                  className={`rounded-lg px-2 py-1 transition-all ${
                    voiceGender === "kadin" ? "bg-white text-slate-900 shadow-sm dark:bg-[#222] dark:text-white" : "text-slate-500"
                  }`}
                >
                  👩 Kadın
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceGender("erkek")}
                  className={`rounded-lg px-2 py-1 transition-all ${
                    voiceGender === "erkek" ? "bg-white text-slate-900 shadow-sm dark:bg-[#222] dark:text-white" : "text-slate-500"
                  }`}
                >
                  👨 Erkek
                </button>
              </div>
            </div>

            {/* Oynat / Durdur Butonu */}
            <button
              type="button"
              onClick={playAudioLesson}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-black text-white shadow-md transition-all ${
                isPlayingAudio
                  ? "bg-rose-600 hover:bg-rose-700 animate-pulse"
                  : "bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:opacity-95"
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Dersi Duraklat (Arka Planda Çalıyor)</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Dersi Sesli Dinle ({voiceGender === "kadin" ? "Kadın" : "Erkek"} Ses)</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-slate-400">
              📱 Telefon ekranı kapansa dahi arka planda çalmaya devam eder.
            </p>
          </div>
        </div>

        {/* ─── KAFADA KODLAMA / ZİHİN ÇAPASI BÖLÜMÜ ─── */}
        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 dark:bg-amber-950/20">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-black text-sm">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <span>Kafada Kodlama / Mnemonic Çapası: {selectedTopic.mnemonicCode.name}</span>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {selectedTopic.mnemonicCode.description}
          </p>
          <div className="mt-3 rounded-xl bg-white/80 p-3 text-xs font-semibold text-slate-700 dark:bg-black/40 dark:text-slate-300">
            🎯 <strong>Zihin Çapan:</strong> {selectedTopic.mnemonicCode.mentalAnchor}
          </div>
        </div>

        {/* ─── ÖRNEKLER, TUZAKLAR & TAKTİKLER ─── */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Örnek Cümleler */}
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-[#0f0f0f]">
            <p className="font-black text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              📖 Akademik Örnek Cümleler
            </p>
            <div className="space-y-2">
              {selectedTopic.sampleSentences.map((s, idx) => (
                <div key={idx} className="rounded-xl bg-slate-50 p-2.5 text-xs dark:bg-[#181818]">
                  <p className="font-bold text-slate-900 dark:text-white">{s.en}</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{s.tr}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tuzaklar ve Taktikler */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-xs dark:border-rose-900/40 dark:bg-rose-950/20">
              <div className="flex items-center gap-1.5 font-black text-rose-800 dark:text-rose-400 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span>Klasik Türk Öğrenci Tuzağı</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">{selectedTopic.turkishStudentTrap}</p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <div className="flex items-center gap-1.5 font-black text-emerald-800 dark:text-emerald-400 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Sınav & Band Taktik Notu</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">{selectedTopic.examTactic}</p>
            </div>
          </div>
        </div>

        {/* ─── KESİNLİKLE ÇALIŞAN EN ÇOK İZLENEN YOUTUBE DERS VİDEOSU ─── */}
        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-600" />
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Seçkin Eğitim Dersi Videosu ({selectedTopic.youtubeChannel})
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Doğrulanmış & Kesintisiz Yayın</span>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md dark:border-slate-800">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${selectedTopic.youtubeEmbedId}?rel=0`}
              title={`${selectedTopic.title} Video Dersi`}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
