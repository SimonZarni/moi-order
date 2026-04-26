import React from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '@/shared/hooks/useLocale';

import { StickyBackButton } from '@/shared/components/StickyBackButton/StickyBackButton';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { PlaceCard } from '@/features/places/components/PlaceCard';
import { PlaceCardSkeleton } from '@/features/places/components/PlaceCardSkeleton';
import { TicketCard } from '@/features/tickets/components/TicketCard';
import { TicketCardSkeleton } from '@/features/tickets/components/TicketCardSkeleton';
import { PlacesSearchBar } from '@/features/places/components/PlacesSearchBar';
import { TicketsSearchBar } from '@/features/tickets/components/TicketsSearchBar';
import { usePlacesScreen, PlacesTab } from '@/features/places/hooks/usePlacesScreen';
import { Place, Ticket } from '@/types/models';
import { styles } from './PlacesScreen.styles';

const SKELETON_COUNT = 5;
const TICKET_SKELETON_COUNT = 4;

interface TabBarProps {
  activeTab: PlacesTab;
  onTabChange: (tab: PlacesTab) => void;
}

function TabBar({ activeTab, onTabChange }: TabBarProps): React.JSX.Element {
  const { locale } = useLocale();
  const placesLabel  = locale === 'mm' ? 'နေရာများ'    : 'Places';
  const ticketsLabel = locale === 'mm' ? 'လက်မှတ်များ' : 'Tickets';

  return (
    <View style={styles.tabRow}>
      <Pressable
        style={[styles.tab, activeTab === 'places' && styles.tabActive]}
        onPress={() => onTabChange('places')}
        accessibilityLabel="Places tab"
        accessibilityRole="tab"
      >
        <Text style={[styles.tabText, activeTab === 'places' && styles.tabTextActive]}>{placesLabel}</Text>
      </Pressable>
      <Pressable
        style={[styles.tab, activeTab === 'tickets' && styles.tabActive]}
        onPress={() => onTabChange('tickets')}
        accessibilityLabel="Tickets tab"
        accessibilityRole="tab"
      >
        <Text style={[styles.tabText, activeTab === 'tickets' && styles.tabTextActive]}>{ticketsLabel}</Text>
      </Pressable>
    </View>
  );
}

export function PlacesScreen(): React.JSX.Element {
  const {
    activeTab, handleTabChange,
    filteredPlaces, categories, isPlacesLoading, isPlacesError,
    isPlacesRefreshing, isPlacesFetchingNextPage,
    query, selectedCategory, handleQueryChange, handleCategorySelect,
    handlePlacesEndReached, handlePlacesRefresh, handlePlacePress,
    filteredTickets, ticketsQuery, isTicketsLoading, isTicketsError,
    isTicketsRefreshing, isTicketsFetchingNextPage,
    handleTicketsQueryChange, handleTicketsEndReached, handleTicketsRefresh, handleTicketPress,
    handleBack,
  } = usePlacesScreen();

  // Both search bars have identical container dimensions (same dark hero styles),
  // so the hero height stays constant when switching tabs.
  const hero = (
    <>
      <HeroHeader
        accentColor={editorialPalette.gold}
        onBack={handleBack}
        backLabel="Back"
        hideBack
        eyebrow="Explore"
        title="Places & Book Tickets"
        subtitle="Attractions, landmarks & experiences"
      />
      {activeTab === 'places' ? (
        <PlacesSearchBar
          query={query}
          onQueryChange={handleQueryChange}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      ) : (
        <TicketsSearchBar
          query={ticketsQuery}
          onQueryChange={handleTicketsQueryChange}
        />
      )}
      <View style={styles.bodyGap} />
    </>
  );

  const stickySection = (
    <View style={styles.stickyTabBar}>
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );

  if (activeTab === 'places' && isPlacesLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StickyBackButton onPress={handleBack} label="Back" />
        {hero}
        {stickySection}
        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false} contentContainerStyle={styles.list}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <PlaceCardSkeleton key={i} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (activeTab === 'tickets' && isTicketsLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StickyBackButton onPress={handleBack} label="Back" />
        {hero}
        {stickySection}
        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false} contentContainerStyle={styles.list}>
          <View style={styles.ticketCardsContainer}>
            {Array.from({ length: TICKET_SKELETON_COUNT }).map((_, i) => (
              <TicketCardSkeleton key={i} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (activeTab === 'places' && isPlacesError) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StickyBackButton onPress={handleBack} label="Back" />
        {hero}
        {stickySection}
        <View style={styles.stateBox}>
          <Ionicons name="warning" size={36} color={colours.textMuted} style={styles.stateIcon} />
          <Text style={styles.stateTitle}>Could not load places</Text>
          <Text style={styles.stateSubtitle}>Pull down to retry</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (activeTab === 'tickets' && isTicketsError) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StickyBackButton onPress={handleBack} label="Back" />
        {hero}
        {stickySection}
        <View style={styles.stateBox}>
          <Ionicons name="warning" size={36} color={colours.textMuted} style={styles.stateIcon} />
          <Text style={styles.stateTitle}>Could not load tickets</Text>
          <Text style={styles.stateSubtitle}>Pull down to retry</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (activeTab === 'places') {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StickyBackButton onPress={handleBack} label="Back" />
        {hero}
        {stickySection}
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item: Place) => String(item.id)}
          renderItem={({ item }) => <PlaceCard place={item} onPress={handlePlacePress} />}
          ListEmptyComponent={
            <View style={styles.stateBox}>
              <Ionicons name="search" size={36} color={colours.textMuted} style={styles.stateIcon} />
              <Text style={styles.stateTitle}>No places found</Text>
              <Text style={styles.stateSubtitle}>Try a different search or category</Text>
            </View>
          }
          onEndReached={handlePlacesEndReached}
          onEndReachedThreshold={0.4}
          onRefresh={handlePlacesRefresh}
          refreshing={isPlacesRefreshing}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            isPlacesFetchingNextPage
              ? <ActivityIndicator style={styles.listFooter} color={styles.spinner.color} />
              : null
          }
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
          accessibilityRole="list"
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StickyBackButton onPress={handleBack} label="Back" />
      {hero}
      {stickySection}
      <FlatList
        data={filteredTickets}
        keyExtractor={(item: Ticket) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.ticketCardsContainer}>
            <TicketCard item={item} onPress={handleTicketPress} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.stateBox}>
            <Ionicons name="pricetag-outline" size={36} color={colours.textMuted} style={styles.stateIcon} />
            <Text style={styles.stateTitle}>No tickets found</Text>
            <Text style={styles.stateSubtitle}>
              {ticketsQuery.length > 0 ? 'Try a different search term' : 'Check back later for attractions'}
            </Text>
          </View>
        }
        onEndReached={handleTicketsEndReached}
        onEndReachedThreshold={0.4}
        onRefresh={handleTicketsRefresh}
        refreshing={isTicketsRefreshing}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          isTicketsFetchingNextPage
            ? <ActivityIndicator style={styles.listFooter} color={styles.spinner.color} />
            : null
        }
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
        accessibilityRole="list"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
