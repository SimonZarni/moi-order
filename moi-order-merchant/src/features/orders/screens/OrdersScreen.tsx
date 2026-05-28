import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useOrdersScreen, type StatusFilter } from '../hooks/useOrdersScreen';
import { OrderCard } from '../components/OrderCard';
import { styles } from './OrdersScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import type { FoodOrder } from '../../../types/models';

type Section = { title: string; data: FoodOrder[] };

const TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all',         label: 'All Orders' },
  { key: 'new',         label: 'New' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done',        label: 'Done' },
];

const SECTION_DOTS: Record<string, string> = {
  'New Orders':            colours.warning,
  'In Progress':           colours.primary,
  'Completed & Cancelled': colours.textSubtle,
};

function formatDateLabel(d: string | null): string {
  if (d === null) return 'Today';
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
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
  const totalOrders = sections.reduce((s, sec) => s + sec.data.length, 0);
  const pending = sections.find((s) => s.title === 'New Orders')?.data.length ?? 0;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Page header — fixed, no scroll */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Orders</Text>
        {pending > 0 && (
          <View style={styles.pendingPill}>
            <View style={styles.pendingDot} />
            <Text style={styles.pendingText}>{pending} pending</Text>
          </View>
        )}
      </View>

      {/* Filter tabs — constrained wrapper prevents vertical stretch on web */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {TABS.map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => handleStatusFilterChange(tab.key)}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Single scroll context — no SectionList, no nested scroll */}
      <ScrollView
        style={styles.listBody}
        contentContainerStyle={styles.listBodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date navigator */}
        <View style={styles.dateNav}>
          <Pressable style={styles.dateArrow} onPress={handleDatePrev} accessibilityRole="button" accessibilityLabel="Previous day">
            <Ionicons name="chevron-back" size={14} color={colours.textMuted} />
          </Pressable>
          <View style={styles.dateCenter}>
            <Text style={styles.dateLabel}>{formatDateLabel(dateFilter)}</Text>
            <Text style={styles.dateCount}>{totalOrders} orders this period</Text>
          </View>
          <Pressable
            style={[styles.dateArrow, isToday && { opacity: 0.3 }]}
            onPress={handleDateNext}
            disabled={isToday}
            accessibilityRole="button"
            accessibilityLabel="Next day"
          >
            <Ionicons name="chevron-forward" size={14} color={colours.textMuted} />
          </Pressable>
          {!isToday && (
            <Pressable style={styles.todayBtn} onPress={handleDateToday} accessibilityRole="button" accessibilityLabel="Today">
              <Text style={styles.todayBtnText}>Today</Text>
            </Pressable>
          )}
        </View>

        {isLoading ? (
          <View style={{ padding: spacing.md, gap: spacing.sm }}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.skeletonWrap}>
                <View style={[styles.skeletonStrip, { backgroundColor: colours.warning + '44' }]} />
                <View style={{ flex: 1, padding: spacing.md, gap: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                      <Skeleton height={40} width={40} borderRadius={8} />
                      <View style={{ gap: 5 }}>
                        <Skeleton height={13} width={110} borderRadius={4} />
                        <Skeleton height={10} width={70} borderRadius={4} />
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      <Skeleton height={16} width={80} borderRadius={4} />
                      <Skeleton height={18} width={90} borderRadius={10} />
                    </View>
                  </View>
                  <Skeleton height={10} width="70%" borderRadius={4} />
                </View>
              </View>
            ))}
          </View>
        ) : totalOrders === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="receipt-outline" size={26} color={colours.textSubtle} />
            </View>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyBody}>Try a different filter or date</Text>
          </View>
        ) : (
          (sections as Section[]).map((section) => (
            <View key={section.title}>
              <View style={styles.sectionLabel}>
                <View style={[styles.sectionDot, { backgroundColor: SECTION_DOTS[section.title] ?? colours.primary }]} />
                <Text style={styles.sectionLabelText}>{section.title}</Text>
              </View>
              {section.data.map((item: FoodOrder) => (
                <OrderCard
                  key={item.id}
                  order={item}
                  variant="light"
                  onUpdateStatus={handleUpdateStatus}
                  onPress={onSelectOrder !== undefined ? () => onSelectOrder(item.id) : undefined}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
