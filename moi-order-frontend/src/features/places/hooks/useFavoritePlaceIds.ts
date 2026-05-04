import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchFavoritePlaceIds, toggleFavorite, FavoriteStatus } from '@/shared/api/favorites';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { useAuthStore } from '@/shared/store/authStore';

export interface UseFavoritePlaceIdsResult {
  favoriteIds: Set<number>;
  isLoading: boolean;
  isFavorited: (placeId: number) => boolean;
  toggleFavoriteMutation: (placeId: number) => void;
  isToggling: boolean;
}

/**
 * Principle: SRP — fetches all favorite place IDs once and exposes a toggle
 *   that optimistically updates the set without N individual status queries.
 */
export function useFavoritePlaceIds(): UseFavoritePlaceIdsResult {
  const isLoggedIn  = useAuthStore((s) => s.isLoggedIn);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.FAVORITES.IDS,
    queryFn:  fetchFavoritePlaceIds,
    enabled:  isLoggedIn,
    staleTime: CACHE_TTL.USER_DATA,
    select: (ids) => new Set(ids),
  });

  const mutation = useMutation({
    mutationFn: (placeId: number) => toggleFavorite(placeId),
    onMutate: async (placeId: number) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.FAVORITES.IDS });
      const previous = queryClient.getQueryData<number[]>(QUERY_KEYS.FAVORITES.IDS);
      queryClient.setQueryData<number[]>(QUERY_KEYS.FAVORITES.IDS, (old = []) =>
        old.includes(placeId) ? old.filter(id => id !== placeId) : [...old, placeId],
      );
      // Also sync the per-place cache so PlaceDetail heart stays in sync.
      const statusKey = QUERY_KEYS.FAVORITES.STATUS(placeId);
      const prev = queryClient.getQueryData<FavoriteStatus>(statusKey);
      queryClient.setQueryData<FavoriteStatus>(statusKey, { is_favorited: !(prev?.is_favorited ?? false) });
      return { previous };
    },
    onError: (_err, _placeId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(QUERY_KEYS.FAVORITES.IDS, context.previous);
      }
    },
    onSettled: (_data, _err, placeId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES.IDS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES.STATUS(placeId) });
    },
  });

  const favoriteIds = query.data ?? new Set<number>();

  return {
    favoriteIds,
    isLoading:   query.isLoading && isLoggedIn,
    isFavorited: (placeId) => favoriteIds.has(placeId),
    toggleFavoriteMutation: (placeId) => mutation.mutate(placeId),
    isToggling:  mutation.isPending,
  };
}
