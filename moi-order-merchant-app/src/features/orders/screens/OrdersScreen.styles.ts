import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundDark },

  // ── Page header ──────────────────────────────────────────────────────────────
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.dividerDark,
  },
  pageTitle: {
    fontSize: typography.display,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.8,
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colours.warning + '22',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colours.warning + '55',
  },
  pendingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colours.warning },
  pendingText: { fontSize: typography.xs, fontWeight: '700', color: colours.warning },

  // ── Filter tabs ───────────────────────────────────────────────────────────────
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colours.dividerDark,
  },
  tab: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.dividerDark,
  },
  tabActive: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  tabText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  tabTextActive: {
    color: colours.backgroundDark,
    fontWeight: '800',
  },

  // ── Date navigator ────────────────────────────────────────────────────────────
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.backgroundMid,
    borderRadius: radius.xl,
    margin: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colours.dividerDark,
  },
  dateArrow: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colours.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colours.dividerDark,
  },
  dateCenter: { flex: 1, alignItems: 'center' },
  dateLabel: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnDark,
    letterSpacing: -0.3,
  },
  dateCount: {
    fontSize: typography.xxs,
    color: 'rgba(255,255,255,0.35)',
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
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  // ── List ─────────────────────────────────────────────────────────────────────
  listBody: { flex: 1 },
  listBodyContent: { paddingBottom: spacing.xxl },
  ordersGroup: {
    backgroundColor: colours.backgroundMid,
    borderRadius: radius.xl,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colours.dividerDark,
  },

  // ── Empty state ───────────────────────────────────────────────────────────────
  emptyWrap: { padding: spacing.xxl, alignItems: 'center', gap: spacing.sm },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colours.dividerDark, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: typography.md, fontWeight: '700', color: colours.textOnDark },
  emptyBody: { fontSize: typography.sm, color: 'rgba(255,255,255,0.35)' },

  // legacy compat
  safe2: { flex: 1, backgroundColor: colours.backgroundDark },
  darkHeader: { backgroundColor: colours.backgroundDark, paddingTop: spacing.md, paddingBottom: spacing.lg, gap: spacing.md },
  darkHeaderTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg },
  darkHeaderTitle: { fontSize: 38, fontWeight: '900', color: colours.textOnDark, letterSpacing: -1.5 },
  darkHeaderSub: { fontSize: typography.xs, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  statusTabsScroll: { paddingHorizontal: spacing.md, gap: spacing.xs },
  statusTab: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, borderRadius: radius.full, borderWidth: 1, borderColor: colours.dividerDark },
  statusTabActive: { backgroundColor: colours.primary, borderColor: colours.primary },
  statusTabText: { fontSize: typography.xs, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  statusTabTextActive: { color: colours.backgroundDark, fontWeight: '800' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dateTodayBtn: { backgroundColor: colours.primary, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full },
  dateTodayText: { fontSize: typography.xxs, fontWeight: '700', color: colours.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: spacing.xl },
  sectionGroup: { backgroundColor: colours.backgroundMid, borderRadius: radius.xl, overflow: 'hidden', marginHorizontal: spacing.md, marginBottom: spacing.sm },
  sectionHeader: { fontSize: typography.xxs, fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.2, paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.xs },
  empty: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: typography.md, marginTop: spacing.xxl },
  filterBar: { backgroundColor: colours.backgroundDark },
  statusTabsRow: { flexDirection: 'row' },
  listHeaderWrap: { paddingHorizontal: spacing.md, paddingTop: spacing.xs, paddingBottom: spacing.sm },
  dateCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colours.backgroundMid, borderRadius: 16, padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colours.dividerDark },
  dateArrowDisabled: { backgroundColor: colours.dividerDark },
  dateLabelWrap: { flex: 1, alignItems: 'center' },
  dateOrderCount: { fontSize: typography.xxs, color: 'rgba(255,255,255,0.3)', marginTop: 2 },
  skeletonWrap: { flexDirection: 'row', backgroundColor: colours.backgroundMid, marginHorizontal: spacing.md, marginBottom: spacing.sm, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colours.dividerDark },
  skeletonStrip: { width: 4 },
});
