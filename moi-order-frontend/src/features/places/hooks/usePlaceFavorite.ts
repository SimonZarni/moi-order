import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchFavoriteStatus, FavoriteStatus, toggleFavorite } from '@/shared/api/favorites';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { useAuthStore } from '@/shared/store/authStore';

export interface UsePlaceFavoriteResult {
  isFavorited: boolean;
  isStatusLoading: boolean;
  isToggling: boolean;
  handleToggle: () => void;
}

/**
 * Principle: SRP — owns favorite state and toggle for a single place.
 * Principle: DIP — all HTTP through typed api/favorites.ts functions; no axios import here.
 * Optimistic update: flips the cached value immediately on mutate, rolls back on error.
 * Guard: query is disabled when not logged in — no 401 risk.
 */
export function usePlaceFavorite(placeId: number): UsePlaceFavoriteResult {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const queryClient = useQueryClient();
  const statusKey = QUERY_KEYS.FAVORITES.STATUS(placeId);

  const query = useQuery({
    queryKey: statusKey,
    queryFn: () => fetchFavoriteStatus(placeId),
    enabled: isLoggedIn,
    staleTime: CACHE_TTL.USER_DATA,
  });

  const mutation = useMutation({
    mutationFn: () => toggleFavorite(placeId),
    // Optimistic: flip immediately so the heart responds at tap speed
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: statusKey });
      const previous = queryClient.getQueryData<FavoriteStatus>(statusKey);
      queryClient.setQueryData<FavoriteStatus>(statusKey, {
        is_favorited: !(previous?.is_favorited ?? false),
      });
      return { previous };
    },
    // Rollback on server error
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData<FavoriteStatus>(statusKey, context.previous);
      }
    },
    // Always re-sync from server after settle
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: statusKey });
    },
  });

  return {
    isFavorited: query.data?.is_favorited ?? false,
    isStatusLoading: query.isLoading && isLoggedIn,
    isToggling: mutation.isPending,
    handleToggle: () => { mutation.mutate(); },
  };
}
