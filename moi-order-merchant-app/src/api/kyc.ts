import { Platform } from 'react-native';
import type { KycApplication, KycDocument } from '../types/models';
import type { KycDocType } from '../types/enums';
import { apiClient } from './client';

export interface UpsertKycData {
  business_name: string;
  business_type: string;
  business_address: string;
}

export interface UploadFileRef {
  uri: string;
  name: string;
  type: string;
}

export async function getKycApplication(): Promise<KycApplication | null> {
  try {
    const response = await apiClient.get<{ data: KycApplication }>('/kyc');
    return response.data.data;
  } catch {
    return null;
  }
}

export async function upsertKycApplication(
  data: UpsertKycData,
): Promise<KycApplication> {
  const response = await apiClient.post<{ data: KycApplication }>('/kyc', data);
  return response.data.data;
}

export async function uploadKycDocument(
  type: KycDocType,
  file: UploadFileRef,
): Promise<KycDocument> {
  const formData = new FormData();
  formData.append('type', type);

  if (Platform.OS === 'web') {
    // On web, asset.uri is a blob:/data: URL. Appending a plain object to FormData
    // would serialise it as "[object Object]" — the server receives no file.
    // Fetch the real bytes and create a File so the browser sends proper multipart.
    const blob = await fetch(file.uri).then((r) => r.blob());
    formData.append('file', new File([blob], file.name, { type: file.type }));
  } else {
    // On native, RN's FormData understands { uri, name, type } directly.
    formData.append('file', { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);
  }

  const response = await apiClient.post<{ data: KycDocument }>(
    '/kyc/documents',
    formData,
    Platform.OS === 'web'
      ? {} // Browser sets Content-Type + boundary automatically for FormData
      : {
          headers: { 'Content-Type': 'multipart/form-data' },
          transformRequest: [(data: FormData) => data], // Prevents Axios JSON-serialising in RN
        },
  );
  return response.data.data;
}

export async function submitKycApplication(): Promise<KycApplication> {
  const response = await apiClient.post<{ data: KycApplication }>('/kyc/submit');
  return response.data.data;
}
