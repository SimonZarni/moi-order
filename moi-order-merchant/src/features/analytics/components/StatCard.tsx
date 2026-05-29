import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from './StatCard.styles';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  accent: string;
  highlight?: boolean;
}

export function StatCard({ label, value, sub, accent, highlight = false }: StatCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, highlight && styles.cardHighlight, pressed && styles.cardPressed]}
      accessibilityRole="none"
      accessibilityLabel={`${label}: ${value}`}
    >
      <View style={[styles.accentBadge, { backgroundColor: accent + '22', borderColor: accent + '44' }]}>
        <View style={[styles.accentDot, { backgroundColor: accent }]} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: highlight ? accent : undefined }]}>{value}</Text>
      <Text style={styles.sub}>{sub}</Text>
    </Pressable>
  );
}
