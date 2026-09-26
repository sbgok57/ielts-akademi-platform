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

  // SAFETY: DB bağlantısı yoksa anlaşılır hata döndür
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes("localhost")) {
    return NextResponse.json(
      { messageTr: "Kayıt sistemi henüz yapılandırılmamış. Lütfen daha sonra tekrar dene." },
      { status: 503 }
    );
  }

  try {
    const { hash } = await import("bcryptjs");
    const { prisma } = await import("@/lib/prisma");

    const varMi = await prisma.user.findUnique({ where: { email } });
    if (varMi) {
      return NextResponse.json({ messageTr: "Bu e-posta ile bir hesap var." }, { status: 409 });
    }

    const fallbackName = email.split("@")[0] ?? "Öğrenci";
    const user = await prisma.user.create({
      data: {
        email,
        name: ad || fallbackName,
        passwordHash: await hash(password, 12),
        cefrLevel: "A1",
        targetBand: 6,
      },
    });
    return NextResponse.json({ ok: true, id: user.id });
  } catch (err) {
    console.error("[kayit] DB error:", err);
    return NextResponse.json(
      { messageTr: "Sunucu hatası oluştu. Lütfen tekrar dene." },
      { status: 500 }
    );
  }
}
