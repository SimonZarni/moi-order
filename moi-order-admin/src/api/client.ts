import type { ApiError } from 'src/types';
import type { InternalAxiosRequestConfig } from 'axios';

import axios from 'axios';

// Extend Axios config to carry the pathname captured at request time.
// This prevents a race condition where the initial /auth/me session check
// (started on /sign-in before any login) completes after the user has already
// logged in and navigated to the dashboard — causing a spurious 401 redirect.
type ExtendedAxiosRequestConfig = InternalAxiosRequestConfig & {
  _originPathname?: string;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // withCredentials tells the browser to include the httpOnly admin_token cookie on every
  // request. The server's AdminTokenFromCookie middleware converts it to a Bearer header.
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: ExtendedAxiosRequestConfig) => {
  config._originPathname = window.location.pathname;

  const token = sessionStorage.getItem('admin_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

let redirectingToLogin = false;

apiClient.interceptors.response.use(
  (response) => {
    // Reset flag on any successful response so a freshly-logged-in session
    // isn't silently blocked from redirecting on a subsequent 401.
    redirectingToLogin = false;
    return response;
  },
  (error) => {
    const status = error.response?.status as number | undefined;
    const data   = error.response?.data as
      | { message?: string; code?: string; errors?: Record<string, string[]> }
      | undefined;

    // Only redirect to sign-in if the request itself originated from a protected
    // page (not /sign-in). This prevents the initial session-check /auth/me — fired
    // on mount while on /sign-in — from triggering a redirect if the user logs in
    // and navigates to the dashboard before that request resolves.
    const originPathname = (error.config as ExtendedAxiosRequestConfig | undefined)?._originPathname;
    if (status === 401 && !redirectingToLogin && originPathname !== '/sign-in') {
      redirectingToLogin = true;
      sessionStorage.removeItem('admin_token');
      window.location.href = '/sign-in';
    }
    if (status === 403) {
      const message = data?.message ?? "You don't have permission to perform this action.";
      window.dispatchEvent(new CustomEvent('api:forbidden', { detail: { message } }));
    }
    if (status === 429) {
      console.warn('[API] Rate limit hit — too many requests.');
    }

    const apiError: ApiError = {
      message: data?.message ?? 'An unexpected error occurred.',
      code:    data?.code    ?? 'internal',
      errors:  data?.errors,
      status:  status        ?? 0,
    };
    return Promise.reject(apiError);
  }
);

export default apiClient;
