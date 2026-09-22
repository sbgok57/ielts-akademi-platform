"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageSquare, X, Sparkles } from "lucide-react";

interface LumiBubbleProps {
  tutorName?: string;
  avatarSrc?: string;
  initialMessage?: string;
}

export default function LumiBubble({
  tutorName = "Lumi",
  avatarSrc = "/lumi/lumi-avatar.svg",
  initialMessage = "Merhaba! Ben Lumi 🌟 IELTS Akademi'ye hoş geldin. Takıldığın her kuralda ve soruda buradayım!",
}: LumiBubbleProps) {
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [chatPreviewOpen, setChatPreviewOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-subside bubble after 10s if not interacted
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <aside
      aria-label={`${tutorName} Yardımcısı`}
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3"
    >
      {/* Konuşma Baloncuğu */}
      {bubbleOpen && !chatPreviewOpen && (
        <div
          role="status"
          className="relative max-w-xs animate-bounce-subtle rounded-3xl border border-brand-1/20 bg-bg-soft/95 p-4 shadow-xl backdrop-blur-md dark:border-brand-1/30 dark:bg-bg-elevated/90"
        >
          <button
            type="button"
            onClick={() => setBubbleOpen(false)}
            aria-label="Baloncuğu kapat"
            className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-border text-foreground-muted hover:bg-brand-1 hover:text-white transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 mt-0.5 text-brand-4 shrink-0" />
            <p className="text-xs font-medium leading-relaxed text-foreground">
              {initialMessage}
            </p>
          </div>
          <div className="mt-2.5 flex justify-end">
            <button
              type="button"
              onClick={() => setChatPreviewOpen(true)}
              className="rounded-full bg-brand-1/10 px-3 py-1 text-[11px] font-bold text-brand-1 hover:bg-brand-1/20 transition dark:text-brand-3"
            >
              Lumi&apos;ye bir şey sor 💬
            </button>
          </div>
        </div>
      )}

      {/* Mini Etkileşim Kartı */}
      {chatPreviewOpen && (
        <div className="w-[min(90vw,360px)] overflow-hidden rounded-3xl border border-brand-1/30 bg-bg-soft shadow-2xl backdrop-blur-lg dark:bg-bg-elevated">
          <header className="flex items-center justify-between gradient-brand px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white/20 p-0.5">
                <Image
                  src={avatarSrc}
                  alt={tutorName}
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-extrabold">{tutorName} 🌟</h4>
                <p className="text-[10px] opacity-90">IELTS & İngilizce Koçun</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChatPreviewOpen(false)}
              aria-label="Kapat"
              className="rounded-lg p-1 hover:bg-white/20 transition text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </header>
          <div className="p-4 text-xs space-y-3">
            <p className="rounded-2xl bg-bg p-3 text-foreground leading-relaxed">
              &ldquo;IELTS yolculuğunda hata yapmak suç değil, antrenmandır. Bugün birlikte nereyi geliştirelim?&rdquo;
            </p>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                Hızlı Başlangıç
              </span>
              {[
                "Bugün 20 dakikam var, ne çalışayım?",
                "Present Simple ile Present Continuous farkı nedir?",
                "IELTS Band 7 için kelime taktiği ver",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    alert(`Lumi: "${suggestion}" sorusu P4 fazında canlı streaming AI katmanına bağlanacaktır.`);
                  }}
                  className="w-full text-left rounded-xl border border-border bg-bg/50 px-3 py-2 text-[11px] font-semibold text-foreground hover:border-brand-1/50 hover:bg-brand-1/5 transition"
                >
                  ⚡ {suggestion}
                </button>
              ))}
            </div>
          </div>
          <footer className="border-t border-border px-4 py-2.5 text-[10px] text-foreground-muted text-center">
            P4 aşamasında tam sesli &amp; streaming sohbet katmanı devreye girecektir.
          </footer>
        </div>
      )}

      {/* Ana Lumi Düğmesi */}
      <button
        type="button"
        onClick={() => {
          if (!chatPreviewOpen) {
            setChatPreviewOpen(true);
            setBubbleOpen(false);
          } else {
            setChatPreviewOpen(false);
          }
        }}
        aria-label={`${tutorName} ile sohbet et`}
        className="group relative flex h-16 w-16 items-center justify-center rounded-full gradient-brand p-1 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-brand-1/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-1/30"
      >
        <span
          className="absolute inset-0 -z-10 animate-ping rounded-full bg-brand-1/30"
          aria-hidden="true"
        />
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white/10 backdrop-blur-[1px]">
          <Image
            src={avatarSrc}
            alt={tutorName}
            width={44}
            height={44}
            className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </button>
    </aside>
  );
}
