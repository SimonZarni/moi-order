import React from 'react';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { Place } from '@/types/models';
import { styles } from './PlaceCardGrid.styles';

interface PlaceCardGridProps {
  place: Place;
  onPress: (placeId: number) => void;
  distance?: string | null;
  isFavorited?: boolean;
  onFavoritePress?: (placeId: number) => void;
}

export function PlaceCardGrid({ place, onPress, distance, isFavorited = false, onFavoritePress }: PlaceCardGridProps): React.JSX.Element {
  return (
    <View style={styles.wrap}>
      <Pressable
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.9 : 1 }]}
        onPress={() => onPress(place.id)}
        accessibilityLabel={`View details for ${place.name_en}`}
        accessibilityRole="button"
      >
        {place.cover_image !== null ? (
          <Image source={{ uri: place.cover_image }} style={styles.image} contentFit="cover" cachePolicy="disk" transition={0} />
        ) : (
          <View style={styles.imageFallback}>
            <Ionicons name="location" size={28} color={colours.textMuted} />
          </View>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.82)']}
          locations={[0.35, 1]}
          style={styles.gradient}
        />

        {/* Category pill */}
        {place.category != null && (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText} numberOfLines={1}>{place.category.name_en}</Text>
          </View>
        )}

        {/* Heart */}
        <Pressable
          style={styles.heartBtn}
          onPress={() => onFavoritePress?.(place.id)}
          accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={13} color={isFavorited ? '#ff4d6d' : 'rgba(255,255,255,0.8)'} />
        </Pressable>

        {/* Info overlay */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{place.name_en}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={9} color="rgba(255,255,255,0.5)" />
            <Text style={styles.metaCity} numberOfLines={1}>{place.city}</Text>
            {distance != null && (
              <>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaDistance}>{distance}</Text>
              </>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
}
