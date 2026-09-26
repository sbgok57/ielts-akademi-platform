// src/auth.ts — Auth.js v5 (NextAuth) + e-posta/şifre girişi (Credentials)
// SAFETY: DB yoksa adapter kullanılmaz (JWT-only mod), uygulama çökmez
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// SAFETY: Prisma/bcryptjs'i lazy import et — DB env var yoksa yüklenmez
async function getPrismaAdapter() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes("localhost")) return undefined;
  try {
    const { PrismaAdapter } = await import("@auth/prisma-adapter");
    const { prisma } = await import("@/lib/prisma");
    return PrismaAdapter(prisma);
  } catch {
    return undefined;
  }
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    const { compare } = await import("bcryptjs");
    return compare(password, hash);
  } catch {
    return false;
  }
}

async function findUserByEmail(email: string) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes("localhost")) return null;
  try {
    const { prisma } = await import("@/lib/prisma");
    return prisma.user.findUnique({ where: { email } });
  } catch {
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const adapter = await getPrismaAdapter();

  return {
    ...(adapter ? { adapter } : {}),
    session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
    pages: { signIn: "/giris", error: "/giris" },
    providers: [
      Credentials({
        name: "E-posta ve şifre",
        credentials: {
          email: { label: "E-posta", type: "email" },
          password: { label: "Şifre", type: "password" },
        },
        async authorize(raw) {
          const email = String(raw?.email ?? "").trim().toLowerCase();
          const password = String(raw?.password ?? "");
          if (!email || password.length < 8) return null;

          const user = await findUserByEmail(email);
          if (!user?.passwordHash) return null;

          const ok = await comparePassword(password, user.passwordHash);
          if (!ok) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? (user.email ? user.email.split("@")[0] ?? "Öğrenci" : "Öğrenci"),
            image: null,
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user?.id) token.uid = user.id;
        return token;
      },
      async session({ session, token }) {
        if (token?.uid && session.user) session.user.id = String(token.uid);
        return session;
      },
    },
  };
});
