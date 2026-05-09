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
      // Use locale-appropriate name so the form header shows the right language.
      // type.name is the primary name (Thai in this database).
      // type.name_mm is Burmese. type.name_en is English.
      const localeName =
        locale === 'mm' ? (type.name_mm ?? type.name_en ?? type.name)
        : locale === 'en' ? (type.name_en ?? type.name)
        : type.name; // 'th' — use the Thai primary name

      navigation.navigate('NinetyDayReportForm', {
        serviceTypeId:     type.id,
        serviceTypeName:   localeName,
        serviceTypeNameEn: type.name_en,
        price:             type.price,
      });
    },
    [navigation, locale],
  );

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return { types, isLoading, isRefreshing, isError, handleRefresh, handleSelectType, handleBack };
}
