import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.surfaceMuted,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  skeletonPad: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  skeletonItem: {
    marginBottom: 0,
  },
  empty: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colours.surface,
    borderWidth: 1,
    borderColor: colours.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  emptyBody: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
  },
});
