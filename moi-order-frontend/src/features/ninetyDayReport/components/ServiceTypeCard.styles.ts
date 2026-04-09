import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colours.primary,
    // Shadow
    shadowColor: colours.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  nameTh: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -0.2,
  },
  nameEn: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.sm,
  },
  priceCurrency: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.primary,
    marginRight: 2,
  },
  priceAmount: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.primary,
    letterSpacing: -0.5,
  },
  chevron: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colours.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  chevronText: {
    fontSize: typography.lg,
    color: colours.primary,
    fontWeight: '300',
  },
});
