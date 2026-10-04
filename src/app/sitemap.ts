// src/app/sitemap.ts
// Next.js 14 Dinamik Site Haritası (Sitemap Generator)
// Tüm modülleri, sertifika sorgulama portalını ve eğitim sayfalarını arama motorlarına sunar.

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ielts-akademi-platform.vercel.app";
  const now = new Date();

  const coreRoutes = [
    { path: "", priority: 1.0, freq: "daily" as const },
    { path: "/gramer", priority: 0.9, freq: "weekly" as const },
    { path: "/okuma", priority: 0.9, freq: "weekly" as const },
    { path: "/dinleme", priority: 0.9, freq: "weekly" as const },
    { path: "/konusma", priority: 0.9, freq: "weekly" as const },
    { path: "/yazma", priority: 0.8, freq: "weekly" as const },
    { path: "/kelime", priority: 0.9, freq: "daily" as const },
    { path: "/haberler", priority: 0.9, freq: "daily" as const },
    { path: "/deneme", priority: 0.8, freq: "weekly" as const },
    { path: "/sertifika", priority: 0.8, freq: "weekly" as const },
    { path: "/sertifika/sorgu", priority: 0.9, freq: "always" as const },
    { path: "/taktikler", priority: 0.7, freq: "monthly" as const },
    { path: "/bilim", priority: 0.7, freq: "monthly" as const },
    { path: "/arsiv", priority: 0.7, freq: "monthly" as const },
    { path: "/rozetler", priority: 0.6, freq: "monthly" as const },
    { path: "/sozler", priority: 0.6, freq: "monthly" as const },
    { path: "/giris", priority: 0.8, freq: "monthly" as const },
    { path: "/kayit", priority: 0.8, freq: "monthly" as const },
    { path: "/panel", priority: 0.8, freq: "daily" as const },
    { path: "/posta", priority: 0.6, freq: "monthly" as const },
  ];

  return coreRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
