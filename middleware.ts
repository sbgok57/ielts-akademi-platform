// middleware.ts — Edge-uyumlu korumalı rotalar: giriş yapılmadan erişilemez
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("sid")?.value;

  const pathname = req.nextUrl.pathname;
  const isProtected = [
    "/panel",
    "/bolum",
    "/gramer",
    "/okuma",
    "/dinleme",
    "/konusma",
    "/yazma",
    "/kelime",
    "/deneme",
    "/program",
    "/rozetler",
  ].some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    const loginUrl = new URL("/giris", req.url);
    loginUrl.searchParams.set("donus", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/panel/:path*",
    "/bolum/:path*",
    "/gramer/:path*",
    "/okuma/:path*",
    "/dinleme/:path*",
    "/konusma/:path*",
    "/yazma/:path*",
    "/kelime/:path*",
    "/deneme/:path*",
    "/program/:path*",
    "/rozetler/:path*",
  ],
};
