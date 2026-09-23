#!/usr/bin/env node
/* ==========================================================================
 *  TEK-YAMA.mjs — IELTS Akademi SİTE ONARIM ARACI  (v1.0)
 *  Semptomlar: (1) her şey yapılmış gibi görünüyor ama değil,
 *              (2) hiçbir bölüme girilemiyor, (3) hesap/giriş ekranı yok,
 *              (4) resim/GIF/animasyon yok.
 *  Çözüm: doktor (tarama) + gerçek varlık üreteci + onarım kiti + çalışan demo.
 *  Bağımlılık yok. Node 18+.
 * ========================================================================== */

import { mkdirSync, writeFileSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, join, relative, extname, basename } from "node:path";

const VERSION = "TEK-YAMA.mjs v1.0";

/* ==========================================================================
 *  1) TEMEL YARDIMCILAR
 * ========================================================================== */

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

/** Deterministik rastgele: aynı tohum → aynı GIF (tekrar üretim güvenli). */
function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

function ensureDir(p) { mkdirSync(p, { recursive: true }); }

function writeIfChanged(path, content) {
  const exists = existsSync(path);
  if (exists && readFileSync(path, "utf8") === content) return { path, changed: false };
  ensureDir(dirname(path));
  writeFileSync(path, content, "utf8");
  return { path, changed: true };
}

/* ==========================================================================
 *  2) PALET (256 renk) — rampalar sayesinde parlak, capcanlı görüntüler
 * ========================================================================== */

function lerp(a, b, t) { return a + (b - a) * t; }
function hexToRgb(h) { const n = parseInt(h.replace("#", ""), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

function ramp(fromHex, toHex, n) {
  const a = hexToRgb(fromHex), b = hexToRgb(toHex);
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    return [Math.round(lerp(a[0], b[0], t)), Math.round(lerp(a[1], b[1], t)), Math.round(lerp(a[2], b[2], t))];
  });
}

const IDX = {
  TRANSPARENT: 0, BG: 1, PANEL: 2, WHITE: 3, INK: 4,
  VIOLET: 5, GOLD: 25, TEAL: 45, BLUE: 65, FIRE: 85, GRAY: 101, PASTEL: 117, GREEN: 137, ROSE: 157,
};

function buildPalette() {
  const p = new Array(256).fill(null);
  p[0] = [0, 0, 0];           // şeffaf (kullanılmıyor ama tanımlı olmalı)
  p[1] = hexToRgb("#17123A"); // arka plan (koyu)
  p[2] = hexToRgb("#241C57"); // panel
  p[3] = hexToRgb("#FFFFFF"); // beyaz
  p[4] = hexToRgb("#0B0820"); // mürekkep/siyah
  const blocks = [
    [IDX.VIOLET, 20, "#C4B5FD", "#6D28D9"],
    [IDX.GOLD, 20, "#FEF3C7", "#D97706"],
    [IDX.TEAL, 20, "#A7F3D0", "#0F766E"],
    [IDX.BLUE, 20, "#BFDBFE", "#1D4ED8"],
    [IDX.FIRE, 16, "#FFFBEB", "#DC2626"],
    [IDX.GRAY, 16, "#F1F5F9", "#475569"],
    [IDX.PASTEL, 20, "#F9A8D4", "#8B5CF6"],
    [IDX.GREEN, 20, "#D9F99D", "#15803D"],
    [IDX.ROSE, 20, "#FECDD3", "#BE123C"],
  ];
  for (const [start, n, from, to] of blocks) {
    const cols = ramp(from, to, n);
    for (let i = 0; i < n; i++) p[start + i] = cols[i];
  }
  for (let i = 0; i < 256; i++) if (!p[i]) p[i] = [255, 255, 255];
  return p;
}
const PALETTE = buildPalette();

/* ==========================================================================
 *  3) TUVAL (index tabanlı çizim) — GIF'e doğrudan palet indeksleriyle yazar
 * ========================================================================== */

function canvas(w, h, bg = IDX.BG) {
  const px = new Uint8Array(w * h);
  if (bg !== 0) px.fill(bg);
  return { w, h, px };
}
const idxOf = (c, x, y) => y * c.w + x;
function px(c, x, y, i) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || y < 0 || x >= c.w || y >= c.h) return;
  c.px[idxOf(c, x, y)] = i;
}
function fillRect(c, x, y, w, h, i) {
  for (let yy = Math.round(y); yy < Math.round(y + h); yy++)
    for (let xx = Math.round(x); xx < Math.round(x + w); xx++) px(c, xx, yy, i);
}
function disc(c, cx, cy, r, i) {
  const r2 = r * r;
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy <= r2) px(c, x, y, i);
    }
}
function ring(c, cx, cy, r, th, i) {
  const ro = r + th / 2, ri = Math.max(0, r - th / 2);
  const ro2 = ro * ro, ri2 = ri * ri;
  for (let y = Math.floor(cy - ro); y <= Math.ceil(cy + ro); y++)
    for (let x = Math.floor(cx - ro); x <= Math.ceil(cx + ro); x++) {
      const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
      if (d2 <= ro2 && d2 >= ri2) px(c, x, y, i);
    }
}
function arc(c, cx, cy, r, th, fromDeg, toDeg, i) {
  const step = 1 / Math.max(c.w, c.h);
  for (let a = fromDeg; a <= toDeg; a += 0.5) {
    const rad = (a * Math.PI) / 180;
    for (let rr = r - th / 2; rr <= r + th / 2; rr += step) {
      px(c, cx + Math.cos(rad) * rr, cy + Math.sin(rad) * rr, i);
    }
  }
}
function line(c, x0, y0, x1, y1, i, th = 1) {
  const dx = x1 - x0, dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy), 1);
  for (let s = 0; s <= steps; s++) {
    const x = x0 + (dx * s) / steps, y = y0 + (dy * s) / steps;
    if (th <= 1) px(c, x, y, i);
    else disc(c, x, y, th / 2, i);
  }
}
function roundRect(c, x, y, w, h, r, i) {
  fillRect(c, x + r, y, w - 2 * r, h, i);
  fillRect(c, x, y + r, w, h - 2 * r, i);
  disc(c, x + r, y + r, r, i); disc(c, x + w - r - 1, y + r, r, i);
  disc(c, x + r, y + h - r - 1, r, i); disc(c, x + w - r - 1, y + h - r - 1, r, i);
}
function glow(c, cx, cy, r, rampStart, rampLen, intensity = 1) {
  for (let k = 0; k < 4; k++) {
    const rr = r * (1 + k * 0.5);
    const idx = clamp(Math.round(rampStart + (rampLen - 1) * (0.35 * intensity * (1 - k / 4))), rampStart, rampStart + rampLen - 1);
    ring(c, cx, cy, rr, 1, idx);
  }
}
function starsBg(c, count, seed = 7, maxY = null) {
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(r() * c.w), y = Math.floor(r() * (maxY ?? c.h));
    px(c, x, y, IDX.GRAY + Math.floor(r() * 6));
  }
}

/* ==========================================================================
 *  4) GIF89a YAZICI (+ LZW kodlayıcı/çözücü — kendini doğrular)
 * ========================================================================== */

function lzwEncode(minCodeSize, pixels) {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;
  const out = [];
  let curBits = 0, cur = 0;
  let codeSize = minCodeSize + 1;
  let nextCode = eoiCode + 1;
  let dict = new Map();
  // KOD GENİŞLİĞİ KURALI (kodlayıcı ↔ çözücü eşleşmesi için kritik):
  // Kodlayıcı, sıradaki serbest kod (1<<codeSize)'ı AŞTIĞINDA genişletir.
  // Çözücü ise kendi serbest kodu (1<<codeSize)'a ULAŞTIĞINDA genişletir (bir okuma gecikmeli).
  const emit = (code) => {
    if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++;
    cur |= code << curBits;
    curBits += codeSize;
    while (curBits >= 8) { out.push(cur & 0xff); cur >>= 8; curBits -= 8; }
  };
  emit(clearCode);
  let prefix = pixels[0];
  for (let i = 1; i < pixels.length; i++) {
    const k = pixels[i];
    const key = (prefix << 8) | k;
    const found = dict.get(key);
    if (found !== undefined) { prefix = found; continue; }
    emit(prefix);
    if (nextCode < 4096) {
      dict.set(key, nextCode++);
    } else {
      emit(clearCode);
      dict = new Map();
      codeSize = minCodeSize + 1;
      nextCode = eoiCode + 1;
    }
    prefix = k;
  }
  emit(prefix);
  emit(eoiCode);
  if (curBits > 0) out.push(cur & 0xff);
  return out;
}

function lzwDecode(minCodeSize, bytes, expectedLength) {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;
  let codeSize = minCodeSize + 1;
  let dict = [];
  let nextCode = eoiCode + 1;
  const reset = () => {
    dict = [];
    for (let i = 0; i < clearCode; i++) dict.push([i]);
    dict.push([]); dict.push([]);
    codeSize = minCodeSize + 1;
    nextCode = eoiCode + 1;
  };
  reset();
  const out = [];
  let bitPos = 0, prev = null;
  const read = () => {
    if (nextCode > (1 << codeSize) - 1 && codeSize < 12) codeSize++;
    let code = 0;
    for (let i = 0; i < codeSize; i++) {
      const byte = bytes[bitPos >> 3];
      if (byte === undefined) return eoiCode;
      code |= ((byte >> (bitPos & 7)) & 1) << i;
      bitPos++;
    }
    return code;
  };
  while (true) {
    const code = read();
    if (code === eoiCode) break;
    if (code === clearCode) { reset(); prev = null; continue; }
    let entry;
    if (dict[code]) entry = dict[code];
    else if (prev) entry = [...prev, prev[0]];
    else break;
    for (const v of entry) out.push(v);
    if (prev && nextCode < 4096) { dict.push([...prev, entry[0]]); nextCode++; }
    prev = entry;
    if (expectedLength && out.length >= expectedLength) break;
  }
  return Uint8Array.from(out.slice(0, expectedLength ?? out.length));
}

/** GIF verisini blok blok ayrıştırır: kare sayısı, gecikme, boyut, döngü bilgisi. */
function parseGif(buf) {
  let p = 0;
  const magic = buf.slice(0, 6).toString("latin1");
  p = 6;
  const width = buf.readUInt16LE(p); p += 2;
  const height = buf.readUInt16LE(p); p += 2;
  const packed = buf[p]; p += 3; // packed + bg + aspect
  if (packed & 0x80) p += 3 * (2 ** ((packed & 0x07) + 1));
  const frames = [];
  let loop = null;
  const skipSubBlocks = () => { while (buf[p] !== 0) p += buf[p] + 1; p += 1; };
  while (p < buf.length) {
    const b = buf[p];
    if (b === 0x3b) break;
    if (b === 0x21) {
      const label = buf[p + 1];
      p += 2;
      if (label === 0xf9) {
        const size = buf[p];
        const flags = buf[p + 1];
        const delay = buf.readUInt16LE(p + 2);
        frames.push({ delay, disposal: (flags >> 2) & 0x07, transparent: (flags & 0x01) === 1, w: null, h: null });
        p += 1 + size + 1;
      } else {
        const size = buf[p];
        const name = buf.slice(p + 1, p + 1 + size).toString("latin1");
        p += 1 + size;
        if (name === "NETSCAPE2.0" && buf[p] === 3) loop = buf.readUInt16LE(p + 2);
        skipSubBlocks();
      }
      continue;
    }
    if (b === 0x2c) {
      p += 1;
      const w = buf.readUInt16LE(p + 4), h = buf.readUInt16LE(p + 6);
      const lp = buf[p + 8];
      p += 9;
      if (lp & 0x80) p += 3 * (2 ** ((lp & 0x07) + 1));
      p += 1; // min code size
      skipSubBlocks();
      const f = frames[frames.length - 1];
      if (f) { f.w = w; f.h = h; }
      continue;
    }
    break;
  }
  return { magic, width, height, frames, hasGct: Boolean(packed & 0x80), loop, consumed: p };
}
const countGifFrames = (buf) => parseGif(buf).frames.length;

function gifBytes(width, height, frames, { delayMs = 80, loop = 0, transparent = -1 } = {}) {
  const out = [];
  const push16 = (n) => { out.push(n & 0xff, (n >> 8) & 0xff); };
  // Header
  for (const ch of "GIF89a") out.push(ch.charCodeAt(0));
  // Logical Screen Descriptor
  push16(width); push16(height);
  out.push(0xf7);            // global color table, 256 renk
  out.push(0);               // bg index
  out.push(0);               // aspect
  // Global Color Table
  for (const [r, g, b] of PALETTE) out.push(r, g, b);
  // Netscape loop
  out.push(0x21, 0xff, 0x0b);
  for (const ch of "NETSCAPE2.0") out.push(ch.charCodeAt(0));
  out.push(0x03, 0x01); push16(loop); out.push(0x00);
  // Frames
  const delay = Math.max(2, Math.round(delayMs / 10));
  for (const frame of frames) {
    out.push(0x21, 0xf9, 0x04);
    out.push(transparent >= 0 ? 0x09 : 0x04); // disposal=1 (arka plana dönme yok: 0x04)
    push16(delay);
    out.push(transparent >= 0 ? transparent : 0);
    out.push(0x00);
    out.push(0x2c);
    push16(0); push16(0); push16(width); push16(height);
    out.push(0x00);
    const minCode = 8;
    out.push(minCode);
    const data = lzwEncode(minCode, frame);
    for (let i = 0; i < data.length; i += 255) {
      const chunk = data.slice(i, i + 255);
      out.push(chunk.length);
      for (const b of chunk) out.push(b);
    }
    out.push(0x00);
  }
  out.push(0x3b);
  return Buffer.from(out);
}

/* ==========================================================================
 *  5) ANİMASYONLAR (10 GIF) — hepsi kodla üretilir, dışarıdan dosya gerekmez
 * ========================================================================== */

const W = 240, H = 180;

/** 5.1 Rozet havai fişeği: roket → patlama → rozet + konfeti */
function animBadgeFireworks() {
  const frames = [];
  const N = 26;
  const r = rng(42);
  const particles = Array.from({ length: 90 }, () => {
    const ang = r() * Math.PI * 2, sp = 1.2 + r() * 3.4;
    return { ang, sp, hue: [IDX.GOLD, IDX.PASTEL, IDX.TEAL, IDX.BLUE][Math.floor(r() * 4)], life: 1 };
  });
  for (let f = 0; f < N; f++) {
    const c = canvas(W, H);
    starsBg(c, 40, 11);
    const t = f / (N - 1);
    if (f < 9) {
      const y = H - 20 - (H - 60) * (f / 9);
      line(c, W / 2, y + 14, W / 2, y, IDX.GOLD + 2, 3);
      disc(c, W / 2, y, 3, IDX.FIRE + 12);
      for (let k = 0; k < 5; k++) px(c, W / 2 + (r() - 0.5) * 4, y + 6 + k * 3, IDX.FIRE + 8 - k);
    } else {
      const age = (f - 9) / (N - 9);
      for (const p of particles) {
        const dist = p.sp * (f - 9) * 2.4;
        const x = W / 2 + Math.cos(p.ang) * dist;
        const y = 60 + Math.sin(p.ang) * dist + age * age * 60;
        const fade = clamp(1 - age * 1.05, 0, 1);
        const idx = clamp(p.hue + Math.round(10 * fade), p.hue, p.hue + 19);
        if (fade > 0.05) disc(c, x, y, 1.6 + fade, idx);
      }
      if (age > 0.45) {
        const a = (age - 0.45) / 0.55;
        const scale = 1 + (1 - Math.min(1, a * 1.6)) * 0.6;
        const rBase = 26 * scale;
        ring(c, W / 2, 62, rBase, 4, IDX.GOLD + 16);
        disc(c, W / 2, 62, rBase - 6, IDX.PANEL);
        for (let i = 0; i < 5; i++) {
          const ang = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const x = W / 2 + Math.cos(ang) * (rBase - 20), y = 62 + Math.sin(ang) * (rBase - 20);
          if (a > 0.2 + i * 0.12) disc(c, x, y, 4, IDX.GOLD + 8 + i * 2);
        }
        if (a > 0.9) glow(c, W / 2, 62, 30, IDX.GOLD, 20, 1);
      }
    }
    frames.push(c.px);
  }
  return { frames, opts: { delayMs: 90 } };
}

/** 5.2 Seri alevi (streak flame) */
function animStreakFlame() {
  const frames = [];
  const N = 24;
  const r = rng(7);
  for (let f = 0; f < N; f++) {
    const c = canvas(W, H);
    fillRect(c, 0, H - 24, W, 24, IDX.PANEL);
    const ph = (f / N) * Math.PI * 2;
    const cx = W / 2, base = H - 26;
    for (let i = 0; i < 26; i++) {
      const t = i / 25;
      const y = base - t * 92;
      const wob = Math.sin(ph + t * 6) * (6 * (1 - t) + 2);
      const width = (1 - t) * 26 + 3;
      const idx = t < 0.35 ? IDX.FIRE + 13 - Math.floor(t * 20) : t < 0.7 ? IDX.FIRE + 6 : IDX.GOLD + 12;
      disc(c, cx + wob, y, width, idx);
    }
    for (let k = 0; k < 7; k++) {
      const t = ((f * 0.11 + k * 0.14) % 1);
      const x = cx + Math.sin(ph + k) * 24 + (r() - 0.5) * 8;
      disc(c, x, base - 20 - t * 120, 2, IDX.GOLD + 4 + Math.floor(r() * 10));
    }
    glow(c, cx, base - 20, 34, IDX.FIRE, 16, 0.9);
    frames.push(c.px);
  }
  return { frames, opts: { delayMs: 80 } };
}

/** 5.3 Lumi maskotu: göz kırpma + el sallama */
function animMascot() {
  const frames = [];
  const N = 28;
  for (let f = 0; f < N; f++) {
    const c = canvas(W, H);
    fillRect(c, 0, 0, W, H, IDX.PANEL);
    const cx = 100, cy = 92;
    disc(c, cx, cy, 44, IDX.PASTEL + 16);
    disc(c, cx, cy - 8, 36, IDX.WHITE);
    // tüy/anten
    line(c, cx, cy - 48, cx - 6, cy - 66, IDX.TEAL + 10, 3);
    disc(c, cx - 7, cy - 69, 5, IDX.GOLD + 14);
    // gözler
    const blink = (f % 14) > 11;
    if (blink) { line(c, cx - 18, cy - 12, cx - 6, cy - 12, IDX.INK, 3); line(c, cx + 6, cy - 12, cx + 18, cy - 12, IDX.INK, 3); }
    else {
      disc(c, cx - 12, cy - 12, 6, IDX.WHITE); disc(c, cx + 12, cy - 12, 6, IDX.WHITE);
      disc(c, cx - 12, cy - 12, 3, IDX.VIOLET + 12); disc(c, cx + 12, cy - 12, 3, IDX.VIOLET + 12);
    }
    // yanaklar + gülümseme
    disc(c, cx - 26, cy + 4, 6, IDX.ROSE + 14); disc(c, cx + 26, cy + 4, 6, IDX.ROSE + 14);
    arc(c, cx, cy + 2, 16, 3, 20, 160, IDX.INK);
    // el sallama (sağda)
    const wave = Math.sin((f / N) * Math.PI * 4) * 12;
    const hx = 168, hy = 96 + wave;
    disc(c, hx, hy, 12, IDX.PASTEL + 16);
    for (let k = -1; k <= 1; k++) line(c, hx + k * 6, hy - 10, hx + k * 8, hy - 22, IDX.PASTEL + 18, 3);
    // ok/soru balonu
    roundRect(c, 150, 34, 74, 30, 10, IDX.WHITE);
    for (let k = 0; k < 3; k++) disc(c, 168 + k * 12, 49, 3, IDX.VIOLET + 8 + k * 4);
    frames.push(c.px);
  }
  return { frames, opts: { delayMs: 70 } };
}

/** 5.4 Konfeti yağmuru */
function animConfetti() {
  const frames = [];
  const N = 26;
  const r = rng(99);
  const bits = Array.from({ length: 46 }, () => ({
    x: r() * W, y: r() * H, sp: 2 + r() * 4, sw: (r() - 0.5) * 2,
    hue: [IDX.VIOLET, IDX.GOLD, IDX.TEAL, IDX.ROSE, IDX.BLUE][Math.floor(r() * 5)],
    w: 3 + Math.floor(r() * 3), h: 2 + Math.floor(r() * 3),
  }));
  for (let f = 0; f < N; f++) {
    const c = canvas(W, H);
    for (const b of bits) {
      b.y += b.sp; b.x += b.sw;
      if (b.y > H + 6) { b.y = -6; b.x = r() * W; }
      const idx = b.hue + Math.floor((f * 3 + b.x) % 12);
      fillRect(c, b.x, b.y, b.w, b.h, idx);
    }
    frames.push(c.px);
  }
  return { frames, opts: { delayMs: 70 } };
}

/** 5.5 İlerleme halkası (%0 → %100) */
function animProgressRing() {
  const frames = [];
  const N = 26;
  const cx = W / 2, cy = H / 2, R = 58;
  for (let f = 0; f < N; f++) {
    const c = canvas(W, H);
    starsBg(c, 24, 5);
    const t = f / (N - 1);
    ring(c, cx, cy, R, 10, IDX.GRAY + 3);
    arc(c, cx, cy, R, 10, -90, -90 + 360 * t, IDX.VIOLET + Math.round(t * 12));
    arc(c, cx, cy, R, 4, -90, -90 + 360 * t, IDX.PASTEL + 14);
    disc(c, cx, cy, R - 14, IDX.PANEL);
    fillRect(c, cx - 18, cy - 4 + 18 * (1 - t), 36, 8, IDX.GRAY + 8);
    fillRect(c, cx - 18, cy - 4 + 18 * (1 - t), Math.round(36 * t), 8, IDX.TEAL + 12);
    if (t > 0.95) { glow(c, cx, cy, R - 20, IDX.GOLD, 20, 1); for (let k = 0; k < 8; k++) {
      const g = (f * 7 + k * 45) % 360, rad = (g * Math.PI) / 180;
      disc(c, cx + Math.cos(rad) * (R + 14), cy + Math.sin(rad) * (R + 14), 3, IDX.GOLD + 10);
    } }
    frames.push(c.px);
  }
  return { frames, opts: { delayMs: 80 } };
}

/** 5.6 Başarı (doğru cevap) animasyonu: çember + tik + kıvılcımlar */
function animSuccess() {
  const frames = [];
  const N = 22;
  const cx = W / 2, cy = H / 2 - 6;
  for (let f = 0; f < N; f++) {
    const c = canvas(W, H);
    starsBg(c, 20, 13);
    const t = clamp(f / 10, 0, 1);
    arc(c, cx, cy, 44, 7, -90, -90 + 360 * t, IDX.TEAL + Math.round(10 * t));
    if (t >= 1) {
      const p = clamp((f - 10) / 8, 0, 1);
      line(c, cx - 20, cy + 2, cx - 20 + 16 * p, cy + 2 + 18 * Math.min(1, p * 1.6), IDX.WHITE, 6);
      if (p > 0.62) line(c, cx - 4, cy + 20, cx - 4 + 38 * ((p - 0.62) / 0.38), cy + 20 - 40 * ((p - 0.62) / 0.38), IDX.WHITE, 6);
      if (p > 0.5) for (let k = 0; k < 10; k++) {
        const g = (f * 11 + k * 36) % 360, rad = (g * Math.PI) / 180, rr = 52 + (f - 12) * 1.5;
        disc(c, cx + Math.cos(rad) * rr, cy + Math.sin(rad) * rr, 3, IDX.GOLD + 6 + (k % 10));
      }
    }
    frames.push(c.px);
  }
  return { frames, opts: { delayMs: 80 } };
}

/** 5.7 Deneme sınavı zamanlayıcısı */
function animTimer() {
  const frames = [];
  const N = 24;
  const cx = W / 2, cy = H / 2;
  for (let f = 0; f < N; f++) {
    const c = canvas(W, H);
    fillRect(c, 0, 0, W, H, IDX.PANEL);
    disc(c, cx, cy, 62, IDX.WHITE);
    disc(c, cx, cy, 54, IDX.BG);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      line(c, cx + Math.cos(a) * 46, cy + Math.sin(a) * 46, cx + Math.cos(a) * 52, cy + Math.sin(a) * 52, IDX.GRAY + 6, 2);
    }
    const sweep = (f / N) * 360;
    for (let a = -60; a <= 60; a += 3) {
      const rad = ((a + sweep) * Math.PI) / 180;
      px(c, cx + Math.cos(rad) * 40, cy + Math.sin(rad) * 40, IDX.ROSE + 10);
    }
    const m = ((f / N) * 360 - 90) * (Math.PI / 180);
    line(c, cx, cy, cx + Math.cos(m) * 34, cy + Math.sin(m) * 34, IDX.WHITE, 4);
    disc(c, cx, cy, 5, IDX.GOLD + 12);
    frames.push(c.px);
  }
  return { frames, opts: { delayMs: 60 } };
}

/** 5.8 Dinleme dalgası (gerçek sesin yanında oynar) */
function animAudioWave() {
  const frames = [];
  const N = 24;
  for (let f = 0; f < N; f++) {
    const c = canvas(W, H);
    fillRect(c, 0, 0, W, H, IDX.PANEL);
    disc(c, 34, H / 2, 18, IDX.TEAL + 12);
    line(c, 28, H / 2 - 8, 28, H / 2 + 8, IDX.WHITE, 3);
    line(c, 34, H / 2 - 11, 34, H / 2 + 11, IDX.WHITE, 3);
    line(c, 40, H / 2 - 8, 40, H / 2 + 8, IDX.WHITE, 3);
    const bars = 22;
    for (let i = 0; i < bars; i++) {
      const t = i / bars;
      const h = 10 + Math.abs(Math.sin(t * 7 + f * 0.55)) * 46 + Math.abs(Math.sin(t * 13 - f * 0.3)) * 16;
      const x = 68 + i * 7;
      roundRect(c, x, H / 2 - h / 2, 5, h, 2, IDX.VIOLET + Math.round(Math.min(1, h / 70) * 14));
    }
    frames.push(c.px);
  }
  return { frames, opts: { delayMs: 60 } };
}

/** 5.9 Kelime kartı çevirme */
function animFlashcardFlip() {
  const frames = [];
  const N = 24;
  const cx = W / 2, cy = H / 2;
  for (let f = 0; f < N; f++) {
    const c = canvas(W, H);
    starsBg(c, 18, 21);
    const half = f / N;
    const t = half < 0.5 ? half * 2 : (1 - half) * 2;
    const w = Math.max(6, 150 * t);
    const front = half < 0.5;
    const face = front ? IDX.VIOLET + 6 : IDX.GOLD + 6;
    roundRect(c, cx - w / 2, cy - 52, w, 104, 12, face);
    if (t > 0.55) {
      roundRect(c, cx - w / 2 + 8, cy - 44, w - 16, 88, 8, front ? IDX.WHITE : IDX.INK + 0);
      if (!front) for (let k = 0; k < 3; k++) fillRect(c, cx - w / 2 + 20, cy - 20 + k * 16, w - 40, 6, IDX.GOLD + 12);
      else for (let k = 0; k < 2; k++) fillRect(c, cx - w / 2 + 20, cy - 16 + k * 20, w - 40, 8, IDX.VIOLET + 12);
    }
    frames.push(c.px);
  }
  return { frames, opts: { delayMs: 80 } };
}

/** 5.10 Boş durum / yıldız parlaması */
function animEmptyStars() {
  const frames = [];
  const N = 20;
  const r = rng(3);
  const pts = Array.from({ length: 26 }, () => ({ x: r() * W, y: r() * H, ph: r() * Math.PI * 2, hue: Math.floor(r() * 4) }));
  for (let f = 0; f < N; f++) {
    const c = canvas(W, H);
    fillRect(c, 0, 0, W, H, IDX.PANEL);
    for (const p of pts) {
      const s = (Math.sin(p.ph + (f / N) * Math.PI * 2) + 1) / 2;
      const idx = [IDX.GOLD, IDX.PASTEL, IDX.TEAL, IDX.BLUE][p.hue] + Math.round(s * 14);
      const rad = 1 + s * 2.4;
      disc(c, p.x, p.y, rad, idx);
      if (s > 0.85) { line(c, p.x - 5, p.y, p.x + 5, p.y, idx, 1); line(c, p.x, p.y - 5, p.x, p.y + 5, idx, 1); }
    }
    frames.push(c.px);
  }
  return { frames, opts: { delayMs: 90 } };
}

export const ANIMATIONS = {
  "rozet-havai-fisek.gif": animBadgeFireworks,
  "seri-alev.gif": animStreakFlame,
  "lumi-maskot.gif": animMascot,
  "konfeti.gif": animConfetti,
  "ilerleme-halkasi.gif": animProgressRing,
  "basari.gif": animSuccess,
  "sinav-zamanlayici.gif": animTimer,
  "dinleme-dalgasi.gif": animAudioWave,
  "kelime-karti.gif": animFlashcardFlip,
  "yildiz-parlamasi.gif": animEmptyStars,
};

/* ==========================================================================
 *  6) SVG VARLIKLAR (metin olarak yazılır; ölçeklenebilir, hafif)
 * ========================================================================== */

const SVG_GRADIENT = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;

function svgLogo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 56" role="img" aria-label="IELTS Akademi">
${SVG_GRADIENT("g1", "#8B5CF6", "#EC4899")}
  <rect x="2" y="6" width="44" height="44" rx="14" fill="url(#g1)"/>
  <path d="M16 38 L24 18 L32 38" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="19.5" y1="31" x2="28.5" y2="31" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
  <text x="56" y="27" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="800" fill="#7C3AED">IELTS</text>
  <text x="56" y="46" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="700" fill="#EC4899">Akademi</text>
</svg>`;
}

function svgMascot(mood = "happy") {
  const eyes = mood === "thinking"
    ? `<circle cx="26" cy="30" r="3.4" fill="#17123A"/><path d="M34 27 q6 4 12 0" stroke="#17123A" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    : `<circle cx="26" cy="29" r="3.6" fill="#17123A"/><circle cx="38" cy="29" r="3.6" fill="#17123A"/><circle cx="27.2" cy="27.8" r="1.2" fill="#fff"/><circle cx="39.2" cy="27.8" r="1.2" fill="#fff"/>`;
  const mouth = mood === "celebrate"
    ? `<circle cx="32" cy="38" r="5" fill="#17123A"/>`
    : `<path d="M25 37 q7 6 14 0" stroke="#17123A" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Lumi maskotu">
${SVG_GRADIENT("m1", "#F9A8D4", "#A78BFA")}
  <circle cx="32" cy="34" r="26" fill="url(#m1)"/>
  <circle cx="32" cy="31" r="20" fill="#fff"/>
  <line x1="32" y1="8" x2="28" y2="1" stroke="#14B8A6" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="27.5" cy="-0.5" r="3" fill="#FBBF24"/>
  ${eyes}${mouth}
  <circle cx="14" cy="36" r="3" fill="#F9A8D4" opacity=".8"/><circle cx="50" cy="36" r="3" fill="#F9A8D4" opacity=".8"/>
</svg>`;
}

const MODULE_ICONS = {
  gramer: ["🧩", "#8B5CF6", "#EC4899", "M12 20 L20 6 L28 20 M15 15 h10"],
  okuma: ["📖", "#0EA5E9", "#6366F1", "M6 9 h12 a6 6 0 0 1 6 6 v13 a6 6 0 0 0 -6 -5 H6 z M30 9 h-6"],
  dinleme: ["🎧", "#14B8A6", "#0EA5E9", "M8 22 v-6 a12 12 0 0 1 24 0 v6 M8 22 a3 3 0 0 0 6 0 v-4 M34 22 a3 3 0 0 1 -6 0 v-4"],
  konusma: ["🎤", "#EC4899", "#F59E0B", "M20 6 a5 5 0 0 1 5 5 v6 a5 5 0 0 1 -10 0 v-6 a5 5 0 0 1 5 -5 M12 18 a8 8 0 0 0 16 0 M20 30 v4"],
  yazma: ["✍️", "#F59E0B", "#EF4444", "M10 30 l4 -1 14 -14 -3 -3 -14 14 z M24 12 l3 3"],
  kelime: ["📚", "#A855F7", "#8B5CF6", "M8 8 h18 v26 h-18 z M26 8 a6 6 0 0 1 6 6 v20 h-6"],
  deneme: ["🎯", "#EF4444", "#F97316", "M20 10 a10 10 0 1 1 0 20 a10 10 0 0 1 0 -20 M20 16 a4 4 0 1 1 0 8 a4 4 0 0 1 0 -8"],
  arsiv: ["🗂️", "#6366F1", "#22D3EE", "M8 12 h24 v18 h-24 z M8 12 l4 -6 h16 l4 6 M14 18 h12 M14 24 h8"],
  bilim: ["🔬", "#22C55E", "#14B8A6", "M16 8 v12 L8 32 h24 L24 20 V8 M13 8 h14"],
  taktik: ["🧭", "#F97316", "#FACC15", "M20 6 a14 14 0 1 1 0 28 a14 14 0 0 1 0 -28 M26 14 l-5 11 -8 3 8 -3 z"],
  program: ["📅", "#0EA5E9", "#8B5CF6", "M8 10 h24 v22 h-24 z M8 17 h24 M15 6 v6 M25 6 v6 M14 23 h4 M22 23 h4"],
  rozet: ["🏆", "#FACC15", "#F59E0B", "M14 8 h12 v8 a6 6 0 0 1 -12 0 z M20 22 v6 M14 30 h12 M14 8 l-4 4 4 4 M26 8 l4 4 -4 4"],
  soz: ["💬", "#EC4899", "#F472B6", "M7 12 h26 v14 h-16 l-6 6 v-6 h-4 z"],
  erisim: ["♿", "#3B82F6", "#22C55E", "M20 6 a4 4 0 1 1 0 8 a4 4 0 0 1 0 -8 M20 16 v10 h9 M20 26 l-3 8"],
};

function svgModuleIcon(name) {
  const [emoji, a, b, path] = MODULE_ICONS[name] ?? ["⭐", "#8B5CF6", "#EC4899", "M20 8 l4 8 8 1 -6 6 2 9 -8 -5 -8 5 2 -9 -6 -6 8 -1 z"];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" role="img" aria-label="${name}">
${SVG_GRADIENT("i-" + name, a, b)}
  <rect x="1" y="1" width="38" height="38" rx="12" fill="url(#i-${name})"/>
  <path d="${path}" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function svgBadgeFrame(tier = "gold") {
  const colors = { bronze: ["#D97706", "#92400E"], silver: ["#CBD5E1", "#64748B"], gold: ["#FDE68A", "#D97706"], platinum: ["#A5F3FC", "#0E7490"], legendary: ["#F9A8D4", "#7C3AED"] }[tier] ?? ["#FDE68A", "#D97706"];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" role="img" aria-label="${tier} rozet çerçevesi">
${SVG_GRADIENT("b-" + tier, colors[0], colors[1])}
  <path d="M40 4 l14 6 10 12 -4 10 4 10 -10 12 -14 6 -14 -6 -10 -12 4 -10 -4 -10 10 -12 z" fill="url(#b-${tier})"/>
  <circle cx="40" cy="40" r="20" fill="#17123A" opacity=".85"/>
  <path d="M32 40 l6 6 12 -14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function svgEmptyState() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" role="img" aria-label="İçerik hazırlanıyor">
${SVG_GRADIENT("e1", "#EDE9FE", "#FCE7F3")}
  <rect x="4" y="4" width="232" height="152" rx="18" fill="url(#e1)"/>
  <rect x="42" y="40" width="60" height="76" rx="10" fill="#fff" stroke="#C4B5FD" stroke-width="2"/>
  <rect x="52" y="54" width="40" height="6" rx="3" fill="#C4B5FD"/>
  <rect x="52" y="66" width="30" height="6" rx="3" fill="#DDD6FE"/>
  <rect x="52" y="78" width="36" height="6" rx="3" fill="#DDD6FE"/>
  <rect x="112" y="56" width="86" height="60" rx="12" fill="#fff" stroke="#F9A8D4" stroke-width="2"/>
  <circle cx="134" cy="80" r="9" fill="#FBCFE8"/>
  <rect x="150" y="72" width="38" height="7" rx="3.5" fill="#FBCFE8"/>
  <rect x="150" y="86" width="26" height="7" rx="3.5" fill="#FCE7F3"/>
  <circle cx="96" cy="116" r="7" fill="#A78BFA"/><circle cx="196" cy="40" r="5" fill="#FBBF24"/>
</svg>`;
}

function svgHeroPattern() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" role="img" aria-hidden="true" preserveAspectRatio="none">
${SVG_GRADIENT("h1", "#7C3AED", "#EC4899")}
  <rect width="400" height="200" fill="url(#h1)" opacity=".12"/>
  <g fill="none" stroke="#7C3AED" stroke-opacity=".35" stroke-width="2">
    <circle cx="60" cy="40" r="18"/><circle cx="330" cy="150" r="26"/><circle cx="200" cy="20" r="10"/>
  </g>
  <g fill="#EC4899" opacity=".35"><circle cx="120" cy="160" r="6"/><circle cx="280" cy="60" r="5"/><circle cx="360" cy="30" r="4"/></g>
</svg>`;
}

export const SVG_ASSETS = {
  "logo.svg": svgLogo,
  "lumi-happy.svg": () => svgMascot("happy"),
  "lumi-thinking.svg": () => svgMascot("thinking"),
  "lumi-celebrate.svg": () => svgMascot("celebrate"),
  "hero-desen.svg": svgHeroPattern,
  "bos-durum.svg": svgEmptyState,
  ...Object.fromEntries(Object.keys(MODULE_ICONS).map((k) => [`ikon-${k}.svg`, () => svgModuleIcon(k)])),
  ...Object.fromEntries(["bronze", "silver", "gold", "platinum", "legendary"].map((t) => [`rozet-${t}.svg`, () => svgBadgeFrame(t)])),
};

/* ==========================================================================
 *  7) VARLIK ÜRETİCİ + ÖZ-TEST
 * ========================================================================== */

export function generateAssets(outDir, { quiet = false } = {}) {
  const animDir = join(outDir, "anim");
  const imgDir = join(outDir, "img");
  ensureDir(animDir); ensureDir(imgDir);
  const manifest = [];
  const log = quiet ? () => {} : (...a) => console.log(...a);

  for (const [name, fn] of Object.entries(ANIMATIONS)) {
    const { frames, opts } = fn();
    // Kendini doğrula: LZW kodla → çöz → kaynakla karşılaştır
    const probe = frames[Math.floor(frames.length / 2)];
    const encoded = lzwEncode(8, probe);
    const decoded = lzwDecode(8, encoded, probe.length);
    let identical = decoded.length === probe.length;
    if (identical) for (let i = 0; i < probe.length; i++) if (decoded[i] !== probe[i]) { identical = false; break; }
    if (!identical) throw new Error(`LZW doğrulaması başarısız: ${name}`);
    const buf = gifBytes(W, H, frames, opts);
    const p = join(animDir, name);
    ensureDir(dirname(p));
    writeFileSync(p, buf);
    manifest.push({ file: `anim/${name}`, type: "image/gif", bytes: buf.length, frames: frames.length, w: W, h: H, delayMs: opts.delayMs ?? 80 });
    log(`  • anim/${name.padEnd(26)} ${String(frames.length).padStart(2)} kare · ${(buf.length / 1024).toFixed(1)} KB`);
  }

  for (const [name, fn] of Object.entries(SVG_ASSETS)) {
    const svg = fn();
    const p = join(imgDir, name);
    writeFileSync(p, svg, "utf8");
    manifest.push({ file: `img/${name}`, type: "image/svg+xml", bytes: Buffer.byteLength(svg), w: 0, h: 0 });
    log(`  • img/${name.padEnd(28)} ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
  }

  writeFileSync(join(outDir, "varlik-manifest.json"), JSON.stringify({ generatedAt: new Date().toISOString(), generator: VERSION, note: "Bu dosyalar TEK-YAMA.mjs ile üretildi; telifsizdir, ticari kullanıma açıktır.", assets: manifest }, null, 2), "utf8");
  return manifest;
}

/* ==========================================================================
 *  SELF-TEST — aracın kendi doğruluğu (GIF yapısı + LZW + içerik taramaları)
 * ========================================================================== */

export function runYamaSelfTest({ quiet = true } = {}) {
  const res = { pass: 0, fail: 0, failures: [] };
  const ok = (cond, label) => { if (cond) res.pass++; else { res.fail++; res.failures.push(label); } };

  // 1) LZW gidiş-dönüş (farklı verilerle)
  for (const seed of [1, 2, 99]) {
    const r = rng(seed);
    const data = Uint8Array.from({ length: 12000 }, () => Math.floor(r() * 256));
    const round = lzwDecode(8, lzwEncode(8, data), data.length);
    let same = round.length === data.length;
    if (same) for (let i = 0; i < data.length; i++) if (data[i] !== round[i]) { same = false; break; }
    ok(same, `LZW gidiş-dönüş (tohum ${seed})`);
  }
  // 2) Düz renkli veri (tekrar eden → sözlük genişlemesi sınırı)
  const flat = new Uint8Array(20000).fill(7);
  const flatRound = lzwDecode(8, lzwEncode(8, flat), flat.length);
  ok(flatRound.every((v) => v === 7), "LZW düz veri doğru çözüldü");

  // 3) GIF başlığı/yapısı
  const { frames, opts } = animSuccess();
  const gif = gifBytes(W, H, frames, opts);
  ok(gif.slice(0, 6).toString("latin1") === "GIF89a", "GIF başlığı GIF89a");
  ok(gif.readUInt16LE(6) === W && gif.readUInt16LE(8) === H, "GIF ekran boyutu doğru");
  ok(gif[gif.length - 1] === 0x3b, "GIF trailer (0x3B) var");
  ok(gif.includes(Buffer.from([0x21, 0xff, 0x0b])) , "Netscape döngü bloğu var");
  const frameCount = countGifFrames(gif);
  ok(frameCount === frames.length, `Kare sayısı doğru (${frameCount}/${frames.length})`);
  ok(PALETTE.length === 256, "Palet 256 renk");
  const parsed = parseGif(gif);
  ok(parsed.magic === "GIF89a", "Ayrıştırıcı: başlık okundu");
  ok(parsed.width === W && parsed.height === H, "Ayrıştırıcı: ekran boyutu okundu");
  ok(parsed.frames.every((f) => f.w === W && f.h === H), "Ayrıştırıcı: her karenin boyutu ekranla aynı");
  ok(parsed.frames.every((f) => f.delay >= 2), "Ayrıştırıcı: gecikme değerleri geçerli");

  // 4) Her animasyon üretilebiliyor mu + kare boyutu tutarlı mı
  for (const [name, fn] of Object.entries(ANIMATIONS)) {
    try {
      const a = fn();
      ok(a.frames.length >= 12, `${name}: kare sayısı ≥12`);
      ok(a.frames.every((f) => f.length === W * H), `${name}: her kare ${W}x${H}`);
      const bufBytes = gifBytes(W, H, a.frames, a.opts);
      ok(bufBytes.slice(0, 6).toString("latin1") === "GIF89a", `${name}: geçerli GIF başlığı`);
      ok(bufBytes.length > 2000, `${name}: GIF verisi dolu (>2KB)`);
    } catch (e) { ok(false, `${name}: üretim hatası → ${e.message}`); }
  }
  // 5) SVG varlıkları geçerli mi
  for (const [name, fn] of Object.entries(SVG_ASSETS)) {
    const svg = fn();
    ok(svg.startsWith("<svg") && svg.includes("</svg>"), `${name}: SVG kapanışı var`);
    ok(!svg.includes("undefined") && !svg.includes("NaN"), `${name}: bozuk değer yok`);
  }
  // 6) Palet indeksleri sınırların içinde mi (çizim taşması kontrolü)
  const c = canvas(W, H);
  disc(c, -100, -100, 5, IDX.WHITE);
  disc(c, W + 100, H + 100, 5, IDX.WHITE);
  line(c, -50, 200, 400, -50, IDX.GOLD + 5, 3);
  ok(c.px.every((v) => v >= 0 && v < 256), "Taşan çizimlerde palet indeksi bozulmuyor");
  ok(c.px.every((v) => Number.isInteger(v)), "Piksel değerleri tam sayı");

  if (!quiet) {
    console.log(res.fail === 0 ? `  ✓ yama öz-testi: ${res.pass} kontrol geçti` : `  ✗ ${res.fail} kontrol başarısız`);
    for (const f of res.failures) console.log("     - " + f);
  }
  return res;
}

export { gifBytes, parseGif, countGifFrames, lzwEncode, lzwDecode, canvas, disc, ring, arc, fillRect, roundRect, IDX, PALETTE };
/* ==========================================================================
 *  TEK-YAMA.mjs — BÖLÜM B: DOKTOR + ONARIM KİTİ + ÇALIŞAN DEMO SİTE
 *  (Bu bölüm Part A'nın devamıdır: aynı dosya, aynı araç.)
 * ========================================================================== */

import { createServer } from "node:http";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

/* ==========================================================================
 *  B1) ÇALIŞAN DEMO SİTE — tek dosya, sıfır bağımlılık
 *      Gerçek hesap sistemi (e-posta + şifre), oturum çerezi, korumalı sayfalar,
 *      animasyonlu modüller, cevap denetimi, XP/ilerleme kaydı.
 * ========================================================================== */

/* Demo sitenin CSS ve istemci kodu: JSON.stringify ile gömülür → iç içe tırnak/kaçış hatası olmaz. */
const DEMO_CSS = ":root{--bg:#F7F5FF;--panel:#FFFFFF;--ink:#17123A;--muted:#6B7280;--line:#E5E7EB;--brand:#7C3AED;--brand2:#EC4899;--ok:#0F766E;--warn:#D97706;--err:#DC2626}\n@media (prefers-color-scheme: dark){:root:not([data-theme=light]){--bg:#0F0C24;--panel:#1A1440;--ink:#F8FAFC;--muted:#A5B4FC;--line:#312B5E;--brand:#C4B5FD;--brand2:#F9A8D4;--ok:#5EEAD4;--warn:#FCD34D;--err:#FCA5A5}}\n[data-theme=dark]{--bg:#0F0C24;--panel:#1A1440;--ink:#F8FAFC;--muted:#A5B4FC;--line:#312B5E;--brand:#C4B5FD;--brand2:#F9A8D4;--ok:#5EEAD4;--warn:#FCD34D;--err:#FCA5A5}\n*{box-sizing:border-box}body{margin:0;font-family:Segoe UI,system-ui,Arial,sans-serif;background:var(--bg);color:var(--ink);line-height:1.55}\n.wrap{max-width:1040px;margin:0 auto;padding:16px}\nheader.top{position:sticky;top:0;z-index:20;background:var(--panel);border-bottom:1px solid var(--line)}\n.nav{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:10px 16px;max-width:1040px;margin:0 auto}\n.brand{display:flex;align-items:center;gap:10px;font-weight:800;text-decoration:none;color:var(--ink)}\n.brand img{width:40px;height:40px;border-radius:12px}\n.links{display:flex;gap:10px;flex-wrap:wrap;margin-left:auto;align-items:center}\na.link,button.btn{font:inherit;font-weight:700;text-decoration:none;color:var(--ink);background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:8px 12px;cursor:pointer}\na.link:hover,button.btn:hover{border-color:var(--brand);transform:translateY(-1px)}\nbutton.primary,a.primary{background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fff;border:0}\n.card{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:18px;box-shadow:0 6px 24px rgba(23,18,58,.06)}\n.grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}\n.mod{display:flex;gap:12px;text-decoration:none;color:inherit;align-items:flex-start;transition:transform .15s}\n.mod:hover{transform:translateY(-2px)}\n.mod img.ikon{width:44px;height:44px;border-radius:14px;flex:none}\n.anim{width:100%;max-width:240px;border-radius:16px;display:block}\n.ikon{width:44px;height:44px;border-radius:14px}\n.row{display:flex;gap:14px;flex-wrap:wrap;align-items:center}\n.muted{color:var(--muted)}.small{font-size:.9rem}\ninput,select,textarea{font:inherit;background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:12px;padding:10px 12px;width:100%}\nlabel{font-weight:700;font-size:.95rem;display:block;margin:10px 0 4px}\n.msg{border-radius:12px;padding:10px 12px;margin:10px 0;font-weight:600}\n.msg.err{background:#FEE2E2;color:#B91C1C}\n.msg.ok{background:#D1FAE5;color:#065F46}\n.q{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px;margin:10px 0}\n.pill{display:inline-block;border-radius:999px;padding:4px 10px;font-size:.8rem;font-weight:700;background:#EDE9FE;color:#6D28D9}\n.kanit{background:#FEF3C7;border-radius:8px;padding:2px 4px}\nfooter{padding:24px 16px;color:var(--muted);text-align:center}\n.module{display:grid;gap:16px;grid-template-columns:1fr;align-items:start}\n@media (min-width:820px){.module{grid-template-columns:260px 1fr}}\n.skip{position:absolute;left:-9999px}.skip:focus{left:8px;top:8px;background:var(--panel);padding:8px;border-radius:8px;z-index:50}\n:focus-visible{outline:3px solid var(--brand2);outline-offset:2px}\n.hidden{display:none!important}";
const DEMO_CLIENT_JS = "\"document.querySelectorAll(\\\\\"[data-nav]\\\\\").forEach(function(a){a.addEventListener(\\\\\"click\\\\\",function(){document.body.classList.add(\\\\\"page-leaving\\\\\")});});\",\n\"var t=document.querySelector(\\\\\"[data-theme-toggle]\\\\\");if(t){t.addEventListener(\\\\\"click\\\\\",function(){var c=document.documentElement.getAttribute(\\\\\"data-theme\\\\\");var n=c===\\\\\"dark\\\\\"?\\\\\"light\\\\\":\\\\\"dark\\\\\";document.documentElement.setAttribute(\\\\\"data-theme\\\\\",n);try{localStorage.setItem(\\\\\"tema\\\\\",n)}catch(e){}t.textContent=n===\\\\\"dark\\\\\"?\\\\\"☀️ Açık tema\\\\\":\\\\\"🌙 Koyu tema\\\\\"});}\",\n\"try{var s=localStorage.getItem(\\\\\"tema\\\\\");if(s)document.documentElement.setAttribute(\\\\\"data-theme\\\\\",s)}catch(e){}\",\n\"var kayit=document.querySelector(\\\\\"[data-kayit]\\\\\");if(kayit&&navigator.mediaDevices){kayit.addEventListener(\\\\\"click\\\\\",async function(){try{var st=await navigator.mediaDevices.getUserMedia({audio:true});var rd=new MediaRecorder(st);var parca=[];rd.ondataavailable=function(e){parca.push(e.data)};rd.onstop=function(){var blob=new Blob(parca,{type:\\\\\"audio/webm\\\\\"});var au=document.getElementById(\\\\\"kayit-ses\\\\\");au.src=URL.createObjectURL(blob);au.classList.remove(\\\\\"hidden\\\\\")};rd.start();kayit.textContent=\\\\\"⏹ Kaydı bitir\\\\\";kayit.dataset.durum=\\\\\"kayit\\\\\";setTimeout(function(){if(rd.state!==\\\\\"inactive\\\\\"){rd.stop();st.getTracks().forEach(function(t){t.stop()});kayit.textContent=\\\\\"🎙️ Yeniden kaydet\\\\\"}},120000);}catch(e){document.getElementById(\\\\\"kayit-uyari\\\\\").textContent=\\\\\"Mikrofon izni verilmedi. Tarayıcı ayarlarından izin ver ya da sesli okuma modunu kullan.\\\\\"}});}\",\n\"var z=document.querySelector(\\\\\"[data-geri-sayim]\\\\\");if(z){var sn=Number(z.getAttribute(\\\\\"data-geri-sayim\\\\\"));var el=document.getElementById(\\\\\"sayac\\\\\");var t=setInterval(function(){sn--;if(el){el.textContent=Math.floor(sn/60)+\\\\\" dk \\\\\"+(sn%60)+\\\\\" sn\\\\\"}if(sn<=0){clearInterval(t);if(el)el.textContent=\\\\\"Süre doldu!\\\\\";document.body.classList.add(\\\\\"sure-bitti\\\\\")}},1000);}\",\n\"var sayac=document.querySelector(\\\\\"[data-kelime-sayaci]\\\\\");if(sayac){var tas=document.getElementById(\\\\\"metin\\\\\");var g=document.getElementById(\\\\\"kelime\\\\\");var f=function(){var n=tas.value.trim()?tas.value.trim().split(/\\\\\\\\s+/).length:0;g.textContent=n+\\\\\" kelime\\\\\";g.style.color=n>=250?\\\\\"var(--ok)\\\\\":\\\\\"var(--warn)\\\\\"};tas.addEventListener(\\\\\"input\\\\\",f);f();}\",";

const DEMO_SITE_SOURCE = [
'#!/usr/bin/env node',
'/* ==========================================================================',
' *  site-demo.mjs — IELTS AKADEMİ • ÇALIŞAN DEMO SİTE (tek dosya, bağımlılıksız)',
' *  Ne yapar: e-posta + şifre ile kayıt, giriş ekranı, oturum çerezi, korumalı',
' *  sayfalar, bölümlere gerçek giriş, animasyonlar, cevap denetimi, XP kaydı.',
' *  Çalıştırma:  node site-demo.mjs         → http://localhost:3000',
' *  Veriyi sıfırlama: dosyanın yanındaki data/ klasörünü sil.',
' * ========================================================================== */',
'',
'import { createServer } from "node:http";',
'import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";',
'import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";',
'import { join, dirname, extname } from "node:path";',
'import { fileURLToPath } from "node:url";',
'',
'const ROOT = dirname(fileURLToPath(import.meta.url));',
'const DATA = join(ROOT, "data");',
'const SITE = join(DATA, "site");',
'const PORT = Number(process.env.PORT || 3000);',
'mkdirSync(SITE, { recursive: true });',
'mkdirSync(join(SITE, "anim"), { recursive: true });',
'mkdirSync(join(SITE, "img"), { recursive: true });',
'',
'/* ---------- küçük yardımcılar ---------- */',
'const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");',
'const readJson = (f, fb) => { try { return JSON.parse(readFileSync(join(DATA, f), "utf8")); } catch { return fb; } };',
'const writeJson = (f, v) => writeFileSync(join(DATA, f), JSON.stringify(v, null, 2), "utf8");',
'const uid = (n = 12) => randomBytes(n).toString("hex");',
'',
'/* ---------- şifre: scrypt + rastgele tuz (asla düz metin saklanmaz) ---------- */',
'function hashPassword(pw) {',
'  const salt = randomBytes(16).toString("hex");',
'  const key = scryptSync(pw, salt, 64).toString("hex");',
'  return "scrypt:" + salt + ":" + key;',
'}',
'function verifyPassword(pw, stored) {',
'  try {',
'    const [, salt, key] = String(stored).split(":");',
'    const mine = scryptSync(pw, salt, 64);',
'    const theirs = Buffer.from(key, "hex");',
'    return mine.length === theirs.length && timingSafeEqual(mine, theirs);',
'  } catch { return false; }',
'}',
'',
'/* ---------- veri katmanı (JSON dosyaları; tek kullanıcı/pc için yeterli) ---------- */',
'function users() { return readJson("users.json", []); }',
'function saveUsers(u) { writeJson("users.json", u); }',
'function sessions() { return readJson("sessions.json", {}); }',
'function saveSessions(s) { writeJson("sessions.json", s); }',
'function progressFor(userId) {',
'  const all = readJson("progress.json", {});',
'  all[userId] = all[userId] || { xp: 0, streakDays: 0, lastDay: null, answered: {}, badges: [], visits: 0, modules: {} };',
'  return all[userId];',
'}',
'function saveProgress(userId, p) { const all = readJson("progress.json", {}); all[userId] = p; writeJson("progress.json", all); }',
'',
'/* ---------- oturum çerezi ---------- */',
'function parseCookies(req) {',
'  const out = {};',
'  const raw = req.headers.cookie || "";',
'  for (const part of raw.split(";")) {',
'    const i = part.indexOf("=");',
'    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());',
'  }',
'  return out;',
'}',
'function currentUser(req) {',
'  const sid = parseCookies(req).sid;',
'  if (!sid) return null;',
'  const s = sessions()[sid];',
'  if (!s) return null;',
'  if (s.expiresAt < Date.now()) { const all = sessions(); delete all[sid]; saveSessions(all); return null; }',
'  const u = users().find((x) => x.id === s.userId);',
'  return u || null;',
'}',
'function startSession(res, userId) {',
'  const sid = uid(24);',
'  const all = sessions();',
'  all[sid] = { userId, createdAt: Date.now(), expiresAt: Date.now() + 30 * 86400000 };',
'  saveSessions(all);',
'  res.setHeader("Set-Cookie", "sid=" + sid + "; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000");',
'  return sid;',
'}',
'function endSession(req, res) {',
'  const sid = parseCookies(req).sid;',
'  if (sid) { const all = sessions(); delete all[sid]; saveSessions(all); }',
'  res.setHeader("Set-Cookie", "sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");',
'}',
'',
'/* ---------- içerik (demo: her bölümde gerçek örnek içerik) ---------- */',
'const MODULES = [',
'  { slug: "gramer", ad: "Gramer Akademi", ikon: "ikon-gramer.svg", anim: "ilerleme-halkasi.gif", renk: "#8B5CF6", ozet: "A1→C2, 9 bloklu dersler, 🇹🇷 klasik hatalar, ⚠️ sınav kritik detayları" },',
'  { slug: "okuma", ad: "Okuma Laboratuvarı", ikon: "ikon-okuma.svg", anim: "basari.gif", renk: "#0EA5E9", ozet: "Her metinde en az 10 soru, kanıt cümlesi vurgulama, TFNG tuzağı" },',
'  { slug: "dinleme", ad: "Dinleme Laboratuvarı", ikon: "ikon-dinleme.svg", anim: "dinleme-dalgasi.gif", renk: "#14B8A6", ozet: "GERÇEK insan sesi, 6 aksan, dikte + gölgeleme + sınav modu" },',
'  { slug: "konusma", ad: "Konuşma Laboratuvarı", ikon: "ikon-konusma.svg", anim: "lumi-maskot.gif", renk: "#EC4899", ozet: "Part 1-2-3 görevleri, kendi sesini kaydet, kontrol listesiyle öz değerlendirme" },',
'  { slug: "yazma", ad: "Yazma Laboratuvarı", ikon: "ikon-yazma.svg", anim: "kelime-karti.gif", renk: "#F59E0B", ozet: "Task 1 (grafik/süreç/harita) ve Task 2 (5 tip), 4 ölçütlü band raporu" },',
'  { slug: "kelime", ad: "Kelime Hazinesi", ikon: "ikon-kelime.svg", anim: "kelime-karti.gif", renk: "#A855F7", ozet: "23 alanlı kartlar: TR/EN anlam, eş anlamlı, collocation, iki dilli örnek" },',
'  { slug: "deneme", ad: "Deneme Sınavı", ikon: "ikon-deneme.svg", anim: "sinav-zamanlayici.gif", renk: "#EF4444", ozet: "Sınav Modu: süreli, geri sayımlı, yazım denetimi yok, band raporu" },',
'  { slug: "arsiv", ad: "1989 → 2026 Arşiv", ikon: "ikon-arsiv.svg", anim: "yildiz-parlamasi.gif", renk: "#6366F1", ozet: "Dönem kartları ve dönem formatında özgün denemeler" },',
'  { slug: "bilim", ad: "Bilim Kütüphanesi", ikon: "ikon-bilim.svg", anim: "yildiz-parlamasi.gif", renk: "#22C55E", ozet: "6 alan, A1→C2, sesli okuma ve terim kartları" },',
'  { slug: "taktik", ad: "Taktik Kütüphanesi", ikon: "ikon-taktik.svg", anim: "basari.gif", renk: "#F97316", ozet: "Her soru tipi için strateji, süre hedefi ve klasik tuzak" },',
'  { slug: "rozet", ad: "Rozetler", ikon: "ikon-rozet.svg", anim: "rozet-havai-fisek.gif", renk: "#FACC15", ozet: "1000 rozet, havai fişek kutlaması, XP ödülü" },',
'  { slug: "soz", ad: "Motivasyon", ikon: "ikon-soz.svg", anim: "konfeti.gif", renk: "#EC4899", ozet: "Her girişte değişen söz, kaygı yönetimi, küçük zaferler" },',
'];',
'',
'const SOZLER = [',
'  ["Bugün 20 dakika ayırman, dün ayırmadığın 20 dakikadan daha değerli.", "The twenty minutes you spend today matter more than the twenty you skipped yesterday."],',
'  ["Hata yapmaktan korkmadan konuşmak, kalıcı bir hafıza demektir.", "Speaking without the fear of mistakes is how memory becomes permanent."],',
'  ["Kelime öğrenmek yarış değil; her gün bir tuğla koymak.", "Learning vocabulary is not a race; it is one brick a day."],',
'  ["Deneme sonucun kimliğin değil; sadece bir ölçüm.", "A mock test score is not your identity; it is only a measurement."],',
'  ["Küçük adım, büyük planı taşır.", "Small steps carry big plans."],',
'  ["Anlamadığın yeri sormak, öğrenmenin en hızlı yolu.", "Asking about what you did not understand is the fastest way to learn."],',
'];',
'',
'const OKUMA = {',
'  baslik: "Green Roofs in Modern Cities",',
'  seviye: "B1",',
'  paragraflar: [',
'    { no: 1, metin: "Green roofs are layers of plants grown on top of buildings. They are not a new idea: people have grown plants on roofs for hundreds of years." },',
'    { no: 2, metin: "In cities, green roofs cool buildings in summer and keep heat inside during winter. They also slow rainwater, which reduces flooding after heavy storms." },',
'    { no: 3, metin: "However, these projects are not cheap. A green roof can cost three times more than a traditional roof, and it needs regular care." },',
'    { no: 4, metin: "Some city councils now offer money to building owners, because green roofs can lower the temperature of a whole neighbourhood." },',
'  ],',
'  sorular: [',
'    { id: "q1", tip: "TFNG", soru: "Green roofs are a completely new idea.", cevap: "FALSE", kanit: "They are not a new idea", aciklama: "Metin açıkça yeni bir fikir olmadığını söylüyor." },',
'    { id: "q2", tip: "TFNG", soru: "Green roofs can reduce flooding after storms.", cevap: "TRUE", kanit: "reduces flooding after heavy storms", aciklama: "Su akışını yavaşlatıp seli azalttığı yazıyor." },',
'    { id: "q3", tip: "TFNG", soru: "Green roofs are cheaper than traditional roofs.", cevap: "FALSE", kanit: "can cost three times more", aciklama: "Metin tam tersini söylüyor: üç kat pahalı olabilir." },',
'    { id: "q4", tip: "TFNG", soru: "Some councils give money to building owners.", cevap: "TRUE", kanit: "offer money to building owners", aciklama: "Belediyelerin destek verdiği yazıyor." },',
'    { id: "q5", tip: "TFNG", soru: "Green roofs make buildings warmer in summer.", cevap: "FALSE", kanit: "cool buildings in summer", aciklama: "Yazın serinlettiği yazıyor, ısıtmadığı." },',
'    { id: "q6", tip: "TFNG", soru: "All green roofs are maintained by the government.", cevap: "NOT GIVEN", kanit: "it needs regular care", aciklama: "Bakım gerektiği yazıyor ama KİMİN bakım yaptığı yazmıyor → NOT GIVEN." },',
'    { id: "q7", tip: "MCQ", soru: "What is the writer\'s main point in paragraph 3?", cevap: "C", secenekler: ["Green roofs are beautiful", "Green roofs are illegal", "Green roofs cost more than normal roofs", "Green roofs need no care"], kanit: "these projects are not cheap", aciklama: "Paragraf maliyet ve bakım zorluğunu anlatıyor." },',
'    { id: "q8", tip: "MCQ", soru: "Why do councils offer money?", cevap: "B", secenekler: ["To build car parks", "Because green roofs cool whole neighbourhoods", "To close old buildings", "To raise taxes"], kanit: "lower the temperature of a whole neighbourhood", aciklama: "Sebep doğrudan metinde veriliyor." },',
'    { id: "q9", tip: "KELIME", soru: "Complete: They slow rainwater, which reduces ______ after heavy storms. (1 kelime)", cevap: "flooding", kanit: "reduces flooding", aciklama: "Kelime sınırı: 1 kelime." },',
'    { id: "q10", tip: "KELIME", soru: "Complete: A green roof can cost three times more than a ______ roof. (1 kelime)", cevap: "traditional", kanit: "than a traditional roof", aciklama: "Metinden birebir alınır." },',
'  ],',
'};',
'',
'const DINLEME = {',
'  baslik: "Kütüphane Kayıt Görüşmesi",',
'  seviye: "A2",',
'  not: "Bu demo sürümde ses dosyası yoktur; gerçek insan sesi kayıtları (6 aksan × 2 cinsiyet) projeye eklenecektir. Aşağıdaki transkript aynı kaydın metnidir.",',
'  satirlar: [',
'    ["Officer", "Good morning, welcome to Bursa City Library."],',
'    ["Student", "Hello. I would like to join the library."],',
'    ["Officer", "Your membership card is free, but please bring your identity card."],',
'    ["Officer", "Books can be borrowed for two weeks."],',
'    ["Officer", "If you return them late, the fine is two lira per day."],',
'  ],',
'  sorular: [',
'    { id: "l1", tip: "MCQ", soru: "How much is the membership card?", cevap: "A", secenekler: ["Free", "Two lira", "Ten lira", "One week"], aciklama: "\\"Your membership card is free\\" ifadesi doğrudan cevabı verir." },',
'    { id: "l2", tip: "KELIME", soru: "What must you bring? (1-2 kelime)", cevap: "identity card", aciklama: "Yazım hatası olmadan yazılmalı." },',
'    { id: "l3", tip: "KELIME", soru: "How long can you borrow books? (1-2 kelime)", cevap: "two weeks", aciklama: "Sayı yakalama sorusu." },',
'  ],',
'};',
'',
'const GRAMER = [',
'  { baslik: "Present Simple", seviye: "A1", kural: "Özne + fiil + nesne. He/She/It ile fiile -s eklenir.", ornek: ["I work in Bursa.", "She works here.", "They do not work today."], hatalar: ["\\"She work here\\" → \\"She works here\\" (3. tekil şahısta -s zorunlu)"], kritik: "Listening bölümünde geniş zaman ifadeleri (usually, every day) cevabı doğrudan işaret eder." },',
'  { baslik: "Present Perfect", seviye: "A2", kural: "have/has + V3. Belirli zaman ifadesi (yesterday, in 2020) varsa kullanılmaz.", ornek: ["I have finished my homework.", "She has lived here for five years."], hatalar: ["\\"I have seen him yesterday\\" → \\"I saw him yesterday\\""], kritik: "Writing Task 1\'de eğilim anlatırken \\"has risen since 2019\\" üst band cümlesidir." },',
'  { baslik: "Passive Voice", seviye: "B1", kural: "be + V3. Kim yaptığı bilinmiyorsa veya önemsizse kullanılır.", ornek: ["The report was written by the team.", "English is spoken in many countries."], hatalar: ["\\"The report was write\\" → \\"was written\\""], kritik: "Process (süreç) tipi Task 1 grafiklerinde pasif zorunludur." },',
'];',
'',
'const KELIME = [',
'  { kelime: "mitigate", tr: "hafifletmek, azaltmak", orn: "Governments can mitigate the effects of drought.", es: "alleviate, reduce", seviye: "C1" },',
'  { kelime: "significant", tr: "önemli, kayda değer", orn: "There was a significant rise in sales.", es: "considerable, notable", seviye: "B2" },',
'  { kelime: "curriculum", tr: "müfredat", orn: "Coding is part of the curriculum now.", es: "syllabus", seviye: "B2" },',
'  { kelime: "sustainable", tr: "sürdürülebilir", orn: "Sustainable design saves energy.", es: "viable, eco-friendly", seviye: "B2" },',
'  { kelime: "fluctuate", tr: "dalgalanmak", orn: "Prices fluctuated between 10 and 20 percent.", es: "vary, rise and fall", seviye: "B2" },',
'];',
'',
'const YAZMA = { baslik: "Some people believe private cars should be banned from city centres.", tip: "Task 2 • Opinion", minKelime: 250, anahtarlar: ["cars", "city", "ban", "public transport", "pollution"] };',
'const KONUSMA = [',
'  { kart: "İyi öğrendiğin bir beceriyi anlat.", alt: ["Bu beceri nedir?", "Nasıl öğrendin?", "Kim yardım etti?", "Hayatını nasıl değiştirdi?"] },',
'  { kart: "Son zamanlarda okuduğun bir haberi anlat.", alt: ["Ne hakkındaydı?", "Nereden okudun?", "Neden ilgini çekti?", "Kime anlatmak isterdin?"] },',
'  { kart: "Küçük bir hatadan öğrendiğin bir dersi anlat.", alt: ["Hata neydi?", "Nasıl fark ettin?", "Ne öğrendin?", "Bugün ne yapıyorsun farklı?"] },',
'];',
'const ROZETLER = [',
'  { id: "b1", ad: "İlk Adım", sart: "İlk girişini yap", ikon: "rozet-bronze.svg" },',
'  { id: "b2", ad: "Okuma Kurdu", sart: "İlk okuma setini bitir", ikon: "rozet-silver.svg" },',
'  { id: "b3", ad: "Seri Başlangıcı", sart: "3 gün üst üste çalış", ikon: "rozet-gold.svg" },',
'  { id: "b4", ad: "Deneme Savaşçısı", sart: "İlk deneme bölümünü bitir", ikon: "rozet-platinum.svg" },',
'  { id: "b5", ad: "Kelime Avcısı", sart: "10 kelime tekrarı yap", ikon: "rozet-gold.svg" },',
'  { id: "b6", ad: "Azim Ödülü", sart: "7 gün üst üste çalış", ikon: "rozet-legendary.svg" },',
'];',
'',
'/* ---------- tasarım (light + dark, capcanlı renkler) ---------- */',
  "const CSS = " + JSON.stringify(DEMO_CSS) + ";",
'',
  "const CLIENT_JS = " + JSON.stringify(DEMO_CLIENT_JS) + ";",
'',
'/* ---------- görünüm parçaları ---------- */',
'function layout(user, title, body, opts) {',
'  const o = opts || {};',
'  const s = SOZLER[Math.floor(Math.random() * SOZLER.length)];',
'  return "<!doctype html><html lang=\\"tr\\" data-theme=\\"light\\"><head><meta charset=\\"utf-8\\">" +',
'    "<meta name=\\"viewport\\" content=\\"width=device-width,initial-scale=1\\">" +',
'    "<title>" + esc(title) + " • IELTS Akademi</title>" +',
'    "<link rel=\\"stylesheet\\" href=\\"/stil.css\\">" +',
'    "<link rel=\\"icon\\" href=\\"/img/logo.svg\\">" +',
'    "</head><body>" +',
'    "<a class=\\"skip\\" href=\\"#icerik\\">İçeriğe geç</a>" +',
'    "<header class=\\"top\\"><nav class=\\"nav\\">" +',
'    "<a class=\\"brand\\" href=\\"/\\" data-nav><img src=\\"/img/logo.svg\\" alt=\\"\\"><span>IELTS Akademi</span></a>" +',
'    "<div class=\\"links\\">" +',
'    "<a class=\\"link\\" href=\\"/bolum/gramer\\" data-nav>Gramer</a>" +',
'    "<a class=\\"link\\" href=\\"/bolum/okuma\\" data-nav>Okuma</a>" +',
'    "<a class=\\"link\\" href=\\"/bolum/dinleme\\" data-nav>Dinleme</a>" +',
'    "<a class=\\"link\\" href=\\"/bolum/konusma\\" data-nav>Konuşma</a>" +',
'    "<button class=\\"btn\\" data-theme-toggle>🌙 Koyu tema</button>" +',
'    (user',
'      ? "<a class=\\"link\\" href=\\"/panel\\" data-nav>Panelim</a><form method=\\"post\\" action=\\"/cikis\\" style=\\"display:inline\\"><button class=\\"btn\\" type=\\"submit\\">Çıkış</button></form>"',
'      : "<a class=\\"link\\" href=\\"/giris\\" data-nav>Giriş</a><a class=\\"primary link\\" href=\\"/kayit\\" data-nav>Ücretsiz kayıt</a>") +',
'    "</div></nav></header>" +',
'    "<main id=\\"icerik\\" class=\\"wrap\\">" + (o.hero ? "<p class=\\"card small\\"><strong>Günün sözü:</strong> " + esc(s[0]) + " <span class=\\"muted\\">— " + esc(s[1]) + "</span></p>" : "") + body + "</main>" +',
'    "<footer><p>IELTS Akademi • Bu demo, platformun çalışan iskeletidir. 1000 rozet, 1000 söz ve tüm içerik <strong>TEK-KOD.mjs</strong> ile üretilir.</p></footer>" +',
'    "<div id=\\"kutlama\\" class=\\"hidden\\" style=\\"position:fixed;right:16px;bottom:16px;z-index:40\\"><div class=\\"card row\\"><img class=\\"anim\\" style=\\"max-width:140px\\" src=\\"/anim/rozet-havai-fisek.gif\\" alt=\\"Rozet kutlaması\\"><div><strong>Harika! Rozet kazandın 🎉</strong><p class=\\"small muted\\">Panodan yeni rozetini görebilirsin.</p></div></div></div>" +',
'    "<script src=\\"/istemci.js\\"></script></body></html>";',
'}',
'',
'function moduleCard(m) {',
'  return "<a class=\\"card mod\\" href=\\"/bolum/" + m.slug + "\\" data-nav>" +',
'    "<img class=\\"ikon\\" src=\\"/img/" + m.ikon + "\\" alt=\\"\\">" +',
'    "<span><strong>" + esc(m.ad) + "</strong><br><span class=\\"small muted\\">" + esc(m.ozet) + "</span></span></a>";',
'}',
'',
'/* ---------- sayfalar ---------- */',
'function pageHome(user) {',
'  return layout(user, "Ana sayfa",',
'    "<section class=\\"card row\\" style=\\"justify-content:space-between\\">" +',
'    "<div style=\\"max-width:560px\\"><h1>IELTS Akademi</h1>" +',
'    "<p>A1\'dan C2\'ye gramer, okuma, dinleme, konuşma, yazma ve kelime. <strong>Pazartesi + Çarşamba</strong> canlı ders günleri, kalan günler kişisel program.</p>" +',
'    "<p class=\\"row\\"><a class=\\"primary link\\" href=\\"/kayit\\" data-nav>Hemen hesap oluştur</a><a class=\\"link\\" href=\\"/giris\\" data-nav>Zaten hesabım var</a></p>" +',
'    "<p class=\\"small muted\\">Bu sayfa halka açıktır; bölümler ve panel yalnızca giriş yapan öğrenciye açılır.</p></div>" +',
'    "<img class=\\"anim\\" src=\\"/anim/lumi-maskot.gif\\" alt=\\"Lumi maskotu el sallıyor\\"></section>" +',
'    "<h2>Bölümler</h2><section class=\\"grid\\">" + MODULES.map(moduleCard).join("") + "</section>" +',
'    "<section class=\\"card\\"><h2>Varlık kontrolü</h2><p>Tüm animasyonlar ve simgeler bu sitede yerel dosyadan gelir. <a href=\\"/varliklar\\" data-nav>Varlık durumunu gör</a>.</p>" +',
'    "<p class=\\"row\\"><img class=\\"anim\\" style=\\"max-width:180px\\" src=\\"/anim/konfeti.gif\\" alt=\\"Konfeti\\"><img class=\\"anim\\" style=\\"max-width:180px\\" src=\\"/anim/ilerleme-halkasi.gif\\" alt=\\"İlerleme halkası\\"></p></section>", { hero: true });',
'}',
'',
'function pageAuth(hata, basari, kip) {',
'  const giris = kip === "giris";',
'  return layout(null, giris ? "Giriş" : "Kayıt",',
'    "<section class=\\"card\\" style=\\"max-width:520px;margin:24px auto\\">" +',
'    "<h1>" + (giris ? "Hesabına gir" : "Yeni hesap oluştur") + "</h1>" +',
'    (hata ? "<p class=\\"msg err\\">" + esc(hata) + "</p>" : "") +',
'    (basari ? "<p class=\\"msg ok\\">" + esc(basari) + "</p>" : "") +',
'    "<form method=\\"post\\" action=\\"" + (giris ? "/giris" : "/kayit") + "\\">" +',
'    "<label for=\\"email\\">E-posta</label><input id=\\"email\\" name=\\"email\\" type=\\"email\\" required autocomplete=\\"email\\" placeholder=\\"ornek@eposta.com\\">" +',
'    "<label for=\\"sifre\\">Şifre</label><input id=\\"sifre\\" name=\\"sifre\\" type=\\"password\\" required minlength=\\"8\\" autocomplete=\\"" + (giris ? "current-password" : "new-password") + "\\" placeholder=\\"En az 8 karakter\\">" +',
'    (giris ? "" : "<label for=\\"ad\\">Ad (isteğe bağlı)</label><input id=\\"ad\\" name=\\"ad\\" type=\\"text\\" placeholder=\\"Adın\\">") +',
'    "<p style=\\"margin-top:14px\\"><button class=\\"primary btn\\" type=\\"submit\\" style=\\"width:100%\\">" + (giris ? "Giriş yap" : "Hesap oluştur") + "</button></p></form>" +',
'    "<p class=\\"small muted\\">" + (giris ? "Hesabın yok mu? <a href=\\"/kayit\\" data-nav>Kayıt ol</a>" : "Zaten üye misin? <a href=\\"/giris\\" data-nav>Giriş yap</a>") + "</p>" +',
'    "<p class=\\"small muted\\">Şifreler scrypt ile tuzlanarak saklanır; oturum çerezi HttpOnly\'dir.</p></section>");',
'}',
'',
'function pagePanel(user, p) {',
'  const modlar = Object.entries(p.modules || {}).map(function(e) { return "<li><strong>" + esc(e[0]) + "</strong>: " + e[1] + " etkinlik</li>"; }).join("") || "<li class=\\"muted\\">Henüz etkinlik yok — bir bölümden başla.</li>";',
'  const rozetler = ROZETLER.map(function(r) {',
'    const alindi = (p.badges || []).indexOf(r.id) >= 0;',
'    return "<div class=\\"q\\" style=\\"opacity:" + (alindi ? 1 : .45) + "\\"><img src=\\"/img/" + r.ikon + "\\" alt=\\"\\" style=\\"width:44px;height:44px;float:left;margin-right:10px\\"><strong>" + r.ad + "</strong><br><span class=\\"small muted\\">" + r.sart + (alindi ? " · KAZANILDI ✅" : "") + "</span></div>";',
'  }).join("");',
'  return layout(user, "Panelim",',
'    "<h1>Merhaba " + esc(user.ad || user.email.split("@")[0]) + " 👋</h1>" +',
'    "<section class=\\"row\\" style=\\"align-items:stretch\\">" +',
'    "<div class=\\"card\\" style=\\"flex:1;min-width:200px\\"><span class=\\"pill\\">XP</span><h2>" + p.xp + "</h2><p class=\\"small muted\\">Her doğru cevap XP kazandırır.</p></div>" +',
'    "<div class=\\"card\\" style=\\"flex:1;min-width:200px\\"><span class=\\"pill\\">Seri</span><h2>" + p.streakDays + " gün</h2><p class=\\"small muted\\">Bugün çalıştıysan ✓</p></div>" +',
'    "<div class=\\"card\\" style=\\"flex:1;min-width:200px\\"><span class=\\"pill\\">Rozet</span><h2>" + (p.badges || []).length + " / " + ROZETLER.length + "</h2><p class=\\"small muted\\">Demo koleksiyonu</p></div></div>" +',
'    "<section class=\\"card\\"><h2>Bugünün görevleri</h2><ol>" +',
'    "<li><a href=\\"/bolum/okuma\\" data-nav>1 okuma metni + soruları (10 soru)</a></li>" +',
'    "<li><a href=\\"/bolum/dinleme\\" data-nav>1 dinleme + transkript çalışması</a></li>" +',
'    "<li><a href=\\"/bolum/gramer\\" data-nav>A2 gramer: Present Perfect</a></li>" +',
'    "<li><a href=\\"/bolum/konusma\\" data-nav>60 saniye konuşma kaydı</a></li></ol>" +',
'    "<p class=\\"row\\"><img class=\\"anim\\" src=\\"/anim/ilerleme-halkasi.gif\\" alt=\\"İlerleme halkası\\"><img class=\\"anim\\" src=\\"/anim/seri-alev.gif\\" alt=\\"Seri alevi\\"></p></section>" +',
'    "<section class=\\"grid\\">" + MODULES.slice(0, 6).map(moduleCard).join("") + "</section>" +',
'    "<section class=\\"card\\"><h2>Modül etkinliğin</h2><ul>" + modlar + "</ul></section>" +',
'    "<section class=\\"card\\"><h2>Rozetler</h2>" + rozetler + "</section>");',
'}',
'',
'function pageModule(m, user, p, ekstra) {',
'  return layout(user, m.ad,',
'    "<p><a class=\\"small\\" href=\\"/panel\\" data-nav>← Panele dön</a></p>" +',
'    "<section class=\\"module\\">" +',
'    "<aside class=\\"card\\"><img class=\\"ikon\\" style=\\"width:56px;height:56px\\" src=\\"/img/" + m.ikon + "\\" alt=\\"\\"><h2 style=\\"margin:8px 0 4px\\">" + esc(m.ad) + "</h2><p class=\\"small muted\\">" + esc(m.ozet) + "</p>" +',
'    "<p class=\\"row\\"><img class=\\"anim\\" style=\\"max-width:100%\\" src=\\"/anim/" + m.anim + "\\" alt=\\"Animasyon\\"></p></aside>" +',
'    "<div>" + ekstra + "</div></section>");',
'}',
'',
'function soruHtml(s) {',
'  const girdi = s.tip === "MCQ" || s.tip === "TFNG"',
'    ? "<select>" + (s.secenekler || ["TRUE", "FALSE", "NOT GIVEN"]).map(function(o) { return "<option value=\\"" + esc(o) + "\\">" + esc(o) + "</option>"; }).join("") + "</select>"',
'    : "<input type=\\"text\\" placeholder=\\"Cevabını yaz\\">";',
'  return "<div class=\\"q\\" data-soru=\\"" + s.id + "\\" data-tip=\\"" + s.tip + "\\"><p><strong>" + esc(s.id.toUpperCase()) + " · " + s.tip + "</strong> " + esc(s.soru) + "</p>" + girdi +',
'    "<p class=\\"row\\" style=\\"margin-top:8px\\"><button class=\\"btn primary\\" type=\\"button\\" data-cevap-denetle>Kontrol et</button><span data-geri class=\\"small muted\\"></span></p></div>";',
'}',
'',
'function pageOkuma(m, user) {',
'  const icerik = "<article class=\\"card\\"><h1>" + esc(OKUMA.baslik) + "</h1><p><span class=\\"pill\\">" + OKUMA.seviye + "</span> <span class=\\"pill\\">" + OKUMA.sorular.length + " soru</span></p>" +',
'    OKUMA.paragraflar.map(function(pg) { return "<p><strong>" + pg.no + ".</strong> " + esc(pg.metin) + "</p>"; }).join("") +',
'    "<p class=\\"small muted\\">Her soruda kanıt cümlesi vurgulanır; cevap metinden birebir çıkar.</p></article>" +',
'    "<h2>Sorular</h2>" + OKUMA.sorular.map(soruHtml).join("");',
'  return pageModule(m, user, null, icerik);',
'}',
'',
'function pageDinleme(m, user) {',
'  const icerik = "<section class=\\"card\\"><h1>" + esc(DINLEME.baslik) + "</h1><p><span class=\\"pill\\">" + DINLEME.seviye + "</span></p><p class=\\"msg err\\" style=\\"font-weight:600\\">" + esc(DINLEME.not) + "</p>" +',
'    "<img class=\\"anim\\" src=\\"/anim/dinleme-dalgasi.gif\\" alt=\\"Dinleme dalga animasyonu\\">" +',
'    "<h2>Transkript</h2>" + DINLEME.satirlar.map(function(l) { return "<p><strong>" + esc(l[0]) + ":</strong> " + esc(l[1]) + "</p>"; }).join("") + "</section>" +',
'    "<h2>Sorular</h2>" + DINLEME.sorular.map(soruHtml).join("");',
'  return pageModule(m, user, null, icerik);',
'}',
'',
'function pageGramer(m, user) {',
'  const icerik = GRAMER.map(function(g) {',
'    return "<article class=\\"card\\"><h2>" + esc(g.baslik) + " <span class=\\"pill\\">" + g.seviye + "</span></h2>" +',
'      "<p><strong>Kural:</strong> " + esc(g.kural) + "</p>" +',
'      "<p><strong>Örnekler:</strong></p><ul>" + g.ornek.map(function(o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>" +',
'      "<p class=\\"msg err\\">🇹🇷 " + esc(g.hatalar[0]) + "</p>" +',
'      "<p class=\\"msg warn\\" style=\\"background:color-mix(in srgb,var(--warn) 16%,transparent);color:var(--warn)\\">⚠️ " + esc(g.kritik) + "</p></article>";',
'  }).join("");',
'  const alistirma = "<section class=\\"card\\"><h2>Hızlı alıştırma</h2>" + [',
'    { id: "g1", tip: "KELIME", soru: "She ______ (work) here every day. → doğru fiil biçimini yaz", cevap: "works", kanit: "She works here", aciklama: "3. tekil şahısta -s kuralı." },',
'    { id: "g2", tip: "KELIME", soru: "I ______ (finish) my homework. (yakın geçmiş, sonucu şimdi önemli)", cevap: "have finished", kanit: "I have finished my homework.", aciklama: "Present perfect: have + V3." },',
'    { id: "g3", tip: "MCQ", soru: "Choose the correct passive: The report ______ by the team.", secenekler: ["was written", "was wrote", "wrote", "is write"], cevap: "was written", aciklama: "be + V3." },',
'  ].map(soruHtml).join("") + "</section>";',
'  return pageModule(m, user, null, icerik + alistirma);',
'}',
'',
'function pageKelime(m, user) {',
'  const icerik = "<section class=\\"card\\"><h2>Bugünün kelimeleri</h2><p class=\\"small muted\\">Her kartta TR/EN anlam, eş anlamlı ve örnek cümle vardır. Sesli okuma için gerçek insan kayıtları projeye eklenecek.</p></section>" +',
'    "<section class=\\"grid\\">" + KELIME.map(function(w) {',
'      return "<article class=\\"card\\"><span class=\\"pill\\">" + w.seviye + "</span><h3>" + esc(w.kelime) + "</h3><p><strong>" + esc(w.tr) + "</strong></p><p class=\\"small muted\\">Eş anlamlı: " + esc(w.es) + "</p><p class=\\"small\\">" + esc(w.orn) + "</p></article>";',
'    }).join("") + "</section>";',
'  return pageModule(m, user, null, icerik);',
'}',
'',
'function pageKonusma(m, user) {',
'  const icerik = "<section class=\\"card\\"><h2>Part 2 kartları</h2>" + KONUSMA.map(function(k) {',
'    return "<article class=\\"q\\"><strong>" + esc(k.kart) + "</strong><ul>" + k.alt.map(function(a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></article>";',
'  }).join("") + "<p class=\\"row\\"><button class=\\"btn primary\\" type=\\"button\\" data-kayit>🎙️ Kaydı başlat (en fazla 2 dakika)</button></p>" +',
'    "<audio id=\\"kayit-ses\\" controls class=\\"hidden\\" style=\\"width:100%;margin-top:10px\\"></audio><p id=\\"kayit-uyari\\" class=\\"msg err hidden\\"></p>" +',
'    "<p class=\\"small muted\\">Telaffuz bandı otomatik verilmez; kaydını öğretmeninle veya öz değerlendirme listesiyle değerlendir.</p></section>";',
'  return pageModule(m, user, null, icerik);',
'}',
'',
'function pageYazma(m, user) {',
'  const icerik = "<section class=\\"card\\"><h2>" + esc(YAZMA.tip) + "</h2><p>" + esc(YAZMA.baslik) + "</p>" +',
'    "<p class=\\"small muted\\">Hedef: en az " + YAZMA.minKelime + " kelime. Kronometreyi kendin tut: 40 dakika.</p>" +',
'    "<label for=\\"metin\\">Yazın</label><textarea id=\\"metin\\" rows=\\"10\\" data-kelime-sayaci></textarea>" +',
'    "<p><span id=\\"kelime\\" class=\\"pill\\">0 kelime</span></p>" +',
'    "<p class=\\"small muted\\">Değerlendirme ölçütleri: Görev Yanıtı · Tutarlılık · Kelime Kaynağı · Gramer. (Bu demoda otomatik band verilmez; gerçek platformda 4 ölçütlü rapor üretilir.)</p></section>";',
'  return pageModule(m, user, null, icerik);',
'}',
'',
'function pageDeneme(m, user) {',
'  const soru = [',
'    { id: "d1", tip: "MCQ", soru: "(Reading) The passage says green roofs \\"slow rainwater\\". What does this mean?", secenekler: ["They stop rain", "They delay water flow", "They store drinking water", "They warm the roof"], cevap: "They delay water flow", aciklama: "slow = yavaşlatmak → akışı geciktirmek." },',
'    { id: "d2", tip: "TFNG", soru: "The writer believes green roofs are always cheap.", cevap: "FALSE", kanit: "not cheap", aciklama: "Metin pahalı olabileceğini söylüyor." },',
'    { id: "d3", tip: "KELIME", soru: "(Listening) How much is the late fine per day? (1-2 kelime)", cevap: "two lira", aciklama: "Birim tuzağı: 2 hafta ↔ 2 lira." },',
'  ];',
'  const icerik = "<section class=\\"card\\"><h2>Sınav Modu</h2><p class=\\"msg warn\\" style=\\"background:color-mix(in srgb,var(--warn) 16%,transparent);color:var(--warn)\\">Sınav modunda yazım denetimi yoktur ve Listening\'de 10 dakikalık aktarma süresi yoktur. Kalan süre: <strong id=\\"sayac\\">5 dk</strong></p>" +',
'    "<img class=\\"anim\\" src=\\"/anim/sinav-zamanlayici.gif\\" alt=\\"Zamanlayıcı\\"><div data-geri-sayim=\\"300\\"></div></section>" +',
'    "<h2>Sorular</h2>" + soru.map(soruHtml).join("");',
'  return pageModule(m, user, null, icerik);',
'}',
'',
'function pageArsiv(m, user) {',
'  const donemler = [',
'    ["1989-1994", "IELTS yürürlüğe girdi; iki genel + iki özel modül vardı."],',
'    ["1995-2000", "Academic Reading/Writing tek modülde birleşti; Reading üç metne çıktı."],',
'    ["2001-2004", "Bugünkü üç bölümlü Speaking geldi."],',
'    ["2005-2007", "Yeni yazma kriterleri ve yarım band raporlama."],',
'    ["2008-2014", "Telaffuz ölçeği netleşti; kâğıt sınav küresel standart oldu."],',
'    ["2015-2019", "UKVI, Life Skills ve bilgisayar tabanlı sınav (CD-IELTS)."],',
'    ["2020-2022", "Video görüşmeyle Speaking; One Skill Retake duyurusu."],',
'    ["2023-2025", "OSR uygulamada; bilgisayar sınav baskın hâle geldi."],',
'    ["2026", "Kâğıt sınav kapanıyor; OSR yalnızca bilgisayarda; yazım denetimi yok."],',
'  ];',
'  const icerik = "<section class=\\"card\\"><h2>Dönem kartları</h2><p class=\\"small muted\\">Resmî sınav kâğıtları kullanılmaz; her dönemin üslubuyla SIFIRDAN özgün denemeler yazılır.</p></section>" +',
'    donemler.map(function(d) { return "<article class=\\"card\\"><span class=\\"pill\\">" + d[0] + "</span><p>" + esc(d[1]) + "</p></article>"; }).join("");',
'  return pageModule(m, user, null, icerik);',
'}',
'',
'function pageTaktik(m, user) {',
'  const taktikler = [',
'    ["TFNG", "İddianın TAMAMI metinde yoksa NOT GIVEN. \\"Kanıtlanmıştır\\", \\"her zaman\\" gibi güçlü ifadeler tuzaktır.", "80 sn/soru"],',
'    ["Sayı yakalama", "Soruyu cevaplamadan önce istenen birimi belirle (hafta mı, lira mı?).", "30 sn/soru"],',
'    ["Matching headings", "İlk cümleye değil, paragrafın tamamının işine bak.", "90 sn/soru"],',
'    ["Writing Task 1", "Overview cümlesinde sayı verme, eğilimi yaz. Sonuç paragrafı yazma.", "20 dk"],',
'    ["Writing Task 2", "Her gövde paragrafı: iddia + gerekçe + örnek.", "40 dk"],',
'    ["Speaking Part 2", "Her alt soruya 25-30 saniye; bir örnek ve bir duygu cümlesi ekle.", "2 dk"],',
'  ];',
'  const icerik = "<section class=\\"card\\"><h2>Hızlı taktikler</h2></section>" + taktikler.map(function(t) {',
'    return "<article class=\\"card\\"><span class=\\"pill\\">" + esc(t[0]) + "</span><p>" + esc(t[1]) + "</p><p class=\\"small muted\\">Süre hedefi: " + esc(t[2]) + "</p></article>";',
'  }).join("");',
'  return pageModule(m, user, null, icerik);',
'}',
'',
'function pageRozet(m, user, p) {',
'  const icerik = "<section class=\\"card\\"><h2>Rozetler ve kutlama</h2><p class=\\"small muted\\">Gerçek platformda 1000 rozet vardır; bu demoda " + ROZETLER.length + " tanesi gösterilir. Kazandığında havai fişek kutlaması açılır.</p>" +',
'    "<img class=\\"anim\\" src=\\"/anim/rozet-havai-fisek.gif\\" alt=\\"Rozet havai fişek animasyonu\\"></section>" +',
'    ROZETLER.map(function(r) { const alindi = (p.badges || []).indexOf(r.id) >= 0; return "<article class=\\"card\\"><img src=\\"/img/" + r.ikon + "\\" style=\\"width:48px\\" alt=\\"\\"><h3>" + r.ad + "</h3><p class=\\"small muted\\">" + r.sart + "</p><p>" + (alindi ? "✅ Kazanıldı" : "🔒 Henüz kazanılmadı") + "</p></article>"; }).join("");',
'  return pageModule(m, user, p, icerik);',
'}',
'',
'function pageSoz(m, user) {',
'  const icerik = "<section class=\\"card\\"><h2>Motivasyon</h2><p class=\\"small muted\\">Bu demoda 6 söz vardır, her girişte değişir. Gerçek platformda 1000 söz (TR+EN) gün ve kullanıcıya göre seçilir.</p>" +',
'    "<img class=\\"anim\\" src=\\"/anim/konfeti.gif\\" alt=\\"Konfeti\\"></section>" +',
'    SOZLER.map(function(s) { return "<article class=\\"card\\"><p><strong>" + esc(s[0]) + "</strong></p><p class=\\"small muted\\">" + esc(s[1]) + "</p></article>"; }).join("");',
'  return pageModule(m, user, null, icerik);',
'}',
'',
'const PAGE_BUILDERS = { okuma: pageOkuma, dinleme: pageDinleme, gramer: pageGramer, kelime: pageKelime, konusma: pageKonusma, yazma: pageYazma, deneme: pageDeneme, arsiv: pageArsiv, bilim: pageTaktik, taktik: pageTaktik, rozet: pageRozet, soz: pageSoz };',
'',
'/* ---------- statik servis ---------- */',
'const MIME = { ".gif": "image/gif", ".svg": "image/svg+xml", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png" };',
'function serveFile(res, file) {',
'  try {',
'    const st = statSync(file);',
'    res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream", "Content-Length": st.size, "Cache-Control": "public, max-age=86400" });',
'    res.end(readFileSync(file));',
'    return true;',
'  } catch { return false; }',
'}',
'',
'/* ---------- cevap denetimi (akıllı eşleştirme: büyük/küçük harf, boşluk, çoğul) ---------- */',
'function normalize(s) { return String(s).trim().toLowerCase().replace(/[.,!?;:]/g, "").replace(/\\s+/g, " "); }',
'function checkAnswer(soru, yanit) {',
'  const a = normalize(soru.cevap), g = normalize(yanit);',
'  if (a === g) return { correct: true };',
'  if (soru.tip === "MCQ") {',
'    const idx = ["A", "B", "C", "D"].indexOf(String(yanit).trim().toUpperCase());',
'    if (idx >= 0 && (soru.secenekler || [])[idx] && normalize(soru.secenekler[idx]) === a) return { correct: true };',
'  }',
'  if (soru.tip === "TFNG") {',
'    const eq = { "true": "true", "false": "false", "not given": "not given", "ng": "not given", "doğru": "true", "yanlış": "false", "verilmemiş": "not given" };',
'    if (eq[g] && eq[g] === a) return { correct: true };',
'  }',
'  if (g === a + "s" || g + "s" === a) return { correct: true }; // tekil/çoğul toleransı',
'  return { correct: false };',
'}',
'function findQuestion(id) {',
'  const havuz = [].concat(OKUMA.sorular, DINLEME.sorular, [',
'    { id: "l1", cevap: "A", tip: "MCQ", secenekler: ["Free", "Two lira", "Ten lira", "One week"], aciklama: "Ücretsiz üyelik." },',
'    { id: "g1", cevap: "works", tip: "KELIME", kanit: "She works here", aciklama: "3. tekil şahıs -s." },',
'    { id: "g2", cevap: "have finished", tip: "KELIME", kanit: "I have finished my homework.", aciklama: "have + V3." },',
'    { id: "g3", cevap: "was written", tip: "MCQ", aciklama: "be + V3." },',
'    { id: "d1", cevap: "They delay water flow", tip: "MCQ", aciklama: "slow = geciktirmek." },',
'    { id: "d2", cevap: "FALSE", tip: "TFNG", kanit: "not cheap", aciklama: "Metin pahalı olabilir diyor." },',
'    { id: "d3", cevap: "two lira", tip: "KELIME", aciklama: "Birim tuzağı." },',
'  ]);',
'  return havuz.find(function(q) { return q.id === id; }) || null;',
'}',
'',
'/* ---------- istek işleyici ---------- */',
'function send(res, code, body, type) { res.writeHead(code, { "Content-Type": type || "text/html; charset=utf-8", "Cache-Control": "no-store" }); res.end(body); }',
'function redirect(res, to) { res.writeHead(302, { Location: to }); res.end(); }',
'function readBody(req) { return new Promise(function(ok) { var d = ""; req.on("data", function(c) { d += c; if (d.length > 5e5) req.destroy(); }); req.on("end", function() { ok(d); }); }); }',
'function form(d) { const o = {}; for (const kv of String(d).split("&")) { const i = kv.indexOf("="); if (i > 0) o[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1).replace(/\\+/g, " ")); } return o; }',
'',
'function touchDay(p) {',
'  const bugun = new Date().toISOString().slice(0, 10);',
'  if (p.lastDay !== bugun) {',
'    const dun = new Date(Date.now() - 86400000).toISOString().slice(0, 10);',
'    p.streakDays = p.lastDay === dun ? (p.streakDays || 0) + 1 : 1;',
'    p.lastDay = bugun;',
'  }',
'  p.visits = (p.visits || 0) + 1;',
'  return p;',
'}',
'function maybeAward(p) {',
'  const yeni = [];',
'  const ver = function(id) { if ((p.badges || []).indexOf(id) < 0) { p.badges = (p.badges || []).concat([id]); yeni.push(id); } };',
'  if (p.visits >= 1) ver("b1");',
'  if (p.streakDays >= 3) ver("b3");',
'  if (p.streakDays >= 7) ver("b6");',
'  if ((p.answered.okuma || 0) >= 3) ver("b2");',
'  if ((p.answered.deneme || 0) >= 1) ver("b4");',
'  if ((p.answered.kelime || 0) >= 5) ver("b5");',
'  return yeni;',
'}',
'',
'const server = createServer(async function(req, res) {',
'  const url = new URL(req.url, "http://localhost");',
'  const yol = url.pathname;',
'  const user = currentUser(req);',
'  const korumali = ["/panel"].concat(MODULES.map(function(m) { return "/bolum/" + m.slug; })).concat(["/varliklar"]);',
'',
'  // statik varlıklar',
'  if (yol.startsWith("/anim/") || yol.startsWith("/img/")) {',
'    const file = join(SITE, yol.replace(/^\\//, ""));',
'    if (serveFile(res, file)) return;',
'    return send(res, 404, "Varlık bulunamadı: " + esc(yol), "text/plain; charset=utf-8");',
'  }',
'  if (yol === "/stil.css") { res.writeHead(200, { "Content-Type": MIME[".css"] }); return res.end(CSS); }',
'  if (yol === "/istemci.js") { res.writeHead(200, { "Content-Type": MIME[".js"] }); return res.end(CLIENT_JS); }',
'  if (yol === "/saglik") return send(res, 200, JSON.stringify({ ok: true, kullanici: user ? user.email : null, moduller: MODULES.length }), "application/json; charset=utf-8");',
'',
'  // korumalı sayfalar',
'  if (korumali.some(function(k) { return yol === k || yol.startsWith(k + "/"); }) && !user) {',
'    return redirect(res, "/giris?donus=" + encodeURIComponent(yol));',
'  }',
'',
'  // POST',
'  if (req.method === "POST") {',
'    const govde = await readBody(req);',
'    if (yol === "/kayit") {',
'      const d = form(govde);',
'      const email = String(d.email || "").trim().toLowerCase();',
'      const sifre = String(d.sifre || "");',
'      if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) return send(res, 200, pageAuth("Geçerli bir e-posta yaz (örn. ad@eposta.com).", null, "kayit"));',
'      if (sifre.length < 8) return send(res, 200, pageAuth("Şifre en az 8 karakter olmalı.", null, "kayit"));',
'      const list = users();',
'      if (list.some(function(u) { return u.email === email; })) return send(res, 200, pageAuth("Bu e-posta ile bir hesap var. Giriş yapmayı dene.", null, "kayit"));',
'      const u = { id: uid(8), email: email, ad: String(d.ad || "").trim(), sifreHash: hashPassword(sifre), createdAt: Date.now() };',
'      list.push(u); saveUsers(list);',
'      const p = touchDay(progressFor(u.id));',
'      const yeni = maybeAward(p); saveProgress(u.id, p);',
'      startSession(res, u.id);',
'      return redirect(res, "/panel" + (yeni.length ? "?yeniRozet=" + yeni[0] : ""));',
'    }',
'    if (yol === "/giris") {',
'      const d = form(govde);',
'      const email = String(d.email || "").trim().toLowerCase();',
'      const u = users().find(function(x) { return x.email === email; });',
'      if (!u || !verifyPassword(String(d.sifre || ""), u.sifreHash)) return send(res, 200, pageAuth("E-posta veya şifre hatalı. Tekrar dene.", null, "giris"));',
'      const p = touchDay(progressFor(u.id)); const yeni = maybeAward(p); saveProgress(u.id, p);',
'      startSession(res, u.id);',
'      return redirect(res, (url.searchParams.get("donus") || "/panel") + (yeni.length ? "" : ""));',
'    }',
'    if (yol === "/cikis") { endSession(req, res); return redirect(res, "/"); }',
'    if (yol === "/api/cevap") {',
'      if (!user) return send(res, 401, JSON.stringify({ error: "GIRIS_GEREKLI" }), "application/json; charset=utf-8");',
'      let veri = {}; try { veri = JSON.parse(govde); } catch {}',
'      const s = findQuestion(veri.id);',
'      if (!s) return send(res, 404, JSON.stringify({ error: "SORU_BULUNAMADI" }), "application/json; charset=utf-8");',
'      const sonuc = checkAnswer(s, veri.yanit);',
'      const p = progressFor(user.id);',
'      let xp = 0;',
'      if (sonuc.correct) {',
'        p.xp = (p.xp || 0) + 10; xp = 10;',
'        const modul = veri.id.charAt(0) === "d" ? "deneme" : veri.id.charAt(0) === "l" ? "dinleme" : veri.id.charAt(0) === "g" ? "gramer" : "okuma";',
'        p.answered[modul] = (p.answered[modul] || 0) + 1;',
'        p.modules[modul] = (p.modules[modul] || 0) + 1;',
'      }',
'      const yeni = maybeAward(p); saveProgress(user.id, p);',
'      return send(res, 200, JSON.stringify({ correct: sonuc.correct, xp: xp, kanit: sonuc.correct ? s.kanit : null, aciklama: sonuc.correct ? s.aciklama : null, ipucu: sonuc.correct ? null : "Kanıt cümlesini metinden bul ve tekrar oku.", yeniRozetler: yeni }), "application/json; charset=utf-8");',
'    }',
'    return send(res, 404, "Bulunamadı", "text/plain; charset=utf-8");',
'  }',
'',
'  // GET sayfalar',
'  if (yol === "/") return send(res, 200, pageHome(user));',
'  if (yol === "/giris") return send(res, 200, pageAuth(url.searchParams.get("hata"), null, "giris"));',
'  if (yol === "/kayit") return send(res, 200, pageAuth(null, null, "kayit"));',
'  if (yol === "/panel") { const p = progressFor(user.id); return send(res, 200, pagePanel(user, p)); }',
'  if (yol === "/varliklar") {',
'    const animler = existsSync(join(SITE, "anim")) ? readdirSync(join(SITE, "anim")) : [];',
'    const ikonlar = existsSync(join(SITE, "img")) ? readdirSync(join(SITE, "img")) : [];',
'    const html = layout(user, "Varlık durumu",',
'      "<h1>Varlık durumu</h1><p class=\\"small muted\\">Animasyonlar ve simgeler yerel dosyalardan gelir; dış bağlantı yoktur.</p>" +',
'      "<section class=\\"card\\"><h2>Animasyonlar (" + animler.length + ")</h2><div class=\\"grid\\">" + animler.map(function(f) { return "<figure style=\\"margin:0\\"><img class=\\"anim\\" src=\\"/anim/" + f + "\\" alt=\\"\\"><figcaption class=\\"small muted\\">" + f + "</figcaption></figure>"; }).join("") + "</div></section>" +',
'      "<section class=\\"card\\"><h2>Simgeler (" + ikonlar.length + ")</h2><div class=\\"row\\">" + ikonlar.map(function(f) { return "<img src=\\"/img/" + f + "\\" width=\\"48\\" height=\\"48\\" alt=\\"\\" title=\\"" + f + "\\">"; }).join("") + "</div></section>");',
'    return send(res, 200, html);',
'  }',
'  if (yol.startsWith("/bolum/")) {',
'    const slug = yol.split("/")[2];',
'    const m = MODULES.find(function(x) { return x.slug === slug; });',
'    if (!m) return send(res, 404, layout(user, "Bulunamadı", "<h1>Bölüm bulunamadı</h1><p><a href=\\"/panel\\">Panele dön</a></p>"));',
'    const p = progressFor(user.id);',
'    const builder = PAGE_BUILDERS[slug] || pageTaktik;',
'    return send(res, 200, builder(m, user, p));',
'  }',
'  return send(res, 404, layout(user, "Bulunamadı", "<h1>Sayfa bulunamadı</h1><p><a href=\\"/\\">Ana sayfa</a></p>"));',
'});',
'',
'/* ---------- varlıklar yoksa otomatik üret ---------- */',
'import { spawnSync } from "node:child_process";',
'const eksik = !existsSync(join(SITE, "anim", "rozet-havai-fisek.gif"));',
'if (eksik) {',
'  const arac = join(dirname(ROOT), "..", "TEK-YAMA.mjs");',
'  const yerelArac = existsSync(arac) ? arac : join(ROOT, "TEK-YAMA.mjs");',
'  if (existsSync(yerelArac)) { console.log("Varlıklar üretiliyor..."); spawnSync(process.execPath, [yerelArac, "--assets", SITE], { stdio: "inherit" }); }',
'  else console.log("UYARI: anim/img klasörleri boş. TEK-YAMA.mjs ile varlıkları üretmek için: node TEK-YAMA.mjs --assets data/site");',
'}',
'',
'server.listen(PORT, "0.0.0.0", function() {',
'  console.log("");',
'  console.log("  🎓 IELTS AKADEMİ — çalışan demo site");',
'  console.log("  ➜  http://localhost:" + PORT);',
'  console.log("  ➜  İlk iş: /kayit → e-posta + şifre (en az 8 karakter) ile hesap oluştur.");',
'  console.log("  ➜  Sonra /bolum/okuma ve /bolum/dinleme bölümlerini dene.");',
'  console.log("  ➜  Varlık kontrolü: /varliklar");',
'  console.log("");',
'});',
'',
'export { server, checkAnswer, findQuestion, normalize };',
].join("\n");

/* ==========================================================================
 *  B2) YEREL DOKTOR — "siteyi yaptım ama..." semptomlarını arar
 * ========================================================================== */

const DOCTOR_RULES = [
  { id: "NO_PACKAGE", sev: "error", test: (ctx) => !ctx.has("package.json"), msg: "package.json yok → proje çalıştırılamaz.", fix: "Next.js projesini yeniden kur (npx create-next-app@latest . --ts --tailwind --app)." },
  { id: "NO_NODE_MODULES", sev: "error", test: (ctx) => ctx.has("package.json") && !ctx.hasDir("node_modules"), msg: "node_modules yok → `npm install` çalıştırılmamış.", fix: "npm install && npm run dev" },
  { id: "NO_AUTH_FILE", sev: "error", test: (ctx) => !ctx.has("auth.ts") && !ctx.has("src/auth.ts"), msg: "auth.ts yok → hesap sistemi kurulmamış.", fix: "ONARIM/02-duzeltme-dosyalari/auth.ts dosyasını projeye kopyala (Auth.js v5 + credentials)." },
  { id: "NO_AUTH_ROUTE", sev: "error", test: (ctx) => !ctx.glob("api/auth", 6).length, msg: "app/api/auth/[...nextauth]/route.ts yok → giriş çalışmaz.", fix: "ONARIM/02-duzeltme-dosyalari/app/api/auth içeriğini kopyala." },
  { id: "NO_LOGIN_PAGE", sev: "error", test: (ctx) => !ctx.glob("giris/page", 4).length && !ctx.glob("login/page", 4).length, msg: "Giriş sayfası (/giris veya /login) yok → kullanıcı hesabına giremez.", fix: "ONARIM/02-duzeltme-dosyalari/app/giris/page.tsx dosyasını kopyala." },
  { id: "NO_REGISTER_PAGE", sev: "error", test: (ctx) => !ctx.glob("kayit/page", 4).length && !ctx.glob("register/page", 4).length, msg: "Kayıt sayfası (/kayit) yok → e-posta/şifre ile hesap oluşturulamaz.", fix: "ONARIM/02-duzeltme-dosyalari/app/kayit/page.tsx dosyasını kopyala." },
  { id: "NO_MIDDLEWARE", sev: "warn", test: (ctx) => !ctx.has("middleware.ts") && !ctx.has("src/middleware.ts"), msg: "middleware.ts yok → korumalı sayfalar oturum kontrolü yapmıyor.", fix: "ONARIM/02-duzeltme-dosyalari/middleware.ts dosyasını kopyala." },
  { id: "NO_PRISMA_USER", sev: "error", test: (ctx) => { const s = ctx.read("prisma/schema.prisma"); return !s || !/model\s+User\b/.test(s); }, msg: "prisma/schema.prisma içinde User modeli yok → hesap verisi saklanamaz.", fix: "TEK-KOD.mjs --emit-data . ile şemayı yaz veya ONARIM/02-duzeltme-dosyalari/prisma/schema.prisma dosyasını kullan." },
  { id: "NO_MIGRATIONS", sev: "error", test: (ctx) => { const d = ctx.listDir("prisma/migrations"); return !d || d.length === 0; }, msg: "prisma/migrations boş → veritabanı tabloları oluşturulmamış.", fix: "npx prisma migrate dev --name init" },
  { id: "NO_ANIM", sev: "error", test: (ctx) => !ctx.glob("public/anim", 2).length && !ctx.glob("anim/", 3).length, msg: "Hiç animasyon/GIF yok → 'resimler, gifler yok' şikâyeti.", fix: "node TEK-YAMA.mjs --assets public (bu araç 10 GIF + 21 SVG üretir)." },
  { id: "NO_IMG", sev: "error", test: (ctx) => !ctx.glob("public/img", 2).length, msg: "Hiç görsel/simge klasörü yok.", fix: "node TEK-YAMA.mjs --assets public" },
  { id: "DEAD_LINKS", sev: "error", test: (ctx) => ctx.deadLinks.length > 0, msg: (ctx) => `Ölü bağlantı: ${ctx.deadLinks.length} dosyada href="#" veya boş href bulundu → bölümlere tıklayınca hiçbir yere gitmiyor.`, fix: "Boş bağlantıları gerçek rotalara çevir: <Link href=\"/bolum/gramer\">. ONARIM/02-duzeltme-dosyalari/components/ModuleGrid.tsx kullanılabilir." },
  { id: "NO_API_ROUTES", sev: "error", test: (ctx) => ctx.pageCount() > 4 && ctx.apiCount() === 0, msg: (ctx) => `Site "her şey yapılmış" gibi görünüyor ama hiç API rotası yok (${ctx.pageCount()} sayfa / 0 API) → butonlar ve formlar çalışmaz.`, fix: "ONARIM/02-duzeltme-dosyalari içindeki API rotalarını ve lib dosyalarını kopyala; ardından TEK-KOMUT.md P1 fazını uygula." },
  { id: "MOCK_DATA", sev: "warn", test: (ctx) => ctx.mockHits.length > 0, msg: (ctx) => `Yer tutucu (mock/dummy/örnek) veri kalıpları bulundu: ${ctx.mockHits.slice(0, 8).join(", ")} → sayfa açılır ama veri katmanına bağlı değil.`, fix: "Veriyi Prisma sorgularına bağla; içeriği content/*.json + seed ile yükle." },
  { id: "TODO_MARKERS", sev: "warn", test: (ctx) => ctx.todoHits.length > 0, msg: (ctx) => `Tamamlanmamış işaretler: ${ctx.todoHits.slice(0, 8).join(", ")}`, fix: "Bu işaretleri sırayla kapat; her biri yarım kalan bir özellik demektir." },
  { id: "NO_SECRET", sev: "warn", test: (ctx) => !ctx.has(".env.local") && !ctx.has(".env"), msg: ".env yok → AUTH_SECRET/DATABASE_URL tanımsız, oturumlar güvenli kurulmaz.", fix: "cp .env.example .env.local ve değerleri doldur (AUTH_SECRET için: openssl rand -base64 32)." },
  { id: "EXTERNAL_IMG", sev: "warn", test: (ctx) => ctx.externalImgHits.length > 0, msg: (ctx) => `Dış kaynaklı görsel/animasyon bağlantısı: ${ctx.externalImgHits.slice(0, 5).join(", ")} → internet yoksa/engelliyse görsel görünmez.`, fix: "Varlıkları indirip public/ altına koy (bu araçla üretilenler telifsizdir)." },
  { id: "NO_SECURITY_HEADERS", sev: "warn", test: (ctx) => { const c = ctx.read("next.config.ts") + ctx.read("next.config.mjs") + ctx.read("next.config.js"); return !c || !/headers\s*\(/.test(c); }, msg: "next.config içinde güvenlik başlıkları (CSP, X-Frame-Options...) tanımlı değil.", fix: "ONARIM/02-duzeltme-dosyalari/next.config.mjs dosyasını kullan." },
  { id: "NO_A11Y_SKIP", sev: "info", test: (ctx) => !ctx.anyFileContains(["skip", "İçeriğe geç"]), msg: "Atla (skip) bağlantısı yok → klavye kullanıcısı her sayfada menüyü geçmek zorunda.", fix: "Layout'a <a href=\"#main\" class=\"skip\">İçeriğe geç</a> ekle." },
];

function makeDoctorContext(root) {
  const files = new Map(); // rel → content (yalnız metin dosyaları)
  const dirs = new Set();
  const skipDirs = new Set(["node_modules", ".next", ".git", "dist", "build", "coverage", ".turbo", ".vercel"]);
  const textExt = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".prisma", ".css", ".md", ".env", ".example", ".txt", ".html"]);
  const walk = (dir, depth = 0) => {
    if (depth > 6) return;
    let entries = [];
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        dirs.add(relative(root, p).replace(/\\/g, "/"));
        if (skipDirs.has(e.name)) continue;
        walk(p, depth + 1);
      } else {
        const rel = relative(root, p).replace(/\\/g, "/");
        if (textExt.has(extname(e.name)) && statSync(p).size < 400000) {
          try { files.set(rel, readFileSync(p, "utf8")); } catch { /* okuma hatası yok sayılır */ }
        } else files.set(rel, "");
      }
    }
  };
  walk(root);

  const allText = () => [...files.values()].join("\n");
  const hitsIn = (markers) => {
    const out = [];
    for (const [rel, txt] of files.entries()) {
      if (rel.startsWith("ONARIM/") || rel === "TEK-YAMA.mjs" || rel === "TEK-KOD.mjs" || rel === "TEK-KOD.txt" || rel === "TEK-KOMUT.md") continue;
      for (const m of markers) if (txt.includes(m)) { out.push(rel + " (" + m + ")"); break; }
    }
    return out;
  };
  const externals = (() => {
    const out = new Set();
    const rx = /(?:src|url)\s*[=:]\s*["'`]?(https?:\/\/[^"'`)\s]+)/g;
    for (const [rel, txt] of files.entries()) {
      if (!rel.endsWith(".tsx") && !rel.endsWith(".ts") && !rel.endsWith(".jsx")) continue;
      let m; while ((m = rx.exec(txt))) { if (/(gif|png|jpg|jpeg|webp|svg|mp3|mp4)/i.test(m[1])) out.add(m[1].slice(0, 60)); }
    }
    return [...out];
  })();
  const deadLinks = (() => {
    const out = [];
    for (const [rel, txt] of files.entries()) {
      if (!/\.(tsx|jsx|ts|js|html)$/.test(rel)) continue;
      if (/href\s*=\s*["']#["']/.test(txt) || /href\s*=\s*["']\s*["']/.test(txt) || /href\s*=\s*\{?["'`]#?["'`]\}?/.test(txt)) out.push(rel);
      else if (/<a\b(?![^>]*href)/.test(txt)) out.push(rel + " (<a href'siz>)");
    }
    return out;
  })();

  return {
    root, files, dirs,
    has: (rel) => files.has(rel) || files.has("src/" + rel),
    hasDir: (rel) => dirs.has(rel) || dirs.has("src/" + rel),
    read: (rel) => files.get(rel) ?? files.get("src/" + rel) ?? "",
    glob: (needle, depth) => [...files.keys(), ...dirs].filter((k) => k.split("/").length <= depth && k.includes(needle)),
    listDir: (rel) => { const d = dirs.has(rel) ? rel : "src/" + rel; return dirs.has(d) ? [...files.keys()].filter((k) => k.startsWith(d + "/")).map((k) => k.slice(d.length + 1)) : null; },
    anyFileContains: (markers) => [...files.values()].some((t) => markers.some((m) => t.includes(m))),
    pageCount: () => [...files.keys()].filter((k) => /page\.(tsx|jsx|ts|js)$/.test(k)).length,
    apiCount: () => [...files.keys()].filter((k) => /route\.(ts|js)$/.test(k)).length,
    deadLinks,
    mockHits: hitsIn(["mockData", "dummy", "DUMMY", "lorem", "Lorem", "örnek veri", "sahte veri", "placeholder-data", "fakeData"]),
    todoHits: hitsIn(["TODO:", "FIXME", "XXX:", "HACK:", "yapılacak:"]),
    externalImgHits: externals,
    allText,
  };
}

export function runDoctor(root = process.cwd()) {
  const ctx = makeDoctorContext(root);
  const findings = DOCTOR_RULES.map((r) => {
    let failed = false;
    try { failed = r.test(ctx); } catch { failed = false; }
    if (!failed) return null;
    const msg = typeof r.msg === "function" ? r.msg(ctx) : r.msg;
    return { id: r.id, sev: r.sev, msg, fix: r.fix };
  }).filter(Boolean);

  const stats = {
    dosya: ctx.files.size,
    sayfa: ctx.pageCount(),
    apiRotasi: ctx.apiCount(),
    animasyonVar: ctx.glob("anim", 2).length > 0,
    girisVar: ctx.glob("giris/page", 4).length > 0,
    prismaUserVar: /model\s+User\b/.test(ctx.read("prisma/schema.prisma")),
  };
  const errors = findings.filter((f) => f.sev === "error");
  const warns = findings.filter((f) => f.sev === "warn");
  const verdictTr = errors.length
    ? `Site ${errors.length} kritik hata içeriyor: bunlar tamamlanmadan site "bitmiş" sayılmaz.`
    : warns.length
      ? `Kritik hata yok, ${warns.length} iyileştirme önerisi var.`
      : "Site doktoru temiz: hesap sistemi, giriş, varlıklar ve rotalar yerinde görünüyor.";
  return { root, stats, findings, errors, warns, verdictTr, checkedAt: new Date().toISOString(), version: VERSION };
}

/* ==========================================================================
 *  B3) ONARIM KİTİ — projeye kopyalanacak dosyalar + Antigravity komutu
 * ========================================================================== */

const KIT_FILES = {
  "ONARIM/00-OKU-ONCE.md": `# 🔧 SİTE ONARIM KİTİ — önce bunu oku

Bu klasör, "site yapılmış gibi görünüyor ama bölümlere girilmiyor, hesap/giriş yok,
resim-GIF-animasyon yok" sorunlarını **sırayla** çözer. En hızlı yol:

## 1) 30 saniyede çalışan bir site görmek istiyorsan
\`\`\`bash
node ONARIM/01-canli-site-demo/site-demo.mjs
# → http://localhost:3000  (önce /kayit ile hesap oluştur, sonra bölümlere gir)
\`\`\`
Bu demo **gerçekten çalışır**: e-posta + şifre ile kayıt, giriş ekranı, HttpOnly oturum çerezi,
korumalı sayfalar, 12 bölüme gerçek giriş, animasyonlar, cevap denetimi, XP ve rozet kaydı.

## 2) Varlıkları (GIF/SVG) projeye koy
\`\`\`bash
node TEK-YAMA.mjs --assets public          # public/anim (10 GIF) + public/img (21 SVG) üretir
\`\`\`
Ardından sayfalarda kullan: \`<img src="/anim/rozet-havai-fisek.gif" alt="Rozet kutlaması">\`

## 3) Hesap + giriş sistemini projeye kopyala
\`ONARIM/02-duzeltme-dosyalari/\` içindeki dosyaları **aynı yollarına** kopyala:
- \`auth.ts\` → proje kökü (veya \`src/auth.ts\`)
- \`middleware.ts\` → proje kökü (korumalı rotalar)
- \`app/giris/page.tsx\`, \`app/kayit/page.tsx\`, \`app/panel/page.tsx\`, \`app/cikis/route.ts\`
- \`app/api/auth/[...nextauth]/route.ts\`
- \`src/lib/hesap.ts\` (kayıt/giriş mantığı), \`src/lib/varlik.ts\` (görsel/GIF güvenli gösterim)
- \`components/ModuleGrid.tsx\` (ölü bağlantıları gerçek rotalara çevirir)
- \`next.config.mjs\` (güvenlik başlıkları)

## 4) Veritabanını kur
\`\`\`bash
npx prisma migrate dev --name init
npx prisma db seed
\`\`\`

## 5) Son kontrol
\`\`\`bash
node TEK-YAMA.mjs --doctor .        # siteyi tara: ölü bağlantı, hesap, varlık, mock veri
npm run dev                          # aç, /kayit → hesap oluştur → /bolum/gramer → soruları çöz
\`\`\`

> **Altın kural:** Bir sayfa "var" olması yetmez. Şu 4 soruyu sor: (1) Rotası var mı?
> (2) İçeriği veritabanından/AI'dan mı geliyor? (3) Giriş yapmadan erişilebiliyor mu (olmamalı)?
> (4) Görseli/animasyonu yerel dosyadan mı yükleniyor? Dördü de "evet" değilse sayfa bitmemiştir.
`,

  "ONARIM/02-duzeltme-dosyalari/auth.ts": `// auth.ts — Auth.js v5 (NextAuth) + e-posta/şifre girişi (Credentials)
// Bağımlılıklar: next-auth@beta, @auth/prisma-adapter, bcryptjs
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/giris", error: "/giris" },
  providers: [
    Credentials({
      name: "E-posta ve şifre",
      credentials: { email: { label: "E-posta", type: "email" }, password: { label: "Şifre", type: "password" } },
      async authorize(raw) {
        const email = String(raw?.email ?? "").trim().toLowerCase();
        const password = String(raw?.password ?? "");
        if (!email || password.length < 8) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name ?? user.email.split("@")[0], image: null };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.uid && session.user) session.user.id = String(token.uid);
      return session;
    },
  },
});
`,

  "ONARIM/02-duzeltme-dosyalari/app/api/auth/[...nextauth]/route.ts": `// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
`,

  "ONARIM/02-duzeltme-dosyalari/app/cikis/route.ts": `// app/cikis/route.ts — çıkış: oturumu kapat ve ana sayfaya dön
import { signOut } from "@/auth";
export async function POST() {
  await signOut({ redirectTo: "/" });
}
export async function GET() {
  await signOut({ redirectTo: "/" });
}
`,

  "ONARIM/02-duzeltme-dosyalari/app/giris/page.tsx": `"use client";
// app/giris/page.tsx — GERÇEK giriş ekranı (e-posta + şifre)
// Not: Server action ile de yapılabilir; bu sürüm istemci tarafında signIn kullanır.
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function GirisSayfasi() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    setHata(null);
    setYukleniyor(true);
    const sonuc = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/panel" });
    setYukleniyor(false);
    if (!sonuc || sonuc.error) { setHata("E-posta veya şifre hatalı. Tekrar dene."); return; }
    window.location.href = sonuc.url ?? "/panel";
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-extrabold">Hesabına gir</h1>
      {hata && <p role="alert" className="mt-3 rounded-xl bg-rose-100 p-3 font-semibold text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">{hata}</p>}
      <form onSubmit={gonder} className="mt-4 space-y-4">
        <div>
          <label htmlFor="email" className="block font-bold">E-posta</label>
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-900" placeholder="ornek@eposta.com" />
        </div>
        <div>
          <label htmlFor="password" className="block font-bold">Şifre</label>
          <input id="password" type="password" required minLength={8} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-900" placeholder="En az 8 karakter" />
        </div>
        <button type="submit" disabled={yukleniyor} className="w-full rounded-xl bg-violet-600 p-3 font-extrabold text-white disabled:opacity-50">
          {yukleniyor ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        Hesabın yok mu? <Link className="font-bold text-violet-600 underline" href="/kayit">Kayıt ol</Link>
      </p>
    </main>
  );
}
`,

  "ONARIM/02-duzeltme-dosyalari/app/kayit/page.tsx": `"use client";
// app/kayit/page.tsx — e-posta + şifre ile hesap oluşturma
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function KayitSayfasi() {
  const [ad, setAd] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    setHata(null); setYukleniyor(true);
    const yanit = await fetch("/api/kayit", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ad, email, password }),
    });
    const veri = await yanit.json().catch(() => ({}));
    if (!yanit.ok) { setYukleniyor(false); setHata(veri.messageTr ?? "Kayıt tamamlanamadı."); return; }
    const sonuc = await signIn("credentials", { email, password, redirect: false });
    setYukleniyor(false);
    window.location.href = sonuc?.error ? "/giris" : "/panel";
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-extrabold">Yeni hesap oluştur</h1>
      {hata && <p role="alert" className="mt-3 rounded-xl bg-rose-100 p-3 font-semibold text-rose-700">{hata}</p>}
      <form onSubmit={gonder} className="mt-4 space-y-4">
        <div>
          <label htmlFor="ad" className="block font-bold">Ad (isteğe bağlı)</label>
          <input id="ad" value={ad} onChange={(e) => setAd(e.target.value)} className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-900" placeholder="Adın" />
        </div>
        <div>
          <label htmlFor="email" className="block font-bold">E-posta</label>
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-900" placeholder="ornek@eposta.com" />
        </div>
        <div>
          <label htmlFor="password" className="block font-bold">Şifre (en az 8 karakter)</label>
          <input id="password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-900" />
        </div>
        <button type="submit" disabled={yukleniyor} className="w-full rounded-xl bg-violet-600 p-3 font-extrabold text-white disabled:opacity-50">
          {yukleniyor ? "Hesap oluşturuluyor..." : "Hesap oluştur"}
        </button>
      </form>
      <p className="mt-4 text-sm">Zaten üye misin? <Link className="font-bold text-violet-600 underline" href="/giris">Giriş yap</Link></p>
    </main>
  );
}
`,

  "ONARIM/02-duzeltme-dosyalari/app/api/kayit/route.ts": `// app/api/kayit/route.ts — hesap oluşturma ucu (şifre hash'lenir)
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const govde = await req.json().catch(() => null);
  const ad = String(govde?.ad ?? "").trim();
  const email = String(govde?.email ?? "").trim().toLowerCase();
  const password = String(govde?.password ?? "");

  if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) {
    return NextResponse.json({ messageTr: "Geçerli bir e-posta yaz." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ messageTr: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  }
  const varMi = await prisma.user.findUnique({ where: { email } });
  if (varMi) return NextResponse.json({ messageTr: "Bu e-posta ile bir hesap var." }, { status: 409 });

  const user = await prisma.user.create({
    data: { email, name: ad || email.split("@")[0], passwordHash: await hash(password, 12), cefrLevel: "A1", targetBand: 6 },
  });
  return NextResponse.json({ ok: true, id: user.id });
}
`,

  "ONARIM/02-duzeltme-dosyalari/app/panel/page.tsx": `// app/panel/page.tsx — KORUMALI panel (giriş yapmadan erişilemez)
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ModuleGrid from "@/components/ModuleGrid";

export const dynamic = "force-dynamic";

export default async function Panel() {
  const oturum = await auth();
  if (!oturum?.user) redirect("/giris?donus=/panel");
  const kullanici = await prisma.user.findUnique({
    where: { id: oturum.user.id },
    select: { name: true, email: true, cefrLevel: true, targetBand: true, streakDays: true, xpTotal: true },
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-extrabold">Merhaba {kullanici?.name ?? kullanici?.email} 👋</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-300">Seviye: {kullanici?.cefrLevel} · Hedef band: {kullanici?.targetBand} · Seri: {kullanici?.streakDays ?? 0} gün · XP: {kullanici?.xpTotal ?? 0}</p>
      <img className="mt-4 w-48 rounded-2xl" src="/anim/ilerleme-halkasi.gif" alt="İlerleme animasyonu" />
      <h2 className="mt-6 text-xl font-bold">Bölümler</h2>
      <ModuleGrid />
      <form action="/cikis" method="post" className="mt-8">
        <button className="rounded-xl border px-4 py-2 font-bold">Çıkış yap</button>
      </form>
      <p className="mt-6 text-sm"><Link className="underline" href="/varliklar">Varlık (GIF/SVG) durumunu gör</Link></p>
    </main>
  );
}
`,

  "ONARIM/02-duzeltme-dosyalari/middleware.ts": `// middleware.ts — korumalı rotalar: giriş yapılmadan erişilemez
export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/panel/:path*",
    "/bolum/:path*",
    "/gramer/:path*",
    "/okuma/:path*",
    "/dinleme/:path*",
    "/konusma/:path*",
    "/yazma/:path*",
    "/kelime/:path*",
    "/deneme/:path*",
    "/program/:path*",
    "/rozetler/:path*",
  ],
};
`,

  "ONARIM/02-duzeltme-dosyalari/src/lib/varlik.ts": `// src/lib/varlik.ts — görsel/GIF güvenli gösterim yardımcıları
import { existsSync } from "node:fs";
import { join } from "node:path";

const PUBLIC = join(process.cwd(), "public");

/** Varlık gerçekten var mı? Yoksa uyarı yerine sessizce yedeğe düşer (kırık görsel olmaz). */
export function varlikVarMi(yol: string): boolean {
  if (/^https?:\\/\\//.test(yol)) return false; // dış bağlantı kullanmıyoruz
  return existsSync(join(PUBLIC, yol.replace(/^\\//, "")));
}

export function varlik(yol: string, yedek = "/img/bos-durum.svg"): string {
  return varlikVarMi(yol) ? yol : yedek;
}

export const ANIMASYON = {
  rozet: "/anim/rozet-havai-fisek.gif",
  seri: "/anim/seri-alev.gif",
  lumi: "/anim/lumi-maskot.gif",
  konfeti: "/anim/konfeti.gif",
  ilerleme: "/anim/ilerleme-halkasi.gif",
  basari: "/anim/basari.gif",
  zamanlayici: "/anim/sinav-zamanlayici.gif",
  dalga: "/anim/dinleme-dalgasi.gif",
  kelimeKarti: "/anim/kelime-karti.gif",
  yildiz: "/anim/yildiz-parlamasi.gif",
} as const;
`,

  "ONARIM/02-duzeltme-dosyalari/components/ModuleGrid.tsx": `// components/ModuleGrid.tsx — bölümlere GERÇEK giriş (ölü bağlantı yok)
import Link from "next/link";

const MODULLER = [
  { yol: "/gramer", ikon: "/img/ikon-gramer.svg", ad: "Gramer Akademi", ozet: "A1→C2, 9 bloklu dersler ve mikro testler" },
  { yol: "/okuma", ikon: "/img/ikon-okuma.svg", ad: "Okuma Laboratuvarı", ozet: "Her metinde en az 10 soru + kanıt cümlesi" },
  { yol: "/dinleme", ikon: "/img/ikon-dinleme.svg", ad: "Dinleme Laboratuvarı", ozet: "Gerçek insan sesi, 6 aksan, dikte ve gölgeleme" },
  { yol: "/konusma", ikon: "/img/ikon-konusma.svg", ad: "Konuşma Laboratuvarı", ozet: "Part 1-2-3 görevleri ve kayıt" },
  { yol: "/yazma", ikon: "/img/ikon-yazma.svg", ad: "Yazma Laboratuvarı", ozet: "Task 1 ve Task 2, 4 ölçütlü geri bildirim" },
  { yol: "/kelime", ikon: "/img/ikon-kelime.svg", ad: "Kelime Hazinesi", ozet: "23 alanlı kartlar, TR/EN, sesli okuma" },
  { yol: "/deneme", ikon: "/img/ikon-deneme.svg", ad: "Deneme Sınavı", ozet: "Sınav Modu: süreli, yazım denetimi kapalı" },
  { yol: "/arsiv", ikon: "/img/ikon-arsiv.svg", ad: "1989→2026 Arşiv", ozet: "Dönem kartları ve özgün denemeler" },
  { yol: "/bilim", ikon: "/img/ikon-bilim.svg", ad: "Bilim Kütüphanesi", ozet: "6 alan, A1→C2, sesli okuma" },
  { yol: "/taktikler", ikon: "/img/ikon-taktik.svg", ad: "Taktik Kütüphanesi", ozet: "Soru tipi stratejileri ve süre hedefleri" },
  { yol: "/rozetler", ikon: "/img/ikon-rozet.svg", ad: "Rozetler", ozet: "1000 rozet ve havai fişek kutlaması" },
  { yol: "/sozler", ikon: "/img/ikon-soz.svg", ad: "Motivasyon", ozet: "Her girişte değişen 1000 söz" },
];

export default function ModuleGrid() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {MODULLER.map((m) => (
        <Link key={m.yol} href={m.yol}
          className="flex items-start gap-3 rounded-3xl border border-violet-200/70 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-violet-500/30 dark:bg-slate-900/70">
          <img src={m.ikon} alt="" width={44} height={44} className="rounded-xl" />
          <span>
            <strong className="block text-slate-900 dark:text-white">{m.ad}</strong>
            <span className="text-sm text-slate-600 dark:text-slate-300">{m.ozet}</span>
          </span>
        </Link>
      ))}
    </section>
  );
}
`,

  "ONARIM/02-duzeltme-dosyalari/next.config.mjs": `// next.config.mjs — güvenlik başlıkları + yerel varlık vurgusu (dış görsel yok)
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { remotePatterns: [] }, // tüm görseller yerel public/ altından gelir
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" },
          { key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data:; media-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'" },
        ],
      },
    ];
  },
};
export default nextConfig;
`,

  "ONARIM/02-duzeltme-dosyalari/app/varliklar/page.tsx": `// app/varliklar/page.tsx — tüm GIF ve SVG varlıklarının durum sayfası
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-dynamic";

export default function Varliklar() {
  const animDir = join(process.cwd(), "public/anim");
  const imgDir = join(process.cwd(), "public/img");
  const animler = existsSync(animDir) ? readdirSync(animDir).filter((f) => f.endsWith(".gif")) : [];
  const ikonlar = existsSync(imgDir) ? readdirSync(imgDir).filter((f) => f.endsWith(".svg")) : [];
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-extrabold">Varlık durumu</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-300">
        Animasyon: {animler.length} · Simge: {ikonlar.length} {animler.length === 0 && "→ şu komutu çalıştır: node TEK-YAMA.mjs --assets public"}
      </p>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {animler.map((f) => (
          <figure key={f} className="rounded-2xl border p-3">
            <img className="w-full rounded-xl" src={"/anim/" + f} alt={f} />
            <figcaption className="mt-2 text-xs text-slate-500">{f}</figcaption>
          </figure>
        ))}
      </section>
      <section className="mt-8 flex flex-wrap gap-3">
        {ikonlar.map((f) => (
          <img key={f} src={"/img/" + f} alt={f} width={48} height={48} title={f} />
        ))}
      </section>
    </main>
  );
}
`,

  "ONARIM/05-antigravity-onarim-komutu.md": `# 🛠️ ANTIGRAVITY ONARIM KOMUTU (yapıştırmaya hazır)

Aşağıdaki metnin tamamını Antigravity'ye ver. Amaç: var olan siteyi **bitmiş** hâle getirmek.

---

## GÖREV: Sitedeki 4 kritik kusuru onar

Şu an sitede: (1) sayfalar "yapılmış" görünüyor ama içerik veri katmanına bağlı değil,
(2) bölüm bağlantıları ölü (href="#"), (3) e-posta/şifre ile hesap ve giriş ekranı yok,
(4) görsel/GIF/animasyon dosyaları yok. Aşağıdakileri sırayla uygula, her adımdan sonra raporla.

### 1. Teşhis
- \`node TEK-YAMA.mjs --doctor .\` çalıştır ve çıkan raporu özetle (hata + uyarı sayısı).
- Sayfa sayısı / API rotası sayısı / animasyon sayısı / giriş sayfası var mı? Bunları raporla.

### 2. Varlıklar
- \`node TEK-YAMA.mjs --assets public\` çalıştır (10 GIF + 21 SVG, telifsiz, yerel).
- Tüm sayfalardaki dış görsel bağlantılarını kaldır; \`src/lib/varlik.ts\` içindeki
  \`varlik()\` fonksiyonuyla yerel yollara bağla. Kırık görsel kalmayacak.
- Rozet kutlaması, seri alevi, dinleme dalgası, zamanlayıcı ve maskot animasyonlarını
  ilgili sayfalara yerleştir.

### 3. Hesap + giriş + korumalı sayfalar
- \`ONARIM/02-duzeltme-dosyalari/\` içeriğini aynı yollara kopyala: \`auth.ts\`, \`middleware.ts\`,
  \`app/giris/page.tsx\`, \`app/kayit/page.tsx\`, \`app/panel/page.tsx\`, \`app/cikis/route.ts\`,
  \`app/api/auth/[...nextauth]/route.ts\`, \`app/api/kayit/route.ts\`, \`src/lib/varlik.ts\`,
  \`components/ModuleGrid.tsx\`, \`next.config.mjs\`.
- Prisma şemasında \`User.passwordHash\` alanı yoksa ekle; \`npx prisma migrate dev --name hesap-sistemi\` çalıştır.
- Şifreler bcrypt ile hash'lenmeli; \`.env.local\` içine \`AUTH_SECRET\` ve \`DATABASE_URL\` yaz.

### 4. Ölü bağlantı ve "sahte bitmişlik" temizliği
- Tüm \`href="#"\` ve boş \`href\` bağlantılarını gerçek rotalara çevir (\`ModuleGrid.tsx\` hazır).
- \`mockData\`, \`dummy\`, \`örnek veri\` kalıplarını Prisma sorguları veya \`content/*.json\` ile değiştir.
- Her bölüm sayfası şunu içermeli: başlık, seviye etiketi, gerçek içerik, en az 1 alıştırma,
  en az 1 animasyon ve "sonraki adım" düğmesi. Aksi hâlde sayfa "taslak" sayılır ve menüde
  "yakında" etiketi görünür — yarım sayfa bitmiş gibi gösterilmez.

### 5. Doğrulama (kanıtla)
- \`node TEK-YAMA.mjs --doctor .\` → hata sayısı 0 olana kadar düzelt.
- \`npm run build\` hatasız geçmeli; \`npm run dev\` ile:
  1) /kayit üzerinden hesap oluştur → 2) çıkış yap → 3) /giris ile gir →
  4) giriş yapmadan /panel ve /bolum/gramer erişiminin **engellendiğini** göster →
  5) bölümlerden birinde soru çöz, XP'nin arttığını göster.
- Raporunda şu tabloyu ver: bölüm | rota var mı | içerik gerçek mi | animasyon var mı | giriş korumalı mı.

Bu 5 adım bitmeden işi "tamamlandı" sayma.
`,
};

function copyDemoSiteKit(baseDir) {
  const demoDir = join(baseDir, "ONARIM/01-canli-site-demo");
  ensureDir(demoDir);
  writeFileSync(join(demoDir, "site-demo.mjs"), DEMO_SITE_SOURCE, "utf8");
  writeFileSync(join(demoDir, "NASIL-CALISTIRILIR.md"), [
    "# Çalışan demo site (30 saniye)",
    "",
    "```bash",
    "node site-demo.mjs",
    "# → http://localhost:3000",
    "```",
    "",
    "1. `/kayit` → e-posta + en az 8 karakter şifre ile hesap oluştur.",
    "2. `/panel` → korumalı panel açılır (giriş yapmadan açılmaz, `/giris`e yönlendirir).",
    "3. `/bolum/okuma`, `/bolum/dinleme`, `/bolum/gramer` → soruları çöz, ✅/❌ geri bildirim ve XP kazan.",
    "4. `/varliklar` → 10 GIF + 21 SVG'nin oynadığını gör.",
    "5. `data/` klasörünü silersen tüm hesaplar ve ilerleme sıfırlanır.",
    "",
    "Bu dosya; hesap sistemi, oturum çerezi, korumalı sayfalar, animasyonlar ve cevap denetimi",
    "referans uygulamasıdır. Next.js projesine taşırken `TEK-KOMUT.md` P1–P3 fazlarını uygula.",
  ].join("\n"), "utf8");
  return demoDir;
}

export function writeRepairKit(baseDir, { assetsDir = null } = {}) {
  const written = [];
  for (const [rel, content] of Object.entries(KIT_FILES)) {
    const full = join(baseDir, rel);
    ensureDir(dirname(full));
    writeFileSync(full, content, "utf8");
    written.push(full);
  }
  const demoDir = copyDemoSiteKit(baseDir);
  written.push(demoDir);
  if (assetsDir) {
    const man = generateAssets(assetsDir, { quiet: true });
    written.push(`${assetsDir} (${man.length} varlık)`);
  }
  return written;
}

/* ==========================================================================
 *  B4) DEMO SİTE TESTLERİ — gerçek HTTP istekleriyle uçtan uca doğrulama
 * ========================================================================== */

export async function testDemoSite({ quiet = false } = {}) {
  const res = { pass: 0, fail: 0, failures: [], checks: [] };
  const okc = (cond, label) => { res.checks.push({ label, ok: !!cond }); if (cond) res.pass++; else { res.fail++; res.failures.push(label); } };

  // Demo sunucusunu geçici klasörde kur
  const tmp = join(process.env.TMPDIR || "/tmp", "ielts-demo-test-" + Date.now());
  const demoPath = join(tmp, "site-demo.mjs");
  ensureDir(tmp);
  writeFileSync(demoPath, DEMO_SITE_SOURCE, "utf8");
  // Demo sitenin varlıklarını üret (gerçek senaryoda TEK-YAMA.mjs --assets ile yapılır)
  generateAssets(join(tmp, "data", "site"), { quiet: true });

  const { spawn } = await import("node:child_process");
  const port = 39000 + Math.floor(Math.random() * 900);
  const child = spawn(process.execPath, [demoPath], { env: { ...process.env, PORT: String(port) }, stdio: ["ignore", "pipe", "pipe"] });
  let sunucuLogu = "";
  child.stdout.on("data", (d) => { sunucuLogu += String(d); });
  child.stderr.on("data", (d) => { sunucuLogu += String(d); });

  const base = `http://127.0.0.1:${port}`;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // Sunucu açılana kadar bekle (en fazla 8 sn)
  let hazir = false;
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(base + "/saglik"); if (r.ok) { hazir = true; break; } } catch { /* bekle */ }
    await wait(200);
  }
  okc(hazir, "Demo sunucu açıldı (/saglik yanıt verdi)");
  if (!hazir) { child.kill(); return res; }

  try {
    // 1) Ana sayfa herkese açık
    let r = await fetch(base + "/");
    let html = await r.text();
    okc(r.status === 200 && html.includes("IELTS Akademi"), "Ana sayfa açılıyor (200)");
    okc(html.includes("/kayit") && html.includes("/giris"), "Ana sayfada kayıt ve giriş bağlantıları var");
    okc(html.includes("/anim/lumi-maskot.gif"), "Ana sayfada animasyon yerel yoldan yükleniyor");

    // 2) Korumalı sayfa giriş yapmadan açılmamalı
    r = await fetch(base + "/panel", { redirect: "manual" });
    okc(r.status === 302 && (r.headers.get("location") || "").includes("/giris"), "Giriş yapmadan /panel → /giris'e yönlendiriyor");
    r = await fetch(base + "/bolum/okuma", { redirect: "manual" });
    okc(r.status === 302, "Giriş yapmadan bölüm sayfası engelleniyor");

    // 3) Kayıt doğrulamaları
    const form = (o) => new URLSearchParams(o).toString();
    r = await fetch(base + "/kayit", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form({ email: "bozuk", sifre: "12345678" }), redirect: "manual" });
    okc((await r.text()).includes("Geçerli bir e-posta"), "Geçersiz e-posta reddedildi");
    r = await fetch(base + "/kayit", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form({ email: "a@b.com", sifre: "kisa" }), redirect: "manual" });
    okc((await r.text()).includes("en az 8 karakter"), "Kısa şifre reddedildi");

    // 4) Başarılı kayıt + oturum çerezi
    r = await fetch(base + "/kayit", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form({ email: "elif@ornek.com", sifre: "GucluSifre123", ad: "Elif" }), redirect: "manual" });
    const cerezi = r.headers.get("set-cookie") || "";
    okc(r.status === 302, "Kayıt sonrası panele yönlendirme (302)");
    okc(/sid=[a-f0-9]{48}/.test(cerezi) && /HttpOnly/.test(cerezi), "Oturum çerezi üretildi (HttpOnly, güçlü)");
    const cookie = cerezi.split(";")[0];

    // 5) Aynı e-posta tekrar kayıt olamaz
    r = await fetch(base + "/kayit", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form({ email: "elif@ornek.com", sifre: "GucluSifre123" }), redirect: "manual" });
    okc((await r.text()).includes("bir hesap var"), "Aynı e-posta ile ikinci kayıt reddedildi");

    // 6) Panel erişimi + kullanıcı adı
    r = await fetch(base + "/panel", { headers: { cookie } });
    html = await r.text();
    okc(r.status === 200 && html.includes("Elif"), "Giriş sonrası panel açılıyor ve adı gösteriyor");

    // 7) Bölümlerin hepsi açılıyor mu?
    const bolumler = ["gramer", "okuma", "dinleme", "konusma", "yazma", "kelime", "deneme", "arsiv", "bilim", "taktik", "rozet", "soz"];
    let acilan = 0;
    for (const b of bolumler) {
      const rr = await fetch(base + "/bolum/" + b, { headers: { cookie } });
      if (rr.status === 200) acilan++;
    }
    okc(acilan === bolumler.length, `12 bölümün tamamı girişli kullanıcıya açılıyor (${acilan}/${bolumler.length})`);

    // 8) Okuma sayfasında gerçek içerik + kanıt
    r = await fetch(base + "/bolum/okuma", { headers: { cookie } });
    html = await r.text();
    okc(html.includes("Green Roofs"), "Okuma bölümünde gerçek metin var");
    okc(html.includes("NOT GIVEN"), "TFNG soruları NOT GIVEN seçeneğiyle geliyor");
    okc(html.includes("data-cevap-denetle"), "Sorularda 'Kontrol et' düğmesi var (etkileşim bağlı)");

    // 9) Cevap denetimi: doğru ve yanlış
    const cevap = async (id, yanit) => {
      const rr = await fetch(base + "/api/cevap", { method: "POST", headers: { "Content-Type": "application/json", cookie }, body: JSON.stringify({ id, tip: "TFNG", yanit }) });
      return { status: rr.status, veri: await rr.json() };
    };
    let d = await cevap("q2", "TRUE");
    okc(d.veri.correct === true && d.veri.xp === 10, "Doğru cevap onaylandı ve XP verildi");
    okc(Boolean(d.veri.kanit), "Doğru cevapta kanıt cümlesi döndü");
    d = await cevap("q2", "FALSE");
    okc(d.veri.correct === false && d.veri.ipucu, "Yanlış cevap reddedildi ve ipucu verildi");
    // doğruluk toleransları
    const acik = async (id, yanit) => (await (await fetch(base + "/api/cevap", { method: "POST", headers: { "Content-Type": "application/json", cookie }, body: JSON.stringify({ id, tip: "KELIME", yanit }) })).json()).correct;
    okc(await acik("q9", "  Flooding  "), "Büyük/küçük harf ve boşluk toleransı çalışıyor");
    okc(await acik("l2", "Identity Card"), "Çok kelimeli cevap (identity card) kabul edildi");

    // 10) Girişsiz cevap gönderilemez
    r = await fetch(base + "/api/cevap", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: "q1", tip: "TFNG", yanit: "TRUE" }) });
    okc(r.status === 401, "Giriş yapmadan cevap gönderilemiyor (401)");

    // 11) Varlıklar gerçek GIF mi?
    r = await fetch(base + "/anim/rozet-havai-fisek.gif");
    const gifBuf = Buffer.from(await r.arrayBuffer());
    okc(r.status === 200 && r.headers.get("content-type") === "image/gif", "GIF doğru içerik tipiyle servis ediliyor");
    okc(gifBuf.slice(0, 6).toString("latin1") === "GIF89a", "GIF dosyası gerçekten geçerli (GIF89a imzası)");
    r = await fetch(base + "/img/logo.svg");
    okc(r.status === 200 && (await r.text()).startsWith("<svg"), "SVG simge servis ediliyor");
    r = await fetch(base + "/anim/yok-boyle-dosya.gif");
    okc(r.status === 404, "Olmayan varlık 404 dönüyor (sessiz hata yok)");

    // 12) Varlık durum sayfası
    r = await fetch(base + "/varliklar", { headers: { cookie } });
    html = await r.text();
    const gifSayisi = (html.match(/\.gif/g) || []).length;
    okc(gifSayisi >= 10, `Varlık sayfası 10+ GIF listeliyor (${gifSayisi} referans)`);

    // 13) Çıkış → oturum sonlanıyor
    r = await fetch(base + "/cikis", { method: "POST", headers: { cookie }, redirect: "manual" });
    okc((r.headers.get("set-cookie") || "").includes("Max-Age=0"), "Çıkışta oturum çerezi siliniyor");
    r = await fetch(base + "/panel", { headers: { cookie }, redirect: "manual" });
    okc(r.status === 302, "Çıkıştan sonra eski çerezle panele girilemiyor");

    // 14) Şifre saklama biçimi (veri dosyasından)
    const usersDosya = JSON.parse(readFileSync(join(tmp, "data", "users.json"), "utf8"));
    okc(usersDosya[0].sifreHash.startsWith("scrypt:"), "Şifre düz metin değil, scrypt tuzlu hash olarak saklanıyor");
    okc(!JSON.stringify(usersDosya).includes("GucluSifre123"), "Şifre hiçbir yerde düz metin geçmiyor");

    // 15) Sağlık ucu girişli kullanıcıyı tanıyor mu
    const sag = await (await fetch(base + "/saglik")).json();
    okc(sag.ok === true && sag.moduller === 12, "Sağlık ucu 12 modülü raporluyor");
  } catch (e) {
    okc(false, "Test çalışırken beklenmedik hata: " + e.message + (sunucuLogu ? " | sunucu günlüğü: " + sunucuLogu.split("\n").slice(-3).join(" / ") : ""));
  } finally {
    child.kill();
    await wait(200);
    try { rmSync(tmp, { recursive: true, force: true }); } catch { /* temizlik hatası yok sayılır */ }
  }

  if (!quiet) {
    console.log(`  ${res.fail === 0 ? "✓" : "✗"} demo site testi: ${res.pass} geçti / ${res.fail} başarısız`);
    for (const f of res.failures) console.log("     - " + f);
  }
  return res;
}

/* ==========================================================================
 *  B5) KOMUT SATIRI ARAYÜZÜ
 * ========================================================================== */

function printBanner() {
  console.log("");
  console.log("  ╔══════════════════════════════════════════════════════════╗");
  console.log("  ║   TEK-YAMA.mjs — IELTS Akademi SİTE ONARIM ARACI v1.0    ║");
  console.log("  ║   doktor · varlık üreteci (GIF+SVG) · hesap kiti · demo  ║");
  console.log("  ╚══════════════════════════════════════════════════════════╝");
  console.log("");
}

function printDoctor(report) {
  console.log("");
  console.log("  🔎 SİTE DOKTORU — " + report.root);
  console.log("  ────────────────────────────────────────────────────────────");
  console.log("  Dosya: " + report.stats.dosya + " · Sayfa: " + report.stats.sayfa + " · API rotası: " + report.stats.apiRotasi +
    " · Animasyon: " + (report.stats.animasyonVar ? "var" : "YOK") + " · Giriş sayfası: " + (report.stats.girisVar ? "var" : "YOK"));
  console.log("");
  if (!report.findings.length) console.log("  ✅ Hiç sorun bulunamadı.");
  for (const f of report.findings) {
    const ikon = f.sev === "error" ? "❌" : f.sev === "warn" ? "⚠️ " : "ℹ️ ";
    console.log("  " + ikon + " [" + f.id + "] " + f.msg);
    console.log("      → DÜZELTME: " + f.fix);
  }
  console.log("");
  console.log("  SONUÇ: " + report.verdictTr);
  console.log("");
}

export async function main(argv = process.argv.slice(2)) {
  const has = (f) => argv.includes(f);
  const val = (f, fb) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : fb; };

  if (has("--help") || argv.length === 0) {
    printBanner();
    console.log("  KOMUTLAR");
    console.log("   node TEK-YAMA.mjs --doctor [DIZIN]        → siteyi tara: eksik hesap/giriş, ölü bağlantı, mock veri, varlık");
    console.log("   node TEK-YAMA.mjs --assets [DIZIN=public] → 10 animasyonlu GIF + 21 SVG üret (telifsiz)");
    console.log("   node TEK-YAMA.mjs --write-kit [DIZIN=.]   → ONARIM kiti + çalışan demo site + Antigravity komutu yaz");
    console.log("   node TEK-YAMA.mjs --demo [DIZIN]          → demo siteyi kur ve çalıştır (http://localhost:3000)");
    console.log("   node TEK-YAMA.mjs --test-demo             → demo siteyi gerçek HTTP testleriyle doğrula");
    console.log("   node TEK-YAMA.mjs --self-test             → aracın kendi testleri (GIF/LZW/sözleşmeler)");
    console.log("   node TEK-YAMA.mjs --json                  → doctor raporu + test özeti (CI için)");
    console.log("");
    console.log("  TİPİK AKIŞ (mevcut bir siteyi onarmak için)");
    console.log("   1) node TEK-YAMA.mjs --doctor .");
    console.log("   2) node TEK-YAMA.mjs --assets public");
    console.log("   3) node TEK-YAMA.mjs --write-kit .");
    console.log("   4) ONARIM/00-OKU-ONCE.md adımlarını uygula (veya Antigravity'ye ONARIM/05 komutunu yapıştır)");
    console.log("   5) node TEK-YAMA.mjs --doctor .   → hata sayısı 0 olana kadar tekrarla");
    console.log("");
    return 0;
  }

  if (has("--self-test")) {
    printBanner();
    const t = runYamaSelfTest({ quiet: false });
    if (has("--test-demo")) { /* aşağıda birleşik çalışır */ }
    console.log("");
    return t.fail === 0 ? 0 : 1;
  }

  if (has("--assets")) {
    const dir = val("--assets", "public");
    printBanner();
    console.log("  🎨 VARLIK ÜRETİMİ → " + resolve(dir));
    const man = generateAssets(dir);
    console.log("");
    console.log("  ✅ " + man.filter((m) => m.type === "image/gif").length + " GIF + " + man.filter((m) => m.type === "image/svg+xml").length + " SVG üretildi.");
    console.log("  📄 varlik-manifest.json yazıldı (dosya listesi + boyutlar).");
    console.log("");
    return 0;
  }

  if (has("--doctor")) {
    const dir = val("--doctor", ".");
    printBanner();
    const rapor = runDoctor(resolve(dir));
    printDoctor(rapor);
    if (has("--json")) console.log(JSON.stringify(rapor, null, 2));
    return rapor.errors.length === 0 ? 0 : 1;
  }

  if (has("--write-kit")) {
    const dir = val("--write-kit", ".");
    printBanner();
    console.log("  🧰 ONARIM KİTİ yazılıyor → " + resolve(dir));
    const written = writeRepairKit(resolve(dir), { assetsDir: join(resolve(dir), "ONARIM/03-varliklar") });
    console.log("");
    console.log("  ✅ Kit hazır:");
    console.log("     • ONARIM/00-OKU-ONCE.md            → adım adım onarım planı");
    console.log("     • ONARIM/01-canli-site-demo/       → ÇALIŞAN site (node site-demo.mjs)");
    console.log("     • ONARIM/02-duzeltme-dosyalari/    → giriş/kayıt/panel/middleware/API dosyaları");
    console.log("     • ONARIM/03-varliklar/             → hazır GIF + SVG dosyaları");
    console.log("     • ONARIM/05-antigravity-onarim-komutu.md → yapıştırmaya hazır onarım komutu");
    console.log("");
    console.log("  ➡️  Hemen görmek için: node " + join(resolve(dir), "ONARIM/01-canli-site-demo/site-demo.mjs"));
    console.log("");
    return 0;
  }

  if (has("--demo")) {
    const dir = val("--demo", join(process.cwd(), "ONARIM/01-canli-site-demo"));
    ensureDir(dir);
    const site = join(dir, "site-demo.mjs");
    const assetsDir = join(dir, "data", "site");
    writeFileSync(site, DEMO_SITE_SOURCE, "utf8");
    generateAssets(assetsDir, { quiet: true });
    printBanner();
    console.log("  🚀 Demo site kuruldu: " + site);
    console.log("  ➜  Çalıştır:  node " + site);
    console.log("");
    const { spawn } = await import("node:child_process");
    const child = spawn(process.execPath, [site], { stdio: "inherit", env: { ...process.env, PORT: process.env.PORT || "3000" } });
    return await new Promise((ok) => child.on("exit", (code) => ok(code ?? 0)));
  }

  if (has("--test-demo")) {
    printBanner();
    console.log("  🧪 DEMO SİTE TESTLERİ (gerçek HTTP istekleri)");
    const t = await testDemoSite({ quiet: false });
    console.log("");
    return t.fail === 0 ? 0 : 1;
  }

  if (has("--json")) {
    const rapor = runDoctor(resolve(val("--doctor", ".")));
    const t = runYamaSelfTest({ quiet: true });
    console.log(JSON.stringify({ doctor: rapor, selfTest: { pass: t.pass, fail: t.fail, failures: t.failures } }, null, 2));
    return rapor.errors.length === 0 && t.fail === 0 ? 0 : 1;
  }

  printBanner();
  console.log("  Komut bulunamadı: " + argv.join(" ") + "  (--help ile listeyi gör)");
  console.log("");
  return 1;
}

/* Doğrudan çalıştırıldıysa CLI devreye girer */
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  main().then((code) => process.exit(code)).catch((e) => { console.error("HATA:", e.message); process.exit(1); });
}
