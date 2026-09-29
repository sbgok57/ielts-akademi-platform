'use server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface SignInResult {
  error?: string;
  unverified?: boolean;
}

export async function signIn(formData: FormData): Promise<SignInResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'E-posta ve şifre gereklidir.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('[signIn] Auth error:', error.message);
    if (error.message.includes('Email not confirmed')) {
      return { error: 'E-postanız henüz doğrulanmadı.', unverified: true };
    }
    return { error: 'E-posta veya şifre hatalı.' };
  }

  if (!data.session) {
    return { error: 'Oturum oluşturulamadı. Lütfen tekrar deneyin.' };
  }

  redirect('/panel');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/giris');
}
