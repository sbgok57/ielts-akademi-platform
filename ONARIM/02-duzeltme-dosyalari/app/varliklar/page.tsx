// app/varliklar/page.tsx — tüm GIF ve SVG varlıklarının durum sayfası
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
