"use client";

// src/components/VocabularyVaultExplorer.tsx
// 1,000+ IELTS & YDS Kelime Envanteri — 7 Doğal Aksan (Kadın/Erkek) + Eş Anlamlılar + Arama

import React, { useState, useEffect } from "react";
import {
  Search,
  Volume2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Filter,
  Layers,
  Globe,
} from "lucide-react";
import { addStudentXp } from "@/lib/progress-store";

export interface WordItem {
  id: string;
  kelime: string;
  tur?: string;
  tr: string;
  enTanim?: string;
  es: string;
  ornEn: string;
  ornTr: string;
  seviye: string;
  alan?: string;
}

const ACCENTS = [
  { code: "en-GB", label: "İngiliz (British)", flag: "🇬🇧" },
  { code: "en-US", label: "Amerikan (American)", flag: "🇺🇸" },
  { code: "en-AU", label: "Avustralya (Australian)", flag: "🇦🇺" },
  { code: "en-CA", label: "Kanada (Canadian)", flag: "🇨🇦" },
  { code: "en-IE", label: "İrlanda (Irish)", flag: "🇮🇪" },
  { code: "en-NZ", label: "Yeni Zelanda (NZ)", flag: "🇳🇿" },
  { code: "en-GB-scotland", label: "İskoçya (Scottish)", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
];

export default function VocabularyVaultExplorer() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("Tümü");
  const [selectedAccent, setSelectedAccent] = useState(ACCENTS[0]!);
  const [voiceGender, setVoiceGender] = useState<"kadin" | "erkek">("kadin");
  const [learnedMap, setLearnedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // 1000+ kelimelik resmi derlenmiş sözlük JSON'unu yükle
    async function loadVocab() {
      try {
        const res = await fetch("/data/site/kelime/kelime-01.json");
        if (res.ok) {
          const data = await res.json();
          // Map to WordItem
          const mapped: WordItem[] = data.map((item: any, idx: number) => ({
            id: item.id || `w-${idx}`,
            kelime: item.kelime || item.term || "vocabulary",
            tur: item.tur || "v.",
            tr: item.trAnlam || item.meaningTr || item.tr || "",
            enTanim: item.enTanim || item.definitionEn || "",
            es: item.esAnlam || item.synonyms || "synonym",
            ornEn: item.ornekEn || item.exampleEn || item.orn || "",
            ornTr: item.ornekTr || item.exampleTr || "",
            seviye: item.seviye || "B2",
            alan: item.alan || "Akademik",
          }));
          setWords(mapped);
        }
      } catch (err) {
        console.error("Kelime yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVocab();
  }, []);

  const filtered = words.filter((w) => {
    const matchLevel = selectedLevel === "Tümü" || w.seviye === selectedLevel;
    const matchSearch =
      w.kelime.toLowerCase().includes(search.toLowerCase()) ||
      w.tr.toLowerCase().includes(search.toLowerCase()) ||
      w.es.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  // 7 Aksan & Kadın/Erkek Ses Sentezi
  const playWordPronunciation = (word: string, exampleSentence?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const textToSpeak = exampleSentence ? `${word}. ${exampleSentence}` : word;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = selectedAccent.code.startsWith("en-GB-scotland") ? "en-GB" : selectedAccent.code;
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const targetLangVoices = voices.filter((v) => v.lang.startsWith(utterance.lang));

    if (voiceGender === "kadin") {
      const f = targetLangVoices.find((v) => v.name.includes("Female") || v.name.includes("Victoria") || v.name.includes("Samantha"));
      if (f) utterance.voice = f;
      utterance.pitch = 1.05;
    } else {
      const m = targetLangVoices.find((v) => v.name.includes("Male") || v.name.includes("Daniel") || v.name.includes("Oliver"));
      if (m) utterance.voice = m;
      utterance.pitch = 0.88;
    }

    window.speechSynthesis.speak(utterance);
  };

  const markLearned = (wordId: string) => {
    setLearnedMap((prev) => {
      const next = !prev[wordId];
      if (next) addStudentXp(10, "kelime");
      return { ...prev, [wordId]: next };
    });
  };

  return (
    <div className="space-y-6">
      {/* Kontrol & Aksan Çubuğu */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0c0c0c] space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-purple-600 dark:text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>1,000+ IELTS & YDS Kelime Envanteri</span>
            </div>
            <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              Akademik Kelime Hazinesi 📚
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cambridge, Oxford, Macmillan, Dilko ve Akın Dil standartlarında A1&apos;den C2&apos;ye tüm kritik kelimeler.
            </p>
          </div>

          {/* 7 Aksan & Kadın/Erkek Seçici */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Aksan Açılır Menüsü */}
            <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold dark:border-slate-800 dark:bg-[#141414]">
              <Globe className="h-3.5 w-3.5 text-purple-500" />
              <select
                value={selectedAccent.code}
                onChange={(e) => {
                  const acc = ACCENTS.find((a) => a.code === e.target.value);
                  if (acc) setSelectedAccent(acc);
                }}
                className="bg-transparent outline-none cursor-pointer font-bold text-slate-700 dark:text-slate-200"
              >
                {ACCENTS.map((a) => (
                  <option key={a.code} value={a.code} className="dark:bg-[#141414]">
                    {a.flag} {a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Kadın / Erkek */}
            <div className="flex rounded-xl bg-slate-100 p-0.5 text-xs font-bold dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setVoiceGender("kadin")}
                className={`rounded-lg px-2.5 py-1 transition-all ${
                  voiceGender === "kadin" ? "bg-white text-slate-900 shadow-sm dark:bg-[#222] dark:text-white" : "text-slate-500"
                }`}
              >
                👩 Kadın
              </button>
              <button
                type="button"
                onClick={() => setVoiceGender("erkek")}
                className={`rounded-lg px-2.5 py-1 transition-all ${
                  voiceGender === "erkek" ? "bg-white text-slate-900 shadow-sm dark:bg-[#222] dark:text-white" : "text-slate-500"
                }`}
              >
                👨 Erkek
              </button>
            </div>
          </div>
        </div>

        {/* Arama & Seviye Filtreleri */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İngilizce kelime, Türkçe anlam veya eş anlamlı ara..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-xs font-medium text-slate-900 outline-none transition focus:border-purple-500 dark:border-slate-800 dark:bg-[#141414] dark:text-white"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>

          <div className="flex overflow-x-auto gap-1.5 no-scrollbar">
            {["Tümü", "A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                  selectedLevel === lvl
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kelime Kartları Izgarası */}
      {loading ? (
        <div className="p-12 text-center text-sm font-bold text-slate-400">
          Kelime envanteri yükleniyor...
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 150).map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl border p-5 shadow-sm transition-all hover:shadow-md ${
                learnedMap[item.id]
                  ? "border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0f0f0f]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-purple-600 dark:text-purple-400">
                      {item.kelime}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {item.tur}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                    🇹🇷 {item.tr}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <span className="rounded-lg bg-purple-100 px-2 py-0.5 text-[11px] font-black text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    {item.seviye}
                  </span>
                  <button
                    type="button"
                    onClick={() => playWordPronunciation(item.kelime, item.ornEn)}
                    title={`${selectedAccent.label} (${voiceGender}) ile Dinle`}
                    className="rounded-xl p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {item.enTanim && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  {item.enTanim}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-1 text-[11px]">
                <span className="font-bold text-slate-400">Eş Anlamlı:</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {item.es}
                </span>
              </div>

              {item.ornEn && (
                <div className="mt-3 rounded-2xl bg-slate-50 p-2.5 text-xs text-slate-700 dark:bg-[#161616] dark:text-slate-300">
                  <p className="font-semibold italic">&ldquo;{item.ornEn}&rdquo;</p>
                  {item.ornTr && <p className="mt-1 text-[11px] text-slate-400">{item.ornTr}</p>}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-semibold">{item.alan}</span>
                <button
                  type="button"
                  onClick={() => markLearned(item.id)}
                  className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
                    learnedMap[item.id]
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-purple-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{learnedMap[item.id] ? "Öğrenildi (+10 XP)" : "Öğrendim Olarak İşaretle"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
