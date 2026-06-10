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

export type KycApplicationType = 'initial' | 'resubmission';

export type KycApplication = {
  id: number;
  type: KycApplicationType;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  shop_id: number | null;
  business_name: string;
  business_type: string;
  business_address: string;
  business_phone: string | null;
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
  business_phone: string;
  documents: {
    national_id?: File;
    business_registration?: File;
    bank_book?: File;
    storefront_photo?: File;
  };
};

export type CreateMerchantResponse = {
  user: { id: number; name: string; email: string };
  token: string;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };
type KycListParams = { status?: string; type?: string; search?: string; page?: number; per_page?: number };

// ----------------------------------------------------------------------

export const merchantsApi = {
  getKycApplications: (params: KycListParams) =>
    apiClient
      .get<{ data: KycApplication[]; meta: Meta }>('/kyc-applications', { params })
      .then((r) => r.data),

  getKycApplication: (id: string) =>
    apiClient
      .get<{ data: KycApplication }>(`/kyc-applications/${id}`)
      .then((r) => r.data.data),

  reviewKycApplication: (id: string, action: 'approve' | 'reject', notes?: string) =>
    apiClient
      .post<{ data: KycApplication }>(`/kyc-applications/${id}/review`, {
        action,
        notes,
      })
      .then((r) => r.data.data),

  getKycBadgeCount: () =>
    apiClient
      .get<{ data: { count: number } }>('/merchants/kyc-badge')
      .then((r) => r.data.data.count),

  createMerchant: (payload: CreateMerchantPayload) => {
    const fd = new FormData();
    fd.append('name', payload.name);
    fd.append('email', payload.email);
    fd.append('password', payload.password);
    fd.append('business_name', payload.business_name);
    fd.append('business_type', payload.business_type);
    fd.append('business_address', payload.business_address);
    if (payload.business_phone) fd.append('business_phone', payload.business_phone);
    if (payload.documents.national_id)           fd.append('documents[national_id]',           payload.documents.national_id);
    if (payload.documents.business_registration) fd.append('documents[business_registration]', payload.documents.business_registration);
    if (payload.documents.bank_book)             fd.append('documents[bank_book]',             payload.documents.bank_book);
    if (payload.documents.storefront_photo)      fd.append('documents[storefront_photo]',      payload.documents.storefront_photo);
    return apiClient
      .post<{ data: CreateMerchantResponse }>('/merchants', fd)
      .then((r) => r.data.data);
  },
};
