import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundDark },
  scroll: { flex: 1, backgroundColor: colours.backgroundLight },
  scrollContent: { paddingBottom: 180 },

  // ── Gallery back button overlay ───────────────────────────────────────────
  coverBackWrap: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.md,
    zIndex: 10,
  },
  errorBackWrap: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.md,
    zIndex: 10,
  },

  // ── Legacy back button styles (kept for reference) ────────────────────────
  backBtn: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    minHeight: 36,
  },
  backArrow: { fontSize: 22, color: colours.tertiary, lineHeight: 26, fontWeight: '300' },
  backLabel: { fontSize: typography.sm, fontWeight: '600', color: colours.tertiary, letterSpacing: 0.2 },

  // ── Info block ────────────────────────────────────────────────────────────
  infoBlock: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  ticketName: {
    fontSize: 24,
    fontWeight: '900',
    color: colours.textOnLight,
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  highlight: {
    fontSize: typography.md,
    color: editorialPalette.gold,
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: spacing.md,
  },
  highlightDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.md,
    color: colours.textMuted,
    lineHeight: 26,
    marginBottom: spacing.sm,
  },
  addressRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs, marginBottom: 4 },
  addressText: { fontSize: typography.xs, color: colours.medium },
  mapLink: { fontSize: typography.xs, color: colours.primary, fontWeight: '600' },
  directionsBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: spacing.xs },
  directionsBtnText: { fontSize: typography.xs, color: colours.primary, fontWeight: '600' },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 4 },
  scheduleText: { fontSize: typography.xs, color: colours.medium },

  // ── Section label ─────────────────────────────────────────────────────────
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.07)' },

  // ── Summary + Pay Now sticky footer ──────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colours.card,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg + spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    ...shadows.top,
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  footerLabel: { fontSize: typography.xs, color: colours.textMuted },
  footerTotal: { fontSize: typography.lg, fontWeight: '900', color: colours.textOnLight, letterSpacing: -0.3 },
  payNowBtn: {
    backgroundColor: editorialPalette.gold,
    borderRadius: radius.lg,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowBtnDisabled: { opacity: 0.4 },
  payNowBtnText: { fontSize: typography.md, fontWeight: '800', color: colours.white, letterSpacing: 0.4 },

  // ── States ────────────────────────────────────────────────────────────────
  stateBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stateIcon:     { fontSize: 36, marginBottom: spacing.sm, opacity: 0.5 },
  stateTitle:    { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight, marginBottom: 4 },
  stateSubtitle: { fontSize: typography.sm, color: colours.textMuted },
  spinner:       { color: colours.tertiary } as unknown as { color: string },
});
