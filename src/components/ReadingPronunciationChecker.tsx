"use client";

// src/components/ReadingPronunciationChecker.tsx
// Reading Modülü Sesli Okuma & Telaffuz Değerlendirme Sistemi
// Doğru kelimeler YEŞİL (Green), yanlış/atlanan kelimeler KIRMIZI (Red).

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  HelpCircle,
} from "lucide-react";
import { addStudentXp } from "@/lib/progress-store";

interface Props {
  targetSentence?: string;
}

export default function ReadingPronunciationChecker({
  targetSentence = "Green roofs cool buildings in summer and keep heat inside during winter.",
}: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState("");
  const [analyzedWords, setAnalyzedWords] = useState<
    { word: string; status: "correct" | "incorrect" | "pending" }[]
  >([]);
  const [scorePct, setScorePct] = useState<number | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Cümleyi kelimelerine ayır
  useEffect(() => {
    const rawWords = targetSentence
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    setAnalyzedWords(rawWords.map((w) => ({ word: w, status: "pending" })));
    setScorePct(null);
    setAiFeedback(null);
    setSpokenTranscript("");
  }, [targetSentence]);

  // Web Speech Tanıma
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) return;

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-GB"; // Cambridge İngilizcesi

      rec.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setSpokenTranscript(transcript);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Tarayıcınız ses tanımayı desteklemiyor. Google Chrome kullanmanız önerilir.");
      return;
    }

    setSpokenTranscript("");
    setScorePct(null);
    setAiFeedback(null);
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const stopListeningAndEvaluate = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);

    // Telaffuz Analizi (Yeşil / Kırmızı Karşılaştırması)
    const targetClean = targetSentence
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    const spokenClean = spokenTranscript
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    let correctCount = 0;
    const evaluated = targetClean.map((targetWord) => {
      // Öğrenci bu kelimeyi doğru söyledi mi?
      const isMatch = spokenClean.some(
        (spk) => spk === targetWord || targetWord.includes(spk) || spk.includes(targetWord)
      );

      if (isMatch) correctCount++;
      return {
        word: targetWord,
        status: (isMatch ? "correct" : "incorrect") as "correct" | "incorrect",
      };
    });

    setAnalyzedWords(evaluated);

    const calculatedScore = Math.round((correctCount / Math.max(1, targetClean.length)) * 100);
    setScorePct(calculatedScore);

    // Samimi Yapay Zekâ Geribildirimi
    if (calculatedScore >= 80) {
      setAiFeedback(
        `Harika bir telaffuz ve akıcılık! 🌟 Telaffuz doğruluğun %${calculatedScore}. Tüm anahtar kelimeleri net bir ritimle söyledin. (+20 XP kazandın!)`
      );
      addStudentXp(20, "okuma");
    } else if (calculatedScore >= 50) {
      setAiFeedback(
        `Çok iyi bir deneme! 👍 Telaffuz doğruluğun %${calculatedScore}. Kırmızı ile işaretlenen kelimelerin üzerine tıklayarak doğru seslendirilişini dinleyebilir ve tekrar deneyebilirsin.`
      );
      addStudentXp(10, "okuma");
    } else {
      setAiFeedback(
        `Biraz daha yavaş ve tane tane okumayı deneyelim 💛 Kırmızı kelimeleri hoparlör simgesine basarak dinleyip tekrar oku, birlikte başaracağız!`
      );
    }
  };

  // Tekil kelimeyi seslendirme
  const playWordAudio = (word: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = "en-GB";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="rounded-3xl border-2 border-emerald-500/30 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-[#0d0d0d] sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Mic className="h-3.5 w-3.5 text-emerald-600" />
            Yapay Zekâ Telaffuz & Sesli Okuma Testi
          </span>
          <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white">
            Cümleyi Sesli Oku & Telaffuzunu Değerlendir
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mikrofona basarak aşağıdaki cümleyi İngilizce oku. Doğru okunan kelimeler <strong>YEŞİL</strong>, hatalı veya atlananlar <strong>KIRMIZI</strong> olacaktır.
          </p>
        </div>

        {/* Mikrofon Kontrol Düğmesi */}
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button
              type="button"
              onClick={startListening}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-xs font-black text-white shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Mic className="h-4 w-4" />
              <span>Sesli Okumaya Başla</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopListeningAndEvaluate}
              className="flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-xs font-black text-white shadow-md shadow-rose-500/30 animate-pulse hover:bg-rose-700"
            >
              <MicOff className="h-4 w-4" />
              <span>Okumayı Bitir & Değerlendir</span>
            </button>
          )}
        </div>
      </div>

      {/* Hedef Cümle ve Kelime Analiz Kartı */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-[#141414]">
        <p className="text-xs font-bold text-slate-400 mb-2">Okunacak Cümle (Kelimelere tıklayarak telaffuzunu dinleyebilirsin):</p>

        <div className="flex flex-wrap gap-2 text-base sm:text-lg font-bold">
          {analyzedWords.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => playWordAudio(item.word)}
              title="Doğru telaffuzunu dinlemek için tıkla"
              className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 transition-all ${
                item.status === "correct"
                  ? "bg-emerald-500 text-white shadow-sm font-black scale-105"
                  : item.status === "incorrect"
                  ? "bg-rose-600 text-white shadow-sm font-black"
                  : "bg-white text-slate-800 hover:bg-slate-200 dark:bg-[#202020] dark:text-slate-100 dark:hover:bg-[#2a2a2a]"
              }`}
            >
              <span>{item.word}</span>
              {item.status === "correct" && <CheckCircle2 className="h-3.5 w-3.5" />}
              {item.status === "incorrect" && <XCircle className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Canlı Dinleme Durumu */}
      {isRecording && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Sizi dinliyorum... (Cümleyi tane tane okuyun)</span>
          </div>
          {spokenTranscript && (
            <span className="italic text-slate-600 dark:text-slate-300 truncate max-w-xs">
              &quot;{spokenTranscript}&quot;
            </span>
          )}
        </div>
      )}

      {/* Skor ve Yapay Zekâ Samimi Değerlendirmesi */}
      {scorePct !== null && aiFeedback && (
        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 p-4 dark:bg-black/60 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Lumi Yapay Zekâ Telaffuz Koçu
            </span>
            <span className="rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-black text-white">
              Doğruluk: %{scorePct}
            </span>
          </div>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            {aiFeedback}
          </p>
        </div>
      )}
    </div>
  );
}
