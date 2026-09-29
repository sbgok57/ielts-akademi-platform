'use server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface VerifyResult {
  error?: string;
}

export async function verifyCode(email: string, token: string): Promise<VerifyResult> {
  const trimmed = token.trim().replace(/\s/g, '');

  if (!/^\d{6}$/.test(trimmed)) {
    return { error: '6 haneli doğrulama kodu girin.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: trimmed,
    type: 'signup',
  });

  if (error) {
    console.error('[verifyCode] OTP error:', error.message);
    return { error: 'Kod hatalı veya süresi dolmuş. Tekrar deneyin.' };
  }

  if (data.session) {
    redirect('/panel');
  }

  return { error: 'Doğrulama tamamlanamadı. Lütfen tekrar kayıt olun.' };
}

export async function resendCode(email: string): Promise<VerifyResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({ type: 'signup', email });

  if (error) {
    console.error('[resendCode] Resend error:', error.message);
    if (error.message.includes('rate limit')) {
      return { error: 'Çok fazla deneme. Lütfen bir süre bekleyin.' };
    }
    return { error: 'Kod gönderilemedi. Lütfen tekrar deneyin.' };
  }

  return {};
}
