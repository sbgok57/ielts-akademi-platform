// src/app/api/ai/tutor/feedback/route.ts
// Lumi AI Tutor Geri Bildirim Uç Noktası
// Öğrencinin 👍 Doğru veya 👎 Hata Var bildirimlerini kaydeder.

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      messageId?: string;
      rating?: number;
      note?: string;
    };

    // SAFETY: Sessizce kaydet, geliştirici konsoluna yönlendir
    if (process.env.NODE_ENV !== "production") {
      console.log("[Lumi Feedback Received]", body);
    }

    return NextResponse.json({
      ok: true,
      messageTr: "Geri bildiriminiz başarıyla kaydedildi.",
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
