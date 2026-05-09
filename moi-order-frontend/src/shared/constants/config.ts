export const TOKEN_KEY  = 'auth_token'  as const;
export const LOCALE_KEY = 'app_locale'  as const;

// MOI Order LINE Official Account — customer contacts here to complete payment
export const LINE_OA_URL = process.env['EXPO_PUBLIC_LINE_OA_URL'] ?? 'https://line.me/R/ti/p/%40moiorder';

export const PUSHER_APP_KEY     = process.env['EXPO_PUBLIC_PUSHER_KEY']     ?? '';
export const PUSHER_APP_CLUSTER = process.env['EXPO_PUBLIC_PUSHER_CLUSTER'] ?? 'ap1';
export const LINE_CHANNEL_ID    = process.env['EXPO_PUBLIC_LINE_CHANNEL_ID'] ?? '';

// Reads a required EXPO_PUBLIC_* env var. Throws at module load time in DEV if missing
// so misconfured local dev builds fail loudly instead of crashing with a cryptic JSI error.
// In production every value is injected by EAS Secrets at build time.
function requiredPublicEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[Config] Missing required env var: ${key}\n` +
      'For local dev: copy .env.example to .env and fill in the values.\n' +
      'For EAS builds: run  eas secret:create --scope project --name ' + key + '  to add the secret.',
    );
  }
  return value;
}

// Web Client ID (client_type: 3) — used by GoogleSignin.configure and backend token verification.
// Must be a non-empty string; an empty string causes a JSI crash on iOS native module init.
export const GOOGLE_WEB_CLIENT_ID = requiredPublicEnv('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID');

// EAS project ID — required by getExpoPushTokenAsync to address the correct project.
export const EXPO_PROJECT_ID = '299e73b6-58b0-43d0-9a56-c7a212af98e5' as const;

// iOS bundle ID — must match ios.bundleIdentifier in app.json once set.
export const IOS_BUNDLE_ID = 'com.moiorder.app' as const;

// Numeric App Store ID from App Store Connect (e.g. 123456789).
// Leave empty until the app is published; the update check is skipped when blank.
export const IOS_APP_STORE_ID = '' as const;

// iOS Client ID (client_type: 1) — from GoogleService-Info.plist CLIENT_ID.
// Required so the native iOS sign-in sheet uses the correct OAuth client.
// Must be a non-empty string; an empty string causes a JSI crash on iOS native module init.
export const GOOGLE_IOS_CLIENT_ID = requiredPublicEnv('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID');

export const CACHE_TTL = {
  USER_DATA:       5  * 60 * 1000,
  REFERENCE_DATA:  24 * 60 * 60 * 1000,
  STATIC_DATA:     Infinity,
  LIVE_DATA:       0,
  NOTIFICATION_POLL: 30 * 1000,
  GC_EXTENDED:     30 * 60 * 1000,
} as const;
