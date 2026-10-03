// app/cikis/route.ts — Güvenli ve eksiksiz oturum kapatma
// SAFETY: Hem NextAuth token'larını hem de yerel sid / admin çerezlerini tamamen temizler.

import { NextResponse } from "next/server";
import { signOut } from "@/auth";

export async function POST(req: Request) {
  try {
    await signOut({ redirect: false });
  } catch {}

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.delete("sid");
  res.cookies.delete("admin");
  res.cookies.delete("authjs.session-token");
  res.cookies.delete("__Secure-authjs.session-token");
  return res;
}

export async function GET(req: Request) {
  return POST(req);
}
