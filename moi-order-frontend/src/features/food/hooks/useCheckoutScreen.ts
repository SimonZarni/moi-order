import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { RootStackParamList } from '@/types/navigation';
import { FOOD_PAYMENT_METHOD, FoodPaymentMethod } from '@/types/enums';
import { UserAddress } from '@/types/models';
import { CartItem, useCartStore } from '@/shared/store/cartStore';
import { useAddresses } from '@/features/address/hooks/useAddresses';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ApiError } from '@/types/models';
import { DOMAIN_ERROR_MESSAGES } from '@/shared/constants/errorCodes';
import { usePlaceFoodOrder } from './useFoodOrdersData';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Checkout'>;

export interface UseCheckoutScreenResult {
  items: CartItem[];
  restaurantName: string;
  subtotalCents: number;
  paymentMethod: FoodPaymentMethod;
  notes: string;
  contactNo: string;
  contactNoError: string | null;
  contactShakeAnim: Animated.Value;
  selectedAddress: UserAddress | null;
  hasDeliveryAddress: boolean;
  isPlacing: boolean;
  setPaymentMethod:      (method: FoodPaymentMethod) => void;
  setNotes:              (text: string) => void;
  setContactNo:          (text: string) => void;
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

  const [paymentMethod, setPaymentMethod] = useState<FoodPaymentMethod>(FOOD_PAYMENT_METHOD.LinePay);
  const [notes, setNotes]                 = useState('');
  const [contactNo, setContactNo]           = useState('');
  const [contactNoError, setContactNoError] = useState<string | null>(null);
  const contactShakeAnim = useRef(new Animated.Value(0)).current;

  const shakeContactInput = useCallback(() => {
    Animated.sequence([
      Animated.timing(contactShakeAnim, { toValue: 10,  duration: 50, useNativeDriver: true }),
      Animated.timing(contactShakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(contactShakeAnim, { toValue: 6,   duration: 50, useNativeDriver: true }),
      Animated.timing(contactShakeAnim, { toValue: -6,  duration: 50, useNativeDriver: true }),
      Animated.timing(contactShakeAnim, { toValue: 0,   duration: 50, useNativeDriver: true }),
    ]).start();
  }, [contactShakeAnim]);
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
  const hasDeliveryAddress = selectedAddress !== null;

  const queryClient = useQueryClient();
  const { mutate: placeOrder, isPending: isPlacing } = usePlaceFoodOrder();

  const handleBack    = useCallback(() => navigation.goBack(), [navigation]);
  const handleIncrement = useCallback((cartKey: string) => increment(cartKey), [increment]);
  const handleDecrement = useCallback((cartKey: string) => decrement(cartKey), [decrement]);

  const handleChangeAddress = useCallback(() => {
    navigation.navigate('AddressList', { mode: 'select' });
  }, [navigation]);

  const handlePlaceOrder = useCallback(async () => {
    if (restaurantId === null || items.length === 0) return;

    if (!hasDeliveryAddress) {
      Alert.alert(
        'Delivery address required',
        'Please add a delivery address before placing your order.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Address', onPress: handleChangeAddress },
        ],
      );
      return;
    }

    if (contactNo.trim() === '') {
      setContactNoError('Contact number is required');
      shakeContactInput();
      return;
    }
    if (!/^\d{10}$/.test(contactNo.trim())) {
      setContactNoError('Contact number must be exactly 10 digits');
      shakeContactInput();
      return;
    }
    setContactNoError(null);

    const idempotencyKey = await Crypto.randomUUID();

    placeOrder(
      {
        restaurant_id:       restaurantId,
        payment_method:      paymentMethod,
        idempotency_key:     idempotencyKey,
        delivery_address_id: selectedAddressId,
        delivery_address:    null,
        customer_notes:      notes.trim() || null,
        contact_no:          contactNo.trim(),
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
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOOD_ORDERS.ACTIVE });
          navigation.replace('FoodOrderDetail', { orderId: order.id });
        },
        onError: (error) => {
          const apiError = error as unknown as ApiError;
          const message = DOMAIN_ERROR_MESSAGES[apiError.code] ?? 'Could not place your order. Please try again.';
          Alert.alert('Order failed', message);
        },
      },
    );
  }, [restaurantId, items, paymentMethod, selectedAddressId, notes, contactNo, hasDeliveryAddress, handleChangeAddress, shakeContactInput, placeOrder, clearCart, navigation]);

  return {
    items,
    restaurantName,
    subtotalCents:  totalCents,
    paymentMethod,
    notes,
    contactNo,
    contactNoError,
    contactShakeAnim,
    selectedAddress,
    hasDeliveryAddress,
    isPlacing,
    setPaymentMethod,
    setNotes,
    setContactNo,
    handleIncrement,
    handleDecrement,
    handleBack,
    handleChangeAddress,
    handlePlaceOrder,
  };
}
