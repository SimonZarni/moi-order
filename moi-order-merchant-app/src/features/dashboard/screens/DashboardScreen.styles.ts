import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 16,
  elevation: 5,
};

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundDark },
  body: { flex: 1, backgroundColor: '#f2f4f3' },
  bodyContent: { paddingBottom: spacing.xxl },

  // ── Dark header ──────────────────────────────────────────────────────────────
  header: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 64,           // extra space so summary card floats over it
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: { gap: 4 },
  greeting: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  headerDate: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colours.warning + '22',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colours.warning + '55',
    marginTop: 4,
  },
  pendingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colours.warning },
  pendingPillText: { fontSize: typography.xs, fontWeight: '700', color: colours.warning },

  // ── Floating summary card ────────────────────────────────────────────────────
  summaryCard: {
    backgroundColor: colours.surface,
    borderRadius: 20,
    marginHorizontal: spacing.md,
    marginTop: -44,
    ...cardShadow,
    overflow: 'hidden',
  },
  summaryMain: {
    padding: spacing.lg,
    gap: 4,
  },
  summaryLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryRevenue: {
    fontSize: 44,
    fontWeight: '900',
    color: colours.textOnLight,
    letterSpacing: -2,
    lineHeight: 50,
  },
  summaryMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  summaryMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  summaryMetaText: { fontSize: typography.xs, color: colours.textMuted, fontWeight: '500' },
  summaryDivider: { height: 1, backgroundColor: '#f0f0f0' },
  summaryStats: { flexDirection: 'row' },
  summaryMiniItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, gap: 2 },
  summaryStatsDivider: { width: 1, backgroundColor: '#f0f0f0' },
  summaryMiniLabel: { fontSize: typography.xxs, fontWeight: '700', color: colours.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  summaryMiniValue: { fontSize: typography.lg, fontWeight: '800', color: colours.textOnLight, letterSpacing: -0.5 },

  // ── Section header ───────────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  sectionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colours.primary },
  sectionLabel: { fontSize: typography.md, fontWeight: '800', color: colours.textOnLight, letterSpacing: -0.3 },
  sectionCount: { fontSize: typography.xs, color: colours.textMuted, fontWeight: '500' },

  // ── Orders list ──────────────────────────────────────────────────────────────
  ordersList: {
    marginHorizontal: spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
    ...cardShadow,
  },

  // ── Empty state ──────────────────────────────────────────────────────────────
  emptyCard: {
    backgroundColor: colours.surface,
    borderRadius: 20,
    marginHorizontal: spacing.md,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
    ...cardShadow,
  },
  emptyIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colours.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight },
  emptySubtitle: { fontSize: typography.sm, color: colours.textMuted },

  // ── Skeleton ─────────────────────────────────────────────────────────────────
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: colours.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    ...cardShadow,
  },
  skeletonStrip: { width: 6, backgroundColor: '#e5e7eb' },

  // legacy compat
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statCard: { flex: 1, minWidth: 148, backgroundColor: colours.surface, borderRadius: radius.xl, padding: spacing.md },
  statIconBg: { width: 34, height: 34, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: typography.xxl, fontWeight: '900', color: colours.textOnLight },
  statLabel: { fontSize: typography.xs, fontWeight: '700', color: colours.textOnLight },
  statSub: { fontSize: typography.xxs, color: colours.textMuted },
  statIconRow: { flexDirection: 'row', alignItems: 'center' },
  pageHeader: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 64, backgroundColor: colours.backgroundDark },
  pageTitleBlock: { gap: 4 },
  pageTitle: { fontSize: 38, fontWeight: '900', color: colours.textOnDark },
  pageDate: { fontSize: typography.xs, color: 'rgba(255,255,255,0.4)' },
  sectionCard: { backgroundColor: colours.surface, borderRadius: 20, marginHorizontal: spacing.md, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  sectionTitle: { fontSize: typography.md, fontWeight: '800', color: colours.textOnLight },
  pendingBadge: { backgroundColor: colours.primaryBg, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  pendingBadgeText: { fontSize: typography.xxs, color: colours.primary, fontWeight: '700' },
  emptyState: { padding: spacing.xxl, alignItems: 'center', gap: spacing.sm },
  emptyText: { fontSize: typography.sm, color: colours.textMuted },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f4f3' },
  loadingText: { fontSize: typography.sm, color: colours.textMuted },
  pageGreeting: { fontSize: typography.xs, fontWeight: '700', color: colours.primary },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionAccent: { width: 3, height: 18, borderRadius: radius.full, backgroundColor: colours.primary },
  pendingDotLegacy: { width: 6, height: 6, borderRadius: 3, backgroundColor: colours.warning },
});
