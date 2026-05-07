import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchAllPlaces } from '@/shared/api/places';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { CACHE_TTL } from '@/shared/constants/config';
import { Category, Place } from '@/types/models';

export interface UsePlacesSearchResult {
  selectedCategory: number | null;
  filteredPlaces: Place[];
  categories: Category[];
  handleCategorySelect: (id: number | null) => void;
}

// Text search is handled server-side. This hook only applies category filtering
// on the already-server-filtered places. Categories are derived from the full
// dataset so the filter list stays stable even while search narrows the results.
export function usePlacesSearch(places: Place[]): UsePlacesSearchResult {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Shared with map and home search — zero extra network cost when already cached.
  const { data: allPlaces = [] } = useQuery({
    queryKey: QUERY_KEYS.PLACES.ALL(),
    queryFn:  fetchAllPlaces,
    staleTime: CACHE_TTL.USER_DATA,
  });
  const categories = useMemo((): Category[] => {
    const seen = new Set<number>();
    return allPlaces.reduce<Category[]>((acc, place) => {
      for (const cat of place.categories) {
        if (!seen.has(cat.id)) {
          seen.add(cat.id);
          acc.push(cat);
        }
      }
      return acc;
    }, []);
  }, [allPlaces]);

  const filteredPlaces = useMemo((): Place[] => {
    if (selectedCategory === null) return places;
    return places.filter((place) => place.categories.some(c => c.id === selectedCategory));
  }, [places, selectedCategory]);

  const handleCategorySelect = useCallback((id: number | null): void => {
    setSelectedCategory(id);
  }, []);

  return {
    selectedCategory,
    filteredPlaces,
    categories,
    handleCategorySelect,
  };
}
