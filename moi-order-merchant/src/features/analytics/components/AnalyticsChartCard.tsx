import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { TimeSeriesChart } from './TimeSeriesChart';
import { styles } from './AnalyticsChartCard.styles';
import { colours } from '../../../shared/theme/colours';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { AnalyticsChartData, AnalyticsPeriod } from '../../../types/models';

interface AnalyticsChartCardProps {
  period: Exclude<AnalyticsPeriod, 'all'>;
  chartData: AnalyticsChartData | undefined;
  isLoading: boolean;
}

export function AnalyticsChartCard({ period, chartData, isLoading }: AnalyticsChartCardProps): React.JSX.Element {
  const t = useTranslation();

  const title = period === 'today'
    ? t('analytics_chart_hourly')
    : period === 'week'
    ? t('analytics_chart_daily_7')
    : t('analytics_chart_daily_30');

  const accent = period === 'today' ? colours.warning : colours.primary;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: accent }]} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={colours.primary} />
        </View>
      ) : (
        <TimeSeriesChart
          points={chartData?.points ?? []}
          trackHeight={120}
          emptyMessage={t('analytics_no_period_data')}
        />
      )}
    </View>
  );
}
