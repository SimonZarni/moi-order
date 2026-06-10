import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useMerchantApplicationData } from '@/features/merchant-application/hooks/useMerchantApplicationData';
import { MERCHANT_APP_DOWNLOAD_URL } from '@/shared/constants/config';
import { getAccountErrorMessage } from '@/shared/constants/errorCodes';
import { useStrings } from '@/shared/i18n';
import { RootStackParamList } from '@/types/navigation';
import { KycApplication } from '@/types/models';

export interface UseBecomeMerchantScreenResult {
  application: KycApplication | null | undefined;
  isLoading: boolean;
  isApplying: boolean;
  isCancelling: boolean;
  applyError: string | null;
  cancelError: string | null;
  hasDownloadLink: boolean;
  handleApply: () => void;
  handleCancel: () => void;
  handleBack: () => void;
  handleDownloadApp: () => void;
}

export function useBecomeMerchantScreen(): UseBecomeMerchantScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = useStrings();
  const { application, isLoading, applyMutation, cancelMutation } = useMerchantApplicationData();

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const handleApply = useCallback((): void => {
    applyMutation.mutate();
  }, [applyMutation]);

  const handleCancel = useCallback((): void => {
    Alert.alert(s.merchant.cancelConfirmTitle, s.merchant.cancelConfirmBody, [
      { text: s.merchant.cancelConfirmNo, style: 'cancel' },
      { text: s.merchant.cancelConfirmYes, style: 'destructive', onPress: () => cancelMutation.mutate() },
    ]);
  }, [cancelMutation, s]);

  const handleDownloadApp = useCallback((): void => {
    if (MERCHANT_APP_DOWNLOAD_URL) {
      Linking.openURL(MERCHANT_APP_DOWNLOAD_URL).catch(() => {});
    }
  }, []);

  return {
    application,
    isLoading,
    isApplying: applyMutation.isPending,
    isCancelling: cancelMutation.isPending,
    applyError: applyMutation.error
      ? getAccountErrorMessage(applyMutation.error.code, applyMutation.error.context)
      : null,
    cancelError: cancelMutation.error
      ? getAccountErrorMessage(cancelMutation.error.code, cancelMutation.error.context)
      : null,
    hasDownloadLink: MERCHANT_APP_DOWNLOAD_URL.length > 0,
    handleApply,
    handleCancel,
    handleBack,
    handleDownloadApp,
  };
}
