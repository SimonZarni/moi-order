import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useEmergencyContactDetailScreen } from '@/features/emergencyContacts/hooks/useEmergencyContactDetailScreen';
import { StickyBackButton } from '@/shared/components/StickyBackButton/StickyBackButton';
import { colours } from '@/shared/theme/colours';
import { styles } from './EmergencyContactDetailScreen.styles';

export function EmergencyContactDetailScreen(): React.JSX.Element {
  const {
    contact, isLoading, isError,
    title, description, photos,
    handleBack, handleCallPress, handleMapPress, handleFacebookPress, handleWebsitePress,
  } = useEmergencyContactDetailScreen();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StickyBackButton onPress={handleBack} label="Back" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colours.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !contact) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StickyBackButton onPress={handleBack} label="Back" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colours.textMuted }}>Unable to load contact. Pull to retry.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const coverPhoto = photos[0];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StickyBackButton onPress={handleBack} label="Back" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {coverPhoto ? (
          <Image source={{ uri: coverPhoto.url }} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <View style={styles.heroDark}>
            <Text style={styles.heroPlaceholderText}>No photo</Text>
          </View>
        )}

        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}

          <View style={styles.infoSection}>
            {contact.phone ? (
              <InfoRow
                icon="call-outline"
                text={contact.phone}
                onPress={handleCallPress}
                isLink
              />
            ) : null}
            {contact.location ? (
              <InfoRow icon="location-outline" text={contact.location} />
            ) : null}
            {contact.map_url ? (
              <InfoRow icon="map-outline" text="View on map" onPress={handleMapPress} isLink />
            ) : null}
            {contact.facebook_url ? (
              <InfoRow icon="logo-facebook" text="Facebook page" onPress={handleFacebookPress} isLink />
            ) : null}
            {contact.website_url ? (
              <InfoRow icon="globe-outline" text="Website" onPress={handleWebsitePress} isLink />
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── InfoRow ───────────────────────────────────────────────────────────────────

interface InfoRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
  onPress?: () => void;
  isLink?: boolean;
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
