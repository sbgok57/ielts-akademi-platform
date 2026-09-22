import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IELTS Akademi Platform — A1→C2 + IELTS Tam Platform",
  description:
    "Oyunlaştırılmış, bilimsel temelli, 6 aksanlı gerçek insan sesli ve yapay zekâ koçlu (Lumi) tam teşekküllü İngilizce & IELTS hazırlık platformu.",
  keywords: ["IELTS", "İngilizce", "CEFR", "A1", "C2", "Academic", "General Training", "Lumi", "Antigravity"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F4FF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0620" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
        {children}
      </body>
    </html>
  );
}
