"use client";
// app/kayit/page.tsx — e-posta + şifre ile hesap oluşturma
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function KayitSayfasi() {
  const [ad, setAd] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    setHata(null); setYukleniyor(true);
    const yanit = await fetch("/api/kayit", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ad, email, password }),
    });
    const veri = await yanit.json().catch(() => ({}));
    if (!yanit.ok) { setYukleniyor(false); setHata(veri.messageTr ?? "Kayıt tamamlanamadı."); return; }
    const sonuc = await signIn("credentials", { email, password, redirect: false });
    setYukleniyor(false);
    window.location.href = sonuc?.error ? "/giris" : "/panel";
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-extrabold">Yeni hesap oluştur</h1>
      {hata && <p role="alert" className="mt-3 rounded-xl bg-rose-100 p-3 font-semibold text-rose-700">{hata}</p>}
      <form onSubmit={gonder} className="mt-4 space-y-4">
        <div>
          <label htmlFor="ad" className="block font-bold">Ad (isteğe bağlı)</label>
          <input id="ad" value={ad} onChange={(e) => setAd(e.target.value)} className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-900" placeholder="Adın" />
        </div>
        <div>
          <label htmlFor="email" className="block font-bold">E-posta</label>
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-900" placeholder="ornek@eposta.com" />
        </div>
        <div>
          <label htmlFor="password" className="block font-bold">Şifre (en az 8 karakter)</label>
          <input id="password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border p-3 dark:bg-slate-900" />
        </div>
        <button type="submit" disabled={yukleniyor} className="w-full rounded-xl bg-violet-600 p-3 font-extrabold text-white disabled:opacity-50">
          {yukleniyor ? "Hesap oluşturuluyor..." : "Hesap oluştur"}
        </button>
      </form>
      <p className="mt-4 text-sm">Zaten üye misin? <Link className="font-bold text-violet-600 underline" href="/giris">Giriş yap</Link></p>
    </main>
  );
}
