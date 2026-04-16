import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundLight },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.xl + spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
  },
  orbLarge: {
    position: 'absolute', width: 200, height: 200,
    borderRadius: 100, backgroundColor: editorialPalette.gold,
    opacity: 0.07, top: -60, right: -40,
  },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    gap: 4, backgroundColor: 'rgba(0,0,0,0.38)', borderRadius: radius.full,
    paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.sm + 2,
    minHeight: 36, marginBottom: spacing.sm,
  },
  backArrow: { fontSize: 22, color: colours.tertiary, lineHeight: 26, fontWeight: '300' },
  backLabel: { fontSize: typography.sm, fontWeight: '600', color: colours.tertiary, letterSpacing: 0.2 },
  heroEyebrow: {
    fontSize: typography.xxs, fontWeight: '700', color: editorialPalette.gold,
    letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 4,
  },
  heroTitle: {
    fontSize: 26, fontWeight: '900', color: colours.textOnDark,
    letterSpacing: -0.8, lineHeight: 32,
  },
  heroSubtitle: { fontSize: typography.xs, color: colours.medium, marginTop: 5 },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },

  sectionLabelRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.xs, fontWeight: '700', color: colours.textMuted,
    letterSpacing: 2, textTransform: 'uppercase',
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.07)' },

  // ── Date grid ─────────────────────────────────────────────────────────────
  dateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  dateCard: {
    width: '30%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.xl,
    alignItems: 'center',
    backgroundColor: colours.card,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.medium,
  },
  dateCardSelected: {
    borderColor: editorialPalette.gold,
    backgroundColor: `${editorialPalette.gold}12`,
  },
  dateDayLabel: {
    fontSize: typography.xxs, fontWeight: '700', color: colours.textMuted,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2,
  },
  dateDayLabelSelected: { color: editorialPalette.gold },
  dateNumber: { fontSize: typography.xl, fontWeight: '900', color: colours.textOnLight },
  dateNumberSelected: { color: editorialPalette.gold },
  dateMonth: { fontSize: typography.xs, color: colours.medium },
  dateMonthSelected: { color: editorialPalette.gold },
  todayBadge: {
    marginTop: 4, backgroundColor: editorialPalette.gold,
    borderRadius: radius.full, paddingHorizontal: 6, paddingVertical: 2,
  },
  todayText: { fontSize: typography.xxs, fontWeight: '700', color: colours.white },

  // ── Error ─────────────────────────────────────────────────────────────────
  errorBanner: {
    backgroundColor: `${colours.danger}15`,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  errorText: { fontSize: typography.sm, color: colours.danger, fontWeight: '600' },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colours.card,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg + spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)',
    ...shadows.top,
  },
  purchaseBtn: {
    backgroundColor: editorialPalette.gold,
    borderRadius: radius.lg, height: 56,
    alignItems: 'center', justifyContent: 'center',
  },
  purchaseBtnDisabled: { opacity: 0.4 },
  purchaseBtnText: { fontSize: typography.md, fontWeight: '800', color: colours.white, letterSpacing: 0.4 },
});
