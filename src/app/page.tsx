import Link from "next/link";
import ModuleGrid from "@/components/ModuleGrid";
import LumiBubble from "@/components/LumiBubble";
import QuickAuthPanel from "@/components/QuickAuthPanel";
import {
  Sparkles,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Award,
  Globe2,
  CheckCircle2,
  Layers,
  Zap,
  TrendingUp,
  Brain,
  HelpCircle,
  Flame,
} from "lucide-react";

export default function Home() {
  // Tanıtım sayaçları (Kullanıcıya henüz giriş yapmadan platformun kapasitesini dürüstçe tanıtır)
  const platformStats = [
    {
      label: "Eğitim Laboratuvarı",
      value: "12 Modül",
      desc: "Dinleme, Okuma, Yazma, Konuşma, Gramer ve Sınavlar",
      color: "from-rose-500 to-amber-500",
      icon: Layers,
    },
    {
      label: "Küresel İnsan Sesi",
      value: "6 Doğal Aksan",
      desc: "İngiliz, Amerikan, Avustralya, Kanada ve İrlanda sesleri",
      color: "from-amber-500 to-emerald-500",
      icon: Globe2,
    },
    {
      label: "Başarı & Rozet Havuzu",
      value: "1,000+ Rozet",
      desc: "Her görev, seri ve doğru cevapta açılan dinamik rozetler",
      color: "from-emerald-500 to-cyan-500",
      icon: Award,
    },
    {
      label: "Akademik Hedef",
      value: "Band 8.5+",
      desc: "A1 başlangıçtan C2 ileri seviyeye tam CEFR uyumu",
      color: "from-cyan-500 to-indigo-600",
      icon: TrendingUp,
    },
  ];

  // 4 Temel IELTS Becerisi
  const coreSkills = [
    {
      title: "IELTS Listening Lab",
      subtitle: "Kulak Eşiğini Geliştir",
      desc: "Sınavda karşılaşacağın farklı İngiliz, Avustralya ve Amerikan aksanlarını gerçek seslerle dinle, boşluk doldurma ve çoktan seçmeli taktikleri öğren.",
      color: "from-rose-500 to-orange-500",
      border: "hover:border-rose-400",
      icon: Headphones,
      href: "/bolum/dinleme",
      tag: "6 Doğal Aksan",
    },
    {
      title: "IELTS Reading Lab",
      subtitle: "Hızlı Tarama & Zaman Yönetimi",
      desc: "True/False/Not Given, Heading Matching ve akademik makale çözüm teknikleriyle 60 dakikalık süreyi saniyelerine kadar verimli kullan.",
      color: "from-amber-500 to-emerald-500",
      border: "hover:border-amber-400",
      icon: BookOpen,
      href: "/bolum/okuma",
      tag: "Akademik & Genel",
    },
    {
      title: "IELTS Writing Lab",
      subtitle: "Task 1 & Task 2 Şablonları",
      desc: "Grafik yorumlama, akademik argüman yapılandırma, bağlaçlar ve bant yükseltici kelime yapılarıyla hatasız essay kurgula.",
      color: "from-cyan-500 to-blue-600",
      border: "hover:border-cyan-400",
      icon: PenTool,
      href: "/bolum/yazma",
      tag: "Band 7+ Kalıpları",
    },
    {
      title: "IELTS Speaking Coach",
      subtitle: "Lumi AI ile Canlı Telaffuz",
      desc: "Part 1, 2 ve 3 sorularını seslendir; yapay zekâ koçun Lumi akıcılık, kelime çeşitliliği ve telaffuz hatalarını anında analiz etsin.",
      color: "from-violet-500 to-pink-500",
      border: "hover:border-violet-400",
      icon: Mic,
      href: "/bolum/konusma",
      tag: "Anında Geri Bildirim",
    },
  ];

  // Neden IELTS Akademi?
  const whyUs = [
    {
      title: "Korkutmayan, Kıyaslamayan Mimarî",
      desc: "Hatalar cezalandırılmaz; öğrenmenin en kıymetli basamağı olarak incelenir ve kişiselleştirilmiş alıştırmalara dönüştürülür.",
      icon: Brain,
      badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
    },
    {
      title: "Aralıklı Tekrar (SRS) Sistemi",
      desc: "Unutma eğrisini kıran bilimsel hafıza algoritması sayesinde öğrendiğin kritik akademik kelimeler kalıcı belleğe geçer.",
      icon: Zap,
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    },
    {
      title: "1,000+ Dinamik Rozet Sistemi",
      desc: "Her gün çalıştıkça seri alevin parlar, XP kazandıkça ve seviye atladıkça yeni rozetlerin kilidi tek tek açılır.",
      icon: Flame,
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    },
    {
      title: "Cambridge & British Council Standardı",
      desc: "Gerçek sınav formatına, soru tiplerine ve değerlendirme kriterlerine (Band Descriptors) %100 birebir uyumlu içerikler.",
      icon: CheckCircle2,
      badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
    },
  ];

  // Sıkça Sorulan Sorular
  const faqs = [
    {
      q: "IELTS Akademi Platformu kimler için uygundur?",
      a: "Sıfırdan İngilizce öğrenmek isteyen A1 seviyesindeki öğrencilerden, yurt dışı üniversite veya göçmenlik için Band 7.0 - 8.5 hedefleyen ileri düzey adaylara kadar herkese uygundur.",
    },
    {
      q: "Rozetler ve ilerlemem nasıl kaydedilir?",
      a: "Hesabınıza giriş yaptığınız andan itibaren tamamladığınız her modül, çözdüğünüz test ve kazandığınız XP puanları profilinize işlenir. 1000'den fazla rozetin kilidini aşama aşama açarsınız.",
    },
    {
      q: "Sesler yapay zeka mı yoksa gerçek insan sesi mi?",
      a: "Platformdaki dinleme materyalleri ve aksan laboratuvarı 6 farklı ülkeden (İngiltere, ABD, Avustralya, Kanada vb.) gerçek anadili İngilizce olan profesyonel konuşmacılarla kaydedilmiştir.",
    },
    {
      q: "Mobil cihazlardan ve tabletten çalışabilir miyim?",
      a: "Evet! IELTS Akademi tamamen duyarlı (responsive) tasarlanmıştır. Telefon, tablet veya bilgisayarınızdan kaldığınız yerden kesintisiz devam edebilirsiniz.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 space-y-16">
      
      {/* ─── 1. HERO BÖLÜMÜ: AKADEMİ TANITIMI + HIZLI GİRİŞ PANELİ ─── */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-rose-50/30 p-6 shadow-sm dark:border-slate-800 dark:from-[#050505] dark:via-[#080808] dark:to-[#0a0a0a] sm:p-10 lg:p-12">
        {/* Arka Plan Canlı Gökkuşağı Parıltıları */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-tr from-rose-500/15 via-amber-500/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-gradient-to-bl from-cyan-500/15 via-indigo-500/10 to-transparent blur-3xl" />

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12">
          
          {/* Sol: Değer Önerisi & Tanıtım */}
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-black text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400">
              <Sparkles className="h-4 w-4 animate-pulse text-amber-500" />
              <span>A1&apos;den C2&apos;ye · IELTS Akademik &amp; Genel Hazırlık Platformu</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl lg:leading-[1.12]">
              Sınav seni değil,{" "}
              <span className="rainbow-text">
                hazırlığını ölçer.
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Korkutmayan, kıyaslamayan ve her hatayı öğrenmenin kanıtı sayan çağdaş dil mimarisi.
              <strong className="text-slate-900 dark:text-white"> 6 küresel aksan</strong>, 
              <strong className="text-slate-900 dark:text-white"> 12 çalışan laboratuvar</strong> ve yapay zekâ koçun 
              <strong className="text-rose-600 dark:text-rose-400"> Lumi</strong> ile hedeflediğin Band skoruna ulaş.
            </p>

            {/* Hızlı Özellik İmleri */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 lg:justify-start">
              <span className="rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 dark:border-slate-800 dark:bg-[#111]">
                🎧 6 İnsan Aksanı
              </span>
              <span className="rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 dark:border-slate-800 dark:bg-[#111]">
                ⚡ 12 İnteraktif Laboratuvar
              </span>
              <span className="rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 dark:border-slate-800 dark:bg-[#111]">
                🏆 1,000+ Açılabilir Rozet
              </span>
              <span className="rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 dark:border-slate-800 dark:bg-[#111]">
                🤖 Lumi Yapay Zekâ Koçu
              </span>
            </div>

            {/* Maskot ve Lumi Bilgisi */}
            <div className="flex items-center justify-center gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-3.5 backdrop-blur-sm dark:border-slate-800 dark:bg-[#0c0c0c]/80 lg:justify-start">
              <img
                src="/anim/lumi-maskot.gif"
                alt="Lumi Maskotu"
                className="h-14 w-14 rounded-2xl object-contain drop-shadow"
              />
              <div className="text-left">
                <span className="block text-xs font-black text-rose-600 dark:text-rose-400">
                  Lumi ile Tanış
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Speaking telaffuzunu dinler, essay hatalarını analiz eder, sana özel çalışma planı çıkarır.
                </p>
              </div>
            </div>
          </div>

          {/* Sağ: İLK AÇILIŞTA GİRİŞ PANELİ (Quick Auth) */}
          <div className="flex justify-center lg:col-span-5">
            <QuickAuthPanel />
          </div>
        </div>
      </section>

      {/* ─── 2. PLATFORM KAPASİTE VE TANITIM SAYAÇLARI ─── */}
      <section aria-label="Platform Kapasitesi ve Sayaçlar">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {platformStats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-[#0a0a0a]"
              >
                <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-r ${item.color} p-3 text-white shadow-sm`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {item.label}
                  </span>
                  <strong className="block text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {item.value}
                  </strong>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 3. 4 TEMEL IELTS BECERİSİ (LİSTENİNG, READİNG, WRİTİNG, SPEAKİNG) ─── */}
      <section aria-label="IELTS 4 Ana Beceri">
        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-wider text-rose-500 dark:text-rose-400">
            Kapsamlı Sınav Eğitimi
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            IELTS&apos;in 4 Ana Becerisinde Uzmanlaş
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tüm içerikler sınav standartlarında hazırlanmış, interaktif geri bildirimlerle güçlendirilmiştir.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {coreSkills.map((skill) => {
            const Icon = skill.icon;
            return (
              <Link
                key={skill.title}
                href={skill.href}
                className={`group rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-[#0a0a0a] ${skill.border}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-2xl bg-gradient-to-br ${skill.color} p-3.5 text-white shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-[#141414] dark:text-slate-300">
                    {skill.tag}
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-rose-600 dark:text-rose-400">
                    {skill.subtitle}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 transition-colors group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-400">
                    {skill.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {skill.desc}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs font-black text-rose-600 dark:text-rose-400">
                  <span>Modülü Keşfet</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── 4. 12 ÇALIŞAN EĞİTİM MODÜLÜ (GÖKKUŞAĞI VİTRİNİ) ─── */}
      <section aria-label="Platform Modülleri" className="space-y-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-cyan-500">
              Tam Donanımlı Laboratuvar
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              12 İnteraktif Eğitim Modülü
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gramerden sözlüğe, telaffuzdan deneme sınavlarına kadar her ihtiyacın için özel bir modül.
            </p>
          </div>
          <Link
            href="/panel"
            className="text-xs font-black text-rose-600 hover:underline dark:text-rose-400"
          >
            Tüm İlerlememi Panelde Gör →
          </Link>
        </div>

        {/* 12 Modül Kartları */}
        <ModuleGrid />
      </section>

      {/* ─── 5. NEDEN IELTS AKADEMİ? (PEDAGOJİ & AVANTAJLAR) ─── */}
      <section
        aria-label="Neden IELTS Akademi"
        className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-amber-50/20 p-8 shadow-sm dark:border-slate-800 dark:from-[#060606] dark:via-[#090909] dark:to-[#0a0a0a] sm:p-12"
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-black uppercase tracking-wider text-amber-500">
            Bilimsel Metodoloji
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Sıradan Kurslardan Neden Farklıyız?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Ezbere dayalı değil, bilişsel öğrenme psikolojisine dayanan ve kalıcı hafıza oluşturan bir sistem geliştirdik.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-[#101010]"
              >
                <div className={`mb-3 inline-flex rounded-xl p-2.5 ${item.badgeColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 6. 1000 ROZET SİSTEMİ TANITIMI (YOL HARİTASI) ─── */}
      <section
        aria-label="1000 Rozet Sistemi"
        className="relative overflow-hidden rounded-3xl border border-rose-200/70 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 p-8 dark:border-rose-900/50 dark:from-rose-950/20 dark:via-amber-950/20 dark:to-indigo-950/20 sm:p-10"
      >
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="max-w-2xl space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-3.5 py-1 text-xs font-black text-rose-600 dark:border-rose-800 dark:bg-[#111] dark:text-rose-300">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Oyunlaştırılmış Başarı Kataloğu</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
              1,000+ Rozet Seni Bekliyor!
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Platformumuzda her seviye, her kelime seti ve her test için özel tasarlanmış 1000&apos;den fazla başarı rozeti bulunmaktadır.
              Çalıştıkça, serilerini korudukça ve hedeflerine ulaştıkça bu rozetlerin kilidini teker teker açacaksın!
            </p>
          </div>

          <div className="flex flex-shrink-0 items-center gap-3">
            <Link
              href="/bolum/rozetler"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 px-6 py-3.5 text-sm font-black text-white shadow-md transition hover:opacity-95"
            >
              <span>Rozet Galerisini İncele</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 7. SIKÇA SORULAN SORULAR ─── */}
      <section aria-label="Sıkça Sorulan Sorular" className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-wider text-rose-500 dark:text-rose-400">
            Merak Edilenler
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Sıkça Sorulan Sorular
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-3xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-[#0a0a0a]"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-1 h-5 w-5 flex-shrink-0 text-rose-500 dark:text-rose-400" />
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {faq.q}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. MOTİVASYON BÖLÜMÜ ─── */}
      <section
        aria-label="Günün Motivasyon Sözü"
        className="rounded-3xl border border-rose-200/80 bg-gradient-to-r from-rose-50 via-amber-50 to-indigo-50 p-6 dark:border-rose-900/40 dark:from-[#0a0505] dark:via-[#0a0700] dark:to-[#05060d]"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">✨</span>
          <div>
            <blockquote className="font-extrabold text-slate-900 dark:text-white sm:text-lg">
              &ldquo;Hata yapmaktan korkmadan konuşmak, kalıcı bir hafıza demektir.&rdquo;
            </blockquote>
            <p className="text-xs italic text-slate-500 dark:text-slate-400">
              — Speaking without fear of mistakes is how memory becomes permanent.
            </p>
          </div>
        </div>
      </section>

      {/* Sabit Lumi Sohbet Baloncuğu */}
      <LumiBubble />
    </div>
  );
}
