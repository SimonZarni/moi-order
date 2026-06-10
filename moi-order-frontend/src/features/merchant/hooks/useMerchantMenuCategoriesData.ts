import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MenuCategory } from '@/types/models';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  fetchMerchantMenuCategories,
  createMerchantMenuCategory,
  updateMerchantMenuCategory,
  deleteMerchantMenuCategory,
} from '@/shared/api/merchant';

export interface UseMerchantMenuCategoriesDataResult {
  categories:     MenuCategory[];
  isLoading:      boolean;
  isError:        boolean;
  createCategory: (name: string) => Promise<MenuCategory>;
  isCreating:     boolean;
  updateCategory: (id: number, name: string) => Promise<MenuCategory>;
  isUpdating:     boolean;
  deleteCategory: (id: number) => Promise<void>;
  isDeletingId:   number | null;
}

export function useMerchantMenuCategoriesData(): UseMerchantMenuCategoriesDataResult {
  const queryClient = useQueryClient();
  const queryKey    = QUERY_KEYS.MERCHANT.MENU_CATEGORIES;

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: fetchMerchantMenuCategories,
  });

  const createMutation = useMutation<MenuCategory, Error, string>({
    mutationFn: (name) => createMerchantMenuCategory(name),
    onSuccess: (newCat) => {
      queryClient.setQueryData<MenuCategory[]>(queryKey, (prev = []) => [...prev, newCat]);
    },
  });

  const updateMutation = useMutation<MenuCategory, Error, { id: number; name: string }>({
    mutationFn: ({ id, name }) => updateMerchantMenuCategory(id, name),
    onSuccess: (updated) => {
      queryClient.setQueryData<MenuCategory[]>(queryKey, (prev = []) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => deleteMerchantMenuCategory(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<MenuCategory[]>(queryKey, (prev = []) =>
        prev.filter((c) => c.id !== id)
      );
    },
  });

  return {
    categories:     data ?? [],
    isLoading,
    isError,
    createCategory: (name) => createMutation.mutateAsync(name),
    isCreating:     createMutation.isPending,
    updateCategory: (id, name) => updateMutation.mutateAsync({ id, name }),
    isUpdating:     updateMutation.isPending,
    deleteCategory: (id) => deleteMutation.mutateAsync(id),
    isDeletingId:   deleteMutation.isPending ? (deleteMutation.variables ?? null) : null,
  };
}
