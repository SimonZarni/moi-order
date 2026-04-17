export const TOKEN_KEY  = 'auth_token'  as const;
export const LOCALE_KEY = 'app_locale'  as const;

export const CACHE_TTL = {
  USER_DATA: 5 * 60 * 1000,
  STATIC_DATA: Infinity,
  LIVE_DATA: 0,
} as const;
