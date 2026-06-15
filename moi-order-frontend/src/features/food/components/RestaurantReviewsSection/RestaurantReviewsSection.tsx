import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRestaurantReviews } from '../../hooks/useRestaurantReviews';
import { ReviewCard } from '../ReviewCard/ReviewCard';
import { styles } from './RestaurantReviewsSection.styles';

const PREVIEW_COUNT = 3;

interface RestaurantReviewsSectionProps {
  restaurantId: number;
}

export function RestaurantReviewsSection({ restaurantId }: RestaurantReviewsSectionProps): React.JSX.Element | null {
  const { reviews, averageRating, totalReviews, isLoading } = useRestaurantReviews(restaurantId);

  if (isLoading) {
    return (
      <View style={styles.section}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (totalReviews === 0) return null;

  const preview = reviews.slice(0, PREVIEW_COUNT);
  const hasMore = totalReviews > PREVIEW_COUNT;

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Reviews</Text>
          {averageRating !== null && (
            <View style={styles.avgBadge}>
              <Ionicons name="star" size={11} color="#f59e0b" />
              <Text style={styles.avgText}>{averageRating.toFixed(1)}</Text>
            </View>
          )}
        </View>
        <Text style={styles.countText}>{totalReviews} review{totalReviews !== 1 ? 's' : ''}</Text>
      </View>

      {preview.length === 0 ? (
        <Text style={styles.empty}>No reviews yet.</Text>
      ) : (
        preview.map((r, i) => <ReviewCard key={i} review={r} />)
      )}

      {hasMore && (
        <Pressable
          style={styles.seeAllBtn}
          accessibilityRole="button"
          accessibilityLabel={`See all ${totalReviews} reviews`}
        >
          <Text style={styles.seeAllText}>See all {totalReviews} reviews →</Text>
        </Pressable>
      )}
    </View>
  );
}
