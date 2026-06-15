import apiClient from './client';
import { FoodOrder, RestaurantReviewsResponse } from '@/types/models';
import { ApiResponse } from '@/types/models';

export async function submitOrderReview(
  orderId: string,
  rating: number,
  review: string | null,
): Promise<FoodOrder> {
  const res = await apiClient.post<ApiResponse<FoodOrder>>(
    `/api/v1/food-orders/${orderId}/review`,
    { rating, review },
  );
  return res.data.data;
}

export async function fetchRestaurantReviews(
  restaurantId: number,
  page = 1,
): Promise<RestaurantReviewsResponse> {
  const res = await apiClient.get<RestaurantReviewsResponse>(
    `/api/v1/restaurants/${restaurantId}/reviews`,
    { params: { page, per_page: 20 } },
  );
  return res.data;
}
