import { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/types/navigation';
import { MenuItem, MenuItemOptionGroup } from '@/types/models';
import { buildCartKey, SelectedOption, useCartStore } from '@/shared/store/cartStore';
import { useRestaurantDetailData } from './useRestaurantDetailData';

type DetailRoute = RouteProp<RootStackParamList, 'MenuItemDetail'>;

export interface UseMenuItemDetailScreenResult {
  item:        MenuItem | null;
  restaurantId: number;
  selections:  Record<number, number[]>;
  quantity:    number;
  note:        string;
  isValid:     boolean;
  totalCents:  number;
  handleBack:           () => void;
  handleSelectOption:   (groupId: number, optionId: number, maxSelections: number) => void;
  handleQuantityChange: (delta: number) => void;
  handleNoteChange:     (text: string) => void;
  handleAddToCart:      () => void;
}

export function useMenuItemDetailScreen(): UseMenuItemDetailScreenResult {
  const navigation                  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { restaurantId, menuItemId } = useRoute<DetailRoute>().params;
  const { restaurant }              = useRestaurantDetailData(restaurantId);

  const addItem   = useCartStore((s) => s.addItem);
  const increment = useCartStore((s) => s.increment);

  const item = useMemo((): MenuItem | null => {
    if (!restaurant?.menu) return null;
    for (const cat of restaurant.menu) {
      const found = (cat.items ?? []).find((it) => it.id === menuItemId);
      if (found) return found;
    }
    return null;
  }, [restaurant, menuItemId]);

  const [selections, setSelections] = useState<Record<number, number[]>>({});
  const [quantity, setQuantity]     = useState(1);
  const [note, setNote]             = useState('');

  const isValid = useMemo((): boolean => {
    if (!item) return false;
    return item.option_groups.every((group: MenuItemOptionGroup) => {
      const selected = selections[group.id] ?? [];
      if (group.is_required && selected.length < Math.max(1, group.min_selections)) return false;
      return true;
    });
  }, [item, selections]);

  const totalCents = useMemo((): number => {
    if (!item) return 0;
    const additionalCents = Object.entries(selections).reduce((sum, [groupId, optIds]) => {
      const group = item.option_groups.find((g) => g.id === Number(groupId));
      if (!group) return sum;
      return sum + optIds.reduce((s, optId) => {
        const opt = group.options.find((o) => o.id === optId);
        return s + (opt?.additional_price_cents ?? 0);
      }, 0);
    }, 0);
    return (item.price_cents + additionalCents) * quantity;
  }, [item, selections, quantity]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleSelectOption = useCallback(
    (groupId: number, optionId: number, maxSelections: number): void => {
      setSelections((prev) => {
        const current = prev[groupId] ?? [];
        const isSelected = current.includes(optionId);
        let next: number[];
        if (maxSelections === 1) {
          next = isSelected ? [] : [optionId];
        } else {
          next = isSelected
            ? current.filter((id) => id !== optionId)
            : current.length < maxSelections ? [...current, optionId] : current;
        }
        return { ...prev, [groupId]: next };
      });
    },
    [],
  );

  const handleQuantityChange = useCallback((delta: number): void => {
    setQuantity((prev) => Math.max(1, prev + delta));
  }, []);

  const handleNoteChange = useCallback((text: string): void => setNote(text), []);

  const handleAddToCart = useCallback((): void => {
    if (!item || !restaurant || !isValid) return;

    const selectedOptions: SelectedOption[] = [];
    Object.entries(selections).forEach(([groupId, optIds]) => {
      const group = item.option_groups.find((g) => g.id === Number(groupId));
      if (!group) return;
      optIds.forEach((optId) => {
        const opt = group.options.find((o) => o.id === optId);
        if (!opt) return;
        selectedOptions.push({
          optionGroupId:        group.id,
          optionGroupName:      group.name,
          optionId:             opt.id,
          optionName:           opt.name,
          additionalPriceCents: opt.additional_price_cents,
        });
      });
    });

    const additionalCents = selectedOptions.reduce((s, o) => s + o.additionalPriceCents, 0);
    const cartKey         = buildCartKey(item.id, selectedOptions);

    // addItem handles: initial add, increments existing key, and restaurant-conflict alert.
    addItem(
      { cartKey, menuItemId: item.id, name: item.name, basePriceCents: item.price_cents,
        additionalPriceCents: additionalCents, photoUrl: item.photo_url, selectedOptions },
      restaurant.id,
      restaurant.name,
    );
    // For quantity > 1, increment the remaining units (no-op if addItem resolved async via Alert).
    for (let i = 1; i < quantity; i++) {
      increment(cartKey);
    }

    navigation.goBack();
  }, [item, restaurant, isValid, selections, quantity, increment, addItem, navigation]);

  return {
    item,
    restaurantId,
    selections,
    quantity,
    note,
    isValid,
    totalCents,
    handleBack,
    handleSelectOption,
    handleQuantityChange,
    handleNoteChange,
    handleAddToCart,
  };
}
