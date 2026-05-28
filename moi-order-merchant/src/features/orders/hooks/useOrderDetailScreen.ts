import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrder, updateOrderStatus, cancelOrderWithReason, confirmOrderPayment, CancelOrderPayload } from '../../../api/orders';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME } from '../../../shared/constants/config';
import type { FoodOrder } from '../../../types/models';

interface UseOrderDetailScreenResult {
  order: FoodOrder | undefined;
  isLoading: boolean;
  isError: boolean;
  isUpdating: boolean;
  isConfirmingPayment: boolean;
  cancelModalVisible: boolean;
  cancelReason: string;
  cancelDescription: string;
  handleUpdateStatus: (newStatus: string) => void;
  handleConfirmPayment: () => void;
  handleCancelPress: () => void;
  handleCancelModalClose: () => void;
  handleCancelReasonChange: (v: string) => void;
  handleCancelDescriptionChange: (v: string) => void;
  handleCancelConfirm: () => void;
}

export function useOrderDetailScreen(orderId: number): UseOrderDetailScreenResult {
  const queryClient = useQueryClient();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('closing_soon');
  const [cancelDescription, setCancelDescription] = useState('');

  const { data: order, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ORDER_DETAIL(orderId),
    queryFn: () => getOrder(orderId),
    staleTime: CACHE_TTL.ORDERS,
    gcTime: GC_TIME.DEFAULT,
    retry: 0,
  });

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS() });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS });
  }, [queryClient]);

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: (status: string) => updateOrderStatus(orderId, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.ORDER_DETAIL(orderId), updated);
      invalidate();
    },
  });

  const { mutate: mutateConfirm, isPending: isConfirmingPayment } = useMutation({
    mutationFn: () => confirmOrderPayment(orderId),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.ORDER_DETAIL(orderId), updated);
      invalidate();
    },
  });

  const { mutate: mutateCancel, isPending: isCancelling } = useMutation({
    mutationFn: (payload: CancelOrderPayload) => cancelOrderWithReason(orderId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.ORDER_DETAIL(orderId), updated);
      invalidate();
      setCancelModalVisible(false);
    },
  });

  const handleUpdateStatus = useCallback(
    (newStatus: string) => mutate(newStatus),
    [mutate],
  );

  const handleConfirmPayment = useCallback(() => mutateConfirm(), [mutateConfirm]);

  const handleCancelPress = useCallback(() => {
    setCancelReason('closing_soon');
    setCancelDescription('');
    setCancelModalVisible(true);
  }, []);

  const handleCancelModalClose = useCallback(() => setCancelModalVisible(false), []);
  const handleCancelReasonChange = useCallback((v: string) => setCancelReason(v), []);
  const handleCancelDescriptionChange = useCallback((v: string) => setCancelDescription(v), []);

  const handleCancelConfirm = useCallback(() => {
    mutateCancel({
      cancel_reason: cancelReason,
      cancel_description: cancelDescription.trim() || null,
    });
  }, [mutateCancel, cancelReason, cancelDescription]);

  return {
    order,
    isLoading,
    isError,
    isUpdating: isUpdating || isCancelling,
    isConfirmingPayment,
    cancelModalVisible,
    cancelReason,
    cancelDescription,
    handleUpdateStatus,
    handleConfirmPayment,
    handleCancelPress,
    handleCancelModalClose,
    handleCancelReasonChange,
    handleCancelDescriptionChange,
    handleCancelConfirm,
  };
}
