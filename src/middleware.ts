// middleware.ts — Edge-uyumlu akıcı yönlendirme (Döngüleri önler, öğrenim modüllerini serbest bırakır)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Eğitim modülleri (/kelime, /bolum/*, /gramer, /okuma, /dinleme, /konusma, /yazma, /deneme, /haberler, /sertifika)
  // her öğrenciye doğrudan açıktır. Kullanıcı butonlara tıkladığında asla /giris döngüsüne sokulmaz.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Statik dosyalar ve API rotaları hariç akıcı geçiş
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|anim/).*)",
  ],
};
