import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ThemeInitializer from "@/components/ThemeInitializer";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL("https://ielts-akademi-platform.vercel.app"),
  title: {
    default: "IELTS & YDS Akademi Platform — A1→C2 + IELTS & YDS Tam Platform",
    template: "%s | IELTS Akademi",
  },
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
  openGraph: {
    title: "IELTS & YDS Akademi Platform — A1→C2 Hazırlık Sistemi",
    description: "Yapay zekâ speaking koçu Lumi, 6 aksan seslendirme, resmi doğrulanabilir sertifikalar ve 1,000+ kelime kartı.",
    url: "https://ielts-akademi-platform.vercel.app",
    siteName: "IELTS Akademi",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IELTS Akademi Platform",
    description: "A1'den C2'ye tam kapsamlı İngilizce, IELTS ve YDS hazırlık platformu.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
                    function h2r(h) {
                      let c = (h || '').replace('#', '').trim();
                      if (c.length === 3) c = c.split('').map(function(x){return x+x;}).join('');
                      var n = parseInt(c, 16);
                      if (isNaN(n)) return [99, 102, 241];
                      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
                    }
                    function mR(r1, r2, w) {
                      var r = Math.round(r1[0]*w + r2[0]*(1-w));
                      var g = Math.round(r1[1]*w + r2[1]*(1-w));
                      var b = Math.round(r1[2]*w + r2[2]*(1-w));
                      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                    }
                    var p1 = t.primary;
                    var p2 = t.secondary;
                    var p3 = t.accent;
                    var p4 = (t.previewColors && t.previewColors[3]) || p2;
                    var p5 = (t.previewColors && t.previewColors[4]) || p1;
                    var grad = t.gradient;
                    var gradH = 'linear-gradient(90deg, ' + p1 + ' 0%, ' + p2 + ' 25%, ' + p3 + ' 50%, ' + p4 + ' 75%, ' + p5 + ' 100%)';

                    var p1R = h2r(p1);
                    var bgL = mR(p1R, [248, 250, 252], 0.08);
                    var cL = '#FFFFFF';
                    var csL = mR(p1R, [255, 255, 255], 0.03);
                    var bL = mR(p1R, [203, 213, 225], 0.24);

                    var bgD = mR(p1R, [0, 0, 0], 0.12);
                    var cD = mR(p1R, [10, 10, 10], 0.18);
                    var ceD = mR(p1R, [20, 20, 20], 0.24);
                    var bD = mR(p1R, [31, 31, 31], 0.35);

                    var css = ':root { --coral:' + p1 + '!important; --teal:' + p2 + '!important; --sun:' + p3 + '!important; --indigo:' + p4 + '!important; --brand-1:' + p1 + '!important; --brand-2:' + p2 + '!important; --brand-3:' + p3 + '!important; --brand-4:' + p4 + '!important; --rainbow-gradient-dynamic:' + grad + '!important; --rainbow-gradient-dynamic-h:' + gradH + '!important; --bg:' + bgL + '!important; --bg-soft:' + cL + '!important; --bg-elevated:' + cL + '!important; --paper:' + bgL + '!important; --border:' + bL + '!important; } ' +
                    'html:not(.dark) body, body:not(.dark) { background-color:' + bgL + '!important; } ' +
                    'html:not(.dark) header.sticky { background-color:' + cL + 'f5!important; border-bottom-color:' + bL + '!important; } ' +
                    'html:not(.dark) footer { background-color:' + bgL + '!important; border-top-color:' + bL + '!important; } ' +
                    'html:not(.dark) .bg-white, html:not(.dark) [class*="bg-white"] { background-color:' + cL + '!important; } ' +
                    'html:not(.dark) .bg-slate-50 { background-color:' + csL + '!important; } ' +
                    'html:not(.dark) [class*="border-slate-200"], html:not(.dark) [class*="border-slate-100"] { border-color:' + bL + '!important; } ' +
                    '.dark, html.dark { --coral:' + p1 + '!important; --teal:' + p2 + '!important; --sun:' + p3 + '!important; --indigo:' + p4 + '!important; --brand-1:' + p1 + '!important; --brand-2:' + p2 + '!important; --brand-3:' + p3 + '!important; --brand-4:' + p4 + '!important; --rainbow-gradient-dynamic:' + grad + '!important; --rainbow-gradient-dynamic-h:' + gradH + '!important; --bg:' + bgD + '!important; --bg-soft:' + cD + '!important; --bg-elevated:' + ceD + '!important; --paper:' + bgD + '!important; --border:' + bD + '!important; } ' +
                    'html.dark body, body.dark { background-color:' + bgD + '!important; } ' +
                    'html.dark header.sticky, .dark header.sticky { background-color:' + bgD + 'f5!important; border-bottom-color:' + bD + '!important; } ' +
                    'html.dark footer, .dark footer { background-color:' + bgD + '!important; border-top-color:' + bD + '!important; } ' +
                    '.dark [class*="dark:bg-[#"], .dark [class*="dark:bg-black"], .dark [class*="dark:bg-slate-900"], .dark [class*="dark:bg-slate-950"], .dark [class*="dark:bg-bg-elevated"] { background-color:' + cD + '!important; } ' +
                    '.dark [class*="dark:bg-slate-800"] { background-color:' + ceD + '!important; } ' +
                    '.dark [class*="dark:border-slate-"] { border-color:' + bD + '!important; } ' +
                    '.rainbow-gradient-h { background:' + gradH + '!important; } ' +
                    '.rainbow-gradient, .gradient-progress { background:' + grad + '!important; } ' +
                    '.rainbow-text, .rainbow-text-bright, .gradient-text-brand { background:' + grad + '!important; -webkit-background-clip:text!important; -webkit-text-fill-color:transparent!important; } ' +
                    'body::before { content:""; position:fixed; top:0; left:0; right:0; height:480px; background:radial-gradient(ellipse 90% 55% at 50% 0%, ' + p1 + '25 0%, ' + p2 + '15 50%, transparent 80%)!important; pointer-events:none; z-index:1; } ' +
                    'html.dark body::before { background:radial-gradient(ellipse 95% 65% at 50% 0%, ' + p1 + '45 0%, ' + p2 + '25 50%, transparent 80%)!important; } ' +
                    '.bg-mesh-pattern { background-image:radial-gradient(circle at 10% 10%, ' + p1 + '14 0%, transparent 45%), radial-gradient(circle at 90% 20%, ' + p2 + '16 0%, transparent 50%), radial-gradient(circle at 50% 85%, ' + p3 + '14 0%, transparent 55%)!important; } ' +
                    '.dark .bg-mesh-pattern, html.dark .bg-mesh-pattern { background-image:radial-gradient(circle at 10% 10%, ' + p1 + '25 0%, transparent 45%), radial-gradient(circle at 90% 20%, ' + p2 + '20 0%, transparent 50%), radial-gradient(circle at 50% 85%, ' + p3 + '22 0%, transparent 55%)!important; } ' +
                    '.bg-gradient-to-r.from-rose-500, .bg-gradient-to-r.from-emerald-600, .bg-gradient-to-r.from-blue-600, .bg-gradient-to-r.from-purple-600, .bg-gradient-to-r.from-emerald-500 { background-image:' + grad + '!important; } ' +
                    '.rainbow-border-wrap { background:' + gradH + '!important; } ' +
                    '.rainbow-glow { box-shadow:0 0 35px -5px ' + p1 + '66, 0 0 25px -5px ' + p2 + '66!important; } ' +
                    '.dark .rainbow-glow, html.dark .rainbow-glow { box-shadow:0 0 45px -5px ' + p1 + '88, 0 0 35px -5px ' + p2 + '88!important; }';

                    var s = document.getElementById('ielts-active-theme-styles');
                    if (!s) {
                      s = document.createElement('style');
                      s.id = 'ielts-active-theme-styles';
                      document.head.appendChild(s);
                    }
                    s.textContent = css;
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

        {/* Schema.org EducationalOrganization Yapılandırılmış Verisi */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "IELTS Akademi Platform",
              "url": "https://ielts-akademi-platform.vercel.app",
              "logo": "https://ielts-akademi-platform.vercel.app/icon.svg",
              "description": "A1'den C2'ye tam kapsamlı İngilizce, IELTS ve YDS hazırlık platformu. Lumi AI koçu, 6 insan aksanı, 2,000+ haber ve resmi doğrulanabilir sertifikalar.",
              "sameAs": [
                "https://www.cambridgeenglish.org",
                "https://www.britishcouncil.org"
              ]
            }),
          }}
        />

        {/* PWA Service Worker Güvenli Kaydı */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol === 'https:') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(){});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
