import apiClient from './client';

export type SubmissionStatus = 'pending_payment' | 'processing' | 'completed' | 'payment_failed' | 'cancelled';

export type SubmissionDocumentData = {
  id: number;
  document_type: string;
  label: string;
  label_mm: string;
  signed_url: string;
};

export type SubmissionListItem = {
  id: number;
  status: string;
  status_label: string;
  price_snapshot: number | null;
  completed_at: string | null;
  created_at: string;
  user: { id: number; name: string; email: string } | null;
  service_type: { id: number; name: string; name_mm: string | null; service: { id: number; name: string; name_mm: string | null; slug: string } | null } | null;
  documents: SubmissionDocumentData[];
};

export type SubmissionDetailData = SubmissionListItem & {
  submission_data: Record<string, string> | null;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  service_id?: number | string;
};

export const submissionsApi = {
  list: (params: ListParams) =>
    apiClient
      .get<{ data: SubmissionListItem[]; meta: Meta }>('/submissions', { params })
      .then((r) => r.data),
  get: (id: number | string) =>
    apiClient
      .get<{ data: SubmissionDetailData }>(`/submissions/${id}`)
      .then((r) => r.data.data),
  updateStatus: (id: number | string, status: SubmissionStatus) =>
    apiClient.patch(`/submissions/${id}/status`, { status }),
};
