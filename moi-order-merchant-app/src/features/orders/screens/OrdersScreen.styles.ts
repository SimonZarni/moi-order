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
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colours.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  empty: {
    textAlign: 'center',
    color: colours.medium,
    fontSize: typography.md,
    marginTop: spacing.xxl,
  },
  filterBar: {
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    paddingBottom: spacing.sm,
  },
  statusTabsScroll: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  statusTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colours.divider,
    backgroundColor: colours.backgroundLight,
  },
  statusTabActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primaryLight ?? colours.primary + '18',
  },
  statusTabText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textMuted,
  },
  statusTabTextActive: {
    color: colours.primary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  dateArrow: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colours.divider,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.backgroundLight,
  },
  dateLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  dateTodayBtn: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colours.primary,
  },
  dateTodayText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primary,
  },
});
