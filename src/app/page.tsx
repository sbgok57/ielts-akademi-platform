import Link from "next/link";
import ModuleGrid from "@/components/ModuleGrid";
import LumiBubble from "@/components/LumiBubble";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const stats = [
    { label: "Çalışma Serisi", value: "7 Gün", anim: "/anim/seri-alev.gif" },
    { label: "Kazanılan XP", value: "1,250 XP", anim: "/anim/konfeti.gif" },
    { label: "Seviye", value: "7 · Çalışkan Yolcu", anim: "/anim/ilerleme-halkasi.gif" },
    { label: "1000 Rozet", value: "12 Rozet Açık", anim: "/anim/rozet-havai-fisek.gif" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 space-y-12">
      {/* Hero Karşılama Alanı */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-200/70 bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-50/50 p-8 shadow-sm dark:border-violet-900/50 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/40 sm:p-12">
        <div className="flex flex-col-reverse items-center justify-between gap-8 lg:flex-row">
          <div className="max-w-2xl space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100/60 px-3.5 py-1 text-xs font-bold text-violet-800 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-300">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              <span>A1&apos;den C2&apos;ye + IELTS Akademik &amp; Genel Hazırlık</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:leading-tight">
              Sınav seni değil,{" "}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                hazırlığını ölçer.
              </span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Korkutmayan, kıyaslamayan ve her hatayı öğrenmenin kanıtı sayan eğitim mimarisi.
              Gerçek insan sesleri (6 aksan), 12 çalışan laboratuvar ve yapay zekâ koçun Lumi ile hedefine ulaş.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href="/kayit"
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 font-extrabold text-white shadow-md shadow-violet-600/20 transition hover:bg-violet-700 hover:shadow-lg"
              >
                <span>Hemen Hesap Oluştur</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/giris"
                className="inline-flex items-center rounded-2xl border border-slate-300 bg-white/80 px-6 py-3 font-bold text-slate-700 backdrop-blur-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Zaten Hesabım Var
              </Link>
              <Link
                href="/panel"
                className="inline-flex items-center rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                Öğrenci Paneline Git
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="/anim/lumi-maskot.gif"
              alt="Lumi Maskotu"
              className="h-44 w-44 rounded-3xl object-contain drop-shadow-xl sm:h-52 sm:w-52"
            />
            <span className="mt-2 text-xs font-bold text-violet-700 dark:text-violet-400">
              Lumi · Yapay Zekâ Koçun
            </span>
          </div>
        </div>
      </section>

      {/* Günlük Canlı İlerleme İstatistikleri */}
      <section aria-label="Canlı İlerleme Özeti">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <img src={item.anim} alt="" className="h-12 w-12 rounded-xl object-contain" />
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
                <strong className="block text-lg font-black text-slate-900 dark:text-white">
                  {item.value}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Motivasyon Sözü */}
      <section
        aria-label="Günün Motivasyon Sözü"
        className="rounded-3xl border border-pink-200/80 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 p-6 dark:border-pink-900/40 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">✨</span>
          <div>
            <blockquote className="font-extrabold text-slate-900 dark:text-white sm:text-lg">
              &ldquo;Hata yapmaktan korkmadan konuşmak, kalıcı bir hafıza demektir.&rdquo;
            </blockquote>
            <p className="text-xs italic text-slate-500">
              — Speaking without fear of mistakes is how memory becomes permanent.
            </p>
          </div>
        </div>
      </section>

      {/* 12 Modül Izgarası (Gerçek Rotalar) */}
      <section aria-label="Platform Modülleri" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Eğitim Laboratuvarları &amp; Modüller
            </h2>
            <p className="text-sm text-slate-500">
              Tüm bağlantılar gerçek ve etkileşimli modül sayfalarına açılır.
            </p>
          </div>
        </div>

        <ModuleGrid />
      </section>

      {/* Sabit Lumi Sohbet Baloncuğu */}
      <LumiBubble />
    </div>
  );
}
