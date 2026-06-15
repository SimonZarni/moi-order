import React from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { styles } from './PostOrderReviewCard.styles';

const STAR_COLOUR_ACTIVE  = '#f59e0b';
const STAR_COLOUR_EMPTY   = colours.divider;

interface PostOrderReviewCardProps {
  restaurantName: string | null;
  rating: number | null;
  review: string;
  isSubmitting: boolean;
  onRatingChange: (r: number) => void;
  onReviewChange: (t: string) => void;
  onSubmit: () => void;
}

export function PostOrderReviewCard({
  restaurantName,
  rating,
  review,
  isSubmitting,
  onRatingChange,
  onReviewChange,
  onSubmit,
}: PostOrderReviewCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Rate your experience</Text>
      {restaurantName !== null && (
        <Text style={styles.sub} numberOfLines={1}>at {restaurantName}</Text>
      )}

      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable
            key={star}
            style={styles.starBtn}
            onPress={() => onRatingChange(star)}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Ionicons
              name={rating !== null && star <= rating ? 'star' : 'star-outline'}
              size={30}
              color={rating !== null && star <= rating ? STAR_COLOUR_ACTIVE : STAR_COLOUR_EMPTY}
            />
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.input}
        value={review}
        onChangeText={onReviewChange}
        placeholder="Tell us more (optional)"
        placeholderTextColor={colours.textMuted}
        multiline
        maxLength={500}
        accessibilityLabel="Write a review"
      />

      <Pressable
        style={[styles.submitBtn, rating === null && styles.submitBtnDisabled]}
        onPress={onSubmit}
        disabled={rating === null || isSubmitting}
        accessibilityRole="button"
        accessibilityLabel="Submit review"
      >
        {isSubmitting
          ? <ActivityIndicator size="small" color={colours.textOnDark} />
          : <Text style={styles.submitBtnText}>Submit Review</Text>
        }
      </Pressable>
    </View>
  );
}
