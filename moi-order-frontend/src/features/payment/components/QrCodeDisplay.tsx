import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

import { colours } from '@/shared/theme/colours';
import { styles } from './QrCodeDisplay.styles';

const HEADER_COLOR = colours.backgroundDark;
const QR_SIZE = 220;

interface QrCodeDisplayProps {
  qrData: string | null;
  qrImageUrl: string | null;
  amountFormatted: string;
  /** Stripe-only — pass null to hide countdown entirely. */
  countdownLabel: string;
  secondsLeft: number;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  hasNotified: boolean;
  isNotifying: boolean;
  onDownloadQr: () => Promise<void>;
  onNotifyPaid: () => Promise<void>;
}

export function QrCodeDisplay({
  qrData,
  qrImageUrl,
  amountFormatted,
  countdownLabel,
  secondsLeft,
  bankName,
  bankAccountNumber,
  bankAccountName,
  hasNotified,
  isNotifying,
  onDownloadQr,
  onNotifyPaid,
}: QrCodeDisplayProps): React.JSX.Element {
  const isStripeVariant = qrData !== null;
  const hasBankInfo = bankName || bankAccountNumber || bankAccountName;

  return (
    <View style={styles.card}>
      {/* ── Header strip ──────────────────────────────────────── */}
      <View style={[styles.header, { backgroundColor: HEADER_COLOR }]}>
        <Text style={styles.headerBrand}>PromptPay</Text>
        <Text style={styles.headerApp}>Moi Order</Text>
      </View>

      {/* ── Amount ─────────────────────────────────────────────── */}
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Amount Due</Text>
        <Text style={styles.amountValue}>{amountFormatted}</Text>
      </View>

      {/* ── QR code ────────────────────────────────────────────── */}
      <View style={styles.qrWrapper}>
        {isStripeVariant ? (
          <QRCode
            value={qrData!}
            size={QR_SIZE}
            color={colours.backgroundDark}
            backgroundColor={colours.white}
            quietZone={12}
          />
        ) : qrImageUrl ? (
          <Image
            source={{ uri: qrImageUrl }}
            style={styles.qrImage}
            contentFit="contain"
            cachePolicy="memory"
            accessibilityLabel="PromptPay QR code"
          />
        ) : (
          <View style={styles.qrPlaceholder} />
        )}
      </View>

      {/* ── Scan hint ──────────────────────────────────────────── */}
      <Text style={styles.hint}>
        Open your banking app and scan{'\n'}this QR code to pay via PromptPay
      </Text>

      {/* ── Countdown (Stripe only) ─────────────────────────────── */}
      {isStripeVariant && countdownLabel !== '' && (
        <View style={styles.countdownRow}>
          <Ionicons name="time-outline" size={14} color={
            secondsLeft <= 60 ? colours.danger :
            secondsLeft <= 120 ? colours.warning :
            colours.textMuted
          } />
          <Text style={[
            styles.countdown,
            secondsLeft <= 60 && styles.countdownCritical,
            secondsLeft > 60 && secondsLeft <= 120 && styles.countdownWarning,
          ]}>
            Expires in {countdownLabel}
          </Text>
        </View>
      )}

      {/* ── Bank info (PromptPay image only) ──────────────────────── */}
      {!isStripeVariant && hasBankInfo && (
        <View style={styles.bankInfoSection}>
          {bankName && (
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Bank</Text>
              <Text style={styles.bankValue}>{bankName}</Text>
            </View>
          )}
          {bankAccountNumber && (
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Account No.</Text>
              <Text style={styles.bankValue}>{bankAccountNumber}</Text>
            </View>
          )}
          {bankAccountName && (
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Account Name</Text>
              <Text style={styles.bankValue}>{bankAccountName}</Text>
            </View>
          )}
        </View>
      )}

      {/* ── Divider + actions ────────────────────────────────────── */}
      {(qrData || qrImageUrl) && (
        <>
          <View style={styles.divider} />

          {/* I've paid button (PromptPay image only) */}
          {!isStripeVariant && (
            <Pressable
              style={[styles.notifyBtn, hasNotified && styles.notifyBtnDone]}
              onPress={onNotifyPaid}
              disabled={hasNotified || isNotifying}
              accessibilityLabel={hasNotified ? 'Notification sent' : "I've already paid"}
              accessibilityRole="button"
            >
              {isNotifying ? (
                <ActivityIndicator size="small" color={colours.white} />
              ) : (
                <Text style={styles.notifyBtnText}>
                  {hasNotified ? 'Notification Sent ✓' : "I've Already Paid"}
                </Text>
              )}
            </Pressable>
          )}

          <Pressable
            style={styles.downloadBtn}
            onPress={onDownloadQr}
            accessibilityLabel="Download QR code"
            accessibilityRole="button"
          >
            <Ionicons name="download-outline" size={14} color={colours.textMuted} />
            <Text style={styles.downloadBtnText}>Download QR</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
