import { useCallback, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { MenuItem } from '@/types/models';
import { buildCartKey, SelectedOption, useCartStore } from '@/shared/store/cartStore';
import { useRestaurantDetailData } from './useRestaurantDetailData';

type DetailRoute = RouteProp<RootStackParamList, 'RestaurantDetail'>;

export interface UseRestaurantDetailScreenResult {
  restaurant: ReturnType<typeof useRestaurantDetailData>['restaurant'];
  isLoading: boolean;
  isError: boolean;
  cartItemCount: number;
  cartTotalCents: number;
  pendingItem: MenuItem | null;
  getQuantity: (menuItemId: number) => number;
  handleBack: () => void;
  handleAddItem: (item: MenuItem) => void;
  handleRemoveItem: (cartKey: string) => void;
  handleCloseModifierSheet: () => void;
  handleConfirmModifiers: (item: MenuItem, selectedOptions: SelectedOption[]) => void;
  handleCartPress: () => void;
}

export function useRestaurantDetailScreen(): UseRestaurantDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<DetailRoute>();
  const { restaurantId } = route.params;

  const { restaurant, isLoading, isError } = useRestaurantDetailData(restaurantId);

  const addItem   = useCartStore((s) => s.addItem);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const cartCount = useCartStore((s) => s.itemCount());
  const cartTotal = useCartStore((s) => s.totalCents());
  const getQty    = useCartStore((s) => s.getQuantity);

  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleAddItem = useCallback(
    (item: MenuItem) => {
      if (!restaurant) return;
      if (item.option_groups.length > 0) {
        setPendingItem(item);
        return;
      }
      const cartKey = buildCartKey(item.id, []);
      if (getQty(item.id) > 0) {
        increment(cartKey);
      } else {
        addItem(
          { cartKey, menuItemId: item.id, name: item.name, basePriceCents: item.price_cents,
            additionalPriceCents: 0, photoUrl: item.photo_url, selectedOptions: [] },
          restaurant.id,
          restaurant.name,
        );
      }
    },
    [restaurant, addItem, increment, getQty],
  );

  const handleRemoveItem = useCallback(
    (cartKey: string) => decrement(cartKey),
    [decrement],
  );

  const handleCloseModifierSheet = useCallback(() => setPendingItem(null), []);

  const handleConfirmModifiers = useCallback(
    (item: MenuItem, selectedOptions: SelectedOption[]) => {
      if (!restaurant) return;
      const additionalPriceCents = selectedOptions.reduce((s, o) => s + o.additionalPriceCents, 0);
      const cartKey = buildCartKey(item.id, selectedOptions);
      addItem(
        { cartKey, menuItemId: item.id, name: item.name, basePriceCents: item.price_cents,
          additionalPriceCents, photoUrl: item.photo_url, selectedOptions },
        restaurant.id,
        restaurant.name,
      );
      setPendingItem(null);
    },
    [restaurant, addItem],
  );

  const handleCartPress = useCallback(() => navigation.navigate('Checkout'), [navigation]);

  return {
    restaurant,
    isLoading,
    isError,
    cartItemCount:  cartCount,
    cartTotalCents: cartTotal,
    pendingItem,
    getQuantity:    getQty,
    handleBack,
    handleAddItem,
    handleRemoveItem,
    handleCloseModifierSheet,
    handleConfirmModifiers,
    handleCartPress,
  };
}
