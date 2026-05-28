import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Skeleton } from '../../../shared/components/Skeleton';
import { useOrdersScreen, type StatusFilter, type DatePreset } from '../hooks/useOrdersScreen';
import { OrderCard } from '../components/OrderCard';
import { styles } from './OrdersScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import type { FoodOrder } from '../../../types/models';

type Section = { title: string; data: FoodOrder[] };

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all',         label: 'All Orders' },
  { key: 'new',         label: 'New' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done',        label: 'Done' },
];

const DATE_PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'today',     label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7',     label: 'Last 7 Days' },
  { key: 'last30',    label: 'Last 30 Days' },
  { key: 'custom',    label: 'Custom' },
];

const SECTION_DOTS: Record<string, string> = {
  'New Orders':            colours.warning,
  'In Progress':           colours.primary,
  'Completed & Cancelled': colours.textSubtle,
};

function formatDateLabel(d: string | null, from: string | null, to: string | null, preset: DatePreset): string {
  if (preset === 'last7')     return 'Last 7 Days';
  if (preset === 'last30')    return 'Last 30 Days';
  if (preset === 'yesterday') return 'Yesterday';
  if (d === null)             return 'Today';
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface OrdersScreenProps {
  onSelectOrder?: (orderId: number) => void;
}

export function OrdersScreen({ onSelectOrder }: OrdersScreenProps): React.JSX.Element {
  const {
    sections, isLoading,
    statusFilter, dateFilter, dateFrom, dateTo, datePreset,
    searchQuery, totalVisible,
    handleUpdateStatus, handleStatusFilterChange,
    handleDatePreset, handleDatePrev, handleDateNext, handleDateToday,
    handleSearchChange, handleExportCsv,
  } = useOrdersScreen();

  const isToday        = datePreset === 'today';
  const isRangePreset  = datePreset === 'last7' || datePreset === 'last30';
  const pending        = sections.find((s) => s.title === 'New Orders')?.data.length ?? 0;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderLeft}>
          <Text style={styles.pageTitle}>Orders</Text>
          {pending > 0 && (
            <View style={styles.pendingPill}>
              <View style={styles.pendingDot} />
              <Text style={styles.pendingText}>{pending} pending</Text>
            </View>
          )}
        </View>
        <Pressable
          style={styles.exportBtn}
          onPress={handleExportCsv}
          accessibilityRole="button"
          accessibilityLabel="Export orders as CSV"
        >
          <Ionicons name="download-outline" size={14} color={colours.backgroundDark} />
          <Text style={styles.exportBtnText}>Export CSV</Text>
        </Pressable>
      </View>

      {/* ── Status tabs ─────────────────────────────────────────────────────── */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {STATUS_TABS.map((tab) => {
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

      <ScrollView style={styles.listBody} contentContainerStyle={styles.listBodyContent} showsVerticalScrollIndicator={false}>

        {/* ── Date preset pills ──────────────────────────────────────────────── */}
        <View style={styles.presetRow}>
          {DATE_PRESETS.filter((p) => p.key !== 'custom').map((p) => (
            <Pressable
              key={p.key}
              style={[styles.presetPill, datePreset === p.key && styles.presetPillActive]}
              onPress={() => handleDatePreset(p.key)}
              accessibilityRole="button"
              accessibilityLabel={p.label}
            >
              <Text style={[styles.presetPillText, datePreset === p.key && styles.presetPillTextActive]}>
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Day navigator (only for today / yesterday / custom) ─────────────── */}
        {!isRangePreset && (
          <View style={styles.dateNav}>
            <Pressable style={styles.dateArrow} onPress={handleDatePrev} accessibilityRole="button" accessibilityLabel="Previous day">
              <Ionicons name="chevron-back" size={14} color={colours.textMuted} />
            </Pressable>
            <View style={styles.dateCenter}>
              <Text style={styles.dateLabel}>
                {formatDateLabel(dateFilter, dateFrom, dateTo, datePreset)}
              </Text>
              <Text style={styles.dateCount}>{totalVisible} orders</Text>
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
              <Pressable style={styles.todayBtn} onPress={handleDateToday} accessibilityRole="button" accessibilityLabel="Back to today">
                <Text style={styles.todayBtnText}>Today</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Range label */}
        {isRangePreset && (
          <View style={styles.rangeLabel}>
            <Ionicons name="calendar-outline" size={13} color={colours.textMuted} />
            <Text style={styles.rangeLabelText}>
              {formatDateLabel(dateFilter, dateFrom, dateTo, datePreset)} — {totalVisible} orders
            </Text>
          </View>
        )}

        {/* ── Search bar ─────────────────────────────────────────────────────── */}
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={14} color={colours.textSubtle} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer or order #…"
            placeholderTextColor={colours.textSubtle}
            value={searchQuery}
            onChangeText={handleSearchChange}
            returnKeyType="search"
            accessibilityLabel="Search orders"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => handleSearchChange('')} accessibilityRole="button" accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={15} color={colours.textSubtle} />
            </Pressable>
          )}
        </View>

        {/* ── Orders list ────────────────────────────────────────────────────── */}
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
        ) : totalVisible === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="receipt-outline" size={26} color={colours.textSubtle} />
            </View>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyBody}>
              {searchQuery ? 'Try a different search term' : 'Try a different filter or date'}
            </Text>
          </View>
        ) : (
          (sections as Section[]).map((section) => (
            <View key={section.title}>
              <View style={styles.sectionLabel}>
                <View style={[styles.sectionDot, { backgroundColor: SECTION_DOTS[section.title] ?? colours.primary }]} />
                <Text style={styles.sectionLabelText}>{section.title}</Text>
                <Text style={styles.sectionCount}>{section.data.length}</Text>
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
