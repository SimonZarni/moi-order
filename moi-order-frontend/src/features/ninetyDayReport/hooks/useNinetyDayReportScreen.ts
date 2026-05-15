import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useServices } from '@/features/ninetyDayReport/hooks/useServices';
import { ServiceType } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { useLocale } from '@/shared/hooks/useLocale';

export interface UseNinetyDayReportScreenResult {
  types: ServiceType[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  handleRefresh: () => void;
  handleSelectType: (type: ServiceType) => void;
  handleBack: () => void;
}

export function useNinetyDayReportScreen(): UseNinetyDayReportScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { services, isLoading, isRefreshing, isError, refetch } = useServices();
  const { locale } = useLocale();

  // Find the 90-day-report service and expose its types.
  const ninetyDayService = services.find((s) => s.slug === '90-day-report');
  const types = ninetyDayService?.types ?? [];

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);

  const handleSelectType = useCallback(
    (type: ServiceType): void => {
      const typeLocaleName =
        locale === 'mm' ? (type.name_mm ?? type.name_en ?? type.name)
        : locale === 'en' ? (type.name_en ?? type.name)
        : type.name;

      navigation.navigate('GenericServiceForm', {
        serviceTypeId: type.id,
        serviceId:     ninetyDayService?.id ?? 0,
        serviceName:   typeLocaleName,
        price:         type.price,
      });
    },
    [navigation, locale, ninetyDayService],
  );

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { types, isLoading, isRefreshing, isError, handleRefresh, handleSelectType, handleBack };
}
