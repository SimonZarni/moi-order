import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    padding: spacing.md,
    gap: 4,
  },
  cardLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardValue: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.5,
  },
  cardSub: {
    fontSize: typography.xs,
    color: colours.textSubtle,
    fontWeight: '500',
  },
});
