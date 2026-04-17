import React from 'react';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';

import { Place } from '@/types/models';
import { styles } from './PlaceCard.styles';

interface PlaceCardProps {
  place: Place;
  onPress: (placeId: number) => void;
  distance?: string | null;
}

export function PlaceCard({ place, onPress, distance }: PlaceCardProps): React.JSX.Element {
  return (
    <View style={styles.shadowWrap}>
      <Pressable
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.88 : 1 }]}
        onPress={() => onPress(place.id)}
        accessibilityLabel={`View details for ${place.name_en}`}
        accessibilityRole="button"
      >
        {/* Full-bleed background image */}
        {place.cover_image !== null ? (
          <Image
            source={{ uri: place.cover_image }}
            style={styles.image}
            contentFit="cover"
            cachePolicy="disk"
            transition={0}
          />
        ) : (
          <View style={styles.imageFallback}>
            <Ionicons name="location" size={36} color={colours.textMuted} />
          </View>
        )}

        {/* Dark gradient rising from bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.30)', 'rgba(0,0,0,0.82)']}
          locations={[0, 0.4, 1]}
          style={styles.gradient}
        />

        {/* Category badge — top left */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{place.category.name_en}</Text>
        </View>

        {/* Place name + meta — bottom */}
        <View style={styles.bottomContent}>
          <Text style={styles.name} numberOfLines={1}>{place.name_en}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaCity}>{place.city}</Text>
            {place.opening_hours !== null && (
              <>
                <View style={styles.metaDot} />
                <Text style={styles.metaHours} numberOfLines={1}>{place.opening_hours}</Text>
              </>
            )}
            {distance != null && (
              <>
                <View style={styles.metaDot} />
                <Text style={styles.metaDistance}>{distance}</Text>
              </>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
}
