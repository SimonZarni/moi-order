import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalyticsScreen, PERIODS } from '../hooks/useAnalyticsScreen';
import { AnalyticsHero } from '../components/AnalyticsHero';
import { AnalyticsMetrics } from '../components/AnalyticsMetrics';
import { AnalyticsChartCard } from '../components/AnalyticsChartCard';
import { AnalyticsComparison } from '../components/AnalyticsComparison';
import { styles } from './AnalyticsScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { AnalyticsPeriod } from '../../../types/models';

interface AnalyticsScreenProps {
  onPendingPress?: () => void;
}

export function AnalyticsScreen({ onPendingPress }: AnalyticsScreenProps): React.JSX.Element {
  const t = useTranslation();
  const { period, analytics, chartData, isLoading, isChartLoading, handlePeriodChange } = useAnalyticsScreen();

  const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
    all: t('analytics_all'), today: t('analytics_today'), week: t('analytics_week'), month: t('analytics_month'),
  };

  const pending = analytics?.pending_count ?? 0;

  if (isLoading) return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.loadingCenter}><ActivityIndicator size="large" color={colours.primary} /></View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.pageHeader}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>{t('analytics_performance_eyebrow')}</Text>
            <Text style={styles.pageTitle}>{t('analytics_page_title')}</Text>
          </View>
          {pending > 0 && (
            <Pressable style={styles.pendingPill} onPress={onPendingPress} accessibilityRole="button" accessibilityLabel={`${pending} ${t('analytics_pending_suffix')}`}>
              <View style={styles.pendingDot} />
              <Text style={styles.pendingText}>{pending} {t('analytics_pending_suffix')}</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <Pressable key={p} style={[styles.periodTab, period === p && styles.periodTabActive]} onPress={() => handlePeriodChange(p)} accessibilityRole="button" accessibilityLabel={PERIOD_LABELS[p]}>
              <Text style={[styles.periodTabText, period === p && styles.periodTabTextActive]}>{PERIOD_LABELS[p]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AnalyticsHero period={period} analytics={analytics} />
        <AnalyticsMetrics period={period} analytics={analytics} pending={pending} onPendingPress={onPendingPress} />
        {period !== 'all' && (
          <AnalyticsChartCard period={period} chartData={chartData} isLoading={isChartLoading} />
        )}
        {period === 'all' && (
          <AnalyticsComparison analytics={analytics} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
