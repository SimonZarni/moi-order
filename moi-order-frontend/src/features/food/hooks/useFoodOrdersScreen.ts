import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { FoodOrder } from '@/types/models';
import { useFoodOrdersData, UseFoodOrdersDataResult } from './useFoodOrdersData';

export interface UseFoodOrdersScreenResult {
  orders:          FoodOrder[];
  isOrdersLoading: boolean;
  isOrdersError:   boolean;
  handleOrderPress: (order: FoodOrder) => void;
  handleBack:      () => void;
}

export function useFoodOrdersScreen(): UseFoodOrdersScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orders, isLoading, isError }: UseFoodOrdersDataResult = useFoodOrdersData();

  const handleOrderPress = useCallback(
    (order: FoodOrder) => navigation.navigate('FoodOrderDetail', { orderId: order.id }),
    [navigation],
  );
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  return {
    orders,
    isOrdersLoading: isLoading,
    isOrdersError:   isError,
    handleOrderPress,
    handleBack,
  };
}
