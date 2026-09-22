// src/auth.ts
// Auth.js v5 kimlik doğrulama katmanı (P1'de tam akış, P0'da tip ve oturum iskeleti)

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
}

export interface Session {
  user: SessionUser;
  expires: string;
}

export async function auth(): Promise<Session | null> {
  // P0 geliştirme oturumu simülasyonu
  return {
    user: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Örnek Öğrenci",
      email: "ogrenci@ielts-akademi.com",
      role: "STUDENT",
    },
    expires: new Date(Date.now() + 86400000).toISOString(),
  };
}
