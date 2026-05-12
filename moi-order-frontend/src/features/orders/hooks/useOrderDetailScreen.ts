import { useCallback, useMemo, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';

import { useOrderDetail } from './useOrderDetail';
import { fetchSubmissionResultUrl } from '@/shared/api/submissions';
import { RootStackParamList } from '@/types/navigation';
import { ServiceSubmission } from '@/types/models';
import { SUBMISSION_STATUS } from '@/types/enums';

type RouteParams = RouteProp<RootStackParamList, 'OrderDetail'>;

export interface UseOrderDetailScreenResult {
  submission: ServiceSubmission | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  canPay: boolean;
  awaitingConfirmation: boolean;
  canCancel: boolean;
  isCancelling: boolean;
  handleCancelOrder: () => void;
  canDownload: boolean;
  isDownloading: boolean;
  isSavingResult: boolean;
  downloadError: string | null;
  previewImageUrl: string | null;
  docPreviewUrl: string | null;
  handleDocumentPress: (url: string) => void;
  handleCloseDocPreview: () => void;
  handleRefresh: () => void;
  handleBack: () => void;
  handlePayNow: () => void;
  handleDownloadResult: () => void;
  handleSaveResult: () => Promise<void>;
  handleClosePreview: () => void;
  handleViewAllOrders: () => void;
}

export function useOrderDetailScreen(): UseOrderDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { submissionId } = route.params;

  const { submission, isLoading, isRefreshing, isError, refetch, cancelMutation } = useOrderDetail(submissionId);

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [docPreviewUrl, setDocPreviewUrl]     = useState<string | null>(null);
  const [downloadError, setDownloadError]     = useState<string | null>(null);
  const [isSavingResult, setIsSavingResult]   = useState(false);

  const isPending = submission?.status === SUBMISSION_STATUS.PendingPayment;

  const canPay = useMemo(
    () => isPending && (submission?.payment_authorized ?? false),
    [isPending, submission?.payment_authorized],
  );

  const awaitingConfirmation = useMemo(
    () => isPending && !(submission?.payment_authorized ?? false),
    [isPending, submission?.payment_authorized],
  );

  const canCancel = useMemo(
    () => isPending,
    [isPending],
  );

  const handleCancelOrder = useCallback((): void => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this service order? This cannot be undone.',
      [
        { text: 'Keep Order', style: 'cancel' },
        {
          text: 'Cancel Order',
          style: 'destructive',
          onPress: () => cancelMutation.mutate(),
        },
      ],
    );
  }, [cancelMutation]);

  const canDownload = useMemo(
    () => submission?.status === SUBMISSION_STATUS.Completed && submission?.has_result === true,
    [submission?.status, submission?.has_result],
  );

  const { mutate: downloadResult, isPending: isDownloading } = useMutation<void, Error>({
    mutationFn: async () => {
      setDownloadError(null);
      const { url, mime_type } = await fetchSubmissionResultUrl(submissionId);

      if (mime_type.startsWith('image/')) {
        setPreviewImageUrl(url);
        return;
      }

      const ext    = mime_type.includes('pdf') ? 'pdf' : (mime_type.split('/')[1] ?? 'bin');
      const fileUri = `${FileSystem.cacheDirectory}result_${submissionId}.${ext}`;
      const result = await FileSystem.downloadAsync(url, fileUri);
      if (result.status !== 200) throw new Error(`Download failed (HTTP ${result.status}).`);

      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(result.uri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          type: mime_type,
          flags: 1,
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

  const handleSaveResult = useCallback(async (): Promise<void> => {
    if (!previewImageUrl) return;
    setIsSavingResult(true);
    try {
      const fileUri = `${FileSystem.cacheDirectory}result_${submissionId}_${Date.now()}.png`;
      const result  = await FileSystem.downloadAsync(previewImageUrl, fileUri);
      if (result.status !== 200) throw new Error(`Download failed (HTTP ${result.status})`);

      const permission = await MediaLibrary.requestPermissionsAsync(true);
      if (permission.granted) {
        await MediaLibrary.saveToLibraryAsync(result.uri);
        await FileSystem.deleteAsync(result.uri, { idempotent: true });
        Alert.alert('Saved', 'Result file saved to your gallery.');
      } else {
        const canShare = await Sharing.isAvailableAsync();
        if (!canShare) throw new Error('Sharing not available on this device');
        await Sharing.shareAsync(result.uri, { mimeType: 'image/png', dialogTitle: 'Save result file' });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      Alert.alert('Error', `Could not save result file.\n${message}`);
    } finally {
      setIsSavingResult(false);
    }
  }, [previewImageUrl, submissionId]);

  const handleRefresh        = useCallback((): void => { refetch(); }, [refetch]);
  const handleBack           = useCallback((): void => { navigation.goBack(); }, [navigation]);
  const handleViewAllOrders  = useCallback((): void => { navigation.navigate('MainTabs', { screen: 'Orders' }); }, [navigation]);
  const handleClosePreview = useCallback((): void => { setPreviewImageUrl(null); }, []);

  const handleDocumentPress = useCallback((url: string): void => {
    const path = (url.split('?')[0] ?? '').toLowerCase();
    if (/\.(jpg|jpeg|png|gif|webp|heic|heif)$/.test(path)) {
      setDocPreviewUrl(url);
    } else {
      Linking.openURL(url).catch(() =>
        Alert.alert('Cannot Open File', 'Unable to open this file on your device.'),
      );
    }
  }, []);

  const handleCloseDocPreview = useCallback((): void => { setDocPreviewUrl(null); }, []);

  const handlePayNow = useCallback((): void => {
    navigation.navigate('Payment', { kind: 'submission', submissionId });
  }, [navigation, submissionId]);

  const handleDownloadResult = useCallback((): void => { downloadResult(); }, [downloadResult]);

  return {
    submission, isLoading, isRefreshing, isError,
    canPay, awaitingConfirmation, canCancel, isCancelling: cancelMutation.isPending, handleCancelOrder,
    canDownload, isDownloading, isSavingResult,
    downloadError, previewImageUrl,
    docPreviewUrl, handleDocumentPress, handleCloseDocPreview,
    handleRefresh, handleBack, handlePayNow,
    handleDownloadResult, handleSaveResult, handleClosePreview,
    handleViewAllOrders,
  };
}
