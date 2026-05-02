import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { RootStackParamList } from '@/types/navigation';
import { FoodOrder } from '@/types/models';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { LINE_OA_URL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { completeFoodOrder } from '@/shared/api/foodOrders';
import { useFoodOrderDetailData } from './useFoodOrdersData';

type DetailRoute = RouteProp<RootStackParamList, 'FoodOrderDetail'>;

export interface UseFoodOrderDetailScreenResult {
  order: FoodOrder | undefined;
  isLoading: boolean;
  isError: boolean;
  invoiceVisible: boolean;
  completeModalVisible: boolean;
  isCompleting: boolean;
  rating: number | null;
  review: string;
  handleBack: () => void;
  handlePromptPayPress: () => void;
  handleRefetch: () => void;
  handleInvoiceOpen: () => void;
  handleInvoiceClose: () => void;
  handleSlideComplete: () => void;
  handleCompleteConfirm: () => void;
  handleCompleteCancel: () => void;
  handleRatingChange: (r: number) => void;
  handleReviewChange: (t: string) => void;
  handleCallRestaurant: () => void;
}

export function useFoodOrderDetailScreen(): UseFoodOrderDetailScreenResult {
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route       = useRoute<DetailRoute>();
  const queryClient = useQueryClient();
  const { orderId } = route.params;

  const { order, isLoading, isError, refetch } = useFoodOrderDetailData(orderId);

  const [invoiceVisible,    setInvoiceVisible]    = useState(false);
  const [completeModalVisible, setCompleteModal]  = useState(false);
  const [isCompleting,      setIsCompleting]      = useState(false);
  const [rating,            setRating]            = useState<number | null>(null);
  const [review,            setReview]            = useState('');

  const handleBack         = useCallback(() => navigation.goBack(), [navigation]);
  const handleInvoiceOpen  = useCallback(() => setInvoiceVisible(true), []);
  const handleInvoiceClose = useCallback(() => setInvoiceVisible(false), []);

  const handlePromptPayPress = useCallback(() => {
    Linking.openURL(LINE_OA_URL).catch(() =>
      Alert.alert('Cannot open LINE', 'Please open LINE and search for @moiorder to complete your payment.'),
    );
  }, []);

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

  return {
    order,
    isLoading,
    isError,
    invoiceVisible,
    completeModalVisible,
    isCompleting,
    rating,
    review,
    handleBack,
    handlePromptPayPress,
    handleRefetch,
    handleInvoiceOpen,
    handleInvoiceClose,
    handleSlideComplete,
    handleCompleteConfirm,
    handleCompleteCancel,
    handleRatingChange,
    handleReviewChange,
    handleCallRestaurant,
  };
}
