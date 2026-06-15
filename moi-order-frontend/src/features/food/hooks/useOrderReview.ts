import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { submitOrderReview } from '@/shared/api/reviews';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { FoodOrder } from '@/types/models';

export interface UseOrderReviewResult {
  rating: number | null;
  review: string;
  isSubmitting: boolean;
  handleRatingChange: (r: number) => void;
  handleReviewChange: (t: string) => void;
  handleSubmit: () => void;
}

export function useOrderReview(orderId: string): UseOrderReviewResult {
  const queryClient = useQueryClient();
  const [rating, setRating]           = useState<number | null>(null);
  const [review, setReview]           = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const handleRatingChange = useCallback((r: number) => setRating(r), []);
  const handleReviewChange = useCallback((t: string) => setReview(t), []);

  const handleSubmit = useCallback(async () => {
    if (rating === null || isSubmitting) return;
    setSubmitting(true);
    try {
      const updated = await submitOrderReview(orderId, rating, review.trim() || null);
      queryClient.setQueryData<FoodOrder>(QUERY_KEYS.FOOD_ORDERS.DETAIL(orderId), updated);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOOD_ORDERS.LIST });
    } catch {
      Alert.alert('Error', 'Could not submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [rating, review, isSubmitting, orderId, queryClient]);

  return {
    rating,
    review,
    isSubmitting,
    handleRatingChange,
    handleReviewChange,
    handleSubmit: () => { void handleSubmit(); },
  };
}
