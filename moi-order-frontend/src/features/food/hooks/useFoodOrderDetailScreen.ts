import { useCallback, useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { RootStackParamList } from '@/types/navigation';
import { FoodOrder } from '@/types/models';
import { FOOD_ORDER_STATUS, FOOD_PAYMENT_METHOD } from '@/types/enums';
import { LINE_OA_URL, ORDER_PAYMENT_TIMEOUT_MS } from '@/shared/constants/config';
import { ERROR_CODES } from '@/shared/constants/errorCodes';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { cancelFoodOrder, completeFoodOrder, notifyLinePayment } from '@/shared/api/foodOrders';
import { ApiError } from '@/types/models';
import { useLocaleStore } from '@/shared/store/localeStore';
import { useFoodOrderDetailData } from './useFoodOrdersData';

type DetailRoute = RouteProp<RootStackParamList, 'FoodOrderDetail'>;

export interface UseFoodOrderDetailScreenResult {
  order: FoodOrder | undefined;
  isLoading: boolean;
  isError: boolean;
  isPaymentTimedOut: boolean;
  invoiceVisible: boolean;
  completeModalVisible: boolean;
  isCompleting: boolean;
  rating: number | null;
  review: string;
  copyMessage: string | null;
  copyHint: string | null;
  hasCopied: boolean;
  handleBack: () => void;
  handlePromptPayPress: () => void;
  handleCopyMessage: () => void;
  handleChatPress: () => void;
  handleRefetch: () => void;
  handleInvoiceOpen: () => void;
  handleInvoiceClose: () => void;
  handleSlideComplete: () => void;
  handleCompleteConfirm: () => void;
  handleCompleteCancel: () => void;
  handleRatingChange: (r: number) => void;
  handleReviewChange: (t: string) => void;
  handleCallRestaurant: () => void;
  handleOrderAgain: () => void;
  handleCancelOrder: () => void;
  isCancelling: boolean;
}

export function useFoodOrderDetailScreen(): UseFoodOrderDetailScreenResult {
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route       = useRoute<DetailRoute>();
  const queryClient = useQueryClient();
  const { orderId } = route.params;

  const { order, isLoading, isError, refetch } = useFoodOrderDetailData(orderId);
  const { locale } = useLocaleStore();

  const [invoiceVisible,    setInvoiceVisible]    = useState(false);
  const [completeModalVisible, setCompleteModal]  = useState(false);
  const [isCompleting,      setIsCompleting]      = useState(false);
  const [isCancelling,      setIsCancelling]      = useState(false);
  const [hasCopied,         setHasCopied]         = useState(false);
  const [rating,            setRating]            = useState<number | null>(null);
  const [review,            setReview]            = useState('');

  const isLinePay = order?.payment_method === FOOD_PAYMENT_METHOD.LinePay;

  const copyMessage = useMemo<string | null>(() => {
    if (!order?.can_show_prompt_pay || !isLinePay) return null;
    const num  = order.order_number ?? order.id;
    const rest = order.restaurant_name ?? '';
    if (locale === 'mm') {
      return `အမှာစာ ${num} (${rest}) အတွက် ငွေပေးချေရန် အဆင်သင့်ဖြစ်ပါသည်။`;
    }
    if (locale === 'th') {
      return `ฉันพร้อมชำระเงินสำหรับออร์เดอร์ ${num} จาก ${rest}`;
    }
    return `I am ready to pay for order ${num} for ${rest}.`;
  }, [order, isLinePay, locale]);

  const copyHint = useMemo<string | null>(() => {
    if (!order?.can_show_prompt_pay || !isLinePay) return null;
    if (locale === 'mm') return 'အောက်ပါစာကူး၍ ကျွန်ုပ်တို့ LINE channel တွင် ကူးထည့်ပေးပို့ပါ';
    if (locale === 'th') return 'คัดลอกข้อความด้านล่างและวางในช่อง LINE ของเรา';
    return 'Copy the message below and paste it in our LINE channel';
  }, [order?.can_show_prompt_pay, isLinePay, locale]);

  const handleCopyMessage = useCallback(async () => {
    if (!copyMessage) return;
    try {
      await Clipboard.setStringAsync(copyMessage);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      // Native module not yet compiled into binary — show Alert as fallback
      Alert.alert(
        locale === 'mm' ? 'ကော်ပီကူးရန်' : 'Copy this message',
        copyMessage,
        [{ text: 'OK' }],
      );
    }
  }, [copyMessage, locale]);

  const handleBack         = useCallback(() => navigation.goBack(), [navigation]);
  const handleInvoiceOpen  = useCallback(() => setInvoiceVisible(true), []);
  const handleInvoiceClose = useCallback(() => setInvoiceVisible(false), []);

  const handlePromptPayPress = useCallback(async () => {
    try {
      await notifyLinePayment(orderId);
      // oaMessage?text= causes LINE to show "User not found" — LINE doesn't split the
      // query string when resolving the OA handle. Open the OA chat directly instead.
      Linking.openURL(LINE_OA_URL).catch(() =>
        Alert.alert('Cannot open LINE', 'Please open LINE and search for Moi Order to complete your payment.'),
      );
    } catch (e: unknown) {
      const code = (e as ApiError)?.code;

      if (code === ERROR_CODES.LINE_NOT_FOLLOWING) {
        Alert.alert(
          'Follow Moi Order on LINE',
          'Please follow us on LINE to receive your order confirmation.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Follow Now',
              onPress: () => Linking.openURL(LINE_OA_URL).catch(() => {}),
            },
          ],
        );
        return;
      }

      if (code === ERROR_CODES.LINE_NOT_LINKED) {
        Alert.alert('LINE Account Required', 'Please sign in with LINE to use LINE Pay.');
        return;
      }

      Linking.openURL(LINE_OA_URL).catch(() =>
        Alert.alert('Cannot open LINE', 'Please open LINE and search for Moi Order to complete your payment.'),
      );
    }
  }, [orderId]);

  const handleChatPress = useCallback(() => {
    navigation.navigate('OrderChat', {
      orderId,
      orderNumber: order?.order_number ?? null,
      restaurantName: order?.restaurant_name ?? null,
    });
  }, [navigation, orderId, order?.order_number, order?.restaurant_name]);

  const handleRefetch = useCallback(() => refetch(), [refetch]);

  const handleSlideComplete = useCallback(() => {
    setCompleteModal(true);
  }, []);

  const handleCompleteConfirm = useCallback(async () => {
    if (!order || isCompleting) return;
    setIsCompleting(true);
    try {
      const updated = await completeFoodOrder(order.id, {
        rating: rating,
        review: review.trim() || null,
      });
      queryClient.setQueryData(QUERY_KEYS.FOOD_ORDERS.DETAIL(order.id), updated);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOOD_ORDERS.LIST });
      setCompleteModal(false);
    } catch {
      Alert.alert('Error', 'Could not complete order. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  }, [order, isCompleting, rating, review, queryClient]);

  const handleCompleteCancel = useCallback(() => setCompleteModal(false), []);

  const handleRatingChange = useCallback((r: number) => setRating(r), []);
  const handleReviewChange = useCallback((t: string) => setReview(t), []);

  const handleCallRestaurant = useCallback(() => {
    const phone = order?.restaurant_phone;
    if (!phone) return;
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Cannot call', 'Unable to place a call on this device.'),
    );
  }, [order]);

  const handleCancelOrder = useCallback(() => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'Keep Order', style: 'cancel' },
        {
          text: 'Cancel Order',
          style: 'destructive',
          onPress: async () => {
            if (!order) return;
            setIsCancelling(true);
            try {
              const updated = await cancelFoodOrder(order.id);
              queryClient.setQueryData(QUERY_KEYS.FOOD_ORDERS.DETAIL(order.id), updated);
              queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOOD_ORDERS.LIST });
            } catch {
              Alert.alert('Error', 'Could not cancel order. Please try again.');
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ],
    );
  }, [order, queryClient]);

  // Show a warning banner when the restaurant hasn't responded for 30+ minutes.
  // The backend auto-expires at 60 min; this gives users early visibility.
  const isPaymentTimedOut = useMemo(() => {
    if (!order || order.status !== FOOD_ORDER_STATUS.OrderPlaced) return false;
    return Date.now() - new Date(order.created_at).getTime() > ORDER_PAYMENT_TIMEOUT_MS;
  }, [order]);

  // Navigate back to the restaurant so the user can re-place the order.
  const handleOrderAgain = useCallback(() => {
    if (!order) return;
    navigation.navigate('RestaurantDetail', { restaurantId: order.restaurant_id });
  }, [order, navigation]);

  return {
    order,
    isLoading,
    isError,
    isPaymentTimedOut,
    invoiceVisible,
    completeModalVisible,
    isCompleting,
    rating,
    review,
    copyMessage,
    copyHint,
    hasCopied,
    handleBack,
    handlePromptPayPress,
    handleCopyMessage,
    handleChatPress,
    handleRefetch,
    handleInvoiceOpen,
    handleInvoiceClose,
    handleSlideComplete,
    handleCompleteConfirm,
    handleCompleteCancel,
    handleRatingChange,
    handleReviewChange,
    handleCallRestaurant,
    handleOrderAgain,
    handleCancelOrder,
    isCancelling,
  };
}
