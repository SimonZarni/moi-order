import type { PaginatedResponse } from '../types/models';
import { apiClient } from './client';

export interface ReviewItem {
  id: string;
  order_number: string | null;
  rating: number;
  customer_review: string | null;
  user: { id: string; name: string };
  completed_at: string | null;
}

export interface ReviewsParams {
  rating?: number;
  page?: number;
  per_page?: number;
}

export async function getReviews(
  params?: ReviewsParams,
): Promise<PaginatedResponse<ReviewItem>> {
  const response = await apiClient.get<PaginatedResponse<ReviewItem>>(
    '/reviews',
    { params },
  );
  return response.data;
}
