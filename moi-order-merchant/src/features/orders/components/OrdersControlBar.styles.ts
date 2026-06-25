import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    paddingBottom: spacing.sm,
  },

  // ── Status tabs ────────────────────────────────────────────────────────────
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: spacing.xs + 1,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.divider,
    backgroundColor: colours.surface,
  },
  tabText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textMuted,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 1,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // ── Date presets + search row ──────────────────────────────────────────────
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  presetRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  presetPill: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.divider,
    backgroundColor: colours.surface,
  },
  presetPillActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primaryBg,
  },
  presetText: {
    fontSize: typography.xxs,
    fontWeight: '600',
    color: colours.textMuted,
  },
  presetTextActive: {
    color: colours.primaryDark,
    fontWeight: '700',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.surfaceMuted,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.divider,
    paddingHorizontal: spacing.sm + 2,
    height: 32,
    gap: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.xs,
    color: colours.textOnLight,
    paddingVertical: 0,
  },

  // ── Date navigator ──────────────────────────────────────────────────────────
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  dateArrow: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateArrowDisabled: {
    opacity: 0.35,
  },
  dateLabel: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
    marginLeft: 2,
    letterSpacing: -0.2,
  },
  dateCount: {
    fontSize: typography.xs,
    color: colours.textMuted,
    flex: 1,
  },
  todayBtn: {
    backgroundColor: colours.primary,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  todayBtnText: {
    fontSize: typography.xxs,
    fontWeight: '800',
    color: '#ffffff',
  },

  // ── Range row ──────────────────────────────────────────────────────────────
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  rangeLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textMuted,
  },
});
