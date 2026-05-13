import apiClient from './client';

export type UserStatus = 'active' | 'suspended' | 'banned';

export type ConnectedChannel = { connected: boolean; value?: string | null };

export type UserRole = 'regular' | 'privileged';

export type UserData = {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  profile_picture_url: string | null;
  is_admin: boolean;
  is_merchant: boolean;
  is_privileged: boolean;
  user_role: UserRole;
  is_moi_verified: boolean;
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
  uuid: string;
  type: string;
  type_label: string;
  subtype: string | null;
  file_url: string | null;
  extracted_data: Record<string, string | null>;
  expiry_date: string | null;
  extension_date: string | null;
  is_valid_type: boolean;
  validation_message: string | null;
  is_admin_created: boolean;
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

export type ServiceSubmissionSummary = {
  id: number;
  status: string;
  status_label: string;
  service_name: string;
  type_name: string | null;
  created_at: string;
};

export type UserDetailData = UserData & {
  documents: UserDocument[];
  recent_ticket_orders: TicketOrderSummary[];
  recent_food_orders: FoodOrderSummary[];
  service_submissions: ServiceSubmissionSummary[];
};

export type CreateDocumentPayload = {
  type: string;
  subtype: string;
  expiry_date?: string | null;
  extension_date?: string | null;
  is_valid_type?: boolean;
  validation_message?: string | null;
  extracted_data?: Record<string, string>;
  image?: File | null;
};

function buildDocFormData(payload: CreateDocumentPayload): FormData {
  const fd = new FormData();
  fd.append('type', payload.type);
  fd.append('subtype', payload.subtype);
  if (payload.expiry_date)    fd.append('expiry_date',    payload.expiry_date);
  if (payload.extension_date) fd.append('extension_date', payload.extension_date);
  // Always append so the backend can save or clear the note (empty string → null on backend)
  fd.append('validation_message', payload.validation_message ?? '');
  fd.append('is_valid_type', (payload.is_valid_type ?? true) ? '1' : '0');
  if (payload.extracted_data) {
    Object.entries(payload.extracted_data).forEach(([k, v]) => {
      if (v) fd.append(`extracted_data[${k}]`, v);
    });
  }
  if (payload.image) fd.append('image', payload.image);
  return fd;
}

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = { page?: number; per_page?: number; search?: string };

export const usersApi = {
  list: (params: ListParams) =>
    apiClient.get<{ data: UserData[]; meta: Meta }>('/users', { params }).then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<{ data: UserDetailData }>(`/users/${id}`).then((r) => r.data.data),
  toggleAdmin: (id: number | string) =>
    apiClient.patch<{ data: UserData }>(`/users/${id}/toggle-admin`).then((r) => r.data.data),
  promoteRole: (id: number | string, role: UserRole) =>
    apiClient.patch<{ data: UserData }>(`/users/${id}/role`, { role }).then((r) => r.data.data),
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
    create: (userId: number | string, payload: CreateDocumentPayload) => {
      const fd = buildDocFormData(payload);
      // Do NOT set Content-Type manually — Axios sets multipart/form-data + boundary automatically
      return apiClient.post<{ data: UserDocument }>(`/users/${userId}/documents`, fd).then((r) => r.data.data);
    },
    update: (userId: number | string, documentUuid: string, payload: CreateDocumentPayload) => {
      const fd = buildDocFormData(payload);
      // Use PATCH directly — _method spoofing is unreliable on API routes in Laravel 12.
      // Document uses uuid as route key (HasUuid trait) — never pass the integer id here.
      // Do NOT set Content-Type manually — Axios sets multipart/form-data + boundary automatically.
      return apiClient.patch<{ data: UserDocument }>(`/users/${userId}/documents/${documentUuid}`, fd).then((r) => r.data.data);
    },
    delete: (userId: number | string, documentUuid: string) =>
      // Document uses uuid as route key — never pass the integer id here.
      apiClient.delete(`/users/${userId}/documents/${documentUuid}`),
  },
};
