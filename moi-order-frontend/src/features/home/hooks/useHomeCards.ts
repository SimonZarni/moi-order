import { useQuery } from '@tanstack/react-query';

import { HomeCard } from '@/types/models';
import { fetchHomeCards } from '@/shared/api/homeCards';

export interface UseHomeCardsResult {
  cards: HomeCard[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useHomeCards(): UseHomeCardsResult {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['home-cards'],
    queryFn: fetchHomeCards,
    staleTime: 5 * 60 * 1000,
  });

  return {
    cards: data ?? [],
    isLoading,
    isError,
    refetch,
  };
}
