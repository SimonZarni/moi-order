import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colours.infoBorder,
  },
  heading: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  sub: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginTop: -4,
  },
  stars: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  starBtn: {
    padding: 2,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colours.backgroundLight,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: typography.sm,
    color: colours.textOnLight,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: {
    color: colours.textOnDark,
    fontSize: typography.sm,
    fontWeight: '700',
  },
});
