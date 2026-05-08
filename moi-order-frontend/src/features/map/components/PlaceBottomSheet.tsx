import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, Linking, Pressable,
  ScrollView, Text, View, useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MAP_COLORS } from '@/shared/theme/mapTheme';
import { useStrings } from '@/shared/i18n';
import { formatDistance, formatDuration } from '@/shared/api/mapbox';
import { styles } from './PlaceBottomSheet.styles';
import type { Place, Tag } from '@/types/models';
import type { DirectionsResult } from '@/shared/api/mapbox';

interface Props {
  place:           Place;
  detail:          Place | null;
  isLoading:       boolean;
  drivingRoute:    DirectionsResult | null;
  walkingRoute:    DirectionsResult | null;
  isLoadingRoutes: boolean;
  hasUserLocation: boolean;
  onDismiss:        () => void;
  onGetDirections:  () => void;
  onNavigate:       () => void;
  onReadMore:       () => void;
  onSnapChange?:    (index: number) => void;
}

const SNAP_POINTS = ['13%', '46%', '78%'];
const START_INDEX = 1;

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 50 };

export function PlaceBottomSheet({
  place, detail, isLoading,
  drivingRoute, walkingRoute, isLoadingRoutes,
  hasUserLocation, onDismiss, onGetDirections, onNavigate, onReadMore, onSnapChange,
}: Props): React.JSX.Element {
  const { width } = useWindowDimensions();
  const sheetRef  = useRef<BottomSheet>(null);
  const galleryRef = useRef<FlatList>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeIndexRef = useRef(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [snapIdx, setSnapIdx] = useState(START_INDEX);
  const isPeeking = snapIdx === 0;
  const coverImage = detail?.cover_image ?? place.cover_image;
  const hasRoutes  = !!(drivingRoute || walkingRoute);
  const s = useStrings();

  // Build gallery image list: all place images sorted, fallback to cover
  const galleryImages: string[] = detail?.images && detail.images.length > 0
    ? [...detail.images].sort((a, b) => a.sort_order - b.sort_order).map(img => img.url)
    : (coverImage ? [coverImage] : []);

  // Auto-advance slideshow every 3 s
  const startSlideTimer = useCallback(() => {
    if (galleryImages.length <= 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const next = (activeIndexRef.current + 1) % galleryImages.length;
      activeIndexRef.current = next;
      setSlideIdx(next);
      galleryRef.current?.scrollToIndex({ index: next, animated: true });
    }, 3000);
  }, [galleryImages.length]);

  useEffect(() => {
    setSlideIdx(0);
    activeIndexRef.current = 0;
    startSlideTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [place.id, startSlideTimer]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
    const idx = viewableItems[0]?.index ?? 0;
    activeIndexRef.current = idx;
    setSlideIdx(idx);
  }).current;

  useEffect(() => {
    setSnapIdx(START_INDEX);
    const t = setTimeout(() => sheetRef.current?.snapToIndex(START_INDEX), 80);
    return () => clearTimeout(t);
  }, [place.id]);

  const handleChange  = useCallback((index: number) => {
    setSnapIdx(index);
    onSnapChange?.(index);
  }, [onSnapChange]);
  const handleDismiss = useCallback(() => { sheetRef.current?.close(); onDismiss(); }, [onDismiss]);
  const handleCall    = useCallback(() => {
    if (detail?.contact_phone) Linking.openURL(`tel:${detail.contact_phone}`);
  }, [detail]);
  const handleWebsite = useCallback(() => {
    if (detail?.website) Linking.openURL(detail.website);
  }, [detail]);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={SNAP_POINTS}
      onChange={handleChange}
      enablePanDownToClose={false}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
      animateOnMount
      overDragResistanceFactor={6}
      containerStyle={styles.sheetContainer}
    >
      <View style={styles.peekRow}>
        <View style={styles.peekThumb}>
          {coverImage
            ? <Image source={{ uri: coverImage }} style={styles.peekThumbImg} contentFit="cover" />
            : <Text style={styles.peekThumbEmoji}>📍</Text>
          }
        </View>
        <View style={styles.peekCenter}>
          <Text style={styles.peekName} numberOfLines={1}>{place.name_en}</Text>
          {hasRoutes && (
            <View style={styles.peekPills}>
              {drivingRoute && (
                <View style={styles.peekPill}>
                  <Text style={styles.peekPillText}>
                    🚗 {formatDuration(drivingRoute.duration_s)} · {formatDistance(drivingRoute.distance_m)}
                  </Text>
                </View>
              )}
              {walkingRoute && (
                <View style={[styles.peekPill, styles.peekPillWalk]}>
                  <Text style={styles.peekPillText}>🚶 {formatDuration(walkingRoute.duration_s)}</Text>
                </View>
              )}
            </View>
          )}
        </View>
        <Pressable onPress={handleDismiss} style={styles.dismissBtn}
          accessibilityRole="button" accessibilityLabel="Close" hitSlop={12}>
          <Text style={styles.dismissText}>✕</Text>
        </Pressable>
      </View>

      {/* Keep content mounted so dragging back up has no white-flash re-mount cost.
          Height 0 + overflow hidden hides it at peek without unmounting. */}
      <View style={{ flex: isPeeking ? 0 : 1, overflow: 'hidden' }}>
        <BottomSheetScrollView contentContainerStyle={styles.scroll}>
          {galleryImages.length > 0 ? (
            <View style={styles.slideWrap}>
              <FlatList
                ref={galleryRef}
                data={galleryImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={[styles.slideImage, { width }]} contentFit="cover" />
                )}
                getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={VIEWABILITY_CONFIG}
                onScrollBeginDrag={() => { if (intervalRef.current) clearInterval(intervalRef.current); }}
                onMomentumScrollEnd={startSlideTimer}
                scrollEventThrottle={16}
              />
              {galleryImages.length > 1 && (
                <View style={styles.slideDots}>
                  {galleryImages.map((_, i) => (
                    <View key={i} style={[styles.slideDot, i === slideIdx && styles.slideDotActive]} />
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={[styles.cover, styles.coverPlaceholder]}>
              <Text style={styles.coverPlaceholderText}>📍</Text>
            </View>
          )}

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <Text style={styles.name}>{place.name_en}</Text>
                {place.categories[0]?.name_en ? (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{place.categories[0].name_en}</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.headerRight}>
                <Pressable
                  onPress={onReadMore}
                  style={styles.readMoreTag}
                  accessibilityRole="button"
                  accessibilityLabel="Read more about this place"
                >
                  <Text style={styles.readMoreText}>Read More →</Text>
                </Pressable>
              </View>
            </View>

            {place.address ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.infoText}>
                  {place.address}{place.city ? `, ${place.city}` : ''}
                </Text>
              </View>
            ) : null}

            {isLoading && <ActivityIndicator color={MAP_COLORS.primary} style={styles.loader} />}

            {detail && !isLoading && (
              <>
                {detail.opening_hours ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>🕐</Text>
                    <Text style={styles.infoText}>{detail.opening_hours}</Text>
                  </View>
                ) : null}
                {detail.contact_phone ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📞</Text>
                    <Text style={styles.infoText}>{detail.contact_phone}</Text>
                  </View>
                ) : null}
                {Array.isArray(detail.tags) && detail.tags.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsRow} decelerationRate="fast">
                    {(detail.tags as Tag[]).map((tag) => (
                      <View key={tag.id} style={styles.tag}>
                        <Text style={styles.tagText}>{tag.name_en}</Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </>
            )}

            {hasUserLocation && (
              <View style={styles.directionsSection}>
                {hasRoutes && (
                  <View style={styles.routeCards}>
                    {drivingRoute && (
                      <View style={[styles.routeCard, styles.routeCardDrive]}>
                        <Text style={styles.routeCardIcon}>🚗</Text>
                        <Text style={styles.routeCardTime}>{formatDuration(drivingRoute.duration_s)}</Text>
                        <Text style={styles.routeCardDist}>{formatDistance(drivingRoute.distance_m)}</Text>
                      </View>
                    )}
                    {walkingRoute && (
                      <View style={[styles.routeCard, styles.routeCardWalk]}>
                        <Text style={styles.routeCardIcon}>🚶</Text>
                        <Text style={styles.routeCardTime}>{formatDuration(walkingRoute.duration_s)}</Text>
                        <Text style={styles.routeCardDist}>{formatDistance(walkingRoute.distance_m)}</Text>
                      </View>
                    )}
                  </View>
                )}
                {!hasRoutes ? (
                  <Pressable onPress={onGetDirections} disabled={isLoadingRoutes}
                    style={styles.directionsBtn} accessibilityRole="button" accessibilityLabel="Get directions">
                    {isLoadingRoutes
                      ? <ActivityIndicator color={MAP_COLORS.white} size="small" />
                      : <Text style={styles.directionsBtnText}>{s.map.getDirections}</Text>
                    }
                  </Pressable>
                ) : (
                  <Pressable onPress={onNavigate} style={styles.navigateBtn}
                    accessibilityRole="button" accessibilityLabel="Start navigation">
                    <Text style={styles.navigateBtnText}>{s.map.navigateOnMap}</Text>
                  </Pressable>
                )}
              </View>
            )}

            <View style={styles.secondaryActions}>
              {detail?.contact_phone && (
                <Pressable onPress={handleCall} style={styles.secBtn}
                  accessibilityRole="button" accessibilityLabel="Call">
                  <Text style={styles.secBtnText}>📞 Call</Text>
                </Pressable>
              )}
              {detail?.website && (
                <Pressable onPress={handleWebsite} style={styles.secBtn}
                  accessibilityRole="button" accessibilityLabel="Website">
                  <Text style={styles.secBtnText}>🌐 Website</Text>
                </Pressable>
              )}
            </View>
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
}
