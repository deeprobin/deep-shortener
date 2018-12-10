const assets = [
  '/',
  '/?homescreen=1',
  '/legal/',
  '/terms/',
  '/privacy-policy/',
  '/css/style.css',
  '/css/legal.css',
  '/js/script.js',
  '/js/sw.js',
  '/img/background.svg',
  '/favicon.ico/'
];

self.addEventListener('install', async event=> {
  const cache = await caches.open('deep-shortener');
  cache.addAll(assets);
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(fetchCache(event.request));
});

async function fetchCache(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}
