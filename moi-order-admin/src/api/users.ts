import apiClient from './client';

export type UserStatus = 'active' | 'suspended' | 'banned';

export type ConnectedChannel = { connected: boolean; value?: string | null };

export type UserData = {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  profile_picture_url: string | null;
  is_admin: boolean;
  is_merchant: boolean;
  is_online: boolean;
  last_active_at: string | null;
  status: UserStatus;
  suspended_until: string | null;
  date_of_birth: string | null;
  email_verified_at: string | null;
  created_at: string;
  deleted_at: string | null;
  connected_channels: {
    email: ConnectedChannel;
    phone: ConnectedChannel;
    google: ConnectedChannel;
    apple: ConnectedChannel;
    line: ConnectedChannel;
  };
};

export type UserDocument = {
  id: number;
  type: string;
  type_label: string;
  subtype: string | null;
  expiry_date: string | null;
  extension_date: string | null;
  is_valid_type: boolean;
  validation_message: string | null;
  created_at: string;
};

export type TicketOrderSummary = {
  id: number;
  status: string;
  status_label: string;
  visit_date: string;
  created_at: string;
  ticket_name: string | null;
};

export type FoodOrderSummary = {
  id: number;
  status: string;
  order_number: string | null;
  total: number | null;
  created_at: string;
  restaurant_name: string | null;
};

export type UserDetailData = UserData & {
  documents: UserDocument[];
  recent_ticket_orders: TicketOrderSummary[];
  recent_food_orders: FoodOrderSummary[];
};

export type CreateDocumentPayload = {
  type: string;
  subtype?: string | null;
  expiry_date?: string | null;
  extension_date?: string | null;
  is_valid_type?: boolean;
  validation_message?: string | null;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = { page?: number; per_page?: number; search?: string };

export const usersApi = {
  list: (params: ListParams) =>
    apiClient.get<{ data: UserData[]; meta: Meta }>('/users', { params }).then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<{ data: UserDetailData }>(`/users/${id}`).then((r) => r.data.data),
  toggleAdmin: (id: number | string) =>
    apiClient.patch<{ data: UserData }>(`/users/${id}/toggle-admin`).then((r) => r.data.data),
  destroy: (id: number | string) => apiClient.delete(`/users/${id}`),
  restore: (id: number | string) =>
    apiClient.patch<{ data: UserData }>(`/users/${id}/restore`).then((r) => r.data.data),
  suspend: (id: number | string, suspendedUntil: string | null) =>
    apiClient
      .patch<{ data: UserData }>(`/users/${id}/suspend`, { suspended_until: suspendedUntil })
      .then((r) => r.data.data),
  ban: (id: number | string) =>
    apiClient.patch<{ data: UserData }>(`/users/${id}/ban`).then((r) => r.data.data),
  activate: (id: number | string) =>
    apiClient.patch<{ data: UserData }>(`/users/${id}/activate`).then((r) => r.data.data),
  documents: {
    list: (userId: number | string) =>
      apiClient.get<{ data: UserDocument[] }>(`/users/${userId}/documents`).then((r) => r.data.data),
    create: (userId: number | string, payload: CreateDocumentPayload) =>
      apiClient.post<{ data: UserDocument }>(`/users/${userId}/documents`, payload).then((r) => r.data.data),
    delete: (userId: number | string, documentId: number | string) =>
      apiClient.delete(`/users/${userId}/documents/${documentId}`),
  },
};
