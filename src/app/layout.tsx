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

                // 240+ Öğrenci Kişiselleştirilmiş Renk Teması Yükleyici (Anında Enjeksiyon)
                const customTheme = localStorage.getItem('ielts_student_theme');
                if (customTheme) {
                  const t = JSON.parse(customTheme);
                  if (t && t.primary) {
                    const p1 = t.primary;
                    const p2 = t.secondary;
                    const p3 = t.accent;
                    const p4 = (t.previewColors && t.previewColors[3]) || p2;
                    const p5 = (t.previewColors && t.previewColors[4]) || p1;
                    const grad = t.gradient;
                    const gradH = 'linear-gradient(90deg, ' + p1 + ' 0%, ' + p2 + ' 25%, ' + p3 + ' 50%, ' + p4 + ' 75%, ' + p5 + ' 100%)';
                    const s = document.createElement('style');
                    s.id = 'ielts-active-theme-styles';
                    s.textContent = ':root, .dark { --coral:' + p1 + '!important; --teal:' + p2 + '!important; --sun:' + p3 + '!important; --indigo:' + p4 + '!important; --brand-1:' + p1 + '!important; --brand-2:' + p2 + '!important; --brand-3:' + p3 + '!important; --brand-4:' + p4 + '!important; --rainbow-gradient-dynamic:' + grad + '!important; --rainbow-gradient-dynamic-h:' + gradH + '!important; } .rainbow-gradient-h { background:' + gradH + '!important; } .rainbow-gradient, .gradient-progress { background:' + grad + '!important; } .rainbow-text, .rainbow-text-bright, .gradient-text-brand { background:' + grad + '!important; -webkit-background-clip:text!important; -webkit-text-fill-color:transparent!important; } body::before { content:""; position:fixed; top:0; left:0; right:0; height:480px; background:radial-gradient(ellipse 90% 55% at 50% 0%, ' + p1 + '30 0%, ' + p2 + '18 50%, transparent 80%)!important; pointer-events:none; z-index:1; } .bg-gradient-to-r.from-rose-500, .bg-gradient-to-r.from-emerald-600, .bg-gradient-to-r.from-blue-600, .bg-gradient-to-r.from-purple-600, .bg-gradient-to-r.from-emerald-500 { background-image:' + grad + '!important; } .rainbow-border-wrap { background:' + gradH + '!important; } .rainbow-glow { box-shadow: 0 0 35px -5px ' + p1 + '66, 0 0 25px -5px ' + p2 + '66!important; }';
                    document.head.appendChild(s);
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
