import { useState, useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import { Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  getMenuCategories,
  createCategory,
  createMenuItem,
  updateCategory,
  updateMenuItem,
  deleteCategory,
  toggleMenuItemStatus,
  deleteMenuItem,
} from '../../../api/menu';
import { getRestaurant } from '../../../api/restaurant';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL } from '../../../shared/constants/config';
import { RESTAURANT_STATUS } from '../../../types/enums';
import type { MenuCategory, MenuItem } from '../../../types/models';
import type { MenuItemStatus, RestaurantStatus } from '../../../types/enums';

export interface OptionInput {
  name: string;
  additional_price_cents: number;
}

export interface OptionGroupInput {
  name: string;
  is_required: boolean;
  min_selections: number;
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
  hasMissingSystemCategories: boolean;
  restaurantStatus: RestaurantStatus | null;
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
  handleOptionGroupChange: (groupIndex: number, field: 'name' | 'is_required' | 'min_selections' | 'max_selections', value: string | boolean | number) => void;
  handleAddOption: (groupIndex: number) => void;
  handleRemoveOption: (groupIndex: number, optIndex: number) => void;
  handleOptionChange: (groupIndex: number, optIndex: number, field: 'name' | 'additional_price_cents', value: string | number) => void;
  handleAddItemSubmit: () => void;
  // Edit item
  editItemId: number | null;
  editItemForm: AddItemForm;
  editItemExistingPhotoUrl: string | null;
  isEditingItem: boolean;
  handleOpenEditItem: (item: MenuItem) => void;
  handleCloseEditItem: () => void;
  handleEditItemFieldChange: (field: 'name' | 'description' | 'price' | 'original_price', value: string) => void;
  handleEditItemPhotoChange: (photo: AddItemForm['photo']) => void;
  handleEditAddOptionGroup: () => void;
  handleEditRemoveOptionGroup: (index: number) => void;
  handleEditOptionGroupChange: (groupIndex: number, field: 'name' | 'is_required' | 'min_selections' | 'max_selections', value: string | boolean | number) => void;
  handleEditAddOption: (groupIndex: number) => void;
  handleEditRemoveOption: (groupIndex: number, optIndex: number) => void;
  handleEditOptionChange: (groupIndex: number, optIndex: number, field: 'name' | 'additional_price_cents', value: string | number) => void;
  handleEditItemSubmit: () => void;
  // Rename category
  handleRenameCategory: (id: number, newName: string) => void;
}

const EMPTY_FORM: AddItemForm = {
  name: '', description: '', price: '', original_price: '', photo: null, option_groups: [],
};

async function buildItemFormData(form: AddItemForm): Promise<FormData> {
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
    fd.append(`option_groups[${gi}][min_selections]`, String(group.min_selections));
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
  return fd;
}

function makeOptionGroupHandlers(
  setForm: Dispatch<SetStateAction<AddItemForm>>,
) {
  const addOptionGroup = () =>
    setForm((prev) => ({
      ...prev,
      option_groups: [
        ...prev.option_groups,
        { name: '', is_required: false, min_selections: 0, max_selections: 1, options: [{ name: '', additional_price_cents: 0 }] },
      ],
    }));

  const removeOptionGroup = (index: number) =>
    setForm((prev) => ({ ...prev, option_groups: prev.option_groups.filter((_, i) => i !== index) }));

  const changeOptionGroup = (groupIndex: number, field: 'name' | 'is_required' | 'min_selections' | 'max_selections', value: string | boolean | number) =>
    setForm((prev) => {
      const groups = [...prev.option_groups];
      groups[groupIndex] = { ...groups[groupIndex], [field]: value };
      return { ...prev, option_groups: groups };
    });

  const addOption = (groupIndex: number) =>
    setForm((prev) => {
      const groups = [...prev.option_groups];
      groups[groupIndex] = { ...groups[groupIndex], options: [...groups[groupIndex].options, { name: '', additional_price_cents: 0 }] };
      return { ...prev, option_groups: groups };
    });

  const removeOption = (groupIndex: number, optIndex: number) =>
    setForm((prev) => {
      const groups = [...prev.option_groups];
      groups[groupIndex] = { ...groups[groupIndex], options: groups[groupIndex].options.filter((_, i) => i !== optIndex) };
      return { ...prev, option_groups: groups };
    });

  const changeOption = (groupIndex: number, optIndex: number, field: 'name' | 'additional_price_cents', value: string | number) =>
    setForm((prev) => {
      const groups = [...prev.option_groups];
      const opts = [...groups[groupIndex].options];
      opts[optIndex] = { ...opts[optIndex], [field]: value };
      groups[groupIndex] = { ...groups[groupIndex], options: opts };
      return { ...prev, option_groups: groups };
    });

  return { addOptionGroup, removeOptionGroup, changeOptionGroup, addOption, removeOption, changeOption };
}

export function useMenuScreen(): UseMenuScreenResult {
  const queryClient = useQueryClient();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [addItemCategoryId, setAddItemCategoryId] = useState<number | null>(null);
  const [addItemForm, setAddItemForm] = useState<AddItemForm>(EMPTY_FORM);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editItemForm, setEditItemForm] = useState<AddItemForm>(EMPTY_FORM);
  const [editItemExistingPhotoUrl, setEditItemExistingPhotoUrl] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.MENU_CATEGORIES,
    queryFn: getMenuCategories,
    staleTime: CACHE_TTL.MENU,
    placeholderData: keepPreviousData,
  });

  // Read restaurant status from cache (populated by RestaurantScreen); no extra network request.
  const { data: restaurantData } = useQuery({
    queryKey: QUERY_KEYS.RESTAURANT,
    queryFn: getRestaurant,
    staleTime: CACHE_TTL.MENU,
  });
  const restaurantStatus = restaurantData?.restaurant?.status ?? null;

  const SYSTEM_SORT: Record<string, number> = { popular_picks: 0, promotions: 1, recommendations: 2 };
  const REQUIRED_SYSTEM_TYPES = ['popular_picks', 'recommendations'] as const;

  const categories = useMemo(() => {
    const all = data ?? [];
    return [...all].sort((a, b) => {
      const aOrder = a.is_system ? (SYSTEM_SORT[a.category_type ?? ''] ?? 99) : 100;
      const bOrder = b.is_system ? (SYSTEM_SORT[b.category_type ?? ''] ?? 99) : 100;
      return aOrder !== bOrder ? aOrder - bOrder : a.id - b.id;
    });
  }, [data]);

  const hasMissingSystemCategories = useMemo(
    () => REQUIRED_SYSTEM_TYPES.some((type) => {
      const cat = categories.find((c) => c.is_system && c.category_type === type);
      return cat === undefined || cat.items.length === 0;
    }),
    [categories],
  );

  const invalidateMenu = useCallback(
    () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MENU_CATEGORIES }),
    [queryClient],
  );

  const { mutate: mutateAddCategory } = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => { void invalidateMenu(); },
  });

  const { mutate: mutateUpdateCategory } = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateCategory(id, name),
    onSuccess: () => { void invalidateMenu(); },
  });

  const { mutate: mutateDeleteCategory } = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => { void invalidateMenu(); },
  });

  const { mutate: mutateToggleStatus } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: MenuItemStatus }) => toggleMenuItemStatus(id, status),
    onSuccess: () => { void invalidateMenu(); },
  });

  const { mutate: mutateDeleteItem } = useMutation({
    mutationFn: (id: number) => deleteMenuItem(id),
    onSuccess: () => { void invalidateMenu(); },
  });

  const { mutate: mutateAddItem, isPending: isAddingItem } = useMutation({
    mutationFn: async ({ categoryId, form }: { categoryId: number; form: AddItemForm }) =>
      createMenuItem(categoryId, await buildItemFormData(form)),
    onSuccess: () => {
      void invalidateMenu();
      setAddItemCategoryId(null);
      setAddItemForm(EMPTY_FORM);
    },
  });

  const { mutate: mutateUpdateItem, isPending: isEditingItem } = useMutation({
    mutationFn: async ({ id, form }: { id: number; form: AddItemForm }) =>
      updateMenuItem(id, await buildItemFormData(form)),
    onSuccess: (updatedItem) => {
      // Patch the cache immediately so re-opening the edit modal sees the new photo_url
      // without waiting for the background refetch to complete.
      queryClient.setQueryData<MenuCategory[]>(QUERY_KEYS.MENU_CATEGORIES, (old) => {
        if (!old) return old;
        return old.map((cat) => ({
          ...cat,
          items: cat.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
        }));
      });
      void invalidateMenu();
      setEditItemId(null);
      setEditItemForm(EMPTY_FORM);
      setEditItemExistingPhotoUrl(null);
    },
  });

  // --- Add form handlers ---
  const addHandlers = makeOptionGroupHandlers(setAddItemForm);

  const handleAddCategory = useCallback(async (name: string): Promise<void> => {
    mutateAddCategory(name);
    setShowAddCategoryModal(false);
  }, [mutateAddCategory]);

  const handleDeleteCategory = useCallback((id: number) => { mutateDeleteCategory(id); }, [mutateDeleteCategory]);
  const handleToggleItemStatus = useCallback((itemId: number, status: MenuItemStatus) => { mutateToggleStatus({ id: itemId, status }); }, [mutateToggleStatus]);

  const handleDeleteItem = useCallback((id: number) => {
    const category = categories.find((c) => c.items.some((i) => i.id === id));
    const isRequiredSystem = category?.is_system === true
      && (category?.category_type === 'popular_picks' || category?.category_type === 'recommendations');
    const isLastItem = (category?.items.length ?? 0) === 1;
    const restaurantIsClosed = restaurantStatus === RESTAURANT_STATUS.Closed;

    // Safety guard — MenuItemRow's inline warning should have already blocked this path.
    if (isRequiredSystem && isLastItem && !restaurantIsClosed) return;

    mutateDeleteItem(id);
  }, [categories, restaurantStatus, mutateDeleteItem]);

  const handleOpenAddItem = useCallback((categoryId: number) => {
    setAddItemForm(EMPTY_FORM);
    setAddItemCategoryId(categoryId);
  }, []);
  const handleCloseAddItem = useCallback(() => setAddItemCategoryId(null), []);
  const handleAddItemFieldChange = useCallback(
    (field: 'name' | 'description' | 'price' | 'original_price', value: string) =>
      setAddItemForm((prev) => ({ ...prev, [field]: value })),
    [],
  );
  const handleAddItemPhotoChange = useCallback((photo: AddItemForm['photo']) => setAddItemForm((prev) => ({ ...prev, photo })), []);
  const handleAddOptionGroup = useCallback(() => addHandlers.addOptionGroup(), []);
  const handleRemoveOptionGroup = useCallback((i: number) => addHandlers.removeOptionGroup(i), []);
  const handleOptionGroupChange = useCallback((gi: number, field: 'name' | 'is_required' | 'min_selections' | 'max_selections', value: string | boolean | number) => addHandlers.changeOptionGroup(gi, field, value), []);
  const handleAddOption = useCallback((gi: number) => addHandlers.addOption(gi), []);
  const handleRemoveOption = useCallback((gi: number, oi: number) => addHandlers.removeOption(gi, oi), []);
  const handleOptionChange = useCallback((gi: number, oi: number, field: 'name' | 'additional_price_cents', value: string | number) => addHandlers.changeOption(gi, oi, field, value), []);
  const handleAddItemSubmit = useCallback(() => {
    if (addItemCategoryId === null || !addItemForm.name.trim() || !addItemForm.price.trim()) return;
    mutateAddItem({ categoryId: addItemCategoryId, form: addItemForm });
  }, [addItemCategoryId, addItemForm, mutateAddItem]);

  // --- Edit item handlers ---
  const editHandlers = makeOptionGroupHandlers(setEditItemForm);

  const handleOpenEditItem = useCallback((item: MenuItem) => {
    setEditItemForm({
      name: item.name,
      description: item.description ?? '',
      price: String(item.price_cents / 100),
      original_price: item.original_price_cents != null ? String(item.original_price_cents / 100) : '',
      photo: null,
      option_groups: item.option_groups.map((g) => ({
        name: g.name,
        is_required: g.is_required,
        min_selections: g.min_selections,
        max_selections: g.max_selections,
        options: g.options.map((o) => ({ name: o.name, additional_price_cents: o.additional_price_cents })),
      })),
    });
    setEditItemExistingPhotoUrl(item.photo_url);
    setEditItemId(item.id);
  }, []);
  const handleCloseEditItem = useCallback(() => {
    setEditItemId(null);
    setEditItemExistingPhotoUrl(null);
  }, []);
  const handleEditItemFieldChange = useCallback(
    (field: 'name' | 'description' | 'price' | 'original_price', value: string) =>
      setEditItemForm((prev) => ({ ...prev, [field]: value })),
    [],
  );
  const handleEditItemPhotoChange = useCallback((photo: AddItemForm['photo']) => setEditItemForm((prev) => ({ ...prev, photo })), []);
  const handleEditAddOptionGroup = useCallback(() => editHandlers.addOptionGroup(), []);
  const handleEditRemoveOptionGroup = useCallback((i: number) => editHandlers.removeOptionGroup(i), []);
  const handleEditOptionGroupChange = useCallback((gi: number, field: 'name' | 'is_required' | 'min_selections' | 'max_selections', value: string | boolean | number) => editHandlers.changeOptionGroup(gi, field, value), []);
  const handleEditAddOption = useCallback((gi: number) => editHandlers.addOption(gi), []);
  const handleEditRemoveOption = useCallback((gi: number, oi: number) => editHandlers.removeOption(gi, oi), []);
  const handleEditOptionChange = useCallback((gi: number, oi: number, field: 'name' | 'additional_price_cents', value: string | number) => editHandlers.changeOption(gi, oi, field, value), []);
  const handleEditItemSubmit = useCallback(() => {
    if (editItemId === null || !editItemForm.name.trim() || !editItemForm.price.trim()) return;
    mutateUpdateItem({ id: editItemId, form: editItemForm });
  }, [editItemId, editItemForm, mutateUpdateItem]);

  const handleRenameCategory = useCallback(
    (id: number, newName: string) => { mutateUpdateCategory({ id, name: newName }); },
    [mutateUpdateCategory],
  );

  return {
    categories, isLoading, isError, hasMissingSystemCategories, restaurantStatus,
    showAddCategoryModal, addItemCategoryId, addItemForm, isAddingItem,
    handleAddCategory, handleDeleteCategory, handleToggleItemStatus, handleDeleteItem,
    setShowAddCategoryModal,
    handleOpenAddItem, handleCloseAddItem,
    handleAddItemFieldChange, handleAddItemPhotoChange,
    handleAddOptionGroup, handleRemoveOptionGroup, handleOptionGroupChange,
    handleAddOption, handleRemoveOption, handleOptionChange,
    handleAddItemSubmit,
    editItemId, editItemForm, editItemExistingPhotoUrl, isEditingItem,
    handleOpenEditItem, handleCloseEditItem,
    handleEditItemFieldChange, handleEditItemPhotoChange,
    handleEditAddOptionGroup, handleEditRemoveOptionGroup, handleEditOptionGroupChange,
    handleEditAddOption, handleEditRemoveOption, handleEditOptionChange,
    handleEditItemSubmit,
    handleRenameCategory,
  };
}
