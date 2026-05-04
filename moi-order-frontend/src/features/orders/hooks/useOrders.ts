import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';

import { deleteSubmission, fetchSubmissions } from '@/shared/api/submissions';
import { useAuthStore } from '@/shared/store/authStore';
import { CACHE_TTL } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { ApiError, PaginatedResponse, ServiceSubmission } from '@/types/models';

export interface UseOrdersResult {
  submissions: ServiceSubmission[];
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
  deleteMutation: ReturnType<typeof useMutation<void, ApiError, number>>;
}

export function useOrders(): UseOrdersResult {
  const { isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.SUBMISSIONS.LIST,
    queryFn: ({ pageParam }) => fetchSubmissions(pageParam as number),
    enabled: isLoggedIn,
    getNextPageParam: (last: PaginatedResponse<ServiceSubmission>) =>
      last.meta.current_page < last.meta.last_page
        ? last.meta.current_page + 1
        : undefined,
    initialPageParam: 1,
    // Prevent a background refetch on every screen visit — orders change rarely.
    // Pull-to-refresh remains available for manual revalidation.
    staleTime: CACHE_TTL.USER_DATA,
    // Memoised flat array — recomputed only when pages change, not on every render.
    select: (data) => ({
      ...data,
      submissions: data.pages.flatMap((p) => p.data),
    }),
  });

  const deleteMutation = useMutation<void, ApiError, number>({
    mutationFn: (id) => deleteSubmission(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        QUERY_KEYS.SUBMISSIONS.LIST,
        (old: InfiniteData<PaginatedResponse<ServiceSubmission>> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((s) => s.id !== id),
            })),
          };
        },
      );
    },
  });

  return {
    submissions:        query.data?.submissions ?? [],
    isLoading:          query.isLoading,
    isError:            query.isError,
    isRefreshing:       query.isRefetching && !query.isFetchingNextPage,
    hasNextPage:        query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage:      query.fetchNextPage,
    refetch:            query.refetch,
    deleteMutation,
  };
}
