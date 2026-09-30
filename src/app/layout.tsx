import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ThemeInitializer from "@/components/ThemeInitializer";
import "./globals.css";


export const metadata: Metadata = {
  title: "IELTS & YDS Akademi Platform — A1→C2 + IELTS & YDS Tam Platform",
  description:
    "Oyunlaştırılmış, bilimsel temelli, 7 aksanlı gerçek insan sesli, yapay zekâ speaking koçlu, sesli gramer anlatımlı tam teşekküllü İngilizce, IELTS & YDS hazırlık platformu.",
  keywords: ["IELTS", "YDS", "İngilizce", "CEFR", "A1", "C2", "Academic", "General Training", "Lumi", "Antigravity", "Speaking AI"],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)",  color: "#000000" },
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
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="alternate icon" href="/icon" />
        <link rel="apple-touch-icon" href="/icon.svg" />
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

                // 240+ Öğrenci Kişiselleştirilmiş Renk Teması Yükleyici
                const customTheme = localStorage.getItem('ielts_student_theme');
                if (customTheme) {
                  const t = JSON.parse(customTheme);
                  if (t && t.primary) {
                    const r = document.documentElement;
                    r.style.setProperty('--coral', t.primary);
                    r.style.setProperty('--teal', t.secondary);
                    r.style.setProperty('--sun', t.accent);
                    r.style.setProperty('--indigo', (t.previewColors && t.previewColors[3]) || t.primary);
                    r.style.setProperty('--brand-1', t.primary);
                    r.style.setProperty('--brand-2', t.secondary);
                    r.style.setProperty('--brand-3', t.accent);
                    r.style.setProperty('--brand-4', (t.previewColors && t.previewColors[3]) || t.secondary);
                    if (t.gradient) r.style.setProperty('--rainbow-gradient-dynamic', t.gradient);
                  }
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-bg text-foreground bg-mesh-pattern selection:bg-brand-1 selection:text-white">
        <ThemeInitializer />
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
        <footer className="border-t border-slate-200/90 py-8 text-center text-xs backdrop-blur-sm dark:border-slate-800 dark:bg-black text-slate-500 dark:text-slate-400">
          <div className="mx-auto max-w-7xl px-4 space-y-2">
            <p className="font-semibold">
              IELTS Akademi Platform • A1→C2 &amp; Academic &amp; General IELTS Hazırlık Sistemi
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              6 Doğal İnsan Aksanı · 12 İnteraktif Modül · 1,000+ Başarı Rozeti · Lumi Yapay Zekâ Koçu
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
