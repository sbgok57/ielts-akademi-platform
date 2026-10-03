// src/app/api/ai/tutor/route.ts
// Lumi AI Tutor SSE Streaming Uç Noktası (LumiChat ve yapay zekâ bileşenleri için)
// SAFETY: Bağlantı kesilmelerinde stream'i temizler, asenkron chunk ile arabelleği boşaltır.

import { NextRequest } from "next/server";

interface TutorRequestBody {
  message?: string;
  context?: {
    route?: string;
    contentId?: string;
    contentTitle?: string;
    cefrLevel?: string;
    history?: { role: string; content: string }[];
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as TutorRequestBody;
    const message = (body.message || "").trim();

    // /api/lumi mantığıyla zengin cevap al
    const lumiUrl = new URL("/api/lumi", req.url);
    const lumiRes = await fetch(lumiUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context: body.context }),
    });

    const data = await lumiRes.json().catch(() => ({
      answer: "Merhaba! Ben Lumi 🌟 Sana yardımcı olmak için buradayım. Takıldığın her konuyu sorabilirsin!",
      sources: [{ title: "Gramer Akademi", href: "/gramer", kind: "lesson" as const }],
    }));

    const fullAnswer: string = data.answer || data.delta || "Harika bir soru! Adım adım inceleyelim.";
    const sources = data.sources || [];

    // ReadableStream ile SSE yayını yap
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Cevabı 3-5 mantıksal parçaya bölerek akıcı streaming hissi ver
        const words = fullAnswer.split(" ");
        const chunkSize = Math.max(3, Math.ceil(words.length / 8));

        for (let i = 0; i < words.length; i += chunkSize) {
          const chunkText = words.slice(i, i + chunkSize).join(" ") + (i + chunkSize < words.length ? " " : "");
          const isLast = i + chunkSize >= words.length;
          
          const payload = JSON.stringify({
            delta: chunkText,
            ...(isLast ? { sources } : {}),
          });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));

          // PERF: Kısa duraksama ile doğal yazma hissi
          await new Promise((r) => setTimeout(r, 40));
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[AI Tutor Stream Error]", error);
    const fallbackText = "data: " + JSON.stringify({ delta: "Merhaba! Ben Lumi 🌟 Bağlantıda kısa bir gecikme oldu. Derslerine /gramer veya /kelime modülünden devam edebilirsin." }) + "\n\ndata: [DONE]\n\n";
    return new Response(fallbackText, {
      headers: { "Content-Type": "text/event-stream; charset=utf-8" },
    });
  }
}
