'use server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface SignUpResult {
  error?: string;
}

export async function signUp(formData: FormData): Promise<SignUpResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const username = String(formData.get('username') ?? '').trim();

  // Server-side validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Geçerli bir e-posta adresi girin.' };
  }
  if (password.length < 8) {
    return { error: 'Şifre en az 8 karakter olmalı.' };
  }
  if (!/\d/.test(password)) {
    return { error: 'Şifre en az 1 rakam içermeli.' };
  }
  if (username && !/^[a-z0-9_]{3,30}$/.test(username)) {
    return { error: 'Kullanıcı adı 3-30 karakter, yalnızca harf/rakam/alt çizgi.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username || null },
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('.supabase.co', '') ??
        'http://localhost:3000'
      }/auth/callback`,
    },
  });

  if (error) {
    console.error('[signUp] Supabase error:', error.message);
    if (error.message.includes('already registered')) {
      return { error: 'Bu e-posta adresi zaten kayıtlı.' };
    }
    return { error: 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.' };
  }

  // Confirm email is ON → session is null → redirect to OTP verification screen
  if (data.user && !data.session) {
    redirect(`/supabase-verify?email=${encodeURIComponent(email)}`);
  }

  redirect('/panel');
}
