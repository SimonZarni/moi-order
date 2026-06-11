import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReviews, type ReviewItem } from '../../../api/reviews';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { CACHE_TTL, GC_TIME, QUERY_RETRY, PAGINATION } from '../../../shared/constants/config';

export type RatingFilter = 0 | 1 | 2 | 3 | 4 | 5;

export interface UseReviewsScreenResult {
  reviews: ReviewItem[];
  isLoading: boolean;
  isError: boolean;
  currentPage: number;
  lastPage: number;
  total: number;
  ratingFilter: RatingFilter;
  handleRatingFilter: (rating: RatingFilter) => void;
  handlePageNext: () => void;
  handlePagePrev: () => void;
}

export function useReviewsScreen(): UseReviewsScreenResult {
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>(0);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.REVIEWS(page, ratingFilter),
    queryFn: () =>
      getReviews({
        page,
        per_page: PAGINATION.DEFAULT_PER_PAGE,
        rating: ratingFilter > 0 ? ratingFilter : undefined,
      }),
    staleTime: CACHE_TTL.DEFAULT,
    gcTime:    GC_TIME.DEFAULT,
    retry:     QUERY_RETRY,
  });

  const reviews   = data?.data ?? [];
  const lastPage  = data?.meta.last_page ?? 1;
  const total     = data?.meta.total ?? 0;

  const handleRatingFilter = useCallback((rating: RatingFilter) => {
    setRatingFilter(rating);
    setPage(1);
  }, []);

  const handlePageNext = useCallback(() => {
    setPage((p) => Math.min(p + 1, lastPage));
  }, [lastPage]);

  const handlePagePrev = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1));
  }, []);

  return {
    reviews,
    isLoading,
    isError,
    currentPage: page,
    lastPage,
    total,
    ratingFilter,
    handleRatingFilter,
    handlePageNext,
    handlePagePrev,
  };
}
