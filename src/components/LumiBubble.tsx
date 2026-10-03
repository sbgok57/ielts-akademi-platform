"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Sparkles, Send, Volume2, RotateCcw } from "lucide-react";

interface LumiBubbleProps {
  tutorName?: string;
  avatarSrc?: string;
  initialMessage?: string;
}

interface ChatMessage {
  id: string;
  role: "lumi" | "user";
  text: string;
  sources?: { title: string; href: string }[];
}

const QUICK_SUGGESTIONS = [
  "Beginner (A1) seviyesindeyim, nereden başlayayım?",
  "Bugün 20 dakikam var, ne çalışayım?",
  "Present Simple ile Present Continuous farkı nedir?",
  "IELTS Band 7 için kelime taktiği ver",
  "Speaking sınavında heyecanımı nasıl yenerim?",
];

export default function LumiBubble({
  tutorName = "Lumi",
  avatarSrc = "/lumi/lumi-avatar.svg",
  initialMessage = "Merhaba! Ben Lumi 🌟 IELTS Akademi'ye hoş geldin. Takıldığın her kuralda ve soruda buradayım!",
}: LumiBubbleProps) {
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [chatPreviewOpen, setChatPreviewOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "lumi",
      text: initialMessage,
      sources: [
        { title: "Gramer Akademi", href: "/gramer" },
        { title: "Kelime Hazinesi", href: "/kelime" },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (chatPreviewOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatPreviewOpen, loading]);

  // Sesli okuma
  const speakText = (text: string) => {
    // SAFETY: Browser desteğini kontrol et
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`[\]()]/g, "");
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      // Varsa Türkçe veya İngilizce ses seç
      const voices = window.speechSynthesis.getVoices();
      const trVoice = voices.find((v) => v.lang.includes("tr"));
      if (trVoice) utterance.voice = trVoice;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Sessizce yut
    }
  };

  const handleSend = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || loading) return;

    setInputVal("");
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/lumi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) throw new Error("Lumi API response not ok");

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `l-${Date.now()}`,
        role: "lumi",
        text: data.answer || data.delta || "Harika bir soru! Platformdaki ilgili modülden detaylıca çalışabilirsin.",
        sources: data.sources || [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // SAFETY: Offline fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `l-${Date.now()}`,
          role: "lumi",
          text: `Harika bir soru sordun! 🌟 Bu konu için platformumuzun ilgili modüllerini inceleyebilirsin.`,
          sources: [
            { title: "Gramer Akademi", href: "/gramer" },
            { title: "Kelime Hazinesi", href: "/kelime" },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "lumi",
        text: initialMessage,
        sources: [
          { title: "Gramer Akademi", href: "/gramer" },
          { title: "Kelime Hazinesi", href: "/kelime" },
        ],
      },
    ]);
  };

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
              onClick={() => {
                setChatPreviewOpen(true);
                setBubbleOpen(false);
              }}
              className="rounded-full bg-brand-1/10 px-3 py-1 text-[11px] font-bold text-brand-1 hover:bg-brand-1/20 transition dark:text-brand-3"
            >
              Lumi&apos;ye bir şey sor 💬
            </button>
          </div>
        </div>
      )}

      {/* İnteraktif Lumi Sohbet Penceresi */}
      {chatPreviewOpen && (
        <div className="flex flex-col w-[min(92vw,390px)] h-[520px] max-h-[82vh] overflow-hidden rounded-3xl border border-brand-1/30 bg-bg-soft shadow-2xl backdrop-blur-lg dark:bg-bg-elevated">
          {/* Başlık */}
          <header className="flex items-center justify-between gradient-brand px-4 py-3 text-white shrink-0">
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
                <h4 className="text-sm font-extrabold flex items-center gap-1">
                  <span>{tutorName}</span>
                  <span className="text-xs">🌟</span>
                </h4>
                <p className="text-[10px] opacity-90">IELTS &amp; İngilizce Koçun</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                title="Sohbeti Sıfırla"
                aria-label="Sohbeti Sıfırla"
                className="rounded-lg p-1.5 hover:bg-white/20 transition text-white/90"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setChatPreviewOpen(false)}
                aria-label="Kapat"
                className="rounded-lg p-1.5 hover:bg-white/20 transition text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Mesaj Akışı */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand-1 text-white shadow-sm"
                      : "bg-bg border border-border text-foreground shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Kaynak bağlantıları */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-border/50 flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-bold opacity-75">Önerilen Modül:</span>
                      {m.sources.map((s, idx) => (
                        <Link
                          key={idx}
                          href={s.href}
                          onClick={() => setChatPreviewOpen(false)}
                          className="inline-flex items-center gap-1 rounded-md bg-brand-1/10 px-2 py-0.5 text-[10px] font-bold text-brand-1 hover:bg-brand-1/20 transition"
                        >
                          <span>{s.title}</span>
                          <span>→</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lumi sesli okuma düğmesi */}
                {m.role === "lumi" && (
                  <button
                    type="button"
                    onClick={() => speakText(m.text)}
                    title="Sesli Dinle"
                    className="mt-1 flex items-center gap-1 text-[10px] text-foreground-muted hover:text-brand-1 transition px-1"
                  >
                    <Volume2 className="h-3 w-3" />
                    <span>Dinle</span>
                  </button>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-foreground-muted text-xs p-2">
                <span className="h-2 w-2 rounded-full bg-brand-1 animate-ping" />
                <span>Lumi düşünüyor ve hazırlıyor...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Hızlı Başlangıç Butonları */}
          <div className="px-3 py-2 bg-bg/50 border-t border-border/50 flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_SUGGESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSend(q)}
                disabled={loading}
                className="shrink-0 rounded-full border border-border bg-bg-soft px-2.5 py-1 text-[10px] font-semibold text-foreground-muted hover:border-brand-1 hover:text-brand-1 transition disabled:opacity-50"
              >
                ⚡ {q.length > 28 ? q.slice(0, 26) + "..." : q}
              </button>
            ))}
          </div>

          {/* Soru Giriş Alanı */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="p-3 border-t border-border bg-bg-soft flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Lumi'ye soru sor veya konu danış..."
              disabled={loading}
              className="flex-1 rounded-xl border border-border bg-bg px-3 py-2 text-xs text-foreground placeholder:text-foreground-muted focus:border-brand-1 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              aria-label="Gönder"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-1 text-white hover:opacity-90 disabled:opacity-40 transition shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
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
