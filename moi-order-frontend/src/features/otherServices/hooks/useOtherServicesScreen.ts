import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useOtherServices, UseOtherServicesResult } from './useOtherServices';
import { Service } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { localeName } from '@/shared/utils/localeName';
import { useLocale } from '@/shared/hooks/useLocale';

const SLUG_TO_SCREEN: Partial<Record<string, keyof RootStackParamList>> = {
  'test-service': 'TestServiceForm',
};

export interface UseOtherServicesScreenResult {
  services: UseOtherServicesResult['services'];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  handleRefresh: () => void;
  handleSelectService: (service: Service) => void;
  handleBack: () => void;
}

export function useOtherServicesScreen(): UseOtherServicesScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { locale } = useLocale();
  const { services, isLoading, isRefreshing, isError, refetch } = useOtherServices();

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);

  const handleSelectService = useCallback((service: Service): void => {
    const firstType = service.types[0];
    if (firstType === undefined) return;

    const screen = SLUG_TO_SCREEN[service.slug];

    // For services not in the hardcoded map, use the generic dynamic form.
    if (screen === undefined) {
      navigation.navigate('GenericServiceForm', {
        serviceTypeId: firstType.id,
        serviceId:     service.id,
        serviceName:   localeName(service, locale),
        price:         firstType.price,
      });
      return;
    }

    if (screen === 'TestServiceForm') {
      navigation.navigate('TestServiceForm', {
        serviceTypeId: firstType.id,
        price:         firstType.price,
      });
    }
  }, [navigation, locale]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { services, isLoading, isRefreshing, isError, handleRefresh, handleSelectService, handleBack };
}
