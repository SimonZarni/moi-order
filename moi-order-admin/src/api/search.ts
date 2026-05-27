import apiClient from './client';

export type SearchUser = {
  id: number;
  name: string;
  email: string;
  status: string;
  status_label: string;
  is_deleted: boolean;
};

export type SearchSubmission = {
  id: number;
  service_name: string;
  type_name: string | null;
  status: string;
  status_label: string;
  user_name: string;
  created_at: string;
};

export type SearchBooking = {
  id: number;
  ticket_name: string;
  status: string;
  status_label: string;
  visit_date: string;
  user_name: string;
  created_at: string;
};

export type SearchPayment = {
  id: number;
  amount: number;
  currency: string;
  status: string;
  status_label: string;
  created_at: string;
};

export type SearchResults = {
  users: SearchUser[];
  submissions: SearchSubmission[];
  bookings: SearchBooking[];
  payments: SearchPayment[];
};

export const searchApi = {
  search: (q: string) =>
    apiClient
      .get<{ data: SearchResults }>('/search', { params: { q } })
      .then((r) => r.data.data),
};
