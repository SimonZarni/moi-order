import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrder, updateOrderStatus, cancelOrderWithReason, CancelOrderPayload } from '../../../api/orders';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, POLL_INTERVAL } from '../../../shared/constants/config';
import { ORDER_STATUS } from '../../../types/enums';
import type { FoodOrder } from '../../../types/models';

const PREP_TIME_MIN = 5;
const PREP_TIME_MAX = 180;
const PREP_TIME_STEP = 5;
const PREP_TIME_DEFAULT = 15;

interface StatusMutationPayload {
  status: string;
  preparationTimeMinutes?: number;
}

interface UseOrderDetailScreenResult {
  order: FoodOrder | undefined;
  isLoading: boolean;
  isError: boolean;
  isUpdating: boolean;
  cancelModalVisible: boolean;
  cancelReason: string;
  cancelDescription: string;
  preparationTimeMinutes: number;
  handleUpdateStatus: (newStatus: string) => void;
  handleCancelPress: () => void;
  handleCancelModalClose: () => void;
  handleCancelReasonChange: (v: string) => void;
  handleCancelDescriptionChange: (v: string) => void;
  handleCancelConfirm: () => void;
  handlePreparationTimeDecrease: () => void;
  handlePreparationTimeIncrease: () => void;
  handlePreparationTimePreset: (val: number) => void;
}

export function useOrderDetailScreen(orderId: string): UseOrderDetailScreenResult {
  const queryClient = useQueryClient();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('closing_soon');
  const [cancelDescription, setCancelDescription] = useState('');
  const [preparationTimeMinutes, setPreparationTimeMinutes] = useState(PREP_TIME_DEFAULT);

  const TERMINAL_STATUSES = new Set([
    ORDER_STATUS.Completed,
    ORDER_STATUS.Cancelled,
    ORDER_STATUS.Expired,
  ]);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ORDER_DETAIL(orderId),
    queryFn: () => getOrder(orderId),
    staleTime: CACHE_TTL.ORDERS,
    gcTime: GC_TIME.DEFAULT,
    retry: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || TERMINAL_STATUSES.has(status)) return false;
      return POLL_INTERVAL.ORDER_DETAIL;
    },
  });

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS() });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS });
  }, [queryClient]);

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: ({ status, preparationTimeMinutes: prepTime }: StatusMutationPayload) =>
      updateOrderStatus(orderId, status, prepTime),
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
    (newStatus: string) => mutate({
      status: newStatus,
      preparationTimeMinutes:
        newStatus === ORDER_STATUS.WaitingForPayment || newStatus === ORDER_STATUS.PreparingFood
          ? preparationTimeMinutes
          : undefined,
    }),
    [mutate, preparationTimeMinutes],
  );

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

  const handlePreparationTimeDecrease = useCallback(() => {
    setPreparationTimeMinutes((prev) => Math.max(PREP_TIME_MIN, prev - PREP_TIME_STEP));
  }, []);

  const handlePreparationTimeIncrease = useCallback(() => {
    setPreparationTimeMinutes((prev) => Math.min(PREP_TIME_MAX, prev + PREP_TIME_STEP));
  }, []);

  const handlePreparationTimePreset = useCallback((val: number) => {
    setPreparationTimeMinutes(val);
  }, []);

  return {
    order,
    isLoading,
    isError,
    isUpdating: isUpdating || isCancelling,
    cancelModalVisible,
    cancelReason,
    cancelDescription,
    preparationTimeMinutes,
    handleUpdateStatus,
    handleCancelPress,
    handleCancelModalClose,
    handleCancelReasonChange,
    handleCancelDescriptionChange,
    handleCancelConfirm,
    handlePreparationTimeDecrease,
    handlePreparationTimeIncrease,
    handlePreparationTimePreset,
  };
}
