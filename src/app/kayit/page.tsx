"use client";
// app/kayit/page.tsx — /kayit → /giris?tab=kayit yönlendirmesi
// Split-panel giriş sayfasındaki tab'ı "kayıt" olarak açar

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KayitYonlendirme() {
  const router = useRouter();
  useEffect(() => {
    // PERF: immediate redirect, no flash
    router.replace("/giris?tab=kayit");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Yönlendiriliyor…
      </p>
    </div>
  );
}
