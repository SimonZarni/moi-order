import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { FoodOrder } from '@/types/models';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { deleteFoodOrder } from '@/shared/api/foodOrders';
import { useFoodOrdersData, UseFoodOrdersDataResult } from './useFoodOrdersData';

export interface UseFoodOrdersScreenResult {
  orders:            FoodOrder[];
  isOrdersLoading:   boolean;
  isOrdersError:     boolean;
  isSelecting:       boolean;
  selectedIds:       Set<string>;
  isDeletingOrders:  boolean;
  handleOrderPress:  (order: FoodOrder) => void;
  handleBack:        () => void;
  handleEnterSelect: () => void;
  handleCancelSelect: () => void;
  handleToggleSelect: (id: string) => void;
  handleDeleteSelected: () => void;
}

export function useFoodOrdersScreen(): UseFoodOrdersScreenResult {
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { orders, isLoading, isError }: UseFoodOrdersDataResult = useFoodOrdersData();

  const [isSelecting, setIsSelecting]   = useState(false);
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set());

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => deleteFoodOrder(id))),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOOD_ORDERS.LIST });
      setSelectedIds(new Set());
      setIsSelecting(false);
    },
  });

  const handleOrderPress = useCallback(
    (order: FoodOrder) => {
      if (isSelecting) {
        if (order.status !== FOOD_ORDER_STATUS.Cancelled) return;
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.has(order.id) ? next.delete(order.id) : next.add(order.id);
          return next;
        });
        return;
      }
      navigation.navigate('FoodOrderDetail', { orderId: order.id });
    },
    [isSelecting, navigation],
  );

  const handleBack         = useCallback(() => navigation.goBack(), [navigation]);
  const handleEnterSelect  = useCallback(() => { setIsSelecting(true); setSelectedIds(new Set()); }, []);
  const handleCancelSelect = useCallback(() => { setIsSelecting(false); setSelectedIds(new Set()); }, []);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    Alert.alert(
      'Delete Orders',
      `Delete ${ids.length} cancelled order${ids.length > 1 ? 's' : ''}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(ids),
        },
      ],
    );
  }, [selectedIds, deleteMutation]);

  return {
    orders,
    isOrdersLoading:    isLoading,
    isOrdersError:      isError,
    isSelecting,
    selectedIds,
    isDeletingOrders:   deleteMutation.isPending,
    handleOrderPress,
    handleBack,
    handleEnterSelect,
    handleCancelSelect,
    handleToggleSelect,
    handleDeleteSelected,
  };
}
