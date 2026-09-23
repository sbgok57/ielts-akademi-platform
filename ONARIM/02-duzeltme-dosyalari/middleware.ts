// middleware.ts — korumalı rotalar: giriş yapılmadan erişilemez
export { auth as middleware } from "@/auth";

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
