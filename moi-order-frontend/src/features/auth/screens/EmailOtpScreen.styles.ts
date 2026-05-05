import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },
  bottomFill: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colours.backgroundLight,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },

  hero: {
    paddingTop: spacing.xxl + spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  appLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.tertiary,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: 40,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -1,
  },

  card: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  cardTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },

  submitBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.lg,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.white,
    letterSpacing: 0.4,
  },

  resendBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resendBtnDisabled: {
    opacity: 0.5,
  },
  resendText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.primary,
  },
});
