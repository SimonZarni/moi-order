import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 10,
  elevation: 3,
};

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundDark },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl },

  // ── Dark hero ────────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colours.backgroundDark,
  },
  headerTitle: {
    fontSize: typography.hero,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -1.2,
    lineHeight: 40,
  },
  headerSub: { fontSize: typography.xs, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  pendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colours.warning + '20',
    borderWidth: 1,
    borderColor: colours.warning + '55',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    marginTop: 4,
  },
  pendingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colours.warning },
  pendingChipText: { fontSize: typography.xs, fontWeight: '700', color: colours.warning },

  // ── Period selector ──────────────────────────────────────────────────────────
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xs,
    backgroundColor: colours.backgroundDark,
  },
  periodTab: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  periodTabActive: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  periodTabText: { fontSize: typography.xs, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  periodTabTextActive: { color: colours.backgroundDark, fontWeight: '800' },

  // ── Hero metric card ─────────────────────────────────────────────────────────
  heroMetricCard: {
    backgroundColor: colours.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.xs,
    ...shadow,
  },
  heroMetricLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroMetricValue: {
    fontSize: 48,
    fontWeight: '900',
    color: colours.textOnLight,
    letterSpacing: -2,
    lineHeight: 52,
  },
  heroMetricRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  heroMetricItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  heroMetricItemText: { fontSize: typography.sm, color: colours.textMuted, fontWeight: '500' },

  // ── Cards ────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    overflow: 'hidden',
    ...shadow,
  },
  cardHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  cardTitle: { fontSize: typography.sm, fontWeight: '700', color: colours.textOnLight, letterSpacing: -0.2 },

  // ── Revenue rows ─────────────────────────────────────────────────────────────
  periodRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  periodLastRow: { borderBottomWidth: 0 },
  periodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  periodLabel: { fontSize: typography.sm, fontWeight: '600', color: colours.textMuted },
  periodLabelActive: { color: colours.textOnLight, fontWeight: '700' },
  periodRevenue: { fontSize: typography.md, fontWeight: '800', color: colours.textMuted, letterSpacing: -0.3 },
  periodRevenueActive: { color: colours.primary },
  barTrack: {
    height: 6,
    backgroundColor: colours.divider,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colours.divider,
    borderRadius: radius.full,
    minWidth: 4,
  },
  barFillActive: { backgroundColor: colours.primary },
  periodMeta: { fontSize: typography.xs, color: colours.textMuted },

  // ── Summary grid ─────────────────────────────────────────────────────────────
  summaryGrid: { flexDirection: 'row' },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs / 2,
    borderRightWidth: 1,
    borderRightColor: colours.divider,
  },
  summaryItemLast: { borderRightWidth: 0 },
  summaryValue: { fontSize: typography.xxl, fontWeight: '900', color: colours.textOnLight, letterSpacing: -0.5 },
  summaryLabel: { fontSize: typography.xs, color: colours.textMuted, textAlign: 'center', marginTop: 2 },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colours.backgroundLight },
});
