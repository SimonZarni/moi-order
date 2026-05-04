import React from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { usePlaceDetailScreen } from '@/features/places/hooks/usePlaceDetailScreen';
import { PlaceDetailSkeleton } from '@/features/places/components/PlaceDetailSkeleton';
import { PlaceImageViewer } from '@/features/places/components/PlaceImageViewer';
import { colours } from '@/shared/theme/colours';
import { PlaceImage } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { styles } from './PlaceDetailScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceDetail'>;

export function PlaceDetailScreen({ route }: Props): React.JSX.Element {
  const { placeId } = route.params;
  const {
    place, coverImage, galleryImages, viewerImages, viewerIndex,
    isLoading, isRefreshing, isError,
    isFavorited, isTogglingFavorite, isLoggedIn,
    handleRefresh, handleBack, handleCallPhone, handleOpenWebsite, handleOpenMaps,
    handleToggleFavorite, handleImagePress, handleViewAllImages, handleCloseImageViewer,
  } = usePlaceDetailScreen(placeId);

  if (isLoading) return <PlaceDetailSkeleton />;

  if (isError || place === null) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load place details.</Text>
        <Pressable onPress={handleBack} style={styles.backBtn} accessibilityLabel="Go back" accessibilityRole="button">
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const hasActions = place.contact_phone !== null || place.latitude !== null || place.website !== null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colours.primary} />}
      >

        {/* ── Hero ── */}
        <View style={styles.hero}>
          {coverImage !== null && (
            <Pressable
              style={styles.heroImageWrap}
              onPress={() => handleImagePress(0)}
              accessibilityLabel="View cover image"
              accessibilityRole="imagebutton"
            >
              <Image
                source={{ uri: coverImage.url }}
                style={styles.heroImage}
                contentFit="cover"
                cachePolicy="disk"
                transition={200}
              />
            </Pressable>
          )}

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.82)']}
            locations={[0.25, 0.55, 1]}
            style={styles.heroGradient}
          />

          {/* Floating controls */}
          <View style={styles.heroControls}>
            <Pressable style={styles.heroBtn} onPress={handleBack} accessibilityLabel="Go back" accessibilityRole="button">
              <Ionicons name="chevron-back" size={20} color={colours.white} />
            </Pressable>
            {isLoggedIn && (
              <Pressable
                style={styles.heroBtn}
                onPress={handleToggleFavorite}
                disabled={isTogglingFavorite}
                accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                accessibilityRole="button"
              >
                <Ionicons
                  name={isFavorited ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isFavorited ? colours.destructive : colours.white}
                />
              </Pressable>
            )}
          </View>

          {/* Identity overlaid on gradient */}
          <View style={styles.heroIdentity}>
            <View style={styles.heroCategoryPill}>
              <View style={styles.heroCategoryDot} />
              <Text style={styles.heroCategoryText}>{place.category.name_en}</Text>
            </View>
            <Text style={styles.heroName}>{place.name_my}</Text>
            <Text style={styles.heroNameSub}>{place.name_en}</Text>
          </View>
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>

          {/* City + hours info chips */}
          <View style={styles.infoChipsRow}>
            <View style={styles.infoChip}>
              <Ionicons name="location-outline" size={13} color={colours.medium} />
              <Text style={styles.infoChipText}>{place.city}</Text>
            </View>
            {place.opening_hours !== null && (
              <View style={styles.infoChip}>
                <Ionicons name="time-outline" size={13} color={colours.medium} />
                <Text style={styles.infoChipText}>{place.opening_hours}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          {place.long_description !== null && (
            <Text style={styles.description}>{place.long_description}</Text>
          )}

          {/* Tags */}
          {place.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {place.tags.map(tag => (
                <View key={tag.id} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.name_en}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action buttons */}
          {hasActions && (
            <View style={styles.actionsRow}>
              {place.contact_phone !== null && (
                <Pressable
                  style={styles.actionBtn}
                  onPress={handleCallPhone}
                  accessibilityLabel="Call phone number"
                  accessibilityRole="button"
                >
                  <Ionicons name="call-outline" size={15} color={colours.white} />
                  <Text style={styles.actionBtnText}>Call</Text>
                </Pressable>
              )}
              {place.latitude !== null && (
                <Pressable
                  style={styles.actionBtn}
                  onPress={handleOpenMaps}
                  accessibilityLabel="Open in maps"
                  accessibilityRole="button"
                >
                  <Ionicons name="map-outline" size={15} color={colours.white} />
                  <Text style={styles.actionBtnText}>Map</Text>
                </Pressable>
              )}
              {place.website !== null && (
                <Pressable
                  style={styles.actionBtn}
                  onPress={handleOpenWebsite}
                  accessibilityLabel="Open website"
                  accessibilityRole="button"
                >
                  <Ionicons name="globe-outline" size={15} color={colours.white} />
                  <Text style={styles.actionBtnText}>Web</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.galleryHeader}>
                <Text style={styles.galleryLabel}>Gallery</Text>
                <Pressable onPress={handleViewAllImages} accessibilityLabel="View all images" accessibilityRole="button">
                  <Text style={styles.viewAllText}>View all</Text>
                </Pressable>
              </View>
              <View style={styles.galleryGrid}>
                {galleryImages.map((img: PlaceImage, index: number) => (
                  <Pressable
                    key={img.id}
                    style={styles.galleryItem}
                    onPress={() => handleImagePress(index + 1)}
                    accessibilityLabel="View image"
                    accessibilityRole="imagebutton"
                  >
                    <Image
                      source={{ uri: img.url }}
                      style={styles.galleryItemImage}
                      contentFit="cover"
                      cachePolicy="disk"
                      transition={150}
                    />
                  </Pressable>
                ))}
              </View>
            </>
          )}

        </View>
      </ScrollView>

      <PlaceImageViewer images={viewerImages} index={viewerIndex} onClose={handleCloseImageViewer} />
    </SafeAreaView>
  );
}
