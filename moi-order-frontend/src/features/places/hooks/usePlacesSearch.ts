import { useState, useMemo, useCallback } from 'react';

import { Category, Place } from '@/types/models';

export interface UsePlacesSearchResult {
  query: string;
  selectedCategory: number | null;
  filteredPlaces: Place[];
  categories: Category[];
  handleQueryChange: (text: string) => void;
  handleCategorySelect: (id: number | null) => void;
}

export function usePlacesSearch(places: Place[]): UsePlacesSearchResult {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Derive unique categories from all loaded places (order of first appearance)
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
    const trimmed = query.trim().toLowerCase();
    return places.filter((place) => {
      const matchesCategory =
        selectedCategory === null || place.category.id === selectedCategory;
      if (!matchesCategory) return false;
      if (trimmed === '') return true;
      return (
        place.name_en.toLowerCase().includes(trimmed) ||
        place.name_th.toLowerCase().includes(trimmed) ||
        place.name_my.toLowerCase().includes(trimmed) ||
        place.city.toLowerCase().includes(trimmed)
      );
    });
  }, [places, query, selectedCategory]);

  const handleQueryChange = useCallback((text: string): void => {
    setQuery(text);
  }, []);

  const handleCategorySelect = useCallback((id: number | null): void => {
    setSelectedCategory(id);
  }, []);

  return {
    query,
    selectedCategory,
    filteredPlaces,
    categories,
    handleQueryChange,
    handleCategorySelect,
  };
}
