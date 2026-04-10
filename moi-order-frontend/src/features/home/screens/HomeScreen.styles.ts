import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.xl + spacing.sm, // 40
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
    minHeight: 180,
  },

  // Decorative background orbs (pure shape, no blur — conveys depth)
  orbLarge: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: radius.orbLarge,
    backgroundColor: colours.tertiary,
    opacity: 0.07,
    top: -70,
    right: -50,
  },
  orbSmall: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: radius.orbSmall,
    backgroundColor: colours.tertiary,
    opacity: 0.05,
    bottom: 12,
    left: -20,
  },

  // Brand row
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  brandDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colours.tertiary,
  },
  brandLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.tertiary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  authBtn: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.ghostBorder,
    backgroundColor: colours.ghostBg,
    minWidth: 44,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authBtnText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textOnDark,
    letterSpacing: 0.4,
  },

  heroTextBlock: {
    marginTop: spacing.xs,
  },
  heroGreeting: {
    fontSize: typography.xs,
    color: colours.medium,
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -0.5,
  },
  heroTitleAccent: {
    color: colours.tertiary,
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -spacing.xl,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: TAB_BAR_CLEARANCE,
    minHeight: 340,
  },

  // Section label with trailing rule
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.07)',
  },

  // ── 2×2 Grid ──────────────────────────────────────────────────────────────
  gridRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  // ── Card base ─────────────────────────────────────────────────────────────
  card: {
    flex: 1,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    borderTopWidth: 2.5,
    borderTopColor: editorialPalette.sage, // default; overridden per variant
    padding: spacing.md,
    minHeight: 148,
    ...shadows.medium,
  },
  cardDimmed: {
    opacity: 0.45,
  },

  // Card accent border variants
  cardAccentSage:  { borderTopColor: editorialPalette.sage },
  cardAccentSlate: { borderTopColor: editorialPalette.slate },
  cardAccentGold:  { borderTopColor: editorialPalette.gold },
  cardAccentTeal:  { borderTopColor: editorialPalette.teal },

  // Card text
  cardTag: {
    fontSize: typography.xxs,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  tagSage:  { color: editorialPalette.sage },
  tagSlate: { color: editorialPalette.slate },
  tagGold:  { color: editorialPalette.gold },
  tagTeal:  { color: editorialPalette.teal },

  cardTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.2,
    lineHeight: 22,
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: typography.xs,
    color: colours.medium,
    lineHeight: 15,
  },

  // Ghost icon — large emoji watermark, bottom-right
  cardIcon: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    fontSize: 46,
    opacity: 0.8,
  },

  // ── Coming-soon pill ──────────────────────────────────────────────────────
  soonPill: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colours.infoBg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingVertical: 2,
    paddingHorizontal: 7,
  },
  soonText: {
    fontSize: 8,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
