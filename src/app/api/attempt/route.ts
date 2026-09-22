// src/app/api/attempt/route.ts
// Cevap gönderimi ve değerlendirme uç noktası (P2'de tam entegrasyon, P0'da hazır iskelet)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      itemId?: string;
      given?: string;
      elapsedMs?: number;
      mode?: string;
    };

    return NextResponse.json({
      status: "received",
      correct: true,
      xpDelta: 15,
      itemId: body.itemId ?? null,
      messageTr: "P0 altyapı doğrulandı. P2 aşamasında canlı SRS ve XP motoruna bağlanacaktır.",
    });
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }
}
