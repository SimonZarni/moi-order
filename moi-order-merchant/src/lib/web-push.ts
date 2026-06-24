import { pushSubscriptionsApi } from '../api/push-subscriptions';

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

// Tracks the active push subscription endpoint so unregisterMerchantWebPush()
// can issue the backend DELETE without re-fetching from the SW registration.
let activeEndpoint: string | null = null;

// ----------------------------------------------------------------------

export function isWebPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Register the service worker, request notification permission, subscribe to push,
 * and sync the subscription keys with the backend.
 * Called on web after a successful merchant login and on session restore.
 * Never throws — push is best-effort and must never fail the login flow.
 */
export async function registerMerchantWebPush(): Promise<void> {
  const vapidPublicKey = process.env.EXPO_PUBLIC_VAPID_PUBLIC_KEY;
  if (!isWebPushSupported() || !vapidPublicKey) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const existing = await registration.pushManager.getSubscription();

    if (existing) {
      // Already subscribed in the browser — re-sync keys with the backend in case the
      // row was deleted (e.g. merchant used a different browser or subscription expired).
      const p256dh = existing.getKey('p256dh');
      const auth = existing.getKey('auth');
      if (!p256dh || !auth) return;
      activeEndpoint = existing.endpoint;
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

    activeEndpoint = subscription.endpoint;
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
 * Initiate cleanup before the auth token is cleared.
 * Called synchronously at the start of logout so the DELETE request is dispatched
 * with a valid token. The actual HTTP request and browser unsubscribe are async
 * best-effort — they never block the logout flow.
 *
 * @param token - the current auth token, passed explicitly because the axios
 *   interceptor runs asynchronously and _token may be null by the time it executes.
 */
export function initiateWebPushUnregister(token: string): void {
  if (!isWebPushSupported() || !activeEndpoint) return;

  const endpoint = activeEndpoint;
  activeEndpoint = null;

  // Backend cleanup — fire-and-forget with explicit token (see destroy() comment).
  pushSubscriptionsApi.destroy(endpoint, token).catch(() => {});

  // Browser-level unsubscribe — prevents SW from receiving pushes after logout
  // even if the backend DELETE fails.
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.pushManager.getSubscription().then((sub) => {
        if (sub) sub.unsubscribe().catch(() => {});
      }).catch(() => {});
    }
  }).catch(() => {});
}
