import { useQuery } from '@tanstack/react-query';

import { HomeCard } from '@/types/models';
import { fetchHomeCards } from '@/shared/api/homeCards';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';

export interface UseHomeCardsResult {
  cards: HomeCard[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useHomeCards(): UseHomeCardsResult {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.HOME_CARDS.LIST,
    queryFn:  fetchHomeCards,
    staleTime: CACHE_TTL.USER_DATA,
    gcTime:    CACHE_TTL.GC_EXTENDED,
  });

  return {
    cards: data ?? [],
    isLoading: isPending,
    isError,
    refetch,
  };
}
