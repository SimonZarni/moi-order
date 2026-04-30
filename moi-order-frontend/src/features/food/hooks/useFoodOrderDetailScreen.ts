import { useCallback } from 'react';
import { Linking, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { FoodOrder } from '@/types/models';
import { useFoodOrderDetailData } from './useFoodOrdersData';

type DetailRoute = RouteProp<RootStackParamList, 'FoodOrderDetail'>;

export interface UseFoodOrderDetailScreenResult {
  order: FoodOrder | undefined;
  isLoading: boolean;
  isError: boolean;
  handleBack: () => void;
  handleLinePayPress: () => void;
  handleRefetch: () => void;
}

export function useFoodOrderDetailScreen(): UseFoodOrderDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<DetailRoute>();
  const { orderId } = route.params;

  const { order, isLoading, isError, refetch } = useFoodOrderDetailData(orderId);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleLinePayPress = useCallback(() => {
    const url = order?.line_payment_url;
    if (!url) {
      Alert.alert('Payment pending', 'LINE Pay link is not yet available.');
      return;
    }
    Linking.openURL(url).catch(() =>
      Alert.alert('Cannot open LINE Pay', 'Please check that LINE is installed.'),
    );
  }, [order]);

  const handleRefetch = useCallback(() => refetch(), [refetch]);

  return {
    order,
    isLoading,
    isError,
    handleBack,
    handleLinePayPress,
    handleRefetch,
  };
}
