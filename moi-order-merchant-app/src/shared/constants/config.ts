export const CACHE_TTL = {
  DEFAULT: 30_000,
  ORDERS: 15_000,
  MENU: 60_000,
  USER: 300_000,
} as const;

export const PAGINATION = {
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 100,
} as const;

export const WEB_SIDEBAR_WIDTH = 260 as const;

export const TOKEN_KEY = 'merchant_token' as const;

export const OTP_PIN_LENGTH = 6 as const;
