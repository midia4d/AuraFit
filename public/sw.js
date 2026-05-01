// AuraFit Service Worker v2 — with push notifications & caching
const CACHE_NAME = 'aurafi-v2'
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/workouts',
  '/diet',
  '/library',
  '/sleep',
  '/mood',
  '/profile',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json',
]

// ─── Install ──────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
})

// ─── Activate ─────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      ),
    ])
  )
})

// ─── Fetch (cache-first for static, network-first for API) ────────

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and external requests
  if (request.method !== 'GET' || !url.origin.includes(self.location.hostname)) {
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => cached ?? new Response('Offline', { status: 503 }))
    })
  )
})

// ─── Push Notifications ────────────────────────────────────────────

self.addEventListener('push', (event) => {
  let data = { title: 'AuraFit 💪', body: 'Hora do treino! Vamos evoluir hoje 🔥', url: '/workouts' }

  try {
    if (event.data) data = { ...data, ...event.data.json() }
  } catch (_) {}

  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200, 100, 200],
    data: { url: data.url },
    actions: [
      { action: 'open',    title: '🏋️ Treinar agora' },
      { action: 'dismiss', title: '⏰ Lembrar depois' },
    ],
    tag: 'workout-reminder',
    renotify: true,
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// ─── Notification Click ────────────────────────────────────────────

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') return

  const targetUrl = event.notification.data?.url ?? '/dashboard'

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if found
        for (const client of clientList) {
          if ('focus' in client) {
            client.navigate(targetUrl)
            return client.focus()
          }
        }
        // Otherwise open new window
        return clients.openWindow(targetUrl)
      })
  )
})

// ─── Periodic Background Sync (workout reminders) ─────────────────

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'workout-reminder') {
    event.waitUntil(
      self.registration.showNotification('AuraFit 💪', {
        body: 'Não esqueça do seu treino hoje! Você consegue 🔥',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        vibrate: [200, 100, 200],
        data: { url: '/workouts' },
        tag: 'workout-reminder',
      })
    )
  }
})
