import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { useRestaurantReviews } from '../../hooks/useRestaurantReviews';
import { ReviewCard } from '../ReviewCard/ReviewCard';
import { styles } from './RestaurantReviewsSection.styles';

const PREVIEW_COUNT = 3;

interface RestaurantReviewsSectionProps {
  restaurantId: number;
}

export function RestaurantReviewsSection({ restaurantId }: RestaurantReviewsSectionProps): React.JSX.Element | null {
  const { reviews, averageRating, totalReviews, isLoading } = useRestaurantReviews(restaurantId);
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.section}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (totalReviews === 0) return null;

  const displayed = showAll ? reviews : reviews.slice(0, PREVIEW_COUNT);
  const hasMore   = reviews.length > PREVIEW_COUNT;

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Reviews</Text>
          {averageRating !== null && (
            <View style={styles.avgBadge}>
              <Ionicons name="star" size={11} color={colours.star} />
              <Text style={styles.avgText}>{averageRating.toFixed(1)}</Text>
            </View>
          )}
        </View>
        <Text style={styles.countText}>{totalReviews} review{totalReviews !== 1 ? 's' : ''}</Text>
      </View>

      {displayed.length === 0 ? (
        <Text style={styles.empty}>No reviews yet.</Text>
      ) : (
        displayed.map((r, i) => <ReviewCard key={i} review={r} />)
      )}

      {hasMore && (
        <Pressable
          style={styles.seeAllBtn}
          onPress={() => setShowAll((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={showAll ? 'Show fewer reviews' : `See all ${totalReviews} reviews`}
        >
          <Text style={styles.seeAllText}>
            {showAll ? 'Show less ↑' : `See all ${totalReviews} reviews →`}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
