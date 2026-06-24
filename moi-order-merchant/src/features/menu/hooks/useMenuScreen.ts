import { useState, useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  getMenuCategories,
  createCategory,
  createMenuItem,
  updateCategory,
  deleteCategory,
  toggleMenuItemStatus,
  deleteMenuItem,
  updateMenuItemStock,
} from '../../../api/menu';
import { getRestaurant } from '../../../api/restaurant';
import { extractApiError } from '../../../api/client';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, PLATFORM_FEE_RATE } from '../../../shared/constants/config';
import { DOMAIN_MESSAGES, MESSAGES } from '../../../shared/constants/messages';
import { RESTAURANT_STATUS } from '../../../types/enums';
import { normalizePickedImage } from '../../../shared/utils/imageUtils';
import { useSettingsStore, type MenuView } from '../../../store/settingsStore';
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
  // Data
  categories: MenuCategory[];
  filteredItems: MenuItem[];
  guardedItemIds: Set<number>;
  isLoading: boolean;
  isError: boolean;
  hasMissingSystemCategories: boolean;
  restaurantStatus: RestaurantStatus | null;
  useStockSystem: boolean;
  menuView: MenuView;
  // Tab + search
  selectedCategoryId: number | 'all';
  searchQuery: string;
  handleSelectCategory: (id: number | 'all') => void;
  handleSearchChange: (query: string) => void;
  // Add category modal
  showAddCategoryModal: boolean;
  newCategoryName: string;
  setShowAddCategoryModal: (v: boolean) => void;
  handleNewCategoryNameChange: (v: string) => void;
  handleConfirmAddCategory: () => void;
  // Rename category modal
  renamingCategoryId:     number | null;
  renamingCategoryName:   string;
  isRenamingCategory:     boolean;
  handleOpenRename:       (id: number, currentName: string) => void;
  handleRenameNameChange: (v: string) => void;
  handleConfirmRename:    () => void;
  handleCancelRename:     () => void;
  // Delete category modal
  deletingCategoryId:      number | null;
  deletingCategoryName:    string;
  handleOpenDeleteConfirm: (id: number, name: string) => void;
  handleConfirmDelete:     () => void;
  handleCancelDelete:      () => void;
  // Item mutations
  handleToggleItemStatus: (itemId: number, status: MenuItemStatus) => void;
  handleDeleteItem: (id: number) => void;
  handleUpdateItemStock: (itemId: number, quantity: number | null) => void;
  // Add item modal
  addItemCategoryId: number | null;
  addItemForm: AddItemForm;
  isAddingItem: boolean;
  handleOpenAddItem: (categoryId: number) => void;
  handleCloseAddItem: () => void;
  handleAddItemFieldChange: (field: 'name' | 'description' | 'price' | 'original_price', value: string) => void;
  handleAddItemPhotoChange: (photo: AddItemForm['photo']) => void;
  handlePickAddPhoto: () => void;
  handleAddOptionGroup: () => void;
  handleRemoveOptionGroup: (index: number) => void;
  handleOptionGroupChange: (groupIndex: number, field: 'name' | 'is_required' | 'min_selections' | 'max_selections', value: string | boolean | number) => void;
  handleAddOption: (groupIndex: number) => void;
  handleRemoveOption: (groupIndex: number, optIndex: number) => void;
  handleOptionChange: (groupIndex: number, optIndex: number, field: 'name' | 'additional_price_cents', value: string | number) => void;
  handleAddItemSubmit: () => void;
}

export const EMPTY_FORM: AddItemForm = {
  name: '', description: '', price: '', original_price: '', photo: null, option_groups: [],
};

const SYSTEM_SORT: Record<string, number> = { popular_picks: 0, promotions: 1, recommendations: 2 };
const REQUIRED_SYSTEM_TYPES = ['popular_picks', 'recommendations'] as const;

export async function buildItemFormData(form: AddItemForm): Promise<FormData> {
  const fd = new FormData();
  fd.append('name', form.name.trim());
  if (form.description.trim()) fd.append('description', form.description.trim());
  const FEE = 1 + PLATFORM_FEE_RATE;
  const priceCents = Math.round(parseFloat(form.price) * 100 * FEE);
  fd.append('price_cents', String(isNaN(priceCents) ? 0 : priceCents));
  if (form.original_price.trim()) {
    const origCents = Math.round(parseFloat(form.original_price) * 100 * FEE);
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
      if (form.photo.uri.startsWith('blob:')) URL.revokeObjectURL(form.photo.uri);
      fd.append('photo', new File([blob], form.photo.name, { type: form.photo.type }));
    } else {
      fd.append('photo', { uri: form.photo.uri, name: form.photo.name, type: form.photo.type } as unknown as Blob);
    }
  }
  return fd;
}

export function makeOptionGroupHandlers(setForm: Dispatch<SetStateAction<AddItemForm>>) {
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

  const changeOptionGroup = (
    groupIndex: number,
    field: 'name' | 'is_required' | 'min_selections' | 'max_selections',
    value: string | boolean | number,
  ) =>
    setForm((prev) => {
      const groups = [...prev.option_groups];
      groups[groupIndex] = { ...groups[groupIndex], [field]: value };
      return { ...prev, option_groups: groups };
    });

  const addOption = (groupIndex: number) =>
    setForm((prev) => {
      const groups = [...prev.option_groups];
      groups[groupIndex] = {
        ...groups[groupIndex],
        options: [...groups[groupIndex].options, { name: '', additional_price_cents: 0 }],
      };
      return { ...prev, option_groups: groups };
    });

  const removeOption = (groupIndex: number, optIndex: number) =>
    setForm((prev) => {
      const groups = [...prev.option_groups];
      groups[groupIndex] = {
        ...groups[groupIndex],
        options: groups[groupIndex].options.filter((_, i) => i !== optIndex),
      };
      return { ...prev, option_groups: groups };
    });

  const changeOption = (
    groupIndex: number,
    optIndex: number,
    field: 'name' | 'additional_price_cents',
    value: string | number,
  ) =>
    setForm((prev) => {
      const groups = [...prev.option_groups];
      const opts = [...groups[groupIndex].options];
      opts[optIndex] = { ...opts[optIndex], [field]: value };
      groups[groupIndex] = { ...groups[groupIndex], options: opts };
      return { ...prev, option_groups: groups };
    });

  return { addOptionGroup, removeOptionGroup, changeOptionGroup, addOption, removeOption, changeOption };
}

export async function pickPhoto(): Promise<AddItemForm['photo'] | null> {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.8 });
  if (result.canceled || result.assets.length === 0) return null;
  const asset = result.assets[0];
  if (!asset) return null;
  const img = await normalizePickedImage(asset, 'item');
  return { uri: img.uri, name: img.name, type: img.type };
}

export function useMenuScreen(): UseMenuScreenResult {
  const queryClient = useQueryClient();
  const menuView = useSettingsStore((s) => s.menuView);

  // ── Tab + search ──────────────────────────────────────────────────────────
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Add category modal ────────────────────────────────────────────────────
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // ── Rename category modal ─────────────────────────────────────────────────
  const [renamingCategoryId,   setRenamingCategoryId]   = useState<number | null>(null);
  const [renamingCategoryName, setRenamingCategoryName] = useState('');

  // ── Delete category modal ─────────────────────────────────────────────────
  const [deletingCategoryId,   setDeletingCategoryId]   = useState<number | null>(null);
  const [deletingCategoryName, setDeletingCategoryName] = useState('');

  // ── Item modals ───────────────────────────────────────────────────────────
  const [addItemCategoryId, setAddItemCategoryId] = useState<number | null>(null);
  const [addItemForm, setAddItemForm] = useState<AddItemForm>(EMPTY_FORM);

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.MENU_CATEGORIES,
    queryFn: getMenuCategories,
    staleTime: CACHE_TTL.MENU,
    placeholderData: keepPreviousData,
  });

  const { data: restaurantData } = useQuery({
    queryKey: QUERY_KEYS.RESTAURANT,
    queryFn: getRestaurant,
    staleTime: CACHE_TTL.MENU,
  });
  const restaurantStatus = restaurantData?.restaurant?.status ?? null;
  const useStockSystem   = restaurantData?.restaurant?.use_stock_system ?? false;

  // ── Derived data ──────────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const all = data ?? [];
    return [...all].sort((a, b) => {
      const aOrder = a.is_system ? (SYSTEM_SORT[a.category_type ?? ''] ?? 99) : 100;
      const bOrder = b.is_system ? (SYSTEM_SORT[b.category_type ?? ''] ?? 99) : 100;
      return aOrder !== bOrder ? aOrder - bOrder : a.id - b.id;
    });
  }, [data]);

  const hasMissingSystemCategories = useMemo(
    () =>
      REQUIRED_SYSTEM_TYPES.some((type) => {
        const cat = categories.find((c) => c.is_system && c.category_type === type);
        return cat === undefined || cat.items.length === 0;
      }),
    [categories],
  );

  // Items shown in the grid — filtered by selected category tab + search query
  const filteredItems = useMemo<MenuItem[]>(() => {
    const base =
      selectedCategoryId === 'all'
        ? categories.flatMap((c) => c.items)
        : (categories.find((c) => c.id === selectedCategoryId)?.items ?? []);
    if (!searchQuery.trim()) return base;
    const q = searchQuery.trim().toLowerCase();
    return base.filter((item) => item.name.toLowerCase().includes(q));
  }, [categories, selectedCategoryId, searchQuery]);

  // Item IDs that cannot be deleted (last item in a required system category while restaurant is open)
  const guardedItemIds = useMemo<Set<number>>(() => {
    const guarded = new Set<number>();
    if (restaurantStatus === RESTAURANT_STATUS.Closed) return guarded;
    for (const cat of categories) {
      const isRequired =
        cat.is_system && REQUIRED_SYSTEM_TYPES.includes(cat.category_type as 'popular_picks' | 'recommendations');
      if (isRequired && cat.items.length === 1 && cat.items[0]) {
        guarded.add(cat.items[0].id);
      }
    }
    return guarded;
  }, [categories, restaurantStatus]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const invalidateMenu = useCallback(
    () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MENU_CATEGORIES }),
    [queryClient],
  );

  const { mutate: mutateAddCategory } = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => { void invalidateMenu(); },
  });

  const { mutate: mutateUpdateCategory, isPending: isRenamingCategory } = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateCategory(id, name),
    onSuccess: () => {
      void invalidateMenu();
      setRenamingCategoryId(null);
      setRenamingCategoryName('');
    },
    onError: (error) => {
      const apiError = extractApiError(error);
      const message = (apiError.code ? DOMAIN_MESSAGES[apiError.code] : undefined) ?? MESSAGES.genericError;
      Alert.alert('Could not rename category', message);
    },
  });

  const { mutate: mutateDeleteCategory } = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => { void invalidateMenu(); },
    onError: (error) => {
      const apiError = extractApiError(error);
      const message = (apiError.code ? DOMAIN_MESSAGES[apiError.code] : undefined) ?? MESSAGES.genericError;
      Alert.alert('Cannot delete category', message);
    },
  });

  const { mutate: mutateToggleStatus } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: MenuItemStatus }) => toggleMenuItemStatus(id, status),
    onSuccess: () => { void invalidateMenu(); },
  });

  const { mutate: mutateUpdateStock } = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number | null }) => updateMenuItemStock(id, quantity),
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


  // ── Tab + search handlers ─────────────────────────────────────────────────
  const handleSelectCategory = useCallback((id: number | 'all') => {
    setSelectedCategoryId(id);
    setSearchQuery('');
  }, []);

  const handleSearchChange = useCallback((q: string) => setSearchQuery(q), []);

  // ── Add category handlers ─────────────────────────────────────────────────
  const handleNewCategoryNameChange = useCallback((v: string) => setNewCategoryName(v), []);

  const handleConfirmAddCategory = useCallback(() => {
    if (!newCategoryName.trim()) return;
    mutateAddCategory(newCategoryName.trim());
    setNewCategoryName('');
    setShowAddCategoryModal(false);
  }, [newCategoryName, mutateAddCategory]);

  const handleOpenDeleteConfirm = useCallback((id: number, name: string) => {
    setDeletingCategoryId(id);
    setDeletingCategoryName(name);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deletingCategoryId === null) return;
    mutateDeleteCategory(deletingCategoryId);
    setDeletingCategoryId(null);
    setDeletingCategoryName('');
  }, [deletingCategoryId, mutateDeleteCategory]);

  const handleCancelDelete = useCallback(() => {
    setDeletingCategoryId(null);
    setDeletingCategoryName('');
  }, []);

  const handleOpenRename = useCallback((id: number, currentName: string) => {
    setRenamingCategoryId(id);
    setRenamingCategoryName(currentName);
  }, []);

  const handleRenameNameChange = useCallback((v: string) => setRenamingCategoryName(v), []);

  const handleConfirmRename = useCallback(() => {
    if (renamingCategoryId === null || !renamingCategoryName.trim() || isRenamingCategory) return;
    mutateUpdateCategory({ id: renamingCategoryId, name: renamingCategoryName.trim() });
  }, [renamingCategoryId, renamingCategoryName, isRenamingCategory, mutateUpdateCategory]);

  const handleCancelRename = useCallback(() => {
    setRenamingCategoryId(null);
    setRenamingCategoryName('');
  }, []);

  // ── Item status + delete handlers ─────────────────────────────────────────
  const handleToggleItemStatus = useCallback(
    (itemId: number, status: MenuItemStatus) => { mutateToggleStatus({ id: itemId, status }); },
    [mutateToggleStatus],
  );

  const handleDeleteItem = useCallback(
    (id: number) => {
      // Guard enforced by guardedItemIds — MenuItemCard should not call this for guarded items
      if (guardedItemIds.has(id)) return;
      mutateDeleteItem(id);
    },
    [guardedItemIds, mutateDeleteItem],
  );

  const handleUpdateItemStock = useCallback(
    (itemId: number, quantity: number | null) => mutateUpdateStock({ id: itemId, quantity }),
    [mutateUpdateStock],
  );

  // ── Add item handlers ─────────────────────────────────────────────────────
  const addHandlers = makeOptionGroupHandlers(setAddItemForm);

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

  const handleAddItemPhotoChange = useCallback(
    (photo: AddItemForm['photo']) => setAddItemForm((prev) => ({ ...prev, photo })),
    [],
  );

  const handlePickAddPhoto = useCallback(async () => {
    const photo = await pickPhoto();
    if (photo) handleAddItemPhotoChange(photo);
  }, [handleAddItemPhotoChange]);

  const handleAddOptionGroup = useCallback(() => addHandlers.addOptionGroup(), []);
  const handleRemoveOptionGroup = useCallback((i: number) => addHandlers.removeOptionGroup(i), []);
  const handleOptionGroupChange = useCallback(
    (gi: number, field: 'name' | 'is_required' | 'min_selections' | 'max_selections', value: string | boolean | number) =>
      addHandlers.changeOptionGroup(gi, field, value),
    [],
  );
  const handleAddOption = useCallback((gi: number) => addHandlers.addOption(gi), []);
  const handleRemoveOption = useCallback((gi: number, oi: number) => addHandlers.removeOption(gi, oi), []);
  const handleOptionChange = useCallback(
    (gi: number, oi: number, field: 'name' | 'additional_price_cents', value: string | number) =>
      addHandlers.changeOption(gi, oi, field, value),
    [],
  );

  const handleAddItemSubmit = useCallback(() => {
    if (addItemCategoryId === null || !addItemForm.name.trim() || !addItemForm.price.trim()) return;
    mutateAddItem({ categoryId: addItemCategoryId, form: addItemForm });
  }, [addItemCategoryId, addItemForm, mutateAddItem]);


  return {
    categories, filteredItems, guardedItemIds, isLoading, isError,
    hasMissingSystemCategories, restaurantStatus, useStockSystem, menuView,
    selectedCategoryId, searchQuery, handleSelectCategory, handleSearchChange,
    showAddCategoryModal, newCategoryName, setShowAddCategoryModal,
    handleNewCategoryNameChange, handleConfirmAddCategory,
    renamingCategoryId, renamingCategoryName, isRenamingCategory,
    handleOpenRename, handleRenameNameChange, handleConfirmRename, handleCancelRename,
    deletingCategoryId, deletingCategoryName,
    handleOpenDeleteConfirm, handleConfirmDelete, handleCancelDelete,
    handleToggleItemStatus, handleDeleteItem, handleUpdateItemStock,
    addItemCategoryId, addItemForm, isAddingItem,
    handleOpenAddItem, handleCloseAddItem,
    handleAddItemFieldChange, handleAddItemPhotoChange, handlePickAddPhoto,
    handleAddOptionGroup, handleRemoveOptionGroup, handleOptionGroupChange,
    handleAddOption, handleRemoveOption, handleOptionChange, handleAddItemSubmit,
  };
}
