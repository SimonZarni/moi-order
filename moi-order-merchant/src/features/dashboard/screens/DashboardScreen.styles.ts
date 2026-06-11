import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.surface },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },

  // ── Top bar ──────────────────────────────────────────────────────────────────
  topBar: {
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
  topBarGreeting: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  topBarTitle: {
    fontSize: typography.display,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.8,
  },
  topBarRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  topBarDate: {
    fontSize: typography.xs,
    color: colours.textMuted,
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
  pendingPillActive: {
    backgroundColor: colours.warning + '40',
    borderColor: colours.warning,
  },
  pendingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colours.warning },
  pendingText: { fontSize: typography.xs, fontWeight: '700', color: colours.warning },
  pendingTextActive: { color: colours.warning },

  // ── Revenue card ─────────────────────────────────────────────────────────────
  revenueCard: {
    backgroundColor: colours.surfaceMuted,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colours.divider,
    minHeight: 160,
  },
  revenueLeft: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  revenueLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  revenueAmount: {
    fontSize: 44,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -1.5,
    lineHeight: 50,
  },
  revenueOrders: {
    fontSize: typography.xs,
    color: colours.textSubtle,
    marginTop: 4,
  },
  revenueRight: {
    gap: spacing.md,
    justifyContent: 'center',
    paddingLeft: spacing.lg,
    borderLeftWidth: 1,
    borderLeftColor: colours.divider,
    minWidth: 140,
  },
  revenueMiniBlock: { gap: 2 },
  revenueMiniLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  revenueMiniValue: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colours.primary,
    letterSpacing: -0.5,
  },

  // ── Top Sales / Top Customers section ────────────────────────────────────────
  topSection: {
    gap: spacing.sm,
  },
  topSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  topSectionTitle: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.3,
  },
  // Period tab pills — Today / This Week / This Month
  periodTabs: {
    flexDirection: 'row',
    gap: 4,
  },
  periodTab: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.divider,
    backgroundColor: colours.surface,
  },
  periodTabActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primaryBg,
  },
  periodTabText: {
    fontSize: typography.xxs,
    fontWeight: '600',
    color: colours.textMuted,
  },
  periodTabTextActive: {
    color: colours.primaryDark,
    fontWeight: '700',
  },
  // Two cards row — side by side on desktop, stacked on mobile
  topCardsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  topCardsRowStack: {
    flexDirection: 'column',
  },
  // Individual top card
  topCard: {
    flex: 1,
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
  },
  topCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  topCardIcon: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCardTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  topCardEmpty: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  topCardEmptyText: {
    fontSize: typography.xs,
    color: colours.textSubtle,
  },
  // Row inside the top card
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  topRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  topRank: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colours.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  topRankGold: {
    backgroundColor: '#F59E0B22',
  },
  topRankText: {
    fontSize: 10,
    fontWeight: '800',
    color: colours.textMuted,
  },
  topRankTextGold: {
    color: '#D97706',
  },
  topRowInfo: {
    flex: 1,
    gap: 1,
  },
  topRowName: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  topRowSub: {
    fontSize: typography.xxs,
    color: colours.textSubtle,
  },
  topRowValue: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primary,
    flexShrink: 0,
  },

  // ── Bottom 2-col grid ────────────────────────────────────────────────────────
  bottomGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  bottomLeft: { flex: 1.6 },
  bottomRight: { flex: 1, gap: spacing.md },

  // ── Orders card ───────────────────────────────────────────────────────────────
  ordersCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
  },
  ordersCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  cardSectionTitle: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  viewAllLink: {
    fontSize: typography.xs,
    color: colours.primary,
    fontWeight: '600',
  },
  emptyOrders: {
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: { fontSize: typography.sm, color: colours.textSubtle },

  // ── Stats card ────────────────────────────────────────────────────────────────
  statsCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  statLabel: { fontSize: typography.sm, color: colours.textMuted },
  statValue: { fontSize: typography.sm, fontWeight: '700', color: colours.textOnLight },
  statValueGreen: { color: colours.primary },
  statDivider: { height: 1, backgroundColor: colours.divider },

  // ── Activity card ─────────────────────────────────────────────────────────────
  activityCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
    flexShrink: 0,
  },
  activityInfo: { flex: 1, gap: 2 },
  activityText: { fontSize: typography.xs, color: colours.textOnLight, fontWeight: '500' },
  activityTime: { fontSize: typography.xxs, color: colours.textSubtle },
  activityEmpty: { fontSize: typography.xs, color: colours.textSubtle, paddingVertical: spacing.xs },

  // legacy compat
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statCard: { flex: 1, minWidth: 148, backgroundColor: colours.surfaceMuted, borderRadius: radius.xl, padding: spacing.md },
  statIconBg: { width: 34, height: 34, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  statValueLg: { fontSize: typography.xxl, fontWeight: '900', color: colours.textOnLight },
  statLabelSm: { fontSize: typography.xs, fontWeight: '700', color: colours.textOnLight },
  statSub: { fontSize: typography.xxs, color: colours.textMuted },
  statIconRow: { flexDirection: 'row', alignItems: 'center' },
  pageHeader: { padding: spacing.md },
  pageTitleBlock: { gap: 4 },
  pageTitle: { fontSize: typography.display, fontWeight: '800', color: colours.textOnLight },
  pageDate: { fontSize: typography.xs, color: colours.textMuted },
  sectionCard: { backgroundColor: colours.surfaceMuted, borderRadius: radius.xl, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  sectionTitle: { fontSize: typography.md, fontWeight: '800', color: colours.textOnLight },
  pendingBadge: { backgroundColor: colours.primaryBg, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  pendingBadgeText: { fontSize: typography.xxs, color: colours.primary, fontWeight: '700' },
  emptyState: { padding: spacing.xxl, alignItems: 'center', gap: spacing.sm },
  pendingPillLegacy: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colours.warning + '18', borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 6, borderWidth: 1, borderColor: colours.warning + '55' },
  pendingPillText: { fontSize: typography.xs, fontWeight: '700', color: colours.warning },
  pendingDotLegacy: { width: 7, height: 7, borderRadius: 4, backgroundColor: colours.warning },
  summaryCard: { backgroundColor: colours.surfaceMuted, borderRadius: radius.xl, padding: spacing.lg, flexDirection: 'row', borderWidth: 1, borderColor: colours.divider },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colours.surface },
  loadingText: { fontSize: typography.sm, color: colours.textMuted },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  sectionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colours.primary },
  sectionLabel: { fontSize: typography.md, fontWeight: '800', color: colours.textOnLight },
  sectionCount: { fontSize: typography.xs, color: colours.textMuted },
  ordersList: { backgroundColor: colours.surfaceMuted, borderRadius: radius.xl, overflow: 'hidden' },
  emptyCard: { backgroundColor: colours.surfaceMuted, borderRadius: radius.xl, padding: spacing.xxl, alignItems: 'center', gap: spacing.sm },
  emptyIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: colours.primaryBg, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight },
  emptySubtitle: { fontSize: typography.sm, color: colours.textMuted },
  skeletonCard: { flexDirection: 'row', backgroundColor: colours.surfaceMuted, borderRadius: 16, overflow: 'hidden' },
  skeletonStrip: { width: 6 },
  pageGreeting: { fontSize: typography.xs, fontWeight: '700', color: colours.primary },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionAccent: { width: 3, height: 18, borderRadius: radius.full, backgroundColor: colours.primary },
});
