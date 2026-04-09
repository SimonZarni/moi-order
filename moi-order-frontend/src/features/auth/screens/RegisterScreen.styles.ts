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
  keyboardAvoiding: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    paddingTop: spacing.xl + spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  appLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.tertiary,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -1,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
  },

  // ── Banner ────────────────────────────────────────────────────────────────
  banner: {
    backgroundColor: 'rgba(197,0,15,0.08)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  bannerText: {
    fontSize: typography.sm,
    color: colours.danger,
    fontWeight: '500',
  },

  // ── Field ─────────────────────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.secondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colours.inputBorder,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputWrapperError: {
    borderColor: colours.danger,
  },
  input: {
    flex: 1,
    fontSize: typography.md,
    color: colours.textOnLight,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: spacing.xs,
  },
  eyeText: {
    fontSize: typography.sm,
    color: colours.tertiary,
  },
  fieldError: {
    fontSize: typography.xs,
    color: colours.danger,
    marginTop: 4,
    marginLeft: spacing.xs,
  },

  // ── Submit ────────────────────────────────────────────────────────────────
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

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
  footerLink: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.primary,
    marginLeft: 4,
  },
});
