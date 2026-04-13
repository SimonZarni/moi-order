import React from 'react';
import { Image } from 'expo-image';
import { FlatList, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { usePlaceDetailScreen } from '@/features/places/hooks/usePlaceDetailScreen';
import { colours } from '@/shared/theme/colours';
import { PlaceDetailSkeleton } from '@/features/places/components/PlaceDetailSkeleton';
import { PlaceImageViewer } from '@/features/places/components/PlaceImageViewer';
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

  if (isLoading) {
    return <PlaceDetailSkeleton />;
  }

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colours.primary} />
        }
      >

        {/* ── Hero ────────────────────────────────────────── */}
        <View style={styles.heroContainer}>
          {coverImage !== null && (
            <Pressable onPress={() => handleImagePress(0)} accessibilityLabel="View cover image" accessibilityRole="imagebutton">
              <Image
                source={{ uri: coverImage.url }}
                style={styles.heroImage}
                contentFit="cover"
                cachePolicy="disk"
                transition={200}
              />
            </Pressable>
          )}
          <Pressable style={styles.heroBackBtn} onPress={handleBack}
            accessibilityLabel="Go back to places" accessibilityRole="button">
            <Text style={styles.heroBackArrow}>‹</Text>
            <Text style={styles.heroBackLabel}>Places</Text>
          </Pressable>

          {isLoggedIn && (
            <Pressable
              style={styles.heroFavBtn}
              onPress={handleToggleFavorite}
              disabled={isTogglingFavorite}
              accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              accessibilityRole="button"
            >
              <Text style={[styles.heroFavIcon, isFavorited && styles.heroFavIconActive]}>
                {isFavorited ? '♥' : '♡'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* ── § 1  Identity ────────────────────────────────── */}
        <View style={styles.identityCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{place.category.name_en}</Text>
          </View>
          <Text style={styles.name}>{place.name_my}</Text>
          <Text style={styles.nameSub}>{place.name_en}</Text>
          <View style={styles.cityRow}>
            <View style={styles.cityDot} />
            <Text style={styles.city}>{place.city}</Text>
          </View>
        </View>

        {/* ── § 2  Details ─────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Details</Text>
          {place.opening_hours !== null && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🕐</Text>
              <Text style={styles.infoText}>{place.opening_hours}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{place.address}</Text>
          </View>
          {place.contact_phone !== null && (
            <Pressable style={styles.infoRow} onPress={handleCallPhone} accessibilityLabel="Call phone number" accessibilityRole="button">
              <Text style={styles.infoIcon}>📞</Text>
              <Text style={[styles.infoText, styles.infoLink]}>{place.contact_phone}</Text>
            </Pressable>
          )}
          {place.website !== null && (
            <Pressable style={styles.infoRow} onPress={handleOpenWebsite} accessibilityLabel="Open website" accessibilityRole="button">
              <Text style={styles.infoIcon}>🌐</Text>
              <Text style={[styles.infoText, styles.infoLink]} numberOfLines={1}>{place.website}</Text>
            </Pressable>
          )}
          {place.latitude !== null && (
            <Pressable style={styles.infoRow} onPress={handleOpenMaps} accessibilityLabel="Open in maps" accessibilityRole="button">
              <Text style={styles.infoIcon}>🗺</Text>
              <Text style={[styles.infoText, styles.infoLink]}>View on Map</Text>
            </Pressable>
          )}
        </View>

        {/* ── § 3  Tags ────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Tags</Text>
          <View style={styles.tagRow}>
            {(place.tags ?? []).map((tag) => (
              <View key={tag.id} style={styles.tag}>
                <Text style={styles.tagText}>{tag.name_en}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── § 4  About ───────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.aboutAccent} />
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.longDescription}>{place.long_description}</Text>
        </View>

        {/* ── § 5  Gallery ─────────────────────────────────── */}
        {galleryImages.length > 0 && (
          <View style={styles.gallerySection}>
            <View style={styles.galleryHeader}>
              <Text style={styles.galleryLabel}>Gallery</Text>
              <Pressable style={styles.viewAllBtn} onPress={handleViewAllImages} accessibilityLabel="View all images" accessibilityRole="button">
                <Text style={styles.viewAllText}>View all</Text>
              </Pressable>
            </View>
            <FlatList
              data={galleryImages}
              keyExtractor={(img: PlaceImage) => String(img.id)}
              // index + 1: index 0 is the cover image in viewerImages
              renderItem={({ item, index }) => (
                <Pressable
                  style={styles.galleryImageWrap}
                  onPress={() => handleImagePress(index + 1)}
                  accessibilityLabel="View image"
                  accessibilityRole="imagebutton"
                >
                  <Image
                    source={{ uri: item.url }}
                    style={styles.galleryImage}
                    contentFit="cover"
                    cachePolicy="disk"
                    transition={150}
                  />
                </Pressable>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryList}
            />
          </View>
        )}

      </ScrollView>

      <PlaceImageViewer
        images={viewerImages}
        index={viewerIndex}
        onClose={handleCloseImageViewer}
      />
    </SafeAreaView>
  );
}
