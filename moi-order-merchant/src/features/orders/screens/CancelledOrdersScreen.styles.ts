import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.surface },

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
  pageHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colours.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: typography.display,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.8,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  exportBtnText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.backgroundDark,
  },

  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  presetPill: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.divider,
    backgroundColor: colours.surface,
  },
  presetPillActive: {
    borderColor: colours.error,
    backgroundColor: colours.errorBg,
  },
  presetPillText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textMuted,
  },
  presetPillTextActive: {
    color: colours.error,
    fontWeight: '700',
  },

  rangeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colours.backgroundLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  rangeLabelText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textMuted,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    paddingHorizontal: spacing.md,
    height: 38,
  },
  searchIcon: { marginRight: spacing.xs },
  searchInput: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    paddingVertical: 0,
  },

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
  sectionCount: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    marginLeft: 2,
  },

  listBody: { flex: 1, backgroundColor: colours.surface },
  listBodyContent: { paddingBottom: spacing.xxl },

  emptyWrap: { padding: spacing.xxl, alignItems: 'center', gap: spacing.sm },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colours.errorBg, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight },
  emptyBody: { fontSize: typography.sm, color: colours.textMuted, textAlign: 'center' },

  skeletonWrap: { flexDirection: 'row', backgroundColor: colours.surfaceMuted, marginHorizontal: spacing.md, marginBottom: spacing.sm, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colours.divider },
  skeletonStrip: { width: 4 },
});
