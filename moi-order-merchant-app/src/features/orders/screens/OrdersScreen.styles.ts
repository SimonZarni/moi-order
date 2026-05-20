import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
    gap: spacing.sm,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  sectionGroup: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
  },
  sectionHeader: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  empty: {
    textAlign: 'center',
    color: colours.medium,
    fontSize: typography.md,
    marginTop: spacing.xxl,
  },

  // ── Filter bar ─────────────────────────────────────────────────────────────
  filterBar: {
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },

  // Underline-style tabs — industry-standard, replaces pill/chip
  statusTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  statusTabsScroll: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
  },
  statusTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  statusTabActive: {
    borderBottomColor: colours.primary,
  },
  statusTabText: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colours.textMuted,
  },
  statusTabTextActive: {
    color: colours.primary,
    fontWeight: '700',
  },

  // ── Date row ───────────────────────────────────────────────────────────────
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  dateArrow: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.backgroundLight,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  dateLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
    minWidth: 120,
    textAlign: 'center',
  },
  dateTodayBtn: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colours.primaryBg,
    borderWidth: 1,
    borderColor: colours.primary + '40',
  },
  dateTodayText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primaryDark,
  },
});
