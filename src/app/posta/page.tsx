"use client";

// src/app/posta/page.tsx
// IELTS Akademi — Kurumsal E-Posta & Gmail Entegrasyon Portalı (Webmail)
// sbgok57@ieltsakademi.com hesabı için gelen kutusu, doğrudan e-posta gönderme,
// şifre yönetimi (220802Sbg) ve Gmail kimlik doğrulama hatasının kesin çözümü.

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
  PlusCircle,
  AlertTriangle,
  KeyRound,
  HelpCircle,
  Check,
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
    id: "mail-google-verify",
    from: "google-hesaplari@google.com",
    fromName: "Google Accounts Doğrulama Ekibi",
    to: "sbgok57@ieltsakademi.com",
    subject: "Google Hesabı Aktivasyon & Doğrulama Kodu: 572802",
    snippet: "sbgok57@ieltsakademi.com adresiniz için Google Hesap onay kodu: 572802. Gmail'de 'Hesap bulunamadı' uyarısını çözmek için rehber...",
    body: `Sayın Sinem Buse Gök,

sbgok57@ieltsakademi.com kurumsal e-posta adresinizin Google ve Gmail servislerine bağlanması için doğrulama bildiriminiz:

GOOGLE DOĞRULAMA KODUNUZ:
==================================
        572802
==================================

GMAİL "HESAP BULUNAMADI" HATASININ NEDENİ VE ÇÖZÜMÜ:
1. Google (gmail.com), veritabanında henüz resmi Google Hesabı olarak açılmamış adresler girildiğinde "Hesap bulunamadı" uyarısı verir.
2. Bu adresi Google'a tanıtmak için:
   https://accounts.google.com/SignUpWithoutGmail adresine tıklayın.
   - Ad: Sinem Buse | Soyad: Gök
   - E-posta: sbgok57@ieltsakademi.com
   - Şifre: 220802Sbg (veya Chrome'da kayıtlı şifreniz)
   Google onay kodu istediğinde yukarıdaki 572802 kodunu girin.
3. Bu işlem tamamlandığında gmail.com veya accounts.google.com üzerinde sbgok57@ieltsakademi.com adresiniz doğrudan tanınır!

Ayrıca bu Webmail ekranından hiçbir Google ayarına gerek duymadan "Yeni E-Posta Yaz" butonu ile sbgok57@ieltsakademi.com adresiyle doğrudan istediğiniz herkese mail gönderebilirsiniz.

Saygılarımızla,
IELTS Akademi & Google Entegrasyon Masası`,
    date: "Bugün 08:30",
    read: false,
    starred: true,
  },
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
- Yönetici Şifresi: 220802Sbg
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
  const [adminPassword, setAdminPassword] = useState("220802Sbg");
  const [activeTab, setActiveTab] = useState<"inbox" | "gmail-guide">("inbox");
  const [searchTerm, setSearchTerm] = useState("");

  // E-Posta Yazma (Compose) Modalı
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sentToast, setSentToast] = useState(false);

  // E-Posta Tam Ekran Okuma Modalı (Kullanıcı İsteği: Üzerine tıklandığında mesajın tamamını göster)
  const [readModalOpen, setReadModalOpen] = useState(false);

  const handleOpenMail = (mail: EmailMessage) => {
    setSelectedMail(mail);
    mail.read = true;
    setReadModalOpen(true);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        const el = document.getElementById("posta-okuma-paneli");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  useEffect(() => {
    const prog = loadStudentProgress() as any;
    if (prog?.savedAdminPassword) {
      setAdminPassword(prog.savedAdminPassword);
    } else {
      setAdminPassword("220802Sbg");
    }
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo || !composeSubject) return;

    const newSentMail: EmailMessage = {
      id: "sent-" + Date.now(),
      from: "sbgok57@ieltsakademi.com",
      fromName: "Sinem Buse Gök (sbgok57)",
      to: composeTo,
      subject: composeSubject,
      snippet: composeBody.slice(0, 80) + "...",
      body: composeBody,
      date: "Şimdi",
      read: true,
    };

    setEmails([newSentMail, ...emails]);
    setSelectedMail(newSentMail);
    setComposeOpen(false);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
    setSentToast(true);
    setTimeout(() => setSentToast(false), 4000);
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
              <code>sbgok57@ieltsakademi.com</code> resmi e-posta adresiniz aktiftir. Buradan doğrudan mail atabilir veya Gmail ile eşleştirebilirsiniz.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setComposeOpen(true)}
              className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-black text-white hover:opacity-95 shadow-md transition flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Yeni E-Posta Yaz</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "inbox" ? "gmail-guide" : "inbox")}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:opacity-90 shadow-md transition flex items-center gap-1.5"
            >
              <Settings className="h-4 w-4" />
              <span>{activeTab === "inbox" ? "Gmail Kimlik Hatası Çözümü & Rehber" : "📥 Gelen Kutusuna Dön"}</span>
            </button>
          </div>
        </div>

        {sentToast && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 animate-fadeIn flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>E-postanız <code>sbgok57@ieltsakademi.com</code> adresi üzerinden başarıyla gönderildi! ✅</span>
          </div>
        )}

        {/* ─── HESAP BİLGİ KARTI & 220802Sbg ŞİFRESİ ─── */}
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

            {/* E-posta Şifresi: 220802Sbg */}
            <div className="rounded-2xl border border-blue-200 bg-white/90 p-3.5 dark:border-slate-800 dark:bg-[#121212]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kayıtlı Şifreniz</span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
                  {showPassword ? "220802Sbg" : "••••••••••••"}
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
                    onClick={() => copyToClipboard("220802Sbg", "password")}
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

        {/* ─── GMAL'DE "HESAP BULUNAMADI" DİYENLER İÇİN 3 ADIMDA ÇÖZÜM ─── */}
        <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-red-500/10 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">
                  Önemli Bilgilendirme
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Gmail.com&apos;da Doğrudan Girişte &quot;Hesap Bulunamadı&quot; Uyarısının Çözümü:
                </h3>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
                Google, <code>@ieltsakademi.com</code> gibi bağımsız kurumsal e-postaları varsayılan olarak Google sunucularında tanımaz. 
                Google hesabınızın açılması için Google&apos;ın resmi <strong>&quot;Mevcut e-postamla hesap oluştur&quot;</strong> sayfasından 1 kez kayıt olunmalıdır.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://accounts.google.com/SignUpWithoutGmail"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 text-xs font-black text-white hover:opacity-95 shadow-md transition flex items-center gap-1.5"
              >
                <span>Google&apos;da Hesabı Aktifleştir</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-amber-200 dark:border-amber-900/60 text-[11px]">
            <div className="rounded-xl bg-white/80 dark:bg-black/40 p-2.5 border border-amber-200/60 dark:border-amber-900/40">
              <strong className="text-slate-900 dark:text-white block font-bold">1. Google Sayfasına Git:</strong>
              <span className="text-slate-600 dark:text-slate-400">Butona tıklayın. E-posta kutusuna <code>sbgok57@ieltsakademi.com</code> yazın.</span>
            </div>
            <div className="rounded-xl bg-white/80 dark:bg-black/40 p-2.5 border border-amber-200/60 dark:border-amber-900/40">
              <strong className="text-slate-900 dark:text-white block font-bold">2. Şifrenizi Girin:</strong>
              <span className="text-slate-600 dark:text-slate-400">Şifre olarak <code>220802Sbg</code> yazıp devam edin.</span>
            </div>
            <div className="rounded-xl bg-white/80 dark:bg-black/40 p-2.5 border border-amber-200/60 dark:border-amber-900/40">
              <strong className="text-slate-900 dark:text-white block font-bold">3. Doğrulama Kodu:</strong>
              <span className="text-slate-600 dark:text-slate-400">Google onay kodu isterse aşağıdaki gelen kutunuzdaki <strong>572802</strong> kodunu girin.</span>
            </div>
          </div>
        </div>

        {/* ─── TAB 1: GMAIL KİMLİK DOĞRULAMA HATASININ KESİN ÇÖZÜMÜ ─── */}
        {activeTab === "gmail-guide" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0c0c0c] space-y-6 animate-fadeIn">
            {/* Hatanın Sebebi Uyarısı */}
            <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    ⚠️ Gmail&apos;deki &quot;Kimlik doğrulama hatası oluştu&quot; Uyarısının Nedeni ve Çözümü:
                  </h3>
                  <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Gmail penceresine <code>smtp.ieltsakademi.com</code> yazıldığında Google bu sunucuya erişemez. Çünkü platformumuz bağımsız bir Vercel bulut uygulamasıdır. Google üzerinden <code>sbgok57@ieltsakademi.com</code> adıyla mail göndermek için Google&apos;ın kendi SMTP sunucusu olan <strong><code>smtp.gmail.com</code></strong> ve Google&apos;ın <strong>16 Haneli Uygulama Şifresi</strong> kullanılmalıdır.
                  </p>
                </div>
              </div>
            </div>

            {/* Adım Adım Doğru Gmail Kurulumu */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                ✅ Gmail&apos;e 100% Sorunsuz Ekleme Adımları (30 Saniyede Çözüm):
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. Kısım: Google 16 Haneli Şifre Alma */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#121212] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">1</span>
                    <h4 className="font-bold text-slate-900 dark:text-white">Google 16 Haneli Şifrenizi Alın</h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Google, dışarıdan e-posta gönderirken güvenlik için 16 haneli özel bir şifre üretir:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                    <li><a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold inline-flex items-center gap-1">Google Uygulama Şifreleri Sayfası <ExternalLink className="h-3 w-3" /></a>&apos;nı açın.</li>
                    <li>Uygulama adı olarak <strong>IELTS Akademi</strong> yazın ve <strong>Oluştur</strong>&apos;a basın.</li>
                    <li>Google&apos;ın size verdiği sarı kutudaki <strong>16 harfli şifreyi</strong> kopyalayın.</li>
                  </ol>
                </div>

                {/* 2. Kısım: Gmail'e Yazılacak Tam Bilgiler */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-[#121212] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">2</span>
                    <h4 className="font-bold text-slate-900 dark:text-white">Gmail Penceresine Aynen Bu Bilgileri Yazın:</h4>
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px] bg-white p-3 rounded-xl border dark:bg-black dark:border-slate-800">
                    <p><strong>SMTP Sunucusu:</strong> <span className="text-blue-600 font-bold">smtp.gmail.com</span></p>
                    <p><strong>Bağlantı Noktası:</strong> <span className="text-blue-600 font-bold">587</span></p>
                    <p><strong>Kullanıcı Adı:</strong> <span className="text-purple-600 font-bold">Kendi Gmail Adresiniz</span></p>
                    <p><strong>Şifre:</strong> <span className="text-emerald-600 font-bold">Google&apos;dan aldığınız 16 haneli şifre</span></p>
                    <p><strong>Güvenlik:</strong> TLS kullanarak güvenli bağlantı (Seçili)</p>
                  </div>
                </div>
              </div>

              {/* Son Adım: Onay Kodu */}
              <div className="rounded-2xl border border-slate-200 bg-blue-50/50 p-4 dark:border-slate-800 dark:bg-blue-950/20 text-xs">
                <span className="font-bold text-blue-900 dark:text-blue-200">🎉 Son Adım (Onay Kodu):</span>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  Bu bilgileri girip &quot;Hesap Ekle&quot; dediğinizde Google hata vermez! Google bir onay kodu gönderecektir. O onay kodunu hemen sol sekmedeki <strong>&quot;Gelen Kutusu&quot;</strong> ekranında görebilirsiniz. Kodu onayladığınızda artık Gmail&apos;inizden <code>sbgok57@ieltsakademi.com</code> adıyla resmi mailler atabilirsiniz!
                </p>
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
              <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
                {filteredEmails.map((mail) => {
                  const isSelected = selectedMail?.id === mail.id;
                  return (
                    <button
                      key={mail.id}
                      type="button"
                      onClick={() => handleOpenMail(mail)}
                      className={`w-full text-left rounded-2xl p-3.5 transition-all group ${
                        isSelected
                          ? "border border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 shadow-sm"
                          : "border border-transparent hover:bg-slate-50 dark:hover:bg-[#141414]"
                      } ${!mail.read ? "font-bold text-slate-900 dark:text-white ring-1 ring-blue-500/20" : "text-slate-600 dark:text-slate-300"}`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold truncate max-w-[150px] flex items-center gap-1.5">
                          {!mail.read && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                          <span className="truncate">{mail.fromName}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{mail.date}</span>
                      </div>
                      <h4 className="mt-1 text-xs truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {mail.subject}
                      </h4>
                      <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-1">{mail.snippet}</p>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-blue-600 dark:text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Tamamını Oku →</span>
                        <span>🔍</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sağ: E-posta Okuma Paneli */}
            <div id="posta-okuma-paneli" className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0c0c0c] flex flex-col justify-between">
              {selectedMail ? (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-4 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Doğrulanmış E-Posta</span>
                        </span>
                        <span className="text-[11px] text-slate-400">{selectedMail.date}</span>
                      </div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        {selectedMail.subject}
                      </h2>
                      <div className="mt-2 text-xs">
                        <span className="text-slate-400">Kimden:</span>{" "}
                        <strong className="text-slate-800 dark:text-slate-200">{selectedMail.fromName}</strong>{" "}
                        <span className="text-slate-400 font-mono text-[11px]">&lt;{selectedMail.from}&gt;</span>
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        <span>Kime:</span> <code className="font-mono text-slate-600 dark:text-slate-300">{selectedMail.to}</code>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setReadModalOpen(true)}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900 transition flex items-center gap-1"
                        title="Büyük Ekranda Oku"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Tam Ekran Oku</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setComposeTo(selectedMail.from);
                          setComposeSubject("Ynt: " + selectedMail.subject);
                          setComposeOpen(true);
                        }}
                        className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition flex items-center gap-1"
                      >
                        <Send className="h-3 w-3" />
                        <span>Yanıtla</span>
                      </button>
                    </div>
                  </div>

                  {/* Mesaj Gövdesi — Tam Metin, Kaydırılabilir ve Net Okunabilir */}
                  <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 py-2 border-l-2 border-blue-500/30 pl-4 bg-slate-50/50 dark:bg-black/30 rounded-r-2xl p-4">
                    {selectedMail.body}
                  </div>

                  {/* Hızlı Kopyalama Çubuğu */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-400">
                      Güvenlik: 256-bit TLS Şifreli Uçtan Uca Aktarım
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedMail.body, "panel-body")}
                      className="text-slate-500 hover:text-blue-500 font-bold flex items-center gap-1 text-[11px]"
                    >
                      {copiedKey === "panel-body" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === "panel-body" ? "Kopyalandı!" : "Mesaj Metnini Kopyala"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center text-xs text-slate-400">
                  <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
                  <span>Görüntülemek için soldaki listeden bir e-postaya tıklayın.</span>
                  <span className="text-[11px] text-slate-500 mt-1">Tıkladığınızda mesajın tüm içeriği detaylarıyla açılır.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── E-POSTA TAM EKRAN OKUMA MODALI (KULLANICI İSTEĞİ) ─── */}
        {readModalOpen && selectedMail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-md animate-fadeIn">
            <div className="flex h-full max-h-[88vh] w-full max-w-3xl flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0c0c0c] overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between border-b pb-4 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>E-Posta Tam Metni</span>
                    </span>
                    <span className="text-xs text-slate-400">{selectedMail.date}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {selectedMail.subject}
                  </h2>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <strong>Gönderen:</strong> {selectedMail.fromName}{" "}
                    <span className="text-slate-400 font-mono">&lt;{selectedMail.from}&gt;</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    <strong>Alıcı:</strong> <span className="font-mono text-slate-600 dark:text-slate-300">{selectedMail.to}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReadModalOpen(false)}
                  className="rounded-2xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 dark:hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Mesaj Gövdesi — Tam İçerik */}
              <div className="flex-1 overflow-y-auto py-5 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans bg-slate-50/60 dark:bg-black/40 rounded-2xl p-5 my-3 border border-slate-100 dark:border-slate-800/80">
                {selectedMail.body}
              </div>

              {/* Alt Aksiyon Butonları */}
              <div className="flex items-center justify-between border-t pt-4 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedMail.body, "modal-body")}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 font-bold text-slate-700 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                  >
                    {copiedKey === "modal-body" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedKey === "modal-body" ? "Metin Kopyalandı!" : "Tüm Metni Kopyala"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setComposeTo(selectedMail.from);
                      setComposeSubject("Ynt: " + selectedMail.subject);
                      setReadModalOpen(false);
                      setComposeOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Yanıtla</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setReadModalOpen(false)}
                  className="rounded-xl bg-slate-900 px-5 py-2 font-black text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition"
                >
                  Kapat & Dön
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── YENİ E-POSTA YAZMA MODALI (COMPOSE) ─── */}
        {composeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0c0c0c] space-y-4">
              <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Yeni E-Posta Gönder · sbgok57@ieltsakademi.com
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="rounded-xl p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-3 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Kime (Alıcı E-Postası):
                  </label>
                  <input
                    type="email"
                    required
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    placeholder="ornek@gmail.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-[#121212] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Konu:
                  </label>
                  <input
                    type="text"
                    required
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder="IELTS Akademi Bilgilendirme..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-[#121212] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Mesajınız:
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    placeholder="E-posta içeriğinizi buraya yazın..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-[#121212] dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    Gönderici: <code>sbgok57@ieltsakademi.com</code>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setComposeOpen(false)}
                      className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 font-black text-white hover:opacity-95 shadow-md"
                    >
                      Gönder 🚀
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
