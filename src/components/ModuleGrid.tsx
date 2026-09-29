// components/ModuleGrid.tsx — 12 Modül Gökkuşağı Canlı Vitrini
import Link from "next/link";

interface ModulItem {
  yol: string;
  ikon: string;
  ad: string;
  ozet: string;
  renkSinifi: string;
  badge: string;
}

const MODULLER: ModulItem[] = [
  {
    yol: "/gramer",
    ikon: "/img/ikon-gramer.svg",
    ad: "Gramer Akademi",
    ozet: "A1→C2, 9 bloklu dersler ve mikro testler",
    renkSinifi: "border-l-4 border-l-rose-500 hover:border-rose-400 group-hover:text-rose-500",
    badge: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
  },
  {
    yol: "/okuma",
    ikon: "/img/ikon-okuma.svg",
    ad: "Okuma Laboratuvarı",
    ozet: "Her metinde en az 10 soru + kanıt cümlesi",
    renkSinifi: "border-l-4 border-l-orange-500 hover:border-orange-400 group-hover:text-orange-500",
    badge: "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
  },
  {
    yol: "/dinleme",
    ikon: "/img/ikon-dinleme.svg",
    ad: "Dinleme Laboratuvarı",
    ozet: "Gerçek insan sesi, 6 aksan, dikte ve gölgeleme",
    renkSinifi: "border-l-4 border-l-amber-500 hover:border-amber-400 group-hover:text-amber-500",
    badge: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  },
  {
    yol: "/konusma",
    ikon: "/img/ikon-konusma.svg",
    ad: "Konuşma Laboratuvarı",
    ozet: "Part 1-2-3 görevleri ve sesli kayıt koçu",
    renkSinifi: "border-l-4 border-l-emerald-500 hover:border-emerald-400 group-hover:text-emerald-500",
    badge: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
  {
    yol: "/yazma",
    ikon: "/img/ikon-yazma.svg",
    ad: "Yazma Laboratuvarı",
    ozet: "Task 1 ve Task 2, 4 ölçütlü geri bildirim",
    renkSinifi: "border-l-4 border-l-teal-500 hover:border-teal-400 group-hover:text-teal-500",
    badge: "bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400",
  },
  {
    yol: "/kelime",
    ikon: "/img/ikon-kelime.svg",
    ad: "Kelime Hazinesi",
    ozet: "23 alanlı kartlar, TR/EN, sesli telaffuz",
    renkSinifi: "border-l-4 border-l-cyan-500 hover:border-cyan-400 group-hover:text-cyan-500",
    badge: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400",
  },
  {
    yol: "/deneme",
    ikon: "/img/ikon-deneme.svg",
    ad: "Deneme Sınavı",
    ozet: "Sınav Modu: süreli, yazım denetimi kapalı",
    renkSinifi: "border-l-4 border-l-blue-600 hover:border-blue-400 group-hover:text-blue-500",
    badge: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  },
  {
    yol: "/arsiv",
    ikon: "/img/ikon-arsiv.svg",
    ad: "1989→2026 Arşiv",
    ozet: "Dönem kartları ve özgün denemeler",
    renkSinifi: "border-l-4 border-l-indigo-600 hover:border-indigo-400 group-hover:text-indigo-500",
    badge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
  },
  {
    yol: "/bilim",
    ikon: "/img/ikon-bilim.svg",
    ad: "Bilim Kütüphanesi",
    ozet: "6 alan, A1→C2, sesli akademik okuma",
    renkSinifi: "border-l-4 border-l-violet-600 hover:border-violet-400 group-hover:text-violet-500",
    badge: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
  },
  {
    yol: "/taktikler",
    ikon: "/img/ikon-taktik.svg",
    ad: "Taktik Kütüphanesi",
    ozet: "Soru tipi stratejileri ve süre hedefleri",
    renkSinifi: "border-l-4 border-l-purple-600 hover:border-purple-400 group-hover:text-purple-500",
    badge: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
  },
  {
    yol: "/rozetler",
    ikon: "/img/ikon-rozet.svg",
    ad: "1,000+ Rozet Havuzu",
    ozet: "Görevleri tamamla, kutlama havai fişeklerini patlat",
    renkSinifi: "border-l-4 border-l-fuchsia-600 hover:border-fuchsia-400 group-hover:text-fuchsia-500",
    badge: "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950/50 dark:text-fuchsia-400",
  },
  {
    yol: "/sozler",
    ikon: "/img/ikon-soz.svg",
    ad: "Motivasyon Merkezi",
    ozet: "Her girişte değişen ilham verici 1000 söz",
    renkSinifi: "border-l-4 border-l-pink-600 hover:border-pink-400 group-hover:text-pink-500",
    badge: "bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400",
  },
];

export default function ModuleGrid() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {MODULLER.map((m) => (
        <Link
          key={m.yol}
          href={m.yol}
          className={`group flex items-start gap-4 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-[#0a0a0a] ${m.renkSinifi}`}
        >
          <img
            src={m.ikon}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-2xl p-1 transition-transform group-hover:scale-105"
            loading="lazy"
          />
          <div className="space-y-1">
            <strong className="block text-base font-extrabold text-slate-900 transition-colors dark:text-white">
              {m.ad}
            </strong>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {m.ozet}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}
