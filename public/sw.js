// public/sw.js — IELTS Akademi Çevrimdışı & Önbellek Hizmet Çalışanı (Service Worker)
// SAFETY: Ağ kesintilerinde statik varlıkları, animasyonları ve önbellekteki sayfaları sunar.

const CACHE_NAME = "ielts-akademi-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon.svg",
  "/anim/ilerleme-halkasi.gif",
  "/anim/lumi-maskot.gif",
  "/anim/basari.gif",
  "/anim/dinleme-dalgasi.gif",
  "/anim/kelime-karti.gif",
  "/anim/rozet-havai-fisek.gif",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Sadece GET isteklerini ve API olmayan kaynakları önbelleğe al
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Arka planda güncelle (stale-while-revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        // Çevrimdışı fallback
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
      });
    })
  );
});
