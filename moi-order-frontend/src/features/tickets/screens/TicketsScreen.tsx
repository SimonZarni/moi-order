import React from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { useTicketsScreen } from '@/features/tickets/hooks/useTicketsScreen';
import { Ticket } from '@/types/models';
import { styles } from './TicketsScreen.styles';

function formatPrice(thb: number): string {
  return `From ฿${thb.toLocaleString('th-TH')}`;
}

interface TicketCardProps {
  item: Ticket;
  onPress: (id: number) => void;
}

function TicketCard({ item, onPress }: TicketCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.cardWrap, { opacity: pressed ? 0.88 : 1 }]}
      onPress={() => onPress(item.id)}
      accessibilityLabel={item.name}
      accessibilityRole="button"
    >
      <Image source={{ uri: item.cover_image_url }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardHighlight} numberOfLines={2}>{item.highlight_description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardLocation}>{item.city}</Text>
          {item.starting_from_price !== undefined && (
            <Text style={styles.cardPrice}>{formatPrice(item.starting_from_price)}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export function TicketsScreen(): React.JSX.Element {
  const {
    tickets, isLoading, isError, isRefreshing, isFetchingNextPage,
    handleEndReached, handleRefresh, handleTicketPress, handleBack,
  } = useTicketsScreen();

  const header = (
    <>
      <HeroHeader
        accentColor={editorialPalette.gold}
        eyebrow="Explore"
        title="Tickets"
        subtitle="Book attractions & experiences"
        onBack={handleBack}
        backLabel="Back"
      />
      <View style={styles.bodyGap} />
    </>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {header}
        <View style={styles.stateBox}>
          <ActivityIndicator size="large" color={styles.spinner.color} />
        </View>
        <FloatingTabBar />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        {header}
        <View style={styles.stateBox}>
          <Text style={styles.stateIcon}>⚠</Text>
          <Text style={styles.stateTitle}>Could not load tickets</Text>
          <Text style={styles.stateSubtitle}>Pull down to retry</Text>
        </View>
        <FloatingTabBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FlatList
        data={tickets}
        keyExtractor={(item: Ticket) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.cardsContainer}>
            <TicketCard item={item} onPress={handleTicketPress} />
          </View>
        )}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        ListFooterComponent={
          isFetchingNextPage
            ? <ActivityIndicator style={styles.listFooter} color={styles.spinner.color} />
            : null
        }
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews
        accessibilityRole="list"
        showsVerticalScrollIndicator={false}
      />
      <FloatingTabBar />
    </SafeAreaView>
  );
}
