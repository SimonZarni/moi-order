export const POLL_INTERVAL = {
  ORDER_DETAIL: 5_000,
} as const;

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
export const MAX_GALLERY_PHOTOS = 8 as const;

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

// ── Social auth ───────────────────────────────────────────────────────────────
// Shared with moi-order-frontend — same Google project, same LINE channel.
export const GOOGLE_WEB_CLIENT_ID =
  (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID as string | undefined) ??
  '661538209777-nhtp07mb5guuhrd3128r80m83imtut6p.apps.googleusercontent.com';

export const GOOGLE_IOS_CLIENT_ID =
  (process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID as string | undefined) ??
  '661538209777-o33avjo80379ui26kj2clbn4snla6j2g.apps.googleusercontent.com';

export const LINE_CHANNEL_ID =
  (process.env.EXPO_PUBLIC_LINE_CHANNEL_ID as string | undefined) ?? '';

export const LINE_WEB_REDIRECT_URI =
  (process.env.EXPO_PUBLIC_LINE_WEB_REDIRECT_URI as string | undefined) ??
  'https://merchant.moiorder.com/auth/line/callback';

export const APPLE_WEB_CLIENT_ID =
  (process.env.EXPO_PUBLIC_APPLE_WEB_CLIENT_ID as string | undefined) ??
  'com.moiorder.merchantweb';

export const APPLE_WEB_REDIRECT_URI =
  (process.env.EXPO_PUBLIC_APPLE_WEB_REDIRECT_URI as string | undefined) ??
  'https://merchant.moiorder.com/auth/apple/callback';
