import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { Restaurant } from '@/types/models';
import { useRestaurantListData, UseRestaurantListDataResult } from './useRestaurantListData';
import { useCartStore } from '@/shared/store/cartStore';

export interface UseFoodScreenResult extends UseRestaurantListDataResult {
  cartItemCount: number;
  handleRestaurantPress: (restaurant: Restaurant) => void;
  handleMapPress: () => void;
  handleCartPress: () => void;
}

export function useFoodScreen(): UseFoodScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const listData   = useRestaurantListData();
  const cartCount  = useCartStore((s) => s.itemCount());

  const handleRestaurantPress = useCallback(
    (restaurant: Restaurant) => {
      navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id });
    },
    [navigation],
  );

  const handleMapPress = useCallback(() => {
    navigation.navigate('RestaurantMap');
  }, [navigation]);

  const handleCartPress = useCallback(() => {
    navigation.navigate('Checkout');
  }, [navigation]);

  return {
    ...listData,
    cartItemCount:          cartCount,
    handleRestaurantPress,
    handleMapPress,
    handleCartPress,
  };
}
