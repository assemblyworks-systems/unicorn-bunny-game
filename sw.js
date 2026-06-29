// Service worker for Avalynn's app — NETWORK-FIRST so it always pulls the
// latest version from GitHub when online, and falls back to cache offline.
const CACHE = 'playbox-cache-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // drop any old caches
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith((async () => {
    try {
      // Always try the network first → newest version from GitHub.
      const fresh = await fetch(req, { cache: 'no-store' });
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      // Offline → serve last-saved copy if we have it.
      const cached = await caches.match(req);
      if (cached) return cached;
      throw err;
    }
  })());
});
