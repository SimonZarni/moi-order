import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useSafetyLocationDetailScreen } from '@/features/safety/hooks/useSafetyLocationDetailScreen';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { colours } from '@/shared/theme/colours';
import { styles } from './SafetyLocationDetailScreen.styles';

const CATEGORY_ACCENT: Record<string, string> = {
  hospital:       '#e53935',
  police_station: '#1565c0',
  rescue:         '#f57c00',
};

export function SafetyLocationDetailScreen(): React.JSX.Element {
  const {
    location, isLoading, isError,
    handleBack, handleCallPress, handleMapPress, handleFacebookPress,
  } = useSafetyLocationDetailScreen();

  const accentColor = location ? (CATEGORY_ACCENT[location.category] ?? colours.danger) : colours.danger;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <HeroHeader accentColor={accentColor} title="Loading…" onBack={handleBack} backLabel="Back" minHeight={80} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colours.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !location) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <HeroHeader accentColor={accentColor} title="Error" onBack={handleBack} backLabel="Back" minHeight={80} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Unable to load location. Please go back and try again.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasMap = Boolean(location.gmap_link) || (location.latitude != null && location.longitude != null);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HeroHeader
        accentColor={accentColor}
        title={location.name}
        onBack={handleBack}
        backLabel="Back"
        minHeight={80}
      />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {location.cover_photo_url ? (
          <Image source={{ uri: location.cover_photo_url }} style={styles.heroImage} resizeMode="cover" />
        ) : null}

        <View style={styles.body}>
          <Text style={styles.title}>{location.name}</Text>
          {location.sub_category ? (
            <Text style={[styles.subCategory, { color: accentColor }]}>{location.sub_category}</Text>
          ) : null}
          {location.description ? (
            <Text style={styles.description}>{location.description}</Text>
          ) : null}

          <View style={styles.infoSection}>
            {location.phone ? (
              <InfoRow icon="call-outline" text={location.phone} onPress={handleCallPress} isLink />
            ) : null}
            {location.location ? (
              <InfoRow icon="location-outline" text={location.location} />
            ) : null}
            {hasMap ? (
              <InfoRow icon="map-outline" text="View on Google Maps" onPress={handleMapPress} isLink />
            ) : null}
            {location.fb_page_link ? (
              <InfoRow icon="logo-facebook" text="Facebook Page" onPress={handleFacebookPress} isLink />
            ) : null}
          </View>

          {location.photo_urls.length > 0 ? (
            <View style={styles.gallerySection}>
              <Text style={styles.galleryTitle}>Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
                {location.photo_urls.map((url, idx) => (
                  <Image key={idx} source={{ uri: url }} style={styles.galleryImage} resizeMode="cover" />
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  const content = (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={isLink ? colours.primary : colours.textMuted} />
      <Text style={isLink ? styles.infoTextLink : styles.infoText}>{text}</Text>
      {isLink ? <Ionicons name="chevron-forward" size={14} color={colours.primary} /> : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={text}>
        {content}
      </Pressable>
    );
  }

  return content;
}
