import { pushSubscriptionsApi } from 'src/api/push-subscriptions';

// ----------------------------------------------------------------------
// Helpers

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

// ----------------------------------------------------------------------

export function isWebPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Register the service worker, request notification permission, subscribe to push,
 * and sync the subscription keys with the backend.
 * Called after a successful admin login and on page load when a session is restored.
 * Never throws — push is best-effort and must never fail the login flow.
 */
export async function registerPushSubscription(): Promise<void> {
  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!isWebPushSupported() || !vapidPublicKey) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const existing = await registration.pushManager.getSubscription();

    if (existing) {
      // Already subscribed in the browser — re-sync keys with the backend in case the
      // row was deleted (e.g. admin used a different browser and old subscription expired).
      const p256dh = existing.getKey('p256dh');
      const auth = existing.getKey('auth');
      if (!p256dh || !auth) return;
      await pushSubscriptionsApi.store({
        endpoint: existing.endpoint,
        p256dh_key: arrayBufferToBase64(p256dh),
        auth_key: arrayBufferToBase64(auth),
      });
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    const p256dh = subscription.getKey('p256dh');
    const auth = subscription.getKey('auth');
    if (!p256dh || !auth) return;

    await pushSubscriptionsApi.store({
      endpoint: subscription.endpoint,
      p256dh_key: arrayBufferToBase64(p256dh),
      auth_key: arrayBufferToBase64(auth),
    });
  } catch (err) {
    console.warn('[WebPush] Registration failed:', err);
  }
}

/**
 * Delete the subscription from the backend (while the auth token is still valid),
 * then unsubscribe in the browser.
 * Called at the start of logout, before the token is cleared.
 */
export async function unregisterPushSubscription(): Promise<void> {
  if (!isWebPushSupported()) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    for (const registration of registrations) {
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) continue;

      await pushSubscriptionsApi.destroy(subscription.endpoint).catch(() => {});
      await subscription.unsubscribe();
    }
  } catch (err) {
    console.warn('[WebPush] Unregister failed:', err);
  }
}
