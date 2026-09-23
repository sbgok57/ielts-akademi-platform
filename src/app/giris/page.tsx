"use client";
// app/giris/page.tsx — GERÇEK giriş ekranı (e-posta + şifre)
// Not: Server action ile de yapılabilir; bu sürüm istemci tarafında signIn kullanır.
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function GirisSayfasi() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    setHata(null);
    setYukleniyor(true);
    const sonuc = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/panel" });
    setYukleniyor(false);
    if (!sonuc || sonuc.error) { setHata("E-posta veya şifre hatalı. Tekrar dene."); return; }
    window.location.href = sonuc.url ?? "/panel";
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-extrabold">Hesabına gir</h1>
      {hata && <p role="alert" className="mt-3 rounded-xl bg-rose-100 p-3 font-semibold text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">{hata}</p>}
      <form onSubmit={gonder} className="mt-4 space-y-4">
        <div>
          <label htmlFor="email" className="block font-bold">E-posta</label>
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-900" placeholder="ornek@eposta.com" />
        </div>
        <div>
          <label htmlFor="password" className="block font-bold">Şifre</label>
          <input id="password" type="password" required minLength={8} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-900" placeholder="En az 8 karakter" />
        </div>
        <button type="submit" disabled={yukleniyor} className="w-full rounded-xl bg-violet-600 p-3 font-extrabold text-white disabled:opacity-50">
          {yukleniyor ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        Hesabın yok mu? <Link className="font-bold text-violet-600 underline" href="/kayit">Kayıt ol</Link>
      </p>
    </main>
  );
}
