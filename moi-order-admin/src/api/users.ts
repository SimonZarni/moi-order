import apiClient from './client';

export type UserStatus = 'active' | 'suspended' | 'banned';

export type UserData = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  status: UserStatus;
  date_of_birth: string | null;
  email_verified_at: string | null;
  created_at: string;
  deleted_at: string | null;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = { page?: number; per_page?: number; search?: string };

export const usersApi = {
  list: (params: ListParams) =>
    apiClient.get<{ data: UserData[]; meta: Meta }>('/users', { params }).then((r) => r.data),
  toggleAdmin: (id: number | string) =>
    apiClient
      .patch<{ data: UserData }>(`/users/${id}/toggle-admin`)
      .then((r) => r.data.data),
  destroy: (id: number | string) => apiClient.delete(`/users/${id}`),
  restore: (id: number | string) =>
    apiClient.patch<{ data: UserData }>(`/users/${id}/restore`).then((r) => r.data.data),
  suspend: (id: number | string) =>
    apiClient.patch<{ data: UserData }>(`/users/${id}/suspend`).then((r) => r.data.data),
  ban: (id: number | string) =>
    apiClient.patch<{ data: UserData }>(`/users/${id}/ban`).then((r) => r.data.data),
  activate: (id: number | string) =>
    apiClient.patch<{ data: UserData }>(`/users/${id}/activate`).then((r) => r.data.data),
};
