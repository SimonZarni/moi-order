import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useOtherServices, UseOtherServicesResult } from './useOtherServices';
import { Service } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

// Maps service slugs to their destination screen.
// OCP: new service = new entry here + new screen. No changes to OtherServicesScreen.
const SLUG_TO_SCREEN: Partial<Record<string, keyof RootStackParamList>> = {
  'company-registration': 'CompanyRegistrationForm',
  'airport-fast-track':   'AirportFastTrackForm',
  'embassy-residential':  'EmbassyResidentialForm',
  'embassy-car-license':  'EmbassyCarLicenseForm',
};

export interface UseOtherServicesScreenResult {
  services: UseOtherServicesResult['services'];
  isLoading: boolean;
  isError: boolean;
  handleSelectService: (service: Service) => void;
  handleBack: () => void;
}

export function useOtherServicesScreen(): UseOtherServicesScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { services, isLoading, isError } = useOtherServices();

  const handleSelectService = useCallback((service: Service): void => {
    const screen = SLUG_TO_SCREEN[service.slug];
    if (screen === undefined) return;

    // All current "other services" have exactly one service type.
    const firstType = service.types[0];
    if (firstType === undefined) return;

    if (screen === 'CompanyRegistrationForm') {
      navigation.navigate('CompanyRegistrationForm', {
        serviceTypeId: firstType.id,
        price:         firstType.price,
      });
    } else if (screen === 'AirportFastTrackForm') {
      navigation.navigate('AirportFastTrackForm', {
        serviceTypeId: firstType.id,
        price:         firstType.price,
      });
    } else if (screen === 'EmbassyResidentialForm') {
      navigation.navigate('EmbassyResidentialForm', {
        serviceTypeId: firstType.id,
        price:         firstType.price,
      });
    } else if (screen === 'EmbassyCarLicenseForm') {
      navigation.navigate('EmbassyCarLicenseForm', {
        serviceTypeId: firstType.id,
        price:         firstType.price,
      });
    }
  }, [navigation]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { services, isLoading, isError, handleSelectService, handleBack };
}
