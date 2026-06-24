// Service worker for Moi Order admin — Web Push + PWA (iOS 16.4+).
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
    badge: '/notification-badge.png',
    data: payload.data ?? {},
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// On notification click: navigate to the relevant detail page.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data ?? {};
  let targetPath = '/';

  if (data.type === 'food_order' && data.order_id) {
    targetPath = `/food-orders/${data.order_id}`;
  } else if (data.type === 'submission' && data.submission_id) {
    targetPath = `/services/submissions/${data.submission_id}`;
  } else if (data.type === 'ticket_order' && data.ticket_order_id) {
    targetPath = `/bookings/${data.ticket_order_id}`;
  }

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.startsWith(self.registration.scope)) {
            const origin = new URL(client.url).origin;
            return clients.openWindow(origin + targetPath);
          }
        }
        return clients.openWindow(targetPath);
      })
  );
});
