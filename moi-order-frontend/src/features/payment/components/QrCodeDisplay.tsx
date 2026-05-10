import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { styles } from './QrCodeDisplay.styles';

interface QrCodeDisplayProps {
  qrImageUrl: string;
  amountFormatted: string;
  countdownLabel: string;
  secondsLeft: number;
  onDownloadQr: () => Promise<void>;
}

export function QrCodeDisplay({ qrImageUrl, amountFormatted, countdownLabel, secondsLeft, onDownloadQr }: QrCodeDisplayProps): React.JSX.Element {

  return (
    <View style={styles.container}>
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Amount Due</Text>
        <Text style={styles.amountValue}>{amountFormatted}</Text>
      </View>

      <View style={styles.qrWrapper}>
        {qrImageUrl !== '' ? (
          <Image
            source={{ uri: qrImageUrl }}
            style={styles.qrImage}
            contentFit="contain"
            cachePolicy="memory"
            accessibilityLabel="LINE Pay QR code"
          />
        ) : (
          <View style={styles.qrPlaceholder} />
        )}
      </View>

      <Text style={styles.hint}>
        Open your banking app and scan{'\n'}this QR code to pay via LINE Pay
      </Text>

      {countdownLabel !== '' && (
        <Text style={[
          styles.countdown,
          secondsLeft <= 60  && styles.countdownCritical,
          secondsLeft > 60 && secondsLeft <= 120 && styles.countdownWarning,
        ]}>
          Expires in: {countdownLabel}
        </Text>
      )}

      {qrImageUrl !== '' && (
        <Pressable
          style={styles.downloadBtn}
          onPress={onDownloadQr}
          accessibilityLabel="Download QR code"
          accessibilityRole="button"
        >
          <Ionicons name="download-outline" size={14} color={colours.textMuted} />
          <Text style={styles.downloadBtnText}>Download QR</Text>
        </Pressable>
      )}
    </View>
  );
}
