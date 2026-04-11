import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  // Mirrors PlaceCard.styles.ts shadowWrap exactly so skeleton occupies identical space
  shadowWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colours.backgroundDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 7,
    overflow: 'hidden',
  },
  // Bottom meta strip — category badge + text lines overlaid at bottom like the real card
  metaStrip: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    gap: spacing.xs,
  },
});
