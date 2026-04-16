import apiClient from './client';
import { PaginatedResponse, ApiResponse, Ticket } from '@/types/models';

export async function fetchTickets(page = 1): Promise<PaginatedResponse<Ticket>> {
  const { data } = await apiClient.get('/api/v1/tickets', { params: { page } });
  return data;
}

export async function fetchTicket(id: number): Promise<Ticket> {
  const { data } = await apiClient.get<ApiResponse<Ticket>>(`/api/v1/tickets/${id}`);
  return data.data;
}
