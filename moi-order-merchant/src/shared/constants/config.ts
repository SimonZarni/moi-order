export const CACHE_TTL = {
  DEFAULT:       30_000,
  ORDERS:        60_000,
  ANALYTICS:    120_000,
  MENU:      10 * 60_000,
  USER:         300_000,
  RESTAURANT:   300_000,
  NOTIFICATIONS: 30_000,
} as const;

export const GC_TIME = {
  DEFAULT: 10 * 60_000,
} as const;

export const PAGINATION = {
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 100,
} as const;

export const WEB_SIDEBAR_WIDTH = 260 as const;
export const TOKEN_KEY          = 'merchant_token' as const;
export const OTP_PIN_LENGTH     = 6 as const;
export const QUERY_RETRY        = 1 as const;

// ── API base ──────────────────────────────────────────────────────────────────
const _apiBase =
  (process.env.EXPO_PUBLIC_API_URL as string | undefined) ??
  'https://api.moiorder.com/api/merchant/v1';

// ── WebSocket — Pusher ────────────────────────────────────────────────────────
// Same Pusher account used by the user frontend (EXPO_PUBLIC_PUSHER_KEY)
// and admin dashboard (VITE_PUSHER_KEY). Keeping the same naming convention.
export const PUSHER_APP_KEY     = (process.env.EXPO_PUBLIC_PUSHER_KEY     as string | undefined) ?? '';
export const PUSHER_APP_CLUSTER = (process.env.EXPO_PUBLIC_PUSHER_CLUSTER as string | undefined) ?? 'ap1';

// Broadcast auth — Laravel channel auth endpoint (routes/api.php: Broadcast::routes).
export const BROADCAST_AUTH_URL = `${_apiBase}/broadcasting/auth` as const;
