import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useDailyInvoiceData } from './useDailyInvoiceData';
import type { DailyInvoice } from '../../../types/models';

export interface UseDailyInvoiceScreenResult {
  todayInvoice: DailyInvoice | undefined;
  isTodayLoading: boolean;
  historyInvoices: DailyInvoice[];
  isHistoryLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isQrUploading: boolean;
  handleUploadQr: () => Promise<void>;
}

export function useDailyInvoiceScreen(): UseDailyInvoiceScreenResult {
  const { today, history, uploadQrMutation } = useDailyInvoiceData();

  const historyInvoices: DailyInvoice[] =
    history.data?.pages.flatMap((page) => page.data) ?? [];

  const handleUploadQr = useCallback(async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: false,
    });

    if (result.canceled || result.assets.length === 0) return;

    const asset = result.assets[0];
    const ext   = asset.uri.split('.').pop() ?? 'jpg';
    const mime  = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    uploadQrMutation.mutate({ uri: asset.uri, type: mime, name: `payment-qr.${ext}` });
  }, [uploadQrMutation]);

  return {
    todayInvoice:     today.data,
    isTodayLoading:   today.isLoading,
    historyInvoices,
    isHistoryLoading: history.isLoading,
    hasNextPage:      history.hasNextPage ?? false,
    fetchNextPage:    history.fetchNextPage,
    isQrUploading:    uploadQrMutation.isPending,
    handleUploadQr,
  };
}
