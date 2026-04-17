import apiClient from '@/shared/api/client';
import { ApiResponse, PaginatedResponse, ServiceSubmission } from '@/types/models';
import { ImagePickerAsset } from 'expo-image-picker';

function requireMimeType(asset: ImagePickerAsset): string {
  if (asset.mimeType == null) {
    throw new Error('Could not determine image type. Please try selecting the image again.');
  }
  return asset.mimeType;
}

export interface DynamicSubmissionPayload {
  idempotencyKey: string;
  serviceTypeId:  number;
  fields:         Record<string, string>;
  files?:         Record<string, ImagePickerAsset>;
}

export async function submitDynamic(
  payload: DynamicSubmissionPayload,
): Promise<ServiceSubmission> {
  const form = new FormData();
  form.append('idempotency_key', payload.idempotencyKey);
  form.append('service_type_id', String(payload.serviceTypeId));

  for (const [key, value] of Object.entries(payload.fields)) {
    form.append(key, value);
  }

  if (payload.files !== undefined) {
    for (const [key, asset] of Object.entries(payload.files)) {
      form.append(key, {
        uri:  asset.uri,
        type: requireMimeType(asset),
        name: `${key}.jpg`,
      } as unknown as Blob);
    }
  }

  const response = await apiClient.post<ApiResponse<ServiceSubmission>>(
    '/api/v1/submissions/dynamic',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}

export async function fetchSubmissions(page: number): Promise<PaginatedResponse<ServiceSubmission>> {
  const response = await apiClient.get<PaginatedResponse<ServiceSubmission>>('/api/v1/submissions', {
    params: { page },
  });
  return response.data;
}

export async function fetchSubmission(id: number): Promise<ServiceSubmission> {
  const response = await apiClient.get<ApiResponse<ServiceSubmission>>(`/api/v1/submissions/${id}`);
  return response.data.data;
}
