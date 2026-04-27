import { useQuery } from '@tanstack/react-query';
import { fetchAllPlaces, fetchPlaceDetail } from '@/shared/api/places';
import { fetchTags } from '@/shared/api/tags';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { CACHE_TTL } from '@/shared/constants/config';
import type { Place, Tag } from '@/types/models';

export interface UsePlacesListResult {
  places:    Place[];
  isLoading: boolean;
  isError:   boolean;
  refetch:   () => void;
}

export function usePlacesList(): UsePlacesListResult {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey:  QUERY_KEYS.PLACES.ALL(),
    queryFn:   fetchAllPlaces,
    staleTime: CACHE_TTL.USER_DATA,
  });

  return { places: data ?? [], isLoading, isError, refetch };
}

export interface UsePlaceDetailResult {
  place:     Place | null;
  isLoading: boolean;
}

export function usePlaceDetailForMap(id: number | null): UsePlaceDetailResult {
  const { data, isLoading } = useQuery({
    queryKey:  QUERY_KEYS.PLACES.DETAIL(id ?? 0),
    queryFn:   () => fetchPlaceDetail(id!),
    enabled:   id !== null,
    staleTime: CACHE_TTL.USER_DATA,
  });

  return { place: data ?? null, isLoading };
}

export interface UseTagsListResult {
  tags:      Tag[];
  isLoading: boolean;
}

export function useTagsList(): UseTagsListResult {
  const { data, isLoading } = useQuery({
    queryKey:  QUERY_KEYS.TAGS.LIST(),
    queryFn:   fetchTags,
    staleTime: CACHE_TTL.USER_DATA,
  });

  return { tags: data ?? [], isLoading };
}
