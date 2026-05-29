import { useQuery } from '@tanstack/react-query';
import { fetchRestaurantDetail } from '@/shared/api/restaurants';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { Restaurant } from '@/types/models';

export interface UseRestaurantDetailDataResult {
  restaurant:  Restaurant | undefined;
  isLoading:   boolean;
  isError:     boolean;
  refetch:     () => void;
}

export function useRestaurantDetailData(id: number): UseRestaurantDetailDataResult {
  const query = useQuery({
    queryKey: QUERY_KEYS.RESTAURANTS.DETAIL(id),
    queryFn:  () => fetchRestaurantDetail(id),
    enabled:  id > 0,
  });

  return {
    restaurant: query.data,
    isLoading:  query.isLoading,
    isError:    query.isError,
    refetch:    query.refetch,
  };
}
