import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { styles } from './PlaceCard.styles';
import { Place } from '@/types/models';

interface PlaceCardProps {
  place: Place;
  onPress: (placeId: number) => void;
}

export function PlaceCard({ place, onPress }: PlaceCardProps): React.JSX.Element {
  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress(place.id)}
      accessibilityLabel={`View details for ${place.name_en}`}
      accessibilityRole="button"
    >
      {/* Image with category badge overlaid at bottom-left */}
      <View style={styles.imageContainer}>
        {place.cover_image !== null ? (
          <Image source={{ uri: place.cover_image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{place.category.name_en}</Text>
        </View>
      </View>

      {/* Compact content: name + meta */}
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{place.name_my}</Text>
          <Text style={styles.arrow}>›</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.city}>{place.city}</Text>
          {place.opening_hours !== null && (
            <>
              <View style={styles.metaDot} />
              <Text style={styles.hours} numberOfLines={1}>{place.opening_hours}</Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}
