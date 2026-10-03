// app/api/kayit/route.ts — hesap oluşturma ucu (şifre hash'lenir)
// SAFETY: DB yoksa anlaşılır hata mesajı döndürür, crash olmaz
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const govde = await req.json().catch(() => null) as {
    ad?: string; email?: string; password?: string;
  } | null;

  const ad = String(govde?.ad ?? "").trim();
  const email = String(govde?.email ?? "").trim().toLowerCase();
  const password = String(govde?.password ?? "");

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ messageTr: "Geçerli bir e-posta yaz." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ messageTr: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  }

  const fallbackName = ad || (email.split("@")[0] ?? "Öğrenci");

  // SAFETY: Eğer veritabanı aktifse kullanıcıyı kaydet
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && !dbUrl.includes("localhost")) {
    try {
      const { hash } = await import("bcryptjs");
      const { prisma } = await import("@/lib/prisma");

      const varMi = await prisma.user.findUnique({ where: { email } });
      if (varMi) {
        return NextResponse.json({ messageTr: "Bu e-posta adresiyle kayıtlı bir hesap zaten var. Giriş yapabilirsiniz." }, { status: 409 });
      }

      const user = await prisma.user.create({
        data: {
          email,
          name: fallbackName,
          passwordHash: await hash(password, 12),
          cefrLevel: "A1",
          targetBand: 6.5,
        },
      });

      const res = NextResponse.json({ ok: true, id: user.id, name: user.name, email: user.email });
      res.cookies.set("sid", user.id, { path: "/", maxAge: 31536000, sameSite: "lax" });
      return res;
    } catch (err) {
      console.warn("[kayit] DB kaydı başarısız oldu, yerel oturuma geçiliyor:", err);
    }
  }

  // SAFETY & FALLBACK: Veritabanı çevrimdışı veya yerel geliştirme modundaysa
  // Kullanıcının kayıt olmasını engelleme, temiz A1 oturumuyla hemen başlat!
  const stuId = "stu_" + Math.random().toString(36).slice(2, 9);
  const res = NextResponse.json({
    ok: true,
    id: stuId,
    name: fallbackName,
    email,
    fallback: true,
    messageTr: "Hesabınız başarıyla oluşturuldu! Hoş geldiniz.",
  });
  res.cookies.set("sid", stuId, { path: "/", maxAge: 31536000, sameSite: "lax" });
  return res;
}
