export const TOKEN_KEY  = 'auth_token'  as const;
export const LOCALE_KEY = 'app_locale'  as const;

export const PUSHER_APP_KEY     = process.env['EXPO_PUBLIC_PUSHER_KEY']     ?? '';
export const PUSHER_APP_CLUSTER = process.env['EXPO_PUBLIC_PUSHER_CLUSTER'] ?? 'ap1';

// Web Client ID (client_type: 3) — used by GoogleSignin.configure and backend token verification.
export const GOOGLE_WEB_CLIENT_ID = '661538209777-nhtp07mb5guuhrd3128r80m83imtut6p.apps.googleusercontent.com' as const;

// EAS project ID — required by getExpoPushTokenAsync to address the correct project.
export const EXPO_PROJECT_ID = '299e73b6-58b0-43d0-9a56-c7a212af98e5' as const;

// iOS bundle ID — must match ios.bundleIdentifier in app.json once set.
export const IOS_BUNDLE_ID = 'com.moiorder.app' as const;

// Numeric App Store ID from App Store Connect (e.g. 123456789).
// Leave empty until the app is published; the update check is skipped when blank.
export const IOS_APP_STORE_ID = '' as const;

export const CACHE_TTL = {
  USER_DATA: 5 * 60 * 1000,
  STATIC_DATA: Infinity,
  LIVE_DATA: 0,
  NOTIFICATION_POLL: 30 * 1000,
} as const;
