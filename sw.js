const VERSION = 'gymbro-v4';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './data.js',
  './art.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './img/affondi-manubri-0.jpg',
  './img/affondi-manubri-1.jpg',
  './img/alzate-laterali-0.jpg',
  './img/alzate-laterali-1.jpg',
  './img/calf-raise-0.jpg',
  './img/calf-raise-1.jpg',
  './img/cardio-0.jpg',
  './img/cardio-1.jpg',
  './img/croci-cavi-0.jpg',
  './img/croci-cavi-1.jpg',
  './img/crunch-carico-0.jpg',
  './img/crunch-carico-1.jpg',
  './img/curl-bilanciere-0.jpg',
  './img/curl-bilanciere-1.jpg',
  './img/curl-martello-0.jpg',
  './img/curl-martello-1.jpg',
  './img/face-pull-0.jpg',
  './img/face-pull-1.jpg',
  './img/lat-machine-0.jpg',
  './img/lat-machine-1.jpg',
  './img/leg-curl-0.jpg',
  './img/leg-curl-1.jpg',
  './img/leg-extension-0.jpg',
  './img/leg-extension-1.jpg',
  './img/leg-press-0.jpg',
  './img/leg-press-1.jpg',
  './img/panca-inclinata-manubri-0.jpg',
  './img/panca-inclinata-manubri-1.jpg',
  './img/panca-piana-0.jpg',
  './img/panca-piana-1.jpg',
  './img/plank-0.jpg',
  './img/plank-1.jpg',
  './img/pulley-basso-0.jpg',
  './img/pulley-basso-1.jpg',
  './img/pushdown-0.jpg',
  './img/pushdown-1.jpg',
  './img/rematore-bilanciere-0.jpg',
  './img/rematore-bilanciere-1.jpg',
  './img/shoulder-press-0.jpg',
  './img/shoulder-press-1.jpg',
  './img/squat-0.jpg',
  './img/squat-1.jpg',
  './img/stacco-rumeno-0.jpg',
  './img/stacco-rumeno-1.jpg',
  './img/tricipiti-nuca-0.jpg',
  './img/tricipiti-nuca-1.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
        return res;
      }).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
