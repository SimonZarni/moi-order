import { Platform } from 'react-native';
import type { BusinessProfile, KycDocument } from '../types/models';
import type { KycDocType } from '../types/enums';
import type { UploadFileRef } from './kyc';
import { apiClient } from './client';

export async function getBusinessProfile(): Promise<BusinessProfile> {
  const response = await apiClient.get<{ data: BusinessProfile }>('/business-profile');
  return response.data.data;
}

export async function updateBusinessPhone(businessPhone: string | null): Promise<BusinessProfile> {
  const response = await apiClient.patch<{ data: BusinessProfile }>('/business-profile', {
    business_phone: businessPhone,
  });
  return response.data.data;
}

export async function updateBusinessEmail(email: string): Promise<BusinessProfile> {
  const response = await apiClient.patch<{ data: BusinessProfile }>('/business-profile', {
    email,
  });
  return response.data.data;
}

export async function uploadBusinessProfileDocument(
  type: KycDocType,
  file: UploadFileRef,
): Promise<KycDocument> {
  const formData = new FormData();
  formData.append('type', type);

  if (Platform.OS === 'web') {
    const blob = await fetch(file.uri).then((r) => r.blob());
    formData.append('file', new File([blob], file.name, { type: file.type }));
  } else {
    formData.append('file', { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);
  }

  const response = await apiClient.post<{ data: KycDocument }>(
    '/business-profile/documents',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: [(data: FormData) => data],
    },
  );
  return response.data.data;
}
