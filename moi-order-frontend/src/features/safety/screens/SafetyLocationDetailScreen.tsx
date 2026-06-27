import React from 'react';
import {
  ActivityIndicator, FlatList, Image, NativeSyntheticEvent,
  NativeScrollEvent, Pressable, ScrollView, Text, View, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useSafetyLocationDetailScreen } from '@/features/safety/hooks/useSafetyLocationDetailScreen';
import { colours } from '@/shared/theme/colours';
import { styles } from './SafetyLocationDetailScreen.styles';

export function SafetyLocationDetailScreen(): React.JSX.Element {
  const {
    location, isLoading, isError, photos, activePhotoIndex, hasMap,
    handleBack, handlePhotoScrollEnd,
    handleCallPress, handleMapPress, handleFacebookPress,
  } = useSafetyLocationDetailScreen();

  if (isLoading || isError || !location) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.compactHeader}>
          <Pressable onPress={handleBack} style={styles.backBtn} accessibilityLabel="Go back" accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
        </View>
        <View style={styles.centered}>
          {isLoading
            ? <ActivityIndicator size="large" color={colours.primary} />
            : <Text style={styles.errorText}>Unable to load. Please go back and try again.</Text>}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <PhotoGallery photos={photos} activeIndex={activePhotoIndex} onScrollEnd={handlePhotoScrollEnd} onBack={handleBack} />
        <View style={styles.body}>
          <Text style={styles.name}>{location.name}</Text>
          {location.sub_category ? <Text style={styles.category}>{location.sub_category}</Text> : null}
          {location.description  ? <Text style={styles.description}>{location.description}</Text> : null}
          <View style={styles.infoSection}>
            {location.phone        ? <InfoRow icon="call-outline"     text={location.phone}       onPress={handleCallPress}    isLink /> : null}
            {location.location     ? <InfoRow icon="location-outline" text={location.location} />                                        : null}
            {hasMap                ? <InfoRow icon="map-outline"      text="View on Google Maps"  onPress={handleMapPress}     isLink /> : null}
            {location.fb_page_link ? <InfoRow icon="logo-facebook"    text="Facebook Page"        onPress={handleFacebookPress} isLink /> : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── PhotoGallery ──────────────────────────────────────────────────────────────

interface PhotoGalleryProps {
  photos:      string[];
  activeIndex: number;
  onScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onBack:      () => void;
}

function PhotoGallery({ photos, activeIndex, onScrollEnd, onBack }: PhotoGalleryProps): React.JSX.Element {
  const { width } = useWindowDimensions();

  if (photos.length === 0) {
    return (
      <View style={[styles.galleryPlaceholder, { width }]}>
        <Ionicons name="image-outline" size={48} color="rgba(255,255,255,0.3)" />
        <Pressable onPress={onBack} style={styles.galleryBack} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ width, height: styles.galleryImage.height }}>
      <FlatList
        data={photos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        keyExtractor={(_, i) => String(i)}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={[styles.galleryImage, { width }]} resizeMode="cover" />
        )}
        onMomentumScrollEnd={onScrollEnd}
      />
      <Pressable onPress={onBack} style={styles.galleryBack} accessibilityLabel="Go back" accessibilityRole="button">
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </Pressable>
      {photos.length > 1 ? (
        <View style={styles.dotsRow}>
          {photos.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

// ── InfoRow ───────────────────────────────────────────────────────────────────

interface InfoRowProps {
  icon:     React.ComponentProps<typeof Ionicons>['name'];
  text:     string;
  onPress?: () => void;
  isLink?:  boolean;
}

function InfoRow({ icon, text, onPress, isLink = false }: InfoRowProps): React.JSX.Element {
  const row = (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={isLink ? colours.primary : colours.textMuted} />
      <Text style={isLink ? styles.infoTextLink : styles.infoText} numberOfLines={2}>{text}</Text>
      {isLink ? <Ionicons name="chevron-forward" size={14} color={colours.primary} /> : null}
    </View>
  );
  if (onPress) {
    return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={text}>{row}</Pressable>;
  }
  return row;
}
