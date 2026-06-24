import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDailyInvoiceScreen, type CashoutPeriod } from '../hooks/useDailyInvoiceScreen';
import { InvoiceCard } from '../components/InvoiceCard';
import { styles } from './DailyInvoiceScreen.styles';
import { colours } from '../../../shared/theme/colours';
import { formatPrice } from '../../../shared/utils/formatCurrency';
import { formatDate } from '../../../shared/utils/formatDate';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import type { TranslationKey } from '../../../shared/constants/translations';
import type { InvoiceSummary } from '../../../types/models';

type TranslateFn = (key: TranslationKey) => string;

const PERIODS: CashoutPeriod[] = ['today', 'week', 'month'];

export function DailyInvoiceScreen(): React.JSX.Element {
  const t = useTranslation();

  const {
    activePeriod,
    todayInvoice, isTodayLoading,
    weekSummary, isWeekLoading,
    monthSummary, isMonthLoading,
    historyInvoices, isHistoryLoading,
    hasNextPage, fetchNextPage,
    isQrUploading, qrUploadSuccess, qrUploadError,
    handlePeriodChange, handleUploadQr,
  } = useDailyInvoiceScreen();

  const hasQr = todayInvoice?.restaurant?.has_payment_qr ?? false;

  const periodLabels: Record<CashoutPeriod, string> = {
    today: t('cashout_period_today'),
    week:  t('cashout_period_week'),
    month: t('cashout_period_month'),
  };

  const qrBtnLabel = isQrUploading
    ? t('cashout_qr_uploading')
    : qrUploadSuccess
      ? t('cashout_qr_saved')
      : hasQr
        ? t('cashout_qr_replace')
        : t('cashout_qr_upload');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{t('cashout_eyebrow')}</Text>
        <Text style={styles.title}>{t('cashout_title')}</Text>
      </View>

      <View style={styles.periodRow}>
        {PERIODS.map((p) => (
          <Pressable
            key={p}
            style={[styles.periodTab, activePeriod === p && styles.periodTabActive]}
            onPress={() => handlePeriodChange(p)}
            accessibilityRole="button"
            accessibilityLabel={periodLabels[p]}
          >
            <Text style={[styles.periodTabText, activePeriod === p && styles.periodTabTextActive]}>
              {periodLabels[p]}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activePeriod === 'today' && (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>{t('cashout_section_today')}</Text>
              <Pressable
                onPress={handleUploadQr}
                disabled={isQrUploading}
                style={[
                  styles.replaceQrBtn,
                  qrUploadSuccess && styles.replaceQrBtnSuccess,
                  isQrUploading && styles.qrBannerBtnDisabled,
                ]}
                accessibilityLabel={t('cashout_qr_upload')}
                accessibilityRole="button"
              >
                <Text style={[styles.replaceQrBtnText, qrUploadSuccess && styles.replaceQrBtnTextSuccess]}>
                  {qrBtnLabel}
                </Text>
              </Pressable>
            </View>

            {qrUploadError !== null && (
              <Text style={styles.uploadError}>{qrUploadError}</Text>
            )}

            {isTodayLoading
              ? <ActivityIndicator color={colours.primary} />
              : todayInvoice != null && <InvoiceCard invoice={todayInvoice} />
            }

            <Text style={[styles.sectionLabel, styles.historySectionLabel]}>{t('cashout_section_history')}</Text>
            {isHistoryLoading
              ? <ActivityIndicator color={colours.primary} />
              : historyInvoices.length === 0
                ? <Text style={styles.emptyText}>{t('cashout_no_invoices')}</Text>
                : historyInvoices.map((inv) => <InvoiceCard key={inv.id ?? inv.date} invoice={inv} />)
            }

            {hasNextPage && (
              <Pressable onPress={fetchNextPage} style={styles.loadMoreBtn} accessibilityRole="button" accessibilityLabel={t('cashout_load_more')}>
                <Text style={styles.loadMoreText}>{t('cashout_load_more')}</Text>
              </Pressable>
            )}
          </>
        )}

        {activePeriod === 'week' && (
          isWeekLoading
            ? <ActivityIndicator color={colours.primary} />
            : weekSummary != null
              ? <SummaryCard summary={weekSummary} t={t} />
              : <Text style={styles.emptyText}>{t('cashout_no_week')}</Text>
        )}

        {activePeriod === 'month' && (
          isMonthLoading
            ? <ActivityIndicator color={colours.primary} />
            : monthSummary != null
              ? <SummaryCard summary={monthSummary} t={t} />
              : <Text style={styles.emptyText}>{t('cashout_no_month')}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

interface SummaryCardProps {
  summary: InvoiceSummary;
  t: TranslateFn;
}

function SummaryCard({ summary, t }: SummaryCardProps): React.JSX.Element {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryDateRange}>
        {formatDate(summary.date_from)} – {formatDate(summary.date_to)}
      </Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{t('cashout_orders')}</Text>
        <Text style={styles.summaryValue}>{summary.order_count}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{t('cashout_customer_total')}</Text>
        <Text style={styles.summaryValue}>{formatPrice(summary.customer_total_cents)}</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{t('cashout_platform_fee')}</Text>
        <Text style={styles.summaryValue}>{formatPrice(summary.platform_fee_cents)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{t('cashout_payout')}</Text>
        <Text style={[styles.summaryValue, styles.summaryValueAccent]}>{formatPrice(summary.payout_cents)}</Text>
      </View>
    </View>
  );
}
