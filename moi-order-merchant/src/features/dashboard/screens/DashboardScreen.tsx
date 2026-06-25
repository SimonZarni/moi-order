import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDashboardScreen } from '../hooks/useDashboardScreen';
import { HeroBand } from '../components/HeroBand';
import { KpiCards } from '../components/KpiCards';
import { OrdersSection } from '../components/OrdersSection';
import { PerformanceSection } from '../components/PerformanceSection';
import { Skeleton } from '../../../shared/components/Skeleton';
import { styles } from './DashboardScreen.styles';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { useTranslation } from '../../../shared/hooks/useTranslation';

interface DashboardScreenProps { onSelectOrder?: (orderId: string) => void; }

export function DashboardScreen({ onSelectOrder }: DashboardScreenProps): React.JSX.Element {
  const t = useTranslation();
  const {
    analytics, recentOrders, topData, topPeriod, pendingOnly, activePerformanceTab,
    isLoading, handleUpdateStatus, handleTopPeriodChange, handlePendingToggle, handlePerformanceTabChange,
  } = useDashboardScreen();
  const { isDesktop } = useResponsive();

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? t('dashboard_greeting_morning') : hour < 17 ? t('dashboard_greeting_afternoon') : t('dashboard_greeting_evening');
  const dateLabel = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const pending   = analytics?.pending_count ?? 0;

  if (isLoading) return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.skeletonPad}>
        <Skeleton height={14} width={100} borderRadius={4} />
        <Skeleton height={36} width={180} borderRadius={6} />
        <Skeleton height={120} width="100%" borderRadius={18} />
      </View>
    </SafeAreaView>
  );

  const perf   = <PerformanceSection topData={topData} topPeriod={topPeriod} activeTab={activePerformanceTab} onPeriodChange={handleTopPeriodChange} onTabChange={handlePerformanceTabChange} />;
  const orders = <OrdersSection recentOrders={recentOrders} pendingOnly={pendingOnly} onUpdateStatus={handleUpdateStatus} onSelectOrder={onSelectOrder} onTogglePending={handlePendingToggle} />;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.title}>{t('dashboard_title')}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.date}>{dateLabel}</Text>
          {pending > 0 && (
            <Pressable style={[styles.pendingPill, pendingOnly && styles.pendingPillActive]} onPress={handlePendingToggle} accessibilityRole="button" accessibilityLabel={`${pending} pending orders`}>
              <View style={[styles.pendingDot, pendingOnly && styles.pendingDotActive]} />
              <Text style={[styles.pendingText, pendingOnly && styles.pendingTextActive]}>{pending} {t('dashboard_pending_count')}</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <HeroBand analytics={analytics} />
        <KpiCards analytics={analytics} />
        {isDesktop
          ? <View style={styles.twoCol}><View style={styles.colLeft}>{orders}</View><View style={styles.colRight}>{perf}</View></View>
          : <>{orders}{perf}</>}
      </ScrollView>
    </SafeAreaView>
  );
}
