// Service worker for Moi Order Merchant — Web Push + PWA (iOS 16.4+).
// Scope: root — must live in public/ so it is served at /sw.js.

// iOS requires install + activate + fetch handlers for a valid PWA service worker.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => { event.waitUntil(self.clients.claim()); });
// Empty fetch handler — satisfies iOS PWA requirements without intercepting requests.
// The browser handles all fetches natively; no caching needed for an always-online dashboard.
self.addEventListener('fetch', () => {});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'Moi Order', body: event.data.text() };
  }

  const title = payload.title ?? 'Moi Order';
  const options = {
    body: payload.body ?? '',
    icon: '/icon-192.png',
    badge: '/favicon-32x32.png',
    data: payload.data ?? {},
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// On notification click: focus the existing merchant tab or open a new one.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        if (windowClients.length > 0) {
          return windowClients[0].focus();
        }
        return clients.openWindow('/');
      })
  );
});
