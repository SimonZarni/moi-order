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

  const type = payload.data?.type ?? '';
  const isOrderAlert = type === 'new_order' || type === 'payment_confirmed';

  const title = payload.title ?? 'Moi Order';
  const options = {
    body: payload.body ?? '',
    icon: '/icon-192.png?v=2',
    badge: '/notification-badge.png?v=2',
    data: payload.data ?? {},
    // New orders stay on screen until the merchant taps — chat messages auto-dismiss.
    requireInteraction: isOrderAlert,
    // Vibrate even in silent mode on Android: three pulses for orders, one for chat.
    vibrate: isOrderAlert ? [300, 150, 300, 150, 300] : [150],
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
