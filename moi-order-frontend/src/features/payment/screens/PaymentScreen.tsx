import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '@/shared/components/BackButton/BackButton';
import { QrCodeDisplay } from '@/features/payment/components/QrCodeDisplay';
import { WaitingForQr } from '@/features/payment/components/WaitingForQr';
import { usePaymentScreen } from '@/features/payment/hooks/usePaymentScreen';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { styles } from './PaymentScreen.styles';

export function PaymentScreen(): React.JSX.Element {
  const {
    payment, payableName, isCreating, isPaymentFailed, isPaid,
    isWaitingForQr, isStripeQr, isQrExpired,
    countdownLabel, secondsLeft,
    createError, hasNotified, isNotifying,
    handleBack, handleGoToOrders, handleRefreshQr,
    handleDownloadQr, handleNotifyPaid,
  } = usePaymentScreen();

  const amountFormatted = formatCurrency((payment?.amount ?? 0) / 100);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <View style={styles.body}>
        {isPaid ? (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={64} color={colours.success} />
            <Text style={styles.successTitle}>Payment Confirmed</Text>
            <Text style={styles.successSubtitle}>
              Your payment has been confirmed.{'\n'}We'll start processing your order shortly.
            </Text>
            <Pressable
              style={styles.btn}
              onPress={handleGoToOrders}
              accessibilityLabel="View my orders"
              accessibilityRole="button"
            >
              <Text style={styles.btnText}>View Orders</Text>
            </Pressable>
          </View>
        ) : isPaymentFailed ? (
          <View style={styles.failureContainer}>
            <Ionicons name="close-circle" size={64} color={colours.danger} />
            <Text style={styles.failureTitle}>Payment Failed</Text>
            <Text style={styles.failureSubtitle}>
              Your payment could not be processed.{'\n'}Please contact support.
            </Text>
            <Pressable
              style={styles.btn}
              onPress={handleGoToOrders}
              accessibilityLabel="View my orders"
              accessibilityRole="button"
            >
              <Text style={styles.btnText}>View Orders</Text>
            </Pressable>
          </View>
        ) : createError !== null ? (
          <View style={styles.failureContainer}>
            <Ionicons name="warning" size={64} color={colours.secondary} />
            <Text style={styles.failureTitle}>Could not load payment</Text>
            <Text style={styles.failureSubtitle}>{createError.message}</Text>
          </View>
        ) : isCreating || payment === undefined ? (
          <>
            <ActivityIndicator color={styles.waitingText.color} size="large" />
            <Text style={styles.loadingText}>Generating payment…</Text>
          </>
        ) : isWaitingForQr ? (
          <WaitingForQr
            payableName={payableName}
            amountFormatted={amountFormatted}
          />
        ) : isQrExpired ? (
          <View style={styles.expiredContainer}>
            <Ionicons name="time-outline" size={64} color={colours.secondary} />
            <Text style={styles.expiredTitle}>QR Code Expired</Text>
            <Text style={styles.expiredSubtitle}>
              This QR code has expired.{'\n'}Tap below to generate a new one.
            </Text>
            <Pressable
              style={styles.refreshBtn}
              onPress={handleRefreshQr}
              accessibilityLabel="Refresh QR code"
              accessibilityRole="button"
            >
              <Text style={styles.refreshBtnText}>Refresh QR</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <QrCodeDisplay
              qrData={payment.qr_data ?? null}
              qrImageUrl={payment.qr_image_url ?? null}
              amountFormatted={amountFormatted}
              countdownLabel={isStripeQr ? countdownLabel : ''}
              secondsLeft={secondsLeft}
              bankName={payment.bank_name ?? null}
              bankAccountNumber={payment.bank_account_number ?? null}
              bankAccountName={payment.bank_account_name ?? null}
              hasNotified={hasNotified}
              isNotifying={isNotifying}
              onDownloadQr={handleDownloadQr}
              onNotifyPaid={handleNotifyPaid}
            />
            <View style={styles.waitingRow}>
              <View style={styles.waitingDot} />
              <Text style={styles.waitingText}>Waiting for confirmation…</Text>
            </View>
            <Pressable
              style={styles.payLaterBtn}
              onPress={handleGoToOrders}
              accessibilityLabel="Pay later from order history"
              accessibilityRole="button"
            >
              <Text style={styles.payLaterBtnText}>Pay Later</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
