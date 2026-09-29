'use server';
import { createClient } from '@/lib/supabase/server';

interface ResetResult {
  error?: string;
  ok?: boolean;
}

export async function requestPasswordReset(email: string): Promise<ResetResult> {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Geçerli bir e-posta adresi girin.' };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:3000';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/reset-password`,
  });

  if (error) {
    console.error('[requestPasswordReset] Error:', error.message);
    return { error: 'Sıfırlama e-postası gönderilemedi. Lütfen tekrar deneyin.' };
  }

  return { ok: true };
}

export async function updatePassword(newPassword: string): Promise<ResetResult> {
  if (newPassword.length < 8 || !/\d/.test(newPassword)) {
    return { error: 'Şifre en az 8 karakter ve 1 rakam içermelidir.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error('[updatePassword] Error:', error.message);
    return { error: 'Şifre güncellenemedi. Bağlantının süresi dolmuş olabilir.' };
  }

  return { ok: true };
}
