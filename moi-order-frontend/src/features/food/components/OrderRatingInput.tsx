import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { styles } from './OrderRatingInput.styles';

interface Props {
  rating: number | null;
  review: string;
  onRatingChange: (r: number) => void;
  onReviewChange: (t: string) => void;
}

export function OrderRatingInput({ rating, review, onRatingChange, onReviewChange }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rate your order (optional)</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable
            key={star}
            onPress={() => onRatingChange(star)}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${star} star`}
          >
            <Ionicons
              name={rating !== null && star <= rating ? 'star' : 'star-outline'}
              size={32}
              color={rating !== null && star <= rating ? '#f59e0b' : colours.textMuted}
            />
          </Pressable>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Leave a review… (optional)"
        placeholderTextColor={colours.textMuted}
        value={review}
        onChangeText={onReviewChange}
        multiline
        maxLength={500}
        accessibilityLabel="Leave a review"
      />
    </View>
  );
}
