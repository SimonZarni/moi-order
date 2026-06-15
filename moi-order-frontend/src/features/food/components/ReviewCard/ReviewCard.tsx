import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '@/shared/utils/formatDate';
import { RestaurantReview } from '@/types/models';
import { styles } from './ReviewCard.styles';

const STAR_ACTIVE = '#f59e0b';
const STAR_EMPTY  = '#e2e8f0';

interface ReviewCardProps {
  review: RestaurantReview;
}

export function ReviewCard({ review }: ReviewCardProps): React.JSX.Element {
  const initial = review.user_name.charAt(0).toUpperCase();

  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{review.user_name}</Text>
          <Text style={styles.date}>{formatDate(review.created_at)}</Text>
        </View>

        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Ionicons
              key={s}
              name={s <= review.rating ? 'star' : 'star-outline'}
              size={13}
              color={s <= review.rating ? STAR_ACTIVE : STAR_EMPTY}
            />
          ))}
        </View>

        {review.review !== null && (
          <Text style={styles.reviewText}>{review.review}</Text>
        )}
      </View>
    </View>
  );
}
