import apiClient from './client';

export type TicketVariantData = {
  id: number;
  name: string;
  description: string;
  price: number;
  sort_order: number;
};

export type AttractionData = {
  id: number;
  name: string;
  highlight_description: string;
  description: string;
  city: string;
  province: string;
  address: string;
  cover_image_url: string | null;
  starting_from_price: number | null;
  variants?: TicketVariantData[];
};

export type AttractionStatus = 'active' | 'inactive';

type Meta = { current_page: number; last_page: number; per_page: number; total: number };

type ListParams = { page?: number; per_page?: number; search?: string };

export const attractionsApi = {
  list: (params: ListParams) =>
    apiClient.get<{ data: AttractionData[]; meta: Meta }>('/tickets', { params }).then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<{ data: AttractionData }>(`/tickets/${id}`).then((r) => r.data.data),
  create: (formData: FormData) =>
    apiClient
      .post<{ data: AttractionData }>('/tickets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data),
  update: (id: number | string, payload: Record<string, unknown>) =>
    apiClient.put<{ data: AttractionData }>(`/tickets/${id}`, payload).then((r) => r.data.data),
  remove: (id: number | string) => apiClient.delete(`/tickets/${id}`),
  createVariant: (ticketId: number | string, payload: Record<string, unknown>) =>
    apiClient
      .post<{ data: TicketVariantData }>(`/tickets/${ticketId}/variants`, payload)
      .then((r) => r.data.data),
  updateVariant: (
    ticketId: number | string,
    variantId: number | string,
    payload: Record<string, unknown>
  ) =>
    apiClient
      .put<{ data: TicketVariantData }>(`/tickets/${ticketId}/variants/${variantId}`, payload)
      .then((r) => r.data.data),
  listVariants: (ticketId: number | string) =>
    apiClient
      .get<{ data: TicketVariantData[] }>(`/tickets/${ticketId}/variants`)
      .then((r) => r.data.data),
  deleteVariant: (ticketId: number | string, variantId: number | string) =>
    apiClient.delete(`/tickets/${ticketId}/variants/${variantId}`),
};
