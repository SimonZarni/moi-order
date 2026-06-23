import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSessionMenuCategories,
  createSessionMenuCategory,
  importSessionMenuCategories,
  updateSessionMenuCategory,
  deleteSessionMenuCategory,
  toggleMenuItemStatus,
  deleteMenuItem,
} from '../../../api/menu';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import type { MenuCategory } from '../../../types/models';
import type { MenuItemStatus } from '../../../types/enums';

export interface UseSessionMenuDataResult {
  categories: MenuCategory[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isCreating: boolean;
  isImporting: boolean;
  isRenaming: boolean;
  createCategory: (name: string) => void;
  importCategories: (categoryIds: number[]) => void;
  updateCategory: (categoryId: number, name: string) => void;
  deleteCategory: (categoryId: number) => void;
  toggleItemStatus: (itemId: number, status: MenuItemStatus) => void;
  removeItem: (itemId: number) => void;
}

export function useSessionMenuData(openingHourId: number): UseSessionMenuDataResult {
  const queryClient = useQueryClient();
  const key = QUERY_KEYS.SESSION_MENU(openingHourId);

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: key,
    queryFn: () => getSessionMenuCategories(openingHourId),
  });

  const invalidate = (): void => { void queryClient.invalidateQueries({ queryKey: key }); };

  const createMutation  = useMutation({ mutationFn: (name: string) => createSessionMenuCategory(openingHourId, name), onSuccess: invalidate });
  const importMutation  = useMutation({ mutationFn: (ids: number[]) => importSessionMenuCategories(openingHourId, ids), onSuccess: invalidate });
  const updateMutation  = useMutation({ mutationFn: ({ categoryId, name }: { categoryId: number; name: string }) => updateSessionMenuCategory(openingHourId, categoryId, name), onSuccess: invalidate });
  const deleteMutation  = useMutation({ mutationFn: (categoryId: number) => deleteSessionMenuCategory(openingHourId, categoryId), onSuccess: invalidate });
  const statusMutation  = useMutation({ mutationFn: ({ id, status }: { id: number; status: MenuItemStatus }) => toggleMenuItemStatus(id, status), onSuccess: invalidate });
  const deleteItemMut   = useMutation({ mutationFn: (id: number) => deleteMenuItem(id), onSuccess: invalidate });

  const apiError = error as { message?: string } | null;

  return {
    categories: data,
    isLoading,
    isError,
    error:      apiError?.message ?? null,
    isCreating: createMutation.isPending,
    isImporting: importMutation.isPending,
    isRenaming: updateMutation.isPending,
    createCategory:  (name) => createMutation.mutate(name),
    importCategories: (ids) => importMutation.mutate(ids),
    updateCategory:  (categoryId, name) => updateMutation.mutate({ categoryId, name }),
    deleteCategory:  (categoryId) => deleteMutation.mutate(categoryId),
    toggleItemStatus: (id, status) => statusMutation.mutate({ id, status }),
    removeItem:       (id) => deleteItemMut.mutate(id),
  };
}
