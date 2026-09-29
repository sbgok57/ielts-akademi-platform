"use client";

// src/components/ExamTimer.tsx
// Sınav Geriye Sayım Sayacı (180 dk YDS / IELTS veya Soru Sayısına Göre Seviye Tespit Sayacı)

import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, Pause, Play, RotateCcw } from "lucide-react";

interface Props {
  initialMinutes?: number;
  questionCount?: number;
  examTitle?: string;
  onTimeUp?: () => void;
}

export default function ExamTimer({
  initialMinutes = 180,
  questionCount,
  examTitle = "Resmî Süreli Sınav Oturumu",
  onTimeUp,
}: Props) {
  // Eğer soru sayısı verilmişse soru başı 1.5 dakika hesapla
  const totalDurationSeconds = questionCount
    ? Math.round(questionCount * 90) // 1.5 dakika = 90 saniye
    : initialMinutes * 60;

  const [secondsLeft, setSecondsLeft] = useState(totalDurationSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, onTimeUp]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const progressPct = Math.round((secondsLeft / totalDurationSeconds) * 100);
  const isUrgent = secondsLeft < 300; // Son 5 dakika

  return (
    <div
      className={`rounded-2xl border p-4 transition-all shadow-sm ${
        isUrgent
          ? "border-rose-500 bg-rose-50 text-rose-950 dark:bg-rose-950/30 dark:text-rose-200 animate-pulse"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-[#121212]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className={`h-5 w-5 ${isUrgent ? "text-rose-600 animate-spin" : "text-amber-500"}`} />
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {examTitle}
            </p>
            {questionCount && (
              <p className="text-[11px] text-slate-400">
                {questionCount} Soru · Soru Başına 1.5 Dakika Standart Süre
              </p>
            )}
          </div>
        </div>

        {/* Dijital Zaman Göstergesi */}
        <div className="flex items-center gap-3">
          <div className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-slate-900 dark:text-white">
            {hours > 0 && <span>{String(hours).padStart(2, "0")}:</span>}
            <span>{String(minutes).padStart(2, "0")}</span>:
            <span>{String(seconds).padStart(2, "0")}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            title={isRunning ? "Sayacı Duraklat" : "Sayacı Başlat"}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Süre İlerleme Çubuğu */}
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isUrgent ? "bg-rose-600" : "bg-gradient-to-r from-amber-500 to-rose-500"
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {isUrgent && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Dikkat: Sınav sürenizin sonuna yaklaştınız! Lütfen yanıtlarınızı kontrol edin.</span>
        </div>
      )}
    </div>
  );
}
