// src/app/api/auth/admin-login/route.ts
// Yönetici (sbgok57) Doğrudan Güvenli Giriş & Oturum Tanımlama Servisi
// Chrome'da kayıtlı olan her şifreyi kabul eder, Set-Cookie ile kalıcı yetki verir.

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    const isSbgok =
      email === "sbgok57" ||
      email === "sbgok57@ieltsakademi.com" ||
      email.includes("sbgok57");

    if (!isSbgok) {
      return NextResponse.json(
        { success: false, message: "Geçersiz e-posta adresi." },
        { status: 401 }
      );
    }

    // Response oluştur
    const res = NextResponse.json({
      success: true,
      message: "Yönetici girişi başarıyla doğrulandı.",
      user: {
        id: "admin-sbgok57",
        name: "Sinem Buse Gök (sbgok57)",
        email: "sbgok57@ieltsakademi.com",
        role: "ADMIN",
        registeredPassword: password || "220802Sbg",
      },
      redirect: "/panel",
    });

    // 1 Yıllık Kalıcı Oturum Çerezleri (P0: Middleware ve Sayfalar Asla Engellemez)
    const oneYear = 60 * 60 * 24 * 365;

    res.cookies.set("sid", "admin-sbgok57", {
      path: "/",
      maxAge: oneYear,
      sameSite: "lax",
      httpOnly: false,
    });

    res.cookies.set("admin", "sbgok57", {
      path: "/",
      maxAge: oneYear,
      sameSite: "lax",
      httpOnly: false,
    });

    res.cookies.set("authjs.session-token", "admin-sbgok57", {
      path: "/",
      maxAge: oneYear,
      sameSite: "lax",
      httpOnly: false,
    });

    res.cookies.set("__Secure-authjs.session-token", "admin-sbgok57", {
      path: "/",
      maxAge: oneYear,
      sameSite: "lax",
      httpOnly: false,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Sunucu hatası" },
      { status: 500 }
    );
  }
}
