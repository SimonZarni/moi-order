import { useCallback, useState } from 'react';
import { Linking, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { FoodOrder } from '@/types/models';
import { LINE_OA_URL } from '@/shared/constants/config';
import { useFoodOrderDetailData } from './useFoodOrdersData';

type DetailRoute = RouteProp<RootStackParamList, 'FoodOrderDetail'>;

export interface UseFoodOrderDetailScreenResult {
  order: FoodOrder | undefined;
  isLoading: boolean;
  isError: boolean;
  invoiceVisible: boolean;
  handleBack: () => void;
  handlePromptPayPress: () => void;
  handleRefetch: () => void;
  handleInvoiceOpen: () => void;
  handleInvoiceClose: () => void;
}

export function useFoodOrderDetailScreen(): UseFoodOrderDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<DetailRoute>();
  const { orderId } = route.params;

  const { order, isLoading, isError, refetch } = useFoodOrderDetailData(orderId);
  const [invoiceVisible, setInvoiceVisible] = useState(false);

  const handleBack         = useCallback(() => navigation.goBack(), [navigation]);
  const handleInvoiceOpen  = useCallback(() => setInvoiceVisible(true), []);
  const handleInvoiceClose = useCallback(() => setInvoiceVisible(false), []);

  const handlePromptPayPress = useCallback(() => {
    Linking.openURL(LINE_OA_URL).catch(() =>
      Alert.alert('Cannot open LINE', 'Please open LINE and search for @moiorder to complete payment.'),
    );
  }, []);

  const handleRefetch = useCallback(() => refetch(), [refetch]);

  return {
    order,
    isLoading,
    isError,
    invoiceVisible,
    handleBack,
    handlePromptPayPress,
    handleRefetch,
    handleInvoiceOpen,
    handleInvoiceClose,
  };
}
