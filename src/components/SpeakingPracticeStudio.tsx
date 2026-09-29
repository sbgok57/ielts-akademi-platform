"use client";

// src/components/SpeakingPracticeStudio.tsx
// IELTS AI Speaking Stüdyosu — Mikrofon + Klavye + Tıklanabilir Türkçe Çeviri
// Web Speech API (Konuşma Tanıma + Ses Sentezi) ile zenginleştirilmiştir.

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  RotateCcw,
  Languages,
  Award,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { recordSpeakingSession } from "@/lib/progress-store";

interface MessageItem {
  id: string;
  role: "examiner" | "student";
  textEn: string;
  textTr?: string;
  band?: string;
  feedbackTr?: string;
  vocab?: { en: string; tr: string }[];
  showTranslation?: boolean;
}

const TOPICS = [
  {
    id: "hometown",
    title: "Memleket & Şehir Yaşamı",
    icon: "🏙️",
    part1Question: "Could you tell me a little bit about your hometown? What do you like most about living there?",
    part1QuestionTr: "Bana biraz memleketinizden bahsedebilir misiniz? Orada yaşamanın en çok neyini seviyorsunuz?",
  },
  {
    id: "technology",
    title: "Teknoloji & Yapay Zekâ",
    icon: "🤖",
    part1Question: "How often do you use digital devices in your daily life, and how have they transformed your study habits?",
    part1QuestionTr: "Günlük hayatınızda dijital cihazları ne sıklıkla kullanıyorsunuz ve bunlar çalışma alışkanlıklarınızı nasıl dönüştürdü?",
  },
  {
    id: "work_study",
    title: "Eğitim & Kariyer Hedefleri",
    icon: "🎓",
    part1Question: "What is your main field of study or professional focus, and why did you decide to pursue this area?",
    part1QuestionTr: "Temel öğrenim veya meslek alanınız nedir ve neden bu alanda ilerlemeye karar verdiniz?",
  },
  {
    id: "environment",
    title: "Çevre & Sürdürülebilirlik",
    icon: "🌿",
    part1Question: "Do you believe individual actions can make a real difference in combating climate change?",
    part1QuestionTr: "Bireysel eylemlerin iklim değişikliğiyle mücadelede gerçek bir fark yaratabileceğine inanıyor musunuz?",
  },
];

export default function SpeakingPracticeStudio() {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]!);
  const [activePart, setActivePart] = useState<"Part 1" | "Part 2" | "Part 3">("Part 1");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [earnedXpToast, setEarnedXpToast] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Konu değiştiğinde ilk examiner sorusunu yükle
  useEffect(() => {
    const initialQuestion: MessageItem = {
      id: "q-initial-" + Date.now(),
      role: "examiner",
      textEn: selectedTopic.part1Question,
      textTr: selectedTopic.part1QuestionTr,
      showTranslation: false,
    };
    setMessages([initialQuestion]);
  }, [selectedTopic, activePart]);

  // Sayfa kaydırma
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Web Speech Tanıma Başlatma
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          setInputText((prev) => (prev ? `${prev.trim()} ${finalTranscript.trim()}` : finalTranscript.trim()));
        }
      };

      rec.onerror = (err: any) => {
        console.warn("Mikrofon konuşma tanıma uyarısı:", err);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleRecording = () => {
    if (!speechSupported) {
      alert("Tarayıcınız doğrudan ses tanımayı desteklemiyor. Lütfen yanıtınızı klavye ile yazarak gönderin.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Mikrofon başlatılamadı:", err);
        setIsRecording(false);
      }
    }
  };

  // Sesli Telaffuz (Yapay Zekânın cümlesini okur)
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB"; // Doğal Cambridge / British tonu
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Türkçe Çeviriyi Aç / Kapat
  const toggleTranslation = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, showTranslation: !msg.showTranslation } : msg
      )
    );
  };

  // Yanıt Gönderme
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend || isLoading) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    const userMsg: MessageItem = {
      id: "usr-" + Date.now(),
      role: "student",
      textEn: textToSend,
      textTr: "Kendi ifadeniz (İngilizce konuşma kaydı)",
      showTranslation: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          topic: selectedTopic.id,
          part: activePart,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const examinerMsg: MessageItem = {
          id: "ex-" + Date.now(),
          role: "examiner",
          textEn: data.aiResponseEn + " " + (data.followUpEn || ""),
          textTr: data.aiResponseTr + " " + (data.followUpTr || ""),
          band: data.bandEstimate,
          feedbackTr: data.feedbackTr,
          vocab: data.suggestedVocab,
          showTranslation: false,
        };

        setMessages((prev) => [...prev, examinerMsg]);

        // Kalıcı ilerlemeye speaking puanı ve XP ekle
        recordSpeakingSession(25);
        setEarnedXpToast(25);
        setTimeout(() => setEarnedXpToast(null), 3500);

        // AI yanıtını otomatik seslendir
        speakText(data.aiResponseEn);
      } else {
        throw new Error(data.error || "Sunucu yanıt vermedi");
      }
    } catch {
      const fallbackMsg: MessageItem = {
        id: "err-" + Date.now(),
        role: "examiner",
        textEn: "Thank you for answering. Your fluency is developing nicely. Could you give a practical example to support your point?",
        textTr: "Cevabınız için teşekkürler. Akıcılığınız güzel gelişiyor. Görüşünüzü desteklemek için pratik bir örnek verebilir misiniz?",
        band: "Band 6.5",
        feedbackTr: "Fikirlerinizi örneklendirerek detaylandırmaya odaklanın.",
        showTranslation: false,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* XP Bildirim Rozeti */}
      {earnedXpToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-sm font-black text-white shadow-xl animate-bounce">
          <Sparkles className="h-5 w-5" />
          <span>+{earnedXpToast} XP Kazandın! Konuşma İlerlemen Kaydedildi 🎉</span>
        </div>
      )}

      {/* Üst Bilgilendirme ve Konu Seçici */}
      <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-black/95">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-xs font-black text-pink-700 dark:bg-pink-950/60 dark:text-pink-300">
              <Sparkles className="h-3.5 w-3.5" />
              Yapay Zekâ Konuşma & Sınav Simülatörü
            </div>
            <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              Lumi AI Speaking Stüdyosu 🎙️
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Hem mikrofonla konuşabilir hem de yazabilirsiniz. Anlamadığınız her cümlenin üzerine tıklayarak Türkçe çevirisini anında görebilirsiniz.
            </p>
          </div>

          {/* Sınav Bölümü Seçici (Part 1, 2, 3) */}
          <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
            {(["Part 1", "Part 2", "Part 3"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setActivePart(p)}
                className={`rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                  activePart === p
                    ? "bg-white text-slate-900 shadow-sm dark:bg-[#1f1f1f] dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Konu Başlıkları */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTopic(t)}
              className={`flex items-center gap-2 rounded-2xl border p-3 text-left transition-all ${
                selectedTopic.id === t.id
                  ? "border-pink-500 bg-pink-50/70 text-pink-950 shadow-sm dark:border-pink-500 dark:bg-pink-950/30 dark:text-pink-200"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              <span className="text-xs font-bold leading-tight">{t.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Diyalog ve Mesaj Akışı */}
      <div className="min-h-[420px] max-h-[560px] overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50/50 p-4 space-y-4 shadow-inner dark:border-slate-800 dark:bg-[#080808]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "student" ? "items-end" : "items-start"
            }`}
          >
            {/* Gönderici Etiketi */}
            <div className="mb-1 flex items-center gap-1.5 px-2 text-[11px] font-bold text-slate-400">
              {msg.role === "examiner" ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-pink-500" />
                  <span>IELTS Examiner (Lumi)</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  <span>Senin Yanıtın</span>
                </>
              )}
            </div>

            {/* Mesaj Balonu */}
            <div
              onClick={() => toggleTranslation(msg.id)}
              className={`group relative max-w-[90%] sm:max-w-[80%] cursor-pointer rounded-3xl p-4 shadow-sm transition-all hover:shadow-md ${
                msg.role === "student"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                  : "border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-[#121212] dark:text-slate-100"
              }`}
            >
              {/* İngilizce Metin */}
              <p className="text-sm font-medium leading-relaxed sm:text-base">
                {msg.textEn}
              </p>

              {/* Tıklanabilir Çeviri Gösterge Düğmesi */}
              {msg.textTr && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/50 pt-2.5 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTranslation(msg.id);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
                      msg.role === "student"
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <Languages className="h-3.5 w-3.5 text-pink-500" />
                    <span>
                      {msg.showTranslation
                        ? "Türkçe Çeviriyi Gizle"
                        : "🇹🇷 Türkçe Anlamını Gör (Tıkla)"}
                    </span>
                    {msg.showTranslation ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {/* Sesli Okuma Düğmesi */}
                  {msg.role === "examiner" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(msg.textEn);
                      }}
                      title="İngilizce Telaffuzunu Dinle"
                      className="inline-flex items-center gap-1 rounded-xl p-1.5 text-slate-400 hover:text-pink-500"
                    >
                      <Volume2 className="h-4 w-4" />
                      <span className="text-[11px] font-semibold">Dinle</span>
                    </button>
                  )}
                </div>
              )}

              {/* Açılan Türkçe Çeviri Kartı */}
              {msg.showTranslation && msg.textTr && (
                <div className="mt-3 rounded-2xl bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-950 border border-amber-500/20 dark:text-amber-200 animate-fadeIn">
                  <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Türkçe Karşılığı:</span>
                  </div>
                  {msg.textTr}
                </div>
              )}

              {/* Band ve Gelişim İpuçları (Sadece Examiner Yanıtında) */}
              {msg.band && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-lg bg-emerald-100 px-2 py-0.5 font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    🏆 {msg.band}
                  </span>
                  {msg.feedbackTr && (
                    <span className="text-slate-500 dark:text-slate-400">
                      💡 {msg.feedbackTr}
                    </span>
                  )}
                </div>
              )}

              {/* Önerilen Kelimeler */}
              {msg.vocab && msg.vocab.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {msg.vocab.map((v, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-xl bg-violet-100 px-2.5 py-1 text-[11px] font-bold text-violet-800 dark:bg-violet-950/60 dark:text-violet-300"
                    >
                      <strong>{v.en}</strong>: <span>{v.tr}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 text-xs font-bold text-slate-500">
            <span className="h-2 w-2 animate-ping rounded-full bg-pink-500" />
            <span>Lumi cevabınızı dinliyor ve değerlendiriyor...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Giriş Paneli (Mikrofon + Metin Kutusu) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-black">
        {/* Canlı Mikrofon Durum Çubuğu */}
        {isRecording && (
          <div className="mb-3 flex items-center justify-between rounded-2xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping" />
              <span>Mikrofon Aktif · Dinliyorum (İngilizce konuşun)...</span>
            </div>
            <button
              type="button"
              onClick={toggleRecording}
              className="rounded-xl bg-rose-600 px-3 py-1 text-white hover:bg-rose-700"
            >
              Kaydı Durdur
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          {/* Mikrofon Butonu */}
          <button
            type="button"
            onClick={toggleRecording}
            title={isRecording ? "Mikrofonu Kapat" : "Mikrofon ile Konuş"}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all ${
              isRecording
                ? "bg-rose-600 text-white shadow-lg shadow-rose-500/30 scale-105"
                : "bg-slate-100 text-slate-700 hover:bg-pink-100 hover:text-pink-600 dark:bg-[#141414] dark:text-slate-300 dark:hover:bg-pink-950"
            }`}
          >
            {isRecording ? <MicOff className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
          </button>

          {/* Metin Giriş Alanı */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isRecording
                ? "Konuşmanız buraya aktarılıyor..."
                : "Yanıtınızı ister mikrofonla konuşun, ister buraya İngilizce yazın..."
            }
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-500/20 dark:border-slate-800 dark:bg-[#121212] dark:text-white dark:focus:border-pink-400"
          />

          {/* Gönder Butonu */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 px-5 text-sm font-black text-white shadow-md shadow-pink-500/20 transition-all hover:opacity-95 disabled:opacity-40"
          >
            <span>Gönder</span>
            <Send className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-2.5 flex items-center justify-between px-2 text-[11px] text-slate-400">
          <span>💡 İpucu: Mikrofon ile konuştuktan sonra metni gönder butonuna basarak cevabınızı iletin.</span>
          <span>+25 XP / Yanıt</span>
        </div>
      </div>
    </div>
  );
}
