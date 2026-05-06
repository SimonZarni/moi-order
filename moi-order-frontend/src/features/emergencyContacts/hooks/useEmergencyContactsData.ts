import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { fetchEmergencyContactDetail, fetchEmergencyContacts } from '@/shared/api/emergencyContacts';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { EmergencyContactType } from '@/types/enums';
import { EmergencyContact, PaginatedResponse } from '@/types/models';

// ── List hook ─────────────────────────────────────────────────────────────────

export interface UseEmergencyContactsResult {
  contacts: EmergencyContact[];
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

export function useEmergencyContacts(type: EmergencyContactType): UseEmergencyContactsResult {
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.EMERGENCY_CONTACTS.LIST(type),
    queryFn: ({ pageParam }) => fetchEmergencyContacts(type, pageParam as number),
    getNextPageParam: (last: PaginatedResponse<EmergencyContact>) =>
      last.meta.current_page < last.meta.last_page ? last.meta.current_page + 1 : undefined,
    initialPageParam: 1,
    staleTime: CACHE_TTL.STATIC_DATA,
    select: (data) => ({ ...data, contacts: data.pages.flatMap((p) => p.data) }),
  });

  return {
    contacts:           query.data?.contacts ?? [],
    isLoading:          query.isLoading,
    isError:            query.isError,
    isRefreshing:       query.isRefetching && !query.isFetchingNextPage,
    hasNextPage:        query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage:      query.fetchNextPage,
    refetch:            query.refetch,
  };
}

// ── Detail hook ───────────────────────────────────────────────────────────────

export interface UseEmergencyContactDetailResult {
  contact: EmergencyContact | null;
  isLoading: boolean;
  isError: boolean;
}

export function useEmergencyContactDetail(id: number): UseEmergencyContactDetailResult {
  const query = useQuery({
    queryKey: QUERY_KEYS.EMERGENCY_CONTACTS.DETAIL(id),
    queryFn:  () => fetchEmergencyContactDetail(id),
    staleTime: CACHE_TTL.STATIC_DATA,
  });

  return {
    contact:   query.data ?? null,
    isLoading: query.isLoading,
    isError:   query.isError,
  };
}
