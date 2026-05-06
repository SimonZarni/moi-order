import React from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useEmergencyContactListScreen } from '@/features/emergencyContacts/hooks/useEmergencyContactListScreen';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { colours } from '@/shared/theme/colours';
import { EmergencyContact } from '@/types/models';
import { styles } from './EmergencyContactListScreen.styles';

const TYPE_LABELS: Record<string, string> = {
  hospital:      'Hospitals',
  police_station: 'Police Stations',
  rescue:        'Rescues',
};

export function EmergencyContactListScreen(): React.JSX.Element {
  const {
    contacts, type, isLoading, isError, isRefreshing,
    hasNextPage, isFetchingNextPage,
    handleEndReached, handleRefresh, handleContactPress, handleBack,
  } = useEmergencyContactListScreen();

  const title = TYPE_LABELS[type] ?? 'Emergency Contacts';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HeroHeader
        accentColor="#c0392b"
        title={title}
        subtitle="Tap a contact for details and directions."
        onBack={handleBack}
        backLabel="Home"
      />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        data={contacts}
        keyExtractor={(item: EmergencyContact) => String(item.id)}
        renderItem={({ item }) => (
          <ContactCard contact={item} onPress={handleContactPress} />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        accessibilityRole="list"
        ListEmptyComponent={
          isLoading ? null : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {isError ? 'Unable to load contacts. Pull to retry.' : 'No contacts available.'}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={colours.primary} />
            </View>
          ) : null
        }
      />
      <StandaloneFloatingTabBar />
    </SafeAreaView>
  );
}

// ── ContactCard ───────────────────────────────────────────────────────────────

interface ContactCardProps {
  contact: EmergencyContact;
  onPress: (contact: EmergencyContact) => void;
}

function ContactCard({ contact, onPress }: ContactCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(contact)}
      accessibilityLabel={contact.title_en}
      accessibilityRole="button"
    >
      {contact.cover_photo ? (
        <Image source={{ uri: contact.cover_photo }} style={styles.coverImage} resizeMode="cover" />
      ) : null}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{contact.title_en}</Text>
        {contact.location ? <Text style={styles.cardLocation}>{contact.location}</Text> : null}
        {contact.phone ? <Text style={styles.cardPhone}>{contact.phone}</Text> : null}
      </View>
      <View style={styles.cardChevron}>
        <Ionicons name="chevron-forward" size={16} color={colours.textMuted} />
      </View>
    </Pressable>
  );
}
