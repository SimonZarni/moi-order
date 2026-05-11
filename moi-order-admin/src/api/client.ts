import type { ApiError } from 'src/types';

import axios from 'axios';

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

apiClient.interceptors.request.use((config) => {
  // For FormData, remove the default application/json Content-Type so the browser
  // can set multipart/form-data with the correct boundary automatically.
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

    // Guard against redirect loops: if we are already on the sign-in page (e.g. the
    // initial session check on app load returns 401), let the auth context handle it
    // via React state rather than triggering a hard navigation to the same URL.
    if (status === 401 && !redirectingToLogin && window.location.pathname !== '/sign-in') {
      redirectingToLogin = true;
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
