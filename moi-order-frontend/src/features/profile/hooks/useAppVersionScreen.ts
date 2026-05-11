import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import * as Application from 'expo-application';

import { fetchAppConfig } from '@/shared/api/appConfig';
import { APP_UPDATE_TYPE } from '@/types/enums';
import type { AppConfigUpdate } from '@/shared/api/appConfig';
import type { RootStackParamList } from '@/types/navigation';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';

export type UpdateStatus = 'up_to_date' | 'update_available' | 'update_required' | 'unknown';

export interface UseAppVersionScreenResult {
  currentVersion: string;
  updateConfig: AppConfigUpdate | null;
  isLoading: boolean;
  updateStatus: UpdateStatus;
  storeUrl: string | null;
  handleOpenStore: () => void;
  handleBack: () => void;
}

function compareVersions(current: string, minimum: string): boolean {
  const parse = (v: string): [number, number, number] => {
    const parts = v.split('.').map(Number);
    return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
  };
  const [cMaj, cMin, cPat] = parse(current);
  const [mMaj, mMin, mPat] = parse(minimum);
  return mMaj > cMaj || (mMaj === cMaj && mMin > cMin) || (mMaj === cMaj && mMin === cMin && mPat > cPat);
}

function resolveUpdateStatus(update: AppConfigUpdate, currentVersion: string): UpdateStatus {
  const minVersion = Platform.OS === 'ios' ? update.ios_min_version : update.android_min_version;

  if (update.type === APP_UPDATE_TYPE.None || minVersion === null) return 'up_to_date';

  const isBehind = compareVersions(currentVersion, minVersion);
  if (!isBehind) return 'up_to_date';

  return update.type === APP_UPDATE_TYPE.Required ? 'update_required' : 'update_available';
}

export function useAppVersionScreen(): UseAppVersionScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const currentVersion = Application.nativeApplicationVersion ?? '—';

  const { data: appConfig, isLoading } = useQuery({
    queryKey: QUERY_KEYS.APP_CONFIG,
    queryFn: fetchAppConfig,
    staleTime: 60_000,
  });

  const updateConfig = appConfig?.update ?? null;

  const updateStatus: UpdateStatus = (() => {
    if (!updateConfig || currentVersion === '—') return 'unknown';
    return resolveUpdateStatus(updateConfig, currentVersion);
  })();

  const storeUrl = updateConfig
    ? (Platform.OS === 'ios' ? updateConfig.ios_store_url : updateConfig.android_store_url)
    : null;

  const handleOpenStore = useCallback((): void => {
    if (storeUrl) {
      Linking.openURL(storeUrl).catch(() => {});
    }
  }, [storeUrl]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    currentVersion,
    updateConfig,
    isLoading,
    updateStatus,
    storeUrl,
    handleOpenStore,
    handleBack,
  };
}
