import { useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
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

export interface OptionInput {
  name: string;
  additional_price_cents: number;
}

export interface OptionGroupInput {
  name: string;
  is_required: boolean;
  max_selections: number;
  options: OptionInput[];
}

export interface AddItemForm {
  name: string;
  description: string;
  price: string;
  original_price: string;
  photo: { uri: string; name: string; type: string } | null;
  option_groups: OptionGroupInput[];
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
  handleAddItemFieldChange: (field: 'name' | 'description' | 'price' | 'original_price', value: string) => void;
  handleAddItemPhotoChange: (photo: AddItemForm['photo']) => void;
  handleAddOptionGroup: () => void;
  handleRemoveOptionGroup: (index: number) => void;
  handleOptionGroupChange: (groupIndex: number, field: 'name' | 'is_required' | 'max_selections', value: string | boolean | number) => void;
  handleAddOption: (groupIndex: number) => void;
  handleRemoveOption: (groupIndex: number, optIndex: number) => void;
  handleOptionChange: (groupIndex: number, optIndex: number, field: 'name' | 'additional_price_cents', value: string | number) => void;
  handleAddItemSubmit: () => void;
}

const EMPTY_ADD_ITEM_FORM: AddItemForm = {
  name: '', description: '', price: '', original_price: '', photo: null, option_groups: [],
};

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
    mutationFn: async ({ categoryId, form }: { categoryId: number; form: AddItemForm }) => {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      if (form.description.trim()) fd.append('description', form.description.trim());
      const priceCents = Math.round(parseFloat(form.price) * 100);
      fd.append('price_cents', String(isNaN(priceCents) ? 0 : priceCents));
      if (form.original_price.trim()) {
        const origCents = Math.round(parseFloat(form.original_price) * 100);
        if (!isNaN(origCents)) fd.append('original_price_cents', String(origCents));
      }
      form.option_groups.forEach((group, gi) => {
        fd.append(`option_groups[${gi}][name]`, group.name);
        fd.append(`option_groups[${gi}][is_required]`, group.is_required ? '1' : '0');
        fd.append(`option_groups[${gi}][max_selections]`, String(group.max_selections));
        group.options.forEach((opt, oi) => {
          fd.append(`option_groups[${gi}][options][${oi}][name]`, opt.name);
          fd.append(`option_groups[${gi}][options][${oi}][additional_price_cents]`, String(opt.additional_price_cents));
        });
      });
      if (form.photo !== null) {
        if (Platform.OS === 'web') {
          const blob = await fetch(form.photo.uri).then((r) => r.blob());
          fd.append('photo', new File([blob], form.photo.name, { type: form.photo.type }));
        } else {
          fd.append('photo', { uri: form.photo.uri, name: form.photo.name, type: form.photo.type } as unknown as Blob);
        }
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
    (field: 'name' | 'description' | 'price' | 'original_price', value: string) =>
      setAddItemForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  const handleAddItemPhotoChange = useCallback(
    (photo: AddItemForm['photo']) => setAddItemForm((prev) => ({ ...prev, photo })),
    [],
  );

  const handleAddOptionGroup = useCallback(() => {
    setAddItemForm((prev) => ({
      ...prev,
      option_groups: [
        ...prev.option_groups,
        { name: '', is_required: false, max_selections: 1, options: [{ name: '', additional_price_cents: 0 }] },
      ],
    }));
  }, []);

  const handleRemoveOptionGroup = useCallback((index: number) => {
    setAddItemForm((prev) => ({
      ...prev,
      option_groups: prev.option_groups.filter((_, i) => i !== index),
    }));
  }, []);

  const handleOptionGroupChange = useCallback(
    (groupIndex: number, field: 'name' | 'is_required' | 'max_selections', value: string | boolean | number) => {
      setAddItemForm((prev) => {
        const groups = [...prev.option_groups];
        groups[groupIndex] = { ...groups[groupIndex], [field]: value };
        return { ...prev, option_groups: groups };
      });
    },
    [],
  );

  const handleAddOption = useCallback((groupIndex: number) => {
    setAddItemForm((prev) => {
      const groups = [...prev.option_groups];
      groups[groupIndex] = {
        ...groups[groupIndex],
        options: [...groups[groupIndex].options, { name: '', additional_price_cents: 0 }],
      };
      return { ...prev, option_groups: groups };
    });
  }, []);

  const handleRemoveOption = useCallback((groupIndex: number, optIndex: number) => {
    setAddItemForm((prev) => {
      const groups = [...prev.option_groups];
      groups[groupIndex] = {
        ...groups[groupIndex],
        options: groups[groupIndex].options.filter((_, i) => i !== optIndex),
      };
      return { ...prev, option_groups: groups };
    });
  }, []);

  const handleOptionChange = useCallback(
    (groupIndex: number, optIndex: number, field: 'name' | 'additional_price_cents', value: string | number) => {
      setAddItemForm((prev) => {
        const groups = [...prev.option_groups];
        const opts = [...groups[groupIndex].options];
        opts[optIndex] = { ...opts[optIndex], [field]: value };
        groups[groupIndex] = { ...groups[groupIndex], options: opts };
        return { ...prev, option_groups: groups };
      });
    },
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
    handleAddOptionGroup,
    handleRemoveOptionGroup,
    handleOptionGroupChange,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    handleAddItemSubmit,
  };
}
