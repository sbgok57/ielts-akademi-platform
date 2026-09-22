import ThemeToggle from "@/components/ThemeToggle";
import LumiBubble from "@/components/LumiBubble";
import {
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  Compass,
  Layers,
  Clock,
  Volume2,
} from "lucide-react";

export default function Home() {
  const stats = [
    { label: "Çalışma Serisi", value: "7 Gün", icon: Flame, color: "text-streak" },
    { label: "Kazanılan XP", value: "1,250 XP", icon: Award, color: "text-xp" },
    { label: "Seviye", value: "7 · Çalışkan Yolcu", icon: Compass, color: "text-brand-1" },
    { label: "Günlük Hedef", value: "20 / 20 dk", icon: Clock, color: "text-brand-5" },
  ];

  const modules = [
    {
      id: "grammar",
      title: "Grammar Academy",
      desc: "280 konu, 9 bloklu anlatım, animasyonlu örnekler ve IELTS kritik detayları.",
      icon: Layers,
      tag: "A1 → C2",
      badgeColor: "bg-brand-1/10 text-brand-1 dark:text-brand-1",
    },
    {
      id: "reading",
      title: "Reading Lab",
      desc: "13 soru tipi mekaniği, metin içi kanıt avı ve TFNG karar ağaçları.",
      icon: BookOpen,
      tag: "Akademik & Genel",
      badgeColor: "bg-brand-3/10 text-brand-3",
    },
    {
      id: "listening",
      title: "Listening Lab",
      desc: "6 aksanlı gerçek insan sesleri (GB, US, CA, AU, NZ, IN), dikte ve gölgeleme.",
      icon: Headphones,
      tag: "Gerçek İnsan Sesi",
      badgeColor: "bg-brand-2/10 text-brand-2",
    },
    {
      id: "speaking",
      title: "Speaking & Writing",
      desc: "Part 1-3 simülatörü, Task 1/2 kriter analizi ve yapay zekâ destekli rubric raporu.",
      icon: Mic,
      tag: "4 Ölçütlü Rubric",
      badgeColor: "bg-brand-4/10 text-brand-4",
    },
    {
      id: "vocab",
      title: "Vocabulary Vault",
      desc: "23 alanlı tam kelime kartları, AWL listeleri, eş anlamlı tuzakları ve SRS tekrarı.",
      icon: PenTool,
      tag: "1200+ Kelime",
      badgeColor: "bg-brand-5/10 text-brand-5",
    },
    {
      id: "badges",
      title: "1000 Rozet & Havai Fişek",
      desc: "12 aile, 8 metrik, 10 eşik. Kazanıldığında tam ekran parçacık kutlaması.",
      icon: Award,
      tag: "1000 Rozet Sistemi",
      badgeColor: "bg-brand-6/10 text-brand-6",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Üst Gezinme Çubuğu */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-brand text-white shadow-md shadow-brand-1/20 font-black text-lg tracking-wider">
              IA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg tracking-tight text-foreground">
                  IELTS Akademi Platform
                </span>
                <span className="rounded-full bg-brand-1/15 px-2.5 py-0.5 text-[10px] font-bold text-brand-1 dark:text-brand-3 uppercase tracking-wider">
                  Faz P0 · Aktif
                </span>
              </div>
              <p className="text-[11px] text-foreground-muted hidden sm:block">
                A1→C2 + IELTS Tam Platform &amp; Öğrenme Ekosistemi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-2xl border border-border bg-bg-soft px-3 py-1.5 text-xs font-semibold text-foreground-muted">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              271 / 271 Öz-Test Geçti
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Ana Gövde */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {/* Karşılama Başlığı */}
        <section className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-1/30 bg-brand-1/10 px-4 py-1.5 text-xs font-bold text-brand-1 dark:text-brand-3 mb-4 animate-bounce-subtle">
            <Sparkles className="h-4 w-4" />
            <span>&ldquo;Sınav seni değil, hazırlığını ölçer.&rdquo;</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-none mb-4">
            A1&apos;den C2&apos;ye Uzanan{" "}
            <span className="gradient-text-brand">IELTS Hazırlık Platformu</span>
          </h1>

          <p className="text-sm sm:text-base text-foreground-muted leading-relaxed max-w-2xl mx-auto">
            Korkutmayan, kıyaslamayan ve her hatayı öğrenmenin kanıtı sayan modern eğitim mimarisi.
            Bugün ayırdığın 20 dakika, dün ayırmadığın 20 dakikadan daha değerlidir.
          </p>
        </section>

        {/* Günlük Canlı Durum Kartları */}
        <section aria-label="Canlı İlerleme Özeti" className="mb-12">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col justify-between rounded-3xl border border-border bg-bg-soft p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground-muted">
                      {item.label}
                    </span>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <span className="font-display text-lg sm:text-2xl font-extrabold text-foreground">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Günün Motivasyon Sözü Kartı */}
        <section
          aria-label="Günün Motivasyon Sözü"
          className="relative overflow-hidden rounded-3xl border border-brand-1/30 bg-gradient-to-r from-brand-1/10 via-brand-2/10 to-brand-3/10 p-6 sm:p-8 mb-12 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-brand-1 dark:text-brand-3">
                Günün Motivasyon Sözü · IELTS Akademi Söz Motoru
              </span>
              <blockquote className="text-base sm:text-lg font-bold text-foreground leading-snug">
                &ldquo;Hata yapmaktan korkmadan konuşmak, kalıcı bir hafıza demektir.&rdquo;
              </blockquote>
              <p className="text-xs text-foreground-muted italic">
                &ldquo;Speaking without fear of mistakes means a lasting memory.&rdquo;
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-soft px-3 py-1 text-xs font-bold text-foreground border border-border shadow-xs">
                <Volume2 className="h-3.5 w-3.5 text-brand-1" />
                Lumi ile dinle
              </span>
            </div>
          </div>
        </section>

        {/* 17 Modül & Kapsam Vitrini */}
        <section aria-label="Platform Modülleri">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground">
                Eğitim &amp; Deneme Modülleri
              </h2>
              <p className="text-xs sm:text-sm text-foreground-muted">
                17 temel modülün P0 aşamasındaki mimari çerçevesi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-border bg-bg-soft p-6 shadow-sm hover:border-brand-1/40 hover:shadow-lg transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border group-hover:scale-105 transition-transform">
                        <Icon className="h-6 w-6 text-brand-1" />
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${mod.badgeColor}`}
                      >
                        {mod.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      {mod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-brand-1 dark:text-brand-3">
                    <span>Modül Hazır</span>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Alt Bilgi */}
      <footer className="border-t border-border bg-bg-soft py-6 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-foreground-muted">
            &copy; 2026 <strong>IELTS Akademi</strong> — Tüm hakları saklıdır. Özgün eğitim içeriğidir; Cambridge / IDP / British Council resmî içeriği değildir.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-foreground-muted">
            <span>P0: İskelet &amp; Tema</span>
            <span>·</span>
            <span>24 Motor</span>
            <span>·</span>
            <span>271 Test</span>
          </div>
        </div>
      </footer>

      {/* Sabit Lumi Baloncuğu */}
      <LumiBubble />
    </div>
  );
}
