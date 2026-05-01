import apiClient from './client';

// ----------------------------------------------------------------------

export type KycDocumentType =
  | 'national_id'
  | 'business_registration'
  | 'bank_book'
  | 'storefront_photo';

export type KycDocument = {
  id: number;
  type: KycDocumentType;
  type_label: string;
  url: string;
  created_at: string;
};

export type KycApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected';

export type KycApplication = {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  business_name: string;
  business_type: string;
  business_address: string;
  status: KycApplicationStatus;
  status_label: string;
  review_notes: string | null;
  reviewed_at: string | null;
  submitted_at: string | null;
  documents: KycDocument[];
  created_at: string;
};

export type CreateMerchantPayload = {
  name: string;
  email: string;
  password: string;
  business_name: string;
  business_type: string;
  business_address: string;
};

export type CreateMerchantResponse = {
  user: { id: number; name: string; email: string };
  token: string;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };
type KycListParams = { status?: string; page?: number; per_page?: number };

// ----------------------------------------------------------------------

export const merchantsApi = {
  getKycApplications: (params: KycListParams) =>
    apiClient
      .get<{ data: KycApplication[]; meta: Meta }>('/api/admin/v1/kyc-applications', { params })
      .then((r) => r.data),

  getKycApplication: (id: string) =>
    apiClient
      .get<{ data: KycApplication }>(`/api/admin/v1/kyc-applications/${id}`)
      .then((r) => r.data.data),

  reviewKycApplication: (id: string, action: 'approve' | 'reject', notes?: string) =>
    apiClient
      .post<{ data: KycApplication }>(`/api/admin/v1/kyc-applications/${id}/review`, {
        action,
        notes,
      })
      .then((r) => r.data.data),

  getKycBadgeCount: () =>
    apiClient
      .get<{ data: { count: number } }>('/api/admin/v1/merchants/kyc-badge')
      .then((r) => r.data.data.count),

  createMerchant: (payload: CreateMerchantPayload) =>
    apiClient
      .post<{ data: CreateMerchantResponse }>('/api/admin/v1/merchants', payload)
      .then((r) => r.data.data),
};
