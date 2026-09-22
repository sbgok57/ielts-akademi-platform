"use client";
// LUMI 🌟 — sağ altta sabit duran yapay zekâ öğretmen yardımcısı
// Kaynaklı cevap, 👎/hata bildir akışı, streaming, sayfa bağlamı, ⌘K, mobil sheet,
// sürüklenebilir, erişilebilir. Sunucu: POST /api/ai/tutor (system prompt: src/lib/ai/system-prompt.ts)
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface ChatMessage { id: string; role: "user" | "assistant"; content: string;
  sources?: { title: string; href?: string; kind?: "lesson" | "tactic" | "vocab" | "resource" }[]; pending?: boolean; }
export interface TutorContext { route: string; contentId?: string; contentTitle?: string; selection?: string; cefrLevel?: string; }
interface Props { context: TutorContext; tutorName?: string; avatarSrc?: string; starterPrompts?: string[]; onOpenTeacherAsk?: (m: ChatMessage) => void; }

const DEFAULT_STARTERS = ["Bu soruyu neden yanlış yaptım?", "Bu konuyu A1 seviyesinde anlatır mısın?",
  "Bana 5 tane daha pratik soru ver", "Bugün 20 dakikam var, ne çalışayım?"];

export default function LumiChat({ context, tutorName = "Lumi", avatarSrc = "/lumi/lumi-avatar.svg",
  starterPrompts = DEFAULT_STARTERS, onOpenTeacherAsk }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedbackOpenFor, setFeedbackOpenFor] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [hasNewHint, setHasNewHint] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  const greet = useMemo<ChatMessage>(() => ({ id: "welcome", role: "assistant",
    content: "Merhaba! Ben " + tutorName + " 🌟 Bu sayfada sana yardımcı olabilirim. Bir kuralı merak ediyorsan ya da \"şimdi ne çalışayım?\" diyorsan buradayım. Emin olmadığım bir şey olursa \"bunu doğrulayamadım\" derim — sana yanlış bir şey öğretmek istemem 💛" }), [tutorName]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => { if (open) { setMessages((m) => (m.length === 0 ? [greet] : m)); setHasNewHint(false); setTimeout(() => inputRef.current?.focus(), 60); } }, [open, greet]);
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (context.contentId) setHasNewHint(true); }, [context.contentId]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim(); if (!trimmed || busy) return;
    setInput("");
    const userMsg: ChatMessage = { id: "u-" + Date.now(), role: "user", content: trimmed };
    const assistantId = "a-" + Date.now();
    setMessages((m) => [...m, userMsg, { id: assistantId, role: "assistant", content: "", pending: true }]);
    setBusy(true);
    try {
      const res = await fetch("/api/ai/tutor", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, context: { ...context, history: messages.slice(-8).map((m) => ({ role: m.role, content: m.content })) } }) });
      if (!res.ok || !res.body) throw new Error("tutor failed");
      const reader = res.body.getReader(); const decoder = new TextDecoder();
      let acc = ""; let sources: ChatMessage["sources"] = [];
      for (;;) {
        const { value, done } = await reader.read(); if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const raw of chunk.split("\n\n")) {
          const line = raw.trim(); if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim(); if (payload === "[DONE]") continue;
          try { const json = JSON.parse(payload) as { delta?: string; sources?: ChatMessage["sources"] };
            if (json.delta) acc += json.delta; if (json.sources) sources = json.sources; } catch { acc += payload; }
        }
        setMessages((m) => m.map((msg) => (msg.id === assistantId ? { ...msg, content: acc, sources, pending: false } : msg)));
      }
      setMessages((m) => m.map((msg) => (msg.id === assistantId ? { ...msg, content: acc || "🤔 Cevap üretemedim, tekrar dener misin?", sources, pending: false } : msg)));
    } catch {
      setMessages((m) => m.map((msg) => msg.id === assistantId
        ? { ...msg, pending: false, content: "İnternet bağlantısında bir sorun oldu 😕 Bağlantı gelince tekrar dener misin? Bu arada ilgili dersi açıp birlikte bakabiliriz." } : msg));
    } finally { setBusy(false); }
  }, [busy, context, messages]);

  const sendFeedback = useCallback(async (messageId: string, rating: 1 | -1, note?: string) => {
    try { await fetch("/api/ai/tutor/feedback", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, rating, note }) }); } catch {}
    setFeedbackOpenFor(null); setFeedbackNote("");
    setMessages((m) => [...m, { id: "sys-" + Date.now(), role: "assistant",
      content: rating === -1 ? "Bildirdiğin için teşekkürler! 🙏 Bu cevabı öğretmeninle birlikte inceleyip düzeltiyoruz; aynı soru bir daha yanlış cevaplanmayacak."
        : "Harika, bunu duymak güzel! 🌟 Devam edelim mi?" }]);
  }, []);

  return (
    <>
      {!open && (
        <div className="fixed bottom-5 right-5 z-[900] flex items-end gap-2" style={{ transform: "translate(" + pos.x + "px," + pos.y + "px)" }}>
          {hasNewHint && (
            <div className="mb-3 max-w-[220px] rounded-2xl border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-800 shadow-xl dark:border-violet-800 dark:bg-[#1B1046] dark:text-violet-100">
              Bu sayfada takıldığın bir yer var mı? Buradayım! 💬
            </div>
          )}
          <button onClick={() => setOpen(true)} aria-label={tutorName + " ile konuş (Ctrl+K)"}
            className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-violet-600 via-pink-500 to-amber-400 shadow-2xl transition hover:scale-105">
            <span className="absolute inset-0 animate-ping rounded-full bg-violet-400/40" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatarSrc} alt="" className="relative h-11 w-11" />
          </button>
        </div>
      )}

      {open && (
        <div role="dialog" aria-label={tutorName + " sohbeti"}
          className="fixed inset-x-0 bottom-0 z-[950] flex h-[85vh] flex-col overflow-hidden rounded-t-3xl border border-violet-200 bg-white shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:h-[min(620px,80vh)] sm:w-[400px] sm:rounded-3xl dark:border-violet-800 dark:bg-[#0F0828]"
          style={{ transform: "translate(" + pos.x + "px," + pos.y + "px)" }}>
          <header
            onPointerDown={(e) => { dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y }; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
            onPointerMove={(e) => { if (!dragRef.current) return; setPos({ x: dragRef.current.baseX + (e.clientX - dragRef.current.startX), y: dragRef.current.baseY + (e.clientY - dragRef.current.startY) }); }}
            onPointerUp={() => { dragRef.current = null; }}
            className="flex cursor-grab items-center gap-3 bg-gradient-to-r from-violet-600 via-pink-500 to-amber-400 px-4 py-3 text-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatarSrc} alt="" className="h-9 w-9 drop-shadow" />
            <div className="flex-1">
              <p className="text-sm font-extrabold leading-tight">{tutorName} <span className="opacity-80">· yardımcın</span></p>
              <p className="text-[11px] opacity-90">{context.contentTitle ? "📖 " + context.contentTitle : "Sorunu yaz, birlikte çözelim"}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Kapat (Esc)" className="rounded-lg px-2 py-1 text-lg font-bold hover:bg-white/20">✕</button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3" aria-live="polite" aria-busy={busy}>
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={"max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed " +
                  (m.role === "user" ? "bg-gradient-to-br from-violet-600 to-pink-500 text-white" : "bg-slate-100 text-slate-800 dark:bg-[#1B1046] dark:text-violet-50")}>
                  <div className="whitespace-pre-wrap">{m.content || (m.pending ? "…" : "")}</div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 space-y-1 border-t border-black/10 pt-2 dark:border-white/10">
                      <p className="text-[11px] font-bold opacity-80">📚 Kaynaklar</p>
                      {m.sources.map((s, i) => (
                        <a key={i} href={s.href ?? "#"} className="block truncate text-[11px] underline opacity-90 hover:opacity-100">
                          {s.kind === "lesson" ? "📖" : s.kind === "tactic" ? "🎯" : s.kind === "vocab" ? "📚" : "🔗"} {s.title}
                        </a>
                      ))}
                    </div>
                  )}
                  {m.role === "assistant" && !m.pending && m.id !== "welcome" && !m.id.startsWith("sys-") && (
                    <div className="mt-2 flex items-center gap-2 border-t border-black/10 pt-1.5 text-[11px] dark:border-white/10">
                      <button onClick={() => void sendFeedback(m.id, 1)} className="font-bold opacity-80 hover:opacity-100">👍 Doğru</button>
                      <button onClick={() => setFeedbackOpenFor(m.id)} className="font-bold opacity-80 hover:opacity-100">👎 Hata var</button>
                      {onOpenTeacherAsk && (
                        <button onClick={() => onOpenTeacherAsk(m)} className="ml-auto font-bold text-violet-700 hover:underline dark:text-violet-300">👩‍🏫 Öğretmene sor</button>
                      )}
                    </div>
                  )}
                  {feedbackOpenFor === m.id && (
                    <div className="mt-2 rounded-xl bg-white/80 p-2 dark:bg-black/30">
                      <textarea value={feedbackNote} onChange={(e) => setFeedbackNote(e.target.value)} rows={2}
                        placeholder="Neyi yanlış buldun? (ör. 'Present Perfect açıklaması hatalı')"
                        className="w-full rounded-lg border border-slate-300 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-[#0B0620] dark:text-violet-50" />
                      <div className="mt-1 flex gap-2">
                        <button onClick={() => void sendFeedback(m.id, -1, feedbackNote)} className="rounded-lg bg-rose-600 px-2 py-1 text-[11px] font-bold text-white">Gönder</button>
                        <button onClick={() => setFeedbackOpenFor(null)} className="rounded-lg border px-2 py-1 text-[11px] font-bold">İptal</button>
                      </div>
                      <p className="mt-1 text-[10px] opacity-70">Bildirimin öğretmene gider; düzeltme bilgi tabanına eklenir. 💛</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {messages.length <= 1 && (
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Hızlı başlangıç</p>
                {starterPrompts.map((p) => (
                  <button key={p} onClick={() => void send(p)}
                    className="block w-full rounded-xl border border-violet-200 bg-violet-50/70 px-3 py-2 text-left text-xs font-semibold text-violet-800 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-100">{p}</button>
                ))}
              </div>
            )}
          </div>

          <footer className="border-t border-slate-200 p-3 dark:border-violet-900/60">
            <div className="flex items-end gap-2">
              <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(input); } }} rows={1}
                placeholder={tutorName + "'ye bir şey sor... (Enter = gönder)"}
                className="max-h-28 flex-1 resize-none rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400 dark:border-violet-800 dark:bg-[#140B33] dark:text-violet-50" />
              <button onClick={() => void send(input)} disabled={busy || !input.trim()}
                className="rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-[1.03] disabled:opacity-50">
                {busy ? "…" : "Gönder"}
              </button>
            </div>
            <p className="mt-1.5 text-[10px] leading-snug text-slate-500 dark:text-slate-400">
              {tutorName} hata yapabilir; emin olmadığında bunu söyler ve kaynak gösterir. Band/puan tahminleri gerekçeli ve aralıklıdır.
            </p>
          </footer>
        </div>
      )}
    </>
  );
}
