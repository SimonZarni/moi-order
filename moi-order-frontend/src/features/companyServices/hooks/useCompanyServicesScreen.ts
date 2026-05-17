import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCompanyServices, UseCompanyServicesResult } from './useCompanyServices';
import { ServiceType } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { useLocale } from '@/shared/hooks/useLocale';
import { localeName } from '@/shared/utils/localeName';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export interface UseCompanyServicesScreenResult {
  types: UseCompanyServicesResult['types'];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  handleRefresh: () => void;
  handleSelectType: (type: ServiceType) => void;
  handleBack: () => void;
}

export function useCompanyServicesScreen(): UseCompanyServicesScreenResult {
  const navigation = useNavigation<Nav>();
  const { locale } = useLocale();
  const { serviceId, types, isLoading, isRefreshing, isError, refetch } = useCompanyServices();

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);

  const handleSelectType = useCallback((type: ServiceType): void => {
    navigation.navigate('GenericServiceForm', {
      serviceTypeId: type.id,
      serviceId:     serviceId ?? 0,
      serviceName:   localeName(type, locale),
      price:         type.price,
    });
  }, [navigation, locale, serviceId]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { types, isLoading, isRefreshing, isError, handleRefresh, handleSelectType, handleBack };
}
