import { useCallback, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
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
  canDownload: boolean;
  isDownloading: boolean;
  isSavingResult: boolean;
  downloadError: string | null;
  previewImageUrl: string | null;
  handleRefresh: () => void;
  handleBack: () => void;
  handlePayNow: () => void;
  handleDownloadResult: () => void;
  handleSaveResult: () => Promise<void>;
  handleClosePreview: () => void;
}

export function useOrderDetailScreen(): UseOrderDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteParams>();
  const { submissionId } = route.params;

  const { submission, isLoading, isRefreshing, isError, refetch } = useOrderDetail(submissionId);

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [downloadError, setDownloadError]     = useState<string | null>(null);
  const [isSavingResult, setIsSavingResult]   = useState(false);

  const canPay = useMemo(
    () => submission?.status === SUBMISSION_STATUS.PendingPayment,
    [submission?.status],
  );

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

      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) throw new Error('Device storage is unavailable.');

      const ext    = mime_type.includes('pdf') ? 'pdf' : (mime_type.split('/')[1] ?? 'bin');
      const result = await FileSystem.downloadAsync(url, `${cacheDir}result_${submissionId}.${ext}`);
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
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) throw new Error('Cache directory unavailable');

      const fileUri = `${cacheDir}result_${submissionId}_${Date.now()}.png`;
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

  const handleRefresh      = useCallback((): void => { refetch(); }, [refetch]);
  const handleBack         = useCallback((): void => { navigation.goBack(); }, [navigation]);
  const handleClosePreview = useCallback((): void => { setPreviewImageUrl(null); }, []);

  const handlePayNow = useCallback((): void => {
    navigation.navigate('Payment', { kind: 'submission', submissionId });
  }, [navigation, submissionId]);

  const handleDownloadResult = useCallback((): void => { downloadResult(); }, [downloadResult]);

  return {
    submission, isLoading, isRefreshing, isError,
    canPay, canDownload, isDownloading, isSavingResult,
    downloadError, previewImageUrl,
    handleRefresh, handleBack, handlePayNow,
    handleDownloadResult, handleSaveResult, handleClosePreview,
  };
}
