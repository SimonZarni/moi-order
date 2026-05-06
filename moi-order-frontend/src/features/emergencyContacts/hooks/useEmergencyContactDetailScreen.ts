import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useEmergencyContactDetail } from './useEmergencyContactsData';
import { useLocale } from '@/shared/hooks/useLocale';
import { RootStackParamList } from '@/types/navigation';
import { EmergencyContact, EmergencyContactPhoto } from '@/types/models';

export interface UseEmergencyContactDetailScreenResult {
  contact: EmergencyContact | null;
  isLoading: boolean;
  isError: boolean;
  title: string;
  description: string | null;
  photos: EmergencyContactPhoto[];
  handleBack: () => void;
  handleCallPress: () => void;
  handleMapPress: () => void;
  handleFacebookPress: () => void;
  handleWebsitePress: () => void;
}

export function useEmergencyContactDetailScreen(): UseEmergencyContactDetailScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<RouteProp<RootStackParamList, 'EmergencyContactDetail'>>();
  const { contactId } = route.params;
  const { locale } = useLocale();

  const { contact, isLoading, isError } = useEmergencyContactDetail(contactId);

  const title = contact
    ? (locale === 'mm' ? contact.title_mm : contact.title_en)
    : '';

  const description = contact
    ? (locale === 'mm' ? contact.description_mm : contact.description_en) ?? null
    : null;

  const photos = contact?.photos ?? [];

  const handleBack = useCallback((): void => { navigation.goBack(); }, [navigation]);

  const handleCallPress = useCallback((): void => {
    if (contact?.phone) {
      Linking.openURL(`tel:${contact.phone}`).catch(() => {});
    }
  }, [contact?.phone]);

  const handleMapPress = useCallback((): void => {
    if (contact?.map_url) {
      Linking.openURL(contact.map_url).catch(() => {});
    }
  }, [contact?.map_url]);

  const handleFacebookPress = useCallback((): void => {
    if (contact?.facebook_url) {
      Linking.openURL(contact.facebook_url).catch(() => {});
    }
  }, [contact?.facebook_url]);

  const handleWebsitePress = useCallback((): void => {
    if (contact?.website_url) {
      Linking.openURL(contact.website_url).catch(() => {});
    }
  }, [contact?.website_url]);

  return {
    contact,
    isLoading,
    isError,
    title,
    description,
    photos,
    handleBack,
    handleCallPress,
    handleMapPress,
    handleFacebookPress,
    handleWebsitePress,
  };
}
