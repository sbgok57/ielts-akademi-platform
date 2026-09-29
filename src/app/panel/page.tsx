// app/panel/page.tsx — KORUNAN kalıcı öğrenci dashboard'u
// Kalıcı ilerleme, seviye atlama, sertifikalar ve yüzdelikler entegre edilmiştir.

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StudentDashboard from "@/components/StudentDashboard";

export const dynamic = "force-dynamic";

export default async function Panel() {
  const oturum = await auth();
  if (!oturum?.user) redirect("/giris?donus=/panel");

  // SAFETY: DB erişilemezse (Vercel DB env var eksikse) session verisine fallback yap
  let kullanici: {
    name: string | null;
    email: string | null;
  } | null = null;

  try {
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")) {
      kullanici = await prisma.user.findUnique({
        where: { id: oturum.user.id },
        select: {
          name: true,
          email: true,
        },
      });
    }
  } catch {
    // SAFETY: DB bağlantısı yoksa sessizce devam et
    kullanici = null;
  }

  const ad = kullanici?.name ?? oturum.user.name ?? (oturum.user.email ? oturum.user.email.split("@")[0] : null) ?? "Öğrenci";
  const email = kullanici?.email ?? oturum.user.email ?? "";

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 dark:bg-black"
      style={{ background: "var(--bg)" }}
    >
      <div className="mx-auto max-w-5xl">
        <StudentDashboard initialName={ad} initialEmail={email} />
      </div>
    </div>
  );
}
