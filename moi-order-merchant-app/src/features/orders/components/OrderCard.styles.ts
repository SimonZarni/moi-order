import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  customer: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  meta: {
    fontSize: typography.xs,
    color: colours.textMuted,
  },
  items: {
    fontSize: typography.xs,
    color: colours.textMuted,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs / 2,
  },
  total: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  date: {
    fontSize: typography.xxs,
    color: colours.medium,
  },
  actionButton: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
    minHeight: 40,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colours.white,
    fontSize: typography.sm,
    fontWeight: '600',
  },
});
