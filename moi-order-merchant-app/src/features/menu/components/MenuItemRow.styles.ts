import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    gap: spacing.sm,
  },
  photo: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colours.backgroundLight,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: typography.xs,
    color: colours.textMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    minHeight: 44,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
  },
  deleteButton: {
    width: 32,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: typography.sm,
    color: colours.error,
  },
});
