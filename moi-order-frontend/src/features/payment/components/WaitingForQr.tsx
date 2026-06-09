import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { styles } from './WaitingForQr.styles';

interface WaitingForQrProps {
  payableName: string;
  amountFormatted: string;
}

export function WaitingForQr({ payableName, amountFormatted }: WaitingForQrProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={styles.spinner.color} />
      <Text style={styles.title}>Preparing Your QR Code</Text>
      <Text style={styles.subtitle}>
        Our team is generating a personalised PromptPay QR for{'\n'}
        <Text style={styles.bold}>{payableName}</Text>
        {amountFormatted ? ` — ${amountFormatted}` : ''}
      </Text>
      <View style={styles.pill}>
        <View style={styles.dot} />
        <Text style={styles.pillText}>Checking every few seconds…</Text>
      </View>
    </View>
  );
}
