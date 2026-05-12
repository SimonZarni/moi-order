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

  // Do NOT set Content-Type here. Axios detects FormData and clears the header so
  // the native XHR can set "multipart/form-data; boundary=..." automatically.
  // Explicitly setting it (without boundary) breaks multipart parsing in Hermes production builds.
  const response = await apiClient.post<ApiResponse<Document> & { quota: UploadStats }>(
    '/api/v1/documents',
    formData,
  );
  return { document: response.data.data, quota: response.data.quota };
}

export async function deleteDocument(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/documents/${id}`);
}
