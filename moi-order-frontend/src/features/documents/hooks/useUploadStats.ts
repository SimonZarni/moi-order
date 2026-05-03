import { useQuery } from '@tanstack/react-query';

import { fetchUploadStats } from '@/shared/api/documents';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { UploadStats } from '@/types/models';

export interface UseUploadStatsResult {
  stats: UploadStats | undefined;
  isLoading: boolean;
}

export function useUploadStats(): UseUploadStatsResult {
  const { data: stats, isLoading } = useQuery({
    queryKey: QUERY_KEYS.DOCUMENTS.UPLOAD_STATS,
    queryFn:  fetchUploadStats,
    staleTime: 30 * 1000,
  });

  return { stats, isLoading };
}
