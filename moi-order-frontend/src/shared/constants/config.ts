export const TOKEN_KEY  = 'auth_token'  as const;
export const LOCALE_KEY = 'app_locale'  as const;

// MOI Order LINE Official Account — customer contacts here to complete payment
export const LINE_OA_URL = process.env['EXPO_PUBLIC_LINE_OA_URL'] ?? 'https://line.me/R/ti/p/%40186nrdhq';

// Pre-filled message deep link — opens OA chat with text already typed so customer just taps Send
export const LINE_OA_MESSAGE_URL = process.env['EXPO_PUBLIC_LINE_OA_MESSAGE_URL'] ?? 'https://line.me/R/oaMessage/@186nrdhq';

// "Moi Merchant" app download link — shown to customers who apply to become a
// merchant. Left empty until the merchant app is published; the download
// button is hidden when blank.
export const MERCHANT_APP_DOWNLOAD_URL = process.env['EXPO_PUBLIC_MERCHANT_APP_DOWNLOAD_URL'] ?? '';

export const PUSHER_APP_KEY     = process.env['EXPO_PUBLIC_PUSHER_KEY']     ?? '';
export const PUSHER_APP_CLUSTER = process.env['EXPO_PUBLIC_PUSHER_CLUSTER'] ?? 'ap1';
export const LINE_CHANNEL_ID    = process.env['EXPO_PUBLIC_LINE_CHANNEL_ID'] ?? '';

// Web Client ID (client_type: 3) — used by GoogleSignin.configure and backend token verification.
// Hardcoded fallback ensures configure() always receives a non-empty string on local
// Gradle builds where Metro cache may not substitute the env var reliably.
export const GOOGLE_WEB_CLIENT_ID =
  process.env['EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'] ??
  '661538209777-nhtp07mb5guuhrd3128r80m83imtut6p.apps.googleusercontent.com';

// EAS project ID — required by getExpoPushTokenAsync to address the correct project.
export const EXPO_PROJECT_ID = '299e73b6-58b0-43d0-9a56-c7a212af98e5' as const;

// iOS bundle ID — must match ios.bundleIdentifier in app.json once set.
export const IOS_BUNDLE_ID = 'com.moiorder.app' as const;

// Numeric App Store ID from App Store Connect (e.g. 123456789).
// Leave empty until the app is published; the update check is skipped when blank.
export const IOS_APP_STORE_ID = '' as const;

// iOS Client ID (client_type: 1) — from GoogleService-Info.plist CLIENT_ID.
// Hardcoded fallback ensures configure() always receives a non-empty string on local
// Gradle builds where Metro cache may not substitute the env var reliably.
export const GOOGLE_IOS_CLIENT_ID =
  process.env['EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID'] ??
  '661538209777-o33avjo80379ui26kj2clbn4snla6j2g.apps.googleusercontent.com';

// How long before a pending (order_placed) order is considered timed-out by the restaurant.
// The backend auto-expires at 30 min; we show a warning banner at 15 min.
export const ORDER_PAYMENT_TIMEOUT_MS    = 30 * 60 * 1_000; // 30 minutes — halfway to 60-min auto-expiry
export const CHAT_LOCK_AFTER_COMPLETION_MS = 3 * 60 * 60 * 1_000; // 3 hours — mirrors backend isChatLocked()

export const CACHE_TTL = {
  USER_DATA:       5  * 60 * 1000,
  REFERENCE_DATA:  24 * 60 * 60 * 1000,
  STATIC_DATA:     Infinity,
  LIVE_DATA:       0,
  NOTIFICATION_POLL: 30 * 1000,
  GC_EXTENDED:     30 * 60 * 1000,
} as const;
