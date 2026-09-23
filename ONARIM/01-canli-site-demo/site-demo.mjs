#!/usr/bin/env node
/* ==========================================================================
 *  site-demo.mjs — IELTS AKADEMİ • ÇALIŞAN DEMO SİTE (tek dosya, bağımlılıksız)
 *  Ne yapar: e-posta + şifre ile kayıt, giriş ekranı, oturum çerezi, korumalı
 *  sayfalar, bölümlere gerçek giriş, animasyonlar, cevap denetimi, XP kaydı.
 *  Çalıştırma:  node site-demo.mjs         → http://localhost:3000
 *  Veriyi sıfırlama: dosyanın yanındaki data/ klasörünü sil.
 * ========================================================================== */

import { createServer } from "node:http";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DATA = join(ROOT, "data");
const SITE = join(DATA, "site");
const PORT = Number(process.env.PORT || 3000);
mkdirSync(SITE, { recursive: true });
mkdirSync(join(SITE, "anim"), { recursive: true });
mkdirSync(join(SITE, "img"), { recursive: true });

/* ---------- küçük yardımcılar ---------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const readJson = (f, fb) => { try { return JSON.parse(readFileSync(join(DATA, f), "utf8")); } catch { return fb; } };
const writeJson = (f, v) => writeFileSync(join(DATA, f), JSON.stringify(v, null, 2), "utf8");
const uid = (n = 12) => randomBytes(n).toString("hex");

/* ---------- şifre: scrypt + rastgele tuz (asla düz metin saklanmaz) ---------- */
function hashPassword(pw) {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(pw, salt, 64).toString("hex");
  return "scrypt:" + salt + ":" + key;
}
function verifyPassword(pw, stored) {
  try {
    const [, salt, key] = String(stored).split(":");
    const mine = scryptSync(pw, salt, 64);
    const theirs = Buffer.from(key, "hex");
    return mine.length === theirs.length && timingSafeEqual(mine, theirs);
  } catch { return false; }
}

/* ---------- veri katmanı (JSON dosyaları; tek kullanıcı/pc için yeterli) ---------- */
function users() { return readJson("users.json", []); }
function saveUsers(u) { writeJson("users.json", u); }
function sessions() { return readJson("sessions.json", {}); }
function saveSessions(s) { writeJson("sessions.json", s); }
function progressFor(userId) {
  const all = readJson("progress.json", {});
  all[userId] = all[userId] || { xp: 0, streakDays: 0, lastDay: null, answered: {}, badges: [], visits: 0, modules: {} };
  return all[userId];
}
function saveProgress(userId, p) { const all = readJson("progress.json", {}); all[userId] = p; writeJson("progress.json", all); }

/* ---------- oturum çerezi ---------- */
function parseCookies(req) {
  const out = {};
  const raw = req.headers.cookie || "";
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function currentUser(req) {
  const sid = parseCookies(req).sid;
  if (!sid) return null;
  const s = sessions()[sid];
  if (!s) return null;
  if (s.expiresAt < Date.now()) { const all = sessions(); delete all[sid]; saveSessions(all); return null; }
  const u = users().find((x) => x.id === s.userId);
  return u || null;
}
function startSession(res, userId) {
  const sid = uid(24);
  const all = sessions();
  all[sid] = { userId, createdAt: Date.now(), expiresAt: Date.now() + 30 * 86400000 };
  saveSessions(all);
  res.setHeader("Set-Cookie", "sid=" + sid + "; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000");
  return sid;
}
function endSession(req, res) {
  const sid = parseCookies(req).sid;
  if (sid) { const all = sessions(); delete all[sid]; saveSessions(all); }
  res.setHeader("Set-Cookie", "sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
}

/* ---------- içerik (demo: her bölümde gerçek örnek içerik) ---------- */
const MODULES = [
  { slug: "gramer", ad: "Gramer Akademi", ikon: "ikon-gramer.svg", anim: "ilerleme-halkasi.gif", renk: "#8B5CF6", ozet: "A1→C2, 9 bloklu dersler, 🇹🇷 klasik hatalar, ⚠️ sınav kritik detayları" },
  { slug: "okuma", ad: "Okuma Laboratuvarı", ikon: "ikon-okuma.svg", anim: "basari.gif", renk: "#0EA5E9", ozet: "Her metinde en az 10 soru, kanıt cümlesi vurgulama, TFNG tuzağı" },
  { slug: "dinleme", ad: "Dinleme Laboratuvarı", ikon: "ikon-dinleme.svg", anim: "dinleme-dalgasi.gif", renk: "#14B8A6", ozet: "GERÇEK insan sesi, 6 aksan, dikte + gölgeleme + sınav modu" },
  { slug: "konusma", ad: "Konuşma Laboratuvarı", ikon: "ikon-konusma.svg", anim: "lumi-maskot.gif", renk: "#EC4899", ozet: "Part 1-2-3 görevleri, kendi sesini kaydet, kontrol listesiyle öz değerlendirme" },
  { slug: "yazma", ad: "Yazma Laboratuvarı", ikon: "ikon-yazma.svg", anim: "kelime-karti.gif", renk: "#F59E0B", ozet: "Task 1 (grafik/süreç/harita) ve Task 2 (5 tip), 4 ölçütlü band raporu" },
  { slug: "kelime", ad: "Kelime Hazinesi", ikon: "ikon-kelime.svg", anim: "kelime-karti.gif", renk: "#A855F7", ozet: "23 alanlı kartlar: TR/EN anlam, eş anlamlı, collocation, iki dilli örnek" },
  { slug: "deneme", ad: "Deneme Sınavı", ikon: "ikon-deneme.svg", anim: "sinav-zamanlayici.gif", renk: "#EF4444", ozet: "Sınav Modu: süreli, geri sayımlı, yazım denetimi yok, band raporu" },
  { slug: "arsiv", ad: "1989 → 2026 Arşiv", ikon: "ikon-arsiv.svg", anim: "yildiz-parlamasi.gif", renk: "#6366F1", ozet: "Dönem kartları ve dönem formatında özgün denemeler" },
  { slug: "bilim", ad: "Bilim Kütüphanesi", ikon: "ikon-bilim.svg", anim: "yildiz-parlamasi.gif", renk: "#22C55E", ozet: "6 alan, A1→C2, sesli okuma ve terim kartları" },
  { slug: "taktik", ad: "Taktik Kütüphanesi", ikon: "ikon-taktik.svg", anim: "basari.gif", renk: "#F97316", ozet: "Her soru tipi için strateji, süre hedefi ve klasik tuzak" },
  { slug: "rozet", ad: "Rozetler", ikon: "ikon-rozet.svg", anim: "rozet-havai-fisek.gif", renk: "#FACC15", ozet: "1000 rozet, havai fişek kutlaması, XP ödülü" },
  { slug: "soz", ad: "Motivasyon", ikon: "ikon-soz.svg", anim: "konfeti.gif", renk: "#EC4899", ozet: "Her girişte değişen söz, kaygı yönetimi, küçük zaferler" },
];

const SOZLER = [
  ["Bugün 20 dakika ayırman, dün ayırmadığın 20 dakikadan daha değerli.", "The twenty minutes you spend today matter more than the twenty you skipped yesterday."],
  ["Hata yapmaktan korkmadan konuşmak, kalıcı bir hafıza demektir.", "Speaking without the fear of mistakes is how memory becomes permanent."],
  ["Kelime öğrenmek yarış değil; her gün bir tuğla koymak.", "Learning vocabulary is not a race; it is one brick a day."],
  ["Deneme sonucun kimliğin değil; sadece bir ölçüm.", "A mock test score is not your identity; it is only a measurement."],
  ["Küçük adım, büyük planı taşır.", "Small steps carry big plans."],
  ["Anlamadığın yeri sormak, öğrenmenin en hızlı yolu.", "Asking about what you did not understand is the fastest way to learn."],
];

const OKUMA = {
  baslik: "Green Roofs in Modern Cities",
  seviye: "B1",
  paragraflar: [
    { no: 1, metin: "Green roofs are layers of plants grown on top of buildings. They are not a new idea: people have grown plants on roofs for hundreds of years." },
    { no: 2, metin: "In cities, green roofs cool buildings in summer and keep heat inside during winter. They also slow rainwater, which reduces flooding after heavy storms." },
    { no: 3, metin: "However, these projects are not cheap. A green roof can cost three times more than a traditional roof, and it needs regular care." },
    { no: 4, metin: "Some city councils now offer money to building owners, because green roofs can lower the temperature of a whole neighbourhood." },
  ],
  sorular: [
    { id: "q1", tip: "TFNG", soru: "Green roofs are a completely new idea.", cevap: "FALSE", kanit: "They are not a new idea", aciklama: "Metin açıkça yeni bir fikir olmadığını söylüyor." },
    { id: "q2", tip: "TFNG", soru: "Green roofs can reduce flooding after storms.", cevap: "TRUE", kanit: "reduces flooding after heavy storms", aciklama: "Su akışını yavaşlatıp seli azalttığı yazıyor." },
    { id: "q3", tip: "TFNG", soru: "Green roofs are cheaper than traditional roofs.", cevap: "FALSE", kanit: "can cost three times more", aciklama: "Metin tam tersini söylüyor: üç kat pahalı olabilir." },
    { id: "q4", tip: "TFNG", soru: "Some councils give money to building owners.", cevap: "TRUE", kanit: "offer money to building owners", aciklama: "Belediyelerin destek verdiği yazıyor." },
    { id: "q5", tip: "TFNG", soru: "Green roofs make buildings warmer in summer.", cevap: "FALSE", kanit: "cool buildings in summer", aciklama: "Yazın serinlettiği yazıyor, ısıtmadığı." },
    { id: "q6", tip: "TFNG", soru: "All green roofs are maintained by the government.", cevap: "NOT GIVEN", kanit: "it needs regular care", aciklama: "Bakım gerektiği yazıyor ama KİMİN bakım yaptığı yazmıyor → NOT GIVEN." },
    { id: "q7", tip: "MCQ", soru: "What is the writer's main point in paragraph 3?", cevap: "C", secenekler: ["Green roofs are beautiful", "Green roofs are illegal", "Green roofs cost more than normal roofs", "Green roofs need no care"], kanit: "these projects are not cheap", aciklama: "Paragraf maliyet ve bakım zorluğunu anlatıyor." },
    { id: "q8", tip: "MCQ", soru: "Why do councils offer money?", cevap: "B", secenekler: ["To build car parks", "Because green roofs cool whole neighbourhoods", "To close old buildings", "To raise taxes"], kanit: "lower the temperature of a whole neighbourhood", aciklama: "Sebep doğrudan metinde veriliyor." },
    { id: "q9", tip: "KELIME", soru: "Complete: They slow rainwater, which reduces ______ after heavy storms. (1 kelime)", cevap: "flooding", kanit: "reduces flooding", aciklama: "Kelime sınırı: 1 kelime." },
    { id: "q10", tip: "KELIME", soru: "Complete: A green roof can cost three times more than a ______ roof. (1 kelime)", cevap: "traditional", kanit: "than a traditional roof", aciklama: "Metinden birebir alınır." },
  ],
};

const DINLEME = {
  baslik: "Kütüphane Kayıt Görüşmesi",
  seviye: "A2",
  not: "Bu demo sürümde ses dosyası yoktur; gerçek insan sesi kayıtları (6 aksan × 2 cinsiyet) projeye eklenecektir. Aşağıdaki transkript aynı kaydın metnidir.",
  satirlar: [
    ["Officer", "Good morning, welcome to Bursa City Library."],
    ["Student", "Hello. I would like to join the library."],
    ["Officer", "Your membership card is free, but please bring your identity card."],
    ["Officer", "Books can be borrowed for two weeks."],
    ["Officer", "If you return them late, the fine is two lira per day."],
  ],
  sorular: [
    { id: "l1", tip: "MCQ", soru: "How much is the membership card?", cevap: "A", secenekler: ["Free", "Two lira", "Ten lira", "One week"], aciklama: "\"Your membership card is free\" ifadesi doğrudan cevabı verir." },
    { id: "l2", tip: "KELIME", soru: "What must you bring? (1-2 kelime)", cevap: "identity card", aciklama: "Yazım hatası olmadan yazılmalı." },
    { id: "l3", tip: "KELIME", soru: "How long can you borrow books? (1-2 kelime)", cevap: "two weeks", aciklama: "Sayı yakalama sorusu." },
  ],
};

const GRAMER = [
  { baslik: "Present Simple", seviye: "A1", kural: "Özne + fiil + nesne. He/She/It ile fiile -s eklenir.", ornek: ["I work in Bursa.", "She works here.", "They do not work today."], hatalar: ["\"She work here\" → \"She works here\" (3. tekil şahısta -s zorunlu)"], kritik: "Listening bölümünde geniş zaman ifadeleri (usually, every day) cevabı doğrudan işaret eder." },
  { baslik: "Present Perfect", seviye: "A2", kural: "have/has + V3. Belirli zaman ifadesi (yesterday, in 2020) varsa kullanılmaz.", ornek: ["I have finished my homework.", "She has lived here for five years."], hatalar: ["\"I have seen him yesterday\" → \"I saw him yesterday\""], kritik: "Writing Task 1'de eğilim anlatırken \"has risen since 2019\" üst band cümlesidir." },
  { baslik: "Passive Voice", seviye: "B1", kural: "be + V3. Kim yaptığı bilinmiyorsa veya önemsizse kullanılır.", ornek: ["The report was written by the team.", "English is spoken in many countries."], hatalar: ["\"The report was write\" → \"was written\""], kritik: "Process (süreç) tipi Task 1 grafiklerinde pasif zorunludur." },
];

const KELIME = [
  { kelime: "mitigate", tr: "hafifletmek, azaltmak", orn: "Governments can mitigate the effects of drought.", es: "alleviate, reduce", seviye: "C1" },
  { kelime: "significant", tr: "önemli, kayda değer", orn: "There was a significant rise in sales.", es: "considerable, notable", seviye: "B2" },
  { kelime: "curriculum", tr: "müfredat", orn: "Coding is part of the curriculum now.", es: "syllabus", seviye: "B2" },
  { kelime: "sustainable", tr: "sürdürülebilir", orn: "Sustainable design saves energy.", es: "viable, eco-friendly", seviye: "B2" },
  { kelime: "fluctuate", tr: "dalgalanmak", orn: "Prices fluctuated between 10 and 20 percent.", es: "vary, rise and fall", seviye: "B2" },
];

const YAZMA = { baslik: "Some people believe private cars should be banned from city centres.", tip: "Task 2 • Opinion", minKelime: 250, anahtarlar: ["cars", "city", "ban", "public transport", "pollution"] };
const KONUSMA = [
  { kart: "İyi öğrendiğin bir beceriyi anlat.", alt: ["Bu beceri nedir?", "Nasıl öğrendin?", "Kim yardım etti?", "Hayatını nasıl değiştirdi?"] },
  { kart: "Son zamanlarda okuduğun bir haberi anlat.", alt: ["Ne hakkındaydı?", "Nereden okudun?", "Neden ilgini çekti?", "Kime anlatmak isterdin?"] },
  { kart: "Küçük bir hatadan öğrendiğin bir dersi anlat.", alt: ["Hata neydi?", "Nasıl fark ettin?", "Ne öğrendin?", "Bugün ne yapıyorsun farklı?"] },
];
const ROZETLER = [
  { id: "b1", ad: "İlk Adım", sart: "İlk girişini yap", ikon: "rozet-bronze.svg" },
  { id: "b2", ad: "Okuma Kurdu", sart: "İlk okuma setini bitir", ikon: "rozet-silver.svg" },
  { id: "b3", ad: "Seri Başlangıcı", sart: "3 gün üst üste çalış", ikon: "rozet-gold.svg" },
  { id: "b4", ad: "Deneme Savaşçısı", sart: "İlk deneme bölümünü bitir", ikon: "rozet-platinum.svg" },
  { id: "b5", ad: "Kelime Avcısı", sart: "10 kelime tekrarı yap", ikon: "rozet-gold.svg" },
  { id: "b6", ad: "Azim Ödülü", sart: "7 gün üst üste çalış", ikon: "rozet-legendary.svg" },
];

/* ---------- tasarım (light + dark, capcanlı renkler) ---------- */
const CSS = ":root{--bg:#F7F5FF;--panel:#FFFFFF;--ink:#17123A;--muted:#6B7280;--line:#E5E7EB;--brand:#7C3AED;--brand2:#EC4899;--ok:#0F766E;--warn:#D97706;--err:#DC2626}\n@media (prefers-color-scheme: dark){:root:not([data-theme=light]){--bg:#0F0C24;--panel:#1A1440;--ink:#F8FAFC;--muted:#A5B4FC;--line:#312B5E;--brand:#C4B5FD;--brand2:#F9A8D4;--ok:#5EEAD4;--warn:#FCD34D;--err:#FCA5A5}}\n[data-theme=dark]{--bg:#0F0C24;--panel:#1A1440;--ink:#F8FAFC;--muted:#A5B4FC;--line:#312B5E;--brand:#C4B5FD;--brand2:#F9A8D4;--ok:#5EEAD4;--warn:#FCD34D;--err:#FCA5A5}\n*{box-sizing:border-box}body{margin:0;font-family:Segoe UI,system-ui,Arial,sans-serif;background:var(--bg);color:var(--ink);line-height:1.55}\n.wrap{max-width:1040px;margin:0 auto;padding:16px}\nheader.top{position:sticky;top:0;z-index:20;background:var(--panel);border-bottom:1px solid var(--line)}\n.nav{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:10px 16px;max-width:1040px;margin:0 auto}\n.brand{display:flex;align-items:center;gap:10px;font-weight:800;text-decoration:none;color:var(--ink)}\n.brand img{width:40px;height:40px;border-radius:12px}\n.links{display:flex;gap:10px;flex-wrap:wrap;margin-left:auto;align-items:center}\na.link,button.btn{font:inherit;font-weight:700;text-decoration:none;color:var(--ink);background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:8px 12px;cursor:pointer}\na.link:hover,button.btn:hover{border-color:var(--brand);transform:translateY(-1px)}\nbutton.primary,a.primary{background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fff;border:0}\n.card{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:18px;box-shadow:0 6px 24px rgba(23,18,58,.06)}\n.grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}\n.mod{display:flex;gap:12px;text-decoration:none;color:inherit;align-items:flex-start;transition:transform .15s}\n.mod:hover{transform:translateY(-2px)}\n.mod img.ikon{width:44px;height:44px;border-radius:14px;flex:none}\n.anim{width:100%;max-width:240px;border-radius:16px;display:block}\n.ikon{width:44px;height:44px;border-radius:14px}\n.row{display:flex;gap:14px;flex-wrap:wrap;align-items:center}\n.muted{color:var(--muted)}.small{font-size:.9rem}\ninput,select,textarea{font:inherit;background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:12px;padding:10px 12px;width:100%}\nlabel{font-weight:700;font-size:.95rem;display:block;margin:10px 0 4px}\n.msg{border-radius:12px;padding:10px 12px;margin:10px 0;font-weight:600}\n.msg.err{background:#FEE2E2;color:#B91C1C}\n.msg.ok{background:#D1FAE5;color:#065F46}\n.q{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px;margin:10px 0}\n.pill{display:inline-block;border-radius:999px;padding:4px 10px;font-size:.8rem;font-weight:700;background:#EDE9FE;color:#6D28D9}\n.kanit{background:#FEF3C7;border-radius:8px;padding:2px 4px}\nfooter{padding:24px 16px;color:var(--muted);text-align:center}\n.module{display:grid;gap:16px;grid-template-columns:1fr;align-items:start}\n@media (min-width:820px){.module{grid-template-columns:260px 1fr}}\n.skip{position:absolute;left:-9999px}.skip:focus{left:8px;top:8px;background:var(--panel);padding:8px;border-radius:8px;z-index:50}\n:focus-visible{outline:3px solid var(--brand2);outline-offset:2px}\n.hidden{display:none!important}";

const CLIENT_JS = "\"document.querySelectorAll(\\\\\"[data-nav]\\\\\").forEach(function(a){a.addEventListener(\\\\\"click\\\\\",function(){document.body.classList.add(\\\\\"page-leaving\\\\\")});});\",\n\"var t=document.querySelector(\\\\\"[data-theme-toggle]\\\\\");if(t){t.addEventListener(\\\\\"click\\\\\",function(){var c=document.documentElement.getAttribute(\\\\\"data-theme\\\\\");var n=c===\\\\\"dark\\\\\"?\\\\\"light\\\\\":\\\\\"dark\\\\\";document.documentElement.setAttribute(\\\\\"data-theme\\\\\",n);try{localStorage.setItem(\\\\\"tema\\\\\",n)}catch(e){}t.textContent=n===\\\\\"dark\\\\\"?\\\\\"☀️ Açık tema\\\\\":\\\\\"🌙 Koyu tema\\\\\"});}\",\n\"try{var s=localStorage.getItem(\\\\\"tema\\\\\");if(s)document.documentElement.setAttribute(\\\\\"data-theme\\\\\",s)}catch(e){}\",\n\"var kayit=document.querySelector(\\\\\"[data-kayit]\\\\\");if(kayit&&navigator.mediaDevices){kayit.addEventListener(\\\\\"click\\\\\",async function(){try{var st=await navigator.mediaDevices.getUserMedia({audio:true});var rd=new MediaRecorder(st);var parca=[];rd.ondataavailable=function(e){parca.push(e.data)};rd.onstop=function(){var blob=new Blob(parca,{type:\\\\\"audio/webm\\\\\"});var au=document.getElementById(\\\\\"kayit-ses\\\\\");au.src=URL.createObjectURL(blob);au.classList.remove(\\\\\"hidden\\\\\")};rd.start();kayit.textContent=\\\\\"⏹ Kaydı bitir\\\\\";kayit.dataset.durum=\\\\\"kayit\\\\\";setTimeout(function(){if(rd.state!==\\\\\"inactive\\\\\"){rd.stop();st.getTracks().forEach(function(t){t.stop()});kayit.textContent=\\\\\"🎙️ Yeniden kaydet\\\\\"}},120000);}catch(e){document.getElementById(\\\\\"kayit-uyari\\\\\").textContent=\\\\\"Mikrofon izni verilmedi. Tarayıcı ayarlarından izin ver ya da sesli okuma modunu kullan.\\\\\"}});}\",\n\"var z=document.querySelector(\\\\\"[data-geri-sayim]\\\\\");if(z){var sn=Number(z.getAttribute(\\\\\"data-geri-sayim\\\\\"));var el=document.getElementById(\\\\\"sayac\\\\\");var t=setInterval(function(){sn--;if(el){el.textContent=Math.floor(sn/60)+\\\\\" dk \\\\\"+(sn%60)+\\\\\" sn\\\\\"}if(sn<=0){clearInterval(t);if(el)el.textContent=\\\\\"Süre doldu!\\\\\";document.body.classList.add(\\\\\"sure-bitti\\\\\")}},1000);}\",\n\"var sayac=document.querySelector(\\\\\"[data-kelime-sayaci]\\\\\");if(sayac){var tas=document.getElementById(\\\\\"metin\\\\\");var g=document.getElementById(\\\\\"kelime\\\\\");var f=function(){var n=tas.value.trim()?tas.value.trim().split(/\\\\\\\\s+/).length:0;g.textContent=n+\\\\\" kelime\\\\\";g.style.color=n>=250?\\\\\"var(--ok)\\\\\":\\\\\"var(--warn)\\\\\"};tas.addEventListener(\\\\\"input\\\\\",f);f();}\",";

/* ---------- görünüm parçaları ---------- */
function layout(user, title, body, opts) {
  const o = opts || {};
  const s = SOZLER[Math.floor(Math.random() * SOZLER.length)];
  return "<!doctype html><html lang=\"tr\" data-theme=\"light\"><head><meta charset=\"utf-8\">" +
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" +
    "<title>" + esc(title) + " • IELTS Akademi</title>" +
    "<link rel=\"stylesheet\" href=\"/stil.css\">" +
    "<link rel=\"icon\" href=\"/img/logo.svg\">" +
    "</head><body>" +
    "<a class=\"skip\" href=\"#icerik\">İçeriğe geç</a>" +
    "<header class=\"top\"><nav class=\"nav\">" +
    "<a class=\"brand\" href=\"/\" data-nav><img src=\"/img/logo.svg\" alt=\"\"><span>IELTS Akademi</span></a>" +
    "<div class=\"links\">" +
    "<a class=\"link\" href=\"/bolum/gramer\" data-nav>Gramer</a>" +
    "<a class=\"link\" href=\"/bolum/okuma\" data-nav>Okuma</a>" +
    "<a class=\"link\" href=\"/bolum/dinleme\" data-nav>Dinleme</a>" +
    "<a class=\"link\" href=\"/bolum/konusma\" data-nav>Konuşma</a>" +
    "<button class=\"btn\" data-theme-toggle>🌙 Koyu tema</button>" +
    (user
      ? "<a class=\"link\" href=\"/panel\" data-nav>Panelim</a><form method=\"post\" action=\"/cikis\" style=\"display:inline\"><button class=\"btn\" type=\"submit\">Çıkış</button></form>"
      : "<a class=\"link\" href=\"/giris\" data-nav>Giriş</a><a class=\"primary link\" href=\"/kayit\" data-nav>Ücretsiz kayıt</a>") +
    "</div></nav></header>" +
    "<main id=\"icerik\" class=\"wrap\">" + (o.hero ? "<p class=\"card small\"><strong>Günün sözü:</strong> " + esc(s[0]) + " <span class=\"muted\">— " + esc(s[1]) + "</span></p>" : "") + body + "</main>" +
    "<footer><p>IELTS Akademi • Bu demo, platformun çalışan iskeletidir. 1000 rozet, 1000 söz ve tüm içerik <strong>TEK-KOD.mjs</strong> ile üretilir.</p></footer>" +
    "<div id=\"kutlama\" class=\"hidden\" style=\"position:fixed;right:16px;bottom:16px;z-index:40\"><div class=\"card row\"><img class=\"anim\" style=\"max-width:140px\" src=\"/anim/rozet-havai-fisek.gif\" alt=\"Rozet kutlaması\"><div><strong>Harika! Rozet kazandın 🎉</strong><p class=\"small muted\">Panodan yeni rozetini görebilirsin.</p></div></div></div>" +
    "<script src=\"/istemci.js\"></script></body></html>";
}

function moduleCard(m) {
  return "<a class=\"card mod\" href=\"/bolum/" + m.slug + "\" data-nav>" +
    "<img class=\"ikon\" src=\"/img/" + m.ikon + "\" alt=\"\">" +
    "<span><strong>" + esc(m.ad) + "</strong><br><span class=\"small muted\">" + esc(m.ozet) + "</span></span></a>";
}

/* ---------- sayfalar ---------- */
function pageHome(user) {
  return layout(user, "Ana sayfa",
    "<section class=\"card row\" style=\"justify-content:space-between\">" +
    "<div style=\"max-width:560px\"><h1>IELTS Akademi</h1>" +
    "<p>A1'dan C2'ye gramer, okuma, dinleme, konuşma, yazma ve kelime. <strong>Pazartesi + Çarşamba</strong> canlı ders günleri, kalan günler kişisel program.</p>" +
    "<p class=\"row\"><a class=\"primary link\" href=\"/kayit\" data-nav>Hemen hesap oluştur</a><a class=\"link\" href=\"/giris\" data-nav>Zaten hesabım var</a></p>" +
    "<p class=\"small muted\">Bu sayfa halka açıktır; bölümler ve panel yalnızca giriş yapan öğrenciye açılır.</p></div>" +
    "<img class=\"anim\" src=\"/anim/lumi-maskot.gif\" alt=\"Lumi maskotu el sallıyor\"></section>" +
    "<h2>Bölümler</h2><section class=\"grid\">" + MODULES.map(moduleCard).join("") + "</section>" +
    "<section class=\"card\"><h2>Varlık kontrolü</h2><p>Tüm animasyonlar ve simgeler bu sitede yerel dosyadan gelir. <a href=\"/varliklar\" data-nav>Varlık durumunu gör</a>.</p>" +
    "<p class=\"row\"><img class=\"anim\" style=\"max-width:180px\" src=\"/anim/konfeti.gif\" alt=\"Konfeti\"><img class=\"anim\" style=\"max-width:180px\" src=\"/anim/ilerleme-halkasi.gif\" alt=\"İlerleme halkası\"></p></section>", { hero: true });
}

function pageAuth(hata, basari, kip) {
  const giris = kip === "giris";
  return layout(null, giris ? "Giriş" : "Kayıt",
    "<section class=\"card\" style=\"max-width:520px;margin:24px auto\">" +
    "<h1>" + (giris ? "Hesabına gir" : "Yeni hesap oluştur") + "</h1>" +
    (hata ? "<p class=\"msg err\">" + esc(hata) + "</p>" : "") +
    (basari ? "<p class=\"msg ok\">" + esc(basari) + "</p>" : "") +
    "<form method=\"post\" action=\"" + (giris ? "/giris" : "/kayit") + "\">" +
    "<label for=\"email\">E-posta</label><input id=\"email\" name=\"email\" type=\"email\" required autocomplete=\"email\" placeholder=\"ornek@eposta.com\">" +
    "<label for=\"sifre\">Şifre</label><input id=\"sifre\" name=\"sifre\" type=\"password\" required minlength=\"8\" autocomplete=\"" + (giris ? "current-password" : "new-password") + "\" placeholder=\"En az 8 karakter\">" +
    (giris ? "" : "<label for=\"ad\">Ad (isteğe bağlı)</label><input id=\"ad\" name=\"ad\" type=\"text\" placeholder=\"Adın\">") +
    "<p style=\"margin-top:14px\"><button class=\"primary btn\" type=\"submit\" style=\"width:100%\">" + (giris ? "Giriş yap" : "Hesap oluştur") + "</button></p></form>" +
    "<p class=\"small muted\">" + (giris ? "Hesabın yok mu? <a href=\"/kayit\" data-nav>Kayıt ol</a>" : "Zaten üye misin? <a href=\"/giris\" data-nav>Giriş yap</a>") + "</p>" +
    "<p class=\"small muted\">Şifreler scrypt ile tuzlanarak saklanır; oturum çerezi HttpOnly'dir.</p></section>");
}

function pagePanel(user, p) {
  const modlar = Object.entries(p.modules || {}).map(function(e) { return "<li><strong>" + esc(e[0]) + "</strong>: " + e[1] + " etkinlik</li>"; }).join("") || "<li class=\"muted\">Henüz etkinlik yok — bir bölümden başla.</li>";
  const rozetler = ROZETLER.map(function(r) {
    const alindi = (p.badges || []).indexOf(r.id) >= 0;
    return "<div class=\"q\" style=\"opacity:" + (alindi ? 1 : .45) + "\"><img src=\"/img/" + r.ikon + "\" alt=\"\" style=\"width:44px;height:44px;float:left;margin-right:10px\"><strong>" + r.ad + "</strong><br><span class=\"small muted\">" + r.sart + (alindi ? " · KAZANILDI ✅" : "") + "</span></div>";
  }).join("");
  return layout(user, "Panelim",
    "<h1>Merhaba " + esc(user.ad || user.email.split("@")[0]) + " 👋</h1>" +
    "<section class=\"row\" style=\"align-items:stretch\">" +
    "<div class=\"card\" style=\"flex:1;min-width:200px\"><span class=\"pill\">XP</span><h2>" + p.xp + "</h2><p class=\"small muted\">Her doğru cevap XP kazandırır.</p></div>" +
    "<div class=\"card\" style=\"flex:1;min-width:200px\"><span class=\"pill\">Seri</span><h2>" + p.streakDays + " gün</h2><p class=\"small muted\">Bugün çalıştıysan ✓</p></div>" +
    "<div class=\"card\" style=\"flex:1;min-width:200px\"><span class=\"pill\">Rozet</span><h2>" + (p.badges || []).length + " / " + ROZETLER.length + "</h2><p class=\"small muted\">Demo koleksiyonu</p></div></div>" +
    "<section class=\"card\"><h2>Bugünün görevleri</h2><ol>" +
    "<li><a href=\"/bolum/okuma\" data-nav>1 okuma metni + soruları (10 soru)</a></li>" +
    "<li><a href=\"/bolum/dinleme\" data-nav>1 dinleme + transkript çalışması</a></li>" +
    "<li><a href=\"/bolum/gramer\" data-nav>A2 gramer: Present Perfect</a></li>" +
    "<li><a href=\"/bolum/konusma\" data-nav>60 saniye konuşma kaydı</a></li></ol>" +
    "<p class=\"row\"><img class=\"anim\" src=\"/anim/ilerleme-halkasi.gif\" alt=\"İlerleme halkası\"><img class=\"anim\" src=\"/anim/seri-alev.gif\" alt=\"Seri alevi\"></p></section>" +
    "<section class=\"grid\">" + MODULES.slice(0, 6).map(moduleCard).join("") + "</section>" +
    "<section class=\"card\"><h2>Modül etkinliğin</h2><ul>" + modlar + "</ul></section>" +
    "<section class=\"card\"><h2>Rozetler</h2>" + rozetler + "</section>");
}

function pageModule(m, user, p, ekstra) {
  return layout(user, m.ad,
    "<p><a class=\"small\" href=\"/panel\" data-nav>← Panele dön</a></p>" +
    "<section class=\"module\">" +
    "<aside class=\"card\"><img class=\"ikon\" style=\"width:56px;height:56px\" src=\"/img/" + m.ikon + "\" alt=\"\"><h2 style=\"margin:8px 0 4px\">" + esc(m.ad) + "</h2><p class=\"small muted\">" + esc(m.ozet) + "</p>" +
    "<p class=\"row\"><img class=\"anim\" style=\"max-width:100%\" src=\"/anim/" + m.anim + "\" alt=\"Animasyon\"></p></aside>" +
    "<div>" + ekstra + "</div></section>");
}

function soruHtml(s) {
  const girdi = s.tip === "MCQ" || s.tip === "TFNG"
    ? "<select>" + (s.secenekler || ["TRUE", "FALSE", "NOT GIVEN"]).map(function(o) { return "<option value=\"" + esc(o) + "\">" + esc(o) + "</option>"; }).join("") + "</select>"
    : "<input type=\"text\" placeholder=\"Cevabını yaz\">";
  return "<div class=\"q\" data-soru=\"" + s.id + "\" data-tip=\"" + s.tip + "\"><p><strong>" + esc(s.id.toUpperCase()) + " · " + s.tip + "</strong> " + esc(s.soru) + "</p>" + girdi +
    "<p class=\"row\" style=\"margin-top:8px\"><button class=\"btn primary\" type=\"button\" data-cevap-denetle>Kontrol et</button><span data-geri class=\"small muted\"></span></p></div>";
}

function pageOkuma(m, user) {
  const icerik = "<article class=\"card\"><h1>" + esc(OKUMA.baslik) + "</h1><p><span class=\"pill\">" + OKUMA.seviye + "</span> <span class=\"pill\">" + OKUMA.sorular.length + " soru</span></p>" +
    OKUMA.paragraflar.map(function(pg) { return "<p><strong>" + pg.no + ".</strong> " + esc(pg.metin) + "</p>"; }).join("") +
    "<p class=\"small muted\">Her soruda kanıt cümlesi vurgulanır; cevap metinden birebir çıkar.</p></article>" +
    "<h2>Sorular</h2>" + OKUMA.sorular.map(soruHtml).join("");
  return pageModule(m, user, null, icerik);
}

function pageDinleme(m, user) {
  const icerik = "<section class=\"card\"><h1>" + esc(DINLEME.baslik) + "</h1><p><span class=\"pill\">" + DINLEME.seviye + "</span></p><p class=\"msg err\" style=\"font-weight:600\">" + esc(DINLEME.not) + "</p>" +
    "<img class=\"anim\" src=\"/anim/dinleme-dalgasi.gif\" alt=\"Dinleme dalga animasyonu\">" +
    "<h2>Transkript</h2>" + DINLEME.satirlar.map(function(l) { return "<p><strong>" + esc(l[0]) + ":</strong> " + esc(l[1]) + "</p>"; }).join("") + "</section>" +
    "<h2>Sorular</h2>" + DINLEME.sorular.map(soruHtml).join("");
  return pageModule(m, user, null, icerik);
}

function pageGramer(m, user) {
  const icerik = GRAMER.map(function(g) {
    return "<article class=\"card\"><h2>" + esc(g.baslik) + " <span class=\"pill\">" + g.seviye + "</span></h2>" +
      "<p><strong>Kural:</strong> " + esc(g.kural) + "</p>" +
      "<p><strong>Örnekler:</strong></p><ul>" + g.ornek.map(function(o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>" +
      "<p class=\"msg err\">🇹🇷 " + esc(g.hatalar[0]) + "</p>" +
      "<p class=\"msg warn\" style=\"background:color-mix(in srgb,var(--warn) 16%,transparent);color:var(--warn)\">⚠️ " + esc(g.kritik) + "</p></article>";
  }).join("");
  const alistirma = "<section class=\"card\"><h2>Hızlı alıştırma</h2>" + [
    { id: "g1", tip: "KELIME", soru: "She ______ (work) here every day. → doğru fiil biçimini yaz", cevap: "works", kanit: "She works here", aciklama: "3. tekil şahısta -s kuralı." },
    { id: "g2", tip: "KELIME", soru: "I ______ (finish) my homework. (yakın geçmiş, sonucu şimdi önemli)", cevap: "have finished", kanit: "I have finished my homework.", aciklama: "Present perfect: have + V3." },
    { id: "g3", tip: "MCQ", soru: "Choose the correct passive: The report ______ by the team.", secenekler: ["was written", "was wrote", "wrote", "is write"], cevap: "was written", aciklama: "be + V3." },
  ].map(soruHtml).join("") + "</section>";
  return pageModule(m, user, null, icerik + alistirma);
}

function pageKelime(m, user) {
  const icerik = "<section class=\"card\"><h2>Bugünün kelimeleri</h2><p class=\"small muted\">Her kartta TR/EN anlam, eş anlamlı ve örnek cümle vardır. Sesli okuma için gerçek insan kayıtları projeye eklenecek.</p></section>" +
    "<section class=\"grid\">" + KELIME.map(function(w) {
      return "<article class=\"card\"><span class=\"pill\">" + w.seviye + "</span><h3>" + esc(w.kelime) + "</h3><p><strong>" + esc(w.tr) + "</strong></p><p class=\"small muted\">Eş anlamlı: " + esc(w.es) + "</p><p class=\"small\">" + esc(w.orn) + "</p></article>";
    }).join("") + "</section>";
  return pageModule(m, user, null, icerik);
}

function pageKonusma(m, user) {
  const icerik = "<section class=\"card\"><h2>Part 2 kartları</h2>" + KONUSMA.map(function(k) {
    return "<article class=\"q\"><strong>" + esc(k.kart) + "</strong><ul>" + k.alt.map(function(a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></article>";
  }).join("") + "<p class=\"row\"><button class=\"btn primary\" type=\"button\" data-kayit>🎙️ Kaydı başlat (en fazla 2 dakika)</button></p>" +
    "<audio id=\"kayit-ses\" controls class=\"hidden\" style=\"width:100%;margin-top:10px\"></audio><p id=\"kayit-uyari\" class=\"msg err hidden\"></p>" +
    "<p class=\"small muted\">Telaffuz bandı otomatik verilmez; kaydını öğretmeninle veya öz değerlendirme listesiyle değerlendir.</p></section>";
  return pageModule(m, user, null, icerik);
}

function pageYazma(m, user) {
  const icerik = "<section class=\"card\"><h2>" + esc(YAZMA.tip) + "</h2><p>" + esc(YAZMA.baslik) + "</p>" +
    "<p class=\"small muted\">Hedef: en az " + YAZMA.minKelime + " kelime. Kronometreyi kendin tut: 40 dakika.</p>" +
    "<label for=\"metin\">Yazın</label><textarea id=\"metin\" rows=\"10\" data-kelime-sayaci></textarea>" +
    "<p><span id=\"kelime\" class=\"pill\">0 kelime</span></p>" +
    "<p class=\"small muted\">Değerlendirme ölçütleri: Görev Yanıtı · Tutarlılık · Kelime Kaynağı · Gramer. (Bu demoda otomatik band verilmez; gerçek platformda 4 ölçütlü rapor üretilir.)</p></section>";
  return pageModule(m, user, null, icerik);
}

function pageDeneme(m, user) {
  const soru = [
    { id: "d1", tip: "MCQ", soru: "(Reading) The passage says green roofs \"slow rainwater\". What does this mean?", secenekler: ["They stop rain", "They delay water flow", "They store drinking water", "They warm the roof"], cevap: "They delay water flow", aciklama: "slow = yavaşlatmak → akışı geciktirmek." },
    { id: "d2", tip: "TFNG", soru: "The writer believes green roofs are always cheap.", cevap: "FALSE", kanit: "not cheap", aciklama: "Metin pahalı olabileceğini söylüyor." },
    { id: "d3", tip: "KELIME", soru: "(Listening) How much is the late fine per day? (1-2 kelime)", cevap: "two lira", aciklama: "Birim tuzağı: 2 hafta ↔ 2 lira." },
  ];
  const icerik = "<section class=\"card\"><h2>Sınav Modu</h2><p class=\"msg warn\" style=\"background:color-mix(in srgb,var(--warn) 16%,transparent);color:var(--warn)\">Sınav modunda yazım denetimi yoktur ve Listening'de 10 dakikalık aktarma süresi yoktur. Kalan süre: <strong id=\"sayac\">5 dk</strong></p>" +
    "<img class=\"anim\" src=\"/anim/sinav-zamanlayici.gif\" alt=\"Zamanlayıcı\"><div data-geri-sayim=\"300\"></div></section>" +
    "<h2>Sorular</h2>" + soru.map(soruHtml).join("");
  return pageModule(m, user, null, icerik);
}

function pageArsiv(m, user) {
  const donemler = [
    ["1989-1994", "IELTS yürürlüğe girdi; iki genel + iki özel modül vardı."],
    ["1995-2000", "Academic Reading/Writing tek modülde birleşti; Reading üç metne çıktı."],
    ["2001-2004", "Bugünkü üç bölümlü Speaking geldi."],
    ["2005-2007", "Yeni yazma kriterleri ve yarım band raporlama."],
    ["2008-2014", "Telaffuz ölçeği netleşti; kâğıt sınav küresel standart oldu."],
    ["2015-2019", "UKVI, Life Skills ve bilgisayar tabanlı sınav (CD-IELTS)."],
    ["2020-2022", "Video görüşmeyle Speaking; One Skill Retake duyurusu."],
    ["2023-2025", "OSR uygulamada; bilgisayar sınav baskın hâle geldi."],
    ["2026", "Kâğıt sınav kapanıyor; OSR yalnızca bilgisayarda; yazım denetimi yok."],
  ];
  const icerik = "<section class=\"card\"><h2>Dönem kartları</h2><p class=\"small muted\">Resmî sınav kâğıtları kullanılmaz; her dönemin üslubuyla SIFIRDAN özgün denemeler yazılır.</p></section>" +
    donemler.map(function(d) { return "<article class=\"card\"><span class=\"pill\">" + d[0] + "</span><p>" + esc(d[1]) + "</p></article>"; }).join("");
  return pageModule(m, user, null, icerik);
}

function pageTaktik(m, user) {
  const taktikler = [
    ["TFNG", "İddianın TAMAMI metinde yoksa NOT GIVEN. \"Kanıtlanmıştır\", \"her zaman\" gibi güçlü ifadeler tuzaktır.", "80 sn/soru"],
    ["Sayı yakalama", "Soruyu cevaplamadan önce istenen birimi belirle (hafta mı, lira mı?).", "30 sn/soru"],
    ["Matching headings", "İlk cümleye değil, paragrafın tamamının işine bak.", "90 sn/soru"],
    ["Writing Task 1", "Overview cümlesinde sayı verme, eğilimi yaz. Sonuç paragrafı yazma.", "20 dk"],
    ["Writing Task 2", "Her gövde paragrafı: iddia + gerekçe + örnek.", "40 dk"],
    ["Speaking Part 2", "Her alt soruya 25-30 saniye; bir örnek ve bir duygu cümlesi ekle.", "2 dk"],
  ];
  const icerik = "<section class=\"card\"><h2>Hızlı taktikler</h2></section>" + taktikler.map(function(t) {
    return "<article class=\"card\"><span class=\"pill\">" + esc(t[0]) + "</span><p>" + esc(t[1]) + "</p><p class=\"small muted\">Süre hedefi: " + esc(t[2]) + "</p></article>";
  }).join("");
  return pageModule(m, user, null, icerik);
}

function pageRozet(m, user, p) {
  const icerik = "<section class=\"card\"><h2>Rozetler ve kutlama</h2><p class=\"small muted\">Gerçek platformda 1000 rozet vardır; bu demoda " + ROZETLER.length + " tanesi gösterilir. Kazandığında havai fişek kutlaması açılır.</p>" +
    "<img class=\"anim\" src=\"/anim/rozet-havai-fisek.gif\" alt=\"Rozet havai fişek animasyonu\"></section>" +
    ROZETLER.map(function(r) { const alindi = (p.badges || []).indexOf(r.id) >= 0; return "<article class=\"card\"><img src=\"/img/" + r.ikon + "\" style=\"width:48px\" alt=\"\"><h3>" + r.ad + "</h3><p class=\"small muted\">" + r.sart + "</p><p>" + (alindi ? "✅ Kazanıldı" : "🔒 Henüz kazanılmadı") + "</p></article>"; }).join("");
  return pageModule(m, user, p, icerik);
}

function pageSoz(m, user) {
  const icerik = "<section class=\"card\"><h2>Motivasyon</h2><p class=\"small muted\">Bu demoda 6 söz vardır, her girişte değişir. Gerçek platformda 1000 söz (TR+EN) gün ve kullanıcıya göre seçilir.</p>" +
    "<img class=\"anim\" src=\"/anim/konfeti.gif\" alt=\"Konfeti\"></section>" +
    SOZLER.map(function(s) { return "<article class=\"card\"><p><strong>" + esc(s[0]) + "</strong></p><p class=\"small muted\">" + esc(s[1]) + "</p></article>"; }).join("");
  return pageModule(m, user, null, icerik);
}

const PAGE_BUILDERS = { okuma: pageOkuma, dinleme: pageDinleme, gramer: pageGramer, kelime: pageKelime, konusma: pageKonusma, yazma: pageYazma, deneme: pageDeneme, arsiv: pageArsiv, bilim: pageTaktik, taktik: pageTaktik, rozet: pageRozet, soz: pageSoz };

/* ---------- statik servis ---------- */
const MIME = { ".gif": "image/gif", ".svg": "image/svg+xml", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png" };
function serveFile(res, file) {
  try {
    const st = statSync(file);
    res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream", "Content-Length": st.size, "Cache-Control": "public, max-age=86400" });
    res.end(readFileSync(file));
    return true;
  } catch { return false; }
}

/* ---------- cevap denetimi (akıllı eşleştirme: büyük/küçük harf, boşluk, çoğul) ---------- */
function normalize(s) { return String(s).trim().toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " "); }
function checkAnswer(soru, yanit) {
  const a = normalize(soru.cevap), g = normalize(yanit);
  if (a === g) return { correct: true };
  if (soru.tip === "MCQ") {
    const idx = ["A", "B", "C", "D"].indexOf(String(yanit).trim().toUpperCase());
    if (idx >= 0 && (soru.secenekler || [])[idx] && normalize(soru.secenekler[idx]) === a) return { correct: true };
  }
  if (soru.tip === "TFNG") {
    const eq = { "true": "true", "false": "false", "not given": "not given", "ng": "not given", "doğru": "true", "yanlış": "false", "verilmemiş": "not given" };
    if (eq[g] && eq[g] === a) return { correct: true };
  }
  if (g === a + "s" || g + "s" === a) return { correct: true }; // tekil/çoğul toleransı
  return { correct: false };
}
function findQuestion(id) {
  const havuz = [].concat(OKUMA.sorular, DINLEME.sorular, [
    { id: "l1", cevap: "A", tip: "MCQ", secenekler: ["Free", "Two lira", "Ten lira", "One week"], aciklama: "Ücretsiz üyelik." },
    { id: "g1", cevap: "works", tip: "KELIME", kanit: "She works here", aciklama: "3. tekil şahıs -s." },
    { id: "g2", cevap: "have finished", tip: "KELIME", kanit: "I have finished my homework.", aciklama: "have + V3." },
    { id: "g3", cevap: "was written", tip: "MCQ", aciklama: "be + V3." },
    { id: "d1", cevap: "They delay water flow", tip: "MCQ", aciklama: "slow = geciktirmek." },
    { id: "d2", cevap: "FALSE", tip: "TFNG", kanit: "not cheap", aciklama: "Metin pahalı olabilir diyor." },
    { id: "d3", cevap: "two lira", tip: "KELIME", aciklama: "Birim tuzağı." },
  ]);
  return havuz.find(function(q) { return q.id === id; }) || null;
}

/* ---------- istek işleyici ---------- */
function send(res, code, body, type) { res.writeHead(code, { "Content-Type": type || "text/html; charset=utf-8", "Cache-Control": "no-store" }); res.end(body); }
function redirect(res, to) { res.writeHead(302, { Location: to }); res.end(); }
function readBody(req) { return new Promise(function(ok) { var d = ""; req.on("data", function(c) { d += c; if (d.length > 5e5) req.destroy(); }); req.on("end", function() { ok(d); }); }); }
function form(d) { const o = {}; for (const kv of String(d).split("&")) { const i = kv.indexOf("="); if (i > 0) o[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, " ")); } return o; }

function touchDay(p) {
  const bugun = new Date().toISOString().slice(0, 10);
  if (p.lastDay !== bugun) {
    const dun = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    p.streakDays = p.lastDay === dun ? (p.streakDays || 0) + 1 : 1;
    p.lastDay = bugun;
  }
  p.visits = (p.visits || 0) + 1;
  return p;
}
function maybeAward(p) {
  const yeni = [];
  const ver = function(id) { if ((p.badges || []).indexOf(id) < 0) { p.badges = (p.badges || []).concat([id]); yeni.push(id); } };
  if (p.visits >= 1) ver("b1");
  if (p.streakDays >= 3) ver("b3");
  if (p.streakDays >= 7) ver("b6");
  if ((p.answered.okuma || 0) >= 3) ver("b2");
  if ((p.answered.deneme || 0) >= 1) ver("b4");
  if ((p.answered.kelime || 0) >= 5) ver("b5");
  return yeni;
}

const server = createServer(async function(req, res) {
  const url = new URL(req.url, "http://localhost");
  const yol = url.pathname;
  const user = currentUser(req);
  const korumali = ["/panel"].concat(MODULES.map(function(m) { return "/bolum/" + m.slug; })).concat(["/varliklar"]);

  // statik varlıklar
  if (yol.startsWith("/anim/") || yol.startsWith("/img/")) {
    const file = join(SITE, yol.replace(/^\//, ""));
    if (serveFile(res, file)) return;
    return send(res, 404, "Varlık bulunamadı: " + esc(yol), "text/plain; charset=utf-8");
  }
  if (yol === "/stil.css") { res.writeHead(200, { "Content-Type": MIME[".css"] }); return res.end(CSS); }
  if (yol === "/istemci.js") { res.writeHead(200, { "Content-Type": MIME[".js"] }); return res.end(CLIENT_JS); }
  if (yol === "/saglik") return send(res, 200, JSON.stringify({ ok: true, kullanici: user ? user.email : null, moduller: MODULES.length }), "application/json; charset=utf-8");

  // korumalı sayfalar
  if (korumali.some(function(k) { return yol === k || yol.startsWith(k + "/"); }) && !user) {
    return redirect(res, "/giris?donus=" + encodeURIComponent(yol));
  }

  // POST
  if (req.method === "POST") {
    const govde = await readBody(req);
    if (yol === "/kayit") {
      const d = form(govde);
      const email = String(d.email || "").trim().toLowerCase();
      const sifre = String(d.sifre || "");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return send(res, 200, pageAuth("Geçerli bir e-posta yaz (örn. ad@eposta.com).", null, "kayit"));
      if (sifre.length < 8) return send(res, 200, pageAuth("Şifre en az 8 karakter olmalı.", null, "kayit"));
      const list = users();
      if (list.some(function(u) { return u.email === email; })) return send(res, 200, pageAuth("Bu e-posta ile bir hesap var. Giriş yapmayı dene.", null, "kayit"));
      const u = { id: uid(8), email: email, ad: String(d.ad || "").trim(), sifreHash: hashPassword(sifre), createdAt: Date.now() };
      list.push(u); saveUsers(list);
      const p = touchDay(progressFor(u.id));
      const yeni = maybeAward(p); saveProgress(u.id, p);
      startSession(res, u.id);
      return redirect(res, "/panel" + (yeni.length ? "?yeniRozet=" + yeni[0] : ""));
    }
    if (yol === "/giris") {
      const d = form(govde);
      const email = String(d.email || "").trim().toLowerCase();
      const u = users().find(function(x) { return x.email === email; });
      if (!u || !verifyPassword(String(d.sifre || ""), u.sifreHash)) return send(res, 200, pageAuth("E-posta veya şifre hatalı. Tekrar dene.", null, "giris"));
      const p = touchDay(progressFor(u.id)); const yeni = maybeAward(p); saveProgress(u.id, p);
      startSession(res, u.id);
      return redirect(res, (url.searchParams.get("donus") || "/panel") + (yeni.length ? "" : ""));
    }
    if (yol === "/cikis") { endSession(req, res); return redirect(res, "/"); }
    if (yol === "/api/cevap") {
      if (!user) return send(res, 401, JSON.stringify({ error: "GIRIS_GEREKLI" }), "application/json; charset=utf-8");
      let veri = {}; try { veri = JSON.parse(govde); } catch {}
      const s = findQuestion(veri.id);
      if (!s) return send(res, 404, JSON.stringify({ error: "SORU_BULUNAMADI" }), "application/json; charset=utf-8");
      const sonuc = checkAnswer(s, veri.yanit);
      const p = progressFor(user.id);
      let xp = 0;
      if (sonuc.correct) {
        p.xp = (p.xp || 0) + 10; xp = 10;
        const modul = veri.id.charAt(0) === "d" ? "deneme" : veri.id.charAt(0) === "l" ? "dinleme" : veri.id.charAt(0) === "g" ? "gramer" : "okuma";
        p.answered[modul] = (p.answered[modul] || 0) + 1;
        p.modules[modul] = (p.modules[modul] || 0) + 1;
      }
      const yeni = maybeAward(p); saveProgress(user.id, p);
      return send(res, 200, JSON.stringify({ correct: sonuc.correct, xp: xp, kanit: sonuc.correct ? s.kanit : null, aciklama: sonuc.correct ? s.aciklama : null, ipucu: sonuc.correct ? null : "Kanıt cümlesini metinden bul ve tekrar oku.", yeniRozetler: yeni }), "application/json; charset=utf-8");
    }
    return send(res, 404, "Bulunamadı", "text/plain; charset=utf-8");
  }

  // GET sayfalar
  if (yol === "/") return send(res, 200, pageHome(user));
  if (yol === "/giris") return send(res, 200, pageAuth(url.searchParams.get("hata"), null, "giris"));
  if (yol === "/kayit") return send(res, 200, pageAuth(null, null, "kayit"));
  if (yol === "/panel") { const p = progressFor(user.id); return send(res, 200, pagePanel(user, p)); }
  if (yol === "/varliklar") {
    const animler = existsSync(join(SITE, "anim")) ? readdirSync(join(SITE, "anim")) : [];
    const ikonlar = existsSync(join(SITE, "img")) ? readdirSync(join(SITE, "img")) : [];
    const html = layout(user, "Varlık durumu",
      "<h1>Varlık durumu</h1><p class=\"small muted\">Animasyonlar ve simgeler yerel dosyalardan gelir; dış bağlantı yoktur.</p>" +
      "<section class=\"card\"><h2>Animasyonlar (" + animler.length + ")</h2><div class=\"grid\">" + animler.map(function(f) { return "<figure style=\"margin:0\"><img class=\"anim\" src=\"/anim/" + f + "\" alt=\"\"><figcaption class=\"small muted\">" + f + "</figcaption></figure>"; }).join("") + "</div></section>" +
      "<section class=\"card\"><h2>Simgeler (" + ikonlar.length + ")</h2><div class=\"row\">" + ikonlar.map(function(f) { return "<img src=\"/img/" + f + "\" width=\"48\" height=\"48\" alt=\"\" title=\"" + f + "\">"; }).join("") + "</div></section>");
    return send(res, 200, html);
  }
  if (yol.startsWith("/bolum/")) {
    const slug = yol.split("/")[2];
    const m = MODULES.find(function(x) { return x.slug === slug; });
    if (!m) return send(res, 404, layout(user, "Bulunamadı", "<h1>Bölüm bulunamadı</h1><p><a href=\"/panel\">Panele dön</a></p>"));
    const p = progressFor(user.id);
    const builder = PAGE_BUILDERS[slug] || pageTaktik;
    return send(res, 200, builder(m, user, p));
  }
  return send(res, 404, layout(user, "Bulunamadı", "<h1>Sayfa bulunamadı</h1><p><a href=\"/\">Ana sayfa</a></p>"));
});

/* ---------- varlıklar yoksa otomatik üret ---------- */
import { spawnSync } from "node:child_process";
const eksik = !existsSync(join(SITE, "anim", "rozet-havai-fisek.gif"));
if (eksik) {
  const arac = join(dirname(ROOT), "..", "TEK-YAMA.mjs");
  const yerelArac = existsSync(arac) ? arac : join(ROOT, "TEK-YAMA.mjs");
  if (existsSync(yerelArac)) { console.log("Varlıklar üretiliyor..."); spawnSync(process.execPath, [yerelArac, "--assets", SITE], { stdio: "inherit" }); }
  else console.log("UYARI: anim/img klasörleri boş. TEK-YAMA.mjs ile varlıkları üretmek için: node TEK-YAMA.mjs --assets data/site");
}

server.listen(PORT, "0.0.0.0", function() {
  console.log("");
  console.log("  🎓 IELTS AKADEMİ — çalışan demo site");
  console.log("  ➜  http://localhost:" + PORT);
  console.log("  ➜  İlk iş: /kayit → e-posta + şifre (en az 8 karakter) ile hesap oluştur.");
  console.log("  ➜  Sonra /bolum/okuma ve /bolum/dinleme bölümlerini dene.");
  console.log("  ➜  Varlık kontrolü: /varliklar");
  console.log("");
});

export { server, checkAnswer, findQuestion, normalize };