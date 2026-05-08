import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  // ── Root ──────────────────────────────────────────────────────────────────
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

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    paddingTop: spacing.xxl + spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  logo: {
    width: 264,
    height: 264,
    marginBottom: spacing.md,
  },
  tagline: {
    fontSize: typography.sm,
    color: colours.medium,
    letterSpacing: 0.4,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
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
  },
  otpHint: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  otpRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  otpButton: {
    flex: 1,
    backgroundColor: colours.primary,
    borderRadius: radius.lg,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpButtonSecondary: {
    backgroundColor: colours.infoBg,
  },
  otpButtonDisabled: {
    opacity: 0.6,
  },
  otpButtonText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
  },
  otpButtonTextSecondary: {
    color: colours.primary,
  },

  // ── Step 2 — locked email row ─────────────────────────────────────────────
  emailRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   spacing.md,
  },
  emailDisplay: {
    fontSize:   typography.sm,
    color:      colours.textOnLight,
    fontWeight: '600',
  },
  backBtn: {
    paddingVertical:   spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  backText: {
    fontSize:   typography.sm,
    color:      colours.primary,
    fontWeight: '600',
  },

  // ── Password eye toggle (rightElement passed to FormField) ─────────────────
  eyeBtn: {
    padding: spacing.xs,
  },
  eyeText: {
    fontSize: typography.sm,
    color: colours.tertiary,
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

  // ── Divider ───────────────────────────────────────────────────────────────
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colours.divider,
  },
  dividerText: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginHorizontal: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialButtonSpacing: {
    marginTop: spacing.sm,
  },

  // ── Forgot password ───────────────────────────────────────────────────────
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  forgotText: {
    fontSize: typography.sm,
    color: colours.primary,
    fontWeight: '600',
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
