import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRestaurant, updateRestaurant, toggleOpeningHourSessionMenu, type OpeningHourInput } from '../../../api/restaurant';
import { extractApiError } from '../../../api/client';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import type { Restaurant } from '../../../types/models';
import type { GetRestaurantResult } from '../../../api/restaurant';

export interface UseOperatingHoursDataResult {
  restaurant: Restaurant | null;
  isLoading: boolean;
  isSaving: boolean;
  saveError: string | null;
  saveHours: (hours: OpeningHourInput[]) => void;
  toggleSessionMenu: (id: number, enabled: boolean) => void;
  clearSaveError: () => void;
}

export function useOperatingHoursData(): UseOperatingHoursDataResult {
  const queryClient = useQueryClient();
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.RESTAURANT,
    queryFn: getRestaurant,
    staleTime: CACHE_TTL.USER,
  });

  const restaurant = data?.restaurant ?? null;

  const setCache = useCallback((updated: Restaurant) => {
    queryClient.setQueryData(QUERY_KEYS.RESTAURANT, { restaurant: updated, prefill: null });
  }, [queryClient]);

  const { mutate: saveHours, isPending: isSaving } = useMutation({
    mutationFn: (hours: OpeningHourInput[]) => updateRestaurant({ opening_hours: hours }),
    onSuccess: (updated) => { setCache(updated); setSaveError(null); },
    onError: (error) => {
      const apiError = extractApiError(error);
      setSaveError(apiError.message ?? 'Could not save hours. Check the time format (HH:MM).');
    },
  });

  const clearSaveError = useCallback(() => setSaveError(null), []);

  // Instant toggle — optimistic update in local cache, no spinner needed
  const { mutate: toggleSessionMenuMutation } = useMutation({
    mutationFn: ({ id, enabled }: { id: number; enabled: boolean }) =>
      toggleOpeningHourSessionMenu(id, enabled),
    onMutate: ({ id, enabled }) => {
      // Optimistic: flip the flag in the cached restaurant data immediately
      queryClient.setQueryData<GetRestaurantResult>(QUERY_KEYS.RESTAURANT, (old) => {
        if (!old?.restaurant?.opening_hours) return old;
        return {
          ...old,
          restaurant: {
            ...old.restaurant,
            opening_hours: old.restaurant.opening_hours.map((day) => ({
              ...day,
              sessions: day.sessions.map((s) =>
                s.id === id ? { ...s, session_menu_enabled: enabled } : s,
              ),
            })),
          },
        };
      });
    },
    onError: () => {
      // Revert optimistic update on failure
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESTAURANT });
    },
  });

  const toggleSessionMenu = useCallback(
    (id: number, enabled: boolean) => toggleSessionMenuMutation({ id, enabled }),
    [toggleSessionMenuMutation],
  );

  return { restaurant, isLoading, isSaving, saveError, saveHours, toggleSessionMenu, clearSaveError };
}
