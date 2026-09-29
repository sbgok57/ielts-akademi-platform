'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition, useEffect, useRef, Suspense } from 'react';
import { verifyCode, resendCode } from '@/lib/supabase/actions/verify-otp';

const RESEND_COOLDOWN = 60; // seconds

function VerifyForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // SAFETY: Clear interval on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function handleVerify() {
    setError(null);
    startTransition(async () => {
      const result = await verifyCode(email, token);
      if (result?.error) setError(result.error);
    });
  }

  function handleResend() {
    if (cooldown > 0) return;
    setError(null);
    startTransition(async () => {
      const result = await resendCode(email);
      if (result?.error) {
        setError(result.error);
      } else {
        startCooldown();
      }
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">E-postanızı Doğrulayın</h1>
        <p className="mb-6 text-sm text-slate-500">
          <span className="font-medium text-slate-700">{email}</span> adresine gönderilen
          6 haneli kodu girin.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="token" className="mb-1 block text-sm font-medium text-slate-700">
              Doğrulama Kodu
            </label>
            <input
              id="token"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleVerify}
            disabled={isPending || token.length !== 6}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? 'Doğrulanıyor…' : 'Doğrula'}
          </button>

          <button
            onClick={handleResend}
            disabled={isPending || cooldown > 0}
            className="w-full rounded-lg border border-slate-300 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            {cooldown > 0 ? `Tekrar gönder (${cooldown}s)` : 'Kodu tekrar gönder'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function SupabaseVerifyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Yükleniyor…</div>}>
      <VerifyForm />
    </Suspense>
  );
}
