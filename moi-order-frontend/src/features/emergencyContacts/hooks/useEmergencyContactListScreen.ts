import { useCallback } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useEmergencyContacts } from './useEmergencyContactsData';
import { RootStackParamList } from '@/types/navigation';
import { EmergencyContact } from '@/types/models';

export interface UseEmergencyContactListScreenResult {
  contacts: EmergencyContact[];
  type: string;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  handleEndReached: () => void;
  handleRefresh: () => void;
  handleContactPress: (contact: EmergencyContact) => void;
  handleBack: () => void;
}

export function useEmergencyContactListScreen(): UseEmergencyContactListScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<RouteProp<RootStackParamList, 'EmergencyContactList'>>();
  const { type }   = route.params;

  const {
    contacts, isLoading, isError, isRefreshing,
    hasNextPage, isFetchingNextPage, fetchNextPage, refetch,
  } = useEmergencyContacts(type);

  const handleEndReached = useCallback((): void => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback((): void => { refetch(); }, [refetch]);

  const handleContactPress = useCallback((contact: EmergencyContact): void => {
    navigation.navigate('EmergencyContactDetail', { contactId: contact.id });
  }, [navigation]);

  const handleBack = useCallback((): void => { navigation.goBack(); }, [navigation]);

  return {
    contacts,
    type,
    isLoading,
    isError,
    isRefreshing,
    hasNextPage,
    isFetchingNextPage,
    handleEndReached,
    handleRefresh,
    handleContactPress,
    handleBack,
  };
}
