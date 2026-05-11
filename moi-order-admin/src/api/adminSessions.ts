import apiClient from './client';

export type AdminSession = {
  id: number;
  is_current: boolean;
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

export const adminSessionsApi = {
  list: () =>
    apiClient
      .get<{ data: AdminSession[] }>('/sessions')
      .then((r) => r.data.data),

  revoke: (tokenId: number) =>
    apiClient.delete(`/sessions/${tokenId}`),

  revokeOthers: () =>
    apiClient.delete('/sessions/others'),
};
