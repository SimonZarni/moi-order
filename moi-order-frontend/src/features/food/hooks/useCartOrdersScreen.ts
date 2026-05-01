import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCartStore, CartItem } from '@/shared/store/cartStore';
import { RootStackParamList } from '@/types/navigation';
import { FoodOrder } from '@/types/models';
import { useFoodOrdersData, UseFoodOrdersDataResult } from './useFoodOrdersData';

export interface UseCartOrdersScreenResult {
  // Cart
  cartItems:          CartItem[];
  restaurantName:     string;
  cartTotalCents:     number;
  handleCheckout:     () => void;
  handleClearCart:    () => void;
  // Order history
  orders:             FoodOrder[];
  isOrdersLoading:    boolean;
  isOrdersError:      boolean;
  handleOrderPress:   (order: FoodOrder) => void;
  handleBack:         () => void;
}

export function useCartOrdersScreen(): UseCartOrdersScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const cartItems      = useCartStore((s) => s.items);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const totalCents     = useCartStore((s) => s.totalCents());
  const clearCart      = useCartStore((s) => s.clearCart);

  const { orders, isLoading: isOrdersLoading, isError: isOrdersError }: UseFoodOrdersDataResult = useFoodOrdersData();

  const handleCheckout  = useCallback(() => navigation.navigate('Checkout'),    [navigation]);
  const handleClearCart = useCallback(() => clearCart(),                         [clearCart]);
  const handleBack      = useCallback(() => navigation.goBack(),                 [navigation]);

  const handleOrderPress = useCallback(
    (order: FoodOrder) => {
      navigation.navigate('FoodOrderDetail', { orderId: order.id });
    },
    [navigation],
  );

  return {
    cartItems,
    restaurantName,
    cartTotalCents:  totalCents,
    handleCheckout,
    handleClearCart,
    orders,
    isOrdersLoading,
    isOrdersError,
    handleOrderPress,
    handleBack,
  };
}
