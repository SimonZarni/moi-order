import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDailyInvoiceScreen } from '../hooks/useDailyInvoiceScreen';
import { InvoiceCard } from '../components/InvoiceCard';
import { styles } from './DailyInvoiceScreen.styles';
import { colours } from '../../../shared/theme/colours';

export function DailyInvoiceScreen(): React.JSX.Element {
  const {
    todayInvoice, isTodayLoading,
    historyInvoices, isHistoryLoading,
    hasNextPage, fetchNextPage,
    isQrUploading, qrUploadSuccess, qrUploadError,
    handleUploadQr,
  } = useDailyInvoiceScreen();

  const hasQr = todayInvoice?.restaurant?.has_payment_qr ?? false;

  const qrBtnLabel = isQrUploading
    ? 'Uploading…'
    : qrUploadSuccess
      ? '✓ QR Saved'
      : hasQr
        ? 'Replace QR'
        : 'Upload QR';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CASHOUT</Text>
        <Text style={styles.title}>Daily Invoice</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>TODAY</Text>
          <Pressable
            onPress={handleUploadQr}
            disabled={isQrUploading}
            style={[
              styles.replaceQrBtn,
              qrUploadSuccess && styles.replaceQrBtnSuccess,
              isQrUploading && styles.qrBannerBtnDisabled,
            ]}
            accessibilityLabel="Upload or replace payment QR code"
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

        <Text style={[styles.sectionLabel, styles.historySectionLabel]}>HISTORY</Text>
        {isHistoryLoading
          ? <ActivityIndicator color={colours.primary} />
          : historyInvoices.length === 0
            ? <Text style={styles.emptyText}>No past invoices yet.</Text>
            : historyInvoices.map((inv) => <InvoiceCard key={inv.id ?? inv.date} invoice={inv} />)
        }

        {hasNextPage && (
          <Pressable onPress={fetchNextPage} style={styles.loadMoreBtn} accessibilityRole="button" accessibilityLabel="Load more invoices">
            <Text style={styles.loadMoreText}>Load more</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
