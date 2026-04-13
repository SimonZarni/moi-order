import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { radius } from '@/shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
  },
  qrWrapper: {
    backgroundColor: colours.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: 240,
    height: 240,
  },
  qrImage: {
    width: 208,
    height: 208,
  },
  qrPlaceholder: {
    width: 208,
    height: 208,
    backgroundColor: colours.inputBg,
    borderRadius: radius.md,
  },
  amountRow: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  amountLabel: {
    color: colours.textMuted,
    fontSize: typography.sm,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  amountValue: {
    color: colours.textOnLight,
    fontSize: typography.xxl,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  hint: {
    color: colours.textMuted,
    fontSize: typography.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
