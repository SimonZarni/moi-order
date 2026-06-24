import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMenuCategories, updateMenuItem } from '../../../api/menu';
import { extractApiError } from '../../../api/client';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, PLATFORM_FEE_RATE } from '../../../shared/constants/config';
import { DOMAIN_MESSAGES, MESSAGES } from '../../../shared/constants/messages';
import {
  buildItemFormData,
  makeOptionGroupHandlers,
  EMPTY_FORM,
  pickPhoto,
} from './useMenuScreen';
import type { AddItemForm } from './useMenuScreen';
import type { MenuCategory, MenuItem } from '../../../types/models';

const FEE = 1 + PLATFORM_FEE_RATE;

export interface UseEditMenuItemScreenResult {
  item: MenuItem | null;
  isLoading: boolean;
  form: AddItemForm;
  existingPhotoUrl: string | null;
  isSaving: boolean;
  saveError: string | null;
  canSubmit: boolean;
  customerPriceCents: number;
  customerOriginalPriceCents: number | null;
  discountCents: number;
  handleFieldChange: (field: 'name' | 'description' | 'price' | 'original_price', value: string) => void;
  handlePhotoChange: (photo: AddItemForm['photo']) => void;
  handlePickPhoto: () => void;
  handleAddOptionGroup: () => void;
  handleRemoveOptionGroup: (index: number) => void;
  handleOptionGroupChange: (gi: number, field: 'name' | 'is_required' | 'min_selections' | 'max_selections', value: string | boolean | number) => void;
  handleAddOption: (gi: number) => void;
  handleRemoveOption: (gi: number, oi: number) => void;
  handleOptionChange: (gi: number, oi: number, field: 'name' | 'additional_price_cents', value: string | number) => void;
  handleSubmit: () => void;
}

interface UseEditMenuItemScreenProps {
  itemId: number;
  onBack: () => void;
}

export function useEditMenuItemScreen({ itemId, onBack }: UseEditMenuItemScreenProps): UseEditMenuItemScreenResult {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<AddItemForm>(EMPTY_FORM);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: QUERY_KEYS.MENU_CATEGORIES,
    queryFn: getMenuCategories,
    staleTime: CACHE_TTL.MENU,
  });

  const item = useMemo<MenuItem | null>(() => {
    // Search default menu categories first
    for (const cat of categories ?? []) {
      const found = cat.items.find((i) => i.id === itemId);
      if (found) return found;
    }
    // Fallback: item may belong to a session category (not in MENU_CATEGORIES cache)
    const sessionCaches = queryClient.getQueriesData<MenuCategory[]>({ queryKey: ['session-menu'] });
    for (const [, sessionCats] of sessionCaches) {
      for (const cat of sessionCats ?? []) {
        const found = cat.items.find((i) => i.id === itemId);
        if (found) return found;
      }
    }
    return null;
  }, [categories, itemId, queryClient]);

  // Initialize form once when item resolves from cache
  useEffect(() => {
    if (!item) return;
    setForm({
      name: item.name,
      description: item.description ?? '',
      price: String(Math.round(item.price_cents / FEE) / 100),
      original_price: item.original_price_cents != null
        ? String(Math.round(item.original_price_cents / FEE) / 100)
        : '',
      photo: null,
      option_groups: item.option_groups.map((g) => ({
        name: g.name,
        is_required: g.is_required,
        min_selections: g.min_selections,
        max_selections: g.max_selections,
        options: g.options.map((o) => ({ name: o.name, additional_price_cents: o.additional_price_cents })),
      })),
    });
    setExistingPhotoUrl(item.photo_url);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  // ── Computed pricing ───────────────────────────────────────────────────────

  const customerPriceCents = useMemo(() => {
    const n = parseFloat(form.price);
    return !isNaN(n) ? Math.round(n * 100 * FEE) : 0;
  }, [form.price]);

  const customerOriginalPriceCents = useMemo(() => {
    if (!form.original_price.trim()) return null;
    const n = parseFloat(form.original_price);
    return !isNaN(n) ? Math.round(n * 100 * FEE) : null;
  }, [form.original_price]);

  const discountCents = useMemo(
    () => customerOriginalPriceCents !== null
      ? Math.max(0, customerOriginalPriceCents - customerPriceCents)
      : 0,
    [customerOriginalPriceCents, customerPriceCents],
  );

  // ── Mutation ───────────────────────────────────────────────────────────────

  const { mutate: mutateUpdate, isPending: isSaving } = useMutation({
    mutationFn: async (f: AddItemForm) => updateMenuItem(itemId, await buildItemFormData(f)),
    onSuccess: (updatedItem) => {
      setSaveError(null);
      queryClient.setQueryData<MenuCategory[]>(QUERY_KEYS.MENU_CATEGORIES, (old) => {
        if (!old) return old;
        return old.map((cat) => ({
          ...cat,
          items: cat.items.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
        }));
      });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MENU_CATEGORIES });
      onBack();
    },
    onError: (error) => {
      const apiError = extractApiError(error);
      const message = (apiError.code ? DOMAIN_MESSAGES[apiError.code] : undefined) ?? MESSAGES.genericError;
      setSaveError(message);
    },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────

  const optHandlers = useMemo(() => makeOptionGroupHandlers(setForm), []);

  const handleFieldChange = useCallback(
    (field: 'name' | 'description' | 'price' | 'original_price', value: string) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  const handlePhotoChange = useCallback(
    (photo: AddItemForm['photo']) => setForm((prev) => ({ ...prev, photo })),
    [],
  );

  const handlePickPhoto = useCallback(async () => {
    const photo = await pickPhoto();
    if (photo) handlePhotoChange(photo);
  }, [handlePhotoChange]);

  const handleAddOptionGroup    = useCallback(() => optHandlers.addOptionGroup(), [optHandlers]);
  const handleRemoveOptionGroup = useCallback((i: number) => optHandlers.removeOptionGroup(i), [optHandlers]);
  const handleOptionGroupChange = useCallback(
    (gi: number, field: 'name' | 'is_required' | 'min_selections' | 'max_selections', value: string | boolean | number) =>
      optHandlers.changeOptionGroup(gi, field, value),
    [optHandlers],
  );
  const handleAddOption    = useCallback((gi: number) => optHandlers.addOption(gi), [optHandlers]);
  const handleRemoveOption = useCallback((gi: number, oi: number) => optHandlers.removeOption(gi, oi), [optHandlers]);
  const handleOptionChange = useCallback(
    (gi: number, oi: number, field: 'name' | 'additional_price_cents', value: string | number) =>
      optHandlers.changeOption(gi, oi, field, value),
    [optHandlers],
  );

  const handleSubmit = useCallback(() => {
    if (!form.name.trim() || !form.price.trim() || isSaving) return;
    setSaveError(null);
    mutateUpdate(form);
  }, [form, isSaving, mutateUpdate]);

  return {
    item,
    isLoading,
    form,
    existingPhotoUrl,
    isSaving,
    saveError,
    canSubmit: !!form.name.trim() && !!form.price.trim() && !isSaving,
    customerPriceCents,
    customerOriginalPriceCents,
    discountCents,
    handleFieldChange,
    handlePhotoChange,
    handlePickPhoto,
    handleAddOptionGroup,
    handleRemoveOptionGroup,
    handleOptionGroupChange,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    handleSubmit,
  };
}
