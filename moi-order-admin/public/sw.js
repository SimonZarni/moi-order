// Service worker for Moi Order admin browser push notifications (VAPID / Web Push API).
// Scope: root — must live in public/ so it is served at /sw.js.

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
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data ?? {},
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// On notification click: focus the existing admin tab or open a new one.
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
