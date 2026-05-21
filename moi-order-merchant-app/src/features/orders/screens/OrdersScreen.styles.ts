import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 16,
  elevation: 5,
};

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundDark },

  // ── Dark header ──────────────────────────────────────────────────────────────
  darkHeader: {
    backgroundColor: colours.backgroundDark,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  pageTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -1.5,
    paddingHorizontal: spacing.lg,
    lineHeight: 42,
  },
  tabsRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  tab: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.06)',
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

  // ── List body ────────────────────────────────────────────────────────────────
  listBody: { flex: 1, backgroundColor: '#f2f4f3' },
  listBodyContent: { paddingBottom: spacing.xxl },

  listHeaderWrap: { paddingHorizontal: spacing.md, paddingTop: spacing.xs, paddingBottom: spacing.sm },

  // ── Floating date card ───────────────────────────────────────────────────────
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.surface,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow,
  },
  dateArrow: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colours.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateArrowDisabled: { backgroundColor: '#f0f0f0' },
  dateLabelWrap: { flex: 1, alignItems: 'center' },
  dateLabel: { fontSize: typography.md, fontWeight: '800', color: colours.textOnLight, letterSpacing: -0.3 },
  dateOrderCount: { fontSize: typography.xxs, color: colours.textMuted, marginTop: 2 },
  todayBtn: {
    backgroundColor: colours.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  todayBtnText: { fontSize: typography.xxs, fontWeight: '800', color: colours.white },

  // ── Section label ────────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: typography.xxs,
    fontWeight: '800',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },

  // ── Skeleton ─────────────────────────────────────────────────────────────────
  skeletonWrap: {
    flexDirection: 'row',
    backgroundColor: colours.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadow,
  },
  skeletonStrip: { width: 6 },

  // ── Empty state ──────────────────────────────────────────────────────────────
  emptyWrap: { padding: spacing.xxl, alignItems: 'center', gap: spacing.sm },
  emptyIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: colours.primaryGlow, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  emptyTitle: { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight },
  emptyBody: { fontSize: typography.sm, color: colours.textMuted },

  // legacy compat
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: spacing.xl },
  sectionGroup: { backgroundColor: colours.surface, borderRadius: radius.xl, overflow: 'hidden', marginHorizontal: spacing.md, marginBottom: spacing.sm },
  sectionHeader: { fontSize: typography.xxs, fontWeight: '800', color: colours.textMuted, textTransform: 'uppercase', letterSpacing: 1.4, paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.xs },
  empty: { textAlign: 'center', color: colours.medium, fontSize: typography.md, marginTop: spacing.xxl },
  filterBar: { backgroundColor: colours.backgroundDark },
  statusTabsRow: { flexDirection: 'row' },
  statusTabsScroll: { paddingHorizontal: spacing.md, gap: spacing.xs },
  statusTab: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  statusTabActive: { backgroundColor: colours.primary },
  statusTabText: { fontSize: typography.xs, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  statusTabTextActive: { color: colours.backgroundDark, fontWeight: '800' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dateLabel: { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight },
  dateTodayBtn: { backgroundColor: colours.primary, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full },
  dateTodayText: { fontSize: typography.xxs, fontWeight: '700', color: colours.white },
});
