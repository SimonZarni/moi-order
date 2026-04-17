import { StyleSheet } from 'react-native';

import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({

  // ── Scaffold ──────────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },
  scroll: {
    flex: 1,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: colours.backgroundDark,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl + spacing.xl,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
    minHeight: 210,
  },
  orbLarge: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colours.tertiary,
    opacity: 0.07,
    top: -60,
    right: -40,
  },
  orbSmall: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colours.tertiary,
    opacity: 0.05,
    bottom: 10,
    left: -20,
  },

  // ── Back button ───────────────────────────────────────────────────────────
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: radius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  backArrow: {
    fontSize: 22,
    color: colours.tertiary,
    fontWeight: '300',
    lineHeight: 24,
  },
  backLabel: {
    fontSize: typography.xs,
    color: colours.textOnDark,
    fontWeight: '500',
  },

  // ── Hero content ─────────────────────────────────────────────────────────
  heroContent: {
    marginTop: spacing.xs,
  },
  eyebrow: {
    fontSize: typography.xxs,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: typography.hero,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  effectiveDateLabel: {
    fontSize: typography.xs,
    color: colours.medium,
    marginTop: spacing.xs,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  emojiWatermark: {
    position: 'absolute',
    bottom: spacing.xxl + spacing.sm,
    right: spacing.lg,
    fontSize: 64,
    opacity: 0.12,
  },

  // ── Sheet body ────────────────────────────────────────────────────────────
  body: {
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -(spacing.xxl),
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingBottom: TAB_BAR_CLEARANCE + spacing.lg,
    minHeight: 600,
  },

  // ── Section cards ─────────────────────────────────────────────────────────
  section: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.light,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionAccentBar: {
    width: 3,
    height: 16,
    borderRadius: radius.sm,
  },
  sectionHeading: {
    fontSize: typography.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    flex: 1,
  },
  sectionBody: {
    fontSize: typography.sm,
    color: colours.textOnLight,
    lineHeight: 22,
    fontWeight: '400',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  footerCompany: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  footerContact: {
    fontSize: typography.xs,
    color: colours.tertiary,
    fontWeight: '500',
    textAlign: 'center',
  },
});
