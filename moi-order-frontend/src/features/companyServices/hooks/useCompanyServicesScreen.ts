import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCompanyServices, UseCompanyServicesResult } from './useCompanyServices';
import { Service } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

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
  const { services, isLoading, isRefreshing, isError, refetch } = useCompanyServices();

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);

  const handleSelectService = useCallback((service: Service): void => {
    const firstType = service.types[0];
    if (firstType === undefined) return;

    if (service.slug === 'company-registration') {
      navigation.navigate('CompanyRegistrationForm', {
        serviceTypeId: firstType.id,
        price:         firstType.price,
      });
    }
  }, [navigation]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { services, isLoading, isRefreshing, isError, handleRefresh, handleSelectService, handleBack };
}
