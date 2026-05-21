import React from 'react';
import { View, Text, ScrollView, SectionList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useOrdersScreen, type StatusFilter } from '../hooks/useOrdersScreen';
import { OrderCard } from '../components/OrderCard';
import { styles } from './OrdersScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import type { FoodOrder } from '../../../types/models';

type Section = { title: string; data: FoodOrder[] };

const STATUS_TABS: { key: StatusFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'all',         label: 'All',         icon: 'list-outline' },
  { key: 'new',         label: 'New',         icon: 'flash-outline' },
  { key: 'in_progress', label: 'In Progress', icon: 'time-outline' },
  { key: 'done',        label: 'Done',        icon: 'checkmark-circle-outline' },
];

function formatDateLabel(dateFilter: string | null): string {
  if (dateFilter === null) return 'Today';
  const d = new Date(dateFilter + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface OrdersScreenProps {
  onSelectOrder?: (orderId: number) => void;
}

export function OrdersScreen({ onSelectOrder }: OrdersScreenProps): React.JSX.Element {
  const {
    sections, isLoading,
    statusFilter, dateFilter,
    handleUpdateStatus, handleStatusFilterChange,
    handleDatePrev, handleDateNext, handleDateToday,
  } = useOrdersScreen();

  const isToday = dateFilter === null;
  const totalOrders = sections.reduce((sum, s) => sum + s.data.length, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>

      {/* ── Dark header ── */}
      <View style={styles.darkHeader}>
        <View style={styles.darkHeaderTop}>
          <View>
            <Text style={styles.darkHeaderTitle}>Orders</Text>
            <Text style={styles.darkHeaderSub}>{totalOrders} order{totalOrders !== 1 ? 's' : ''} · {formatDateLabel(dateFilter)}</Text>
          </View>
          {/* Date navigator */}
          <View style={styles.dateRow}>
            <Pressable style={styles.dateArrow} onPress={handleDatePrev} accessibilityRole="button" accessibilityLabel="Previous day">
              <Ionicons name="chevron-back" size={14} color="rgba(255,255,255,0.7)" />
            </Pressable>
            <Pressable style={styles.dateArrow} onPress={handleDateNext} disabled={isToday} accessibilityRole="button" accessibilityLabel="Next day">
              <Ionicons name="chevron-forward" size={14} color={isToday ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)'} />
            </Pressable>
            {!isToday && (
              <Pressable style={styles.dateTodayBtn} onPress={handleDateToday} accessibilityRole="button" accessibilityLabel="Go to today">
                <Text style={styles.dateTodayText}>Today</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Tab row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusTabsScroll}>
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.statusTab, isActive && styles.statusTabActive]}
                onPress={() => handleStatusFilterChange(tab.key)}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${tab.label}`}
              >
                <Ionicons name={tab.icon} size={13} color={isActive ? colours.backgroundDark : 'rgba(255,255,255,0.5)'} />
                <Text style={[styles.statusTabText, isActive && styles.statusTabTextActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={{ padding: spacing.md, gap: spacing.sm }}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={{ backgroundColor: colours.surface, borderRadius: radius.xl, padding: spacing.md, gap: spacing.sm,
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
              <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
                <Skeleton height={40} width={40} borderRadius={20} />
                <View style={{ flex: 1, gap: 6 }}>
                  <Skeleton height={14} width={120} borderRadius={4} />
                  <Skeleton height={11} width={80} borderRadius={4} />
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <Skeleton height={16} width={70} borderRadius={4} />
                  <Skeleton height={20} width={60} borderRadius={10} />
                </View>
              </View>
              <Skeleton height={11} width="70%" borderRadius={4} />
            </View>
          ))}
        </View>
      ) : (
        <SectionList<FoodOrder, Section>
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onUpdateStatus={handleUpdateStatus}
              onPress={onSelectOrder !== undefined ? () => onSelectOrder(item.id) : undefined}
            />
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="receipt-outline" size={28} color={colours.primary} />
              </View>
              <Text style={styles.emptyTitle}>No orders found</Text>
              <Text style={styles.empty}>Try a different filter or date</Text>
            </View>
          }
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}
