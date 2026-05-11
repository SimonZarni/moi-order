import apiClient from './client';

export type AdminSession = {
  id: number;
  is_current: boolean;
  device: string | null;
  ip_address: string | null;
  location: string | null;
  last_used_at: string | null;
  created_at: string;
  expires_at: string | null;
  admin: {
    id: string;
    name: string;
    email: string;
    role: { slug: string; label: string } | null;
  } | null;
};

export type AdminSessionMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export const adminSessionsApi = {
  list: (page = 1) =>
    apiClient
      .get<{ data: AdminSession[]; meta: AdminSessionMeta }>('/sessions', { params: { page } })
      .then((r) => r.data),

  revoke: (tokenId: number) =>
    apiClient.delete(`/sessions/${tokenId}`),

  revokeOthers: () =>
    apiClient.delete('/sessions/others'),
};
