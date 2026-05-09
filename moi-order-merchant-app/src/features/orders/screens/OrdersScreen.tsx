import React from 'react';
import { View, Text, ScrollView, SectionList, Pressable } from 'react-native';
import { Skeleton } from '../../../shared/components/Skeleton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrdersScreen, type StatusFilter } from '../hooks/useOrdersScreen';
import { OrderCard } from '../components/OrderCard';
import { styles } from './OrdersScreen.styles';
import { colours } from '../../../shared/theme/colours';
import type { FoodOrder } from '../../../types/models';

type Section = { title: string; data: FoodOrder[] };

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
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

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.filterBar}>
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
                <Text style={[styles.statusTabText, isActive && styles.statusTabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.dateRow}>
          <Pressable style={styles.dateArrow} onPress={handleDatePrev} accessibilityRole="button" accessibilityLabel="Previous day">
            <Ionicons name="chevron-back" size={16} color={colours.textMuted} />
          </Pressable>
          <Text style={styles.dateLabel}>{formatDateLabel(dateFilter)}</Text>
          <Pressable
            style={styles.dateArrow}
            onPress={handleDateNext}
            disabled={isToday}
            accessibilityRole="button"
            accessibilityLabel="Next day"
          >
            <Ionicons name="chevron-forward" size={16} color={isToday ? colours.divider : colours.textMuted} />
          </Pressable>
          {!isToday && (
            <Pressable style={styles.dateTodayBtn} onPress={handleDateToday} accessibilityRole="button" accessibilityLabel="Go to today">
              <Text style={styles.dateTodayText}>Today</Text>
            </Pressable>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Skeleton height={14} width={120} borderRadius={6} />
                <Skeleton height={14} width={60} borderRadius={12} />
              </View>
              <Skeleton height={12} width="80%" borderRadius={4} />
              <Skeleton height={12} width="50%" borderRadius={4} />
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
            <View style={styles.centered}>
              <Ionicons name="receipt-outline" size={40} color={colours.medium} />
              <Text style={styles.empty}>No orders found</Text>
            </View>
          }
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}
