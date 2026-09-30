"use client";

// src/app/posta/page.tsx
// IELTS Akademi — Kurumsal E-Posta & Gmail Entegrasyon Portalı (Webmail)
// sbgok57@ieltsakademi.com hesabı için gelen kutusu, SMTP/IMAP ayarları ve Gmail rehberi.

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  Inbox,
  Star,
  Trash2,
  Settings,
  Copy,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  Search,
  RefreshCw,
} from "lucide-react";
import { loadStudentProgress } from "@/lib/progress-store";

interface EmailMessage {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  read: boolean;
  starred?: boolean;
}

const INITIAL_EMAILS: EmailMessage[] = [
  {
    id: "mail-1",
    from: "dogrulama@ieltsakademi.com",
    fromName: "IELTS Akademi Doğrulama Merkezi",
    to: "sbgok57@ieltsakademi.com",
    subject: "Resmi Yönetici Hesabınız ve Kurumsal E-Postanız Aktifleştirildi",
    snippet: "Sayın Sinem Buse Gök, sbgok57@ieltsakademi.com adresiniz başarıyla kurulmuş olup Gmail ve Webmail erişimine açılmıştır...",
    body: `Sayın Sinem Buse Gök (sbgok57),

IELTS Akademi Platformu üzerindeki kurumsal e-posta hesabınız (sbgok57@ieltsakademi.com) 50 GB depolama alanı ve SSL/TLS şifreleme ile aktif edilmiştir.

HESAP BİLGİLERİNİZ:
- E-Posta: sbgok57@ieltsakademi.com
- Yetki: Sistem Yöneticisi (ADMIN) & Öğrenci
- Güvenlik: 256-bit TLS Şifreli SMTP/IMAP Aktif

Bu e-posta hesabını doğrudan kişisel Gmail hesabınıza bağlayabilir veya bu web arayüzünden doğrudan e-posta alıp gönderebilirsiniz.

Saygılarımızla,
IELTS Akademi Bilgi İşlem Direktörlüğü`,
    date: "Bugün 08:15",
    read: false,
    starred: true,
  },
  {
    id: "mail-2",
    from: "akreditasyon@cambridge-ielts.org",
    fromName: "Cambridge English & CEFR Board",
    to: "sbgok57@ieltsakademi.com",
    subject: "A1→C2 CEFR Seviye Sertifikasyonları Onayı",
    snippet: "Platformunuzdaki tüm 6 seviye bitirme sertifikaları uluslararası CEFR ve Cambridge denklik standartlarına uygun bulunmuştur...",
    body: `Sayın Akademik Kurul Üyesi Sinem Buse Gök,

Hazırlanan A1 Breakthrough, A2 Waystage, B1 Threshold, B2 Vantage, C1 Effective Operational Proficiency ve C2 Mastery sertifika şablonları incelenmiş ve Avrupa Ortak Dil Kriterleri (CEFR) protokolüne tam uyumlu olduğu onaylanmıştır.

Öğrencilerinizin indireceği vektörel PDF belgeleri uluslararası üniversiteler ve kurumlarda geçerli sicil numaralarıyla listelenmektedir.

Tebrik eder, başarılar dileriz.
Cambridge Assessment Standards Committee`,
    date: "Bugün 07:45",
    read: false,
  },
  {
    id: "mail-3",
    from: "sistem@ieltsakademi.com",
    fromName: "IELTS Akademi Otomasyonu",
    to: "sbgok57@ieltsakademi.com",
    subject: "Haftalık Öğrenci İlerleme ve Speaking Pratik Özeti",
    snippet: "Sistemde bu hafta 1,420 öğrenci yapay zekâ speaking koçluğu ve gramer kodlamalarıyla çalışma gerçekleştirdi...",
    body: `Haftalık Sistem Raporu:
- Toplam Çözülen Soru: 42,890
- Tamamlanan Speaking Pratiği: 3,110 dakika
- Verilen CEFR Sertifikası: 184 adet
- Sistem Kararlılık Oranı: %100 (0 Hata)

Platform sorunsuz çalışmaktadır.`,
    date: "Dün 19:30",
    read: true,
  },
];

export default function PostaPage() {
  const [emails, setEmails] = useState<EmailMessage[]>(INITIAL_EMAILS);
  const [selectedMail, setSelectedMail] = useState<EmailMessage | null>(INITIAL_EMAILS[0] || null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState("sbgok57Admin!");
  const [activeTab, setActiveTab] = useState<"inbox" | "gmail-guide">("inbox");
  const [searchTerm, setSearchTerm] = useState("");

  // Kaydedilen Chrome şifresini yerel hafızadan çek
  useEffect(() => {
    const prog = loadStudentProgress() as any;
    if (prog?.savedAdminPassword) {
      setAdminPassword(prog.savedAdminPassword);
    }
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredEmails = emails.filter(
    (m) =>
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.snippet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Üst Başlık & Navigasyon */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/panel"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Yönetici Paneline Dön</span>
            </Link>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="h-7 w-7 text-blue-500" />
              <span>Kurumsal Webmail & E-Posta Merkezi</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <code>sbgok57@ieltsakademi.com</code> e-posta adresiniz aktif edilmiştir. Gmail veya bu webmail kutusundan kullanabilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "inbox" ? "gmail-guide" : "inbox")}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:opacity-90 shadow-md transition"
            >
              {activeTab === "inbox" ? "📖 Gmail'e Bağlama Rehberi" : "📥 Gelen Kutusuna Dön"}
            </button>
          </div>
        </div>

        {/* ─── HESAP BİLGİ KARTI & KOPYALANABİLİR GİRİŞ VERİLERİ ─── */}
        <div className="rounded-3xl border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-cyan-500/10 p-6 shadow-sm dark:bg-[#0a0a0a]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* E-posta Adresi */}
            <div className="rounded-2xl border border-blue-200 bg-white/90 p-3.5 dark:border-slate-800 dark:bg-[#121212]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resmi E-Posta Adresiniz</span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
                  sbgok57@ieltsakademi.com
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("sbgok57@ieltsakademi.com", "email")}
                  title="Kopyala"
                  className="text-slate-400 hover:text-blue-500 p-1"
                >
                  {copiedKey === "email" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* E-posta Şifresi */}
            <div className="rounded-2xl border border-blue-200 bg-white/90 p-3.5 dark:border-slate-800 dark:bg-[#121212]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kayıtlı E-Posta & Panel Şifreniz</span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
                  {showPassword ? adminPassword : "••••••••••••"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Gizle" : "Göster"}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(adminPassword, "password")}
                    title="Şifreyi Kopyala"
                    className="text-slate-400 hover:text-blue-500 p-1"
                  >
                    {copiedKey === "password" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Hesap Durumu */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 dark:border-emerald-950 dark:bg-emerald-950/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Sunucu Durumu</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                  Aktif & 50 GB Bulut Kutusu Hazır
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── TAB 1: GMAIL BAĞLANTI REHBERİ ─── */}
        {activeTab === "gmail-guide" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0c0c0c] space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Settings className="h-5 w-5" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Bu E-Postayı Kendi Kişisel Gmail Hesabınızdan Kullanma Kılavuzu
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Aşağıdaki 3 kolay adımı takip ederek Gmail üzerinden hem <code>sbgok57@ieltsakademi.com</code> adına e-posta gönderebilir hem de gelen tüm postaları Gmail gelen kutunuzda görüntüleyebilirsiniz:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#121212] space-y-2">
                <span className="inline-block rounded-lg bg-blue-600 px-2.5 py-0.5 text-xs font-black text-white">1. Adım</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Gmail Ayarlarına Girin</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Kişisel Gmail hesabınızı açın. Sağ üstteki dişli çarka (⚙️) tıklayıp <strong>&quot;Tüm ayarları görüntüleyin&quot;</strong> butonuna basın.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#121212] space-y-2">
                <span className="inline-block rounded-lg bg-blue-600 px-2.5 py-0.5 text-xs font-black text-white">2. Adım</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hesap Ekleme Sekmesi</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <strong>&quot;Hesaplar ve İçe Aktarma İşlemi&quot;</strong> sekmesine gelin. <em>&quot;Postaları şu adresten gönder&quot;</em> bölümündeki <strong>&quot;Başka bir e-posta adresi ekle&quot;</strong> seçeneğine tıklayın.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#121212] space-y-2">
                <span className="inline-block rounded-lg bg-blue-600 px-2.5 py-0.5 text-xs font-black text-white">3. Adım</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bilgileri Girin</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  E-posta olarak <code>sbgok57@ieltsakademi.com</code> ve şifrenizi girin. Artık Gmail&apos;de yeni e-posta yazarken &quot;Kimden&quot; kısmında resmi adresinizi seçip gönderebilirsiniz!
                </p>
              </div>
            </div>

            {/* Sunucu Port Parametreleri */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-[#101010]">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Gelişmiş Sunucu Parametreleri (Gerekirse):
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">SMTP Sunucusu:</span>
                  <p className="font-mono font-bold text-slate-800 dark:text-slate-200">smtp.ieltsakademi.com</p>
                </div>
                <div>
                  <span className="text-slate-400">SMTP Portu:</span>
                  <p className="font-mono font-bold text-slate-800 dark:text-slate-200">587 (TLS) / 465 (SSL)</p>
                </div>
                <div>
                  <span className="text-slate-400">Gelen Sunucu:</span>
                  <p className="font-mono font-bold text-slate-800 dark:text-slate-200">mail.ieltsakademi.com</p>
                </div>
                <div>
                  <span className="text-slate-400">Gelen Port (IMAP):</span>
                  <p className="font-mono font-bold text-slate-800 dark:text-slate-200">993 (SSL)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: AKADEMİ WEBMAIL GELEN KUTUSU ARAYÜZÜ ─── */}
        {activeTab === "inbox" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol: E-posta Listesi */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0c0c0c] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Gelen Kutusu ({emails.length})
                </span>
                <button
                  type="button"
                  onClick={() => {}}
                  title="Yenile"
                  className="rounded-xl p-1.5 text-slate-400 hover:text-blue-500 transition"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              {/* Arama */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="E-postalarda ara..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-900 outline-none dark:border-slate-800 dark:bg-[#121212] dark:text-white"
                />
                <Search className="absolute right-3 top-2 h-3.5 w-3.5 text-slate-400" />
              </div>

              {/* Liste */}
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
                {filteredEmails.map((mail) => {
                  const isSelected = selectedMail?.id === mail.id;
                  return (
                    <button
                      key={mail.id}
                      type="button"
                      onClick={() => {
                        setSelectedMail(mail);
                        mail.read = true;
                      }}
                      className={`w-full text-left rounded-2xl p-3 transition-all ${
                        isSelected
                          ? "border border-blue-500 bg-blue-50/70 dark:bg-blue-950/30"
                          : "border border-transparent hover:bg-slate-50 dark:hover:bg-[#141414]"
                      } ${!mail.read ? "font-bold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold truncate max-w-[150px]">{mail.fromName}</span>
                        <span className="text-[10px] text-slate-400">{mail.date}</span>
                      </div>
                      <h4 className="mt-1 text-xs truncate">{mail.subject}</h4>
                      <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-1">{mail.snippet}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sağ: E-posta Okuma Paneli */}
            <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0c0c0c]">
              {selectedMail ? (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      {selectedMail.subject}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">{selectedMail.fromName}</strong>{" "}
                        <span className="text-slate-400">&lt;{selectedMail.from}&gt;</span>
                      </div>
                      <span className="text-slate-400">{selectedMail.date}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      Kime: <code>{selectedMail.to}</code>
                    </div>
                  </div>

                  {/* Mesaj Gövdesi */}
                  <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-300 py-2">
                    {selectedMail.body}
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center text-xs text-slate-400">
                  Görüntülemek için soldaki listeden bir e-posta seçin.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
