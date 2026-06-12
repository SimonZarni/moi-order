import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.surface },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  backBtnText: {
    fontSize: typography.sm,
    color: colours.primary,
    fontWeight: '600',
  },

  title: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.5,
    lineHeight: 60,
    marginBottom: spacing.md,
  },

  label: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textMuted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sm,
    color: colours.textOnLight,
    minHeight: 44,
  },
  inputError: {
    borderColor: colours.error,
  },
  errorText: {
    fontSize: typography.xs,
    color: colours.error,
    marginTop: spacing.xs,
  },
  hint: {
    fontSize: typography.xs,
    color: colours.textSubtle,
    marginTop: spacing.xs,
  },

  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colours.successBg,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colours.success + '33',
  },
  successText: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.success,
    fontWeight: '500',
  },

  saveBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
  },
});
