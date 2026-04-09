import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useServices } from '@/features/ninetyDayReport/hooks/useServices';
import { ServiceType } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

export interface UseNinetyDayReportScreenResult {
  types: ServiceType[];
  isLoading: boolean;
  isError: boolean;
  handleSelectType: (type: ServiceType) => void;
  handleBack: () => void;
}

export function useNinetyDayReportScreen(): UseNinetyDayReportScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { services, isLoading, isError } = useServices();

  // Find the 90-day-report service and expose its types.
  const ninetyDayService = services.find((s) => s.slug === '90-day-report');
  const types = ninetyDayService?.types ?? [];

  const handleSelectType = useCallback(
    (type: ServiceType): void => {
      navigation.navigate('NinetyDayReportForm', {
        serviceTypeId:     type.id,
        serviceTypeName:   type.name,
        serviceTypeNameEn: type.name_en,
        price:             type.price,
      });
    },
    [navigation],
  );

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { types, isLoading, isError, handleSelectType, handleBack };
}
