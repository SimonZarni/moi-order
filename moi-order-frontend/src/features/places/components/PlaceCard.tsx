import React from 'react';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Place } from '@/types/models';
import { styles } from './PlaceCard.styles';

interface PlaceCardProps {
  place: Place;
  onPress: (placeId: number) => void;
  distance?: string | null;
  isFavorited?: boolean;
  onFavoritePress?: (placeId: number) => void;
}

export function PlaceCard({ place, onPress, distance, isFavorited = false, onFavoritePress }: PlaceCardProps): React.JSX.Element {
  const hasTags = place.tags.length > 0;

  return (
    <View style={styles.shadowWrap}>
      {/* Image + gradient: clipped independently so the sibling Pressable can drop overflow:hidden */}
      <View style={styles.imageClip} pointerEvents="none">
        {place.cover_image !== null ? (
          <Image source={{ uri: place.cover_image }} style={styles.image} contentFit="cover" cachePolicy="disk" transition={0} />
        ) : (
          <View style={styles.imageFallback}>
            <Ionicons name="location" size={48} color="rgba(255,255,255,0.20)" />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.30)', 'rgba(0,0,0,0.80)']}
          locations={[0.35, 0.6, 1]}
          style={styles.gradient}
        />
      </View>

      {/* Press layer — transparent, no overflow:hidden, covers full card height */}
      <Pressable
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.92 : 1 }]}
        onPress={() => onPress(place.id)}
        accessibilityLabel={`View details for ${place.name_en}`}
        accessibilityRole="button"
      >
        {/* Category badge — top left */}
        {place.categories.length > 0 && (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{place.categories[0]!.name_en}</Text>
          </View>
        )}

        {/* Heart — top right */}
        <Pressable
          style={styles.heartBtn}
          onPress={() => onFavoritePress?.(place.id)}
          accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={16} color={isFavorited ? '#ff4d6d' : 'rgba(255,255,255,0.85)'} />
        </Pressable>

        {/* Name + meta — bottom padding grows when tags are present so they don't overlap */}
        <View style={[styles.content, hasTags && styles.contentWithTags]}>
          <Text style={styles.name} numberOfLines={2}>{place.name_en}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={11} color="rgba(255,255,255,0.60)" />
            <Text style={styles.metaCity}>{place.city}</Text>
            {distance != null && (
              <>
                <View style={styles.metaDot} />
                <Text style={styles.metaDistance}>{distance}</Text>
              </>
            )}
            {place.opening_hours != null && (
              <>
                <View style={styles.metaDot} />
                <Text style={styles.metaHours} numberOfLines={1}>{place.opening_hours}</Text>
              </>
            )}
          </View>
        </View>
      </Pressable>

      {/* Tags ScrollView — sibling of the Pressable, no shared gesture context.
          Positioned absolutely so it overlays the bottom of the card. */}
      {hasTags && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsScroll}
          contentContainerStyle={styles.tagsRow}
        >
          {place.tags.map(tag => (
            <View key={tag.id} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag.name_en}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
