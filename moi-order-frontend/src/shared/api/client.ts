/**
 * Principle: DIP — all HTTP calls go through this single Axios instance.
 * Principle: SRP — this file owns token attachment, error normalisation, and 401 logout only.
 * Security: token read from in-memory ref (populated at login); SecureStore is async and
 *           must never be awaited inside the request interceptor per request.
 */
import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

import { TOKEN_KEY } from '@/shared/constants/config';
import { ApiError } from '@/types/models';

// In-memory token ref — populated by authStore on login, cleared on logout.
// Avoids async SecureStore reads inside the synchronous request interceptor.
let _accessToken: string | null = null;
let _locale: string = 'en';

export function setMemoryToken(token: string | null): void {
  _accessToken = token;
}

export function setMemoryLocale(locale: string): void {
  _locale = locale;
}

const apiClient = axios.create({
  baseURL: process.env['EXPO_PUBLIC_API_URL'],
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  if (_accessToken !== null) {
    config.headers['Authorization'] = `Bearer ${_accessToken}`;
  }
  config.headers['Accept-Language'] = _locale;
  return config;
});

// ── Response interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; code?: string; errors?: Record<string, string[]> }>) => {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;

    const apiError: ApiError = {
      message: data?.message ?? 'Something went wrong.',
      code: data?.code ?? 'internal',
      ...(data?.errors !== undefined && { errors: data.errors }),
      status,
    };

    // 401 — clear credentials and let the UI react via authStore
    if (status === 401) {
      _accessToken = null;
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      // authStore listener imported lazily to avoid circular deps
      const { useAuthStore } = await import('@/shared/store/authStore');
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(apiError);
  },
);

export default apiClient;
