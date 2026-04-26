import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useEmbassyServices, UseEmbassyServicesResult } from './useEmbassyServices';
import { Service } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { localeName } from '@/shared/utils/localeName';
import { useLocale } from '@/shared/hooks/useLocale';

// OCP: new embassy service = new entry here only. No changes to screen.
const SLUG_TO_SCREEN: Partial<Record<string, keyof RootStackParamList>> = {
  'embassy-residential-service':  'EmbassyResidentialForm',
  'embassy-car-license':          'EmbassyCarLicenseForm',
  'embassy-bank-service':         'EmbassyBankForm',
  'embassy-visa-recommendation':  'EmbassyVisaRecommendationForm',
};

export interface UseEmbassyServicesScreenResult {
  services: UseEmbassyServicesResult['services'];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  handleRefresh: () => void;
  handleSelectService: (service: Service) => void;
  handleBack: () => void;
}

export function useEmbassyServicesScreen(): UseEmbassyServicesScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { locale } = useLocale();
  const { services, isLoading, isRefreshing, isError, refetch } = useEmbassyServices();

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);

  const handleSelectService = useCallback((service: Service): void => {
    const firstType = service.types[0];
    if (firstType === undefined) return;

    const screen = SLUG_TO_SCREEN[service.slug];

    if (screen === undefined) {
      navigation.navigate('GenericServiceForm', {
        serviceTypeId: firstType.id,
        serviceId:     service.id,
        serviceName:   localeName(service, locale),
        price:         firstType.price,
      });
      return;
    }

    if (screen === 'EmbassyResidentialForm') {
      navigation.navigate('EmbassyResidentialForm', { serviceTypeId: firstType.id, price: firstType.price });
    } else if (screen === 'EmbassyCarLicenseForm') {
      navigation.navigate('EmbassyCarLicenseForm', { serviceTypeId: firstType.id, price: firstType.price });
    } else if (screen === 'EmbassyBankForm') {
      navigation.navigate('EmbassyBankForm', { serviceTypeId: firstType.id, price: firstType.price });
    } else if (screen === 'EmbassyVisaRecommendationForm') {
      navigation.navigate('EmbassyVisaRecommendationForm', { serviceTypeId: firstType.id, price: firstType.price });
    }
  }, [navigation, locale]);

  const handleBack = useCallback((): void => { navigation.goBack(); }, [navigation]);

  return { services, isLoading, isRefreshing, isError, handleRefresh, handleSelectService, handleBack };
}
