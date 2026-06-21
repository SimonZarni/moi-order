import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInvoices, getTodayInvoice, uploadPaymentQr } from '../../../api/invoice';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';

export interface UseDailyInvoiceDataResult {
  today: ReturnType<typeof useQuery<Awaited<ReturnType<typeof getTodayInvoice>>>>;
  history: ReturnType<typeof useInfiniteQuery>;
  uploadQrMutation: ReturnType<typeof useMutation>;
}

export function useDailyInvoiceData(): UseDailyInvoiceDataResult {
  const queryClient = useQueryClient();

  const today = useQuery({
    queryKey: QUERY_KEYS.INVOICES.TODAY,
    queryFn:  getTodayInvoice,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const history = useInfiniteQuery({
    queryKey:  ['invoices', 'list'],
    queryFn:   ({ pageParam = 1 }) => getInvoices(pageParam as number),
    getNextPageParam: (last) =>
      last.meta.current_page < last.meta.last_page ? last.meta.current_page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 30_000,
  });

  const uploadQrMutation = useMutation({
    mutationFn: uploadPaymentQr,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  return { today, history, uploadQrMutation };
}
