import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRestaurant, updateRestaurant, type OpeningHourInput } from '../../../api/restaurant';
import { extractApiError } from '../../../api/client';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import type { Restaurant } from '../../../types/models';

export interface UseOperatingHoursDataResult {
  restaurant: Restaurant | null;
  isLoading: boolean;
  isSaving: boolean;
  saveError: string | null;
  saveHours: (hours: OpeningHourInput[]) => void;
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
    onSuccess: setCache,
    onError: (error) => {
      const apiError = extractApiError(error);
      setSaveError(apiError.message ?? 'Could not save hours. Check the time format (HH:MM).');
    },
  });

  const clearSaveError = useCallback(() => setSaveError(null), []);

  return { restaurant, isLoading, isSaving, saveError, saveHours, clearSaveError };
}
