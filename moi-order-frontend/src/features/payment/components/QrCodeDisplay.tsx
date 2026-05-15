import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

import { colours } from '@/shared/theme/colours';
import { styles } from './QrCodeDisplay.styles';

const HEADER_COLOR = colours.backgroundDark;
const QR_SIZE = 220;
const LOGO_SIZE = 44;

interface QrCodeDisplayProps {
  qrData: string | null;
  qrImageUrl: string | null;
  amountFormatted: string;
  countdownLabel: string;
  secondsLeft: number;
  onDownloadQr: () => Promise<void>;
}

export function QrCodeDisplay({
  qrData,
  qrImageUrl,
  amountFormatted,
  countdownLabel,
  secondsLeft,
  onDownloadQr,
}: QrCodeDisplayProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      {/* ── PromptPay header strip ─────────────────────────────── */}
      <View style={[styles.header, { backgroundColor: HEADER_COLOR }]}>
        <Text style={styles.headerBrand}>PromptPay</Text>
        <Text style={styles.headerApp}>Moi Order</Text>
      </View>

      {/* ── Amount ────────────────────────────────────────────────── */}
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Amount Due</Text>
        <Text style={styles.amountValue}>{amountFormatted}</Text>
      </View>

      {/* ── QR code ───────────────────────────────────────────────── */}
      <View style={styles.qrWrapper}>
        {qrData ? (
          <QRCode
            value={qrData}
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

      {/* ── Scan hint ─────────────────────────────────────────────── */}
      <Text style={styles.hint}>
        Open your banking app and scan{'\n'}this QR code to pay via PromptPay
      </Text>

      {/* ── Countdown ─────────────────────────────────────────────── */}
      {countdownLabel !== '' && (
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

      {/* ── Divider + download ────────────────────────────────────── */}
      {(qrData || qrImageUrl) && (
        <>
          <View style={styles.divider} />
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
