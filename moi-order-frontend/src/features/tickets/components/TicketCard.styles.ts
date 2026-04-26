import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  cardWrap: {
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colours.card,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: colours.backgroundDark,
  },
  cardBody: {
    padding: spacing.md,
  },
  cardName: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  cardHighlight: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLocation: {
    fontSize: typography.xs,
    color: colours.medium,
  },
  cardPrice: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: editorialPalette.gold,
  },
});
