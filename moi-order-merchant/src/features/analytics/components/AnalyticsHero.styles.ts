import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.primaryBg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.primaryLight,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: 4,
  },
  eyebrow: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  amount: {
    fontSize: 44,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -1.5,
    lineHeight: 52,
  },
  sub: {
    fontSize: typography.sm,
    color: colours.textMuted,
    fontWeight: '500',
  },
});
