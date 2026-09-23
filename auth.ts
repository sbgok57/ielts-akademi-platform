// auth.ts — Auth.js v5 (NextAuth) + e-posta/şifre girişi (Credentials)
// Bağımlılıklar: next-auth@beta, @auth/prisma-adapter, bcryptjs
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/giris", error: "/giris" },
  providers: [
    Credentials({
      name: "E-posta ve şifre",
      credentials: { email: { label: "E-posta", type: "email" }, password: { label: "Şifre", type: "password" } },
      async authorize(raw) {
        const email = String(raw?.email ?? "").trim().toLowerCase();
        const password = String(raw?.password ?? "");
        if (!email || password.length < 8) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const ok = await compare(password, user.passwordHash);
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
});
