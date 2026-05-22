import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.surface },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colours.surface },

  // ── Page header ──────────────────────────────────────────────────────────────
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    backgroundColor: colours.surface,
  },
  eyebrow: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  pageTitle: {
    fontSize: typography.display,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.8,
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colours.warning + '18',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colours.warning + '55',
  },
  pendingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colours.warning },
  pendingText: { fontSize: typography.xs, fontWeight: '700', color: colours.warning },

  // ── Period tabs ───────────────────────────────────────────────────────────────
  tabsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tab: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  tabActive: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  tabText: { fontSize: typography.xs, fontWeight: '600', color: colours.textMuted },
  tabTextActive: { color: colours.backgroundDark, fontWeight: '800' },

  // ── Featured card ─────────────────────────────────────────────────────────────
  featuredCard: {
    backgroundColor: colours.surfaceMuted,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: 4,
    borderWidth: 1,
    borderColor: colours.divider,
    minHeight: 140,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  featuredLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  noDataChip: {
    borderWidth: 1,
    borderColor: colours.primary + '55',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
  },
  noDataChipText: { fontSize: typography.xxs, color: colours.primary, fontWeight: '600' },
  featuredAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -2,
    lineHeight: 54,
  },
  featuredAmountMuted: { color: colours.textSubtle },
  featuredOrders: { fontSize: typography.xs, color: colours.textSubtle },

  // ── Mini stats grid ───────────────────────────────────────────────────────────
  miniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  miniCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 2,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  miniCardActive: {
    borderColor: colours.primary + '55',
    backgroundColor: colours.primaryBg,
  },
  miniLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  miniValue: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: -0.5,
  },
  miniValueActive: { color: colours.primary },
  miniSub: { fontSize: typography.xxs, color: colours.textSubtle, marginTop: 2 },
  miniActiveTag: { fontSize: typography.xxs, color: colours.primary, fontWeight: '600', marginTop: 2 },

  // ── Revenue breakdown card ────────────────────────────────────────────────────
  breakdownCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colours.divider,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  breakdownTitle: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  breakdownMonth: { fontSize: typography.xs, color: colours.textSubtle },
  breakdownRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: 4,
  },
  breakdownRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  breakdownRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  breakdownAmount: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: -0.3,
  },
  breakdownAmountActive: { color: colours.primary },
  breakdownBar: {
    height: 4,
    backgroundColor: colours.divider,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginTop: 4,
  },
  breakdownBarFill: {
    height: '100%',
    backgroundColor: colours.primary,
    borderRadius: radius.full,
  },
  breakdownMeta: { fontSize: typography.xs, color: colours.textSubtle },

  // legacy compat
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerTitle: { fontSize: typography.display, fontWeight: '800', color: colours.textOnLight },
  headerSub: { fontSize: typography.xs, color: colours.textMuted },
  card: { backgroundColor: colours.surface, borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colours.divider },
  cardHeader: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colours.divider },
  cardTitle: { fontSize: typography.sm, fontWeight: '700', color: colours.textOnLight },
  periodRow: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: 8 },
  periodLastRow: { borderBottomWidth: 0 },
  periodHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  periodLabel: { fontSize: typography.sm, fontWeight: '600', color: colours.textMuted },
  periodRevenue: { fontSize: typography.md, fontWeight: '800', color: colours.primary },
  periodMeta: { fontSize: typography.xs, color: colours.textSubtle },
  summaryGrid: { flexDirection: 'row' },
  summaryItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  summaryItemLast: { borderRightWidth: 0 },
  summaryValue: { fontSize: typography.xxl, fontWeight: '900', color: colours.textOnLight },
  summaryLabel: { fontSize: typography.xs, color: colours.textMuted, textAlign: 'center' },
  barTrack: { height: 6, backgroundColor: colours.divider, borderRadius: radius.full, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colours.primary, borderRadius: radius.full },
  barFillActive: { backgroundColor: colours.primary },
  pendingChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colours.warning + '18', borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 6, borderWidth: 1, borderColor: colours.warning + '55' },
  pendingChipText: { fontSize: typography.xs, fontWeight: '700', color: colours.warning },
});
