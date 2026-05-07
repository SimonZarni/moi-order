import React from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedScrollHandler,
  useAnimatedStyle, interpolate, Extrapolation,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { usePlaceDetailScreen } from '@/features/places/hooks/usePlaceDetailScreen';
import { PlaceDetailSkeleton } from '@/features/places/components/PlaceDetailSkeleton';
import { PlaceImageViewer } from '@/features/places/components/PlaceImageViewer';
import { colours } from '@/shared/theme/colours';
import { FONTS } from '@/shared/theme/fonts';
import { PlaceImage } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { styles, HERO_HEIGHT, HERO_PARALLAX_OFFSET } from './PlaceDetailScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceDetail'>;

const MAX_GALLERY_THUMBS = 5;

export function PlaceDetailScreen({ route }: Props): React.JSX.Element {
  const { placeId } = route.params;
  const insets = useSafeAreaInsets();
  const {
    place, coverImage, galleryImages, viewerImages, viewerIndex,
    isLoading, isRefreshing, isError,
    isFavorited, isTogglingFavorite, isLoggedIn,
    isDescriptionExpanded, isLongDescription,
    distanceText,
    handleRefresh, handleBack, handleCallPhone, handleOpenWebsite, handleOpenMaps,
    handleToggleFavorite, handleToggleDescription,
    handleImagePress, handleViewAllImages, handleCloseImageViewer,
  } = usePlaceDetailScreen(placeId);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => { scrollY.value = e.contentOffset.y; },
  });

  const heroImageAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, HERO_HEIGHT], [0, HERO_PARALLAX_OFFSET], Extrapolation.CLAMP) },
      { scale:      interpolate(scrollY.value, [0, HERO_HEIGHT], [1, 1.06],                  Extrapolation.CLAMP) },
    ],
  }));

  const heroIdentityAnimStyle = useAnimatedStyle(() => ({
    opacity:   interpolate(scrollY.value, [0, HERO_HEIGHT * 0.3], [1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(scrollY.value, [0, HERO_HEIGHT * 0.3], [0, -20], Extrapolation.CLAMP) }],
  }));

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

  const thumbSlice  = galleryImages.slice(0, MAX_GALLERY_THUMBS);
  const hiddenCount = Math.max(0, galleryImages.length - MAX_GALLERY_THUMBS);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Fixed back button — sits above scroll, always visible */}
      <View style={[styles.fixedBackBtnWrap, { top: insets.top + 12 }]}>
        <Pressable style={styles.fixedBackBtn} onPress={handleBack} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color={colours.white} />
        </Pressable>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colours.primary} />}
      >

        {/* ── Hero ── */}
        <View style={styles.hero}>
          {coverImage !== null && (
            <Animated.View style={[styles.heroImageWrap, heroImageAnimStyle]}>
              <Image
                source={{ uri: coverImage.url }}
                style={styles.heroImage}
                contentFit="cover"
                cachePolicy="disk"
                transition={200}
              />
            </Animated.View>
          )}

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.10)', 'rgba(0,0,0,0.88)']}
            locations={[0.25, 0.5, 1]}
            style={styles.heroGradient}
          />

          {/* Heart — right-aligned inside hero */}
          {isLoggedIn && (
            <View style={styles.heroControls}>
              <Pressable
                style={styles.heroBtn}
                onPress={handleToggleFavorite}
                disabled={isTogglingFavorite}
                accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                accessibilityRole="button"
              >
                <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={18} color={isFavorited ? '#ff4d6d' : colours.white} />
              </Pressable>
            </View>
          )}

          {/* Name fades as you scroll */}
          <Animated.View style={[styles.heroIdentity, heroIdentityAnimStyle]}>
            <View style={styles.heroCategoryPill}>
              <View style={styles.heroCategoryDot} />
              <Text style={styles.heroCategoryText}>{place.categories[0]?.name_en ?? ''}</Text>
            </View>
            <Text style={[styles.heroName, { fontFamily: FONTS.playfairBold }]} numberOfLines={3}>
              {place.name_en}
            </Text>
          </Animated.View>
        </View>

        {/* ── Body — cream card ── */}
        <View style={styles.body}>

          {/* Info bar: CITY | HOURS | DISTANCE */}
          <View style={styles.infoBar}>
            <View style={styles.infoCell}>
              <Ionicons name="location-outline" size={14} color="#7A7A7A" />
              <Text style={styles.infoCellLabel}>City</Text>
              <Text style={styles.infoCellValue} numberOfLines={1}>{place.city}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoCell}>
              <Ionicons name="time-outline" size={14} color="#7A7A7A" />
              <Text style={styles.infoCellLabel}>Hours</Text>
              <Text style={styles.infoCellValue} numberOfLines={1}>
                {place.opening_hours ?? '–'}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoCell}>
              <Ionicons name="navigate-outline" size={14} color="#7A7A7A" />
              <Text style={styles.infoCellLabel}>Distance</Text>
              <Text style={styles.infoCellValue} numberOfLines={1}>{distanceText}</Text>
            </View>
          </View>

          {/* About this place — heading ABOVE the divider */}
          <Text style={styles.shortDescHeading}>{place.short_description}</Text>
          <View style={styles.divider} />
          <View style={styles.descriptionWrap}>
            <Text
              style={styles.description}
              numberOfLines={isDescriptionExpanded ? undefined : 6}
            >
              {place.long_description}
            </Text>
            {isLongDescription && (
              <Pressable onPress={handleToggleDescription} accessibilityRole="button" accessibilityLabel={isDescriptionExpanded ? 'Show less' : 'Read more'}>
                <Text style={styles.seeMoreText}>{isDescriptionExpanded ? 'See less' : 'Read more >'}</Text>
              </Pressable>
            )}
          </View>

          {/* Tags */}
          {place.tags.length > 0 && (
            <>
              <View style={styles.divider} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagsScroll}
              >
                {place.tags.map(tag => (
                  <View key={tag.id} style={styles.tag}>
                    <Text style={styles.tagText}>{tag.name_en}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* Action buttons */}
          {(place.contact_phone !== null || place.latitude !== null || place.website !== null) && (
            <>
              <View style={styles.divider} />
              <View style={styles.actionsRow}>
                {place.contact_phone !== null && (
                  <Pressable style={styles.actionBtn} onPress={handleCallPhone} accessibilityLabel="Call" accessibilityRole="button">
                    <Ionicons name="call" size={16} color={colours.white} />
                    <Text style={styles.actionBtnText}>Call</Text>
                  </Pressable>
                )}
                {place.latitude !== null && (
                  <Pressable style={styles.actionBtn} onPress={handleOpenMaps} accessibilityLabel="Directions" accessibilityRole="button">
                    <Ionicons name="navigate" size={16} color={colours.white} />
                    <Text style={styles.actionBtnText}>Directions</Text>
                  </Pressable>
                )}
                {place.website !== null && (
                  <Pressable style={[styles.actionBtn, styles.actionBtnWebsite]} onPress={handleOpenWebsite} accessibilityLabel="Website" accessibilityRole="button">
                    <Ionicons name="globe-outline" size={16} color="#1B3A2D" />
                    <Text style={[styles.actionBtnText, styles.actionBtnWebsiteText]}>Website</Text>
                  </Pressable>
                )}
              </View>
            </>
          )}

          {/* Gallery strip */}
          {thumbSlice.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.gallerySectionHeader}>
                <Text style={styles.galleryLabel}>Gallery</Text>
                <Pressable onPress={handleViewAllImages} accessibilityLabel="View all images" accessibilityRole="button">
                  <Text style={styles.viewAllText}>View all {galleryImages.length} →</Text>
                </Pressable>
              </View>
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryStrip}
              >
                {thumbSlice.map((img: PlaceImage, idx: number) => {
                  const isLast = idx === thumbSlice.length - 1 && hiddenCount > 0;
                  return (
                    <Pressable key={img.id} style={styles.galleryThumb} onPress={() => handleImagePress(idx + 1)} accessibilityLabel="View image" accessibilityRole="imagebutton">
                      <Image source={{ uri: img.url }} style={styles.galleryThumbImg} contentFit="cover" cachePolicy="disk" transition={150} />
                      {isLast && (
                        <View style={styles.galleryMoreBadge}>
                          <Text style={styles.galleryMoreText}>+{hiddenCount}</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </Animated.ScrollView>
            </>
          )}

        </View>
      </Animated.ScrollView>

      <PlaceImageViewer images={viewerImages} index={viewerIndex} onClose={handleCloseImageViewer} />
    </SafeAreaView>
  );
}
