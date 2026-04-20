import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { styles } from './QrCodeDisplay.styles';

interface QrCodeDisplayProps {
  qrImageUrl: string;
  amountFormatted: string;
  onDownloadQr: () => Promise<void>;
}

export function QrCodeDisplay({ qrImageUrl, amountFormatted, onDownloadQr }: QrCodeDisplayProps): React.JSX.Element {

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
            resizeMode="contain"
            accessibilityLabel="PromptPay QR code"
          />
        ) : (
          <View style={styles.qrPlaceholder} />
        )}
      </View>

      <Text style={styles.hint}>
        Open your banking app and scan{'\n'}this QR code to pay via PromptPay
      </Text>

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
