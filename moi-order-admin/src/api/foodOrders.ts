import apiClient from './client';

export type FoodOrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
export type FoodPaymentMethod = 'credit_card' | 'line_pay' | 'cash';

export type FoodOrderListItem = {
  id: number;
  status: FoodOrderStatus;
  payment_method: FoodPaymentMethod;
  total_cents: number;
  delivery_address: string | null;
  restaurant: { id: number; name: string };
  user: { id: number; name: string; email: string };
  confirmed_at: string | null;
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
};

export type FoodOrderDetail = FoodOrderListItem & {
  subtotal_cents: number;
  customer_notes: string | null;
  items: FoodOrderItemDetail[];
  ready_at: string | null;
};

type Meta = { current_page: number; last_page: number; per_page: number; total: number };
type ListParams = {
  page?: number;
  per_page?: number;
  status?: string;
  restaurant_id?: number;
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
};
