import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCodeDisplay } from '@/features/payment/components/QrCodeDisplay';
import { usePaymentScreen } from '@/features/payment/hooks/usePaymentScreen';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { styles } from './PaymentScreen.styles';

export function PaymentScreen(): React.JSX.Element {
  const {
    payment,
    submission,
    isCreating,
    isPaymentFailed,
    isPaid,
    createError,
    handleBack,
    handleGoToOrders,
  } = usePaymentScreen();

  const amountFormatted = formatCurrency(payment?.amount ?? submission?.price_snapshot ?? 0);
  const serviceName     = submission?.service_type?.name ?? '';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Pay with PromptPay</Text>
        {serviceName !== '' && (
          <Text style={styles.headerSubtitle}>{serviceName}</Text>
        )}
      </View>

      <View style={styles.body}>
        {isPaid ? (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✓</Text>
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
            <Text style={styles.failureIcon}>✕</Text>
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
            <Text style={styles.failureIcon}>⚠</Text>
            <Text style={styles.failureTitle}>Could not load payment</Text>
            <Text style={styles.failureSubtitle}>{createError.message}</Text>
          </View>
        ) : isCreating || payment === undefined ? (
          <>
            <ActivityIndicator color={styles.waitingText.color} size="large" />
            <Text style={styles.loadingText}>Generating QR code…</Text>
          </>
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
