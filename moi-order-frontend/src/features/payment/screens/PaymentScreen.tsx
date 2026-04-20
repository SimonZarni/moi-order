import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCodeDisplay } from '@/features/payment/components/QrCodeDisplay';
import { usePaymentScreen } from '@/features/payment/hooks/usePaymentScreen';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { styles } from './PaymentScreen.styles';

export function PaymentScreen(): React.JSX.Element {
  const {
    payment,
    isCreating,
    isPaymentFailed,
    isPaid,
    isQrExpired,
    createError,
    handleBack,
    handleGoToOrders,
    handleRefreshQr,
  } = usePaymentScreen();

  const amountFormatted = formatCurrency((payment?.amount ?? 0) / 100);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={20} color={colours.tertiary} />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Pay with PromptPay</Text>
      </View>

      <View style={styles.body}>
        {isPaid ? (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={64} color={colours.success} />
            <Text style={styles.successTitle}>Payment Successful</Text>
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
          // Error check BEFORE the payment===undefined guard — failed mutation leaves
          // payment as undefined, so the order here matters.
          <View style={styles.failureContainer}>
            <Ionicons name="warning" size={64} color={colours.secondary} />
            <Text style={styles.failureTitle}>Could not load payment</Text>
            <Text style={styles.failureSubtitle}>{createError.message}</Text>
          </View>
        ) : isCreating || payment === undefined ? (
          <>
            <ActivityIndicator color={styles.waitingText.color} size="large" />
            <Text style={styles.loadingText}>Generating QR code…</Text>
          </>
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
              qrImageUrl={payment.qr_image_url ?? ''}
              amountFormatted={amountFormatted}
            />
            <View style={styles.waitingRow}>
              <View style={styles.waitingDot} />
              <Text style={styles.waitingText}>Waiting for payment…</Text>
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
