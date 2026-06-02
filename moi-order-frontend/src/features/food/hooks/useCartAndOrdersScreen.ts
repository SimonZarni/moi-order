import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCartStore, CartItem } from '@/shared/store/cartStore';
import { RootStackParamList } from '@/types/navigation';
import { FoodOrder } from '@/types/models';
import { useFoodOrdersData, UseFoodOrdersDataResult } from './useFoodOrdersData';

export interface UseCartAndOrdersScreenResult {
  // Cart
  cartItems:       CartItem[];
  restaurantName:  string;
  cartTotalCents:  number;
  // Orders
  orders:          FoodOrder[];
  isOrdersLoading: boolean;
  isOrdersError:   boolean;
  // Handlers
  handleCheckout:   () => void;
  handleClearCart:  () => void;
  handleOrderPress: (order: FoodOrder) => void;
  handleBack:       () => void;
}

export function useCartAndOrdersScreen(): UseCartAndOrdersScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const cartItems      = useCartStore((s) => s.items);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const totalCents     = useCartStore((s) => s.totalCents());
  const clearCart      = useCartStore((s) => s.clearCart);

  const { orders, isLoading, isError }: UseFoodOrdersDataResult = useFoodOrdersData();

  const handleCheckout  = useCallback(() => navigation.navigate('Checkout'),                          [navigation]);
  const handleClearCart = useCallback(() => clearCart(),                                               [clearCart]);
  const handleOrderPress = useCallback(
    (order: FoodOrder) => navigation.navigate('FoodOrderDetail', { orderId: order.id }),
    [navigation],
  );
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  return {
    cartItems,
    restaurantName,
    cartTotalCents:  totalCents,
    orders,
    isOrdersLoading: isLoading,
    isOrdersError:   isError,
    handleCheckout,
    handleClearCart,
    handleOrderPress,
    handleBack,
  };
}
