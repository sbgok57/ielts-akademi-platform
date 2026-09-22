// src/app/api/lumi/route.ts
// Lumi AI Mentor streaming / yanıt uç noktası (P8'de canlı LLM/RAG, P0'da hazır iskelet)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { LUMI_SYSTEM_PROMPT } from "@/lib/lumi-prompt";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      message?: string;
      context?: Record<string, unknown>;
    };

    const userMessage = body.message ?? "Merhaba";
    const answer = `Merhaba! Ben Lumi 🌟 Sorun: "${userMessage}". Bu platformda sana adım adım rehberlik edeceğim. Bir kuralı merak ediyorsan ya da alıştırma yapmak istiyorsan her zaman buradayım!`;

    // SSE streaming veya JSON yanıtı simülasyonu
    return NextResponse.json({
      delta: answer,
      sources: [
        {
          title: "IELTS Hazırlık İlkeleri",
          href: "#",
          kind: "tactic",
        },
      ],
      promptGuidance: LUMI_SYSTEM_PROMPT.slice(0, 80) + "...",
      status: "ready",
    });
  } catch {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
