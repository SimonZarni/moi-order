/**
 * Principle: SRP — manages all state for the edit-order modal only.
 * Principle: DIP — calls api functions, never axios directly.
 * Reset on open: when visible flips true, state initialises from the live order snapshot.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMenuCategories } from '../../../api/menu';
import { editOrderItems } from '../../../api/orders';
import { CACHE_TTL, GC_TIME } from '../../../shared/constants/config';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { MENU_ITEM_STATUS } from '../../../types/enums';
import type { FoodOrder, FoodOrderItem, MenuItem } from '../../../types/models';

export interface EditableOriginalItem {
  id: number;
  name: string;
  quantity: number;
  pricePerUnit: number;
  subtotalCents: number;
}

export interface AddedItem {
  key: string;
  menu_item_id: number;
  name: string;
  price_cents: number;
  quantity: number;
}

export interface UseEditOrderResult {
  originalItems: EditableOriginalItem[];
  addedItems: AddedItem[];
  searchQuery: string;
  searchResults: MenuItem[];
  isLoadingMenu: boolean;
  isSubmitting: boolean;
  hasChanges: boolean;
  originalTotalCents: number;
  updatedTotalCents: number;
  removedCount: number;
  addedCount: number;
  handleOriginalDecrease: (id: number) => void;
  handleOriginalRemove: (id: number) => void;
  handleAddedDecrease: (key: string) => void;
  handleAddedRemove: (key: string) => void;
  handleSearchChange: (q: string) => void;
  handleAddMenuItem: (item: MenuItem) => void;
  handleSubmit: () => void;
  handleDiscard: () => void;
}

export function useEditOrder(
  order: FoodOrder | undefined,
  visible: boolean,
  onClose: () => void,
): UseEditOrderResult {
  const queryClient = useQueryClient();

  const [originalItems, setOriginalItems] = useState<EditableOriginalItem[]>([]);
  const [addedItems, setAddedItems]       = useState<AddedItem[]>([]);
  const [searchQuery, setSearchQuery]     = useState('');

  // Initialise state from order snapshot each time the modal opens.
  useEffect(() => {
    if (!visible || order?.items === undefined) return;

    setOriginalItems(
      order.items.map((item: FoodOrderItem) => ({
        id:           item.id,
        name:         item.name,
        quantity:     item.quantity,
        pricePerUnit: item.quantity > 0
          ? Math.round(item.subtotal_cents / item.quantity)
          : item.price_cents,
        subtotalCents: item.subtotal_cents,
      })),
    );
    setAddedItems([]);
    setSearchQuery('');
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  // Menu categories for the item picker — fetched only while modal is open.
  const { data: menuCategories = [], isLoading: isLoadingMenu } = useQuery({
    queryKey: QUERY_KEYS.MENU_CATEGORIES,
    queryFn:  getMenuCategories,
    staleTime: CACHE_TTL.MENU,
    gcTime:    GC_TIME.DEFAULT,
    enabled:  visible,
  });

  // Filter available items client-side by search query.
  const searchResults = useMemo<MenuItem[]>(() => {
    if (searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    return menuCategories
      .flatMap((cat) => cat.items)
      .filter(
        (item) =>
          item.status === MENU_ITEM_STATUS.Available &&
          item.name.toLowerCase().includes(q),
      );
  }, [menuCategories, searchQuery]);

  // Derived counts for the summary row.
  const initialCount  = order?.items?.length ?? 0;
  const removedCount  = initialCount - originalItems.length;
  const addedCount    = addedItems.length;

  const originalTotalCents = order?.total_cents ?? 0;

  const updatedTotalCents = useMemo(() => {
    const origSum  = originalItems.reduce((s, i) => s + i.subtotalCents, 0);
    const addedSum = addedItems.reduce((s, i) => s + i.price_cents * i.quantity, 0);
    return origSum + addedSum;
  }, [originalItems, addedItems]);

  const hasChanges = useMemo(() => {
    if (removedCount > 0 || addedCount > 0) return true;
    return originalItems.some((item) => {
      const orig = order?.items?.find((i: FoodOrderItem) => i.id === item.id);
      return orig !== undefined && orig.quantity !== item.quantity;
    });
  }, [originalItems, addedItems, removedCount, addedCount, order?.items]);

  // ── Original item handlers ──────────────────────────────────────────────────

  const handleOriginalDecrease = useCallback((id: number) => {
    setOriginalItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQty, subtotalCents: item.pricePerUnit * newQty };
      }),
    );
  }, []);

  const handleOriginalRemove = useCallback(
    (id: number) => setOriginalItems((prev) => prev.filter((i) => i.id !== id)),
    [],
  );

  // ── Added item handlers ─────────────────────────────────────────────────────

  const handleAddedDecrease = useCallback((key: string) => {
    setAddedItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
      ),
    );
  }, []);

  const handleAddedRemove = useCallback(
    (key: string) => setAddedItems((prev) => prev.filter((i) => i.key !== key)),
    [],
  );

  const handleSearchChange = useCallback((q: string) => setSearchQuery(q), []);

  const handleAddMenuItem = useCallback((menuItem: MenuItem) => {
    setAddedItems((prev) => {
      const existing = prev.find((i) => i.menu_item_id === menuItem.id);
      if (existing !== undefined) {
        return prev.map((i) =>
          i.menu_item_id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          key:           `new-${menuItem.id}-${Date.now()}`,
          menu_item_id:  menuItem.id,
          name:          menuItem.name,
          price_cents:   menuItem.price_cents,
          quantity:      1,
        },
      ];
    });
    setSearchQuery('');
  }, []);

  // ── Submit mutation ─────────────────────────────────────────────────────────

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () => {
      if (order === undefined) throw new Error('No order loaded');
      return editOrderItems(order.id, {
        existing_items: originalItems.map((i) => ({ id: i.id, quantity: i.quantity })),
        new_items:      addedItems.map((i) => ({ menu_item_id: i.menu_item_id, quantity: i.quantity })),
      });
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.ORDER_DETAIL(updated.id), updated);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS() });
      onClose();
    },
  });

  const handleSubmit  = useCallback(() => mutate(), [mutate]);
  const handleDiscard = useCallback(() => onClose(), [onClose]);

  return {
    originalItems,
    addedItems,
    searchQuery,
    searchResults,
    isLoadingMenu,
    isSubmitting,
    hasChanges,
    originalTotalCents,
    updatedTotalCents,
    removedCount,
    addedCount,
    handleOriginalDecrease,
    handleOriginalRemove,
    handleAddedDecrease,
    handleAddedRemove,
    handleSearchChange,
    handleAddMenuItem,
    handleSubmit,
    handleDiscard,
  };
}
