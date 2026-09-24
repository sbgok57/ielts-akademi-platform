import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./globals.css";


export const metadata: Metadata = {
  title: "IELTS Akademi Platform — A1→C2 + IELTS Tam Platform",
  description:
    "Oyunlaştırılmış, bilimsel temelli, 6 aksanlı gerçek insan sesli ve yapay zekâ koçlu (Lumi) tam teşekküllü İngilizce & IELTS hazırlık platformu.",
  keywords: ["IELTS", "İngilizce", "CEFR", "A1", "C2", "Academic", "General Training", "Lumi", "Antigravity"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6EF" },
    { media: "(prefers-color-scheme: dark)",  color: "#17181C" },
  ],
  width: "device-width",
  initialScale: 1,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC tema başlatıcı script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-bg text-foreground bg-mesh-pattern selection:bg-brand-1 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          İçeriğe geç (Skip to content)
        </a>
        <Navbar />
        <main id="main-content" className="min-h-[calc(100vh-140px)]">
          {children}
        </main>
        <footer className="border-t py-8 text-center text-xs backdrop-blur-sm"
                style={{ borderColor: "var(--border)", background: "var(--bg-soft)", color: "var(--text-muted)" }}>
          <div className="mx-auto max-w-7xl px-4">
            <p>
              IELTS Akademi Platform • A1→C2 &amp; Academic IELTS Hazırlık Sistemi •{" "}
              <Link href="/varliklar" className="font-bold underline transition-colors hover:text-[var(--coral)]">
                Varlık Durumu (10 GIF + 25 SVG)
              </Link>
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
