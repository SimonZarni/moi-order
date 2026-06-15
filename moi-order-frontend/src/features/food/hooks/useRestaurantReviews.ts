import { useQuery } from '@tanstack/react-query';
import { fetchRestaurantReviews } from '@/shared/api/reviews';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { RestaurantReview } from '@/types/models';

export interface UseRestaurantReviewsResult {
  reviews: RestaurantReview[];
  averageRating: number | null;
  totalReviews: number;
  isLoading: boolean;
}

export function useRestaurantReviews(restaurantId: number): UseRestaurantReviewsResult {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.RESTAURANTS.REVIEWS(restaurantId),
    queryFn:  () => fetchRestaurantReviews(restaurantId),
    staleTime: 5 * 60_000,
  });

  return {
    reviews:       data?.data ?? [],
    averageRating: data?.meta.average_rating ?? null,
    totalReviews:  data?.meta.total ?? 0,
    isLoading,
  };
}
