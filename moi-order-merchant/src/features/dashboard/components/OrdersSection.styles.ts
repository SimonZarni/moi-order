import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  liveIndicator: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
  },
  title: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: colours.textOnLight,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  countBadge: {
    backgroundColor: colours.primaryBg,
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colours.primaryLight,
  },
  countText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.primaryDark,
  },
  filterChip: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colours.divider,
    backgroundColor: colours.surface,
  },
  filterChipActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primaryBg,
  },
  filterChipText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textMuted,
  },
  filterChipTextActive: {
    color: colours.primaryDark,
  },
  list: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
    backgroundColor: colours.surface,
  },
  empty: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: typography.sm,
    color: colours.textSubtle,
  },
});
