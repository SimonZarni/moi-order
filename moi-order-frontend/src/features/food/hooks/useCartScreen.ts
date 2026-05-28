import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCartStore, CartItem } from '@/shared/store/cartStore';
import { RootStackParamList } from '@/types/navigation';

export interface UseCartScreenResult {
  cartItems:       CartItem[];
  restaurantName:  string;
  cartTotalCents:  number;
  handleCheckout:  () => void;
  handleClearCart: () => void;
  handleBack:      () => void;
}

export function useCartScreen(): UseCartScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const cartItems      = useCartStore((s) => s.items);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const totalCents     = useCartStore((s) => s.totalCents());
  const clearCart      = useCartStore((s) => s.clearCart);

  const handleCheckout  = useCallback(() => navigation.navigate('Checkout'), [navigation]);
  const handleClearCart = useCallback(() => clearCart(), [clearCart]);
  const handleBack      = useCallback(() => navigation.goBack(), [navigation]);

  return {
    cartItems,
    restaurantName,
    cartTotalCents: totalCents,
    handleCheckout,
    handleClearCart,
    handleBack,
  };
}
