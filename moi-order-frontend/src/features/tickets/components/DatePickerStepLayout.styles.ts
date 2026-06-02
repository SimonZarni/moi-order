import { StyleSheet } from 'react-native';

import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

// ─── Colour palette (per design spec) ─────────────────────────────────────────
const P = {
  headerBg:   '#1E3932', // dark forest green
  gold:       '#C4933F', // warm gold  (accent + selected state)
  selectedBg: '#F5EDD8', // warm cream (selected tile background)
  bodyBg:     '#EEF1F4', // light blue-gray body
  tileBg:     '#FFFFFF', // white tile
  textDark:   '#1A2332', // dark navy primary text
  textMuted:  '#8A9BAD', // muted label / subtitle
} as const;

export const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: P.headerBg },
  scroll: { backgroundColor: P.bodyBg },

  // ── Hero (dark green header) ──────────────────────────────────────────────
  hero: {
    backgroundColor: P.headerBg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute', width: 200, height: 200,
    borderRadius: 100, backgroundColor: P.gold,
    opacity: 0.07, top: -60, right: -40,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  eyebrow: {
    fontSize: typography.xxs, fontWeight: '700', color: P.gold,
    letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 4,
  },
  heroTitle: {
    fontSize: 26, fontWeight: '900', color: '#ffffff',
    letterSpacing: -0.8, lineHeight: 32,
  },
  heroSub: {
    fontSize: typography.xs, color: 'rgba(255,255,255,0.48)', marginTop: 5,
  },

  // ── Body ─────────────────────────────────────────────────────────────────
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 120,   // room for the fixed footer
  },

  sectionRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.xxs, fontWeight: '700', color: P.textMuted,
    letterSpacing: 2, textTransform: 'uppercase',
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.07)' },

  // ── Divider between month and day sections ────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.07)',
    marginVertical: spacing.xl,
  },

  // ── Month row (3 equal tiles side by side) ────────────────────────────────
  monthRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  monthTile: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.xl,
    alignItems: 'center',
    backgroundColor: P.tileBg,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Day grid (5-column wrap) ──────────────────────────────────────────────
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },

  tile: {
    width: '18%',
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
    borderRadius: radius.lg,
    alignItems: 'center',
    backgroundColor: P.tileBg,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  // Shared selected state — applied to month tiles and day tiles.
  tileSelected: {
    backgroundColor: P.selectedBg,
    borderColor: P.gold,
  },

  // Selected text — applied to any text inside a selected tile.
  goldText: { color: P.gold },

  // ── Month tile text ───────────────────────────────────────────────────────
  monthNum: {
    fontSize: typography.xxs, fontWeight: '700', color: P.textMuted,
    letterSpacing: 1, marginBottom: 2,
  },
  monthName: {
    fontSize: typography.lg, fontWeight: '800', color: P.textDark,
  },
  monthYear: {
    fontSize: typography.xxs, color: P.textMuted, marginTop: 2,
  },

  // ── Day tile text ─────────────────────────────────────────────────────────
  dayLabel: {
    fontSize: typography.xxs, fontWeight: '700', color: P.textMuted,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2,
  },
  dayNum: {
    fontSize: typography.lg, fontWeight: '900', color: P.textDark,
  },
  dayMonth: {
    fontSize: typography.xs, color: P.textMuted,
  },
  todayBadge: {
    marginTop: 4, backgroundColor: P.gold,
    borderRadius: radius.full, paddingHorizontal: 6, paddingVertical: 2,
  },
  todayText: {
    fontSize: typography.xxs, fontWeight: '700', color: '#ffffff',
  },

  // ── Error banner ──────────────────────────────────────────────────────────
  errorBanner: {
    backgroundColor: 'rgba(220,38,38,0.08)',
    borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg,
  },
  errorText: { fontSize: typography.sm, color: '#dc2626', fontWeight: '600' },

  // ── Purchase footer ───────────────────────────────────────────────────────
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: P.tileBg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg + spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
  },
  purchaseBtn: {
    backgroundColor: P.gold,
    borderRadius: radius.lg, height: 56,
    alignItems: 'center', justifyContent: 'center',
  },
  purchaseBtnDisabled: { opacity: 0.4 },
  purchaseBtnText: {
    fontSize: typography.md, fontWeight: '800', color: '#ffffff', letterSpacing: 0.4,
  },
});
