import apiClient from './client';
import type { Tag } from '@/types/models';

export async function fetchTags(): Promise<Tag[]> {
  const response = await apiClient.get<{ data: Tag[] }>('/api/v1/tags');
  return response.data.data;
}
