import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.surface },

  // ── Page header ──────────────────────────────────────────────────────────────
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    backgroundColor: colours.surface,
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

  // ── Filter tabs ───────────────────────────────────────────────────────────────
  // tabsWrapper constrains the horizontal ScrollView height on web
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    backgroundColor: colours.surface,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    gap: spacing.xs,
  },
  tab: {
    alignSelf: 'center',
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
  tabText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textMuted,
  },
  tabTextActive: {
    color: colours.backgroundDark,
    fontWeight: '800',
  },

  // ── Date navigator ────────────────────────────────────────────────────────────
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
    borderRadius: radius.xl,
    margin: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  dateArrow: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colours.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colours.divider,
  },
  dateCenter: { flex: 1, alignItems: 'center' },
  dateLabel: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -0.3,
  },
  dateCount: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    marginTop: 1,
  },
  todayBtn: {
    backgroundColor: colours.primary,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginLeft: spacing.xs,
  },
  todayBtnText: { fontSize: typography.xxs, fontWeight: '800', color: colours.backgroundDark },

  // ── Section header ────────────────────────────────────────────────────────────
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  sectionDot: { width: 8, height: 8, borderRadius: 4 },
  sectionLabelText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  // ── List ─────────────────────────────────────────────────────────────────────
  listBody: { flex: 1, backgroundColor: colours.surface },
  listBodyContent: { paddingBottom: spacing.xxl },

  // ── Empty state ───────────────────────────────────────────────────────────────
  emptyWrap: { padding: spacing.xxl, alignItems: 'center', gap: spacing.sm },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colours.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight },
  emptyBody: { fontSize: typography.sm, color: colours.textMuted },

  // ── Skeleton ─────────────────────────────────────────────────────────────────
  skeletonWrap: { flexDirection: 'row', backgroundColor: colours.surfaceMuted, marginHorizontal: spacing.md, marginBottom: spacing.sm, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colours.divider },
  skeletonStrip: { width: 4 },

  // legacy compat
  safe2: { flex: 1, backgroundColor: colours.surface },
  darkHeader: { backgroundColor: colours.surface, paddingTop: spacing.md, paddingBottom: spacing.lg, gap: spacing.md },
  darkHeaderTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg },
  darkHeaderTitle: { fontSize: 38, fontWeight: '900', color: colours.textOnLight, letterSpacing: -1.5 },
  darkHeaderSub: { fontSize: typography.xs, color: colours.textMuted, marginTop: 2 },
  statusTabsScroll: { paddingHorizontal: spacing.md, gap: spacing.xs },
  statusTab: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, borderRadius: radius.full, borderWidth: 1, borderColor: colours.divider },
  statusTabActive: { backgroundColor: colours.primary, borderColor: colours.primary },
  statusTabText: { fontSize: typography.xs, fontWeight: '600', color: colours.textMuted },
  statusTabTextActive: { color: colours.backgroundDark, fontWeight: '800' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dateTodayBtn: { backgroundColor: colours.primary, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full },
  dateTodayText: { fontSize: typography.xxs, fontWeight: '700', color: colours.backgroundDark },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: spacing.xl },
  sectionGroup: { backgroundColor: colours.surfaceMuted, borderRadius: radius.xl, overflow: 'hidden', marginHorizontal: spacing.md, marginBottom: spacing.sm },
  sectionHeader: { fontSize: typography.xxs, fontWeight: '700', color: colours.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.xs },
  empty: { textAlign: 'center', color: colours.textMuted, fontSize: typography.md, marginTop: spacing.xxl },
  filterBar: { backgroundColor: colours.surface },
  statusTabsRow: { flexDirection: 'row' },
  listHeaderWrap: { paddingHorizontal: spacing.md, paddingTop: spacing.xs, paddingBottom: spacing.sm },
  dateCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colours.backgroundLight, borderRadius: 16, padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colours.divider },
  dateArrowDisabled: { backgroundColor: colours.divider },
  dateLabelWrap: { flex: 1, alignItems: 'center' },
  dateOrderCount: { fontSize: typography.xxs, color: colours.textSubtle, marginTop: 2 },
  ordersGroup: { backgroundColor: colours.surfaceMuted, borderRadius: radius.xl, marginHorizontal: spacing.md, marginBottom: spacing.sm, overflow: 'hidden', borderWidth: 1, borderColor: colours.divider },
});
