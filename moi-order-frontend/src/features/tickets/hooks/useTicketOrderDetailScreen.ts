import { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';

import { useTicketOrderDetail } from './useTicketOrderDetail';
import { fetchTicketOrderEticketUrl } from '@/shared/api/ticketOrders';
import { TICKET_ORDER_STATUS } from '@/types/enums';
import { RootStackParamList } from '@/types/navigation';
import { ApiError } from '@/types/models';

type RouteParams = RouteProp<RootStackParamList, 'TicketOrderDetail'>;

export interface UseTicketOrderDetailScreenResult {
  order: ReturnType<typeof useTicketOrderDetail>['order'];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  canPayNow: boolean;
  canDownload: boolean;
  isDownloading: boolean;
  downloadError: ApiError | null;
  handleRefresh: () => void;
  handleBack: () => void;
  handlePayNow: () => void;
  handleDownloadEticket: () => void;
}

export function useTicketOrderDetailScreen(): UseTicketOrderDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { ticketOrderId } = route.params;

  const { order, isLoading, isRefreshing, isError, refetch } = useTicketOrderDetail(ticketOrderId);

  const canPayNow = useMemo(
    () => order?.status === TICKET_ORDER_STATUS.PendingPayment
       || order?.status === TICKET_ORDER_STATUS.PaymentFailed,
    [order?.status],
  );

  const canDownload = useMemo(
    () => order?.status === TICKET_ORDER_STATUS.Completed && order?.has_eticket === true,
    [order?.status, order?.has_eticket],
  );

  const { mutate: downloadEticket, isPending: isDownloading, error: downloadError } = useMutation<
    string,
    ApiError
  >({
    mutationFn: () => fetchTicketOrderEticketUrl(ticketOrderId),
    onSuccess: (url) => {
      // Open the signed PDF URL in the device's browser/PDF viewer.
      // Linking.openURL is imported from react-native at the component level
      // to avoid importing it in the hook; we expose the URL via a callback instead.
      import('react-native').then(({ Linking }) => Linking.openURL(url));
    },
  });

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);
  const handleBack    = useCallback((): void => { navigation.goBack(); }, [navigation]);

  const handlePayNow = useCallback((): void => {
    navigation.navigate('Payment', { kind: 'ticket_order', ticketOrderId });
  }, [navigation, ticketOrderId]);

  const handleDownloadEticket = useCallback((): void => { downloadEticket(); }, [downloadEticket]);

  return {
    order, isLoading, isRefreshing, isError,
    canPayNow, canDownload, isDownloading,
    downloadError: downloadError ?? null,
    handleRefresh, handleBack, handlePayNow, handleDownloadEticket,
  };
}
