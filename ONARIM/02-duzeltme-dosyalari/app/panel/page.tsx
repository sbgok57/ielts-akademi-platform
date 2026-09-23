// app/panel/page.tsx — KORUMALI panel (giriş yapmadan erişilemez)
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
