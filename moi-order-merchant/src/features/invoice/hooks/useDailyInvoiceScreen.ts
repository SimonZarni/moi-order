import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
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
  qrUploadSuccess: boolean;
  qrUploadError: string | null;
  handleUploadQr: () => Promise<void>;
}

export function useDailyInvoiceScreen(): UseDailyInvoiceScreenResult {
  const { today, history, uploadQrMutation } = useDailyInvoiceData();
  const [qrUploadError, setQrUploadError] = useState<string | null>(null);

  const historyInvoices: DailyInvoice[] =
    history.data?.pages.flatMap((page) => page.data) ?? [];

  const handleUploadQr = useCallback(async (): Promise<void> => {
    setQrUploadError(null);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: false,
    });

    if (result.canceled || result.assets.length === 0) return;

    const asset = result.assets[0];
    const mime  = asset.mimeType ?? 'image/jpeg';
    const ext   = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
    const name  = `payment-qr.${ext}`;

    const fd = new FormData();

    if (Platform.OS === 'web') {
      const blob = await fetch(asset.uri).then((r) => r.blob());
      if (asset.uri.startsWith('blob:')) URL.revokeObjectURL(asset.uri);
      fd.append('qr_code', new File([blob], name, { type: mime }));
    } else {
      fd.append('qr_code', { uri: asset.uri, name, type: mime } as unknown as Blob);
    }

    uploadQrMutation.mutate(fd, {
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
        setQrUploadError(message);
      },
    });
  }, [uploadQrMutation]);

  return {
    todayInvoice:     today.data,
    isTodayLoading:   today.isLoading,
    historyInvoices,
    isHistoryLoading: history.isLoading,
    hasNextPage:      history.hasNextPage ?? false,
    fetchNextPage:    history.fetchNextPage,
    isQrUploading:    uploadQrMutation.isPending,
    qrUploadSuccess:  uploadQrMutation.isSuccess,
    qrUploadError,
    handleUploadQr,
  };
}
