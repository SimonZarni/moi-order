import { useState, useMemo, useCallback } from 'react';

import { Category, Place } from '@/types/models';

export interface UsePlacesSearchResult {
  selectedCategory: number | null;
  filteredPlaces: Place[];
  categories: Category[];
  handleCategorySelect: (id: number | null) => void;
}

// Text search is handled server-side. This hook only applies category filtering
// on the already-server-filtered places, and derives the category list from them.
export function usePlacesSearch(places: Place[]): UsePlacesSearchResult {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const categories = useMemo((): Category[] => {
    const seen = new Set<number>();
    return places.reduce<Category[]>((acc, place) => {
      if (!seen.has(place.category.id)) {
        seen.add(place.category.id);
        acc.push(place.category);
      }
      return acc;
    }, []);
  }, [places]);

  const filteredPlaces = useMemo((): Place[] => {
    if (selectedCategory === null) return places;
    return places.filter((place) => place.category.id === selectedCategory);
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
