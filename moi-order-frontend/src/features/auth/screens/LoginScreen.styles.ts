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
  appTagline: {
    fontSize: typography.sm,
    color: colours.medium,
    marginTop: spacing.xs,
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
