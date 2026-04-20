import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { STATUS_COLOURS } from './OrdersScreen.styles';

export { STATUS_COLOURS };

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },
  scroll: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  scrollContent: {
    paddingBottom: spacing.xxl + spacing.lg,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.xl + spacing.sm,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
  },
  orbLarge: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: radius.orbLarge,
    backgroundColor: editorialPalette.amber,
    opacity: 0.07,
    top: -60,
    right: -40,
  },
  orbSmall: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: radius.orbSmall,
    backgroundColor: colours.tertiary,
    opacity: 0.05,
    bottom: 8,
    left: -16,
  },

  // Back button
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    minHeight: 36,
    marginBottom: spacing.sm,
  },
  backArrow: {
    fontSize: 22,
    color: colours.tertiary,
    lineHeight: 26,
    fontWeight: '300',
  },
  backLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.tertiary,
    letterSpacing: 0.2,
  },

  // Hero text
  heroTextBlock: {
    marginTop: spacing.xs,
  },
  heroEyebrow: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: editorialPalette.amber,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -0.8,
    lineHeight: 32,
  },
  heroDate: {
    fontSize: typography.xs,
    color: colours.medium,
    marginTop: 5,
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  // Section label row
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
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

  // ── Status card ────────────────────────────────────────────────────────────
  statusCard: {
    borderRadius: radius.xl,
    padding: spacing.md + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.card,
    borderTopWidth: 2.5,
    borderTopColor: editorialPalette.amber, // overridden inline per status
    ...shadows.medium,
  },
  statusCardLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  statusCardLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statusCardServiceName: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.2,
    marginBottom: 2,
    lineHeight: 24,
  },
  statusCardDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.07)',
    marginVertical: spacing.sm,
  },
  statusCardValue: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnLight, // overridden inline per status
    letterSpacing: -0.2,
  },
  statusCardPrice: {
    fontSize: typography.xl,
    fontWeight: '900',
    color: editorialPalette.amber, // overridden inline per status
    letterSpacing: -0.5,
  },

  // ── Pay Now ────────────────────────────────────────────────────────────────
  payNowBtn: {
    backgroundColor: editorialPalette.amber,
    borderRadius: radius.lg,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  payNowBtnText: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.white,
    letterSpacing: 0.4,
  },

  // ── Info card ──────────────────────────────────────────────────────────────
  infoCard: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  infoRowDivider: {
    height: 1,
    marginHorizontal: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.07)',
  },
  infoLabel: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
    maxWidth: '60%',
    textAlign: 'right',
  },

  // ── Document row ────────────────────────────────────────────────────────────
  docCard: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    ...shadows.medium,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    gap: spacing.sm,
  },
  docRowDivider: {
    height: 1,
    marginHorizontal: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.07)',
  },
  docIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
  docLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
    flex: 1,
    lineHeight: 22,
  },
  docCheck: {
    fontSize: 12,
    color: colours.success,
    fontWeight: '700',
  },

  // ── States ────────────────────────────────────────────────────────────────
  stateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xxl,
    backgroundColor: colours.backgroundLight,
  },
  stateIcon: { fontSize: 36, marginBottom: spacing.sm, opacity: 0.5 },
  stateTitle: { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight, marginBottom: 4 },
  stateSubtitle: { fontSize: typography.sm, color: colours.textMuted },
  spinner: { color: colours.tertiary } as unknown as { color: string },
});
