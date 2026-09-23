// components/ModuleGrid.tsx — bölümlere GERÇEK giriş (ölü bağlantı yok)
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
