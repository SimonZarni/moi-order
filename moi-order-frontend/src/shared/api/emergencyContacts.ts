import apiClient from '@/shared/api/client';
import { EmergencyContactType } from '@/types/enums';
import { ApiResponse, EmergencyContact, PaginatedResponse } from '@/types/models';

export async function fetchEmergencyContacts(
  type: EmergencyContactType,
  page: number,
  perPage = 20,
): Promise<PaginatedResponse<EmergencyContact>> {
  const response = await apiClient.get<PaginatedResponse<EmergencyContact>>(
    '/api/v1/emergency/contacts',
    { params: { type, page, per_page: perPage } },
  );
  return response.data;
}

export async function fetchEmergencyContactDetail(id: number): Promise<EmergencyContact> {
  const response = await apiClient.get<ApiResponse<EmergencyContact>>(
    `/api/v1/emergency/contacts/${id}`,
  );
  return response.data.data;
}
