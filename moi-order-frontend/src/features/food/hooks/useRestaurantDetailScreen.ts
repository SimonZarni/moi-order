import { useCallback } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { MenuItem } from '@/types/models';
import { useRestaurantDetailData } from './useRestaurantDetailData';
import { useCartStore } from '@/shared/store/cartStore';

type DetailRoute = RouteProp<RootStackParamList, 'RestaurantDetail'>;

export interface UseRestaurantDetailScreenResult {
  restaurant: ReturnType<typeof useRestaurantDetailData>['restaurant'];
  isLoading: boolean;
  isError: boolean;
  cartItemCount: number;
  cartTotalCents: number;
  getQuantity: (menuItemId: number) => number;
  handleBack: () => void;
  handleAddItem: (item: MenuItem) => void;
  handleRemoveItem: (menuItemId: number) => void;
  handleCartPress: () => void;
}

export function useRestaurantDetailScreen(): UseRestaurantDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<DetailRoute>();
  const { restaurantId } = route.params;

  const { restaurant, isLoading, isError } = useRestaurantDetailData(restaurantId);
  const addItem    = useCartStore((s) => s.addItem);
  const increment  = useCartStore((s) => s.increment);
  const decrement  = useCartStore((s) => s.decrement);
  const cartCount  = useCartStore((s) => s.itemCount());
  const cartTotal  = useCartStore((s) => s.totalCents());
  const getQty     = useCartStore((s) => s.getQuantity);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleAddItem = useCallback(
    (item: MenuItem) => {
      if (!restaurant) return;
      const qty = getQty(item.id);
      if (qty === 0) {
        addItem(
          { menuItemId: item.id, name: item.name, priceCents: item.price_cents, photoUrl: item.photo_url },
          restaurant.id,
          restaurant.name,
        );
      } else {
        increment(item.id);
      }
    },
    [restaurant, addItem, increment, getQty],
  );

  const handleRemoveItem = useCallback(
    (menuItemId: number) => decrement(menuItemId),
    [decrement],
  );

  const handleCartPress = useCallback(() => navigation.navigate('Checkout'), [navigation]);

  return {
    restaurant,
    isLoading,
    isError,
    cartItemCount:  cartCount,
    cartTotalCents: cartTotal,
    getQuantity:    getQty,
    handleBack,
    handleAddItem,
    handleRemoveItem,
    handleCartPress,
  };
}
