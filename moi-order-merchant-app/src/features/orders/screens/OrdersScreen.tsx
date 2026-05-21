import React from 'react';
import { View, Text, ScrollView, SectionList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useOrdersScreen, type StatusFilter } from '../hooks/useOrdersScreen';
import { OrderCard } from '../components/OrderCard';
import { styles } from './OrdersScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { radius } from '../../../shared/theme/radius';
import type { FoodOrder } from '../../../types/models';

type Section = { title: string; data: FoodOrder[] };

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All Orders' },
  { key: 'new', label: 'New' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
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

  const ListHeader = (
    <View style={styles.listHeaderWrap}>
      {/* Floating date navigator card */}
      <View style={styles.dateCard}>
        <Pressable style={styles.dateArrow} onPress={handleDatePrev} accessibilityRole="button" accessibilityLabel="Previous day">
          <Ionicons name="chevron-back" size={16} color={colours.primary} />
        </Pressable>
        <View style={styles.dateLabelWrap}>
          <Text style={styles.dateLabel}>{formatDateLabel(dateFilter)}</Text>
          <Text style={styles.dateOrderCount}>{totalOrders} order{totalOrders !== 1 ? 's' : ''}</Text>
        </View>
        <Pressable
          style={[styles.dateArrow, isToday && styles.dateArrowDisabled]}
          onPress={handleDateNext}
          disabled={isToday}
          accessibilityRole="button"
          accessibilityLabel="Next day"
        >
          <Ionicons name="chevron-forward" size={16} color={isToday ? colours.divider : colours.primary} />
        </Pressable>
        {!isToday && (
          <Pressable style={styles.todayBtn} onPress={handleDateToday} accessibilityRole="button" accessibilityLabel="Go to today">
            <Text style={styles.todayBtnText}>Today</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* ── Dark header with tabs ── */}
      <View style={styles.darkHeader}>
        <Text style={styles.pageTitle}>Orders</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => handleStatusFilterChange(tab.key)}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${tab.label}`}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <ScrollView style={styles.listBody} contentContainerStyle={styles.listBodyContent}>
          <View style={styles.listHeaderWrap}>
            <View style={[styles.dateCard, { height: 70 }]} />
          </View>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.skeletonWrap}>
              <View style={[styles.skeletonStrip, { backgroundColor: i % 2 === 0 ? colours.warning + '55' : colours.primary + '55' }]} />
              <View style={{ flex: 1, padding: spacing.md, gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Skeleton height={38} width={38} borderRadius={19} />
                    <View style={{ gap: 5 }}>
                      <Skeleton height={13} width={110} borderRadius={4} />
                      <Skeleton height={10} width={70} borderRadius={4} />
                    </View>
                  </View>
                  <Skeleton height={18} width={70} borderRadius={4} />
                </View>
                <Skeleton height={10} width="75%" borderRadius={4} />
                <Skeleton height={10} width="40%" borderRadius={4} />
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <SectionList<FoodOrder, Section>
          style={styles.listBody}
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
            <Text style={styles.sectionLabel}>{section.title}</Text>
          )}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listBodyContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <Ionicons name="receipt-outline" size={26} color={colours.primary} />
              </View>
              <Text style={styles.emptyTitle}>No orders found</Text>
              <Text style={styles.emptyBody}>Try a different filter or date</Text>
            </View>
          }
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}
