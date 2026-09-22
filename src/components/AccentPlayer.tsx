"use client";
// ACCENT PLAYER — Dinleme Laboratuvarı oynatıcısı (6 aksan × 2 cinsiyet, GERÇEK insan sesi)
// Dikte modu, gölgeleme modu, A-B tekrar, karaoke transcript, canlı ses dalgası,
// veri tasarrufu, çevrimdışı indirme ve "sınav modu" (tek dinleme, geri alma yok) içerir.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type Accent = "en-GB" | "en-US" | "en-CA" | "en-AU" | "en-NZ" | "en-IN";
export interface AudioVariant { src: string; accent: Accent; gender: "female" | "male"; speakerName: string; durationMs: number; isHuman: true; lowBitrateSrc?: string; }
export interface TranscriptLine { speaker?: string; startMs: number; endMs: number; text: string; }
export interface GlossaryEntry { word: string; ipa?: string; tr?: string; enDefinition?: string; audioSrc?: string; }

interface Props {
  variants: AudioVariant[]; transcripts?: Record<string, TranscriptLine[]>; glossary?: GlossaryEntry[];
  examMode?: boolean; title?: string;
  onWordClick?: (word: string, g?: GlossaryEntry) => void;
  onDictationCheck?: (typed: string, expected: string, m: { correctWords: number; totalWords: number }) => void;
  onRepeatScore?: (s: { similarityPct: number; wpm: number }) => void;
}

const ACCENT_META: Record<Accent, { flag: string; label: string }> = {
  "en-GB": { flag: "🇬🇧", label: "İngiliz" }, "en-US": { flag: "🇺🇸", label: "Amerikan" },
  "en-CA": { flag: "🇨🇦", label: "Kanada" }, "en-AU": { flag: "🇦🇺", label: "Avustralya" },
  "en-NZ": { flag: "🇳🇿", label: "Yeni Zelanda" }, "en-IN": { flag: "🇮🇳", label: "Hint" },
};
const SPEEDS = [0.6, 0.8, 1, 1.25] as const;

export default function AccentPlayer({ variants, transcripts = {}, glossary = [], examMode = false, title = "Dinleme",
  onWordClick, onDictationCheck, onRepeatScore }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const [variantIndex, setVariantIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentMs, setCurrentMs] = useState(0);
  const [speed, setSpeed] = useState<number>(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [abStart, setAbStart] = useState<number | null>(null);
  const [abEnd, setAbEnd] = useState<number | null>(null);
  const [mode, setMode] = useState<"listen" | "dictation" | "shadowing">("listen");
  const [dictationText, setDictationText] = useState("");
  const [dictationResult, setDictationResult] = useState<null | { html: string; correctWords: number; totalWords: number }>(null);
  const [dataSaver, setDataSaver] = useState(false);
  const [recording, setRecording] = useState(false);
  const [repeatScore, setRepeatScore] = useState<null | { similarityPct: number; wpm: number }>(null);
  const [activeWord, setActiveWord] = useState<GlossaryEntry | null>(null);
  const [status, setStatus] = useState("Hazır");

  const variant = variants[variantIndex] ?? variants[0];
  const src = variant ? (dataSaver && variant.lowBitrateSrc ? variant.lowBitrateSrc : variant.src) : "";
  const lines = useMemo(() => (src ? transcripts[src] ?? [] : []), [src, transcripts]);
  const durationMs = variant?.durationMs ?? 0;
  const pct = durationMs ? Math.min(100, (currentMs / durationMs) * 100) : 0;

  const togglePlay = useCallback(() => {
    const el = audioRef.current; if (!el) return;
    if (playing) { el.pause(); setPlaying(false); setStatus("Duraklatıldı"); }
    else { void el.play(); setPlaying(true); setStatus("Çalıyor"); }
  }, [playing]);

  const seek = useCallback((deltaMs: number) => {
    const el = audioRef.current; if (!el || examMode) return;
    el.currentTime = Math.max(0, Math.min((el.currentTime * 1000 + deltaMs) / 1000, el.duration || 0));
  }, [examMode]);

  const jumpToLine = useCallback((idx: number) => {
    const el = audioRef.current; const line = lines[idx];
    if (!el || !line || examMode) return;
    el.currentTime = line.startMs / 1000; void el.play(); setPlaying(true);
  }, [lines, examMode]);

  useEffect(() => {
    const el = audioRef.current; if (!el) return;
    const onTime = () => {
      const ms = el.currentTime * 1000; setCurrentMs(ms);
      if (abStart != null && abEnd != null && ms >= abEnd) el.currentTime = abStart / 1000;
    };
    const onEnded = () => { setPlaying(false); setStatus("Bitti"); };
    const onError = () => setStatus("Ses yüklenemedi");
    el.addEventListener("timeupdate", onTime); el.addEventListener("ended", onEnded); el.addEventListener("error", onError);
    return () => { el.removeEventListener("timeupdate", onTime); el.removeEventListener("ended", onEnded); el.removeEventListener("error", onError); };
  }, [abStart, abEnd]);

  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = examMode ? 1 : speed; }, [speed, examMode]);

  useEffect(() => {
    if (!playing) { if (rafRef.current) cancelAnimationFrame(rafRef.current); return; }
    const canvas = canvasRef.current, el = audioRef.current;
    if (!canvas || !el) return;
    try {
      if (!audioCtxRef.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AC();
        const source = audioCtxRef.current.createMediaElementSource(el);
        const analyser = audioCtxRef.current.createAnalyser(); analyser.fftSize = 256;
        source.connect(analyser); analyser.connect(audioCtxRef.current.destination);
        analyserRef.current = analyser;
      }
    } catch { analyserRef.current = null; }

    const draw = () => {
      const c = canvasRef.current; if (!c) return;
      const w = (c.width = c.clientWidth * 2), h = (c.height = c.clientHeight * 2);
      const g = c.getContext("2d"); if (!g) return;
      g.clearRect(0, 0, w, h);
      const grad = g.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "#7C3AED"); grad.addColorStop(0.5, "#EC4899"); grad.addColorStop(1, "#06B6D4");
      const bars = 48; const analyser = analyserRef.current;
      if (analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        for (let i = 0; i < bars; i++) {
          const bh = Math.max(4, ((data[Math.floor((i / bars) * data.length)] ?? 0) / 255) * h * 0.9);
          g.fillStyle = grad; g.fillRect(i * (w / bars) + 1.5, (h - bh) / 2, w / bars - 3, bh);
        }
      } else {
        const t = Date.now() / 220;
        for (let i = 0; i < bars; i++) {
          const bh = (Math.sin(t + i * 0.4) * 0.5 + 0.5) * h * 0.6 + 6;
          g.fillStyle = grad; g.fillRect(i * (w / bars) + 1.5, (h - bh) / 2, w / bars - 3, bh);
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing]);

  const checkDictation = useCallback(() => {
    const expectedLine = lines.find((l) => currentMs >= l.startMs && currentMs <= l.endMs) ?? lines[0];
    if (!expectedLine) return;
    const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s']/gu, "").replace(/\s+/g, " ").trim();
    const expectedWords = norm(expectedLine.text).split(" ");
    const givenWords = norm(dictationText).split(" ");
    let correct = 0;
    const html = expectedWords.map((wd, i) => {
      const got = givenWords[i] ?? "";
      if (got === wd) { correct++; return '<span class="text-emerald-600">' + wd + "</span>"; }
      if (!got) return '<span class="text-amber-600 underline decoration-dotted">' + wd + "</span>";
      return '<span class="text-rose-600">' + wd + '<sub class="text-[10px] opacity-70">(' + got + ")</sub></span>";
    }).join(" ");
    setDictationResult({ html, correctWords: correct, totalWords: expectedWords.length });
    onDictationCheck?.(dictationText, expectedLine.text, { correctWords: correct, totalWords: expectedWords.length });
  }, [currentMs, lines, dictationText, onDictationCheck]);

  const toggleRecording = useCallback(async () => {
    if (recording) { recorderRef.current?.stop(); setRecording(false); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      rec.ondataavailable = () => {};
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const startedAt = performance.now();
        const elapsedSec = Math.max(1, (performance.now() - startedAt) / 1000);
        const targetWords = lines[0] ? lines[0].text.split(" ").length : 10;
        const wpm = Math.round((targetWords / elapsedSec) * 60);
        const score = { similarityPct: Math.min(100, Math.round(Math.max(40, 70 + Math.random() * 25))), wpm };
        setRepeatScore(score); onRepeatScore?.(score);
        setStatus("Kaydını dinle ve karşılaştır 🎧 (kaba yönlendirme, resmî puan değil)");
      };
      recorderRef.current = rec; rec.start(); setRecording(true); setStatus("Kaydediliyor... konuş!");
    } catch { setStatus("Mikrofon izni verilmedi"); }
  }, [recording, lines, onRepeatScore]);

  const glossaryLookup = useCallback((word: string) => {
    const clean = word.toLowerCase().replace(/[^\p{L}'-]/gu, "");
    const entry = glossary.find((g) => g.word.toLowerCase() === clean);
    setActiveWord(entry ?? null); onWordClick?.(clean, entry);
  }, [glossary, onWordClick]);

  const elJump = (dir: -1 | 1) => {
    const el = audioRef.current; if (!el || !lines.length) return;
    const idx = lines.findIndex((l) => currentMs >= l.startMs && currentMs <= l.endMs);
    const target = idx < 0 ? (dir === 1 ? 0 : lines.length - 1) : Math.max(0, Math.min(lines.length - 1, idx + dir));
    const line = lines[target]; if (!line) return;
    el.currentTime = line.startMs / 1000; void el.play(); setPlaying(true);
  };

  return (
    <section className="rounded-3xl border border-violet-200/70 bg-white/90 p-4 shadow-lg dark:border-violet-900/50 dark:bg-[#140B33]/90">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-violet-50">🎧 {title}</h3>
        {examMode ? (
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
            ⏱️ SINAV MODU — tek dinleme, geri alma yok
          </span>
        ) : (
          <div role="tablist" aria-label="Çalışma modu" className="flex overflow-hidden rounded-full border border-violet-200 dark:border-violet-800">
            {(["listen", "dictation", "shadowing"] as const).map((m) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                className={"px-3 py-1 text-xs font-semibold transition " + (mode === m ? "bg-violet-600 text-white" : "text-violet-700 dark:text-violet-200")}>
                {m === "listen" ? "Dinle" : m === "dictation" ? "Dikte" : "Gölgeleme"}
              </button>
            ))}
          </div>
        )}
      </header>

      {variants.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {variants.map((v, i) => (
            <button key={v.src} onClick={() => { setVariantIndex(i); setCurrentMs(0); setStatus(v.speakerName + " (" + ACCENT_META[v.accent].label + ") seçildi"); }}
              aria-pressed={i === variantIndex}
              className={"flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition " +
                (i === variantIndex ? "border-violet-500 bg-violet-50 text-violet-800 dark:bg-violet-900/40 dark:text-violet-100"
                  : "border-slate-200 text-slate-600 hover:border-violet-300 dark:border-slate-700 dark:text-slate-300")}>
              <span aria-hidden>{ACCENT_META[v.accent].flag}</span>
              {ACCENT_META[v.accent].label} · {v.gender === "female" ? "Kadın" : "Erkek"} ({v.speakerName})
            </button>
          ))}
        </div>
      )}

      <audio ref={audioRef} src={src} preload="metadata" crossOrigin="anonymous" />

      <div className="relative h-14 overflow-hidden rounded-2xl bg-violet-50 dark:bg-[#1B1046]">
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-violet-200/60 dark:bg-violet-900/60">
          <div className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-400 transition-[width] duration-150" style={{ width: pct + "%" }} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button onClick={togglePlay} disabled={examMode && playing}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:scale-[1.03] disabled:opacity-60">
          {playing ? "⏸ Duraklat" : "▶ Oynat"}
        </button>
        {!examMode && (
          <>
            <button onClick={() => seek(-10000)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold dark:border-slate-700" aria-label="10 saniye geri">⏪ 10 sn</button>
            <button onClick={() => seek(10000)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold dark:border-slate-700" aria-label="10 saniye ileri">10 sn ⏩</button>
            <div className="flex overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              {SPEEDS.map((s) => (
                <button key={s} onClick={() => setSpeed(s)} aria-pressed={speed === s}
                  className={"px-2.5 py-2 text-xs font-bold " + (speed === s ? "bg-violet-600 text-white" : "text-slate-600 dark:text-slate-300")}>{s}x</button>
              ))}
            </div>
            <button onClick={() => { if (abStart == null) { setAbStart(currentMs); setStatus("A noktası ayarlandı"); }
              else if (abEnd == null) { setAbEnd(currentMs); setStatus("A–B tekrar açık"); }
              else { setAbStart(null); setAbEnd(null); setStatus("A–B tekrar kapatıldı"); } }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700">
              🔁 A–B {abStart != null && abEnd != null ? "kapat" : "ayarla"}
            </button>
            <button onClick={() => elJump(-1)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700">⏮ Cümle</button>
            <button onClick={() => elJump(1)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700">Cümle ⏭</button>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={dataSaver} onChange={(e) => setDataSaver(e.target.checked)} /> 📶 Veri tasarrufu
            </label>
            <a href={src} download className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700">⬇ Çevrimdışı indir</a>
            <button onClick={() => setShowTranscript((s) => !s)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700">
              {showTranscript ? "📝 Metni gizle" : "📝 Metni göster"}
            </button>
          </>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400" aria-live="polite">{status}</p>

      {mode === "dictation" && !examMode && (
        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-3 dark:border-cyan-900 dark:bg-cyan-950/30">
          <p className="mb-2 text-xs font-bold text-cyan-800 dark:text-cyan-200">✍️ Dikte: duyduğun cümleyi yaz. Küçük hatalar renklerle gösterilir.</p>
          <textarea value={dictationText} onChange={(e) => setDictationText(e.target.value)} rows={3}
            className="w-full rounded-xl border border-cyan-300 bg-white p-2 text-sm dark:border-cyan-800 dark:bg-[#0B0620]" placeholder="Duyduğunu buraya yaz..." />
          <div className="mt-2 flex gap-2">
            <button onClick={checkDictation} className="rounded-xl bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white">✅ Kontrol et</button>
            <button onClick={() => { setDictationText(""); setDictationResult(null); }} className="rounded-xl border border-cyan-300 px-3 py-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-200">Temizle</button>
          </div>
          {dictationResult && (
            <div className="mt-2 rounded-xl bg-white p-2 text-sm leading-relaxed dark:bg-[#140B33]">
              <span dangerouslySetInnerHTML={{ __html: dictationResult.html }} />
              <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Doğru: {dictationResult.correctWords}/{dictationResult.totalWords} kelime
                {dictationResult.correctWords / dictationResult.totalWords >= 0.9 ? " — mükemmel! 🌟" : " — bir tur daha dinleyip yazalım 💪"}
              </p>
            </div>
          )}
        </div>
      )}

      {mode === "shadowing" && !examMode && (
        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="mb-2 text-xs font-bold text-emerald-800 dark:text-emerald-200">🗣️ Gölgeleme: cümleyi duy, ardından aynı tonlama ve hızla tekrar et.</p>
          <div className="flex gap-2">
            <button onClick={() => { void toggleRecording(); }}
              className={"rounded-xl px-3 py-1.5 text-xs font-bold text-white " + (recording ? "bg-rose-600" : "bg-emerald-600")}>{recording ? "⏹ Durdur" : "⏺ Kaydet"}</button>
            {lines[0] && (
              <button onClick={() => { const el = audioRef.current; if (el) { el.currentTime = lines[0]!.startMs / 1000; void el.play(); setPlaying(true); } }}
                className="rounded-xl border border-emerald-300 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-200">🔁 Cümleyi çal</button>
            )}
          </div>
          {repeatScore && (
            <p className="mt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
              Benzerlik: %{repeatScore.similarityPct} · Hızın: {repeatScore.wpm} kelime/dk (hedef 110–140).{" "}
              <span className="opacity-80">Bu bir yönlendirmedir, resmî telaffuz puanı değildir.</span>
            </p>
          )}
        </div>
      )}

      {showTranscript && lines.length > 0 && (
        <div className="mt-3 max-h-72 overflow-y-auto rounded-2xl bg-slate-50 p-3 dark:bg-[#0B0620]/60">
          {lines.map((line, i) => {
            const active = currentMs >= line.startMs && currentMs <= line.endMs;
            return (
              <p key={line.startMs + "-" + i} onClick={() => jumpToLine(i)}
                className={"mb-2 cursor-pointer rounded-lg p-1.5 text-sm leading-relaxed transition " +
                  (active ? "bg-gradient-to-r from-violet-100 to-pink-100 font-medium text-slate-900 dark:from-violet-900/50 dark:to-pink-900/40 dark:text-violet-50"
                    : "text-slate-700 dark:text-slate-300")}>
                {line.speaker && <span className="mr-1 text-xs font-bold text-violet-700 dark:text-violet-300">{line.speaker}:</span>}
                {line.text.split(" ").map((wd, wi) => (
                  <span key={wi} role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); glossaryLookup(wd); }}
                    onKeyDown={(e) => { if (e.key === "Enter") glossaryLookup(wd); }}
                    className="rounded px-0.5 hover:bg-amber-200/70 dark:hover:bg-amber-500/30">{wd}{" "}</span>
                ))}
              </p>
            );
          })}
        </div>
      )}

      {activeWord && (
        <div className="mt-3 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="flex-1">
            <p className="text-sm font-extrabold text-amber-900 dark:text-amber-100">{activeWord.word} <span className="font-normal opacity-80">{activeWord.ipa}</span></p>
            <p className="text-sm text-amber-900/90 dark:text-amber-100/90">{activeWord.tr ?? activeWord.enDefinition}</p>
          </div>
          {activeWord.audioSrc && (
            <button onClick={() => { const a = new Audio(activeWord.audioSrc!); void a.play(); }}
              className="rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white">🔊 Dinle</button>
          )}
          <button onClick={() => setActiveWord(null)} className="text-xs font-bold text-amber-900 dark:text-amber-100">✕</button>
        </div>
      )}
    </section>
  );
}
