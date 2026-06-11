/**
 * Principle: DIP — all HTTP calls go through this single Axios instance.
 * Principle: SRP — this file owns token attachment, error normalisation, and 401 logout only.
 * Security: token read from in-memory ref (populated at login); SecureStore is async and
 *           must never be awaited inside the request interceptor per request.
 */
import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

import { TOKEN_KEY } from '@/shared/constants/config';
import { ERROR_CODES, getAccountErrorMessage } from '@/shared/constants/errorCodes';
import { getMaintenanceEpoch, shouldIgnoreMaintenanceNavigation } from '@/shared/maintenance/maintenanceState';
import { ApiError } from '@/types/models';

// Inline translations — avoids circular: client → i18n → localeStore → client
const _FILE_TOO_LARGE: Record<string, string> = {
  en: 'Could not upload. Total upload size is too large (max 50 MB per request).',
  mm: 'တင်မရပါ။ ဖိုင်အရွယ်အစားသည် အကြီးဆုံး 50 MB ဖြစ်သည်',
  th: 'ไม่สามารถอัปโหลดได้ ขนาดไฟล์รวมใหญ่เกินไป (สูงสุด 50 MB)',
};

// In-memory token ref — populated by authStore on login, cleared on logout.
// Avoids async SecureStore reads inside the synchronous request interceptor.
let _accessToken: string | null = null;
let _locale: string = 'mm';

export function setMemoryToken(token: string | null): void {
  _accessToken = token;
}

export function setMemoryLocale(locale: string): void {
  _locale = locale;
}

const apiClient = axios.create({
  baseURL: process.env['EXPO_PUBLIC_API_URL'],
  timeout: 120_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  if (_accessToken !== null) {
    config.headers['Authorization'] = `Bearer ${_accessToken}`;
  }
  config.headers['Accept-Language'] = _locale;
  (config as typeof config & { _maintenanceEpoch?: number })._maintenanceEpoch = getMaintenanceEpoch();
  return config;
});

// ── Response interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; code?: string; errors?: Record<string, string[]>; context?: Record<string, string> }>) => {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;

    // Only pass through the known-safe context fields used by the UI.
    // This prevents accidental backend data leakage (e.g. internal IDs, paths)
    // from reaching UI code if the server ever attaches extra context fields.
    const suspendedUntil = data?.context?.['suspended_until'];
    const safeContext: Record<string, string> | undefined = suspendedUntil !== undefined
      ? { suspended_until: suspendedUntil }
      : undefined;

    const apiError: ApiError = {
      message: status === 413
        ? (_FILE_TOO_LARGE[_locale] ?? _FILE_TOO_LARGE['en']!)
        : (data?.message ?? 'Something went wrong.'),
      code: status === 413 ? 'file_too_large' : (data?.code ?? 'internal'),
      ...(data?.errors   !== undefined && { errors:  data.errors }),
      ...(safeContext     !== undefined && { context: safeContext }),
      status,
    };

    // 503 — server is in maintenance mode; navigate to the maintenance screen.
    // Import navigationRef lazily to avoid circular deps (client ← navigationRef ← @react-navigation).
    if (status === 503) {
      const body = error.response?.data as { message?: string; details?: string; retry_after?: number } | undefined;
      const requestEpoch = (error.config as { _maintenanceEpoch?: number } | undefined)?._maintenanceEpoch;
      const { navigationRef } = await import('@/shared/navigation/navigationRef');
      const currentRoute = navigationRef.getCurrentRoute();
      if (
        navigationRef.isReady() &&
        currentRoute?.name !== 'Maintenance' &&
        !shouldIgnoreMaintenanceNavigation(requestEpoch)
      ) {
        const params: { message: string; details: string; retryAfter?: number } = {
          message: body?.message ?? 'System Upgrade',
          details: body?.details ?? 'We are updating our services. Please check back shortly.',
        };
        if (body?.retry_after !== undefined) params.retryAfter = body.retry_after;
        navigationRef.navigate('Maintenance', params);
      }
    }

    // 401 — clear credentials and let the UI react via authStore
    if (status === 401) {
      _accessToken = null;
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      // authStore listener imported lazily to avoid circular deps
      const { useAuthStore } = await import('@/shared/store/authStore');
      useAuthStore.getState().clearAuth();
    }

    // 403 account.suspended / account.banned mid-session — the admin acted after the
    // token was issued. Tokens are revoked on suspend/ban so this is a race-condition
    // defence: log out immediately and inform the user.
    const accountCode = data?.code;
    const isAccountRestriction =
      accountCode === ERROR_CODES.ACCOUNT_SUSPENDED ||
      accountCode === ERROR_CODES.ACCOUNT_BANNED;

    if (status === 403 && isAccountRestriction && _accessToken !== null) {
      _accessToken = null;
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      const { useAuthStore } = await import('@/shared/store/authStore');
      useAuthStore.getState().clearAuth();
      Alert.alert('Account Restricted', getAccountErrorMessage(accountCode!, data?.context));
    }

    return Promise.reject(apiError);
  },
);

export default apiClient;
