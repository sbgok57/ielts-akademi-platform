"use client";

// src/components/LevelUpModal.tsx
// Seviye Atlama Sınavı & Bitirme Sertifikası Kazanma Modali
// Öğrencinin seviye atlamasını ve resmi renkli geçerli sertifika almasını sağlar.

import React, { useState } from "react";
import {
  Award,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Flame,
} from "lucide-react";
import {
  advanceStudentLevel,
  StudentCertificate,
  CEFR_METADATA,
  CEFRLevel,
  getLevelFromNumber,
} from "@/lib/progress-store";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentCefr: CEFRLevel;
  currentLevelNumber: number;
  xpTotal: number;
  studentName: string;
  onLevelUpSuccess: (newCert: StudentCertificate) => void;
}

// Seviyelere özel atlama soruları
const LEVEL_EXAMS: Record<CEFRLevel, {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}[]> = {
  A1: [
    {
      question: "Which sentence correctly expresses a habitual daily action in English?",
      options: ["I am works every morning.", "I work at the central office every day.", "I working every day.", "I has worked now."],
      correct: 1,
      explanation: "Geniş zamanda (Present Simple) birinci tekil şahısta fiil yalın halde (work) kullanılır.",
    },
    {
      question: "What is the correct negative form of 'She likes tea'?",
      options: ["She doesn't likes tea.", "She don't like tea.", "She doesn't like tea.", "She not like tea."],
      correct: 2,
      explanation: "'Doesn't' yardımcı fiilinden sonra asıl fiil yalın gelir: 'doesn't like'.",
    },
  ],
  A2: [
    {
      question: "Choose the sentence that correctly uses the Present Perfect tense:",
      options: ["I have visited London two years ago.", "I have already finished my assignment.", "She has saw the movie yesterday.", "They has lived here."],
      correct: 1,
      explanation: "Present Perfect'te 'already' ile have/has + V3 (finished) kullanılır.",
    },
  ],
  B1: [
    {
      question: "Which connector best illustrates contrast in academic writing?",
      options: ["Furthermore", "In contrast", "Consequently", "Similarly"],
      correct: 1,
      explanation: "'In contrast' iki durum arasındaki zıtlığı belirtir.",
    },
  ],
  B2: [
    {
      question: "Select the sentence with accurate conditional inversion:",
      options: ["Had governments acted sooner, the crisis would have been mitigated.", "If governments had acted, the crisis would mitigated.", "Had governments act sooner, it had mitigated.", "If had governments acted sooner."],
      correct: 0,
      explanation: "Type 3 Inversion: Had + subject + V3.",
    },
  ],
  C1: [
    {
      question: "Which idiom reflects 'profoundly changing existing rules'?",
      options: ["A piece of cake", "A paradigm shift", "Under the weather", "Spill the beans"],
      correct: 1,
      explanation: "'A paradigm shift' temel varsayımların kökten değişmesini ifade eden akademik bir terimdir.",
    },
  ],
  C2: [
    {
      question: "Identify the word closest in meaning to 'ubiquitous':",
      options: ["Ephemeral", "Omnipresent", "Pretentious", "Ambiguous"],
      correct: 1,
      explanation: "'Ubiquitous' ve 'omnipresent' her yerde var olan, yaygın anlamına gelir.",
    },
  ],
};

export default function LevelUpModal({
  isOpen,
  onClose,
  currentCefr,
  currentLevelNumber,
  studentName,
  onLevelUpSuccess,
}: Props) {
  const [step, setStep] = useState<"exam" | "awarded">("exam");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [earnedCert, setEarnedCert] = useState<StudentCertificate | null>(null);

  if (!isOpen) return null;

  const targetLevelNum = Math.min(6, currentLevelNumber + 1);
  const targetCefr = getLevelFromNumber(targetLevelNum);
  const targetMeta = CEFR_METADATA[targetCefr];
  const examQuestions = LEVEL_EXAMS[currentCefr] || LEVEL_EXAMS.A1;

  const handleAnswer = (qIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
    setErrorMsg(null);
  };

  const handleCompleteExam = () => {
    // Tüm sorular cevaplandı mı?
    if (Object.keys(selectedAnswers).length < examQuestions.length) {
      setErrorMsg("Lütfen seviye atlama sınavındaki tüm soruları işaretleyin.");
      return;
    }

    // Doğruluk kontrolü
    let allCorrect = true;
    examQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] !== q.correct) {
        allCorrect = false;
      }
    });

    if (!allCorrect) {
      setErrorMsg("Bazı cevaplar hatalı. Lütfen açıklamaları inceleyip doğru seçeneği işaretleyin.");
      return;
    }

    // Başarılı seviye atlama!
    const { newCertificate } = advanceStudentLevel();
    if (newCertificate) {
      setEarnedCert(newCertificate);
      setStep("awarded");
      onLevelUpSuccess(newCertificate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0c0c0c] sm:p-8">
        {/* Üst Gökkuşağı Çizgisi */}
        <div className="rainbow-gradient-h -mx-8 -mt-8 mb-6 h-2" />

        {/* Kapat Butonu */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {step === "exam" ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Resmi Seviye Atlama Sınavı
              </span>
              <span className="text-xs font-bold text-slate-400">
                Hedef: {targetMeta.name}
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
              Seviye Atlama & Bitirme Sertifikası 🎓
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Tebrikler {studentName}! <strong>{currentCefr}</strong> seviyesini başarıyla tamamlamak ve resmi <strong>{currentCefr} Bitirme Sertifikanı</strong> almak üzeresin.
            </p>

            {/* Sınav Soruları */}
            <div className="mt-6 space-y-5">
              {examQuestions.map((q, qIdx) => (
                <div key={qIdx} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-[#141414]">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {qIdx + 1}. {q.question}
                  </p>
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleAnswer(qIdx, optIdx)}
                        className={`w-full rounded-xl border p-2.5 text-left text-xs font-semibold transition-all ${
                          selectedAnswers[qIdx] === optIdx
                            ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200 font-bold"
                            : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {errorMsg && (
              <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleCompleteExam}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-500/20 hover:opacity-95"
              >
                <span>Sınavı Tamamla & Sertifikamı Ver</span>
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Sertifika Kazanıldı Kutlaması */
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 text-white shadow-xl animate-bounce">
              <Award className="h-10 w-10" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Tebrikler! Seviye Atladın 🎉
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong>{currentCefr}</strong> seviyesini başarıyla bitirdin ve <strong>{targetCefr}</strong> seviyesine terfi ettin. Resmi onaylı sertifikan sistemde oluşturuldu!
            </p>

            {earnedCert && (
              <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-50 to-orange-50/30 p-4 text-left dark:bg-[#141414]">
                <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-400">
                  <span>RESMİ GEÇERLİ SERTİFİKA</span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <ShieldCheck className="h-4 w-4" /> Doğrulandı
                  </span>
                </div>
                <p className="mt-1 text-base font-black text-slate-900 dark:text-white">
                  {earnedCert.levelTitle}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Öğrenci: {earnedCert.studentName}</span>
                  <span>Kod: {earnedCert.verificationCode}</span>
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              {earnedCert && (
                <Link
                  href={`/sertifika?id=${earnedCert.id}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg hover:opacity-95"
                >
                  <Award className="h-4 w-4" />
                  <span>Renkli Sertifikamı Görüntüle & Yazdır</span>
                </Link>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Panele Dön
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
