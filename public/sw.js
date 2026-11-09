// Stale-while-revalidate for every GET (app shell + Google Fonts), so the app works offline after first load.
const CACHE = 'ledscroll-v1'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(clients.claim()))
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(e.request)
    const net = fetch(e.request).then(res => {
      if (res.ok || res.type === 'opaque') cache.put(e.request, res.clone())
      return res
    }).catch(() => hit)
    return hit || net
  }))
})
