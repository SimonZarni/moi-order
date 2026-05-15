import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCompanyServices, UseCompanyServicesResult } from './useCompanyServices';
import { Service } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { localeName } from '@/shared/utils/localeName';
import { useLocale } from '@/shared/hooks/useLocale';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export interface UseCompanyServicesScreenResult {
  services: UseCompanyServicesResult['services'];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  handleRefresh: () => void;
  handleSelectService: (service: Service) => void;
  handleBack: () => void;
}

export function useCompanyServicesScreen(): UseCompanyServicesScreenResult {
  const navigation = useNavigation<Nav>();
  const { locale } = useLocale();
  const { services, isLoading, isRefreshing, isError, refetch } = useCompanyServices();

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);

  const handleSelectService = useCallback((service: Service): void => {
    const firstType = service.types[0];
    if (firstType === undefined) return;

    navigation.navigate('GenericServiceForm', {
      serviceTypeId: firstType.id,
      serviceId:     service.id,
      serviceName:   localeName(service, locale),
      price:         firstType.price,
    });
  }, [navigation, locale]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { services, isLoading, isRefreshing, isError, handleRefresh, handleSelectService, handleBack };
}
