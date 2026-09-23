// app/api/kayit/route.ts — hesap oluşturma ucu (şifre hash'lenir)
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const govde = await req.json().catch(() => null);
  const ad = String(govde?.ad ?? "").trim();
  const email = String(govde?.email ?? "").trim().toLowerCase();
  const password = String(govde?.password ?? "");

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ messageTr: "Geçerli bir e-posta yaz." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ messageTr: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  }
  const varMi = await prisma.user.findUnique({ where: { email } });
  if (varMi) return NextResponse.json({ messageTr: "Bu e-posta ile bir hesap var." }, { status: 409 });

  const fallbackName = email.split("@")[0] || "Öğrenci";
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
}
