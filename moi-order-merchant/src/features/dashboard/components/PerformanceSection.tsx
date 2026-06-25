import React from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { styles } from './PerformanceSection.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { TopPeriod } from '../../../api/analytics';
import type { TopData, TopItem, TopCustomer } from '../../../types/models';

type PerformanceTab = 'items' | 'customers';

interface PerformanceSectionProps {
  topData: TopData | undefined;
  topPeriod: TopPeriod;
  activeTab: PerformanceTab;
  onPeriodChange: (period: TopPeriod) => void;
  onTabChange: (tab: PerformanceTab) => void;
}

const MAX_VISIBLE = 5;

export function PerformanceSection({ topData, topPeriod, activeTab, onPeriodChange, onTabChange }: PerformanceSectionProps): React.JSX.Element {
  const t = useTranslation();

  const PERIOD_TABS: { key: TopPeriod; label: string }[] = [
    { key: 'today', label: t('dashboard_period_today') },
    { key: 'week',  label: t('dashboard_period_week') },
    { key: 'month', label: t('dashboard_period_month') },
  ];

  const items     = topData?.top_items.slice(0, MAX_VISIBLE) ?? [];
  const customers = topData?.top_customers.slice(0, MAX_VISIBLE) ?? [];
  const isEmpty   = activeTab === 'items' ? items.length === 0 : customers.length === 0;

  const topItemValue     = items[0]?.revenue_cents ?? 1;
  const topCustomerValue = customers[0]?.total_cents ?? 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('dashboard_performance')}</Text>
        <View style={styles.periodTabs}>
          {PERIOD_TABS.map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.periodTab, topPeriod === tab.key && styles.periodTabActive]}
              onPress={() => onPeriodChange(tab.key)}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
            >
              <Text style={[styles.periodTabText, topPeriod === tab.key && styles.periodTabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.typeTabs}>
        <Pressable
          style={[styles.typeTab, activeTab === 'items' && styles.typeTabActive]}
          onPress={() => onTabChange('items')}
          accessibilityRole="button"
          accessibilityLabel={t('dashboard_top_sales')}
        >
          <Text style={[styles.typeTabText, activeTab === 'items' && styles.typeTabTextActive]}>
            🔥 {t('dashboard_top_sales')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.typeTab, activeTab === 'customers' && styles.typeTabActive]}
          onPress={() => onTabChange('customers')}
          accessibilityRole="button"
          accessibilityLabel={t('dashboard_top_customers')}
        >
          <Text style={[styles.typeTabText, activeTab === 'customers' && styles.typeTabTextActive]}>
            👥 {t('dashboard_top_customers')}
          </Text>
        </Pressable>
      </View>

      <View style={styles.listCard}>
        {isEmpty ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t('dashboard_no_data_period')}</Text>
          </View>
        ) : activeTab === 'items' ? (
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={Platform.OS === 'web'}>
            {items.map((item, i) => (
              <ItemRow key={item.name} item={item} rank={i + 1} maxValue={topItemValue} soldLabel={t('dashboard_sold')} isLast={i === items.length - 1} />
            ))}
          </ScrollView>
        ) : (
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={Platform.OS === 'web'}>
            {customers.map((customer, i) => (
              <CustomerRow key={customer.name + i} customer={customer} rank={i + 1} maxValue={topCustomerValue} isLast={i === customers.length - 1} />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }): React.JSX.Element {
  const isFirst = rank === 1;
  return (
    <View style={[styles.rankBadge, isFirst && styles.rankBadgeGold]}>
      <Text style={[styles.rankText, isFirst && styles.rankTextGold]}>{rank}</Text>
    </View>
  );
}

interface ItemRowProps { item: TopItem; rank: number; maxValue: number; soldLabel: string; isLast: boolean; }
function ItemRow({ item, rank, maxValue, soldLabel, isLast }: ItemRowProps): React.JSX.Element {
  const fillPct = `${Math.round((item.revenue_cents / maxValue) * 100)}%` as `${number}%`;
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <RankBadge rank={rank} />
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.rowValue}>{formatPrice(item.revenue_cents)}</Text>
        </View>
        <View style={styles.rowBottom}>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: fillPct, backgroundColor: colours.primary }]} />
          </View>
          <Text style={styles.rowSub}>{item.total_quantity} {soldLabel}</Text>
        </View>
      </View>
    </View>
  );
}

interface CustomerRowProps { customer: TopCustomer; rank: number; maxValue: number; isLast: boolean; }
function CustomerRow({ customer, rank, maxValue, isLast }: CustomerRowProps): React.JSX.Element {
  const fillPct = `${Math.round((customer.total_cents / maxValue) * 100)}%` as `${number}%`;
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <RankBadge rank={rank} />
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text style={styles.rowName} numberOfLines={1}>{customer.name}</Text>
          <Text style={styles.rowValue}>{formatPrice(customer.total_cents)}</Text>
        </View>
        <View style={styles.rowBottom}>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: fillPct, backgroundColor: colours.success }]} />
          </View>
          <Text style={styles.rowSub}>{customer.order_count} orders</Text>
        </View>
      </View>
    </View>
  );
}
