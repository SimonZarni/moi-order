import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchSubmissions } from '@/shared/api/submissions';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { PaginatedResponse, ServiceSubmission } from '@/types/models';

export interface UseOrdersResult {
  submissions: ServiceSubmission[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

export function useOrders(): UseOrdersResult {
  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.SUBMISSIONS.LIST,
    queryFn: ({ pageParam }) => fetchSubmissions(pageParam as number),
    getNextPageParam: (last: PaginatedResponse<ServiceSubmission>) =>
      last.meta.current_page < last.meta.last_page
        ? last.meta.current_page + 1
        : undefined,
    initialPageParam: 1,
  });

  const submissions = query.data?.pages.flatMap((p) => p.data) ?? [];

  return {
    submissions,
    isLoading:          query.isLoading,
    isError:            query.isError,
    hasNextPage:        query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage:      query.fetchNextPage,
    refetch:            query.refetch,
  };
}
