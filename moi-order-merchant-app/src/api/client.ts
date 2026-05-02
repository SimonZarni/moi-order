import axios from 'axios';

const BASE_URL =
  (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.EXPO_PUBLIC_API_URL) ??
  'http://localhost:8000/api/merchant/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 15_000,
});

// In-memory token ref — populated at login, avoids awaiting SecureStore in the interceptor
let _token: string | null = null;

export function setApiToken(token: string | null): void {
  _token = token;
}

apiClient.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Lazy import avoids circular dependency: store → client → store
      import('../store/authStore')
        .then(({ useAuthStore }) => useAuthStore.getState().logout())
        .catch(() => {});
    }
    return Promise.reject(error);
  },
);

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  status: number;
}

export function extractApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message ?? 'An error occurred.',
      code: error.response?.data?.code,
      errors: error.response?.data?.errors,
      status: error.response?.status ?? 0,
    };
  }
  return { message: 'An unexpected error occurred.', status: 0 };
}
