/* Service worker — Français B1 (Camino)
   - Precarga el shell + TODOS los audios neuronales en la instalación
     (una vez, con conexión) para que funcione 100% offline después.
   - HTML: network-first (para recibir actualizaciones); cae a caché sin conexión.
   - Audio/iconos/fuentes: cache-first (instantáneo y offline).
   Sube el número de versión para forzar recarga de caché al publicar cambios. */
const CACHE = 'fr-b1-camino-v5';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './audio/manifest.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // Shell crítico: debe entrar sí o sí.
    await c.addAll(SHELL);
    // Audios: mejor esfuerzo (si alguno falla, no rompe la instalación).
    try {
      const res = await fetch('./audio/manifest.json', { cache: 'no-cache' });
      const m = await res.json();
      const files = Object.values(m.files || {}).map((f) => './audio/' + f);
      await Promise.allSettled(files.map((u) => c.add(u)));
    } catch (_) { /* sin conexión en la instalación: se cachearán al reproducirse */ }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return; // no interceptamos POST (p. ej. /api/log)
  const url = new URL(req.url);

  // HTML / navegación → network-first, con caché de respaldo offline.
  const isNav = req.mode === 'navigate' ||
    (url.origin === location.origin && (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')));
  if (isNav) {
    e.respondWith((async () => {
      try {
        const net = await fetch(req);
        const c = await caches.open(CACHE);
        c.put('./index.html', net.clone());
        return net;
      } catch (_) {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Resto (audio, iconos, fuentes) → cache-first, y guarda lo nuevo.
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const net = await fetch(req);
      if (net && (net.ok || net.type === 'opaque')) {
        const c = await caches.open(CACHE);
        c.put(req, net.clone());
      }
      return net;
    } catch (_) {
      return hit || Response.error();
    }
  })());
});
