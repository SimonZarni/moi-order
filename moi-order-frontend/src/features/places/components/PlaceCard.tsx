import React from 'react';
import { BlurView } from 'expo-blur';
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
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.92 : 1 }]}
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
            <Ionicons name="location" size={48} color={colours.textMuted} />
          </View>
        )}

        {/* Subtle gradient — covers bottom half only */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.08)', 'rgba(0,0,0,0.72)']}
          locations={[0, 0.42, 1]}
          style={styles.gradient}
        />

        {/* Category pill — top right */}
        {place.category != null && (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{place.category.name_en}</Text>
          </View>
        )}

        {/* Frosted glass info panel */}
        <BlurView intensity={20} tint="dark" style={styles.glassPanel}>
          <View style={styles.glassTint} />
          <View style={styles.glassContent}>

            {/* Name + heart */}
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{place.name_en}</Text>
              <View style={styles.heartBtn}>
                <Ionicons name="heart-outline" size={17} color="rgba(255,255,255,0.75)" />
              </View>
            </View>

            {/* City · distance · hours */}
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={11} color="rgba(255,255,255,0.5)" />
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

            {/* Tag chips */}
            {place.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {place.tags.slice(0, 3).map((tag) => (
                  <View key={tag.id} style={styles.tagChip}>
                    <Text style={styles.tagText}>{tag.name_en}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </BlurView>
      </Pressable>
    </View>
  );
}
