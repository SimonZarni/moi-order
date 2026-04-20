import { useCallback, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';

import { useTicketOrderDetail } from './useTicketOrderDetail';
import { fetchTicketOrderEticketUrl } from '@/shared/api/ticketOrders';
import { TICKET_ORDER_STATUS } from '@/types/enums';
import { RootStackParamList } from '@/types/navigation';

type RouteParams = RouteProp<RootStackParamList, 'TicketOrderDetail'>;

export interface UseTicketOrderDetailScreenResult {
  order: ReturnType<typeof useTicketOrderDetail>['order'];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  canPayNow: boolean;
  canDownload: boolean;
  isDownloading: boolean;
  isSavingEticket: boolean;
  downloadError: string | null;
  previewImageUrl: string | null;
  handleRefresh: () => void;
  handleBack: () => void;
  handlePayNow: () => void;
  handleDownloadEticket: () => void;
  handleSaveEticket: () => Promise<void>;
  handleClosePreview: () => void;
}

export function useTicketOrderDetailScreen(): UseTicketOrderDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { ticketOrderId } = route.params;

  const { order, isLoading, isRefreshing, isError, refetch } = useTicketOrderDetail(ticketOrderId);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const canPayNow = useMemo(
    () => order?.status === TICKET_ORDER_STATUS.PendingPayment
       || order?.status === TICKET_ORDER_STATUS.PaymentFailed,
    [order?.status],
  );

  const canDownload = useMemo(
    () => order?.status === TICKET_ORDER_STATUS.Completed && order?.has_eticket === true,
    [order?.status, order?.has_eticket],
  );

  const [downloadError, setDownloadError] = useState<string | null>(null);

  const { mutate: downloadEticket, isPending: isDownloading } = useMutation<void, Error>({
    mutationFn: async () => {
      setDownloadError(null);
      const { url, mime_type } = await fetchTicketOrderEticketUrl(ticketOrderId);

      if (mime_type.startsWith('image/')) {
        setPreviewImageUrl(url);
        return;
      }

      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) throw new Error('Device storage is unavailable.');

      const ext = mime_type.includes('pdf') ? 'pdf' : (mime_type.split('/')[1] ?? 'bin');
      const result = await FileSystem.downloadAsync(
        url,
        `${cacheDir}eticket_${ticketOrderId}.${ext}`,
      );
      if (result.status !== 200) throw new Error(`Download failed (HTTP ${result.status}).`);

      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(result.uri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          type: mime_type,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        });
      } else {
        const canShare = await Sharing.isAvailableAsync();
        if (!canShare) throw new Error('File sharing is not supported on this device.');
        await Sharing.shareAsync(result.uri, {
          mimeType: mime_type,
          UTI: mime_type.includes('pdf') ? 'com.adobe.pdf' : mime_type,
        });
      }
    },
    onError: (err) => { setDownloadError(err.message); },
  });

  const [isSavingEticket, setIsSavingEticket] = useState(false);

  const handleSaveEticket = useCallback(async (): Promise<void> => {
    if (!previewImageUrl) return;
    setIsSavingEticket(true);
    try {
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) throw new Error('Cache directory unavailable');

      const fileUri = `${cacheDir}eticket_${ticketOrderId}_${Date.now()}.png`;
      const result = await FileSystem.downloadAsync(previewImageUrl, fileUri);
      if (result.status !== 200) throw new Error(`Download failed (HTTP ${result.status})`);

      const permission = await MediaLibrary.requestPermissionsAsync(true);
      if (permission.granted) {
        await MediaLibrary.saveToLibraryAsync(result.uri);
        await FileSystem.deleteAsync(result.uri, { idempotent: true });
        Alert.alert('Saved', 'E-ticket saved to your gallery.');
      } else {
        const canShare = await Sharing.isAvailableAsync();
        if (!canShare) throw new Error('Sharing not available on this device');
        await Sharing.shareAsync(result.uri, { mimeType: 'image/png', dialogTitle: 'Save e-ticket' });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      Alert.alert('Error', `Could not save e-ticket.\n${message}`);
    } finally {
      setIsSavingEticket(false);
    }
  }, [previewImageUrl, ticketOrderId]);

  const handleRefresh  = useCallback((): void => { refetch(); }, [refetch]);
  const handleBack     = useCallback((): void => { navigation.goBack(); }, [navigation]);
  const handleClosePreview = useCallback((): void => { setPreviewImageUrl(null); }, []);

  const handlePayNow = useCallback((): void => {
    navigation.navigate('Payment', { kind: 'ticket_order', ticketOrderId });
  }, [navigation, ticketOrderId]);

  const handleDownloadEticket = useCallback((): void => { downloadEticket(); }, [downloadEticket]);

  return {
    order, isLoading, isRefreshing, isError,
    canPayNow, canDownload, isDownloading, isSavingEticket,
    downloadError,
    previewImageUrl,
    handleRefresh, handleBack, handlePayNow, handleDownloadEticket, handleSaveEticket, handleClosePreview,
  };
}
