import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviews, replyToReview, type ReviewItem } from '../../../api/reviews';
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
  replyingTo: string | null;
  replyDraft: string;
  isSubmittingReply: boolean;
  handleRatingFilter: (rating: RatingFilter) => void;
  handlePageNext: () => void;
  handlePagePrev: () => void;
  handleStartReply: (orderId: string, existingReply: string | null) => void;
  handleReplyDraftChange: (text: string) => void;
  handleSubmitReply: () => void;
  handleCancelReply: () => void;
}

export function useReviewsScreen(): UseReviewsScreenResult {
  const queryClient = useQueryClient();
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>(0);
  const [page, setPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');

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

  const { mutate: submitReply, isPending: isSubmittingReply } = useMutation({
    mutationFn: ({ orderId, reply }: { orderId: string; reply: string }) =>
      replyToReview(orderId, reply),
    onSuccess: () => {
      setReplyingTo(null);
      setReplyDraft('');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS(page, ratingFilter) });
    },
  });

  const reviews  = data?.data ?? [];
  const lastPage = data?.meta.last_page ?? 1;
  const total    = data?.meta.total ?? 0;

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

  const handleStartReply = useCallback((orderId: string, existingReply: string | null) => {
    setReplyingTo(orderId);
    setReplyDraft(existingReply ?? '');
  }, []);

  const handleReplyDraftChange = useCallback((text: string) => {
    setReplyDraft(text);
  }, []);

  const handleSubmitReply = useCallback(() => {
    if (!replyingTo || !replyDraft.trim() || isSubmittingReply) return;
    submitReply({ orderId: replyingTo, reply: replyDraft.trim() });
  }, [replyingTo, replyDraft, isSubmittingReply, submitReply]);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
    setReplyDraft('');
  }, []);

  return {
    reviews,
    isLoading,
    isError,
    currentPage: page,
    lastPage,
    total,
    ratingFilter,
    replyingTo,
    replyDraft,
    isSubmittingReply,
    handleRatingFilter,
    handlePageNext,
    handlePagePrev,
    handleStartReply,
    handleReplyDraftChange,
    handleSubmitReply,
    handleCancelReply,
  };
}
