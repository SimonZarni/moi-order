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
  return config;
});

let redirectingToLogin = false;

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !redirectingToLogin) {
      redirectingToLogin = true;
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/sign-in';
    }
    if (error.response?.status === 429) {
      console.warn('[API] Rate limit hit — too many requests.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
