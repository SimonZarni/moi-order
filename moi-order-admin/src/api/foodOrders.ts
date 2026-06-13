import apiClient from './client';

export type FoodOrderStatus =
  | 'order_placed'
  | 'waiting_for_payment'
  | 'payment_confirmed'
  | 'preparing_food'
  | 'waiting_for_delivery'
  | 'delivery_on_the_way'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type FoodPaymentMethod = 'cod' | 'prompt_pay';

export type FoodOrderListItem = {
  id: string;
  order_number: string | null;
  status: FoodOrderStatus;
  status_label: string;
  payment_method: FoodPaymentMethod;
  total_cents: number;
  delivery_address: string | null;
  restaurant: { id: number; name: string };
  user: { id: string; name: string; email: string; phone: string | null };
  confirmed_at: string | null;
  payment_confirmed_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
};

export type FoodOrderItemDetail = {
  id: number;
  name: string;
  quantity: number;
  price_cents: number;
  subtotal_cents: number;
  notes: string | null;
};

export type FoodOrderDetail = Omit<FoodOrderListItem, 'restaurant'> & {
  restaurant: { id: number; name: string; phone: string | null };
  subtotal_cents: number;
  customer_notes: string | null;
  contact_no: string | null;
  prompt_pay_url: string | null;
  items: FoodOrderItemDetail[];
  preparing_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };
type ListParams = {
  page?: number;
  per_page?: number;
  status?: string;
  restaurant_id?: number;
  search?: string;
};

type ExportParams = Omit<ListParams, 'page' | 'per_page'>;

export type ReviewListItem = {
  id: string;
  order_number: string | null;
  rating: number;
  customer_review: string | null;
  restaurant: { id: number; name: string };
  user: { id: string; name: string };
  completed_at: string | null;
};

type ReviewListParams = {
  page?: number;
  per_page?: number;
  restaurant_id?: number;
  rating?: number;
  search?: string;
};

export const foodOrdersApi = {
  list: (params: ListParams) =>
    apiClient
      .get<{ data: FoodOrderListItem[]; meta: Meta }>('/food-orders', { params })
      .then((r) => r.data),
  get: (id: number | string) =>
    apiClient
      .get<{ data: FoodOrderDetail }>(`/food-orders/${id}`)
      .then((r) => r.data.data),
  confirmPayment: (id: number | string) =>
    apiClient
      .post<{ data: FoodOrderDetail }>(`/food-orders/${id}/confirm-payment`)
      .then((r) => r.data.data),
  export: (params: ExportParams) =>
    apiClient.get<Blob>('/food-orders/export', { params, responseType: 'blob' }).then((r) => r.data),
  reviews: (params: ReviewListParams) =>
    apiClient
      .get<{ data: ReviewListItem[]; meta: Meta }>('/food-orders/reviews', { params })
      .then((r) => r.data),
};
