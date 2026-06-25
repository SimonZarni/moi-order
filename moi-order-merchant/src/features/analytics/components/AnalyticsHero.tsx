import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './AnalyticsHero.styles';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { AnalyticsData, AnalyticsPeriod } from '../../../types/models';

interface AnalyticsHeroProps {
  period: AnalyticsPeriod;
  analytics: AnalyticsData | undefined;
}

export function AnalyticsHero({ period, analytics }: AnalyticsHeroProps): React.JSX.Element {
  const t = useTranslation();

  const map: Record<AnalyticsPeriod, { eyebrow: string; stats: { revenue_cents: number; order_count: number } | undefined }> = {
    today: { eyebrow: t('analytics_today'),     stats: analytics?.today },
    week:  { eyebrow: t('analytics_week'),      stats: analytics?.this_week },
    month: { eyebrow: t('analytics_month'),     stats: analytics?.this_month },
    all:   { eyebrow: t('analytics_this_month'), stats: analytics?.this_month },
  };

  const { eyebrow, stats } = map[period];
  const revenue = stats?.revenue_cents ?? 0;
  const orders  = stats?.order_count ?? 0;

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.amount}>{formatPrice(revenue)}</Text>
      <Text style={styles.sub}>{orders} {t('common_orders')}</Text>
    </View>
  );
}
