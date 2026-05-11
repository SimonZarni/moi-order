import type { AppUser } from 'src/types';

import apiClient from './client';

// ----------------------------------------------------------------------

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResult = {
  user: AppUser;
  // token is no longer returned — it lives in the httpOnly admin_token cookie set by the server.
};

// ----------------------------------------------------------------------

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient
      .post<{ data: LoginResult }>('/auth/login', payload)
      .then((r) => r.data.data),

  logout: () => apiClient.post('/auth/logout'),

  me: () =>
    apiClient
      .get<{ data: AppUser }>('/auth/me')
      .then((r) => r.data.data),
};
