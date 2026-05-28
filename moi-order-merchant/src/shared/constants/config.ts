export const CACHE_TTL = {
  DEFAULT:    30_000,         // 30s
  ORDERS:     60_000,         // 1 min — was 30s (removed refetchInterval; pull-to-refresh handles updates)
  ANALYTICS:  120_000,        // 2 min — was 60s (removed refetchInterval)
  MENU:       10 * 60_000,    // 10 min — menu rarely changes; prefetched at login
  USER:       300_000,        // 5 min
  RESTAURANT: 300_000,        // 5 min
} as const;

export const GC_TIME = {
  DEFAULT: 10 * 60_000,  // 10 min — keep data in cache on screen switch
} as const;

export const PAGINATION = {
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 100,
} as const;

export const WEB_SIDEBAR_WIDTH = 260 as const;

export const TOKEN_KEY = 'merchant_token' as const;

export const OTP_PIN_LENGTH = 6 as const;

// Fail fast: 1 retry so errors surface in ~2s not ~7s
export const QUERY_RETRY = 1 as const;
