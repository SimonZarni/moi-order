import apiClient from '@/shared/api/client';
import { ApiResponse, Document, UploadStats } from '@/types/models';
import { DocumentType } from '@/types/enums';

export async function fetchDocuments(type: DocumentType): Promise<Document[]> {
  const response = await apiClient.get<{ data: Document[] }>('/api/v1/documents', {
    params: { type },
  });
  return response.data.data;
}

export async function fetchUploadStats(): Promise<UploadStats> {
  const response = await apiClient.get<{ data: UploadStats }>('/api/v1/documents/upload-stats');
  return response.data.data;
}

export async function uploadDocument(
  imageUri: string,
  mimeType: string,
  type: DocumentType,
): Promise<{ document: Document; quota: UploadStats }> {
  const filename = imageUri.split('/').pop() ?? 'document.jpg';

  const formData = new FormData();
  formData.append('type', type);
  formData.append('image', { uri: imageUri, name: filename, type: mimeType } as unknown as Blob);

  // Content-Type must be 'multipart/form-data' so PHP parses $_FILES correctly.
  // The boundary is intentionally omitted here — React Native's native XHR layer
  // injects the correct boundary when it serialises the FormData object at send time.
  // Removing this header entirely caused Axios to fall back to 'application/json',
  // which made PHP see an empty $_FILES and fail every upload with a 422.
  const response = await apiClient.post<ApiResponse<Document> & { quota: UploadStats }>(
    '/api/v1/documents',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return { document: response.data.data, quota: response.data.quota };
}

export async function deleteDocument(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/documents/${id}`);
}
