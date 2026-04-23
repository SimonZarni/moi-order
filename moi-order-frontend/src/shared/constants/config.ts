export const TOKEN_KEY  = 'auth_token'  as const;
export const LOCALE_KEY = 'app_locale'  as const;

// Web Client ID (client_type: 3) — used by GoogleSignin.configure and backend token verification.
export const GOOGLE_WEB_CLIENT_ID = '661538209777-nhtp07mb5guuhrd3128r80m83imtut6p.apps.googleusercontent.com' as const;

export const CACHE_TTL = {
  USER_DATA: 5 * 60 * 1000,
  STATIC_DATA: Infinity,
  LIVE_DATA: 0,
} as const;
