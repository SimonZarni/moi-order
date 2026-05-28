import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Crypto from 'expo-crypto';
import { RootStackParamList } from '@/types/navigation';
import { FOOD_PAYMENT_METHOD, FoodPaymentMethod } from '@/types/enums';
import { UserAddress } from '@/types/models';
import { CartItem, useCartStore } from '@/shared/store/cartStore';
import { useAddresses } from '@/features/address/hooks/useAddresses';
import { usePlaceFoodOrder } from './useFoodOrdersData';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Checkout'>;

export interface UseCheckoutScreenResult {
  items: CartItem[];
  restaurantName: string;
  subtotalCents: number;
  paymentMethod: FoodPaymentMethod;
  notes: string;
  selectedAddress: UserAddress | null;
  isPlacing: boolean;
  setPaymentMethod:      (method: FoodPaymentMethod) => void;
  setNotes:              (text: string) => void;
  handleIncrement:       (cartKey: string) => void;
  handleDecrement:       (cartKey: string) => void;
  handleBack:            () => void;
  handleChangeAddress:   () => void;
  handlePlaceOrder:      () => void;
}

export function useCheckoutScreen(): UseCheckoutScreenResult {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();

  const items          = useCartStore((s) => s.items);
  const restaurantId   = useCartStore((s) => s.restaurantId);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const totalCents     = useCartStore((s) => s.totalCents());
  const clearCart      = useCartStore((s) => s.clearCart);
  const increment      = useCartStore((s) => s.increment);
  const decrement      = useCartStore((s) => s.decrement);

  const [paymentMethod, setPaymentMethod] = useState<FoodPaymentMethod>(FOOD_PAYMENT_METHOD.Cod);
  const [notes, setNotes]                 = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const { addresses } = useAddresses();

  // Pre-select default address on first load.
  useEffect(() => {
    if (selectedAddressId === null && addresses.length > 0) {
      const def = addresses.find((a) => a.is_default) ?? addresses[0];
      if (def) setSelectedAddressId(def.id);
    }
  }, [addresses, selectedAddressId]);

  // Receive address selection from AddressListScreen via route params.
  useEffect(() => {
    const incomingId = route.params?.selectedAddressId;
    if (incomingId !== undefined) {
      setSelectedAddressId(incomingId);
    }
  }, [route.params?.selectedAddressId]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  const { mutate: placeOrder, isPending: isPlacing } = usePlaceFoodOrder();

  const handleBack    = useCallback(() => navigation.goBack(), [navigation]);
  const handleIncrement = useCallback((cartKey: string) => increment(cartKey), [increment]);
  const handleDecrement = useCallback((cartKey: string) => decrement(cartKey), [decrement]);

  const handleChangeAddress = useCallback(() => {
    navigation.navigate('AddressList', { mode: 'select' });
  }, [navigation]);

  const handlePlaceOrder = useCallback(async () => {
    if (restaurantId === null || items.length === 0) return;

    const idempotencyKey = await Crypto.randomUUID();

    placeOrder(
      {
        restaurant_id:       restaurantId,
        payment_method:      paymentMethod,
        idempotency_key:     idempotencyKey,
        delivery_address_id: selectedAddressId,
        delivery_address:    null,
        customer_notes:      notes.trim() || null,
        items: items.map((i) => ({
          menu_item_id:     i.menuItemId,
          quantity:         i.quantity,
          notes:            null,
          selected_options: i.selectedOptions.map((o) => ({
            option_group_id: o.optionGroupId,
            option_id:       o.optionId,
          })),
        })),
      },
      {
        onSuccess: (order) => {
          clearCart();
          navigation.replace('FoodOrderDetail', { orderId: order.id });
        },
        onError: () => {
          Alert.alert('Order failed', 'Could not place your order. Please try again.');
        },
      },
    );
  }, [restaurantId, items, paymentMethod, selectedAddressId, notes, placeOrder, clearCart, navigation]);

  return {
    items,
    restaurantName,
    subtotalCents:  totalCents,
    paymentMethod,
    notes,
    selectedAddress,
    isPlacing,
    setPaymentMethod,
    setNotes,
    handleIncrement,
    handleDecrement,
    handleBack,
    handleChangeAddress,
    handlePlaceOrder,
  };
}
