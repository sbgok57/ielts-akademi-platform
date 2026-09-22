"use client";
// ROZET KUTLAMASI — havai fişek + konfeti + rozet sembolü + yazı (ZORUNLU DENEYİM)
// Bağımlılık yok; partikül motoru dosya içinde. Erişilebilirlik: prefers-reduced-motion
// için statik kutlama, Esc/Enter ile atlama, kuyrukla sıralı gösterim.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface BadgeCelebrationData {
  code: string; nameTr: string; descriptionTr: string; xpReward: number;
  iconSrc: string; gifSrc?: string | null;
  tier?: "bronze" | "silver" | "gold" | "platinum" | "legendary";
  celebrate?: { fireworks?: boolean; confetti?: boolean; durationMs?: number; sound?: string };
}
interface Props { queue: BadgeCelebrationData[]; onSeen?: (code: string) => void; soundEnabled?: boolean; }

const TIER_COLORS: Record<string, string[]> = {
  bronze: ["#C97B3C", "#E9A86A", "#FFD9B0"], silver: ["#8E9AAF", "#C9D1DC", "#F2F5F9"],
  gold: ["#D4A017", "#FFD54A", "#FFF3C4"], platinum: ["#37C6D0", "#9BE7EF", "#E6FBFF"],
  legendary: ["#7C3AED", "#EC4899", "#FBBF24"],
};

export default function BadgeFireworks({ queue, onSeen, soundEnabled = false }: Props) {
  const [index, setIndex] = useState(0);
  const current = queue[index];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const duration = current?.celebrate?.durationMs ?? 6000;
  const palette = useMemo(() => TIER_COLORS[current?.tier ?? "gold"] ?? TIER_COLORS.gold!, [current?.tier]);

  const next = useCallback(() => {
    if (!current) return;
    onSeen?.(current.code);
    setIndex((i) => (i + 1 < queue.length ? i + 1 : queue.length));
  }, [current, onSeen, queue.length]);

  useEffect(() => { if (!current) return; const t = setTimeout(next, duration); return () => clearTimeout(t); }, [current, duration, next]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") next(); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [next]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !current || reduced) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); window.addEventListener("resize", resize);

    type P = { x:number;y:number;vx:number;vy:number;life:number;maxLife:number;color:string;size:number;shape:"spark"|"confetti";rot:number;vr:number };
    const particles: P[] = [];
    const burst = (x:number, y:number, opts?: { count?: number; confetti?: boolean }) => {
      const count = opts?.count ?? 90;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2, speed = 1.5 + Math.random() * 5.5;
        particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.2, life: 0,
          maxLife: 55 + Math.random() * 45, color: palette[Math.floor(Math.random() * palette.length)]!,
          size: 1.6 + Math.random() * 2.6, shape: opts?.confetti && Math.random() > 0.4 ? "confetti" : "spark",
          rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3 });
      }
    };
    const confettiRain = () => {
      for (let i = 0; i < 60; i++) particles.push({
        x: Math.random() * innerWidth, y: -20 - Math.random() * 80, vx: (Math.random() - 0.5) * 1.2,
        vy: 1.4 + Math.random() * 2.2, life: 0, maxLife: 200, color: palette[Math.floor(Math.random() * palette.length)]!,
        size: 3 + Math.random() * 3, shape: "confetti", rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.25 });
    };
    // En az 3 patlama dalgası + konfeti yağmuru
    burst(innerWidth * 0.5, innerHeight * 0.42, { count: 120 });
    const t1 = setTimeout(() => burst(innerWidth * 0.22, innerHeight * 0.55, { confetti: true }), 600);
    const t2 = setTimeout(() => burst(innerWidth * 0.78, innerHeight * 0.5, { confetti: true }), 1250);
    const t3 = setTimeout(confettiRain, 400);
    const t4 = setTimeout(confettiRain, 2400);

    const frame = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.life++; p.vx *= 0.992; p.vy = p.vy * 0.992 + 0.055; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        if (alpha <= 0 || p.y > innerHeight + 40) { particles.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = p.color; ctx.translate(p.x, p.y);
        if (p.shape === "confetti") { ctx.rotate(p.rot); ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size); }
        else { ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill();
               ctx.globalAlpha = alpha * 0.25; ctx.beginPath(); ctx.arc(0, 0, p.size * 2.6, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); window.removeEventListener("resize", resize); };
  }, [current, palette, reduced]);

  useEffect(() => {
    if (!soundEnabled || !current) return;
    const src = current.celebrate?.sound === "fanfare" ? "/audio/sfx/fanfare.mp3" : "/audio/sfx/level-up.mp3";
    const audio = new Audio(src); audio.volume = 0.5;
    void audio.play().catch(() => {});
    return () => audio.pause();
  }, [current, soundEnabled]);

  if (!current) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={"Rozet kazandın: " + current.nameTr}
      className="fixed inset-0 z-[999] flex items-center justify-center" onClick={next}>
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
      <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(circle at 50% 42%," + palette[1] + "40 0%, transparent 58%)" }} />
      {!reduced && <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />}
      <div className="relative z-10 w-[min(92vw,420px)] rounded-3xl border border-white/20 p-6 text-center shadow-2xl"
        style={{ background: "linear-gradient(160deg," + palette[0] + "F2, #1B1046F2)", animation: "badgePop .55s cubic-bezier(.2,1.3,.3,1)" }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">Rozet Kazandın!</p>
        <div className="relative mx-auto my-4 h-32 w-32">
          <div className="absolute inset-0 animate-ping rounded-full opacity-30" style={{ background: palette[1] }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.gifSrc || current.iconSrc} alt={current.nameTr}
            className="relative h-full w-full object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,.45)]" />
        </div>
        <h3 className="text-2xl font-extrabold text-white">{current.nameTr}</h3>
        <p className="mt-1 text-sm text-white/85">{current.descriptionTr}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white">⭐ +{current.xpReward} XP</div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={(e) => { e.stopPropagation(); void shareBadge(current); }}
            className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 transition hover:scale-[1.03]">📤 Paylaş</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); location.assign("/vitrin"); }}
            className="rounded-xl bg-white/20 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/30">🏅 Vitrine git</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); next(); }}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-white/80 underline-offset-2 hover:underline">Atla (Esc)</button>
        </div>
        {queue.length > 1 && <p className="mt-3 text-xs text-white/70">🎁 {queue.length - index - 1} rozet daha sırada!</p>}
      </div>
      <style jsx global>{"@keyframes badgePop{0%{transform:scale(.55) rotate(-4deg);opacity:0}60%{transform:scale(1.06) rotate(1.5deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}@media (prefers-reduced-motion: reduce){@keyframes badgePop{from{opacity:0}to{opacity:1}}}"}</style>
    </div>
  );
}

/** 1080×1080 paylaşım kartı üretir ve indirir / Web Share ile paylaşır. */
async function shareBadge(badge: BadgeCelebrationData): Promise<void> {
  const size = 1080;
  const canvas = document.createElement("canvas"); canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d"); if (!ctx) return;
  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, "#7C3AED"); g.addColorStop(0.5, "#EC4899"); g.addColorStop(1, "#06B6D4");
  ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 60 + 8, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = "#ffffff"; ctx.textAlign = "center";
  ctx.font = "700 44px Inter, system-ui, sans-serif"; ctx.fillText("ROZET KAZANDIM!", size / 2, 190);
  try {
    const img = new Image(); img.crossOrigin = "anonymous"; img.src = badge.iconSrc;
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
    ctx.drawImage(img, size / 2 - 170, 250, 340, 340);
  } catch { /* görsel yoksa metinle devam */ }
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 62px Inter, system-ui, sans-serif"; ctx.fillText(badge.nameTr, size / 2, 700);
  ctx.font = "500 36px Inter, system-ui, sans-serif"; ctx.fillText(badge.descriptionTr.slice(0, 46), size / 2, 762);
  ctx.font = "700 40px Inter, system-ui, sans-serif"; ctx.fillText("⭐ +" + badge.xpReward + " XP", size / 2, 850);
  ctx.font = "500 30px Inter, system-ui, sans-serif"; ctx.fillText("IELTS Akademi · Lumi ile çalışıyorum", size / 2, 960);
  const blob: Blob | null = await new Promise((res) => canvas.toBlob((b) => res(b), "image/png"));
  if (!blob) return;
  const file = new File([blob], "rozet-" + badge.code + ".png", { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
  if (nav.canShare?.({ files: [file] })) { try { await navigator.share({ files: [file], title: badge.nameTr }); return; } catch {} }
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = file.name; a.click(); URL.revokeObjectURL(url);
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
