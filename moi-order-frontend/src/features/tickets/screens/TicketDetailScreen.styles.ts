import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundLight },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 },

  // ── Cover image ───────────────────────────────────────────────────────────
  cover: { width: '100%', height: 220, backgroundColor: colours.backgroundDark },

  // ── Back button over image ────────────────────────────────────────────────
  backBtn: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    minHeight: 36,
  },
  backArrow: { fontSize: 22, color: colours.white, lineHeight: 26, fontWeight: '300' },
  backLabel: { fontSize: typography.sm, fontWeight: '600', color: colours.white, letterSpacing: 0.2 },

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
    fontSize: typography.sm,
    color: editorialPalette.gold,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 4 },
  addressText: { fontSize: typography.xs, color: colours.medium },
  mapLink: { fontSize: typography.xs, color: colours.primary, fontWeight: '600' },

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

  // ── Variant row ───────────────────────────────────────────────────────────
  variantCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.medium,
  },
  variantInfo: { flex: 1 },
  variantName: { fontSize: typography.sm, fontWeight: '700', color: colours.textOnLight, marginBottom: 2 },
  variantDesc: { fontSize: typography.xs, color: colours.textMuted, lineHeight: 16 },
  variantPrice: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: editorialPalette.gold,
    marginTop: 4,
  },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: { backgroundColor: colours.medium, opacity: 0.4 },
  qtyBtnText: { color: colours.white, fontSize: 18, fontWeight: '700', lineHeight: 22 },
  qtyValue: { fontSize: typography.md, fontWeight: '800', color: colours.textOnLight, minWidth: 20, textAlign: 'center' },

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
