export const TOKEN_KEY  = 'auth_token'  as const;
export const LOCALE_KEY = 'app_locale'  as const;

// MOI Order LINE Official Account — customer contacts here to complete payment
export const LINE_OA_URL = process.env['EXPO_PUBLIC_LINE_OA_URL'] ?? 'https://line.me/R/ti/p/%40moiorder';

export const PUSHER_APP_KEY     = process.env['EXPO_PUBLIC_PUSHER_KEY']     ?? '';
export const PUSHER_APP_CLUSTER = process.env['EXPO_PUBLIC_PUSHER_CLUSTER'] ?? 'ap1';
export const LINE_CHANNEL_ID    = process.env['EXPO_PUBLIC_LINE_CHANNEL_ID'] ?? '';

// Web Client ID (client_type: 3) — used by GoogleSignin.configure and backend token verification.
// Hardcoded fallback mirrors eas.json so builds without the env var still work.
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
// Required so the native iOS sign-in sheet uses the correct OAuth client.
// Hardcoded fallback mirrors app.config.js so configure() is always valid even without EAS secrets.
export const GOOGLE_IOS_CLIENT_ID =
  process.env['EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID'] ??
  '661538209777-o33avjo80379ui26kj2clbn4snla6j2g.apps.googleusercontent.com';

export const CACHE_TTL = {
  USER_DATA:       5  * 60 * 1000,
  REFERENCE_DATA:  24 * 60 * 60 * 1000,
  STATIC_DATA:     Infinity,
  LIVE_DATA:       0,
  NOTIFICATION_POLL: 30 * 1000,
  GC_EXTENDED:     30 * 60 * 1000,
} as const;
