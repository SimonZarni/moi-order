import { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

import { useGenericServiceForm, UseGenericServiceFormResult } from './useGenericServiceForm';
import { fetchServices } from '@/shared/api/services';
import { submitDynamic } from '@/shared/api/submissions';
import { useAuthStore } from '@/shared/store/authStore';
import { stripAsset } from '@/shared/utils/stripAsset';
import { MESSAGES } from '@/shared/constants/messages';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ApiError, FieldSchemaItem } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

type RouteParams = RouteProp<RootStackParamList, 'GenericServiceForm'>;

export interface UseGenericServiceFormScreenResult {
  form:            UseGenericServiceFormResult['form'];
  schema:          FieldSchemaItem[];
  hasSchema:       boolean;
  serviceName:     string;
  price:           number;
  isLoadingSchema: boolean;
  isSubmitting:    boolean;
  bannerError:     string;
  handleChange:    (key: string, value: string) => void;
  handlePickFile:  (key: string) => Promise<void>;
  handleSubmit:    () => void;
  handleBack:      () => void;
}

export function useGenericServiceFormScreen(): UseGenericServiceFormScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<RouteParams>();
  const { serviceTypeId, serviceId, serviceName, price } = route.params;
  const { isLoggedIn } = useAuthStore();

  // Always fetch fresh — staleTime: 0 ensures we never use cached field_schema
  // (admin may have updated document_type after the list was first cached)
  const { data: services, isPending: isLoadingSchema } = useQuery({
    queryKey: [...QUERY_KEYS.SERVICES.LIST, 'fresh'],
    queryFn:  fetchServices,
    staleTime: 0,
  });

  const schema = useMemo<FieldSchemaItem[]>(() => {
    if (!services) return [];
    const service = services.find((s) => s.id === serviceId);
    const type    = service?.types.find((t) => t.id === serviceTypeId);
    return type?.field_schema ?? [];
  }, [services, serviceId, serviceTypeId]);

  const { form, handleChange, handleFileChange, validate, applyApiError } =
    useGenericServiceForm();

  const [bannerError, setBannerError] = useState('');

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: () => {
      const payload: Parameters<typeof submitDynamic>[0] = {
        idempotencyKey: Crypto.randomUUID(),
        serviceTypeId,
        fields: form.fields,
      };
      if (Object.keys(form.files).length > 0) {
        payload.files = form.files;
      }
      return submitDynamic(payload);
    },
    onSuccess: (submission) =>
      navigation.navigate('Payment', { kind: 'submission', submissionId: submission.id }),
    onError: (error: ApiError) => {
      if (error.status === 422 && error.errors !== undefined) {
        const schemaKeys = new Set(schema.map((f) => f.key));
        const schemaErrors: Record<string, string[]>  = {};
        const orphanMessages: string[] = [];

        Object.entries(error.errors).forEach(([rawKey, messages]) => {
          const fieldKey = rawKey.startsWith('fields.') ? rawKey.slice(7) : rawKey;
          if (schemaKeys.has(fieldKey)) {
            schemaErrors[rawKey] = messages;
          } else {
            const msg = messages[0];
            if (msg) orphanMessages.push(msg);
          }
        });

        if (Object.keys(schemaErrors).length > 0) applyApiError(schemaErrors);
        if (orphanMessages.length > 0) setBannerError(orphanMessages[0] ?? MESSAGES.genericError);
      } else {
        setBannerError(error.message ?? MESSAGES.genericError);
      }
    },
  });

  const handlePickFile = useCallback(async (key: string): Promise<void> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0] !== undefined) {
      handleFileChange(key, stripAsset(result.assets[0]));
    }
  }, [handleFileChange]);

  const handleSubmit = useCallback((): void => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    setBannerError('');
    if (validate(schema)) mutate();
  }, [isLoggedIn, navigation, validate, schema, mutate]);

  const handleBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return {
    form,
    schema,
    hasSchema: schema.length > 0,
    serviceName,
    price,
    isLoadingSchema,
    isSubmitting,
    bannerError,
    handleChange,
    handlePickFile,
    handleSubmit,
    handleBack,
  };
}
