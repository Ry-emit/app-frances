/* Service worker — Plan de francés, 20 días.
   Precarga el shell para que funcione offline. HTML: network-first (recibe
   actualizaciones); cae a caché sin conexión. El resto: cache-first.
   Sube el número de versión para forzar la actualización al publicar. */
const CACHE = 'planfr20-v1';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './data/vocab-175.js',
  './data/reglas-ortografia.js',
  './data/gramatica.js',
  './data/plan-20-dias.js',
  './data/presentacion.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(SHELL);
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
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

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
