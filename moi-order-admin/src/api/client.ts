import axios from 'axios';

export const TOKEN_KEY = 'admin_token';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
    if (error.response?.status === 401 && !redirectingToLogin) {
      redirectingToLogin = true;
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/sign-in';
    }
    if (error.response?.status === 403) {
      const message =
        error.response.data?.message ?? "You don't have permission to perform this action.";
      window.dispatchEvent(new CustomEvent('api:forbidden', { detail: { message } }));
    }
    if (error.response?.status === 429) {
      console.warn('[API] Rate limit hit — too many requests.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
