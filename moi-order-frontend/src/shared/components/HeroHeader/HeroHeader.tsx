import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colours } from '@/shared/theme/colours';
import { styles } from './HeroHeader.styles';

interface HeroHeaderProps {
  accentColor: string;   // orb fill + eyebrow text — pass editorialPalette value
  onBack: () => void;
  backLabel: string;
  subtitle?: string;
  hideBack?: boolean;    // true when a StickyBackButton is used instead
  // Standard stacked layout
  eyebrow?: string;
  title?: string;
  // Composition slot — replaces eyebrow+title when provided (e.g. inline single-line title)
  titleNode?: React.ReactNode;
  // Override the container's minHeight when content is shorter than the default 180px
  minHeight?: number;
}

export function HeroHeader({
  accentColor,
  eyebrow,
  title,
  subtitle,
  titleNode,
  onBack,
  backLabel,
  hideBack = false,
  minHeight,
}: HeroHeaderProps): React.JSX.Element {
  return (
    <View style={[styles.container, minHeight != null && { minHeight }]}>
      <View style={[styles.orbLarge, { backgroundColor: accentColor }]} />
      <View style={styles.orbSmall} />

      {hideBack ? (
        <View style={styles.backPlaceholder} />
      ) : (
        <Pressable
          style={styles.backBtn}
          onPress={onBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={20} color={colours.textOnDark} />
        </Pressable>
      )}

      <View style={styles.textBlock}>
        {titleNode != null ? (
          titleNode
        ) : (
          <>
            <Text style={[styles.eyebrow, { color: accentColor }]}>{eyebrow}</Text>
            <Text style={styles.title}>{title}</Text>
          </>
        )}
        {subtitle != null && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}
