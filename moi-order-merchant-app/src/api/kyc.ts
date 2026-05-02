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
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);

  const response = await apiClient.post<{ data: KycDocument }>(
    '/kyc/documents',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      // transformRequest bypasses Axios JSON serialisation — RN is not a browser
      // env so Axios would otherwise call stringifySafely(formData) → "{}" and the
      // server would receive an empty body, failing the `file` required rule.
      transformRequest: [(data: FormData) => data],
    },
  );
  return response.data.data;
}

export async function submitKycApplication(): Promise<KycApplication> {
  const response = await apiClient.post<{ data: KycApplication }>('/kyc/submit');
  return response.data.data;
}
