import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMenuCategories,
  createCategory,
  deleteCategory,
  toggleMenuItemStatus,
  deleteMenuItem,
} from '../../../api/menu';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import type { MenuCategory } from '../../../types/models';
import type { MenuItemStatus } from '../../../types/enums';

interface UseMenuScreenResult {
  categories: MenuCategory[];
  isLoading: boolean;
  isError: boolean;
  showAddCategoryModal: boolean;
  handleAddCategory: (name: string) => Promise<void>;
  handleDeleteCategory: (id: number) => void;
  handleToggleItemStatus: (itemId: number, status: MenuItemStatus) => void;
  handleDeleteItem: (id: number) => void;
  setShowAddCategoryModal: (v: boolean) => void;
}

export function useMenuScreen(): UseMenuScreenResult {
  const queryClient = useQueryClient();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.MENU_CATEGORIES,
    queryFn: getMenuCategories,
    staleTime: CACHE_TTL.MENU,
  });

  const categories = useMemo(() => data ?? [], [data]);

  const invalidateMenu = useCallback(
    () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MENU_CATEGORIES }),
    [queryClient],
  );

  const { mutate: mutateAddCategory } = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => { void invalidateMenu(); },
  });

  const { mutate: mutateDeleteCategory } = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => { void invalidateMenu(); },
  });

  const { mutate: mutateToggleStatus } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: MenuItemStatus }) =>
      toggleMenuItemStatus(id, status),
    onSuccess: () => { void invalidateMenu(); },
  });

  const { mutate: mutateDeleteItem } = useMutation({
    mutationFn: (id: number) => deleteMenuItem(id),
    onSuccess: () => { void invalidateMenu(); },
  });

  const handleAddCategory = useCallback(async (name: string): Promise<void> => {
    mutateAddCategory(name);
    setShowAddCategoryModal(false);
  }, [mutateAddCategory]);

  const handleDeleteCategory = useCallback(
    (id: number) => { mutateDeleteCategory(id); },
    [mutateDeleteCategory],
  );

  const handleToggleItemStatus = useCallback(
    (itemId: number, status: MenuItemStatus) => {
      mutateToggleStatus({ id: itemId, status });
    },
    [mutateToggleStatus],
  );

  const handleDeleteItem = useCallback(
    (id: number) => { mutateDeleteItem(id); },
    [mutateDeleteItem],
  );

  return {
    categories,
    isLoading,
    isError,
    showAddCategoryModal,
    handleAddCategory,
    handleDeleteCategory,
    handleToggleItemStatus,
    handleDeleteItem,
    setShowAddCategoryModal,
  };
}
