import apiClient from '@/shared/api/client';
import { ApiResponse, Document } from '@/types/models';
import { DocumentType } from '@/types/enums';

export interface UploadQuota {
  daily_used: number;
  daily_remaining: number;
  monthly_used: number;
  monthly_remaining: number;
}

export interface UploadDocumentResult {
  document: Document;
  quota: UploadQuota;
}

export async function fetchDocuments(type: DocumentType): Promise<Document[]> {
  const response = await apiClient.get<{ data: Document[] }>('/api/v1/documents', {
    params: { type },
  });
  return response.data.data;
}

export async function uploadDocument(
  imageUri: string,
  mimeType: string,
  type: DocumentType,
): Promise<UploadDocumentResult> {
  const filename = imageUri.split('/').pop() ?? 'document.jpg';

  const formData = new FormData();
  formData.append('type', type);
  formData.append('image', { uri: imageUri, name: filename, type: mimeType } as unknown as Blob);

  const response = await apiClient.post<ApiResponse<Document> & { quota: UploadQuota }>(
    '/api/v1/documents',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return { document: response.data.data, quota: response.data.quota };
}

export async function deleteDocument(id: number): Promise<void> {
  await apiClient.delete(`/api/v1/documents/${id}`);
}
