import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  getMenuCategories,
  createCategory,
  createMenuItem,
  deleteCategory,
  toggleMenuItemStatus,
  deleteMenuItem,
} from '../../../api/menu';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import type { MenuCategory } from '../../../types/models';
import type { MenuItemStatus } from '../../../types/enums';

export interface AddItemForm {
  name: string;
  description: string;
  price: string;
  photo: { uri: string; name: string; type: string } | null;
}

interface UseMenuScreenResult {
  categories: MenuCategory[];
  isLoading: boolean;
  isError: boolean;
  showAddCategoryModal: boolean;
  addItemCategoryId: number | null;
  addItemForm: AddItemForm;
  isAddingItem: boolean;
  handleAddCategory: (name: string) => Promise<void>;
  handleDeleteCategory: (id: number) => void;
  handleToggleItemStatus: (itemId: number, status: MenuItemStatus) => void;
  handleDeleteItem: (id: number) => void;
  setShowAddCategoryModal: (v: boolean) => void;
  handleOpenAddItem: (categoryId: number) => void;
  handleCloseAddItem: () => void;
  handleAddItemFieldChange: (field: keyof AddItemForm, value: string) => void;
  handleAddItemPhotoChange: (photo: AddItemForm['photo']) => void;
  handleAddItemSubmit: () => void;
}

const EMPTY_ADD_ITEM_FORM: AddItemForm = { name: '', description: '', price: '', photo: null };

export function useMenuScreen(): UseMenuScreenResult {
  const queryClient = useQueryClient();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [addItemCategoryId, setAddItemCategoryId] = useState<number | null>(null);
  const [addItemForm, setAddItemForm] = useState<AddItemForm>(EMPTY_ADD_ITEM_FORM);

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.MENU_CATEGORIES,
    queryFn: getMenuCategories,
    staleTime: CACHE_TTL.MENU,
    placeholderData: keepPreviousData, // show stale data instantly while refetching
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

  const { mutate: mutateAddItem, isPending: isAddingItem } = useMutation({
    mutationFn: ({ categoryId, form }: { categoryId: number; form: AddItemForm }) => {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      if (form.description.trim()) fd.append('description', form.description.trim());
      fd.append('price_cents', String(Math.round(parseFloat(form.price) * 100)));
      if (form.photo !== null) {
        fd.append('photo', { uri: form.photo.uri, name: form.photo.name, type: form.photo.type } as unknown as Blob);
      }
      return createMenuItem(categoryId, fd);
    },
    onSuccess: () => {
      void invalidateMenu();
      setAddItemCategoryId(null);
      setAddItemForm(EMPTY_ADD_ITEM_FORM);
    },
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

  const handleOpenAddItem = useCallback((categoryId: number) => {
    setAddItemForm(EMPTY_ADD_ITEM_FORM);
    setAddItemCategoryId(categoryId);
  }, []);

  const handleCloseAddItem = useCallback(() => setAddItemCategoryId(null), []);

  const handleAddItemFieldChange = useCallback(
    (field: keyof AddItemForm, value: string) =>
      setAddItemForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  const handleAddItemPhotoChange = useCallback(
    (photo: AddItemForm['photo']) => setAddItemForm((prev) => ({ ...prev, photo })),
    [],
  );

  const handleAddItemSubmit = useCallback(() => {
    if (addItemCategoryId === null || !addItemForm.name.trim() || !addItemForm.price.trim()) return;
    mutateAddItem({ categoryId: addItemCategoryId, form: addItemForm });
  }, [addItemCategoryId, addItemForm, mutateAddItem]);

  return {
    categories,
    isLoading,
    isError,
    showAddCategoryModal,
    addItemCategoryId,
    addItemForm,
    isAddingItem,
    handleAddCategory,
    handleDeleteCategory,
    handleToggleItemStatus,
    handleDeleteItem,
    setShowAddCategoryModal,
    handleOpenAddItem,
    handleCloseAddItem,
    handleAddItemFieldChange,
    handleAddItemPhotoChange,
    handleAddItemSubmit,
  };
}
